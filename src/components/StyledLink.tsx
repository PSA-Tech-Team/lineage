import { Link } from '@chakra-ui/layout';
import NextLink from 'next/link';

interface StyledLink {
  href: string;
  children: React.ReactNode;
}

const StyledLink = ({ href, children }: StyledLink) => (
  <NextLink href={href} passHref>
    <Link fontSize="lg" fontWeight="light" my="3px">
      {children}
    </Link>
  </NextLink>
);

export default StyledLink;
