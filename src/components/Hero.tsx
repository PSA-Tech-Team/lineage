import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';

export const Hero = ({ title }: { title: string }) => (
  <Flex justifyContent="center" alignItems="center" height="90vh">
    <Grid templateColumns={{ base: '100% 100%', lg: '1fr 1fr' }}>
      <Box color="white">
        <Heading fontSize="5vw" fontWeight="black">
          {title}
        </Heading>
        <Text fontSize="2vw" fontWeight="light">
          A visualizer for AKA (Ate, Kuya, Ading) families.
        </Text>
        <Link href="/lineages">
          <Button colorScheme="blue" w="50%" fontWeight="bold" mt="1rem">
            View lineages
          </Button>
        </Link>
      </Box>
      <Box bgColor="white">image goes here</Box>
    </Grid>
  </Flex>
);

Hero.defaultProps = {
  title: 'Lineage',
};
