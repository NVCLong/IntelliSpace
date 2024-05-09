import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import Sidebar from "@/components/SideBar";

export const metadata: Metadata = {
  title: "Shared folder | IntelliSpace",
  description: "Shared folders in IntelliSpace.",
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <NextTopLoader color="#BF40BF" showSpinner={false} easing="ease" />
      <Sidebar />
      <div className="flexCenter">
      {children}
      </div>
    </div>
  );
};

export default Dashboardlayout;
