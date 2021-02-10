import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import Router from 'next/router';
import theme from '../theme';
import { AppProps } from 'next/app';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

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
