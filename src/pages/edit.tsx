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
import { getMembers, updateMember } from '../firebase/member';
import { Member } from '../fixtures/Members';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import MembersTable from '../components/MembersTable';

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

  const changeMemberName = async (name: string, member: Member, i: number) => {
    if (name.trim() === member.name.trim()) return;

    await updateMember({ ...member, name });
    toast({
      title: 'Success!',
      description: `"${member.name}" renamed to "${name}"`,
      status: 'success',
    });

    const updated = [...membersList];
    updated[i] = { ...member, name };
    setMembersList(updated);
  };

  return (
    <Box>
      <Flex
        p={4}
        align="center"
        borderColor="white"
        bgColor={isDark ? 'seagreen' : 'turquoise'}
      >
        <Heading as="h1" fontSize="2xl" fontWeight="light">
          <Link href="/">Lineage</Link>
        </Heading>
      </Flex>
      <Grid templateColumns={['100%', '50% 50%']}>
        <Container>
          <Heading variant="h2" m={5} textAlign="center">
            Edit Members
          </Heading>

          <Heading variant="h3" my={5}>
            Add member
          </Heading>
          <MemberForm refresh={refreshMembers} />
        </Container>
        <Container>
          <Heading variant="h2" m={5} textAlign="center">
            Edit Pairings
          </Heading>
        </Container>
      </Grid>

      {/* List of members */}
      <Container minW="80%" centerContent mt={20}>
        <Tabs w="100%">
          <TabList>
            <Tab>Members</Tab>
            <Tab>Pairings</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <MembersTable
                membersList={membersList}
                changeName={changeMemberName}
                loading={loading}
                refresh={refreshMembers}
              />
            </TabPanel>
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
