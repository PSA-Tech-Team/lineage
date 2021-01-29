import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';

import theme from '../theme';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Head>
        <title>Lineage</title>
        <meta property="og:title" content="Lineage" key="title" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
