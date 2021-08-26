import { Text, Grid, Box } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Hero from '../components/Hero';
import { Footer } from '../components/Footer';
import LandingPageCard from '../components/LandingPageCard';
import Splash from '../components/Splash';
import { auth } from '../firebase/config';
import { BACKGROUND_GRADIENT } from '../themes/colors';

const Index = () => {
  const [, loading] = useAuthState(auth);

  if (loading) {
    return <Splash />;
  }

  return (
    <Box w="100%" pt="10vh" bgGradient={BACKGROUND_GRADIENT}>
      <Hero />
      <Grid
        bgColor="#F6F7F9"
        w="100%"
        py="4rem"
        px="3rem"
        templateColumns={{ base: '100%', lg: '1fr 1fr' }}
        textAlign="center"
      >
        <LandingPageCard
          title="For visitors"
          description="Explore the AKA families of PSA UIUC through fully interactive family trees."
          href="/lineages"
          buttonText="View lineages"
        />
        <LandingPageCard
          title="For board"
          description="View and change every member and pairing in PSA to prepare for the next AKA season."
          href="/edit"
          buttonText="View dashboard"
        />
      </Grid>
      <Footer>
        <Text textAlign="center">
          © {new Date().getFullYear()} Philippine Student Association UIUC
        </Text>
      </Footer>
    </Box>
  );
};

export default Index;
