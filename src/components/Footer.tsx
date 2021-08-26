import { Box, Center, Grid, Heading, Text } from '@chakra-ui/react';

const Footer = () => (
  <footer>
    <Grid
      w="100%"
      templateColumns={{ base: '100%', md: '1fr 1fr' }}
      py={{ base: '2rem', md: '8rem' }}
    >
      <Center>
        <Box color="whitesmoke">
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
    </Grid>
  </footer>
);

export default Footer;
