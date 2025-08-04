import { CustomModal } from "@/Components/common/CustomModal";
import { ArrowsPointingOutIcon, FunnelIcon } from "@heroicons/react/24/outline";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Popover,
    PopoverContent,
    PopoverTrigger,
    useDisclosure,
    Divider,
} from "@heroui/react";
import { ResponsiveContainer } from "recharts";

export function ChartWrapper({
    children,
    title,
    cardClassName,
    bodyClassName,
    headerClassName,
    onModalOpen,
    onModalClose,
    filterChildren,
    modalSize
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleModalOpen = () => {
        if (onModalOpen) {
            onModalOpen();
        }
        onOpen();
    };

    const handleModalClose = () => {
        if (onModalClose) {
            onModalClose();
        }
        onClose();
    };

    return (
        <>
            <Card className={` ${cardClassName} `}>
                <CardHeader className={`flex flex-col py-1 ${headerClassName}`}>
                    <div className="flex justify-between w-full items-center">
                        {title}
                        <div>
                            <Button
                                variant="light"
                                isIconOnly
                                size="sm"
                                onPress={handleModalOpen}
                            >
                                <ArrowsPointingOutIcon className="w-4 h-4" />
                            </Button>
                            <Popover placement="bottom-end" showArrow={true}>
                                <PopoverTrigger>
                                    <Button
                                        variant="light"
                                        isIconOnly
                                        size="sm"
                                    >
                                        <FunnelIcon className="w-4 h-4" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="p-4 w-52">
                                    {filterChildren}
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <Divider />
                </CardHeader>
                <CardBody
                    className={`flex justify-center self-center items-center relative h-60 p-0 ${bodyClassName}`}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        {children}
                    </ResponsiveContainer>
                </CardBody>
            </Card>

            <CustomModal
                isOpen={isOpen}
                onClose={handleModalClose}
                title={title}
                filterChildren={filterChildren}
                size={modalSize}
            >
                <div className="p-4">{children}</div>
            </CustomModal>
        </>
    );
}
