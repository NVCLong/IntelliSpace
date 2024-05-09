"use client";
import React, { useState } from 'react';

import {
    ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuTrigger
} from '@/components/ui/context-menu';
import { getFile, softDelete } from '@/lib/apiCall';
import { Card,CardFooter } from '@nextui-org/card';
import { Image } from '@nextui-org/react';
import { FiDownloadCloud, FiTrash2 } from "react-icons/fi";

interface File {
  id: string;
  file_name: string;
  file_url: string;
  size: number;
  isDeleted: boolean;
}

interface FileListProps {
  files: File[];
}

// @ts-ignore
const FileList: React.FC<FileListProps> = ({ files }) => {
  const userId= localStorage.getItem("userId")
  console.log(files)
  const handleMoveToTrash = async (fileId: string) => {
     const data= await softDelete(fileId);
     console.log(data)
  };

  const handleDownload = async (fileId: string,fileName:string) => {
    try {
      const fileData = await getFile(fileId, fileName, userId);
      console.log(fileData)
      // @ts-ignore
      const url = window.URL.createObjectURL(fileData);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    }catch (e){
      throw  e
    }
  }

  return (
    <div className="relative flex flex-col overflow-hidden sm:py-12 sm:px-12">
      <div className="w-full max-w-screen-xl px-4 mx-auto">
        <div className="grid w-full gap-9 xl:grid-cols-6 sm:grid-cols-4">
          {files.map((file) => (
            <ContextMenu>
              <ContextMenuTrigger>
                <ContextMenuContent className="bg-white rounded-lg w-30">
                  <ContextMenuItem
                    className="hover:bg-slate-600 "
                    onClick={() => {
                      handleDownload(file.id, file.file_name);
                    }}
                  >
                    <ContextMenuLabel className="flex hover:text-white">
                        <FiDownloadCloud size={20} className="mr-2"/>

                      Download
                    </ContextMenuLabel>
                  </ContextMenuItem>
                  <hr className="h-px bg-gray-200 border-0"></hr>
                  <ContextMenuItem
                    className="hover:bg-slate-600 "
                    onClick={() => {
                      handleMoveToTrash(file.id);
                      // window.location.reload();
                    }}
                  >
                    <ContextMenuLabel className="flex hover:text-white">
                    <FiTrash2 size={20} className="mr-2"/>

                      Delete
                    </ContextMenuLabel>
                  </ContextMenuItem>
                </ContextMenuContent>

                <Card
                  isFooterBlurred={true}
                  radius="lg"
                  className="border-none hoverScale fixed-card-size"
                >
                  {file.file_name.split(".")[1].toLowerCase() === "png" ||
                  file.file_name.split(".")[1].toLowerCase() === "jpg" ? (
                    <Image
                      alt="image file icon"
                      src="/imageIcon.png"
                      width={300}
                      height={300}
                    />
                  ) : file.file_name.split(".")[1].toLowerCase() === "txt" ? (
                    <Image
                      alt="image file icon"
                      className=""
                      src="/txtIcon.png"
                      width={300}
                      height={300}
                    />
                  ) : file.file_name.split(".")[1].toLowerCase() === "docx" ? (
                    <Image
                      alt="image file icon"
                      className=""
                      src="/docxIcon.png"
                      width={300}
                      height={300}
                    />
                  ) : (
                    <div className="{/* Styles for unknown file type */}">
                      Unsupported File Type
                    </div>
                  )}
                  <CardFooter className="flexCenter  before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-md rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-large ml-1 z-10">
                    <h4 className="text-white truncate font-regular text-small">
                      {file.file_name}
                    </h4>
                  </CardFooter>
                </Card>
              </ContextMenuTrigger>
            </ContextMenu>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileList;
