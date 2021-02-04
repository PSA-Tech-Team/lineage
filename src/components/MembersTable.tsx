import { DeleteIcon, LinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Spinner,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Member } from '../fixtures/Members';

interface MembersTableProps {
  refresh: () => Promise<Member[]>;
  loading: boolean;
  membersList: Member[];
  changeMember: (member: Member, i: number) => Promise<void>;
  removeMember: (member: Member, i: number) => Promise<void>;
}

/**
 * Table to display PSA members
 */
const MembersTable = ({
  refresh,
  loading,
  membersList,
  changeMember,
  removeMember,
}: MembersTableProps) => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  return (
    <>
      <Flex my={5} alignItems="center" minW="100%">
        <Heading variant="h3">View members</Heading>

        <Spacer />

        {/* Loading */}
        {loading && <Spinner mr={3} />}

        {/* Refresh */}
        <Button onClick={refresh} my={5} disabled={loading}>
          Refresh
        </Button>
      </Flex>

      {/* No members notice */}
      {membersList.length === 0 && (
        <Box
          backgroundColor="darkred"
          color="whitesmoke"
          p={25}
          borderRadius={20}
        >
          No members. Add some above!
        </Box>
      )}

      {Boolean(membersList.length) && (
        <Table maxW="100vw" overflowX="scroll">
          <TableCaption>PSA Members</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Class of</Th>
              <Th># of adings</Th>
              <Th># of aks</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {membersList.map((member, i) => (
              <Tr key={member.id}>
                <Td>
                  {/* Name (editable) column */}
                  <Editable
                    defaultValue={member.name}
                    onSubmit={(name) => changeMember({ ...member, name }, i)}
                  >
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                </Td>

                {/* Class (editable) column */}
                <Td>
                  <Editable
                    defaultValue={member.classOf}
                    onSubmit={(classOf) =>
                      changeMember({ ...member, classOf }, i)
                    }
                  >
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                </Td>

                {/* Has Adings/Aks column */}
                <Td>{member.adings}</Td>
                <Td>{member.aks}</Td>

                {/* Actions */}
                <Td>
                  <HStack>
                    <Button size="xs" colorScheme="teal">
                      <LinkIcon />
                    </Button>
                    <Popover>
                      <PopoverTrigger>
                        <Button size="xs" colorScheme="red">
                          <DeleteIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverCloseButton />
                        <PopoverArrow />
                        <PopoverHeader>
                          <Heading size="sm">Confirm deletion</Heading>
                        </PopoverHeader>
                        <PopoverBody>
                          <Text mb={5}>
                            {`Are you sure you want to delete "${member.name}"?
                            This will delete all pairings with ${member.name} as well.`}
                          </Text>
                          <Button
                            isFullWidth
                            colorScheme="red"
                            onClick={async () => {
                              setSubmitting(true);
                              await removeMember(member, i);
                              setSubmitting(false);
                            }}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Deleting...' : 'Yes, delete'}
                          </Button>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
};

export default MembersTable;
