import React from "react";
import { FiFolderPlus } from "react-icons/fi";
import {createFolder, createRootFolder} from "../lib/apiCall";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";

export const NewFolder = (storageID) => {
  const [folderName, setFolderName] = React.useState("");
  const folderId=localStorage.getItem("folderId")
  const handleInput = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setFolderName(e.target.value);
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = () => {
    const request = {
      name : folderName
    }
    if (folderId== null) {
        console.log("create  folder")
        const response = createRootFolder(storageID.storageID, request)

        console.log(response)
    }else{
        console.log("create in sub folder")
        const response= createFolder(storageID.storageID,folderId,request);
        console.log(response)
    }

  };

  return (
    <div className="mt-24 ml-20">
        <Button
            className="flex items-center px-4 py-2 text-gray-600 bg-white border rounded-full shadow-md cursor-pointer hoverScale"
            color="primary"
            onPress={onOpen}
        >
            <FiFolderPlus size={24} />
            <span className="ml-0 font-semibold md:block">Create folder</span>
        </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create folder</ModalHeader>

              <ModalBody>
                <Input
                  autoFocus
                  value={folderName}
                  onChange={handleInput}
                  placeholder="Enter folder name"
                  variant="bordered"
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress= {(e) => {
                  handleSubmit();
                  onClose();
                  window.location.reload();
                }}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
