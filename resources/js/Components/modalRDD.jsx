import ReactModal from "react-modal";
import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useApiRequests } from "@/CommonFunctions";
import { CustomContext } from "@/CommonContext";

export default function ModalRDD({
    isOpen,
    handleClose,
    consignment,
    updateLocalData,
}) {
    const { Token, url, user, RDDReasonsData } = useContext(CustomContext);
    const { postApiRequest } = useApiRequests();

    const [note, setNote] = useState("");
    const [error, setError] = useState(null);
    const [showDesc, setShowDesc] = useState();
    const [selected, setSelected] = useState();
    const [isLoading, SetIsLoading] = useState(false);

    useEffect(() => {
        setSelected(null);
    }, [isOpen]);
    useEffect(() => {
        setShowDesc(selected);
    }, [selected]);
    function handleReasonChange(event) {
        setSelected(event);
        setShowDesc(event);
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }
    useEffect(() => {
        // setAudit(consignment?.AuditId)
        if (consignment) {
            const x = RDDReasonsData?.find(
                (i) => i.ReasonId === consignment?.Reason
            )?.ReasonName;
            const index = RDDReasonsData?.findIndex((i) => x === i.ReasonName);
            if (RDDReasonsData) {
                if (RDDReasonsData[index]) {
                    setSelected(RDDReasonsData[index]);
                } else {
                    setSelected(RDDReasonsData[0]);
                }
                setNote(consignment?.ReasonDesc);
            }
        }
    }, [consignment]);
    const handlePopUpClose = () => {
        setError(null); // Clear the error message
        handleClose(); // Clear the input value
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            SetIsLoading(true);

            const data = [
                {
                    AuditId: consignment.AuditId,
                    ReasonId: selected?.ReasonId,
                    Description: note,
                },
            ];

            const headers = {
                UserId: user.UserId,
                Authorization: `Bearer ${Token}`,
            };

            await postApiRequest(`${url}Add/RDD`, headers, data);

            updateLocalData(consignment.AuditId, selected?.ReasonId, note);

            setTimeout(() => {
                handleClose();
                SetIsLoading(false);
            }, 1000);
        } catch (err) {
            SetIsLoading(false);
            // Handle error
            console.error("Error occurred while saving the data:", err);
            setError("Error occurred while saving the data. Please try again.");
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={handlePopUpClose}
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50"
        >
            <div className="bg-white w-96 rounded-lg shadow-lg p-6 ">
                <div className="flex justify-end">
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={handlePopUpClose}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <h2 className="text-2xl font-bold mb-4">Set RDD Reason</h2>

                <form onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <Listbox value={selected} onChange={handleReasonChange}>
                        {({ open }) => (
                            <>
                                <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                                    Reason
                                </Listbox.Label>
                                <div className="relative mt-2">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                        <span className="block truncate">
                                            {selected?.ReasonName}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {RDDReasonsData
                                                ?.filter(
                                                    (reason) =>
                                                        reason.ReasonStatus ===
                                                        true
                                                )
                                                .map((reason) => (
                                                    <Listbox.Option
                                                        key={reason.ReasonId}
                                                        className={({
                                                            active,
                                                        }) =>
                                                            classNames(
                                                                active
                                                                    ? "bg-indigo-600 text-white"
                                                                    : "text-gray-900",
                                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                                            )
                                                        }
                                                        value={reason}
                                                    >
                                                        {({
                                                            selected,
                                                            active,
                                                        }) => (
                                                            <>
                                                                <span
                                                                    className={classNames(
                                                                        selected
                                                                            ? "font-semibold"
                                                                            : "font-normal",
                                                                        "block truncate"
                                                                    )}
                                                                >
                                                                    {
                                                                        reason.ReasonName
                                                                    }
                                                                </span>

                                                                {selected ? (
                                                                    <span
                                                                        className={classNames(
                                                                            active
                                                                                ? "text-white"
                                                                                : "text-indigo-600",
                                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                        )}
                                                                    >
                                                                        <CheckIcon
                                                                            className="h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                    {showDesc && selected && (
                        <div>
                            <div className="text-sm p-2">
                                {showDesc.ReasonDesc}
                            </div>
                        </div>
                    )}
                    <div className="mt-2">
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Add a note
                        </label>
                        <div className="mt-2">
                            <textarea
                                rows={4}
                                name="comment"
                                id="comment"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={consignment?.ReasonDesc}
                                onChange={(event) => {
                                    setNote(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-md bg-dark w-20 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-goldd focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {isLoading ? (
                                <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-smooth"></div>
                                </div>
                            ) : (
                                "Save"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
}

ModalRDD.propTypes = {
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
    consignment: PropTypes.object,
    updateLocalData: PropTypes.func,
};
