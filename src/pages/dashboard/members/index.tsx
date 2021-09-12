import { Grid, Heading } from '@chakra-ui/layout';
import DashboardCard from '../../../components/DashboardCard';
import DashboardWrapper from '../../../components/DashboardWrapper';
import { YEARS } from '../../../fixtures/Semesters';

const NAVIGATION = YEARS.map((year) => ({
  title: `Class of ${year}`,
  description: `View members from class of ${year}`,
  href: `/dashboard/members/${year}`,
}));

const MembersViewPage = () => {
  return (
    <DashboardWrapper>
      <Heading mb="3rem" fontWeight="light" fontSize="3xl">
        View members
      </Heading>
      <Grid templateColumns={{ base: '100%', md: 'repeat(3, 1fr)' }} gap={6}>
        {NAVIGATION.map(({ title, description, href }) => (
          <DashboardCard title={title} description={description} href={href} />
        ))}
      </Grid>
    </DashboardWrapper>
  );
};

export default MembersViewPage;
