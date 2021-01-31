import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Container,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Grid,
  Heading,
  Spacer,
  Spinner,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import MemberForm from '../components/MemberForm';
import { getMembers, updateMember } from '../firebase/member';
import { Member } from '../fixtures/Members';

interface EditPageProps {
  members: Member[];
}

const EditPage = ({ members }: EditPageProps) => {
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

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
    <Grid templateColumns={['100%', '50% 50%']}>
      <Container>
        <Heading variant="h2" m={5} textAlign="center">
          Edit Members
        </Heading>

        <Heading variant="h3" my={5}>
          Add member
        </Heading>
        <MemberForm refresh={refreshMembers} />

        {/* List of members */}
        <Flex mt={20} mb={5} alignItems="center">
          <Heading variant="h3">View members</Heading>

          <Spacer />

          {/* Refresh */}
          <Button onClick={refreshMembers} my={5}>
            Refresh members
          </Button>
        </Flex>

        {loading && (
          <Flex flexDir="column">
            <Spinner mx="auto" />
          </Flex>
        )}
        {!loading && membersList.length > 0 && (
          <Table>
            <TableCaption>PSA Members</TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Class of</Th>
                <Th>Has Adings?</Th>
                <Th>Has AKs?</Th>
              </Tr>
            </Thead>
            <Tbody>
              {membersList.map((member, i) => (
                <Tr key={member.id}>
                  <Td>
                    <Editable
                      defaultValue={member.name}
                      onSubmit={(name) => changeMemberName(name, member, i)}
                    >
                      <EditablePreview />
                      <EditableInput />
                    </Editable>
                  </Td>
                  <Td>{member.classOf}</Td>
                  <Td>{member.hasAdings ? <CheckIcon /> : <CloseIcon />}</Td>
                  <Td>{member.hasAks ? <CheckIcon /> : <CloseIcon />}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Container>
      <Container>
        <Heading variant="h2" m={5} textAlign="center">
          Edit Pairings
        </Heading>
      </Container>
    </Grid>
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
