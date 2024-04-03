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
    return (
        <div className="pl-16 space-y-4 pt-28">
            {folders.map((folder) => (
                <div key={folder.id} className="flex items-center p-4 bg-white border rounded-md shadow-md cursor-pointer hoverScale">
                    <MdFolder className="text-blue-400" size={24} />
                    <span className="ml-4">{folder.name}</span>
                </div>
            ))}
        </div>
    );
};

export default FolderList;
