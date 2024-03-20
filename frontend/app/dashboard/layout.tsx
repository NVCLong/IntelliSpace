import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard | IntelliSpace",
  description: "IntelliSpace Dashboard for all your needs",
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Sidebar />
      <NextTopLoader color="#000" showSpinner={false} />
      {children}
    </>
  );
};

export default Dashboardlayout;
