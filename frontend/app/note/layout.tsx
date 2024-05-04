import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import Sidebar from "@/components/Sidebar";
import FolderList from "@/components/NoteList";

export const metadata: Metadata = {
  title: "Note | IntelliSpace",
  description: "All notes in IntelliSpace.",
};

const Notelayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <NextTopLoader color="#BF40BF" showSpinner={false} easing="ease" />
      <Sidebar />
      {children}
    </div>
  );
};

export default Notelayout;
