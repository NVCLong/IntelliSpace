"use client";
import { useState } from "react";
import FileList from "@/components/list/FileList";
import FolderList from "@/components/list/FolderList";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion } from 'framer-motion'
import { getSharedFolder } from "@/lib/apiCall";
import { set } from "zod";

export default function Page() {
  const [code, setCode] = useState("");
    const [folderList, setFolderList] = useState([]);
    const [parentFolder, setParentFolder]=useState({
        parentFolderId: ""
    })
  const [fileList, setFileList] = useState([]);

const handleChangeCode = (e) =>{
  setCode(e.target.value);
}


const handleAccess = async ()=>{
  try {
    console.log(code)
    const response = await getSharedFolder(code);
    setFolderList(response.subFolders);
    if (response.files.isEmpty()) {
      setFileList(response.files)
    }
    setParentFolder({parentFolderId: response.parentFolder.id})


  } catch (error) {
    console.log(error)

  }
}

  // @ts-ignore
    return (
      <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        className="w-full h-full p-16"
        >
        <Card className="p-3 border-white border-1 bg-white/50">
          <CardHeader>
              <CardTitle className="drop-shadow-lg flexCenter">Share code</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-3">
                  <Input
                    onChange={handleChangeCode}
                    // value={code}
                    className="shadow-lg"
                    placeholder="Enter shared code"
                  />
                   <Button
                   onClick={handleAccess}
                   className="shadow-lg"
>Access</Button>
          </CardContent>
        </Card>

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
