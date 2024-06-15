'use client';
import React, { useState } from 'react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { downloadSharedFile, softDelete } from '@/lib/apiCall';
import { Card, CardFooter } from '@nextui-org/card';
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { FiDownloadCloud } from 'react-icons/fi';

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
  const [code, setCode] = useState('');
  const [fileId, setFileId] = useState('');
  const [fileName, setFileName] = useState('');

  const handleInput = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCode(e.target.value);
  };

  const handleDownload = async () => {
    try {
      const fileData = await downloadSharedFile(code, fileId, fileName);
      console.log(fileData);
      // @ts-ignore
      const url = window.URL.createObjectURL(fileData);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      setCode('');
    } catch (e) {
      throw e;
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden sm:py-12 sm:px-12">
      <div className="w-full max-w-screen-xl px-4 mx-auto">
        <div className="grid w-full gap-9 xl:grid-cols-6 sm:grid-cols-4">
          {files.map((file) => (
            <div key={file.id}>
              <ContextMenu>
                <ContextMenuTrigger>
                  <ContextMenuContent className="bg-white rounded-lg w-30">
                    <ContextMenuItem
                      className="hover:bg-slate-600 "
                      onClick={() => {
                        setFileId(file.id);
                        setFileName(file.file_name);
                        onOpen();
                      }}
                    >
                      <ContextMenuLabel className="flex hover:text-white">
                        <FiDownloadCloud size={20} className="mr-2" />
                        Download
                      </ContextMenuLabel>
                    </ContextMenuItem>
                  </ContextMenuContent>

                  <Card
                    isFooterBlurred={true}
                    radius="lg"
                    className="border-none hoverScale fixed-card-size gap-4"
                  >
                    {file.file_name?.toLowerCase().includes('png') ||
                    file.file_name?.toLowerCase().includes('jpg') ? (
                      <Image
                        alt="image file icon"
                        src="/imageIcon.png"
                        width={300}
                        height={300}
                      />
                    ) : file.file_name?.toLowerCase().includes('txt') ? (
                      <Image
                        alt="image file icon"
                        className=""
                        src="/txtIcon.png"
                        width={300}
                        height={300}
                      />
                    ) : file.file_name?.toLowerCase().includes('docx') ? (
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
              <Modal
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
                          {' '}
                          If you want to download this file please input the
                          shared code
                        </p>
                        <Input
                          value={code}
                          onChange={handleInput}
                          placeholder="Enter shared code"
                          variant="bordered"
                        />
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          color="primary"
                          onPress={(e) => {
                            handleDownload();
                            onOpenChange();
                          }}
                        >
                          Download
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

export default FileList;
