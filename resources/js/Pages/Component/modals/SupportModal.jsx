import ReactModal from "react-modal";
import TextInput from "../../../Components/TextInput";
import InputError from "../../../Components/InputError";
import { useState } from "react";
import { useEffect } from "react";
import SupportForm from "../SupportComp/SupportForm";
import "../../../../css/scroll.css"

const placeholder = "test";

export default function SupportModal({
    isOpen,
    handleClose,
    url,
    reason,
    currentUser,
    setReason,
    updateLocalData,
    failedReasons,
}) {
    const [Name, setName] = useState(null);
    const [Description, setdescription] = useState(null);
    const [isSaveEnabled, setIsSaveEnabled] = useState(true);
    const [Status, setStatus] = useState(true);
    const [reasonStatus, setReasonStatus] = useState(true);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [inputValue, setInputValue] = useState("");

    
    // if (reasonAuditId !== null && typeof reasonAuditId === "object") {
    //     id = 0;
    // } else if (typeof reasonAuditId === "number") {
    //     id = reasonAuditId;
    // }
    

    const handlePopUpClose = () => {
        setError(null); // Clear the error message
        // setInputValue("");
        setName("");
        setdescription("");
        handleClose(); // Clear the input value
    };
   


    

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={handlePopUpClose}
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50"
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
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Support application form
                            </h2>
                <div className="h-[24rem] overflow-y-scroll containerscroll">
                    <SupportForm />
                </div>
            </div>
        </ReactModal>
    );
}
