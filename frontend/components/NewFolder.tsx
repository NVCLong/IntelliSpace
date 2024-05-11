import React from 'react'
import { FiFolderPlus } from 'react-icons/fi'
import { createFolder, createRootFolder } from '../lib/apiCall'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input
} from '@nextui-org/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const NewFolder = (storageID: any) => {
  const [folderName, setFolderName] = React.useState('')
  let folderId:string |null;
  if(typeof window !=='undefined'){
    folderId = localStorage.getItem('folderId')
  }
  const handleInput = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setFolderName(e.target.value)
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const handleSubmit = () => {
    const request = {
      name: folderName
    }
    if (folderId == null) {
      // console.log('create folder')
      const response = createRootFolder(storageID.storageID, request)
      // console.log(response)
      toast.success('Create folder')
    } else {
      // console.log('create in sub folder')
      const response = createFolder(storageID.storageID, folderId, request)
      // console.log(response)
      toast.success('Create in sub-folder')
    }
  }

  return (
    <div className="ml-5">
      <Button
        className="flex items-center px-4 py-2 text-gray-600 bg-white border rounded-full shadow-md cursor-pointer hoverScale"
        color="primary"
        onPress={onOpen}
      >
        <FiFolderPlus size={24} />
        <span className="font-semibold md:block">New folder</span>
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
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create folder
              </ModalHeader>

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
                <Button
                  color="primary"
                  onPress={(e) => {
                    handleSubmit()
                    onClose()
                    window.location.reload();
                  }}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
