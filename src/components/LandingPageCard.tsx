import { Box, Heading } from '@chakra-ui/react';

interface LandingPageCardProps {
  title: string;
  description?: string;
}

const LandingPageCard = ({ title, description }: LandingPageCardProps) => {
  return (
    <Box mx="5rem" p="4rem" bgColor="white" boxShadow="lg" borderRadius={20}>
      <Heading as="h2" fontWeight="black">
        {title}
      </Heading>
    </Box>
  );
};

export default LandingPageCard;
