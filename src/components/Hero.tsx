import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  ScaleFade,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import Tree from 'react-d3-tree';

const PLACEHOLDER = {
  name: 'Ading',
  children: [{ name: 'Ate' }, { name: 'Kuya' }],
};

export const Hero = ({ title }: { title: string }) => (
  <Flex justifyContent="center" alignItems="center" minHeight="90vh" pb="2rem">
    <Grid templateColumns={{ base: '12 12', lg: '1fr 1fr' }}>
      <Box color="white">
        <ScaleFade in>
          <Heading fontSize="6vw" fontWeight="black">
            {title}
          </Heading>
          <Text fontSize="2vw" fontWeight="light">
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
            >
              View lineages
            </Button>
          </Link>
        </ScaleFade>
      </Box>
      <Box>
        <Tree
          orientation="vertical"
          data={PLACEHOLDER}
          translate={{ x: 300, y: 30 }}
          enableLegacyTransitions
        />
      </Box>
    </Grid>
  </Flex>
);

Hero.defaultProps = {
  title: 'Lineage',
};
