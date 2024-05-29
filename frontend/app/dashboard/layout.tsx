import type { Metadata } from 'next';
import Sidebar from '@/components/SideBar';
import TopLoader from '@/components/TopLoader';
import React from 'react';
// import SearchBar from "@/components/SearchBar";

export const metadata: Metadata = {
  title: 'Dashboard | IntelliSpace',
  description: 'IntelliSpace Dashboard for all your needs',
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <TopLoader />
      <Sidebar />
      {children}
    </div>
  );
};

export default Dashboardlayout;
