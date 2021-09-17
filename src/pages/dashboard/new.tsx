import { Container, Grid, Heading } from '@chakra-ui/layout';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import { useState } from 'react';
import DashboardWrapper from '../../components/DashboardWrapper';
import MemberForm from '../../components/MemberForm';
import PairingForm from '../../components/PairingForm';
import { getAllMembers } from '../../firebase/member';
import { getAllPairings } from '../../firebase/pairings';
import { Member } from '../../fixtures/Members';
import { Pairing } from '../../fixtures/Pairings';

interface CreateEntryPageProps {
  members: Member[];
  pairings: Pairing[];
}

const CreateEntryPage = ({ members, pairings }: CreateEntryPageProps) => {
  const [membersList, setMembersList] = useState<Member[]>(members);
  const [pairingsList, setPairingsList] = useState<Pairing[]>(pairings);

  return (
    <DashboardWrapper>
      <Grid templateColumns={['100%', '50% 50%']}>
        {/* Member column */}
        <Container>
          <Heading variant="h3" my={5}>
            Add member
          </Heading>
          <MemberForm members={membersList} setMembers={setMembersList} />
        </Container>

        {/* Pairing column */}
        <Container>
          <Heading variant="h3" my={5}>
            Add pairing
          </Heading>
          <PairingForm
            members={membersList}
            pairings={pairingsList}
            setMembers={setMembersList}
            setPairings={setPairingsList}
          />
        </Container>
      </Grid>
      <Alert status="warning" mt="2rem">
        <AlertIcon />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Currently, this page will "forget" the members and pairings that you
          add when you leave the page. (Your changes are still saved in the
          database). This is true for the lineages page as well. However, the
          member/pairing individual pages (per year/semester) will be constantly
          up-to-date. This inconvenience is due to a technical difficulty that
          is being worked on. If you need to leave the page and would like it to
          be updated, please message or email Renzo Ledesma
          (renzol2@illinois.edu).
        </AlertDescription>
      </Alert>
    </DashboardWrapper>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // FIXME: use server side authentication to prevent unnecessary reads
  // https://dev.to/theranbrig/server-side-authentication-with-nextjs-and-firebase-354m
  const members: Member[] = await getAllMembers();
  const pairings: Pairing[] = await getAllPairings();

  return {
    props: {
      members,
      pairings,
    },
    revalidate: 10,
  };
};

export default CreateEntryPage;
