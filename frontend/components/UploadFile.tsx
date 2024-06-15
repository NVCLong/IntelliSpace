import React, { useState } from 'react';
import { FiArrowUpCircle, FiShare } from 'react-icons/fi';
import { uploadFile } from '@/lib/apiCall';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const UploadFile = () => {
  const [file, setFile] = useState({
    file: null,
  });
  let folderId: string | null;
  let storageId: string | null;
  let userId: string | null;
  if (typeof window !== 'undefined') {
    folderId = localStorage.getItem('folderId');
    storageId = localStorage.getItem('storageID');
    userId = localStorage.getItem('userId');
  }

  const handleSubmit = async () => {
    if (folderId !== null && file !== null) {
      // console.log('create folder')
      // @ts-ignore
      const response = await uploadFile(userId, folderId, storageId, file.file);
      if (response.toLowerCase().includes('is not enough')) {
        toast.error(`Submit failed: ${response}`);
      }
      console.log(response);
      window.location.reload();
    } else {
      toast.error('File is null');
      console.log('file is null');
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    // @ts-ignore
    const selectedFile = event.target.files[0];
    console.log(event.target.files);

    if (selectedFile) {
      toast.success('Have file');
      // @ts-ignore
      setFile({ file: selectedFile });
      const fileNameElement = document.getElementById('selectedFileName');
      if (fileNameElement) {
        fileNameElement.textContent = selectedFile.name;
      }
    } else {
      toast.error('No file selected.');
    }
  };
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleClose = () => {
    setFile({ file: null });
    onClose();
  };

  return (
    <div className="">
      <button
        className="p-2 text-gray-600 bg-white border rounded-full shadow-md cursor-pointer sm:px-4 sm:gap-2 flexCenter hoverScale"
        onClick={onOpen}
      >
        <FiArrowUpCircle size={24} />
        <span className="hidden font-semibold sm:flex">Upload file</span>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload file
              </ModalHeader>

              <ModalBody>
                <div className="w-full flexCenter">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-300"
                  >
                    <input
                      id="dropzone-file"
                      onChange={handleFileChange}
                      type="file"
                      className="hidden"
                    />
                    <FiShare className="text-gray-500 size-6" />
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        DOCX, TXT, PNG, JPG (MAX. 100MB)
                      </p>
                    </div>
                    <p
                      id="selectedFileName"
                      className="mb-2 text-sm text-gray-500"
                    ></p>
                  </label>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="flat" onPress={handleClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={(e) => {
                    handleSubmit();
                  }}
                >
                  Upload
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
