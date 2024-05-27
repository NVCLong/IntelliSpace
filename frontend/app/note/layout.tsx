import type { Metadata } from "next";
import TopLoader from "@/components/TopLoader";

import Sidebar from "@/components/SideBar";
import React from "react";

export const metadata: Metadata = {
  title: "Note | IntelliSpace",
  description: "All notes in IntelliSpace.",
};

const Notelayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <TopLoader/>
      <Sidebar />
      {children}
    </div>
  );
};

export default Notelayout;
