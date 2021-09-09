import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Spacer,
  StackDivider,
  VStack,
} from '@chakra-ui/layout';
import { useBreakpointValue } from '@chakra-ui/media-query';
import GradientButton from '../components/GradientButton';
import StyledLink from '../components/StyledLink';
import useAuth from '../hooks/useAuth';
import { BACKGROUND_GRADIENT, BACKGROUND_GREY } from '../themes/colors';
import Splash from '../components/Splash';
import Link from 'next/link';
import DashboardCard from '../components/DashboardCard';

const NAVIGATION = [
  {
    title: 'Create new member/pairing',
    description: 'Add new entry to database',
    href: '/dashboard',
  },
  {
    title: 'View members',
    description: 'View all registered PSA members by class',
    href: '/dashboard',
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
  const { user, loadSplash } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (loadSplash) {
    return <Splash />;
  }

  const userFirstName: string = user.displayName.split(' ')[0];
  return (
    <Box w="100%" minH="100vh">
      <Grid
        templateColumns={{
          base: '100%',
          md: '25% 75%',
          lg: '20% 80%',
          xl: '15% 85%',
        }}
      >
        <Box borderRight="1px" borderColor="lightgray" p="1rem">
          <Heading
            as="h1"
            bgGradient={BACKGROUND_GRADIENT}
            bgClip="text"
            fontWeight="black"
            fontSize="3xl"
            pb="1"
          >
            <Link href="/">Lineage</Link>
          </Heading>
          {!isMobile && (
            <aside>
              <GradientButton
                my="1.2rem"
                w="60%"
                leftIcon={<AddIcon fontSize="small" />}
                borderRadius="12px"
                boxShadow="md"
              >
                New
              </GradientButton>
              <VStack
                ml="1"
                align="stretch"
                spacing="2"
                divider={<StackDivider borderColor="gray.200" w="75%" />}
              >
                {/* TODO: turn these into linked boxes */}
                <StyledLink href="">Home</StyledLink>
                <StyledLink href="">Members</StyledLink>
                <StyledLink href="">Pairings</StyledLink>
              </VStack>
            </aside>
          )}
        </Box>
        <Box bgColor={BACKGROUND_GREY} minH="100vh" py="1rem" px="2rem">
          {!isMobile && (
            <Flex as="nav" direction="row" alignItems="center" my="0.5rem">
              <Spacer />
              <StyledLink href="/lineages">View</StyledLink>
              <Link href="/login">
                <GradientButton ml="1rem">{userFirstName}</GradientButton>
              </Link>
            </Flex>
          )}
          <Heading mb="3rem">
            <span style={{ fontWeight: 'lighter' }}>Hello,</span>{' '}
            {userFirstName}
          </Heading>
          <Grid
            templateColumns={{ base: '100%', md: 'repeat(3, 1fr)' }}
            gap={6}
          >
            {NAVIGATION.map(({ title, description, href }) => (
              <DashboardCard
                title={title}
                description={description}
                href={href}
              />
            ))}
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
