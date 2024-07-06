import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import Container from '@/components/common/Container';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/HeaderComponent';
import { AuthProvider } from '@/contexts/AuthProvider';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader = !['/', '/login', '/signup'].includes(router.pathname);
  const showFooter = !['/', '/login', '/signup', '/storeRegister'].includes(
    router.pathname,
  );

  return (
    <AuthProvider>
      {showHeader && <Header />}
      <Container>
        <Component {...pageProps} />
      </Container>
      {showFooter && <Footer />}
    </AuthProvider>
  );
}

export default MyApp;
