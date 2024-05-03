import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import Sidebar from "@/components/Sidebar";
import FolderList from "@/components/listDeleted/FolderList";

export const metadata: Metadata = {
  title: "Bin | IntelliSpace",
  description: "Deleted files and folders in IntelliSpace.",
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <NextTopLoader color="#BF40BF" showSpinner={false} easing="ease" />
      <Sidebar />
      {children}
    </div>
  );
};

export default Dashboardlayout;
