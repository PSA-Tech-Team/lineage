import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
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
} from '@chakra-ui/react';
import { Member } from '../fixtures/Members';

interface MembersTableProps {
  refresh: () => Promise<Member[]>;
  loading: boolean;
  membersList: Member[];
  changeName: (name: string, member: Member, i: number) => Promise<void>;
}

const MembersTable = ({
  refresh,
  loading,
  membersList,
  changeName,
}: MembersTableProps) => {
  return (
    <>
      <Flex my={5} alignItems="center" minW="100%">
        <Heading variant="h3">View members</Heading>

        <Spacer />

        {/* Refresh */}
        <Button onClick={refresh} my={5}>
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
                    onSubmit={(name) => changeName(name, member, i)}
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
    </>
  );
};

export default MembersTable;
