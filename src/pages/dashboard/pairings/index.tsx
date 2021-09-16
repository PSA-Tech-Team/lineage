import { Grid, Heading } from '@chakra-ui/layout';
import DashboardCard from '../../../components/DashboardCard';
import DashboardWrapper from '../../../components/DashboardWrapper';
import { SEMESTERS, YEARS } from '../../../fixtures/Semesters';

const NAVIGATION = SEMESTERS.map((sem) => ({
  title: `Class of ${sem}`,
  description: `View members from class of ${sem}`,
  href: `/dashboard/pairings/${encodeURIComponent(sem)}`,
}));

const PairingsViewPage = () => {
  return (
    <DashboardWrapper>
      <Heading mb="3rem" fontWeight="light" fontSize="3xl">
        View pairings
      </Heading>
      <Grid templateColumns={{ base: '100%', md: 'repeat(3, 1fr)' }} gap={6}>
        {NAVIGATION.map(({ title, description, href }) => (
          <DashboardCard
            key={href}
            title={title}
            description={description}
            href={href}
          />
        ))}
      </Grid>
    </DashboardWrapper>
  );
};

export default PairingsViewPage;
