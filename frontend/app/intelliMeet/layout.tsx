import type { Metadata } from 'next';
import TopLoader from '@/components/TopLoader';

export const metadata: Metadata = {
  title: 'IntelliMeet | IntelliSpace',
  description: 'IntelliSpace meeting platform for remote teams',
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <TopLoader />
      {/*<Sidebar />*/}
      {children}
    </div>
  );
};

export default Dashboardlayout;
