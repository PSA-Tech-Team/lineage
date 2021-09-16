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
import GradientButton from './GradientButton';
import StyledLink from './StyledLink';
import useAuth from '../hooks/useAuth';
import { BACKGROUND_GRADIENT, BACKGROUND_GREY } from '../themes/colors';
import Link from 'next/link';
import { Skeleton } from '@chakra-ui/skeleton';
import router from 'next/router';

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, loadSplash } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const userFirstName: string = user?.displayName.split(' ')[0];

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
            <Link href="/dashboard">Lineage</Link>
          </Heading>
          {!isMobile && (
            <Skeleton isLoaded={!loadSplash}>
              <aside>
                <GradientButton
                  my="1.2rem"
                  w="60%"
                  leftIcon={<AddIcon fontSize="small" />}
                  borderRadius="12px"
                  boxShadow="md"
                  onClick={() => router.push('/dashboard/new')}
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
                  <StyledLink href="/dashboard">Home</StyledLink>
                  <StyledLink href="/dashboard/members">Members</StyledLink>
                  <StyledLink href="/dashboard/pairings">Pairings</StyledLink>
                </VStack>
              </aside>
            </Skeleton>
          )}
        </Box>
        <Box bgColor={BACKGROUND_GREY} minH="100vh" py="1rem" px="2rem">
          {!isMobile && (
            <Skeleton isLoaded={!loadSplash}>
              <Flex as="nav" direction="row" alignItems="center" my="0.5rem">
                <Spacer />
                <StyledLink href="/lineages">View</StyledLink>
                <Link href="/login">
                  <GradientButton ml="1rem">{userFirstName}</GradientButton>
                </Link>
              </Flex>
            </Skeleton>
          )}
          <Skeleton isLoaded={!loadSplash}>{children}</Skeleton>
        </Box>
      </Grid>
    </Box>
  );
};

export default DashboardWrapper;
