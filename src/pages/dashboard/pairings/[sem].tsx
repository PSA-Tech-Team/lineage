import { Heading } from '@chakra-ui/layout';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { getPairings } from '../../../firebase/pairings';
import { Pairing } from '../../../fixtures/Pairings';
import DashboardWrapper from '../../../components/DashboardWrapper';
import PairingsTable from '../../../components/PairingsTable';
import { useToast } from '@chakra-ui/toast';
import { deletePairing, updatePairing } from '../../../client/pairingsService';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { SearchIcon } from '@chakra-ui/icons';
import { Member } from '../../../fixtures/Members';

const PairingsTablePage = ({ pairings }: { pairings: Pairing[] }) => {
  const [pairingsList, setPairingsList] = useState(pairings);
  const [nameQuery, setNameQuery] = useState<string>('');
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const toast = useToast();
  const { sem } = router.query;

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
    if (!Boolean(semesterAssigned)) {
      toast({
        title: 'Error',
        description: 'Semester assigned cannot be empty. Please refresh.',
        status: 'error',
      });
      return;
    }

    const result = await updatePairing({ ...pairing, semesterAssigned });
    const { success, message, pairing: updatedPairing } = result;

    toast({
      title: success ? 'Success!' : 'Error',
      description: message,
      status: success ? 'success' : 'error',
    });

    const updatedPairings = [...pairings];
    for (const p of updatedPairings) {
      if (p.id === updatedPairing?.id) {
        p.semesterAssigned = updatedPairing.semesterAssigned;
        break;
      }
    }
    setPairingsList(updatedPairings);
  };

  /**
   * Callback when deleting a pairing from table
   * @param pairing pairing to delete
   */
  const removePairing = async (pairing: Pairing) => {
    // Delete pairing from database
    setSubmitting(true);
    const { success, message } = await deletePairing(pairing.id);

    // Display toast
    toast({
      title: success ? 'Success' : 'Error',
      description: message,
      status: success ? 'info' : 'error',
    });

    // Refresh state when successful
    if (success) {
      // // Get ids of member documents to update
      // const [akId, adingId] = [pairing.ak.id, pairing.ading.id];

      // // Update member documents
      // const updatedMembers = [...members];
      // updatedMembers.forEach((member) => {
      //   if (member.id === akId) {
      //     member.adings -= 1;
      //   } else if (member.id === adingId) {
      //     member.aks -= 1;
      //   }
      // });

      // // Update state
      // setMembers(updatedMembers);
      setPairingsList(pairings.filter((p) => p.id !== pairing.id));
    }
    setSubmitting(false);
  };

  const filterPairings = (pairing: Pairing) => {
    const hasMemberName = (member: Member) => {
      const hasName = member.name
        .toLowerCase()
        .includes(nameQuery.toLowerCase());
      const hasYear = member.classOf.includes(nameQuery);

      return hasName || hasYear;
    };

    const hasAk = hasMemberName(pairing.ak);
    const hasAding = hasMemberName(pairing.ading);
    const hasSemester = pairing.semesterAssigned
      ?.toLowerCase()
      .includes(nameQuery.toLowerCase());

    return (
      hasAk || hasAding || (hasSemester === undefined ? true : hasSemester)
    );
  };

  return (
    <DashboardWrapper>
      <Heading mb="3rem" fontWeight="light" fontSize="3xl">
        View pairings / {sem}
      </Heading>
      <InputGroup my={4}>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          placeholder="Search pairings"
          size="md"
          onChange={(e) => setNameQuery(e.target.value)}
        />
      </InputGroup>
      <PairingsTable
        pairings={pairingsList.filter(filterPairings)}
        onChangePairing={onChangePairing}
        removePairing={removePairing}
        loading={isSubmitting}
      />
    </DashboardWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sem = context.query.sem;
  let pairings: Pairing[] = [];
  if (typeof sem === 'string') {
    pairings = await getPairings(sem.replace('%20', ' '));
  }

  return {
    props: {
      pairings,
    },
  };
};

export default PairingsTablePage;
