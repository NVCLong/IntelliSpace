"use client"
import { FiFolderPlus } from "react-icons/fi";

export default function Page() {
  const handleNewFolder = () => {
    return () => {
      console.log("Creating new folder");
    };
  };

  return (
    <>
      <div className="">
        <div className="mt-10 -ml-36 ">
          <button
            className="flex items-center px-4 py-2 text-gray-600 bg-white border rounded-full shadow-md cursor-pointer hoverScale"
            onClick={handleNewFolder()}
          >
            <FiFolderPlus size={24} />
            <span className="ml-4 font-semibold">Create folder</span>
          </button>
        </div>

      </div>
    </>
  )
}
