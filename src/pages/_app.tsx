import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import Header from '@/components/common/HeaderComponent';
import { AuthProvider } from '@/contexts/AuthProvider';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader = !['/', '/login', '/signup'].includes(router.pathname);

  return (
    <AuthProvider>
      {showHeader && <Header />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
