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
import { useContext } from "react";

const FloorCommentsModal = ({
    isOpen,
    onOpenChange,
    commentsData,
    handleAddComments,
}) => {
    const { userPermissions } = useContext(CustomContext);
    const data = commentsData?.Comments ?? [];

    if (!isOpen || isNull(data)) return null;
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
                            Comments for: {commentsData.ConsignmentNo}
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-3">
                                {data.map((item, index) => (
                                    <div
                                        className="flex flex-col gap-1"
                                        key={index}
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                {item.Comment}
                                                <p className="text-gray-500 text-sm">
                                                    {item.AddedBy} -{" "}
                                                    {formatDateWithTimeToSydney(
                                                        item.AddedAt
                                                    )}
                                                </p>
                                            </div>

                                            {/* {canAddEditFloorComments(
                                                userPermissions
                                            ) && (
                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    onPress={(e) => {
                                                        handleAddComments(item);
                                                    }}
                                                >
                                                    <PencilIcon className="h-4 w-4 text-blue-500" />
                                                </Button>
                                            )} */}
                                        </div>

                                        <Divider />
                                    </div>
                                ))}
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
