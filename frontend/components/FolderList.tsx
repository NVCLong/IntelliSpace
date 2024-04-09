"use client"
import React from 'react';
import { MdFolder } from 'react-icons/md';
import { FiFolderPlus } from "react-icons/fi";

interface Folder {
    id: string;
    name: string;
}

interface FolderListProps {
    folders: Folder[];
}

const FolderList: React.FC<FolderListProps> = ({ folders }) => {
    const handleNewFolder = () => {
        return () => {
            console.log("Creating new folder");
        }
    }

    // tach cai create folder thanh 1 component
    return (
        <div>
            <div className="mt-24 ml-20">
                <button
                    className="flex items-center px-4 py-2 text-gray-600 bg-white border rounded-full shadow-md cursor-pointer hoverScale"
                    onClick={handleNewFolder()}
                >
                    <FiFolderPlus size={24} />
                    <span className="ml-4 font-semibold md:block">Create folder</span>
                </button>
            </div>
            <div className="grid grid-cols-1 pt-10 pl-20 mt-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-7">
                {folders.map((folder) => (
                    <div key={folder.id} className="flex items-center p-4 bg-white border rounded-md shadow-md cursor-pointer hoverScale">
                        <MdFolder className="text-blue-400" size={24} />
                        <span className="ml-4">{folder.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FolderList;
