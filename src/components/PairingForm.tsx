import {
  Box,
  Button,
  Checkbox,
  Flex,
  Select,
  Spacer,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { addPairing } from '../client/pairingsService';
import { Member } from '../fixtures/Members';
import { Pairing } from '../fixtures/Pairings';
import { SEMESTERS } from '../fixtures/Semesters';
import SearchModal from './SearchModal';

interface PairingFormProps {
  members: Member[];
  pairings: Pairing[];
  setMembers: Dispatch<SetStateAction<Member[]>>;
  setPairings: Dispatch<SetStateAction<Pairing[]>>;
}

/**
 * Form to create new AKA pairings between PSA members
 */
const PairingForm = ({
  members,
  pairings,
  setMembers,
  setPairings,
}: PairingFormProps) => {
  const [ak, setAk] = useState<Member | undefined>();
  const [ading, setAding] = useState<Member | undefined>();
  const [semester, setSemester] = useState<string>('');
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [keepAk, setKeepAk] = useState<boolean>(false);
  const [keepAding, setKeepAding] = useState<boolean>(false);
  const toast = useToast();

  /**
   * Returns member of given id in members list
   * @param memberId id of member
   */
  const findMember = (memberId: string) => {
    return members.find((member) => member.id === memberId);
  };

  /**
   * Callback when submitting a pairing through form
   */
  const submitPairing = async () => {
    // Notify user if member is missing
    if (!ak || !ading) {
      toast({
        title: 'Error',
        description: 'Please select both an AK and an ading.',
        status: 'error',
      });
      return;
    }

    // Notify user if semester is missing
    if (!Boolean(semester)) {
      toast({
        title: 'Error',
        description: 'Please select a semester for this pairing.',
        status: 'error',
      });
      return;
    }

    setSubmitting(true);

    // Create pairing in database
    const { success, message, pairing } = await addPairing(
      ak.id,
      ading.id,
      semester
    );

    toast({
      title: success ? 'Success!' : 'Error',
      description: success ? 'Successfully added pairing.' : message,
      status: success ? 'success' : 'error',
    });

    setSubmitting(false);

    // TODO: reflect changes in state after adding pairing
    if (success && pairing !== undefined) {
      // Clear form only if specified
      if (!keepAk) setAk(undefined);
      if (!keepAding) setAding(undefined);

      // Add pairing to list
      setPairings([ ...pairings, pairing ]);

      // Change fields of Members
      const { ak: updatedAk, ading: updatedAding } = pairing;
      const akIndex = members.findIndex((m) => m.id === updatedAk.id);
      const adingIndex = members.findIndex((m) => m.id === updatedAding.id);

      const updatedMembers = [ ...members ];
      updatedMembers[akIndex].adings = updatedAk.adings;
      updatedMembers[adingIndex].aks = updatedAding.aks;
      setMembers(updatedMembers);
    }
  };

  return (
    <Box>
      {/* AK selection */}
      <Flex my={4} alignItems="center">
        <Box>
          <Text mb={2}>
            Select AK: <b>{ak?.name}</b>
          </Text>
          <Checkbox onChange={() => setKeepAk(!keepAk)}>
            Keep AK after submission
          </Checkbox>
        </Box>
        <Spacer />
        <SearchModal
          members={members}
          onSelect={(id) => setAk(findMember(id))}
          buttonColorScheme={Boolean(ak) ? 'teal' : undefined}
        />
      </Flex>

      {/* Ading selection */}
      <Flex my={6} alignItems="center">
        <Box>
          <Text mb={2}>
            Select ading: <b>{ading?.name}</b>
          </Text>
          <Checkbox onChange={() => setKeepAding(!keepAding)}>
            Keep ading after submission
          </Checkbox>
        </Box>
        <Spacer />
        <SearchModal
          members={members}
          onSelect={(id) => setAding(findMember(id))}
          buttonColorScheme={Boolean(ading) ? 'teal' : undefined}
        />
      </Flex>

      {/* Semester selection */}
      <Select
        my={2}
        maxW="60%"
        placeholder="Select semester assigned"
        onChange={(e) => setSemester(e.currentTarget.value)}
      >
        {SEMESTERS.map((sem) => (
          <option key={sem} value={sem}>
            {sem}
          </option>
        ))}
      </Select>

      {/* Submit */}
      <Flex>
        <Button
          mt={2}
          colorScheme="teal"
          onClick={submitPairing}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating pairing...' : 'Create pairing'}
        </Button>
      </Flex>
    </Box>
  );
};

export default PairingForm;
