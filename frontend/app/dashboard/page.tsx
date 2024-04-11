"use client";
import { useEffect } from "react";
import {AppDispatch, useAppSelector} from "@/lib/store";
import { getAllRootFolder } from "@/lib/apiCall";
import { get } from "http";
import { useState } from "react";
import FolderList from "@/components/FolderList";
import {useDispatch} from "react-redux";
import { setStorageID } from '@/lib/features/todos/storageSlice';
import { NewFolder } from "@/components/NewFolder";


export default function Page() {
  const storageID_temp:string | null  = localStorage.getItem("storageID")
  const  dispatch = useDispatch<AppDispatch>();
  const [folderList, setFolderList] = useState([]);
  // @ts-ignore
  const storageID: string | null = useAppSelector(
    (state) => state.storageSlice.storageID
  );
  const [isFetch, setIsFetch] = useState(true);

  const handleFetchData=async ()=>{
      // if (isFetch) return; // Prevent redundant fetches

      try {
          const response = await getAllRootFolder(storageID_temp);
          setFolderList(response.rootFolders);
          setIsFetch(false); // Mark fetching complete
          console.log(response);
      } catch (error) {
          console.error(error);
      }

  }
    const handleNewFolderCreated = (b:boolean) => {
        setIsFetch(b); // Trigger data fetching when a new folder is created
    };



  useEffect(() => {
    // if (storageID != null) {
    //   // localStorage.setItem("storageID", storageID)
    //   dispatch(setStorageID(storageID))
    // }
    handleFetchData();
  }
  , [isFetch]
);
  return (
    <>
      <NewFolder storageID={storageID_temp}  />
      {folderList !== null && <FolderList folders={folderList}  />}
    </>
  );
}
