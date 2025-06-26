import React from "react";
import PropTypes from "prop-types";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Spinner,
    Accordion,
    AccordionItem,
    Image,
} from "@nextui-org/react";
import Roadworks from "@/assets/icons/RoadWork.png";
import Alpine from "@/assets/icons/Alpine.png";
import Flooding from "@/assets/icons/Flooding.png";
import Congestion from "@/assets/icons/Congestion.png";
import Hazard from "@/assets/icons/Hazard.png";
import RegionalLGA from "@/assets/icons/RegionalLGA.png";
import Incident from "@/assets/icons/Incident.png";
import Major from "@/assets/icons/Major.png";
import Other from "@/assets/icons/Other.png";

const eventTypeMapping = {
    Roadworks: ["ROADWORKS", "24HR ROADWORKS", "Roadwork", "Roadworks"],
    Alpine: ["Alpine"],
    Flooding: ["Flooding"],
    Congestion: ["Congestion"],
    Hazard: ["Hazard", "Vehicle fire", "Fire", "Vehicle rollover", "Landslip"],
    "Regional LGA Incident": ["Regional LGA Incident", "Emergency Incident"],
    "Major Event": ["Major Event", "Special event", "Demonstration"],
    Incident: [
        "INCIDENT",
        "COLLISION",
        "Incident",
        "Crash",
        "Emergency Incident",
    ],
    Other: ["Equipment damage", "Equipment fault"],
};

const iconMappings = {
    Roadworks,
    Alpine,
    Flooding,
    Congestion,
    Hazard,
    "Regional LGA Incident": RegionalLGA,
    "Major Event": Major,
    Incident,
    Other,
};

function EventModal({
    onOpenChange,
    isOpen,
    eventDetails = [],
    loading,
}) {
     const getIcon = (eventType) => {
       
        const mainCategory = Object.keys(eventTypeMapping).find((category) =>
            eventTypeMapping[category].includes(eventType)
        );
        const iconUrl =
            iconMappings[mainCategory] ||
            "https://qldtraffic.qld.gov.au/images/roadevents/SpecialEvents.png";
        return {
            url: iconUrl,
        };
    };
    return (
        <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
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
                                                <Image
                                                    radius="lg"
                                                    width={40}
                                                    src={getIcon(event.event_type).url}
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

EventModal.propTypes = {
    onOpenChange: PropTypes.func,
    isOpen: PropTypes.bool,
    eventDetails: PropTypes.array,
    loading: PropTypes.bool,
};

export default EventModal;
