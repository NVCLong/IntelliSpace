import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "IntelliBot | IntelliSpace",
  description: "IntelliSpace AI chatbot",
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
