import Link from 'next/link';
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import MemberForm from '../components/MemberForm';
import { deleteMember, getMembers, updateMember } from '../firebase/member';
import { Member } from '../fixtures/Members';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import MembersTable from '../components/MembersTable';
import PairingForm from '../components/PairingForm';
import PairingsTable from '../components/PairingsTable';
import { Pairing } from '../fixtures/Pairings';
import { getPairings } from '../firebase/pairings';

interface EditPageProps {
  members: Member[];
  pairings: Pairing[];
}

const EditPage = ({ members, pairings }: EditPageProps) => {
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [pairingsList, setPairingsList] = useState<Pairing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPairs, setLoadingPairs] = useState<boolean>(false);
  const toast = useToast();
  const { colorMode } = useColorMode();

  useEffect(() => {
    setMembersList(members);
    setPairingsList(pairings);
  }, []);

  const refreshMembers = async () => {
    setLoading(true);

    const fetchedMembers = await getMembers();

    setMembersList(fetchedMembers);
    setLoading(false);
    return fetchedMembers;
  };

  const refreshPairings = async () => {
    setLoadingPairs(true);

    const fetchedPairings = await getPairings();

    setPairingsList(fetchedPairings);
    setLoadingPairs(false);
    return fetchedPairings;
  };

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
    await updateMember(updated);

    // Send toast
    toast({
      title: 'Success!',
      status: 'success',
      description: `"${updated.name}" successfully updated`,
    });

    // Update member in state
    const updatedList = [...membersList];
    updatedList[i] = updated;
    setMembersList(updatedList);
  };

  const removeMember = async (member: Member, i: number) => {
    if (!member.id) return;

    // Delete member from database
    await deleteMember(member.id);

    toast({
      title: 'Deletion complete',
      status: 'info',
      description: `${member.name} has been deleted.`,
    });

    // Remove member from state
    const updatedList = [...membersList];
    updatedList.splice(i, 1);
    setMembersList(updatedList);
  };

  return (
    <Box>
      <Flex p={4} align="center" borderColor="white">
        <Heading as="h1" fontSize="2xl" fontWeight="light">
          <Link href="/">Lineage</Link>
        </Heading>
      </Flex>
      <Grid templateColumns={['100%', '50% 50%']}>
        {/* Member column */}
        <Container>
          <Heading variant="h3" my={5}>
            Add member
          </Heading>
          <MemberForm refresh={refreshMembers} />
        </Container>

        {/* Pairing column */}
        <Container>
          <Heading variant="h3" my={5}>
            Add pairing
          </Heading>
          <PairingForm
            members={membersList}
            refreshMembers={refreshMembers}
            refreshPairings={refreshPairings}
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
                refresh={refreshPairings}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      <DarkModeSwitch />
    </Box>
  );
};

export async function getStaticProps() {
  const members: Member[] = await getMembers();
  const pairings: Pairing[] = await getPairings();

  return {
    props: {
      members,
      pairings,
    },
  };
}

export default EditPage;
