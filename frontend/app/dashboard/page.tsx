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
import SearchBar from "@/components/SearchBar";

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
 // ong oi co gi mai tui fix, khong hieu tui hoi ong nha, muon roi ong nghi di cam on o
  // Ok ban



  // comment giup minh doan useEffect nay


  // noi chung la do cai dong fetch api cua ban dang bi lôp vo tanar

  // kieu minh luc dau de reload ma minh muon co folder cap nhat la no tu them ay, khong phai reload tai relaod compile lau ay
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
  // nay chi la cach chong che de no work thoi, cost perf lam, thong thuong, ban muon data duoc fetch lai khi files thay doi
  // thi ban truyen cai handleFetchData() vao cai onFileChange hay gi do
  // ban đafàuaufuseEffect củra ban c dependency gi ay
  // @ts-ignore
  // co folderList, fileList a
  // oke ban, minh cung lo cai viec call nhieu qua server tai ko noi
  // gio thu build lai thi chac se ko con loi trang /dashboard dau, may trang con lai ban cu vo next dev va check
 // next js co cach nao tang tyoc do compile ko ban, DUY no ko biet
  return (
    <>
    <div className="flex flex-col">
      <div className="justify-center w-full mt-8 mb-8 ml-auto md:w-2/3 lg:w-1/3">
          <SearchBar/>
      </div>
      <div className="flex flex-row">
        <BackButton />
        <NewFolder storageID={storageID_temp} />
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
    </div>
    </>
  )
}
