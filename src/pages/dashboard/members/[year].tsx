import { Heading } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { deleteMember, updateMember } from '../../../client/membersService';
import DashboardWrapper from '../../../components/DashboardWrapper';
import MembersTable from '../../../components/MembersTable';
import { getMembers } from '../../../firebase/member';
import { Member } from '../../../fixtures/Members';

const MembersTablePage = ({ members }: { members: Member[] }) => {
  const [membersList, setMembersList] = useState(members);
  const router = useRouter();
  const toast = useToast();
  const { year } = router.query;

  /**
   * Callback to update member's data in state and database
   * @param updated member with new data
   * @param i index of member in state
   */
  const changeMember = async (updated: Member, i: number) => {
    // If no change is present, skip
    const original = membersList[i];
    if (updated.name === original.name && updated.classOf === original.classOf)
      return;

    // Check schema
    if (!Boolean(updated.name) || updated.classOf.length !== 4) {
      toast({
        title: 'Error',
        status: 'error',
        description:
          'Name must be non-empty. Class must be exactly 4 digits long. Please refresh.',
      });
      return;
    }

    // Update member in database
    const { success, message, member } = await updateMember(updated);

    // Send toast
    toast({
      title: success ? 'Success!' : 'Error',
      status: success ? 'success' : 'error',
      description: message,
    });

    if (success) {
      // Update member in state
      const updatedMembers = [...membersList];
      updatedMembers[i] = member!;
      setMembersList(updatedMembers);

      // Update affected pairings
      // const updatedPairings = [...pairingsList];
      // updatedPairings.forEach((p) => {
      //   if (p.ak.id === updated.id) {
      //     p.ak = member!;
      //   } else if (p.ading.id === updated.id) {
      //     p.ading = member!;
      //   }
      // });
      // setPairingsList(updatedPairings);
    }
  };

  /**
   * Callback to delete member from database and state
   * @param member member to delete
   */
  const removeMember = async (member: Member) => {
    if (!member.id) return;

    // Delete member from database
    const response = await deleteMember(member.id);

    if (response.success) {
      toast({
        title: 'Deletion complete',
        status: 'info',
        description: `${member.name} has been deleted.`,
      });
    } else {
      toast({
        title: 'Error',
        status: 'error',
        description: response.message,
      });
    }

    // Get member documents to update
    const memberIdsToDecrementAks: string[] = [];
    const memberIdsToDecrementAdings: string[] = [];
    // const filteredPairings = pairingsList.filter((p) => {
    //   if (p.ak.id === member.id) {
    //     memberIdsToDecrementAks.push(p.ading.id);
    //     return false;
    //   } else if (p.ading.id === member.id) {
    //     memberIdsToDecrementAdings.push(p.ak.id);
    //     return false;
    //   }
    //   return true;
    // });

    const convertMemberIdToIndex = (id: string) =>
      membersList.findIndex((m) => m.id === id);
    const memberIndexesToDecrementAks = memberIdsToDecrementAks.map(
      convertMemberIdToIndex
    );
    const memberIndexesToDecrementAdings = memberIdsToDecrementAdings.map(
      convertMemberIdToIndex
    );

    // Update member documents
    const updatedMembers = [...membersList];
    for (const index of memberIndexesToDecrementAks) {
      updatedMembers[index].aks -= 1;
    }
    for (const index of memberIndexesToDecrementAdings) {
      updatedMembers[index].adings -= 1;
    }

    // Set state to updated documents
    setMembersList(updatedMembers.filter(({ id }) => id !== member.id));
    // setPairingsList(filteredPairings);
  };

  return (
    <DashboardWrapper>
      <Heading mb="3rem" fontWeight="light" fontSize="3xl">
        View members / {year}
      </Heading>
      <MembersTable
        membersList={membersList}
        changeMember={changeMember}
        removeMember={removeMember}
      />
    </DashboardWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const year = context.query.year;
  let members: Member[] = [];
  if (typeof year === 'string') {
    members = await getMembers(year);
  }

  return {
    props: {
      members,
    },
  };
};

export default MembersTablePage;
