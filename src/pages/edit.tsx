import { Container, Heading } from '@chakra-ui/react';
import MemberForm from '../components/MemberForm';

const Edit = () => {
  return (
    <Container>
      <Heading variant="h1" m={5} textAlign="center">
        Edit Lineage
      </Heading>

      <Heading variant="h2" my={5}>
        Add member
      </Heading>
      <MemberForm />
    </Container>
  );
};

export default Edit;
