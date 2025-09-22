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
import { AlertToast, handleSessionExpiration } from "@/CommonFunctions";
import { CustomContext } from "@/CommonContext";
import axios from "axios";

export default function UtilizationModal({
    isOpen,
    handleClose,
    item,
    fetchUtilizationReportData,
}) {
    const { url, user, Token } = useContext(CustomContext);
    const [isSaveEnabled, setIsSaveEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [DeliveryReason, setDeliveryReason] = useState("");
    const [PickupReason, setPickupReason] = useState("");
    const [ProofOfDemurrage, setProofOfDemurrage] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (item) {
                setPickupReason(item?.PickupReason || "");
                setDeliveryReason(item?.DeliveryReason || "");
                setProofOfDemurrage(item?.ProofOfDemurrage || "");
            } else {
                setPickupReason("");
                setDeliveryReason("");
                setProofOfDemurrage("");
            }
            setError(null);
            setIsSaveEnabled(true);
        }
    }, [item, isOpen]);

    const handlePopUpClose = () => {
        setError(null);
        setPickupReason("");
        setDeliveryReason("");
        setProofOfDemurrage("");
        handleClose();
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        const inputValues = {
            UtilizationId: item.hasOwnProperty("UtilizationId")
                ? item.UtilizationId
                : null,
            ConsignmentId: item.ConsignmentID,
            PickupReason: PickupReason,
            DeliveryReason: DeliveryReason,
            ProofOfDemurrage: ProofOfDemurrage,
        };
        axios
            .post(`${url}Add/UtilizationReport`, inputValues, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then(() => {
                AlertToast("Saved successfully", 1);
                fetchUtilizationReportData();
                handlePopUpClose();
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Handle 401 error using SweetAlert
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
                    AlertToast("An error occurred. Please try again.", 2);
                    // Handle other errors
                    console.error(err);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
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
                        {item?.PickupReason != "" ||
                        item?.DeliveryReason != "" ||
                        item?.ProofOfDemurrage != ""
                            ? "Edit Reasons"
                            : "Add Reasons"}
                    </h2>
                </ModalHeader>

                <div>
                    <ModalBody className="containerscroll max-h-96 overflow-y-auto">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Textarea
                                    label="Pickup Reason"
                                    value={PickupReason}
                                    onValueChange={setPickupReason}
                                    variant="bordered"
                                    minRows={1}
                                    classNames={{
                                        input: "bg-transparent px-0 !outline-none px-0 !border-none !ring-0 ",
                                    }}
                                />

                                <Textarea
                                    label="Delivery Reason"
                                    value={DeliveryReason}
                                    onValueChange={setDeliveryReason}
                                    variant="bordered"
                                    minRows={1}
                                    classNames={{
                                        input: "bg-transparent px-0 !outline-none px-0 !border-none !ring-0 ",
                                    }}
                                />

                                <Textarea
                                    label="Proof of Demurrage"
                                    value={ProofOfDemurrage}
                                    onValueChange={setProofOfDemurrage}
                                    variant="bordered"
                                    minRows={1}
                                    classNames={{
                                        input: "bg-transparent px-0 !outline-none px-0 !border-none !ring-0 ",
                                    }}
                                />
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="danger"
                            variant="light"
                            onPress={handlePopUpClose}
                            isDisabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            isDisabled={!isSaveEnabled || isLoading}
                            isLoading={isLoading}
                            onPress={() => handleSubmit()}
                            spinner={<Spinner size="sm" />}
                            className="bg-gray-800 min-w-20"
                        >
                            {isLoading ? "" : "Save"}
                        </Button>
                    </ModalFooter>
                </div>
            </ModalContent>
        </Modal>
    );
}

UtilizationModal.propTypes = {
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
};
