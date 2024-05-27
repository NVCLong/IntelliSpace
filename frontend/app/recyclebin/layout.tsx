import type { Metadata } from "next";
import TopLoader from '@/components/TopLoader';

import Sidebar from "@/components/SideBar";
import React from "react";

export const metadata: Metadata = {
  title: "Bin | IntelliSpace",
  description: "Deleted files and folders in IntelliSpace.",
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <TopLoader/>
      <Sidebar />
      {children}
    </div>
  );
};

export default Dashboardlayout;
