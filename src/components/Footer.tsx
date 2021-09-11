import { Box, Center, Grid, Heading, Image, Text } from '@chakra-ui/react';
import { BACKGROUND_GRADIENT } from '../themes/colors';
import StyledLink from './StyledLink';

const Footer = () => (
  <footer>
    <Grid
      w="100%"
      templateColumns={{ base: '100%', md: '1fr 1fr' }}
      py={{ base: '2rem', md: '7rem' }}
      bgGradient={BACKGROUND_GRADIENT}
    >
      <Center>
        <Box color="whitesmoke" w={{ base: '85%', md: '60%' }}>
          <Image
            src="/psa_logo.png"
            alt="Philippine Student Association UIUC Logo"
            w="50%"
          />
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
            <StyledLink href="/lineages">Lineages</StyledLink>
            <StyledLink href="/edit">Dashboard</StyledLink>
            <StyledLink href="https://github.com/renzol2/lineage">
              GitHub
            </StyledLink>
            <StyledLink href="http://psauiuc.org/">PSA UIUC</StyledLink>
          </Grid>
        </Box>
      </Center>
    </Grid>
  </footer>
);

export default Footer;
