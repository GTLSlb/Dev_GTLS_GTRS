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
    Spinner,
    Accordion,
    AccordionItem,
    Avatar,
} from "@nextui-org/react";

function EventModal({
    onOpenChange,
    isOpen,
    eventDetails,
    loading,
    getEventCategoryById,
}) {
    console.log(eventDetails);
    return (
        <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col text-[#252525BF] font-bold text-2xl gap-1">
                            Event Detail
                        </ModalHeader>

                        <ModalBody>
                            {loading ? (
                                <Spinner color="primary" />
                            ) : (
                                <Accordion variant="splitted">
                                    {eventDetails?.map((event) => (
                                        <AccordionItem
                                            key={event.id}
                                            title={`${event.event_type}`}
                                            startContent={
                                                <Avatar
                                                    isBordered
                                                    color="primary"
                                                    radius="lg"
                                                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                                                />
                                            }
                                            subtitle={`${event.road_name}-${event.suburb}`}
                                        >
                                            <div className="flex flex-col gap-2 ">
                                                <p className="text-gray-400 text-sm">{`${event.start_date} - ${event.end_date}`}</p>
                                                <p className="text-gray-400 text-sm">Advice</p>
                                                <p className="font-semibold text-sm">{event.advice}</p>
                                                <p className="text-gray-400 text-sm">Other Advice</p>
                                                <p className="font-semibold text-sm" dangerouslySetInnerHTML={{ __html: event.otherAdvice }}></p>
                                            </div>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                color="danger"
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
}

export default EventModal;
