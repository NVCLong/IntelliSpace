import React from "react";
import { FiArrowUpCircle } from "react-icons/fi";
import { uploadFile} from "@/lib/apiCall";
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

export const UploadFile = () => {
    const [file, setFile] = React.useState({
        file: null
    });
    const folderId=localStorage.getItem("folderId")
    const storageId= localStorage.getItem("storageID")
    const userId= localStorage.getItem("userId")
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        // @ts-ignore
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            console.log("Have file")
            console.log(selectedFile)
            // @ts-ignore
            setFile({file: selectedFile});
        } else {
            console.warn("No file selected.");
        }
    };

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleSubmit =async  () => {

        if (folderId!== null && file !==null) {
            console.log("create folder")
            // @ts-ignore
            const response = await uploadFile(userId,folderId,storageId,file.file )

            console.log(response)
        }else {
            console.log("file is null")
        }

    };

    return (
        <div className="mt-24 ml-5">
            <Button
                className="flex items-center px-4 py-2 text-gray-600 bg-white border rounded-full shadow-md cursor-pointer hoverScale"
                color="primary"
                onPress={onOpen}
            >
                <FiArrowUpCircle size={24} />
                <span className="font-semibold md:block">Upload file</span>
            </Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Upload file</ModalHeader>

                            <ModalBody>
                                <Input
                                    type="file"
                                    onChange={handleFileChange}
                                    placeholder="Choose file"
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
