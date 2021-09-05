import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Grid,
  Heading,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/layout';
import { useBreakpointValue } from '@chakra-ui/media-query';
import GradientButton from '../components/GradientButton';
import StyledLink from '../components/StyledLink';
import { BACKGROUND_GRADIENT, BACKGROUND_GREY } from '../themes/colors';

const DashboardPage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Box w="100%" minH="100vh">
      <Grid
        templateColumns={{
          base: '100%',
          md: '25% 75%',
          lg: '20% 80%',
          xl: '15% 85%',
        }}
      >
        <Box borderRight="1px" borderColor="lightgray" p="1rem">
          <Heading
            as="h1"
            bgGradient={BACKGROUND_GRADIENT}
            bgClip="text"
            fontWeight="black"
            fontSize="3xl"
            pb="1"
          >
            Lineage
          </Heading>
          {!isMobile && (
            <>
              <GradientButton
                my="1.2rem"
                w="60%"
                leftIcon={<AddIcon fontSize="small" />}
                borderRadius="12px"
                boxShadow="md"
              >
                New
              </GradientButton>
              <VStack
                ml="1"
                align="stretch"
                spacing="2"
                divider={<StackDivider borderColor="gray.200" w="75%" />}
              >
                {/* TODO: turn these into linked boxes */}
                <StyledLink href="">Home</StyledLink>
                <StyledLink href="">Members</StyledLink>
                <StyledLink href="">Pairings</StyledLink>
              </VStack>
            </>
          )}
        </Box>
        <Box bgColor={BACKGROUND_GREY} minH="100vh">
          <Heading>Hello</Heading>
        </Box>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
