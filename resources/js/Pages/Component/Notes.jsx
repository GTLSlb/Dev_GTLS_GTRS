import {
    Accordion,
    AccordionItem,
    Avatar,
    Button,
    Divider,
    Link,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import React from "react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
    ChevronLeftIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/solid";
import moment from "moment/moment";


export default function Notes({
    incident,
}) {
    const { isOpen, onOpenChange } = useDisclosure();
    const [note, setNote] = useState();
    const deleteType=null

    useEffect(() => {
        if (note) {
            setNote(incident.IncidentNotes.find((n) => n.NoteId === note.NoteId));
        }
    }, [incident]);

    function convertUtcToUserTimezone(utcDateString) {
        // Create a Date object from the UTC date string
        const utcDate = new Date(utcDateString);

        // Get the current user's timezone
        const targetTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const formatter = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: targetTimezone,
        });
        const convertedDate = formatter.format(utcDate);
        return convertedDate;
    }

    
    return (
        <div className="py-2">
            <div className="bg-white rounded-lg shadow-md p-5">
                <div className="flex justify-between items-center">
                    <h1 className="sm:text-2xl text-dark font-bold ">
                        Notes for: {incident.IncidentNo}
                    </h1>

                  
                </div>
                <Divider className="my-4" />
               
                <Accordion selectionMode="multiple">
                    {incident.IncidentNotes?.map((item) => (
                        <AccordionItem
                            key={item.NoteId}
                            aria-label={item.NoteAddedByName}
                            startContent={
                                <Avatar
                                    className="bg-goldd"
                                    radius="md"
                                    icon={<PencilSquareIcon className="w-5" />}
                                />
                            }
                            indicator={
                                <ChevronLeftIcon className="w-5 font-bold text-dark" />
                            }
                            subtitle={
                                item
                                    ? item.NoteAddedAt
                                        ? moment(
                                              convertUtcToUserTimezone(
                                                  item.NoteAddedAt + "Z"
                                              ),
                                              "MM/DD/YYYY, h:mm:ss A"
                                          ).format("DD-MM-YYYY hh:mm A")
                                        : null
                                    : ""
                            }
                            title={
                                <div className="flex justify-between items-center">
                                    <div>{item.NoteAddedByName}</div>
                                    <div className="flex items-center gap-2">
                                       
                                    </div>
                                </div>
                            }
                        >
                            <div>
                                <div className="whitespace-pre-wrap">{item.NoteDescription}</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-2">
                                    {item.NoteAttachments?.map((item) => (
                                        <div key={item.AttachmentId} className="flex items-center gap-x-2 rounded-md shadow justify-between border border-gray-300 p-2">
                                            <Link
                                                color=""
                                                className="text-cyan-800"
                                                isExternal
                                                href={`notesDocs/${item.AttachmentName}`}
                                                showAnchorIcon
                                            >
                                                {item.AttachmentName}
                                            </Link>
                                         
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {item.pdf && (
                                <iframe
                                    className="my-4 rounded-md"
                                    src={item.pdf}
                                    width="100%"
                                    height="500px"
                                />
                            )}
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Warning:
                            </ModalHeader>
                            <ModalBody>
                                Deleting this{" "}
                                {deleteType === 1 ? "note" : "attachment"} will
                                permanently remove it from the report and this
                                action cannot be undone. Are you sure you want
                                to proceed?
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={() => {
                                        onClose();
                                    }}
                                >
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

Notes.propTypes = {
    incident: PropTypes.object,
};