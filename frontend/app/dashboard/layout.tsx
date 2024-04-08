
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import Sidebar from "@/components/Sidebar";
import FolderList from "@/components/FolderList";

export const metadata: Metadata = {
  title: "Dashboard | IntelliSpace",
  description: "IntelliSpace Dashboard for all your needs",
};

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {


  const folders = [
    { id: '1', name: 'Folder 1' },
    { id: '2', name: 'Folder 2' },
    { id: '3', name: 'Folder 1' },
    { id: '4', name: 'Folder 2' },
    { id: '5', name: 'Folder 1' },
    { id: '6', name: 'Folder 2' },
    { id: '7', name: 'Folder 2' },
    { id: '8', name: 'Folder 1' },
    { id: '9', name: 'Folder 2' },
    { id: '10', name: 'Folder 1' },
    { id: '11', name: 'Folder 2' },
    { id: '12', name: 'Folder 1' },
    { id: '13', name: 'Folder 2' },
    { id: '14', name: 'Folder 2' },
  ];


  return (
    <div className="flex">
      <NextTopLoader color="#BF40BF" showSpinner={false} easing="ease" />
      <Sidebar />
      <FolderList folders={folders} />
      {children}
    </div>
  );
};

export default Dashboardlayout;
