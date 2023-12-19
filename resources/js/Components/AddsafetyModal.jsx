import ReactModal from "react-modal";
import TextInput from "./TextInput";
import InputError from "./InputError";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "../../css/scroll.css";

const placeholder = "test";

export default function SafetyModal({
    isOpen,
    url,
    handleClose,
    modalRepId,
    modalSafetyType,
    modalMainCause,
    modalState,
    modalConsNo,
    modalDebtorId,
    modalExpl,
    modalResol,
    modalRefer,
    modalOccuredAt,
    updateLocalData,
    currentUser,
    safetyTypes,
}) {
    const date = new Date(modalOccuredAt);
    const formattedDate = date?.toLocaleDateString("en-CA");       
    let id = 0;
    if (modalRepId !== null && typeof modalRepId === "object") {
        id = 0;
    } else if (typeof modalRepId === "number") {
        id = modalRepId;
    }
    const [isLoading, SetIsLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        ReportId: id,
        SafetyType: modalSafetyType,
        ConsNo: modalConsNo,
        MainCause: modalMainCause,
        State: modalState,
        Explanation: modalExpl,
        Resolution: modalResol,
        Reference: modalRefer,
        OccuredAt: formattedDate,
    });
    useEffect(() => {
        setFormValues({
            ReportId: id,
            SafetyType: modalSafetyType,
            ConsNo: modalConsNo,
            MainCause: modalMainCause,
            State: modalState,
            Explanation: modalExpl,
            Resolution: modalResol,
            Reference: modalRefer,
            OccuredAt: formattedDate,
        });
    }, [
        id,
        modalSafetyType,
        modalConsNo,
        modalMainCause,
        modalState,
        modalExpl,
        modalResol,
        modalRefer,
        formattedDate,
        currentUser.name,
    ]);
    const handlePopUpClose = () => {
        setError(null);
        setSuccess(false);
        // Clear the error message
        setFormValues({
            ReportId: id,
            SafetyType: modalSafetyType,
            ConsNo: modalConsNo,
            MainCause: modalMainCause,
            State: modalState,
            Explanation: modalExpl,
            Resolution: modalResol,
            Reference: modalRefer,
            OccuredAt: formattedDate,
        });
        handleClose(); // Clear the input value
    };
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };
    formValues.ReportId = id;
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        try {
            SetIsLoading(true);
            // Make the API request using Axios or any other library
            const response = await axios.post(
                `${url}/Add/SafetyReport`,
                formValues,
                {
                    headers: {
                        UserId: currentUser.UserId,
                    },
                }
            );
            updateLocalData(id, formValues);
            setSuccess(true);
            setTimeout(() => {
                handleClose();
                SetIsLoading(false);
                setSuccess(false);
            }, 1000);
        } catch (error) {
            SetIsLoading(false);
            // Handle error
            console.log(error);
            setError("Error occurred while saving the data. Please try again."); // Set the error message
        }
    };
    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={isOpen}
            // onRequestClose={handlePopUpClose}
            className="fixed inset-0 flex items-center justify-center "
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
                    {modalRepId ? <>Edit Safety Report</> : "Add Safety Report"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-scroll h-[28rem] containerscroll"
                >
                    <div className="pr-2">
                        {/* Sucess message */}
                        {success && (
                            <div className="text-green-500 mb-4">
                                Data saved successfully.
                            </div>
                        )}
                        {/* Error message */}
                        {error && (
                            <div className="text-red-500 mb-4">{error}</div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="SafetyType" className="block mb-2">
                                Type:
                            </label>
                            <select
                                id="SafetyType"
                                name="SafetyType"
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                defaultValue={modalSafetyType}
                                value={formValues.SafetyType || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    --Please choose an option--
                                </option>

                                {safetyTypes?.map((type) => {
                                    if (type.SafetyStatus) {
                                        return (
                                            <option
                                                key={type.SafetyTypeId}
                                                value={type.SafetyTypeId}
                                            >
                                                {type.SafetyTypeName}
                                            </option>
                                        );
                                    }
                                    return null; // Skip rendering if SafetyStatus is false
                                })}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ConsNo" className="block mb-2">
                                Consignment No:
                            </label>
                            <input
                                type="text"
                                id="ConsNo"
                                name="ConsNo"
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="Enter the Resolution of the report"
                                defaultValue={modalConsNo}
                                value={formValues.ConsNo}
                                onChange={handleChange}
                            ></input>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="MainCause" className="block mb-2">
                                Main Cause:
                            </label>
                            <textarea
                                id="MainCause"
                                name="MainCause"
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="Enter the Main cause of the safety issue"
                                defaultValue={modalMainCause}
                                value={formValues.MainCause}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="State" className="block mb-2">
                                State:
                            </label>
                            <select
                                id="State"
                                name="State"
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                defaultValue={modalState}
                                value={formValues.State}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    --Please choose an option--
                                </option>
                                <option value="NSW">NSW</option>
                                <option value="MLB">MLB</option>
                                <option value="QLD">QLD</option>
                                <option value="SA">SA</option>
                                <option value="WA">WA</option>
                                <option value="NA / Cusomer Issue">
                                    NA / Customer Issue
                                </option>
                            </select>
                        </div>
                        <div className="mb-4 hidden">
                            <label htmlFor="DebtorId" className="block mb-2 ">
                                Debtor Id:
                            </label>
                            <input
                                type="text"
                                id="DebtorId"
                                name="DebtorId"
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="Enter the debtor id"
                                defaultValue={modalDebtorId}
                                value={formValues.DebtorId}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="Explanation" className="block mb-2">
                                Explanation:
                            </label>
                            <textarea
                                id="Explanation"
                                name="Explanation"
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="Enter the Explanation of the report"
                                defaultValue={modalExpl}
                                value={formValues.Explanation}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="Resolution" className="block mb-2">
                                Resolution:
                            </label>
                            <textarea
                                id="Resolution"
                                name="Resolution"
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="Enter the Resolution of the report"
                                defaultValue={modalResol}
                                value={formValues.Resolution}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="Reference" className="block mb-2">
                                Reference:
                            </label>
                            <select
                                id="Reference"
                                name="Reference"
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                defaultValue={"2"}
                                value={formValues.Reference}
                                onChange={handleChange}
                                required
                            >
                                <option value="1">Internal</option>
                                <option value="2">External</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="OccuredAt" className="block mb-2">
                                Occured At:
                            </label>
                            <input
                                type="date"
                                id="OccuredAt"
                                name="OccuredAt"
                                defaultValue={formattedDate}
                                value={formValues.OccuredAt}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            ></input>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gray-800 w-20 text-white font-bold py-2 px-4 rounded"
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
