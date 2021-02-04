import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Spacer,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { addPairing } from '../firebase/pairings';
import { Member } from '../fixtures/Members';
import SearchModal from './SearchModal';

interface PairingFormProps {
  members: Member[];
  refresh: () => Promise<void>;
}

/**
 * Form to create new AKA pairings between PSA members
 */
const PairingForm = ({ members, refresh }: PairingFormProps) => {
  const [ak, setAk] = useState<Member | undefined>();
  const [ading, setAding] = useState<Member | undefined>();
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
    if (!ak || !ading) {
      toast({
        title: 'Error',
        description: 'Please select both an AK and an ading.',
        status: 'error',
      });
      return;
    }

    setSubmitting(true);
    // TODO: allow to set semester
    await addPairing(ak?.id, ading?.id, '2020');

    setSubmitting(false);
    toast({
      title: 'Success!',
      description: 'Successfully added pairing.',
      status: 'success',
    });

    // Clear form only if specified
    if (!keepAk) setAk(undefined);
    if (!keepAding) setAding(undefined);

    // Refresh the members + pairings list to reflect changes
    await refresh();
  };

  return (
    <Box>
      <Flex my={4} alignItems="center">
        <Box>
          <Text mb={2}>Select AK: <b>{ak?.name}</b></Text>
          <Checkbox onChange={() => setKeepAk(!keepAk)}>Keep AK after submission</Checkbox>
        </Box>
        <Spacer />
        <SearchModal
          members={members}
          onSelect={(id) => setAk(findMember(id))}
        />
      </Flex>


      <Flex my={6} alignItems="center">
        <Box>
          <Text mb={2}>Select ading: <b>{ading?.name}</b></Text>
          <Checkbox onChange={() => setKeepAding(!keepAding)}>Keep ading after submission</Checkbox>
        </Box>
        <Spacer />
        <SearchModal
          members={members}
          onSelect={(id) => setAding(findMember(id))}
        />
      </Flex>

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
