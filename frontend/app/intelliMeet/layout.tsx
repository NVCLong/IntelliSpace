import type { Metadata } from "next";
import TopLoader from '@/components/TopLoader';
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/SideBar"

export const metadata: Metadata = {
  title: "IntelliMeet | IntelliSpace",
  description: "IntelliSpace meeting platform for remote teams",
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <TopLoader />
      <Sidebar/>
      {children}
    </div>
  );
};

export default Dashboardlayout;
