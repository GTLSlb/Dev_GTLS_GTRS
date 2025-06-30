import ReactModal from "react-modal";
import React, { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import swal from 'sweetalert';
import PropTypes from "prop-types";
import { handleSessionExpiration } from '@/CommonFunctions';

export default function SetFailedReasonModal({
    isOpen,
    handleClose,
    reason,
    setReason,
    failedReasons,
    updateLocalData,
}) {
    const [consignment, setConsignment] = useState();
    const [note, setNote] = useState();
    const [resolution, setResolution] = useState();
    const [isLoading, SetIsLoading] = useState(false);
    const [selected, setSelected] = useState();
    const [showDesc, setShowDesc] = useState();
    const [occurredAt, setOccuredAt] = useState(null);
    const reference = [
        { id: 1, name: "Internal", unavailable: false },
        { id: 2, name: "External", unavailable: false },
    ];
    const departments = [
        { id: 1, name: "Customer", unavailable: false },
        { id: 2, name: "Driver - Linehaul", unavailable: false },
        { id: 3, name: "Driver - Local", unavailable: false },
        { id: 4, name: "GTLS Customer Service", unavailable: true },
        { id: 5, name: "Linehaul Allocations ", unavailable: false },
        { id: 6, name: "Local Allocations", unavailable: false },
        { id: 7, name: "Operations Administration ", unavailable: false },
        { id: 8, name: "Transit Dock ", unavailable: false },
    ];
    const states = [
        { id: 1, name: "NSW", unavailable: false },
        { id: 2, name: "MLB", unavailable: false },
        { id: 3, name: "QLD", unavailable: false },
        { id: 4, name: "SA", unavailable: false },
        { id: 5, name: "WA", unavailable: false },
        { id: 6, name: "NA", unavailable: false },
    ];
    function getStateIdByName(stateName) {
        const foundState = states.find((state) => state.name === stateName);
        return foundState ? foundState.id - 1 : 0;
    }
    function getDepartmentIdByName(departmentName) {
        const foundDepartment = departments.find(
            (department) => department.name === departmentName
        );
        return foundDepartment ? foundDepartment.id : 0;
    }
    const [selectedState, setSelectedState] = useState(states[0]);
    const [selectedReference, setSelectedReference] = useState(reference[1]);
    const [selectedDepartment, setSelectedDepartment] = useState(
        departments[0]
    );
    useEffect(() => {
        setShowDesc();
        setConsignment(reason);
        if (reason) {
            const state = reason.State;
            const department = reason.Department;
            let ref = 1;
            if (reason.Reference == 0) {
                ref = 1;
            } else {
                ref = reason.Reference - 1;
            }
            setSelectedState(states[getStateIdByName(state)]);
            setSelectedDepartment(
                departments[getDepartmentIdByName(department) - 1]
            );
            setSelectedReference(reference[ref]);

            const x = failedReasons?.find(
                (i) => i.ReasonId === reason?.FailedReason
            )?.ReasonName;
            const index = failedReasons?.findIndex((i) => x === i.ReasonName);

            if (failedReasons) {
                if (failedReasons[index]) {
                    setSelected(failedReasons[index]);
                } else {
                    setSelected(failedReasons[0]);
                }
            }
        }
        setNote(reason?.FailedNote);
        setResolution(reason?.Resolution);
    }, [reason]);
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Prevent the default form submission behavior

        try {
            SetIsLoading(true);

            setTimeout(() => {
                handleClose();
                SetIsLoading(false);
                updateLocalData(
                    reason.CONSIGNMNENTID,
                    selected.ReasonId,
                    note,
                    selected.ReasonDesc,
                    selectedDepartment.name,
                    resolution,
                    selectedReference.id,
                    selectedState.name,
                    occurredAt
                );
            }, 1000);
        } catch (error) {
            SetIsLoading(false);
            if (error.response && error.response.status === 401) {
                // Handle 401 error using SweetAlert
                swal({
                  title: 'Session Expired!',
                  text: "Please login again",
                  type: 'success',
                  icon: "info",
                  confirmButtonText: 'OK'
                }).then(async function () {
                    await handleSessionExpiration();
                });
              } else {
                // Handle other errors
                console.log(error);
              }

        }
    };
    const handlePopUpClose = () => {
        setReason(null);
        handleClose(); // Clear the input value
    };
    function handleReasonChange(event) {
        setSelected(event);
        setShowDesc(event);
    }
    function handleDateChange(event) {
        const occurredAttDate = new Date(event.target.value);
        setOccuredAt(occurredAttDate.toLocaleString("sv-SE"));
    }
    return (
        <ReactModal
            isOpen={isOpen}
            className="fixed inset-0 flex items-center justify-center "
            overlayClassName="fixed inset-0 bg-black bg-opacity-60"
        >
            <div className="bg-white w-96 rounded-lg shadow-lg p-6  ">
                <div className="flex justify-end ">
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
                    Set Failed Reason
                    {/* <span>{id}</span> */}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto h-[25rem] pr-2 containerscroll"
                >
                    <Listbox value={selected} onChange={handleReasonChange}>
                        {({ open }) => (
                            <>
                                <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                                    Reason
                                </Listbox.Label>
                                <div className="relative mt-2">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                        <span className="block truncate">
                                            {selected?.ReasonName ? (
                                                <p>{selected?.ReasonName}</p>
                                            ) : (
                                                <p>Select Reason</p>
                                            )}
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
                                            {failedReasons
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
                            {/* Render other content related to the selected value */}
                        </div>
                    )}
                    <Listbox
                        value={selectedReference}
                        onChange={setSelectedReference}
                    >
                        {({ open }) => (
                            <>
                                <Listbox.Label className="block text-sm font-medium leading-6 pt-2 text-gray-900">
                                    Reference
                                </Listbox.Label>
                                <div className="relative mt-2">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                        <span className="block truncate">
                                            {selectedReference?.name ? (
                                                <p>{selectedReference?.name}</p>
                                            ) : (
                                                <p>Select Reference</p>
                                            )}
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
                                            {reference
                                                ?.filter(
                                                    (reference) =>
                                                        reference.unavailable ===
                                                        false
                                                )
                                                .map((reference) => (
                                                    <Listbox.Option
                                                        key={reference.id}
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
                                                        value={reference}
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
                                                                        reference.name
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
                    <Listbox value={selectedState} onChange={setSelectedState}>
                        {({ open }) => (
                            <>
                                <Listbox.Label className="block text-sm font-medium leading-6 pt-2 text-gray-900">
                                    State
                                </Listbox.Label>
                                <div className="relative mt-2">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                        <span className="block truncate">
                                            {selectedState?.name ? (
                                                <p>{selectedState?.name}</p>
                                            ) : (
                                                <p>Select State</p>
                                            )}
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
                                            {states
                                                ?.filter(
                                                    (state) =>
                                                        state.unavailable ===
                                                        false
                                                )
                                                .map((state) => (
                                                    <Listbox.Option
                                                        key={state.id}
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
                                                        value={state}
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
                                                                    {state.name}
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
                    <Listbox
                        value={selectedDepartment}
                        onChange={setSelectedDepartment}
                    >
                        {({ open }) => (
                            <>
                                <Listbox.Label className="block text-sm font-medium leading-6 pt-2 text-gray-900">
                                    Departments
                                </Listbox.Label>
                                <div className="relative mt-2">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                        <span className="block truncate">
                                            {selectedDepartment?.name ? (
                                                <p>
                                                    {selectedDepartment?.name}
                                                </p>
                                            ) : (
                                                <p>Select Department</p>
                                            )}
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
                                            {departments
                                                ?.filter(
                                                    (department) =>
                                                        department.unavailable ===
                                                        false
                                                )
                                                .map((department) => (
                                                    <Listbox.Option
                                                        key={department.id}
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
                                                        value={department}
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
                                                                        department.name
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
                    <div className="mt-2">
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Explanation
                        </label>
                        <div className="mt-2">
                            <textarea
                                rows={4}
                                name="comment"
                                id="comment"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={consignment?.FailedNote}
                                onChange={(event) => {
                                    setNote(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-2">
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Resolution
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                rows={4}
                                name="comment"
                                id="comment"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={consignment?.Resolution}
                                onChange={(event) => {
                                    setResolution(event.target.value);
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-2">
                        <label htmlFor="OccuredAt" className="block mb-2">
                            Occured At:
                        </label>
                        <input
                            type="datetime-local"
                            id="OccuredAt"
                            name="OccuredAt"
                            defaultValue={consignment?.OccuredAt}
                            onChange={handleDateChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        ></input>
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

SetFailedReasonModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    reason: PropTypes.object.isRequired,
    setReason: PropTypes.func.isRequired,
    failedReasons: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
    updateLocalData: PropTypes.func.isRequired,
};
