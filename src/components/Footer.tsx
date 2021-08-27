import { Box, Center, Container, Grid, Heading, Text } from '@chakra-ui/react';
import FooterLink from './FooterLink';

const Footer = () => (
  <footer>
    <Grid
      w="100%"
      templateColumns={{ base: '100%', md: '1fr 1fr' }}
      py={{ base: '2rem', md: '8rem' }}
    >
      <Center>
        <Box color="whitesmoke" w={{ base: '85%', md: '60%' }}>
          <Heading as="h3" fontWeight="black">
            Lineage
          </Heading>

          <Text fontWeight="light">
            A visualizer for AKA (Ate, Kuya, Ading) families.
          </Text>
          <Text fontWeight="light">
            © {new Date().getFullYear()} Philippine Student Association
          </Text>
        </Box>
      </Center>
      <Center color="whitesmoke" mt={{ base: '2rem', md: '0px' }}>
        <Box w={{ base: '85%', md: '60%' }}>
          <Heading as="h3" fontSize="3xl">
            Links
          </Heading>
          <Grid templateColumns={{ base: '100%', md: '1fr 1fr' }}>
            <FooterLink href="/lineages">Lineages</FooterLink>
            <FooterLink href="/edit">Dashboard</FooterLink>
            <FooterLink href="https://github.com/renzol2/lineage">
              GitHub
            </FooterLink>
            <FooterLink href="http://psauiuc.org/">PSA UIUC</FooterLink>
          </Grid>
        </Box>
      </Center>
    </Grid>
  </footer>
);

export default Footer;
