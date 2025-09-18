import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useApiRequests } from "@/CommonFunctions";
import { CustomContext } from "@/CommonContext";
import {
    Button,
    Select,
    SelectItem,
    Textarea,
    Input,
    Spinner,
} from "@heroui/react";
import ReactModal from "react-modal";

export default function SetFailedReasonModal({
    isOpen,
    handleClose,
    reason,
    setReason,
    updateLocalData,
}) {
    const { Token, url, user, failedReasonsData } = useContext(CustomContext);
    const { postApiRequest } = useApiRequests();

    // Form state
    const [formData, setFormData] = useState({
        consignment: null,
        note: "",
        resolution: "",
        selectedReason: "",
        selectedReference: "2", // External as default
        selectedState: "1", // NSW as default
        selectedDepartment: "1", // Customer as default
        occurredAt: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    // Static data
    const reference = [
        { key: "1", label: "Internal" },
        { key: "2", label: "External" },
    ];

    const departments = [
        { key: "1", label: "Customer" },
        { key: "2", label: "Driver - Linehaul" },
        { key: "3", label: "Driver - Local" },
        { key: "5", label: "Linehaul Allocations" },
        { key: "6", label: "Local Allocations" },
        { key: "7", label: "Operations Administration" },
        { key: "8", label: "Transit Dock" },
    ];

    const states = [
        { key: "1", label: "NSW" },
        { key: "2", label: "MLB" },
        { key: "3", label: "QLD" },
        { key: "4", label: "SA" },
        { key: "5", label: "WA" },
        { key: "6", label: "ACT" },
        { key: "7", label: "NA" },
    ];

    // Helper functions
    const getStateKeyByName = (stateName) => {
        const state = states.find((s) => s.label === stateName);
        return state?.key || "1";
    };

    const getDepartmentKeyByName = (departmentName) => {
        const dept = departments.find((d) => d.label === departmentName);
        return dept?.key || "1";
    };

    const getReferenceKeyById = (refId) => {
        return refId === 0 ? "1" : refId.toString();
    };

    // Initialize form when reason changes
    useEffect(() => {
        if (reason) {
            const matchedReason = failedReasonsData?.find(
                (r) => r.ReasonId === reason.FailedReason
            );

            setFormData({
                consignment: reason,
                note: reason.FailedNote || "",
                resolution: reason.Resolution || "",
                selectedReason: matchedReason?.ReasonId?.toString() || "",
                selectedReference: getReferenceKeyById(reason.Reference || 2),
                selectedState: getStateKeyByName(reason.State || "NSW"),
                selectedDepartment: getDepartmentKeyByName(
                    reason.Department || "Customer"
                ),
                occurredAt: reason.OccuredAt || "",
            });
        }
    }, [reason, failedReasonsData]);

    // Get selected reason details
    const selectedReasonDetails = failedReasonsData?.find(
        (r) => r.ReasonId.toString() === formData.selectedReason
    );

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.selectedReason) {
            return;
        }

        try {
            setIsLoading(true);

            const requestData = [
                {
                    ConsId: formData.consignment?.ConsignmentID,
                    ReasonId: parseInt(formData.selectedReason),
                    Description: selectedReasonDetails?.ReasonDesc || "",
                    note: formData.note,
                    State:
                        states.find((s) => s.key === formData.selectedState)
                            ?.label || "",
                    Department:
                        departments.find(
                            (d) => d.key === formData.selectedDepartment
                        )?.label || "",
                    Resolution: formData.resolution,
                    Reference: parseInt(formData.selectedReference),
                    OccuredAt: formData.occurredAt,
                },
            ];

            const headers = {
                UserId: user.UserId,
                Authorization: `Bearer ${Token}`,
            };

            await postApiRequest(
                `${url}add/ConsFailedReason`,
                headers,
                requestData
            );

            // Update local data and close modal
            setTimeout(() => {
                updateLocalData(
                    reason.ConsignmentID,
                    parseInt(formData.selectedReason),
                    formData.note,
                    selectedReasonDetails?.ReasonDesc || "",
                    departments.find(
                        (d) => d.key === formData.selectedDepartment
                    )?.label || "",
                    formData.resolution,
                    parseInt(formData.selectedReference),
                    states.find((s) => s.key === formData.selectedState)
                        ?.label || "",
                    formData.occurredAt
                );
                handlePopUpClose();
            }, 1000);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePopUpClose = () => {
        handleClose();
        // setReason(null);
        // setFormData({
        //     consignment: null,
        //     note: "",
        //     resolution: "",
        //     selectedReason: "",
        //     selectedReference: "2",
        //     selectedState: "1",
        //     selectedDepartment: "1",
        //     occurredAt: "",
        // });
    };

    // Convert datetime-local format
    const handleDateTimeChange = (value) => {
        if (value) {
            const date = new Date(value);
            setFormData((prev) => ({
                ...prev,
                occurredAt: date.toLocaleString("sv-SE"),
            }));
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            overlayClassName="fixed inset-0 bg-black/60 z-40"
            closeTimeoutMS={300}
            shouldCloseOnOverlayClick={!isLoading}
            shouldCloseOnEsc={!isLoading}
        >
            <form
                onSubmit={handleSubmit}
                className="bg-white p-5 flex flex-col gap-4 rounded-xl w-96"
            >
                <h2 className="text-2xl font-bold">Set Failed Reason</h2>
                <div className=" flex flex-col space-y-5 overflow-y-auto h-[25rem] pr-2 containerscroll">
                    {/* Reason Selection */}
                    <div>
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Reason
                        </label>
                        <Select
                            label=""
                            placeholder="Select a reason"
                            aria-labelledby="ٌReason"
                            showScrollIndicators={true}
                            classNames={{
                                listboxWrapper: "select-scroll ",
                            }}
                            selectedKeys={
                                formData.selectedReason
                                    ? [formData.selectedReason]
                                    : []
                            }
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0];
                                setFormData((prev) => ({
                                    ...prev,
                                    selectedReason: selected || "",
                                }));
                            }}
                            variant="bordered"
                            isRequired
                        >
                            {failedReasonsData
                                ?.filter(
                                    (reason) => reason.ReasonStatus === true
                                )
                                .map((reason) => (
                                    <SelectItem
                                        key={reason.ReasonId.toString()}
                                        value={reason.ReasonId.toString()}
                                    >
                                        {reason.ReasonName}
                                    </SelectItem>
                                ))}
                        </Select>
                    </div>

                    {/* Reason Description */}
                    {selectedReasonDetails && (
                        <div className="bg-default-100 p-3 rounded-lg">
                            <p className="text-sm text-default-600">
                                {selectedReasonDetails.ReasonDesc}
                            </p>
                        </div>
                    )}

                    {/* Reference Selection */}
                    <div>
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Reference
                        </label>
                        <Select
                            label=""
                            aria-labelledby="Reference"
                            showScrollIndicators={true}
                            classNames={{
                                listboxWrapper: "select-scroll ",
                            }}
                            placeholder="Select reference type"
                            selectedKeys={[formData.selectedReference]}
                            disallowEmptySelection
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0];
                                setFormData((prev) => ({
                                    ...prev,
                                    selectedReference: selected,
                                }));
                            }}
                            variant="bordered"
                        >
                            {reference.map((ref) => (
                                <SelectItem key={ref.key} value={ref.key}>
                                    {ref.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    {/* State Selection */}
                    <div>
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            State
                        </label>
                        <Select
                            label=""
                            aria-labelledby="State"
                            showScrollIndicators
                            placeholder="Select state"
                            selectedKeys={[formData.selectedState]}
                            disallowEmptySelection
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0];
                                setFormData((prev) => ({
                                    ...prev,
                                    selectedState: selected,
                                }));
                            }}
                            variant="bordered"
                        >
                            {states.map((state) => (
                                <SelectItem key={state.key} value={state.key}>
                                    {state.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    {/* Department Selection */}
                    <div>
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Department
                        </label>
                        <Select
                            label=""
                            aria-labelledby="Department"
                            showScrollIndicators
                            placeholder="Select department"
                            disallowEmptySelection
                            selectedKeys={[formData.selectedDepartment]}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0];
                                setFormData((prev) => ({
                                    ...prev,
                                    selectedDepartment: selected,
                                }));
                            }}
                            variant="bordered"
                        >
                            {departments.map((dept) => (
                                <SelectItem key={dept.key} value={dept.key}>
                                    {dept.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    {/* Explanation */}
                    <div>
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Explanation
                        </label>
                        <Textarea
                            label=""
                            aria-labelledby="explanation"
                            placeholder="Enter explanation"
                            value={formData.note}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    note: value,
                                }))
                            }
                            variant="bordered"
                            classNames={{
                                input: "bg-transparent px-0 !outline-none !border-none !ring-0 p-0",
                            }}
                            minRows={3}
                        />
                    </div>

                    {/* Resolution */}
                    <div>
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Resolution
                        </label>
                        <Input
                            aria-labelledby="Resolution"
                            placeholder="Enter resolution"
                            value={formData.resolution}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    resolution: value,
                                }))
                            }
                            classNames={{
                                input: "bg-transparent !outline-none !border-none !ring-0 p-0",
                            }}
                            variant="bordered"
                        />
                    </div>

                    {/* Occurred At */}
                    <div>
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Occured At
                        </label>
                        <Input
                            aria-labelledby="Occurred At"
                            type="datetime-local"
                            classNames={{
                                input: "bg-transparent !outline-none !border-none !ring-0 p-0",
                            }}
                            value={
                                formData.occurredAt
                                    ? new Date(formData.occurredAt)
                                          .toISOString()
                                          .slice(0, 16)
                                    : ""
                            }
                            onChange={(e) =>
                                handleDateTimeChange(e.target.value)
                            }
                            variant="bordered"
                        />
                    </div>
                </div>
                <div className="flex w-full px-2 justify-end gap-3">
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
                        isDisabled={!formData.selectedReason}
                        isLoading={isLoading}
                        spinner={<Spinner size="sm" />}
                        className="bg-gray-800 min-w-20"
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </div>
            </form>
        </ReactModal>
    );
}

SetFailedReasonModal.propTypes = {
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
    reason: PropTypes.array,
    setReason: PropTypes.func,
    updateLocalData: PropTypes.func,
};
