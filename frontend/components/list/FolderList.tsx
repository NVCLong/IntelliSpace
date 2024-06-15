import 'react-toastify/dist/ReactToastify.css';

import copy from 'copy-to-clipboard';
import React, { useState } from 'react';
import { MdFolder } from 'react-icons/md';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { FiEdit3, FiShare, FiTrash2 } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';

import { deleteFolder, shareFolderCode, updateFolder } from '@/lib/apiCall';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  folders: Folder[];
  parentFolderId: string;
}

// @ts-ignore
const FolderList: React.FC<FolderListProps> = ({ folders, parentFolderId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  let storageId: string | null;
  let userId: string | null;
  if (typeof window !== 'undefined') {
    storageId = localStorage.getItem('storageID');
    userId = localStorage.getItem('userId');
  }

  const [folderName, setFolderName] = useState('');
  const [currentFolderId, setCurrenFolderId] = useState('');

  const handleDelete = (folderId: number) => {
    // @ts-ignore
    if (storageId !== null) {
      deleteFolder(storageId, folderId);
      // console.log(response)
    }
  };
  const handleChangeFolder = (folderId: string) => {
    setCurrenFolderId(folderId);
  };
  const handleInput = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setFolderName(e.target.value);
  };

  const handleShareFolder = async (folderId: string) => {
    const response = await shareFolderCode(folderId, storageId, userId);
    // console.log(response);
    toast.success(
      <div>
        Code: {response}
        <br />
        Copied to clipboard
      </div>,
    );
    copy(response);
  };

  const handleUpdate = async (folderId: string) => {
    const newFolder = {
      name: folderName,
    };
    // @ts-ignore
    if (storageId !== null) {
      await updateFolder(storageId, folderId, newFolder);
      window.location.reload();

      // console.log(response)
    }
  };
  const handleOpen = async (folderId: string) => {
    if (storageId !== null) {
      localStorage.setItem('folderId', folderId);
    }
  };

  return (
    <div className="flex flex-col p-3 overflow-hidden sm:py-12">
      <ToastContainer
        position="bottom-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="grid gap-6 md:grid-cols-4 grid-col-2 xl:grid-cols-6">
          {folders.map((folder) => (
            <div key={folder.id}>
              <ContextMenu>
                <ContextMenuTrigger>
                  <ContextMenuContent className="bg-white rounded-lg w-30">
                    <ContextMenuItem
                      className="hover:bg-slate-600 "
                      onClick={() => {
                        handleShareFolder(folder.id);
                      }}
                    >
                      <ContextMenuLabel className="flex hover:text-white">
                        <FiShare size={20} className="mr-2" />
                        Share
                      </ContextMenuLabel>
                    </ContextMenuItem>
                    <hr className="h-px bg-gray-200 border-0"></hr>
                    <ContextMenuItem
                      className="hover:bg-slate-600 "
                      onClick={(e) => {
                        handleChangeFolder(folder.id);
                        onOpen();
                      }}
                    >
                      <ContextMenuLabel className="flex hover:text-white">
                        <FiEdit3 size={20} className="mr-2" />
                        Rename
                      </ContextMenuLabel>
                    </ContextMenuItem>
                    <hr className="h-px bg-gray-200 border-0"></hr>
                    <ContextMenuItem
                      className="hover:bg-slate-600"
                      onClick={() => {
                        handleDelete(Number.parseInt(folder.id));
                        window.location.reload();
                      }}
                    >
                      <ContextMenuLabel className="flex hover:text-white">
                        <FiTrash2 size={20} className="mr-2" />
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
                    className="flex items-center w-40 p-3 bg-white rounded-md shadow-md cursor-pointer h-15 hoverScale"
                  >
                    <div className="flex-shrink-0">
                      <MdFolder className="text-blue-400 fixed-icon-size" />
                    </div>
                    <span className="ml-3 truncate max-w-[13ch]">
                      {folder.name}
                    </span>
                  </div>
                </ContextMenuTrigger>
              </ContextMenu>
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="opaque"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Folder options
                      </ModalHeader>

                      <ModalBody>
                        <p>
                          {' '}
                          If you want to change folder name please fill in the
                          blank
                        </p>
                        <Input
                          value={folderName}
                          onChange={handleInput}
                          placeholder="Enter folder name"
                          variant="bordered"
                        />
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          color="primary"
                          onPress={(e) => {
                            handleUpdate(currentFolderId);
                          }}
                        >
                          Edit
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FolderList;
