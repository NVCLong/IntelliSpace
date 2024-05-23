'use client'
import { useCallback, useEffect } from "react";
import { AppDispatch, useAppSelector } from '@/lib/store'
import { getAllRootFolder, openFolder } from '@/lib/apiCall'
import { useState } from 'react'
import FolderList from '@/components/list/FolderList'
import FileList from '@/components/list/FileList'
import { useDispatch } from 'react-redux'
import { NewFolder } from '@/components/NewFolder'
import { BackButton } from '@/components/BackButton'
import { UploadFile } from '@/components/UploadFile'
import { motion } from 'framer-motion'
// import SearchBar from "@/components/SearchBar";

export default function Page() {
  let storageID_temp: string | null
  let folderId:string|null
  if(typeof window !=='undefined') {
    storageID_temp = localStorage.getItem('storageID')
     folderId= localStorage.getItem('folderId')
  }

  const dispatch = useDispatch<AppDispatch>()
  const [folderList, setFolderList] = useState([])
  const [parentFolder, setParentFolder] = useState({
    parentFolderId: ''
  })
  // @ts-ignore
  const storageID: string | null = useAppSelector(
    (state) => state.storageSlice.storageID
  )
  const [isFetch, setIsFetch] = useState(true)
  const [fileList, setFileList] = useState([])

  useEffect(() => {

    const handleFetchData = async () => {
      try {
        if (folderId === null) {
          // @ts-ignore
          const response = await getAllRootFolder(storageID_temp);
          if (response) {
            setFolderList(response.rootFolders);
            setIsFetch(false);
            console.log(response);
          }
        } else {
          console.log('Fetching in subfolder');
          const response = await openFolder(storageID_temp, folderId);
          if (response) {
            if (response.parentFolder === null) {
              console.log(response);
              setFolderList(response.subFolders);
              setIsFetch(false);
              setFileList(response.files);
              localStorage.setItem('parentFolder', '0');
            } else {
              setFolderList(response.subFolders);
              setIsFetch(false);
              setFileList(response.files);
              console.log(response);
              localStorage.setItem('parentFolder', response.parentFolder.id);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    handleFetchData().then().catch(console.error)
  }, [])

  return (
    <>
    <div className="flex flex-col">

        {/* <SearchBar/> */}
      <div className="flex-col mt-5 flexCenter sm:flex-row sm:space-x-5 sm:flexCenter">
        <BackButton />
        <br/>
        <NewFolder storageID={storageID_temp} />
        <br/>
        <UploadFile />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}
      >
        <div className="">
          <div>
            {folderList !== null && (
              <FolderList
                folders={folderList}
                parentFolderId={parentFolder.parentFolderId}
              />
            )}
          </div>
        </div>

        <div className="-mt-5 ">
          {fileList !== null && <FileList files={fileList} />}
        </div>
      </motion.div>
    </div>
    </>
  )
}
