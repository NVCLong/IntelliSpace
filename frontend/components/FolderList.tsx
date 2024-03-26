import React from 'react';
import { MdFolder } from 'react-icons/md';

interface Folder {
    id: string;
    name: string;
}

interface FolderListProps {
    folders: Folder[];
}

const FolderList: React.FC<FolderListProps> = ({ folders }) => {
    return (
        <div className="space-y-4">
            {folders.map((folder) => (
                <div key={folder.id} className="flex items-center p-4 border rounded-md">
                    <MdFolder size={24} />
                    <span className="ml-4">{folder.name}</span>
                </div>
            ))}
        </div>
    );
};

export default FolderList;
