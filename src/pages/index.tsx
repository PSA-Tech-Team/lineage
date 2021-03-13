import { Button, Text, Flex, Spacer } from '@chakra-ui/react';
import { Hero } from '../components/Hero';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { Footer } from '../components/Footer';
import Splash from '../components/Splash';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';

const Index = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <Splash />;
  }

  return (
    <Container height="100vh">
      <Hero />
      <Main>
        <Text textAlign="center">
          A visualizer for AKA (Ate, Kuya, Ading) families.
        </Text>

        <Flex w="100%">
          <Link href="/lineages">
            <Button w="40%" colorScheme="teal">
              View lineages
            </Button>
          </Link>
          <Spacer />
          <Link href="/login">
            <Button w="40%">{Boolean(user) ? user.email : 'Log in'}</Button>
          </Link>
        </Flex>
      </Main>

      <DarkModeSwitch />
      <Footer>
        <Text>
          © {new Date().getFullYear()} Philippine Student Association UIUC
        </Text>
      </Footer>
    </Container>
  );
};

export default Index;
