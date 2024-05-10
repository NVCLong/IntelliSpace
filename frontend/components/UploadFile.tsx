import React from 'react'
import { FiArrowUpCircle } from 'react-icons/fi'
import { uploadFile } from '@/lib/apiCall'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from '@nextui-org/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const UploadFile = () => {
  const [file, setFile] = React.useState({
    file: null
  })
  let folderId:string|null;
  let storageId:string|null;
  let userId:string|null;
  if(typeof window !=='undefined') {
    folderId = localStorage.getItem('folderId')
    storageId = localStorage.getItem('storageID')
    userId = localStorage.getItem('userId')
  }
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    // @ts-ignore
    const selectedFile = event.target.files[0]

    if (selectedFile) {
      toast.success('Have file')
      //   console.log('Have file')
      //   console.log(selectedFile)
      // @ts-ignore
      setFile({ file: selectedFile })
    } else {
      //   console.warn('No file selected.')
      toast.error('No file selected.')
    }
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const handleSubmit = async () => {
    if (folderId !== null && file !== null) {
      // console.log('create folder')
      // @ts-ignore
      const response = await uploadFile(userId, folderId, storageId, file.file)
      if (response.toLowerCase().includes('is not enough')) {
        toast.error(`Submit failed: ${response}`)
        // alert(response)
      }
      // console.log(response)
    } else {
      toast.error('File is null')
      // console.log('file is null')
    }
  }

  const handleToast = () => {
    toast.success('Test toast')
  }

  return (
    <div className="mt-24 ml-5">
      <Button
        className="flex items-center px-4 py-2 text-gray-600 bg-white border rounded-full shadow-md cursor-pointer hoverScale"
        color="primary"
        onPress={onOpen}
      >
        <FiArrowUpCircle size={24} />
        <span className="font-semibold md:block">Upload file</span>
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
                Upload file
              </ModalHeader>

              <ModalBody>
                <input
                  type="file"
                  onChange={handleFileChange}
                  placeholder="Choose file"
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
