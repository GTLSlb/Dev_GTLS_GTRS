import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Textarea,
    Spinner,
} from "@heroui/react";
import { useState } from "react";

const AddFloorCommentsModal = ({
    isOpen,
    onOpenChange,
    commentsData,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        Comment: commentsData.Comment || "",
        ConsId: commentsData?.ConsId,
        FloorCommentId: commentsData?.FloorCommentId || null,
    });

    console.log("Form Data State:", formData.Comment, commentsData.Comment);
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        console.log("Form Data Submitted:", formData);
        setTimeout(() => {
            setIsLoading(false);
            onOpenChange(false);
        }, 2000);
    };

    if (!isOpen) return null;
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="3xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <form onSubmit={handleSubmit}>
                            <ModalHeader className="flex flex-col gap-1">
                                Add comment
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-3">
                                    <Textarea
                                        label="Comments"
                                        aria-labelledby="comments"
                                        placeholder="Enter comments"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={commentsData.Comment}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                Comment: value,
                                            }))
                                        }
                                        classNames={{
                                            input: "bg-transparent px-0 !outline-none !border-none !ring-0 p-0",
                                        }}
                                        minRows={3}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    type="submit"
                                    color="primary"
                                    spinner={<Spinner size="sm" />}
                                    className="bg-gray-800 min-w-20"
                                >
                                    {isLoading ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default AddFloorCommentsModal;
