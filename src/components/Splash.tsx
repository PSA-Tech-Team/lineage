import { Container, Heading } from '@chakra-ui/react';

const Splash = () => {
  return (
    <Container
      h="100vh"
      w="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Heading as="h1" fontSize="7vw" fontWeight="black">
        Lineage
      </Heading>
    </Container>
  );
};

export default Splash;
