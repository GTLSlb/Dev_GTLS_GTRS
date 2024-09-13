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
} from "@nextui-org/react";

function EventModal({
    onOpenChange,
    isOpen,
    eventDetails,
    loading,
    getEventCategoryById,
}) {
    return (
        <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col text-2xl gap-1">
                            Event Detail
                        </ModalHeader>

                        <ModalBody>
                            {loading ? (
                                <Spinner color="primary" />
                            ) : (
                                <>
                                    {/* Location details */}
                                    <div>
                                        <p className=" text-lg font-bold">
                                            Location
                                        </p>
                                    </div>
                                    <Divider />
                                    <div className="grid grid-cols-2 gap-y-3">
                                        <div className="grid grid-cols-2">
                                            <p className="font-bold">State</p>
                                            <p>{eventDetails?.api_source}</p>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <p className="font-bold">Suburb</p>
                                            <p>{eventDetails?.suburb}</p>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <p className="font-bold">
                                                Road Name
                                            </p>
                                            <p>{eventDetails?.road_name}</p>
                                        </div>
                                    </div>

                                    {/* Duration details */}
                                    <div className="mt-5">
                                        <p className=" text-lg font-bold">
                                            Duration
                                        </p>
                                    </div>
                                    <Divider />
                                    <div className="grid grid-cols-2 gap-y-3">
                                        <div className="grid grid-cols-2">
                                            <p className="font-bold">
                                                Start Date
                                            </p>
                                            <p>
                                                {moment(
                                                    eventDetails?.start_date
                                                ).format(
                                                    "DD-MM-YYYY hh:mm A"
                                                ) == "Invalid date"
                                                    ? ""
                                                    : moment(
                                                          eventDetails?.start_date
                                                      ).format(
                                                          "DD-MM-YYYY hh:mm A"
                                                      )}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <p className="font-bold">
                                                End Date
                                            </p>
                                            <p>
                                                {moment(
                                                    eventDetails?.end_date
                                                ).format(
                                                    "DD-MM-YYYY hh:mm A"
                                                ) == "Invalid date"
                                                    ? ""
                                                    : moment(
                                                          eventDetails?.end_date
                                                      ).format(
                                                          "DD-MM-YYYY hh:mm A"
                                                      )}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <p className="font-bold">
                                                Duration Impact
                                            </p>
                                            <p>
                                                {parseFloat(
                                                    eventDetails?.hours_difference
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Event details */}
                                    <div className="mt-5">
                                        <p className=" text-lg font-bold">
                                            Event Details
                                        </p>
                                    </div>
                                    <Divider />
                                    <div className="grid grid-cols-2 gap-y-3">
                                        <div className="grid grid-cols-2">
                                            <p className="font-bold">
                                                Event type
                                            </p>
                                            <p>
                                                {getEventCategoryById(
                                                    eventDetails.event_category_id
                                                )}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <p className="font-bold">Impact</p>
                                            <p>{eventDetails.impact}</p>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <p className="font-bold">
                                                Traffic Direction
                                            </p>
                                            <p>
                                                {eventDetails.traffic_direction}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Other details */}
                                    <div className="mt-5">
                                        <p className=" text-lg font-bold">
                                            Other Details
                                        </p>
                                    </div>
                                    <Divider />
                                    <div className="grid grid-cols-2 gap-y-3">
                                        <div className="grid grid-cols-2">
                                            <p className="font-bold">Advice</p>
                                            <p>{eventDetails.advice}</p>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <p className="font-bold">
                                                Information
                                            </p>
                                            <p>{eventDetails.information}</p>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <p className="font-bold">
                                                Other Advice
                                            </p>
                                            <p
                                                className="font-thin max-w-60 max-h-[300px] overflow-auto pr-2 containerscroll"
                                                style={{
                                                    wordBreak: "break-word",
                                                    hyphens: "auto",
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: eventDetails.otherAdvice,
                                                }}
                                            ></p>
                                        </div>
                                    </div>
                                </>
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
