import type { Metadata } from 'next';
import TopLoader from '@/components/TopLoader';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Sign in | IntelliSpace',
  description: 'Sign in to your IntelliSpace account',
};

const SignInLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TopLoader />
      <NavBar />
      {children}
      <Footer />
    </>
  );
};

export default SignInLayout;
