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
                        <ModalHeader className="flex flex-col text-[#252525BF] font-bold text-2xl gap-1">
                            Event Detail
                        </ModalHeader>

                        <ModalBody>
                            {loading ? (
                                <Spinner color="primary" />
                            ) : (
                                <>
                                    {/* Location details */}
                                    <div>
                                        <p className=" text-lg font-bold ">
                                            Location
                                        </p>
                                    </div>
                                    <Divider />
                                    <div className="grid lg:grid-cols-3 gap-y-3">
                                        <div className="grid grid-cols-2 items-end">
                                            <p className="text-[#252525BF]">
                                                State
                                            </p>
                                            <p className="text-sm">
                                                {eventDetails?.api_source}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 items-end">
                                            <p className="text-[#252525BF]">
                                                Suburb
                                            </p>
                                            <p className="text-sm">
                                                {eventDetails?.suburb}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 items-end">
                                            <p className="text-[#252525BF]">
                                                Road Name
                                            </p>
                                            <p className="text-sm">
                                                {eventDetails?.road_name}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Duration details */}
                                    <div className="mt-5">
                                        <p className=" text-lg font-bold">
                                            Duration
                                        </p>
                                    </div>
                                    <Divider />
                                    <div className="grid lg:grid-cols-3 gap-y-3">
                                        <div className="grid grid-cols-2 items-end">
                                            <p className="text-[#252525BF]">
                                                Start Date
                                            </p>
                                            <p className="text-sm">
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
                                        <div className="grid grid-cols-2 items-end">
                                            <p className="text-[#252525BF]">
                                                End Date
                                            </p>
                                            <p className="text-sm ">
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
                                        <div className="grid grid-cols-2 items-end">
                                            <p className="text-[#252525BF]">
                                                Duration Impact
                                            </p>
                                            <p className="text-sm">
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
                                    <div className="grid lg:grid-cols-3 gap-y-3">
                                        <div className="grid grid-cols-2 items-end">
                                            <p className="text-[#252525BF]">
                                                Event type
                                            </p>
                                            <p className="text-sm">
                                                {getEventCategoryById(
                                                    eventDetails.event_category_id
                                                )}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 items-end">
                                            <p className="text-[#252525BF]">
                                                Impact
                                            </p>
                                            <p className="text-sm">
                                                {eventDetails.impact}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2  items-end">
                                            <p className="text-[#252525BF]">
                                                Traffic Direction
                                            </p>
                                            <p className="text-sm">
                                                {eventDetails.traffic_direction}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <div className="">
                                            <p className="text-[#252525BF]">Advice</p>
                                            <p className="mt-2">{eventDetails.advice}</p>
                                        </div>
                                        <div className="mt-5">
                                            <p className="text-[#252525BF]">
                                                Information
                                            </p>
                                            <p className="mt-2">{eventDetails.information}</p>
                                        </div>
                                        <div className="mt-5">
                                            <p className="text-[#252525BF]">
                                                Other Advice
                                            </p>
                                            <p
                                                className="mt-2 overflow-auto pr-2 containerscroll"
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
