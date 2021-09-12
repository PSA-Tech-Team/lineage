import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Flex, LinkBox, Text } from '@chakra-ui/layout';
import NextLink from 'next/link';
import GradientButton from './GradientButton';

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
}

const DashboardCard = ({ title, description, href }: DashboardCardProps) => {
  return (
    <NextLink href={href} passHref>
      <LinkBox
        bgColor="white"
        p="2rem"
        w="100%"
        borderRadius={15}
        boxShadow="md"
        _hover={{ opacity: 0.8 }}
      >
        <Text fontWeight="light" fontSize="1.5rem">
          {title}
        </Text>
        <Text fontWeight="lighter">{description}</Text>
        <Flex flexDir="row-reverse">
          <GradientButton
            rightIcon={<ArrowForwardIcon />}
            size="sm"
            boxShadow="md"
            mt="6rem"
          >
            View
          </GradientButton>
        </Flex>
      </LinkBox>
    </NextLink>
  );
};

export default DashboardCard;
