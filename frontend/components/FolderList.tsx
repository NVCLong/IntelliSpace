"use client";
import React from "react";
import { MdFolder } from "react-icons/md";

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  folders: Folder[];
}

const FolderList: React.FC<FolderListProps> = ({ folders }) => {
  return (
    <div className="">

      <div className="grid grid-cols-1 pt-10 pl-20 mt-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-7">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="flex items-center p-4 bg-white border rounded-md shadow-md cursor-pointer hoverScale"
          >
            <MdFolder className="text-blue-400" size={24} />
            <span className="ml-4">{folder.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderList;
