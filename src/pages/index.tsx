import { Text, Grid } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Hero } from '../components/Hero';
import { Container } from '../components/Container';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { Footer } from '../components/Footer';
import Splash from '../components/Splash';
import { auth } from '../firebase/config';
import LandingPageCard from '../components/LandingPageCard';

const Index = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <Splash />;
  }

  return (
    <Container pt="10vh" bgGradient={`linear(to-l, #6A82FB, #FC5C7D)`}>
      <DarkModeSwitch />
      <Hero />
      <Grid
        bgColor="#F6F7F9"
        w="100%"
        py="4rem"
        templateColumns="1fr 1fr"
        textAlign="center"
      >
        <LandingPageCard title="For visitors" />
        <LandingPageCard title="For board" />
      </Grid>
      <Footer>
        <Text>
          © {new Date().getFullYear()} Philippine Student Association UIUC
        </Text>
      </Footer>
    </Container>
  );
};

export default Index;
