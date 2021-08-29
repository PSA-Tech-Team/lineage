import { Link } from '@chakra-ui/layout';
import NextLink from 'next/link';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <NextLink href={href} passHref>
    <Link fontSize="lg" fontWeight="light" my="3px">
      {children}
    </Link>
  </NextLink>
);

export default FooterLink;
