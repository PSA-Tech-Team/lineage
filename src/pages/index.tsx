import { Text } from '@chakra-ui/react';
import { Hero } from '../components/Hero';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { Footer } from '../components/Footer';

const Index = () => (
  <Container height="100vh">
    <Hero />
    <Main>
      <Text textAlign="center">
        A visualizer for AKA (Ate, Kuya, Ading) families.
      </Text>

      <Text textAlign="center" fontWeight="bold">
        Coming soon
      </Text>
    </Main>

    <DarkModeSwitch />
    <Footer>
      <Text>
        © {new Date().getFullYear()} Philippine Student Association UIUC
      </Text>
    </Footer>
  </Container>
);

export default Index;
