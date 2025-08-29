import { Fragment, useState, useEffect, useContext } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import ReactModal from "react-modal";
import React from "react";
import PropTypes from "prop-types";
import { useApiRequests } from "@/CommonFunctions";
import { CustomContext } from "@/CommonContext";

export default function NewKPIModalAddReason({
    isOpen,
    handleClose,
    kpi,
    updateLocalData,
    kpiReasons,
}) {
    const { Token, user, url } = useContext(CustomContext);
    const [error, setError] = useState(null);
    const { postApiRequest } = useApiRequests();
    const [isLoading, SetIsLoading] = useState(false);
    const [selected, setSelected] = useState();
    function handleReasonChange(event) {
        setSelected(event);
    }
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    useEffect(() => {
        const filteredReasons = kpiReasons?.filter(
            (reason) => reason.ReasonStatus === 1
        );
        if (kpi) {
            const x = kpiReasons?.find(
                (i) => i.ReasonId === kpi?.ReasonId
            )?.ReasonName;
            const index = kpiReasons?.findIndex((i) => x === i.ReasonName);
            if (kpiReasons) {
                if (kpiReasons[index]) {
                    setSelected(kpiReasons[index]);
                } else {
                    setSelected(filteredReasons[0]);
                }
            }
        }
    }, [kpi]);
    const handlePopUpClose = () => {
        setError(null); // Clear the error message
        handleClose(); // Clear the input value
    };
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const data = [
            {
                KpiId: kpi?.KpiId,
                ReasonId: selected?.ReasonId,
            },
        ];
        try {
            // Make the API request using Axios or any other library
            SetIsLoading(true);

            const headers = {
                UserId: user.UserId,
                Authorization: `Bearer ${Token}`,
            };
            await postApiRequest(
                `${url}Add/KPI/FailedReasonNew`,
                headers,
                data
            );
            const response = await updateLocalData(
                kpi.ConsignmentId,
                selected?.ReasonId
            );
            setTimeout(() => {
                handleClose();
                SetIsLoading(false);
            }, 1000);
        } catch (error) {
            SetIsLoading(false);
            // Handle error
            console.error(error);
            setError("Error occurred while saving the data. Please try again."); // Set the error message
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
                <h2 className="text-2xl font-bold mb-4">
                    Set KPI Reason
                    {/* <span>{id}</span> */}
                </h2>
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
                                            {selected?.ReasonName ||
                                                "Select a reason"}
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
                                            {kpiReasons &&
                                            kpiReasons.length > 0 ? (
                                                kpiReasons
                                                    .filter(
                                                        (reason) =>
                                                            reason.ReasonStatus ===
                                                            1
                                                    )
                                                    .map((reason) => (
                                                        <Listbox.Option
                                                            key={
                                                                reason.ReasonId
                                                            }
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
                                                    ))
                                            ) : (
                                                <div className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500">
                                                    No reasons available
                                                </div>
                                            )}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
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

NewKPIModalAddReason.propTypes = {
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
    kpi: PropTypes.object,
    updateLocalData: PropTypes.func,
    kpiReasons: PropTypes.array,
};
