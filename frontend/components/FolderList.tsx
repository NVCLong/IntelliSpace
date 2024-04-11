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
import {deleteFolder, updateFolder} from "@/lib/apiCall";

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  folders: Folder[];
}

const FolderList: React.FC<FolderListProps> = ({ folders }) => {
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
    const handleChangeFolder=(folderId)=>{
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


  return (
    <div className="-ml-60 mt-28">

      <div className="grid grid-cols-1 pt-10 pl-20 mt-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-7">
        {folders.map((folder) => (
            <>
          <div
              key={folder.id}
            onClick={()=>{
                handleChangeFolder(folder.id)
                onOpen()
            }}
            className="flex items-center p-4 bg-white border rounded-md shadow-md cursor-pointer hoverScale"
          >
            <MdFolder className="text-blue-400" size={24} />
            <span className="ml-4">{folder.name}</span>
          </div>

            <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center">
          <ModalContent>
              {(onClose) => (
                  <>
                      <ModalHeader className="flex flex-col gap-1">Folder Options</ModalHeader>

                      <ModalBody>
                          <p> If you want to change folder name please fill in the blank</p>
                          <Input
                              autoFocus
                              value={folderName}
                              onChange={handleInput}
                              placeholder="Enter folder name"
                              variant="bordered"
                          />
                      </ModalBody>

                      <ModalFooter>
                          <Button color="danger" variant="flat" onPress={()=>{
                              handleDelete(Number.parseInt(currentFolderId))
                              onClose();
                              setTimeout(()=>{
                                  window.location.reload();
                              },2000)

                          }}>
                              Delete
                          </Button>
                          <Button color="primary" onPress= {(e) => {
                              onClose();
                              window.location.reload();
                          }}>
                              Open
                          </Button>
                          <Button color="primary" onPress= {(e) => {
                              handleUpdate(currentFolderId)
                              window.location.reload();
                          }}>
                              Edit
                          </Button>
                      </ModalFooter>
                  </>
              )}
          </ModalContent>
      </Modal>
        </>
        ))}
      </div>


    </div>


  );
};

export default FolderList;
