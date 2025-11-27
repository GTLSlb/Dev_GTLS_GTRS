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
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { CustomContext } from "@/CommonContext";
import { AlertToast, handleSessionExpiration } from "@/CommonFunctions";
const AddFloorCommentsModal = ({
    isOpen,
    onOpenChange,
    commentsData,
    updateData,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { url, user, Token } = useContext(CustomContext);
    const [formData, setFormData] = useState({
        Comment: commentsData?.Comment || "",
        ConsId: commentsData?.ConsId,
        FloorCommentId: commentsData?.FloorCommentId || null,
    });

    useEffect(() => {
        setFormData({
            Comment: commentsData?.Comment || "",
            ConsId: commentsData?.ConsId,
            FloorCommentId: commentsData?.FloorCommentId || null,
        });
    }, [commentsData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = {
                Comment: formData.Comment,
                ConsId: commentsData.ConsId,
                FloorCommentId: formData.FloorCommentId,
            };
            await axios
                .post(`${url}Floor/Comment`, data, {
                    headers: {
                        UserId: user.UserId,
                        Authorization: `Bearer ${Token}`,
                    },
                })
                .then((response) => {
                    updateData();
                    setIsLoading(false);
                    onOpenChange(false);
                });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    type: "success",
                    icon: "info",
                    confirmButtonText: "OK",
                }).then(async function () {
                    await handleSessionExpiration();
                });
            } else {
                setIsLoading(false);
                onOpenChange(false);
                AlertToast(error.response.data.Message, 2);
                console.error(error.response.data.Message);
            }
        }
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
                                {formData.FloorCommentId
                                    ? "Edit Comment"
                                    : "Add Comment"}{" "}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-3">
                                    <Textarea
                                        label="Comments"
                                        aria-labelledby="comments"
                                        placeholder="Enter comments"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.Comment}
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
