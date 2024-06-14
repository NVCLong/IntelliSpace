import type { Metadata } from 'next';
import TopLoader from '@/components/TopLoader';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'IntelliMeet | IntelliSpace',
  description: 'IntelliSpace meeting platform for remote teams',
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <div className="">
        <TopLoader />
        {children}
      </div>
    </Suspense>
  );
};

export default Dashboardlayout;
