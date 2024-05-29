import type { Metadata } from 'next';
import TopLoader from '@/components/TopLoader';
import Sidebar from '@/components/SideBar';
import { ChatContextProvider } from '@/providers';
import React from 'react';

export const metadata: Metadata = {
  title: 'IntelliBot | IntelliSpace',
  description: 'IntelliSpace AI chatbot',
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <TopLoader />
      <Sidebar />
      <ChatContextProvider>{children}</ChatContextProvider>
    </div>
  );
};

export default Dashboardlayout;
