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
    { id: '1', name: 'Folder 1' },
    { id: '2', name: 'Folder 2' },
    { id: '1', name: 'Folder 1' },
    { id: '2', name: 'Folder 2' },
    { id: '2', name: 'Folder 2' },

  ];

  return (
    <div className="flex">
      <NextTopLoader color="#000" showSpinner={false} />
      <Sidebar />
      <FolderList folders={folders} />
      {children}
    </div>
  );
};

export default Dashboardlayout;
