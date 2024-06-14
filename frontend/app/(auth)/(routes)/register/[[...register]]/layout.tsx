import type { Metadata } from 'next';
import TopLoader from '@/components/TopLoader';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Register | IntelliSpace',
  description: 'Register for an account on IntelliSpace.',
};

const RegisterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopLoader />
      <NavBar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
};

export default RegisterLayout;
