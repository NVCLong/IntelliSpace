import type { Metadata } from "next";
import TopLoader from '@/components/TopLoader';
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "IntelliMeet | IntelliSpace",
  description: "IntelliSpace meeting platform for remote teams",
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <TopLoader />
      <NavBar />
      {children}
      <Footer />
    </div>
  );
};

export default Dashboardlayout;
