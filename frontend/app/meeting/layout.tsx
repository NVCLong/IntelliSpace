import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import Sidebar from "@/components/SideBar";

export const metadata: Metadata = {
  title: "Meeting | IntelliSpace",
  description: "Meeting in IntelliSpace.",
};

const Meetinglayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <NextTopLoader color="#BF40BF" showSpinner={false} easing="ease" />
      <Sidebar />
      {children}
    </div>
  );
};

export default Meetinglayout;
