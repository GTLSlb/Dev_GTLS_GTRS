import ReactModal from "react-modal";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import swal from 'sweetalert';
import { handleSessionExpiration } from '@/CommonFunctions';

const placeholder = "test";

export default function AddSafetyTypeModal({
    isOpen,
    url,
    handleClose,
    type,
    AToken,
    setType,
    updateLocalData,
    safetyTypes,
    currentUser,
}) {
    const [Name, setName] = useState(null);
    const [isSaveEnabled, setIsSaveEnabled] = useState(true);
    const [Status, setStatus] = useState(true);
    const [typeStatus, setTypeStatus] = useState(true);
    const [isLoading,SetIsLoading] = useState(false)
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (type) {
            setStatus(type?.SafetyStatus);
            setTypeStatus(type?.SafetyStatus);
            setName(type?.SafetyTypeName);
            // setdescription(type?.ReasonDesc);
        } else {
            setTypeStatus(true);
            setStatus(true);
            setName("");
            // setdescription("");
        }
    }, [type]);
    const data = [
        {
            TypeId: type ? type.SafetyTypeId : null,
            TypeName: Name,
            TypeStatus: Status,
        },
    ];

    const handlePopUpClose = () => {
        setError(null); // Clear the error message
        // setInputValue("");
        setName("");
        // setdescription("");
        handleClose(); // Clear the input value
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Prevent the default form submission behavior

        try {
            SetIsLoading(true)
            // Make the API request using Axios or any other library
            const response = await axios.post(
                `${url}Add/SafetyType`,
                data,
                {
                    headers: {
                        UserId: currentUser.UserId,
                        Authorization: `Bearer ${AToken}`,
                    },
                }
            );
            // Handle the response as needed
            // setInputValue("");
            setSuccess(true);
            setTimeout(() => {
                handleClose();
                setName("");
                // setdescription("");
                setSuccess(false);
                SetIsLoading(false)
                updateLocalData();
            }, 1000);
        } catch (error) {
            SetIsLoading(false)
            // Handle error
            setError("Error occurred while saving the data. Please try again."); // Set the error message
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
                  // Handle other errors
                  console.log(err);
                }
        }
    };

    const handleNameChange = (event) => {
        const newName = event.target.value;
        const isDuplicate = safetyTypes.some(
            (type) => type.SafetyTypeName === newName
        );

        if (isDuplicate) {
            setIsSaveEnabled(false);
            // Handle duplicate name error
            setError("Name already exists. Please enter a unique name.");
        } else {
            setIsSaveEnabled(true);
            setName(newName);
            setError(null); // Clear the error message if the name is valid
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={handlePopUpClose}
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60"
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
                    {type != null ? "Edit Safety Type" : "Add Safety Type"}
                    {/* <span>{id}</span> */}
                </h2>

                <form onSubmit={handleSubmit}>
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
                                                    type
                                                        ? type.SafetyTypeName
                                                        : ""
                                                }
                                                onChange={handleNameChange}
                                            />
                                        </div>
                                    </div>
                                    {error && <InputError message={error} />}{" "}
                                    {/* Display error message if there is a duplicate name */}
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
                                                checked={typeStatus === true}
                                                onChange={(event) => {
                                                    setTypeStatus(true);
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
                                                checked={typeStatus === false}
                                                onChange={(event) => {
                                                    setTypeStatus(false);
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
                </form>
            </div>
        </ReactModal>
    );
}
