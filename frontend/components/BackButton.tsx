import React from "react";
import { RiArrowGoBackFill } from "react-icons/ri";
import {openFolder} from "@/lib/apiCall";
import {FiFolderPlus} from "react-icons/fi";
import {Button} from "@nextui-org/react";

export const BackButton=()=>{
    const storageId= localStorage.getItem("storageID")
    const folderId= localStorage.getItem("folderId")
    const parentFolderId= localStorage.getItem("parentFolder")
    const handleCallBack=async ()=>{
        if (parentFolderId === "0") {
            localStorage.removeItem("folderId");
            console.log("removed folderId");
            window.location.reload();
        } else if (parentFolderId !== null && folderId !== null) {
            localStorage.setItem("folderId", parentFolderId);
            window.location.reload();
        }
    }
    return(
        <>
            <div className="mt-24 ml-20">
            <button
                className="flex items-center px-4 py-2 text-gray-600 bg-white border rounded-full shadow-md cursor-pointer hoverScale"
                color="primary"
                onClick={handleCallBack}
            >
                <RiArrowGoBackFill size={24} />
                <span className="ml-0 font-semibold md:block">Back</span>
            </button>
            </div>
        </>
    )
}