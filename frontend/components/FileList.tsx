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
import { deleteFolder, openFolder, updateFolder } from "@/lib/apiCall";
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

  const [fileName, setFileName] = useState("");
  const storageId = localStorage.getItem("storageID");
  const [currentFolderId, setCurrenFolderId] = useState("");

  const handleDelete = (folderId: number) => {};

  // const handleDownload = async (folderId: string) => {

  // }
  console.log(files)

  // const fileExtension = file.file_name.split(".")[1]
  //         console.log(fileExtension)

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
                <Image
                  alt="image file icon"
                  className="object-none"
                  src="/imageIcon.png"
                  width={300}
                  height={300}
                />
                <CardFooter className="flexCenter  before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-md rounded-small bottom-1 w-[calc(80%_-_0px)] shadow-large ml-1 z-10">
                  <Button className="text-white bg-red-600/70 hoverScale text-tiny" variant="flat" color="danger" radius="sm" size="sm">
                    Delete
                  </Button>
                  <Button className="text-white hoverScale text-tiny bg-black/20" variant="flat" color="default" radius="sm" size="sm">
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
