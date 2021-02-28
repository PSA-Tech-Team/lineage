import {
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { signInWithGoogle, signOut } from '../firebase/config';
import { auth } from '../firebase/config';

const Login = () => {
  return (
    <Container height="100vh" py="5%">
      <Heading variant="h1">Log in to Lineage</Heading>
      <Divider my="10px" />
      <Text my="10px">Current user: {auth.currentUser?.email}</Text>
      <VStack spacing={2}>
        <Button isFullWidth onClick={async () => await signInWithGoogle()}>
          Log in with Google
        </Button>
        <Button isFullWidth onClick={async () => await signOut()}>
          Log out
        </Button>
        <Button isFullWidth onClick={() => {
          console.log(auth.currentUser)
        }}>
          Print user
        </Button>
      </VStack>
    </Container>
  );
};

export default Login;
