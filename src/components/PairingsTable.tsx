import { DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Pairing } from '../fixtures/Pairings';

interface PairingsTableProps {
  pairings: Pairing[];
  onChangePairing: (
    semesterAssigned: string,
    pairing: Pairing
  ) => Promise<void>;
  removePairing: (pairing: Pairing) => Promise<void>;
  loading: boolean;
}

const PairingsTable = ({
  pairings,
  onChangePairing,
  removePairing,
  loading,
}: PairingsTableProps) => {
  return (
    <Table>
      <TableCaption>PSA AKA Pairings</TableCaption>
      <Thead>
        <Tr>
          <Th>AK name</Th>
          <Th>AK class</Th>
          <Th>Ading name</Th>
          <Th>Ading class</Th>
          <Th>Semester assigned</Th>
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {pairings.map((pairing) => (
          <Tr key={pairing.id}>
            <Td>{pairing.ak.name}</Td>
            <Td>{pairing.ak.classOf}</Td>
            <Td>{pairing.ading.name}</Td>
            <Td>{pairing.ading.classOf}</Td>
            <Td>
              <Editable
                isDisabled={loading}
                defaultValue={pairing.semesterAssigned}
                onSubmit={(semesterAssigned) =>
                  onChangePairing(semesterAssigned, pairing)
                }
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
            </Td>
            <Td>
              <HStack>
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
                        Are you sure you want to delete this pairing?
                      </Text>
                      <Button
                        isFullWidth
                        colorScheme="red"
                        disabled={loading}
                        onClick={async () => await removePairing(pairing)}
                      >
                        {loading ? 'Deleting...' : 'Yes, delete'}
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
  );
};

export default PairingsTable;
