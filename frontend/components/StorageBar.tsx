import React from 'react';

interface StorageBarProps {
    used: number;
    total: number;
}

const StorageBar: React.FC<StorageBarProps> = ({ used, total }) => {
    const percentage = Math.round((used / total) * 100);

    return (
        <div className="relative pt-1">
            <div className="flex h-2 mb-4 overflow-hidden text-xs bg-white rounded">
                <div style={{ width: `${percentage}%` }} className="flex flex-col justify-center text-center text-white bg-pink-500 shadow-none whitespace-nowrap"></div>
            </div>
            <p className='sm:hidden'>{`Used ${used}GB of ${total}GB`}</p>
        </div>
    );
};

export default StorageBar;
