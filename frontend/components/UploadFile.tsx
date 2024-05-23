import React from 'react'
import { FiArrowUpCircle, FiShare } from 'react-icons/fi';
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
  let folderId: string | null;
  let storageId: string | null;
  let userId: string | null;
  if (typeof window !== 'undefined') {
    folderId = localStorage.getItem('folderId')
    storageId = localStorage.getItem('storageID')
    userId = localStorage.getItem('userId')
  }

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
      const fileNameElement = document.getElementById('selectedFileName');
      if (fileNameElement) {
        fileNameElement.textContent = selectedFile.name;
      }
    } else {
      //   console.warn('No file selected.')
      toast.error('No file selected.')
    }
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure()




  return (
    <div className="ml-5">
      <Button
        className="px-4 py-2 text-gray-600 bg-white border rounded-full shadow-md cursor-pointer flexCenter hoverScale"
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
                <div className="w-full flexCenter">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-300"
                  >
                    <input
                      id="dropzone-file"
                      onChange={
                        handleFileChange
                      }
                      type="file"
                      className="hidden"
                    />
                    <FiShare className="text-gray-500 size-6" />
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500">DOCX, TXT, PNG, JPG (MAX. 100MB)</p>
                    </div>
                    <p id="selectedFileName" className="mb-2 text-sm text-gray-500"></p>
                  </label>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
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
