import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import Sidebar from "@/components/SideBar";
import { ChatContextProvider } from "@/providers";

export const metadata: Metadata = {
  title: "IntelliBot | IntelliSpace",
  description: "IntelliSpace AI chatbot",
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <NextTopLoader color="#BF40BF" showSpinner={false} easing="ease" />
      <Sidebar />
      <ChatContextProvider>{children}</ChatContextProvider>
    </div>
  );
};

export default Dashboardlayout;
