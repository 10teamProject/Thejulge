import '@/styles/globals.css';

import type { AppProps } from 'next/app';

import Header from '@/components/common/HeaderComponent';
import { AuthProvider } from '@/contexts/AuthProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
