"use client";
import { useEffect } from "react";
import {AppDispatch, useAppSelector} from "@/lib/store";
import {getAllRootFolder, openFolder} from "@/lib/apiCall";
import { get } from "http";
import { useState } from "react";
import FolderList from "@/components/FolderList";
import {useDispatch} from "react-redux";
import { setStorageID } from '@/lib/features/todos/storageSlice';
import { NewFolder } from "@/components/NewFolder";
import {string} from "zod";
import {BackButton} from "@/components/BackButton";


export default function Page() {
  const storageID_temp:string | null  = localStorage.getItem("storageID")
    const folderId: string|null= localStorage.getItem('folderId');
    const  dispatch = useDispatch<AppDispatch>();
    const [folderList, setFolderList] = useState([]);
    const [parentFolder, setParentFolder]=useState({
        parentFolderId: ""
    })
  // @ts-ignore
  const storageID: string | null = useAppSelector(
    (state) => state.storageSlice.storageID
  );
  const [isFetch, setIsFetch] = useState(true);

  const handleFetchData=async ()=>{
      // if (isFetch) return; // Prevent redundant fetches
      if(folderId===null) {
          try {
              console.log("Fetching in root folder")
              // @ts-ignore
              const response = await getAllRootFolder(storageID_temp);
              setFolderList(response.rootFolders);
              setIsFetch(false); // Mark fetching complete
              console.log(response);
          } catch (error) {
              console.error(error);
          }
      }else {
          try{
              console.log("{Fetching in subfolder")
              const response = await openFolder(storageID_temp, folderId);
              console.log( response)
              if(response.parentFolder==null){
                setFolderList(response.subFolders);
                setIsFetch(false);
                  localStorage.setItem("parentFolder","0");
                // setParentFolder({parentFolderId:"0"});
              }else{
                  setFolderList(response.subFolders)
                  setIsFetch(false)
                  // setParentFolder({parentFolderId: response.parentFolder.id})
                  localStorage.setItem("parentFolder",response.parentFolder.id);

              }
              console.log(response);
          }catch (e) {
              console.error(e)
          }
      }

  }


  useEffect(() => {
    // if (storageID != null) {
    //   // localStorage.setItem("storageID", storageID)
    //   dispatch(setStorageID(storageID))
    // }
    handleFetchData();
  }
  , [isFetch]
);
  // @ts-ignore
    return (
    <>

        <NewFolder storageID={storageID_temp}  />
        <BackButton   />

        <div>
        {folderList !== null && <FolderList folders={folderList}  parentFolderId={parentFolder.parentFolderId} />}
        </div>
    </>
  );
}
