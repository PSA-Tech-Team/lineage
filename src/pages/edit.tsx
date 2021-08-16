import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import MemberForm from '../components/MemberForm';
import { getMembers } from '../firebase/member';
import { Member } from '../fixtures/Members';
import MembersTable from '../components/MembersTable';
import PairingForm from '../components/PairingForm';
import PairingsTable from '../components/PairingsTable';
import { Pairing } from '../fixtures/Pairings';
import { getPairings } from '../firebase/pairings';
import { GetStaticProps } from 'next';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import Splash from '../components/Splash';
import { useRouter } from 'next/router';
import { isBoardMember, isEditor } from '../fixtures/Editors';
import { deleteMember } from '../client/membersService';

interface EditPageProps {
  members: Member[];
  pairings: Pairing[];
}

/**
 * Page to view and edit the PSA member database
 */
const EditPage = ({ members, pairings }: EditPageProps) => {
  const router = useRouter();
  const [user, userLoading] = useAuthState(auth);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [pairingsList, setPairingsList] = useState<Pairing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPairs, setLoadingPairs] = useState<boolean>(false);
  const [navDisabled, setNavDisabled] = useState<boolean>(false);
  const toast = useToast();

  // Load members and pairings lists from props upon render
  useEffect(() => {
    setMembersList(members);
    setPairingsList(pairings);
  }, []);

  // FIXME: temporary, this client side redirect should be handled on server side
  useEffect(() => {
    if (userLoading) return;
    if (user === null) {
      router.push('/login');
      return;
    }

    // Checks if PSA board member or is allowed to edit
    const isValidEmail = isEditor(user.email) || isBoardMember(user.email);
    const isValidUser = user !== null && isValidEmail;

    if (!isValidUser) {
      router.push('/login');
    }
  }, [user, userLoading]);

  /**
   * Refresh the members list from database
   */
  const refreshMembers = async () => {
    setLoading(true);

    const fetchedMembers = await (await fetch(`/api/members`)).json();

    setMembersList(fetchedMembers);
    setLoading(false);
    return fetchedMembers;
  };

  /**
   * Refresh the pairings list from database
   */
  const refreshPairings = async () => {
    setLoadingPairs(true);

    const fetchedPairings = await (await fetch(`/api/pairings`)).json();

    setPairingsList(fetchedPairings);
    setLoadingPairs(false);
    return fetchedPairings;
  };

  /**
   * Refresh both members and pairings tables
   */
  const refreshTables = async () => {
    await refreshMembers();
    await refreshPairings();
  };

  /**
   * Callback to update member's data in state and database
   * @param updated member with new data
   * @param i index of member in state
   */
  const changeMember = async (updated: Member, i: number) => {
    // If no change is present, skip
    const original = membersList[i];
    if (updated.name === original.name && updated.classOf === original.classOf)
      return;

    // Check schema
    if (!Boolean(updated.name) || updated.classOf.length !== 4) {
      toast({
        title: 'Error',
        status: 'error',
        description:
          'Name must be non-empty. Class must be exactly 4 digits long',
      });
      return;
    }

    // Update member in database
    await fetch(`/api/members`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updated),
    });

    // Send toast
    toast({
      title: 'Success!',
      status: 'success',
      description: `"${updated.name}" successfully updated`,
    });

    // Refresh to reflect changes
    await refreshTables();
  };

  /**
   * Callback to delete member from database and state
   * @param member member to delete
   */
  const removeMember = async (member: Member) => {
    if (!member.id) return;

    // Delete member from database
    const response = await deleteMember(member.id);

    if (response.success) {
      toast({
        title: 'Deletion complete',
        status: 'info',
        description: `${member.name} has been deleted.`,
      });
    } else {
      toast({
        title: 'Error',
        status: 'error',
        description: response.message,
      });
    }

    // Get member documents to update
    const memberIdsToDecrementAks: string[] = [];
    const memberIdsToDecrementAdings: string[] = [];
    const filteredPairings = pairingsList.filter((p) => {
      if (p.ak.id === member.id) {
        memberIdsToDecrementAks.push(p.ading.id);
        return false;
      } else if (p.ading.id === member.id) {
        memberIdsToDecrementAdings.push(p.ak.id);
        return false;
      }
      return true;
    });

    const convertMemberIdToIndex = (id: string) =>
      membersList.findIndex((m) => m.id === id);
    const memberIndexesToDecrementAks = memberIdsToDecrementAks.map(
      convertMemberIdToIndex
    );
    const memberIndexesToDecrementAdings = memberIdsToDecrementAdings.map(
      convertMemberIdToIndex
    );

    // Update member documents
    const updatedMembers = [...membersList];
    for (const index of memberIndexesToDecrementAks) {
      updatedMembers[index].aks -= 1;
    }
    for (const index of memberIndexesToDecrementAdings) {
      updatedMembers[index].adings -= 1;
    }

    // Set state to updated documents
    setMembersList(updatedMembers.filter(({ id }) => id !== member.id));
    setPairingsList(filteredPairings);
  };

  if (userLoading || user === null) {
    return <Splash />;
  }

  return (
    <Box>
      <Flex p={4} align="center" borderColor="white">
        <Heading as="h1" fontSize="2xl" fontWeight="light">
          <Link href="/">Lineage</Link>
        </Heading>
        <Spacer />
        <Button
          colorScheme="teal"
          disabled={navDisabled}
          onClick={() => setNavDisabled(true)}
        >
          <Link href="/lineages">
            {navDisabled ? 'Loading...' : 'View lineages'}
          </Link>
        </Button>
      </Flex>
      <Grid templateColumns={['100%', '50% 50%']}>
        {/* Member column */}
        <Container>
          <Heading variant="h3" my={5}>
            Add member
          </Heading>
          <MemberForm members={membersList} setMembers={setMembersList} />
        </Container>

        {/* Pairing column */}
        <Container>
          <Heading variant="h3" my={5}>
            Add pairing
          </Heading>
          <PairingForm
            members={membersList}
            pairings={pairingsList}
            setMembers={setMembersList}
            setPairings={setPairingsList}
          />
        </Container>
      </Grid>

      {/* Table info for members/pairings */}
      <Container minW="90%" centerContent mt={20}>
        <Tabs w="100%">
          <TabList>
            <Tab>Members</Tab>
            <Tab>Pairings</Tab>
          </TabList>

          <TabPanels>
            {/* Members tab */}
            <TabPanel>
              <MembersTable
                membersList={membersList}
                changeMember={changeMember}
                loading={loading}
                refresh={refreshMembers}
                removeMember={removeMember}
              />
            </TabPanel>

            {/* Pairings tab */}
            <TabPanel>
              <PairingsTable
                pairings={pairingsList}
                loading={loadingPairs}
                refresh={refreshTables}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // FIXME: use server side authentication to prevent unnecessary reads
  // https://dev.to/theranbrig/server-side-authentication-with-nextjs-and-firebase-354m
  const members: Member[] = await getMembers();
  const pairings: Pairing[] = await getPairings();

  return {
    props: {
      members,
      pairings,
    },
    // TODO: learn more about incremental static regeneration .. but hopefully this helps
    // https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration
    revalidate: 5, // in seconds
  };
};

export default EditPage;
