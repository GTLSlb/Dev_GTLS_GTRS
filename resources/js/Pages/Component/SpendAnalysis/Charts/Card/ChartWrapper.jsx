import { ArrowsPointingOutIcon, FunnelIcon } from "@heroicons/react/24/outline";
import {
    Button,
    Card,
    CardBody,
    CardHeader, Popover,
    PopoverContent,
    PopoverTrigger,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Divider
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
    filterChildren
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
            onModalClose()
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
                            <Button variant="light" isIconOnly size="sm" onPress={handleModalOpen}>
                                <ArrowsPointingOutIcon className="w-4 h-4" />
                            </Button>
                            <Popover placement="bottom-end" showArrow={true}>
                                <PopoverTrigger>
                                    <Button variant="light" isIconOnly size="sm">
                                        <FunnelIcon className="w-4 h-4" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="p-4">
                                    {filterChildren}
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <Divider />

                </CardHeader>
                <CardBody className={`flex justify-center self-center items-center relative h-60 p-0 ${bodyClassName}`}>
                    <ResponsiveContainer width="100%" height="100%">
                        {children}
                    </ResponsiveContainer>
                </CardBody>
            </Card>
            <Modal backdrop="blur" isOpen={isOpen} size={"5xl"} onClose={handleModalClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                            <ModalBody>
                                <div className="flex gap-4 justify-start items-start">
                                    <div className="flex">
                                        {children}
                                        <Divider orientation="vertical" className="py-2 h-auto" />
                                    </div>
                                    <div className="flex gap-4 h-max ">
                                        <div>
                                            <h1 className="font-bold text-lg mb-2 border-b-2 ">Filter</h1>
                                            {filterChildren}
                                        </div>
                                    </div>

                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}