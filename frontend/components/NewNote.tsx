import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { FiFolderPlus } from 'react-icons/fi';
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
import { toast, ToastContainer } from 'react-toastify';

import { createNote } from '@/lib/apiCall';

export const NewNote = (userId: any) => {
  const [noteContent, setNoteContent] = React.useState('');
  const [noteTitle, setNoteTitle] = React.useState('');

  const handleInputTitle = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNoteTitle(e.target.value);
    // console.log(noteTitle)
  };

  const handleInputContent = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNoteContent(e.target.value);
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async () => {
    const request = {
      title: noteTitle,
      content: noteContent,
    };
    // console.log(request)
    const response = await createNote(userId.userId, request);
    console.log(response);
    toast.success('Create note');
    setNoteTitle('');
    setNoteContent('');
  };

  return (
    <div className="mt-24 ml-20 font-serif font-medium">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Button
        className="flex items-center px-4 py-2 text-gray-600 bg-white border rounded-full shadow-md cursor-pointer hoverScale"
        color="primary"
        onPress={onOpen}
      >
        <FiFolderPlus size={24} />
        <span className="font-semibold md:block">New note</span>
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create new note
              </ModalHeader>

              <ModalBody>
                <Input
                  autoFocus
                  value={noteTitle}
                  onChange={handleInputTitle}
                  placeholder="Enter note title"
                  variant="underlined"
                />
                <Input
                  value={noteContent}
                  onChange={handleInputContent}
                  placeholder="Enter note content"
                  variant="bordered"
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={(e) => {
                    handleSubmit();
                    window.location.reload();
                  }}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
