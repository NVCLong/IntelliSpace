import React from "react";
import { FiFolderPlus } from "react-icons/fi";
import { createRootFolder } from "../lib/apiCall";
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

export const NewFolder = () => {
  const handleNewFolder = () => {
    return () => {};
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="mt-24 ml-20">
      <Button
        className="flex items-center px-4 py-2 text-gray-600 bg-white border rounded-full shadow-md cursor-pointer hoverScale"
        color="primary"
        onPress={onOpen}
      >
        <FiFolderPlus size={24} />
        <span className="ml-4 font-semibold md:block">Create folder</span>
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="auto"
        className="flex"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>

              <ModalBody>
                <Input
                  autoFocus
                  label="Folder name"
                  placeholder="Enter folder name"
                  variant="bordered"
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
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
