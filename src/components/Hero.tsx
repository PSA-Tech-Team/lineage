import { Box, Button, Flex, Heading, ScaleFade, Text } from '@chakra-ui/react';
import Link from 'next/link';

const Hero = ({ title }: { title: string }) => (
  <Flex justifyContent="center" alignItems="center" minHeight="90vh" pb="2rem">
    <Box color="white" textAlign="center" px="1rem">
      <ScaleFade in>
        <Heading fontSize={{ base: '7xl', lg: '9xl' }} fontWeight="black">
          {title}
        </Heading>
        <Text fontSize="xl" fontWeight="light">
          A visualizer for AKA (Ate, Kuya, Ading) families.
        </Text>
        <Link href="/lineages">
          <Button
            bgColor="rgba(0, 0, 0, 13%)"
            w="50%"
            fontWeight="bold"
            mt="1rem"
            _hover={{
              boxShadow:
                '0 0 1px 2px rgba(255, 255, 255, .25), 0 1px 1px rgba(0, 0, 0, .15)',
            }}
            shadow="md"
          >
            View lineages
          </Button>
        </Link>
      </ScaleFade>
    </Box>
  </Flex>
);

Hero.defaultProps = {
  title: 'Lineage',
};

export default Hero;
