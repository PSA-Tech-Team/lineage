import { DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
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
import { getPairings } from '../firebase/pairings';
import { Pairing } from '../fixtures/Pairings';

interface PairingsTableProps {
  pairings: Pairing[];
  loading: boolean;
  refresh: () => Promise<Pairing[]>;
}

const PairingsTable = ({ pairings, loading, refresh }: PairingsTableProps) => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  console.log(pairings);
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
              <Td>{pairing.semesterAssigned}</Td>
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
                          {'test'}
                        </Text>
                        <Button
                          isFullWidth
                          colorScheme="red"
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
    </>
  );
};

export default PairingsTable;
