import { Box, Button, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { BACKGROUND_GRADIENT } from '../themes/colors';

interface LandingPageCardProps {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}

const LandingPageCard = ({
  title,
  description,
  href,
  buttonText,
}: LandingPageCardProps) => {
  return (
    <Box mx="5rem" p="4rem" bgColor="white" boxShadow="lg" borderRadius={20}>
      <Heading as="h2" fontWeight="black" mt="1rem" mb="0.5rem">
        {title}
      </Heading>
      <Text fontWeight="light" fontSize="lg">
        {description}
      </Text>
      <Link href={href}>
        <Button
          bgGradient={BACKGROUND_GRADIENT}
          color="white"
          fontWeight="bold"
          _hover={{
            boxShadow: '0 0 1px 2px silver, 0 1px 1px rgba(0, 0, 0, .15)',
          }}
          shadow="lg"
          mt="2rem"
          w="40%"
        >
          {buttonText}
        </Button>
      </Link>
    </Box>
  );
};

export default LandingPageCard;
