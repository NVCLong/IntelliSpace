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

  useEffect(() => {
    if (storageID != null) {
      // localStorage.setItem("storageID", storageID)

      dispatch(setStorageID(storageID))
    }
    // if (storageID !== null)
      // {
      console.log(storageID_temp)
      const response = getAllRootFolder(storageID_temp)
        .then((value) => {
          setFolderList(value.rootFolders);
          console.log(value);
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(response);
    // }
  }
  , [storageID]
);
  return (
    <>
      <NewFolder storageID={storageID_temp} />
      {folderList !== null && <FolderList folders={folderList} />}
    </>
  );
}
