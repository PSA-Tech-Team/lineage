import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { signInWithGoogle, signOut } from '../firebase/config';
import { auth } from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import Splash from '../components/Splash';

const Login = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <Splash />;
  }

  return (
    <Box>
      <Flex p={4} align="center" borderColor="white">
        <Heading as="h1" fontSize="2xl" fontWeight="light">
          <Link href="/">Lineage</Link>
        </Heading>
      </Flex>
      <Container>
        <Heading variant="h2" fontWeight="medium">
          Log in to Lineage
        </Heading>
        <Divider my={3} />
        <Alert status="info" my={6}>
          <AlertIcon />
          <AlertTitle>Alert!</AlertTitle>
          <AlertDescription>
            Only PSA UIUC board officers can edit AKA pairings
          </AlertDescription>
        </Alert>
        <Text my="10px">Current user: {user?.email}</Text>
        <VStack spacing={2}>
          <Button
            isFullWidth
            disabled={Boolean(user)}
            onClick={async () => await signInWithGoogle()}
          >
            Log in with Google
          </Button>
          <Button
            isFullWidth
            disabled={!Boolean(user)}
            onClick={async () => await signOut()}
          >
            Log out
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;
