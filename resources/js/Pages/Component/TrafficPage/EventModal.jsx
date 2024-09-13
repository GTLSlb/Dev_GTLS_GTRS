import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Divider,
    useDisclosure,
} from "@nextui-org/react";

function EventModal({ onOpenChange, isOpen, onOpen }) {
    return (
        <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Event Detail
                        </ModalHeader>
                        <ModalBody>
                            <div>
                                <p className=" text-lg font-bold">Location</p>
                            </div>
                            <Divider />
                            <div className="grid grid-cols-2">
                                <div className="grid grid-cols-2">
                                    <p className="font-bold">State</p>
                                    <p>Lagos</p>
                                </div>
                                <div className="grid grid-cols-2">
                                    <p className="font-bold">Suburb</p>
                                    <p>Lagos</p>
                                </div>
                                <div className="grid grid-cols-2">
                                    <p className="font-bold">Road Name</p>
                                    <p>Lagos</p>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Action
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default EventModal;
