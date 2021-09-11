import { Grid, Heading } from '@chakra-ui/layout';
import useAuth from '../../hooks/useAuth';
import DashboardCard from '../../components/DashboardCard';
import DashboardWrapper from '../../components/DashboardWrapper';

const NAVIGATION = [
  {
    title: 'Create new member/pairing',
    description: 'Add new entry to database',
    href: '/dashboard',
  },
  {
    title: 'View members',
    description: 'View all registered PSA members by class',
    href: '/dashboard/members',
  },
  {
    title: 'View pairings',
    description: 'View all registered AKA pairings by semester',
    href: '/dashboard',
  },
  {
    title: 'View lineages',
    description: 'Browse through AKA family trees',
    href: '/dashboard',
  },
  {
    title: 'View issues',
    description: 'View pending administrative changes to be made',
    href: '/dashboard',
  },
];

const DashboardPage = () => {
  const { user } = useAuth();

  const userFirstName: string = user?.displayName.split(' ')[0];
  return (
    <DashboardWrapper>
      <Heading mb="3rem">
        <span style={{ fontWeight: 'lighter' }}>Hello,</span> {userFirstName}
      </Heading>
      <Grid templateColumns={{ base: '100%', md: 'repeat(3, 1fr)' }} gap={6}>
        {NAVIGATION.map(({ title, description, href }) => (
          <DashboardCard title={title} description={description} href={href} />
        ))}
      </Grid>
    </DashboardWrapper>
  );
};

export default DashboardPage;
