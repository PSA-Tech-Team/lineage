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
import SearchModal from '../components/SearchModal';
import PairingForm from '../components/PairingForm';

interface EditPageProps {
  members: Member[];
}

const EditPage = ({ members }: EditPageProps) => {
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  useEffect(() => {
    setMembersList(members);
  }, []);

  const refreshMembers = async () => {
    setLoading(true);

    const fetchedMembers = await getMembers();

    setMembersList(fetchedMembers);
    setLoading(false);
    return fetchedMembers;
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
          <PairingForm members={membersList} />
        </Container>
      </Grid>

      {/* Table info for members/pairings */}
      <Container minW="80%" centerContent mt={20}>
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
            <TabPanel>Pairings!</TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      <DarkModeSwitch />
    </Box>
  );
};

export async function getStaticProps() {
  const members: Member[] = await getMembers();

  return {
    props: {
      members,
    },
  };
}

export default EditPage;
