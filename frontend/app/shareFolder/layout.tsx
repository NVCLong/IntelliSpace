import type { Metadata } from "next";
import TopLoader from "@/components/TopLoader";

import Sidebar from "@/components/SideBar";
import React from "react";

export const metadata: Metadata = {
  title: "Shared folder | IntelliSpace",
  description: "Shared folders in IntelliSpace.",
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <TopLoader/>
      <Sidebar />
      <div className="flexCenter">
      {children}
      </div>
    </div>
  );
};

export default Dashboardlayout;
