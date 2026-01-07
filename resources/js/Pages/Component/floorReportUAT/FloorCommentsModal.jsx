import { CustomContext } from "@/CommonContext";
import { formatDateWithTimeToSydney } from "@/CommonFunctions";
import { isNull } from "@antv/util";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Divider,
} from "@heroui/react";
import { useMemo } from "react";

const FloorCommentsModal = ({
    isOpen,
    onOpenChange,
    commentsData,
    handleAddComments,
}) => {
    const comments = commentsData?.Comments ?? [];

    // Sort comments by AddedAt (newest first)
    const sortedComments = useMemo(() => {
        return [...comments].sort((a, b) => {
            const dateA = new Date(a.AddedAt).getTime();
            const dateB = new Date(b.AddedAt).getTime();
            return dateB - dateA; // Newest first
        });
    }, [comments]);

    if (!isOpen || isNull(sortedComments) || sortedComments.length === 0)
        return null;

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
                        <ModalHeader className="flex flex-col gap-1">
                            Comments for: {commentsData?.ConsignmentNo}
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-3">
                                {sortedComments.length > 0 ? (
                                    sortedComments.map((item, index) => (
                                        <div
                                            className="flex flex-col gap-1"
                                            key={index}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="p-2 rounded">
                                                        <p className="text-gray-800 mb-2">
                                                            {item.Comment}
                                                        </p>
                                                        <p className="text-gray-500 text-sm">
                                                            {item.AddedBy} -{" "}
                                                            {formatDateWithTimeToSydney(
                                                                item.AddedAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Divider />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-6">
                                        No comments yet
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="default"
                                variant="light"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default FloorCommentsModal;