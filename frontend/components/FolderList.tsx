"use client";
import React, {useState} from "react";
import { MdFolder } from "react-icons/md";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure
} from "@nextui-org/react";
import {deleteFolder, openFolder, updateFolder} from "@/lib/apiCall";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  folders: Folder[],
  parentFolderId: string
}

// @ts-ignore
const FolderList: React.FC<FolderListProps> = ({ folders,parentFolderId}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [folderName,setFolderName]=useState('');
    const  storageId= localStorage.getItem("storageID")
    const [currentFolderId, setCurrenFolderId]=useState('');

    const handleDelete=(folderId:number)=>{
       // @ts-ignore
        if(storageId!==null) {
            const response = deleteFolder(storageId, folderId)
            console.log(response)
        }
    }
    const handleChangeFolder=(folderId:string)=>{
        setCurrenFolderId(folderId);
    }
    const handleInput = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setFolderName(e.target.value);
    }
    const handleUpdate= (folderId: string)=>{
        const  newFolder={
            name: folderName
        }
        // @ts-ignore
        if(storageId!==null) {
            const response = updateFolder(storageId, folderId, newFolder)
            console.log(response)
        }
    }
    const handleOpen = async (folderId: string) => {
      onOpen();
      if (storageId !== null) {
        localStorage.setItem("folderId", folderId);
      }
    }


  return (
    <div className="pr-10 mt-32 mr-10 -ml-96">
      <div className="grid grid-cols-1 pt-10 pl-10 mt-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-7">
        {folders.map((folder) => (
          <ContextMenu>
            <ContextMenuTrigger>
              <ContextMenuContent className="w-64 bg-slate-200 ">
                {/* <ContextMenuItem
                  className="hover:bg-slate-600 "
                  onClick={(e) => {
                    handleOpen(currentFolderId);
                    window.location.reload();
                  }}
                >
                  <ContextMenuLabel className="hover:text-white">
                    Open
                  </ContextMenuLabel>
                </ContextMenuItem> */}

                <ContextMenuItem
                  className="hover:bg-slate-600 "
                  onClick={(e) => {
                    handleUpdate(currentFolderId);
                    window.location.reload();
                  }}
                >
                  <ContextMenuLabel className="hover:text-white">
                    Edit
                  </ContextMenuLabel>
                </ContextMenuItem>

                <ContextMenuItem
                  className="hover:bg-slate-600"
                  onClick={() => {
                    handleDelete(Number.parseInt(currentFolderId));
                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  }}
                >
                  <ContextMenuLabel className="hover:text-white">
                    Delete
                  </ContextMenuLabel>
                </ContextMenuItem>
              </ContextMenuContent>
              <div
                key={folder.id}
                onClick={() => {
                  handleOpen(folder.id);
                  window.location.reload();
                }}
                className="flex items-center p-2 bg-white border rounded-md shadow-md cursor-pointer hoverScale"
              >
                <MdFolder className="text-blue-400" size={24} />
                <span className="ml-4 truncate">{folder.name}</span>
              </div>
            </ContextMenuTrigger>
          </ContextMenu>

          /* <Modal
              backdrop="blur"
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="center"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Folder options
                    </ModalHeader>

                    <ModalBody>
                      <p>
                        {" "}
                        If you want to change folder name please fill in the
                        blank
                      </p>
                      <Input
                        autoFocus
                        value={folderName}
                        onChange={handleInput}
                        placeholder="Enter folder name"
                        variant="bordered"
                      />
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        color="danger"
                        variant="flat"
                        onPress={() => {
                          handleDelete(Number.parseInt(currentFolderId));
                          onClose();
                          setTimeout(() => {
                            window.location.reload();
                          }, 2000);
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        color="primary"
                        onPress={(e) => {
                          handleOpen(currentFolderId, "blur");
                          onClose();
                          window.location.reload();
                        }}
                      >
                        Open
                      </Button>
                      <Button
                        color="primary"
                        onPress={(e) => {
                          handleUpdate(currentFolderId);
                          window.location.reload();
                        }}
                      >
                        Edit
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal> */
        ))}
      </div>
    </div>
  );
};

export default FolderList;
