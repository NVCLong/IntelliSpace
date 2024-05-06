"use client";
import { useEffect } from "react";
import {AppDispatch, useAppSelector} from "@/lib/store";
import {getAllRootFolder, openFolder} from "@/lib/apiCall";
import { useState } from "react";
import FolderList from "@/components/list/FolderList";
import FileList from "@/components/list/FileList";
import {useDispatch} from "react-redux";
import { NewFolder } from "@/components/NewFolder";
import {BackButton} from "@/components/BackButton";
import {UploadFile} from "@/components/UploadFile";
import {motion} from "framer-motion";


export default function Page() {
  const storageID_temp:string | null  = localStorage.getItem("storageID")
    const folderId: string|null = localStorage.getItem('folderId');
    const  dispatch = useDispatch<AppDispatch>();
    const [folderList, setFolderList] = useState([]);
    const [parentFolder, setParentFolder] = useState({
        parentFolderId: ""
    })
  // @ts-ignore
  const storageID: string | null = useAppSelector(
    (state) => state.storageSlice.storageID
  );
  const [isFetch, setIsFetch] = useState(true);
  const [fileList, setFileList] = useState([]);


  const handleFetchData = async ()=>{
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
              if(response.parentFolder==null){
                setFolderList(response.subFolders);
                setIsFetch(false);
                setFileList(response.files);

                  localStorage.setItem("parentFolder","0");
              }else{
                  setFolderList(response.subFolders)
                  setIsFetch(false)
                  setFileList(response.files)
                  // setParentFolder({parentFolderId: response.parentFolder.id})
                  localStorage.setItem("parentFolder",response.parentFolder.id);

              }
          }catch (e) {
              console.error(e)
          }
      }

  }


  useEffect(() => {
    handleFetchData();
  }
  , [isFetch]
);
  // @ts-ignore
    return (
      <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="flex flex-col"
      >
        <div className="flex flex-row">
        <BackButton />
        <NewFolder storageID={storageID_temp} />
        <UploadFile />
        </div>
        <div className="ml-32">
          <div>
            {folderList !== null && (
              <FolderList
                folders={folderList}
                parentFolderId={parentFolder.parentFolderId}
              />
            )}
          </div>
        </div>

          <div className="ml-20 -mt-5">
            {fileList !== null && <FileList files={fileList} />}
          </div>
      </motion.div>
    );
}
