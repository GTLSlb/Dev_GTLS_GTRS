import ReactModal from "react-modal";
import TextInput from "../../../Components/TextInput";
import InputError from "../../../Components/InputError";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "../../../../css/scroll.css"

const placeholder = "test";

export default function AddRDDReasonModal({
    isOpen,
    handleClose,
    url,
    reason,
    setReason,
    AToken,
    updateLocalData,
    rddReasons,
    currentUser,
    userPermission
}) {
    const [Name, setName] = useState(null);
    const [Description, setdescription] = useState(null);
    const [isSaveEnabled, setIsSaveEnabled] = useState(true);
    const [isLoading,SetIsLoading] = useState(false)
    const [Status, setStatus] = useState(true);
    const [reasonStatus, setReasonStatus] = useState(true);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (reason) {
            setStatus(reason?.ReasonStatus);
            setReasonStatus(reason?.ReasonStatus);
            setName(reason?.ReasonName);
            setdescription(reason?.ReasonDesc);
        } else {
            setReasonStatus(true);
            setStatus(true);
            setName("");
            setdescription("");
        }
    }, [reason]);
    // if (reasonAuditId !== null && typeof reasonAuditId === "object") {
    //     id = 0;
    // } else if (typeof reasonAuditId === "number") {
    //     id = reasonAuditId;
    // }
    const data = [
        {
            ReasonId: reason ? reason.ReasonId : "",

            ReasonName: Name,

            ReasonDesc: Description,

            Status: Status,
        },
    ];

    const handlePopUpClose = () => {
        setError(null); // Clear the error message
        // setInputValue("");
        setName("");
        setdescription("");
        handleClose(); // Clear the input value
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Prevent the default form submission behavior

        try {
            SetIsLoading(true)
            // Make the API request using Axios or any other library
            const response = await axios.post(
                `${url}Add/RddChangeReason`,data,{headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                }},

            );
            // Handle the response as needed

            // setInputValue("");
            setSuccess(true);

            setTimeout(() => {
                handleClose();
                setName("");
                setdescription("");
                setSuccess(false);SetIsLoading(false)
                updateLocalData();
            }, 1000);
        } catch (error) {
            // Handle error
            SetIsLoading(false)
                if (error.response && error.response.status === 401) {
                  // Handle 401 error using SweetAlert
                  swal({
                    title: 'Session Expired!',
                    text: "Please login again",
                    type: 'success',
                    icon: "info",
                    confirmButtonText: 'OK'
                  }).then(function() {
                    axios
                        .post("/logoutAPI")
                        .then((response) => {
                          if (response.status == 200) {
                            window.location.href = "/";
                          }
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                  });
                } else {
                  // Handle other errors
                  console.log(err);
                }
            setError("Error occurred while saving the data. Please try again."); // Set the error message
        }
    };


    const handleNameChange = (event) => {
        const newName = event.target.value;
        const isDuplicate = rddReasons.some((reason) => reason.ReasonName === newName);
        if (isDuplicate) {
            setIsSaveEnabled(false)
            // Handle duplicate name error
            setError("Name already exists. Please enter a unique name.");
        } else {
            setIsSaveEnabled(true)
            setName(newName);
            setError(null); // Clear the error message if the name is valid
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={handlePopUpClose}
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60 "
        >
            <div className="bg-white w-96 rounded-lg shadow-lg p-6  h-[30rem]">
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
                    {reason != null
                        ? "Edit RDD Reason"
                        : "Add RDD Reason"}
                    {/* <span>{id}</span> */}
                </h2>

                <form onSubmit={handleSubmit} className="h-[22rem] overflow-y-scroll containerscroll">
                    <div className="pr-2">
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Name
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-goldd sm:max-w-md">
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                required
                                                autoComplete="off"
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                defaultValue={
                                                    reason
                                                        ? reason.ReasonName
                                                        : ""
                                                }
                                                onChange={handleNameChange}
                                            />
                                        </div>
                                    </div>
                                    {error && <InputError message={error} />} {/* Display error message if there is a duplicate name */}
                                </div>

                                <div className="col-span-full">
                                    <label
                                        htmlFor="about"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Description
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            id="about"
                                            name="about"
                                            rows={3}
                                            defaultValue={
                                                reason ? reason.ReasonDesc : ""
                                            }
                                            onChange={(event) =>
                                                setdescription(
                                                    event.target.value
                                                )
                                            }
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-goldd sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <fieldset className="col-span-full">
                                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                                        Status
                                    </legend>
                                    <div className="mt-2 space-y-6">
                                        <div className="flex items-center gap-x-3">
                                            <input
                                                id="active"
                                                name="Status"
                                                type="radio"
                                                value="active"
                                                checked={reasonStatus === true}
                                                onChange={(event) => {
                                                    setReasonStatus(true);
                                                    setStatus(true);
                                                }}
                                                className="h-4 w-4 border-gray-300 text-dark focus:ring-goldd"
                                            />
                                            <label
                                                htmlFor="active"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Active
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-x-3">
                                            <input
                                                id="inactive"
                                                name="Status"
                                                type="radio"
                                                value="inactive"
                                                checked={reasonStatus === false}
                                                onChange={(event) => {
                                                    setReasonStatus(false);
                                                    setStatus(false);
                                                }}
                                                className="h-4 w-4 border-gray-300 text-dark focus:ring-goldd"
                                            />
                                            <label
                                                htmlFor="inactive"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Inactive
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            type="submit"
                            disabled={!isSaveEnabled || isLoading}
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
                    </div>
                </form>
            </div>
        </ReactModal>
    );
}
