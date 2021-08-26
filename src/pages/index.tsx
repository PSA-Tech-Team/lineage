import { Button, Text, Flex, Spacer, Grid, Box } from '@chakra-ui/react';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Hero } from '../components/Hero';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { Footer } from '../components/Footer';
import Splash from '../components/Splash';
import { auth } from '../firebase/config';

const Index = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <Splash />;
  }

  return (
    <Container pt="10vh" bgGradient={`linear(to-l, #6A82FB, #FC5C7D)`}>
      <DarkModeSwitch />
      <Hero />
      <Footer>
        <Text>
          © {new Date().getFullYear()} Philippine Student Association UIUC
        </Text>
      </Footer>
    </Container>
  );
};

export default Index;
