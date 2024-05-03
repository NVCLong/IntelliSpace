"use client";
import { useEffect } from "react";
import {AppDispatch, useAppSelector} from "@/lib/store";
import {getAllRootFolder, openFolder} from "@/lib/apiCall";
import { useState } from "react";
import FileList from "@/components/listDeleted/FileList";
import {useDispatch} from "react-redux";
import {deletedFile} from "@/lib/apiCall";



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
  const [fileList, setFileList] = useState([]);


  const handleFetchData = async ()=>{
          try {
              console.log("Fetching in root folder")
              // @ts-ignore
              const response = await deletedFile(storageID_temp);
              setFileList(response);
              // setIsFetch(false); // Mark fetching complete
              console.log(response);
          } catch (error) {
              console.error(error);
          }
        }

  useEffect(() => {
    handleFetchData();
  }
  , []
);
  // @ts-ignore
    return (
    <>
        <div className="mt-10 ml-16">
        <div>
          {fileList !== null && <FileList files={fileList}/>}
        </div>
        </div>
    </>
  );
}
