import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    RadioGroup,
    Radio,
    Spinner,
} from "@heroui/react";
import "../../../../css/scroll.css";
import swal from "sweetalert";
import { handleSessionExpiration } from "@/CommonFunctions";
import { CustomContext } from "@/CommonContext";
import axios from "axios";

export default function AddFailedModal({ isOpen, handleClose, reason }) {
    const { url, user, Token, failedReasonsData, getFailedReasons } =
        useContext(CustomContext);
    const [isSaveEnabled, setIsSaveEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [reasonStatus, setReasonStatus] = useState("active");
    const [nameValue, setNameValue] = useState("");
    const [descValue, setDescValue] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (reason) {
                setReasonStatus(reason?.ReasonStatus ? "active" : "inactive");
                setNameValue(reason?.ReasonName || "");
                setDescValue(reason?.ReasonDesc || "");
            } else {
                setReasonStatus("active");
                setNameValue("");
                setDescValue("");
            }
            setError(null);
            setIsSaveEnabled(true);
        }
    }, [reason, isOpen]);

    const handlePopUpClose = () => {
        setError(null);
        setNameValue("");
        setDescValue("");
        setReasonStatus("active");
        handleClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            ReasonName: nameValue,
            ReasonDesc: descValue,
            Status: reasonStatus === "active",
        };

        if (reason) {
            data.ReasonId = reason.ReasonId;
        }

        try {
            setIsLoading(true);
            await axios.post(`${url}add/FailedReasons`, data, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            });

            setTimeout(() => {
                getFailedReasons();
                handlePopUpClose();
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            setIsLoading(false);
            setError("Error occurred while saving the data. Please try again.");

            if (error.response && error.response.status === 401) {
                swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    type: "success",
                    icon: "info",
                    confirmButtonText: "OK",
                }).then(async function () {
                    await handleSessionExpiration();
                });
            } else {
                console.error(error);
            }
        }
    };

    const handleNameChange = (value) => {
        setNameValue(value);
        const newName = value.toLowerCase();

        // When editing, exclude current reason from duplicate check
        const isDuplicate = failedReasonsData.some(
            (existingReason) =>
                existingReason.ReasonName.toLowerCase() === newName &&
                (!reason || existingReason.ReasonId !== reason.ReasonId)
        );

        if (isDuplicate) {
            setIsSaveEnabled(false);
            setError("Name already exists. Please enter a unique name.");
        } else {
            setIsSaveEnabled(true);
            setError(null);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handlePopUpClose}
            size="md"
            backdrop="opaque"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold">
                        {reason != null
                            ? "Edit Failed Reason"
                            : "Add Failed Reason"}
                    </h2>
                </ModalHeader>

                <form onSubmit={handleSubmit}>
                    <ModalBody className="containerscroll max-h-96 overflow-y-auto">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Input
                                    type="text"
                                    label="Reason Name"
                                    value={nameValue}
                                    onValueChange={handleNameChange}
                                    isRequired
                                    variant="bordered"
                                    classNames={{
                                        input: "bg-transparent !outline-none !border-none !ring-0 p-0",
                                    }}
                                    isInvalid={!!error}
                                    errorMessage={error}
                                />

                                <Textarea
                                    label="Description"
                                    value={descValue}
                                    onValueChange={setDescValue}
                                    variant="bordered"
                                    minRows={3}
                                    classNames={{
                                        input: "bg-transparent px-0 !outline-none px-0 !border-none !ring-0 ",
                                    }}
                                />

                                <RadioGroup
                                    label="Status"
                                    orientation="horizontal"
                                    value={reasonStatus}
                                    onValueChange={setReasonStatus}
                                    classNames={{
                                        label: "text-sm font-semibold text-gray-900",
                                    }}
                                >
                                    <Radio
                                        value="active"
                                        classNames={{
                                            base: "inline-flex items-center gap-3",
                                            wrapper: "border-gray-300",
                                        }}
                                    >
                                        Active
                                    </Radio>
                                    <Radio
                                        value="inactive"
                                        classNames={{
                                            base: "inline-flex items-center gap-3",
                                            wrapper: "border-gray-300",
                                        }}
                                    >
                                        Inactive
                                    </Radio>
                                </RadioGroup>
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="danger"
                            variant="light"
                            onPress={handlePopUpClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            isDisabled={!isSaveEnabled || isLoading}
                            isLoading={isLoading}
                            spinner={<Spinner size="sm" />}
                            className="bg-gray-800 min-w-20"
                        >
                            {isLoading ? "" : "Save"}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

AddFailedModal.propTypes = {
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
    reason: PropTypes.object,
    updateLocalData: PropTypes.func,
    failedReasons: PropTypes.array,
};
