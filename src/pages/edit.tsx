import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Container,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import MemberForm from '../components/MemberForm';
import { getMembers } from '../firebase/member';
import { Member } from '../fixtures/Members';

interface EditPageProps {
  members: Member[];
}

const EditPage = ({ members }: EditPageProps) => {
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <Container>
      <Heading variant="h1" m={5} textAlign="center">
        Edit Lineage
      </Heading>

      <Heading variant="h2" my={5}>
        Add member
      </Heading>
      <MemberForm refresh={refreshMembers} />

      {/* List of members */}
      <Flex mt={20} mb={5} alignItems="center">
        <Heading variant="h2">View members</Heading>

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
            {membersList.map((member) => (
              <Tr key={member.id}>
                <Td>{member.name}</Td>
                <Td>{member.classOf}</Td>
                <Td>{member.hasAdings ? <CheckIcon /> : <CloseIcon />}</Td>
                <Td>{member.hasAks ? <CheckIcon /> : <CloseIcon />}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Container>
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
