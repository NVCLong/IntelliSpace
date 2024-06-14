'use client';
import React, { useEffect, useState } from 'react';
import { AppDispatch, useAppSelector } from '@/lib/store';
import { getAllRootFolder, openFolder } from '@/lib/apiCall';
import FolderList from '@/components/list/FolderList';
import FileList from '@/components/list/FileList';
import { useDispatch } from 'react-redux';
import { NewFolder } from '@/components/NewFolder';
import { BackButton } from '@/components/BackButton';
import { UploadFile } from '@/components/UploadFile';
import { motion } from 'framer-motion';
import { FiDisc, FiXCircle } from 'react-icons/fi';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useRouter } from 'next/navigation';

// import SearchBar from "@/components/SearchBar";

export default function Page() {
  const router = useRouter();
  let storageID_temp: string | null;
  let folderId: string | null;
  if (typeof window !== 'undefined') {
    storageID_temp = localStorage.getItem('storageID');
    folderId = localStorage.getItem('folderId');
  }

  const dispatch = useDispatch<AppDispatch>();
  const [folderList, setFolderList] = useState([]);
  const [parentFolder, setParentFolder] = useState({
    parentFolderId: '',
  });
  // @ts-ignore
  const storageID: string | null = useAppSelector(
    (state) => state.storageSlice.storageID,
  );
  const [isFetch, setIsFetch] = useState(true);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (typeof window != 'undefined') {
      let userId = localStorage.getItem('userId');
      if (userId == null) {
        router.push('/');
      }
    }
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
    handleFetchData().then().catch(console.error);
  }, []);

  return (
    <>
      <div className="flex flex-col">
        {/* <SearchBar/> */}

        <div className="hidden ml-3 space-x-5 sm:flex mt-9 sm:flex-row">
          <BackButton />
          <br />
          <NewFolder storageID={storageID_temp} />
          <br />
          <UploadFile />
        </div>

        <div className="fixed bottom-0 right-0 mb-3 mr-7 sm:fixed sm:hidden">
          <Drawer>
            <DrawerTrigger>
              <FiDisc
                size={45}
                className="flex items-center p-2 text-gray-600 bg-white rounded-full shadow-md cursor-pointer hoverScale"
              />
            </DrawerTrigger>
            <DrawerContent className="ml-auto w-fit h-fit">
              <DrawerHeader className="flex flex-col items-center">
                <BackButton />
                <NewFolder storageID={storageID_temp} />
                <UploadFile />
                <DrawerClose className="flexCenter">
                  <FiXCircle
                    size={45}
                    className="flex items-center p-2 text-white bg-red-400 rounded-full shadow-md cursor-pointer hoverScale"
                  />
                </DrawerClose>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
        {/*{folderList === null && (*/}
        {/*  <div className="flex-col h-screen space-y-4 w-screen flexCenter">*/}
        {/*    <FiArchive size={50} />*/}
        {/*    <p className="text-xl">Empty</p>*/}
        {/*  </div>*/}
        {/*)}*/}

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <div className="mt-10 sm:mt-0">
            <div>
              {folderList !== null && (
                <FolderList
                  folders={folderList}
                  parentFolderId={parentFolder.parentFolderId}
                />
              )}
            </div>
          </div>

          <div className="sm:mt-0">
            {fileList !== null && <FileList files={fileList} />}
          </div>
        </motion.div>
      </div>
    </>
  );
}
