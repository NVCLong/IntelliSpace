'use client';
import React, { useEffect, useState } from 'react';

interface StorageBarProps {
  used: number;
  total: number;
  open: boolean;
}

function getColor(percentage: number): string {
  if (percentage > 80) return 'bg-red-400';
  if (percentage >= 60 && percentage <= 80) return 'bg-yellow-400';
  if (percentage <= 50) return 'bg-green-400';
  return 'bg-green-400';
}

const StorageBar: React.FC<StorageBarProps> = ({ used, total, open }) => {
  // console.log(typeof used, typeof total)
  const usedStorage = Math.round(used * 100) / 100;
  const percentage = Math.round((used / total) * 100);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    console.log(Math.round((used / total) * 100));
    if (Math.round((used / total) * 100) !== 0)
      setPercent(Math.round((used / total) * 100));
  }, [used]);

  return (
    <div className="relative pt-1">
      <div className="flex h-2 mb-4 overflow-hidden text-xs bg-white rounded">
        <div
          style={{ width: `${percent}%` }}
          className={`flex flex-col justify-center text-center text-white ${getColor(percent)} shadow-none whitespace-nowrap`}
        ></div>
      </div>
      {!open && <p className="font-semibold flexCenter">{`${percent}%`}</p>}
      {open && (
        <p className="font-semibold flexCenter">{`Used ${usedStorage}GB of ${total}GB`}</p>
      )}
    </div>
  );
};
export default StorageBar;
