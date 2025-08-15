import {
    Button,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";

export default function CommentsModal({ commentsData, isOpen, onOpenChange }) {
    return (
        <>
            <Modal
                scrollBehavior="inside"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Approved Comments for:
                                {commentsData[0]}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-3">
                                    {commentsData[18]?.map((item) => (
                                        <div className="flex flex-col gap-1">
                                            <Divider />
                                            <p>{item.Comment}</p>
                                            <p className="text-xs text-gray-400">
                                                {item.AddedAt
                                                    ? moment(
                                                          item.AddedAt
                                                      ).format(
                                                          "DD/MM/YYYY hh:mm A"
                                                      )
                                                    : ""}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    size="sm"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
