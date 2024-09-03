import {
    Accordion,
    AccordionItem,
    Avatar,
    AvatarIcon,
    Button,
    Divider,
    Input,
    Link,
    Spinner,
    Textarea,
    Tooltip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { FileUploader } from "react-drag-drop-files";
// import pdf from "../../../assets/pdf/test.pdf";
import {
    ChevronLeftIcon,
    PencilSquareIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
// import {
//     canAddNotes,
//     canDeleteAttachment,
//     canDeleteIncident,
//     canDeleteNotes,
//     canEditNotes,
// } from "@/permissions";
import moment from "moment/moment";
import { EditIcon } from "@/assets/svgs/EditIcon";
import { CameraIcon } from "@/assets/svgs/CameraIcon";
import { DeleteIcon } from "@/assets/svgs/DeleteIcon";

const fileTypes = ["PDF", "jpg", "jpeg", "png", "msg"];

export default function Notes({
    currentUser,
    AlertToast,
    AToken,
    GtirUrl,
    getIncident,
    incident,
}) {
    const [file, setFile] = useState([]);
    const handleChange = (event) => {
        // Assuming you receive a file list
        const newFile = {
            event,
            url: URL.createObjectURL(event),
        };

        // Update state to include both new files and previously uploaded files
        setFile((prevFiles) => [...prevFiles, newFile]);
    };
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [addNotes, setAddNotes] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [note, setNote] = useState();
    const [noteDescription, setNoteDescription] = useState("");
    const [noteToDelete, setNoteToDelete] = useState();
    const [deleteType, setDeleteType] = useState();

    useEffect(() => {
        if (!incident.IncidentNotes) {
            setAddNotes(true);
        }
    }, []);

    useEffect(() => {
        if (note) {
            setNote(incident.IncidentNotes.find((n) => n.NoteId === note.NoteId));
        }
    }, [incident]);

    let filenamesArray = [];
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

    // const handleFileUpload = async (e) => {
    //     e.preventDefault();
    //     // setIsLoading(true);

    //     if (file.length > 0) {
    //         try {
    //             const uploadPromises = file.map(async (file) => {
    //                 const formData = new FormData();
    //                 formData.append("file", file.event);

    //                 try {
    //                     const response = await axios.post(
    //                         "/api/upload",
    //                         formData,
    //                         {
    //                             headers: {
    //                                 "Content-Type": "multipart/form-data",
    //                             },
    //                         }
    //                     );

    //                     if (response.status === 200) {
    //                         const filename = response.data.filename;
    //                         filenamesArray.push({
    //                             AttId: null,
    //                             AttName: filename,
    //                         });

    //                         // You can perform any additional actions here for each uploaded file if needed
    //                     }
    //                 } catch (error) {
    //                     console.error("Error:", error);
    //                     setIsLoading(false);
    //                 }
    //             });

    //             // Wait for all uploads to complete before proceeding
    //             await Promise.all(uploadPromises);
    //             // After all uploads are complete, you can proceed with further actions
    //             addNote();
    //         } catch (error) {
    //             console.error("Error:", error);
    //             setIsLoading(false);
    //         }
    //     } else {
    //         addNote();
    //         //   alert("Please select one or more files first.");
    //     }
    // };

    // function addNote() {
    //     // e.preventDefault();
    //     const inputValues = {
    //         NoteId: note ? note.NoteId : null,
    //         Description: noteDescription,
    //         Attachment: filenamesArray,
    //     };
    //     axios
    //         .post(`${GtirUrl}Add/Note`, inputValues, {
    //             headers: {
    //                 // UserId: 1,
    //                 UserId: currentUser?.UserId,
    //                 Incident_Id: incident.IncidentId,
    //                 Authorization: `Bearer ${AToken}`,
    //             },
    //         })
    //         .then((res) => {
    //             AlertToast("Saved successfully", 1);
    //             setAddNotes(false);
    //             setNote(null);
    //             setFile([]);
    //             getIncident();
    //             setNoteDescription("");
    //             setIsLoading(false);
    //         })
    //         .catch((err) => {
    //             if (err.response && err.response.status === 401) {
    //                 // Handle 401 error
    //                 if (err.response && err.response.status === 401) {
    //                     // Handle 401 error using SweetAlert
    //                     swal({
    //                         title: "Session Expired!",
    //                         text: "Please login again",
    //                         type: "success",
    //                         icon: "info",
    //                         confirmButtonText: "OK",
    //                     }).then(function () {
    //                         axios
    //                             .post("/logoutAPI")
    //                             .then((response) => {
    //                                 if (response.status == 200) {
    //                                     window.location.href = "/";
    //                                 }
    //                             })
    //                             .catch((error) => {
    //                                 console.log(error);
    //                             });
    //                     });
    //                 } else {
    //                     // Handle other errors
    //                     console.log(err);
    //                 }
    //             } else {
    //                 // Handle other errors
    //                 setIsLoading(false);
    //                 AlertToast("Something went wrong", 2);
    //                 // AlertToast("Error please try again.", 2);
    //                 console.log(err);
    //             }
    //         });
    // }

    // function deleteElement(type) {
    //     const inputValues = {
    //         ModelId: type,
    //         MainId: noteToDelete,
    //     };

    //     axios
    //         .post(`${GtirUrl}Delete/Note`, inputValues, {
    //             headers: {
    //                 // UserId: 1,
    //                 UserId: currentUser?.UserId,
    //                 Authorization: `Bearer ${AToken}`,
    //             },
    //         })
    //         .then((res) => {
    //             setNoteToDelete(null);
    //             getIncident();
    //             AlertToast("Deleted successfully", 1);
    //             // setIsLoading(false);
    //         })
    //         .catch((err) => {
    //             if (err.response && err.response.status === 401) {
    //                 // Handle 401 error
    //                 if (err.response && err.response.status === 401) {
    //                     // Handle 401 error using SweetAlert
    //                     swal({
    //                         title: "Session Expired!",
    //                         text: "Please login again",
    //                         type: "success",
    //                         icon: "info",
    //                         confirmButtonText: "OK",
    //                     }).then(function () {
    //                         axios
    //                             .post("/logoutAPI")
    //                             .then((response) => {
    //                                 if (response.status == 200) {
    //                                     window.location.href = "/";
    //                                 }
    //                             })
    //                             .catch((error) => {
    //                                 console.log(error);
    //                             });
    //                     });
    //                 } else {
    //                     // Handle other errors
    //                     console.log(err);
    //                 }
    //             } else {
    //                 // Handle other errors
    //                 // setIsLoading(false);
    //                 AlertToast("Something went wrong", 2);
    //                 // AlertToast("Error please try again.", 2);
    //                 console.log(err);
    //             }
    //         });
    // }

    // const handleDeleteFile = (itemToDelete) => {
    //     setFile((prevFiles) =>
    //         prevFiles.filter((item) => item !== itemToDelete)
    //     );
    // };
    return (
        <div className="py-2">
            <div className="bg-white rounded-lg shadow-md p-5">
                <div className="flex justify-between items-center">
                    <h1 className="sm:text-2xl text-dark font-bold ">
                        Notes for: {incident.IncidentNo}
                    </h1>

                    {/* {canAddNotes(currentUser) && (
                        <div>
                            {" "}
                            {addNotes ? (
                                <Button
                                    size="md"
                                    variant="light"
                                    className="bg-white text-gray-800"
                                    onClick={() => {
                                        setAddNotes(false);
                                        setNote(null);
                                        setNoteDescription(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    startContent={
                                        <div className="items-center text-goldd text-lg">
                                            +
                                        </div>
                                    }
                                    className="font-semibold bg-gray-800 text-white"
                                    onClick={() => {
                                        setAddNotes(true);
                                        setNote(null);
                                        setNoteDescription(null);
                                    }}
                                >
                                    Add Note
                                </Button>
                            )}{" "}
                        </div>
                    )} */}
                </div>
                <Divider className="my-4" />
                {/* {addNotes && (
                    <AnimatePresence>
                        <motion.form
                            onSubmit={(e) => handleFileUpload(e)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex flex-col gap-y-3 py-2">
                                <Textarea
                                    label="Note"
                                    variant="bordered"
                                    isRequired
                                    value={noteDescription}
                                    onChange={(e) =>
                                        setNoteDescription(e.target.value)
                                    }
                                    placeholder=""
                                    disableAnimation
                                    disableAutosize
                                    className="bg-gray-100 rounded-xl"
                                    classNames={{
                                        input: "resize-y min-h-[40px]",
                                    }}
                                />
                                <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-3 items-center">
                                    <FileUploader
                                        handleChange={(e) => handleChange(e)}
                                        classes="drag-drop-files"
                                        name="file"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {file.length > 0
                                        ? file.map((item, index) => (
                                              <div className="flex items-center gap-x-2 rounded-md shadow justify-between border border-gray-300 p-2">
                                                  <Link
                                                      color=""
                                                      className="text-cyan-800"
                                                      isExternal
                                                      href={item.url}
                                                      showAnchorIcon
                                                  >
                                                      {item.event.name}
                                                  </Link>
                                                  <Button
                                                      isIconOnly
                                                      className="bg- border"
                                                      aria-label=""
                                                      onClick={() => {
                                                          handleDeleteFile(
                                                              item
                                                          );
                                                      }}
                                                  >
                                                      <XMarkIcon className="w-5 text-red-500" />
                                                  </Button>
                                              </div>
                                          ))
                                        : null}
                                    {note?.NoteAttachments?.map((item) => (
                                        <div className="flex items-center gap-x-2 rounded-md shadow justify-between border border-gray-300 p-2">
                                            <Link
                                                color=""
                                                className="text-cyan-800"
                                                isExternal
                                                href={`notesDocs/${item.AttachmentName}`}
                                                showAnchorIcon
                                            >
                                                {item.AttachmentName}
                                            </Link>
                                            {canDeleteAttachment(currentUser) &&
                                                incident.StatusId == 1 && (
                                                    <Button
                                                        isIconOnly
                                                        className="bg- border"
                                                        aria-label="Take a photo"
                                                        onClick={() => {
                                                            setNoteToDelete(
                                                                item.AttachmentId
                                                            );
                                                            setDeleteType(2);
                                                            onOpen();
                                                        }}
                                                    >
                                                        <XMarkIcon className="w-5 text-red-500" />
                                                    </Button>
                                                )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end py-2">
                                {isLoading ? (
                                    <div className="px-3">
                                        <Spinner color="secondary" size="md" />
                                    </div>
                                ) : (
                                    <Button
                                        color="warning"
                                        type="submit"
                                        className="font-semibold"
                                    >
                                        {note ? "Edit Note" : "Add Note"}
                                    </Button>
                                )}
                            </div>
                            <Divider className="my-4" />
                        </motion.form>
                    </AnimatePresence>
                )} */}
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
                                        {/* {canEditNotes(currentUser) &&
                                            incident.StatusId == 1 && (
                                                <Tooltip
                                                    content="Edit"
                                                    classNames={{
                                                        content: [
                                                            "text-white bg-cyan-600",
                                                        ],
                                                    }}
                                                >
                                                    <span
                                                        className="text-xl text-cyan-600  cursor-pointer active:opacity-50"
                                                        onClick={() => {
                                                            setAddNotes(true);
                                                            setNote(item);
                                                            setNoteDescription(
                                                                item.NoteDescription
                                                            );
                                                            setFile([]);
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </span>
                                                </Tooltip>
                                            )} */}
                                        {/* {canDeleteNotes(currentUser) &&
                                            incident.StatusId == 1 && (
                                                <Tooltip
                                                    color="danger"
                                                    content="Delete note"
                                                >
                                                    <span
                                                        className="text-lg text-red-500 cursor-pointer active:opacity-50"
                                                        onClick={() => {
                                                            setNoteToDelete(
                                                                item.NoteId
                                                            );
                                                            setDeleteType(1);
                                                            onOpen();
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </span>
                                                </Tooltip>
                                            )} */}
                                    </div>
                                </div>
                            }
                        >
                            <div>
                                <div className="whitespace-pre-wrap">{item.NoteDescription}</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-2">
                                    {item.NoteAttachments?.map((item) => (
                                        <div className="flex items-center gap-x-2 rounded-md shadow justify-between border border-gray-300 p-2">
                                            <Link
                                                color=""
                                                className="text-cyan-800"
                                                isExternal
                                                href={`notesDocs/${item.AttachmentName}`}
                                                showAnchorIcon
                                            >
                                                {item.AttachmentName}
                                            </Link>
                                            {/* {canDeleteAttachment(currentUser) &&
                                                incident.StatusId == 1 && (
                                                    <Button
                                                        isIconOnly
                                                        className="bg- border"
                                                        aria-label="Take a photo"
                                                        onClick={() => {
                                                            setNoteToDelete(
                                                                item.AttachmentId
                                                            );
                                                            setDeleteType(2);
                                                            onOpen();
                                                        }}
                                                    >
                                                        <XMarkIcon className="w-5 text-red-500" />
                                                    </Button>
                                                )} */}
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
                                        deleteElement(deleteType);
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
