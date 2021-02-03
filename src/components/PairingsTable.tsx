import { Button, Flex, Heading, Spacer, Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { getPairings } from '../firebase/pairings';
import { Pairing } from '../fixtures/Pairings';

interface PairingsTableProps {
  pairings: Pairing[];
}

const PairingsTable = ({ pairings }: PairingsTableProps) => {
  console.log(pairings);
  return (
    <>
      <Flex my={5} alignItems="center" minW="100%">
        <Heading variant="h3">View pairings</Heading>

        <Spacer />

        {/* Refresh */}
        <Button onClick={getPairings} my={5}>
          Log pairings
        </Button>
      </Flex>

      <Table>
        <TableCaption>
          PSA AKA Pairings
        </TableCaption>
        <Thead>
          <Tr>
            <Th>AK name</Th>
            <Th>AK class</Th>
            <Th>Ading name</Th>
            <Th>Ading class</Th>
            <Th>Semester assigned</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pairings.map(pairing => (
            <Tr key={pairing.id}>
              <Td>{pairing.ak.name}</Td>
              <Td>{pairing.ak.classOf}</Td>
              <Td>{pairing.ading.name}</Td>
              <Td>{pairing.ading.classOf}</Td>
              <Td>{pairing.semesterAssigned}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default PairingsTable;
