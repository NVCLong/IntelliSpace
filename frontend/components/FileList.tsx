"use client";
import React, { useState } from "react";
import { MdFolder } from "react-icons/md";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import {deleteFolder, getFile, openFolder, softDelete, updateFolder} from "@/lib/apiCall";
import {Image} from "@nextui-org/react";


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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const [backdrop, setBackdrop] = React.useState("blur");
  const userId= localStorage.getItem("userId")

  const [fileName, setFileName] = useState("");
  const storageId = localStorage.getItem("storageID");
  const [currentFolderId, setCurrenFolderId] = useState("");

  const handleMoveToTrash = async (fileId: string) => {
     const data= await softDelete(fileId);
     console.log(data)
  };

  const handleDownload = async (fileId: string,fileName:string) => {
    try {
      const fileData = await getFile(fileId, fileName, userId);
      console.log(fileData)
      const fileExtension= fileName.split(".")[1].toLowerCase();
      // let fileBlob: Blob;
      //
      // switch (fileExtension) {
      //   case "png":
      //     fileBlob = new Blob([fileData], { type: 'image/png' });
      //     break;
      //   case "jpeg":
      //     fileBlob = new Blob([fileData], { type: 'image/jpeg' });
      //     break;
      //   case "txt":
      //     fileBlob = new Blob([fileData], { type: 'text/plain' });
      //     break;
      //   case "docx":
      //     fileBlob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      //     break;
      //   default:
      //     throw new Error('Unsupported file type');
      // }

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
    <div className="mt-36 -ml-96">
      <div className="grid grid-cols-1 pt-10 mt-0 -pl-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-7">
        {files.map((file) => (
          <>
              <Card
                isFooterBlurred
                radius="lg"
                className="border-none"
              >
                <CardHeader className="px-0 pt-2 pb-0 flexCenter">
                <h4 className="font-bold truncate text-large">{file.file_name}</h4>
                </CardHeader>
                {file.file_name.split(".")[1].toLowerCase() === 'png' ? (
                <Image
                  alt="image file icon"
                  className="object-none"
                  src="/imageIcon.png"
                  width={300}
                  height={300}
                />
                  ) : file.file_name.split(".")[1].toLowerCase() === 'txt' ?(
                        <Image
                            alt="image file icon"
                            className="object-none"
                            src="/txtIcon.png"
                            width={300}
                            height={300}
                        />
                  ): file.file_name.split(".")[1].toLowerCase() === 'docx' ?(
                    <Image
                        alt="image file icon"
                        className="object-none"
                        src="/docxIcon.png"
                        width={300}
                        height={300}
                    />
                  ): (
                    <div className="{/* Styles for unknown file type */}">
                      Unsupported File Type
                    </div>
                )
                }
                <CardFooter className="flexCenter  before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-md rounded-small bottom-1 w-[calc(80%_-_0px)] shadow-large ml-1 z-10">
                  <Button className="text-white bg-red-600/70 hoverScale text-tiny" variant="flat" color="danger" radius="sm" size="sm" onClick={()=>{
                    handleMoveToTrash(file.id)
                    window.location.reload()
                  }}>
                    Delete
                  </Button>
                  <Button className="text-white hoverScale text-tiny bg-black/20" variant="flat" color="default" radius="sm" size="sm" onClick={()=>{
                    handleDownload(file.id,file.file_name);
                  }}>
                    Download
                  </Button>
                </CardFooter>
              </Card>
          </>
        ))}
      </div>
    </div>
  );
};

export default FileList;
