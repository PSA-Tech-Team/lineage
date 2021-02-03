import { DeleteIcon } from '@chakra-ui/icons';
import {
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
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { deletePairing, updatePairing } from '../firebase/pairings';
import { Pairing } from '../fixtures/Pairings';

interface PairingsTableProps {
  pairings: Pairing[];
  loading: boolean;
  refresh: () => Promise<Pairing[]>;
}

const PairingsTable = ({ pairings, loading, refresh }: PairingsTableProps) => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const toast = useToast();

  /**
   * Callback when changing the semester assigned field of a pairing
   * @param semesterAssigned new semester assigned
   * @param pairing pairing to update
   */
  const onChangePairing = async (
    semesterAssigned: string,
    pairing: Pairing
  ) => {
    if (semesterAssigned === pairing.semesterAssigned) return;

    await updatePairing({ ...pairing, semesterAssigned });
    await refresh();

    toast({
      title: 'Success!',
      description: 'Pairing successfully updated',
      status: 'success',
    });
  };

  return (
    <>
      <Flex my={5} alignItems="center" minW="100%">
        <Heading variant="h3">View pairings</Heading>

        <Spacer />

        {/* Loading */}
        {loading && <Spinner mr={3} />}

        {/* Refresh */}
        <Button onClick={refresh} my={5} disabled={loading}>
          Refresh
        </Button>
      </Flex>

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
                        <Text mb={5}>Are you sure you want to delete this pairing?</Text>
                        <Button
                          isFullWidth
                          colorScheme="red"
                          disabled={isSubmitting}
                          onClick={async () => {
                            setSubmitting(true);
                            await deletePairing(pairing.id);
                            setSubmitting(false);
                            await refresh();
                          }}
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
    </>
  );
};

export default PairingsTable;
