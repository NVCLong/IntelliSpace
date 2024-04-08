"use client";
import { useEffect } from "react";

import { useAppSelector } from "../../lib/store";
import { getAllRootFolder } from "@/lib/apiCall";
import { get } from "http";
import { useState } from "react";
import FolderList from "@/components/FolderList";

export default function Page() {
  const [folderList, setFolderList] = useState([]);
  // @ts-ignore
  const storageID: string | null = useAppSelector(
    (state) => state.storageSlice.storageID
  );

  useEffect(() => {
    if (storageID !== null) {
      console.log("storage id : " + storageID);
      const response = getAllRootFolder(storageID)
        .then((value) => {
          setFolderList(value.rootFolders);
          console.log(value);
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(response);
    }
  });
  return (
    <>
      <FolderList folders={folderList} />
    </>
  );
}
