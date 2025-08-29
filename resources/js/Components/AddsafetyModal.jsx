import ReactModal from "react-modal";
import React, { useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../../css/scroll.css";
import swal from "sweetalert";
import { handleSessionExpiration } from "@/CommonFunctions";
import Select from "react-select";
import { ToastContainer } from 'react-toastify';
import { AlertToast } from "@/permissions";
import { CustomContext } from "@/CommonContext";

export default function SafetyModal({
    isOpen,
    handleClose,
    modalRepId,
    modalSafetyType,
    modalMainCause,
    modalState,
    customerAccounts,
    modalConsNo,
    modalDebtorId,
    modalExpl,
    modalResol,
    modalRefer,
    modalOccuredAt,
    updateLocalData,
    safetyTypes,
    setIsSuccessfull,
    fetchData
}) {
    const { user, Token, url } = useContext(CustomContext);
    
    // Enhanced date formatting with error handling
    const formatDate = useCallback((dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date.toLocaleDateString("en-CA");
    }, []);

    const formattedDate = formatDate(modalOccuredAt);
    
    // Enhanced ID handling
    const getReportId = useCallback(() => {
        if (modalRepId === null || typeof modalRepId === "object") {
            return 0;
        }
        return typeof modalRepId === "number" ? modalRepId : 0;
    }, [modalRepId]);

    const reportId = getReportId();

    // State management
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // Initial form values
    const getInitialFormValues = useCallback(() => ({
        ReportId: reportId,
        SafetyType: modalSafetyType || "",
        ConsNo: modalConsNo || "",
        MainCause: modalMainCause || "",
        State: modalState || "",
        Explanation: modalExpl || "",
        Resolution: modalResol || "",
        Reference: modalRefer || "1",
        DebtorId: modalDebtorId || "",
        OccuredAt: formattedDate,
    }), [
        reportId,
        modalSafetyType,
        modalConsNo,
        modalMainCause,
        modalState,
        modalExpl,
        modalResol,
        modalRefer,
        modalDebtorId,
        formattedDate
    ]);

    const [formValues, setFormValues] = useState(getInitialFormValues);

    // Update form values when props change
    useEffect(() => {
        setFormValues(getInitialFormValues());
    }, [getInitialFormValues]);

    // Enhanced form validation
    const validateForm = useCallback(() => {
        const requiredFields = ['SafetyType', 'State', 'Reference'];
        const missingFields = requiredFields.filter(field => !formValues[field]);
        
        if (missingFields.length > 0) {
            setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
            return false;
        }
        
        setError(null);
        return true;
    }, [formValues]);

    // Enhanced close handler
    const handlePopUpClose = useCallback(() => {
        setError(null);
        setSuccess(false);
        setFormValues(getInitialFormValues());
        handleClose();
    }, [handleClose, getInitialFormValues]);

    // Enhanced change handler with better type detection
    const handleChange = useCallback((e) => {
        if (e && typeof e === 'object' && 'target' in e) {
            // Regular form input
            const { name, value } = e.target;
            setFormValues(prev => ({ ...prev, [name]: value }));
        } else if (e && 'id' in e) {
            // React-select dropdown
            setFormValues(prev => ({ ...prev, DebtorId: e.id }));
        }
    }, []);

    // Enhanced submit handler with proper API call
    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Prepare form data with proper types
            const submitData = {
                ...formValues,
                ReportId: reportId,
                SafetyType: parseInt(formValues.SafetyType) || null,
                Reference: parseInt(formValues.Reference) || 1,
                DebtorId: formValues.DebtorId ? parseInt(formValues.DebtorId) : null,
            };

            // API call with enhanced error handling
            const response = await axios.post(
                `${url}Add/SafetyReport`,
                submitData,
                {
                    headers: {
                        UserId: user.UserId,
                        Authorization: `Bearer ${Token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            // Handle successful response
            if (response.status === 200 || response.status === 201) {
                // Update local data with response data if available
                const updatedData = response.data || submitData;
                updateLocalData(reportId, updatedData);
                
                // Refresh data
                if (fetchData) {
                    await fetchData();
                }

                setSuccess(true);
                setIsSuccessfull(true);
                AlertToast("Safety report saved successfully", 1);

                // Auto-close modal after success
                setTimeout(() => {
                    handlePopUpClose();
                }, 1500);
            }
        } catch (error) {
            console.error('Error saving safety report:', error);
            
            // Enhanced error handling
            if (error.response?.status === 401) {
                await swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    icon: "info",
                    confirmButtonText: "OK",
                });
                await handleSessionExpiration();
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
                AlertToast(error.response.data.message, 2);
            } else {
                const errorMessage = "Error occurred while saving the data. Please try again.";
                setError(errorMessage);
                AlertToast(errorMessage, 2);
            }
            
            setIsSuccessfull(false);
        } finally {
            setIsLoading(false);
        }
    }, [
        formValues,
        reportId,
        validateForm,
        url,
        user.UserId,
        Token,
        updateLocalData,
        fetchData,
        setIsSuccessfull,
        handlePopUpClose
    ]);

    // Enhanced custom styles for react-select
    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: "42px",
            borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
            boxShadow: state.isFocused ? '0 0 0 1px #3B82F6' : 'none',
            '&:hover': {
                borderColor: '#3B82F6'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            color: "black",
            backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EBF4FF' : 'white',
        }),
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: "40px",
            overflow: "auto",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9CA3AF'
        })
    };

    // Get current account for react-select value
    const getCurrentAccount = useCallback(() => {
        if (!formValues.DebtorId || !customerAccounts) return null;
        return customerAccounts.find(account => 
            account.id.toString() === formValues.DebtorId.toString()
        ) || null;
    }, [formValues.DebtorId, customerAccounts]);

    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={isOpen}
            onRequestClose={handlePopUpClose}
            className="fixed inset-0 flex items-center justify-center p-4"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50"
        >
            <ToastContainer />
            <div className="bg-white w-full max-w-md 2xl:max-w-lg rounded-lg shadow-lg p-6 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        {reportId ? "Edit Safety Report" : "Add Safety Report"}
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 p-1"
                        onClick={handlePopUpClose}
                        type="button"
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="overflow-y-auto containerscroll pr-2 flex-1">
                        {/* Success/Error Messages */}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                Data saved successfully.
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {/* Safety Type */}
                        <div className="mb-4">
                            <label htmlFor="SafetyType" className="block text-sm font-medium text-gray-700 mb-2">
                                Type: <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="SafetyType"
                                name="SafetyType"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formValues.SafetyType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">--Please choose an option--</option>
                                {safetyTypes?.filter(type => type.SafetyStatus).map((type) => (
                                    <option key={type.SafetyTypeId} value={type.SafetyTypeId}>
                                        {type.SafetyTypeName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Consignment No */}
                        <div className="mb-4">
                            <label htmlFor="ConsNo" className="block text-sm font-medium text-gray-700 mb-2">
                                Consignment No:
                            </label>
                            <input
                                type="text"
                                id="ConsNo"
                                name="ConsNo"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter the Consignment No of the report"
                                value={formValues.ConsNo}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Account Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Name:
                            </label>
                            <Select
                                styles={customSelectStyles}
                                value={getCurrentAccount()}
                                options={customerAccounts}
                                onChange={handleChange}
                                getOptionValue={(option) => option.id.toString()}
                                getOptionLabel={(option) => option.label || option.name}
                                placeholder="--Please choose an option--"
                                maxMenuHeight={180}
                                isClearable
                                className="basic-select"
                                classNamePrefix="select"
                            />
                        </div>

                        {/* Main Cause */}
                        <div className="mb-4">
                            <label htmlFor="MainCause" className="block text-sm font-medium text-gray-700 mb-2">
                                Main Cause:
                            </label>
                            <textarea
                                id="MainCause"
                                name="MainCause"
                                rows="3"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter the Main cause of the safety issue"
                                value={formValues.MainCause}
                                onChange={handleChange}
                            />
                        </div>

                        {/* State */}
                        <div className="mb-4">
                            <label htmlFor="State" className="block text-sm font-medium text-gray-700 mb-2">
                                State: <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="State"
                                name="State"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formValues.State}
                                onChange={handleChange}
                                required
                            >
                                <option value="">--Please choose an option--</option>
                                <option value="NSW">NSW</option>
                                <option value="MLB">MLB</option>
                                <option value="QLD">QLD</option>
                                <option value="SA">SA</option>
                                <option value="WA">WA</option>
                                <option value="NA / Customer Issue">NA / Customer Issue</option>
                            </select>
                        </div>

                        {/* Explanation */}
                        <div className="mb-4">
                            <label htmlFor="Explanation" className="block text-sm font-medium text-gray-700 mb-2">
                                Explanation:
                            </label>
                            <textarea
                                id="Explanation"
                                name="Explanation"
                                rows="3"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter the Explanation of the report"
                                value={formValues.Explanation}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Resolution */}
                        <div className="mb-4">
                            <label htmlFor="Resolution" className="block text-sm font-medium text-gray-700 mb-2">
                                Resolution:
                            </label>
                            <textarea
                                id="Resolution"
                                name="Resolution"
                                rows="3"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter the Resolution of the report"
                                value={formValues.Resolution}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Reference */}
                        <div className="mb-4">
                            <label htmlFor="Reference" className="block text-sm font-medium text-gray-700 mb-2">
                                Reference: <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="Reference"
                                name="Reference"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formValues.Reference}
                                onChange={handleChange}
                                required
                            >
                                <option value="1">Internal</option>
                                <option value="2">External</option>
                            </select>
                        </div>

                        {/* Occurred At */}
                        <div className="mb-6">
                            <label htmlFor="OccuredAt" className="block text-sm font-medium text-gray-700 mb-2">
                                Occurred At:
                            </label>
                            <input
                                type="date"
                                id="OccuredAt"
                                name="OccuredAt"
                                value={formValues.OccuredAt || ""}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                        >
                            {isLoading ? (
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                    Saving...
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

SafetyModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    modalRepId: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    modalSafetyType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    modalMainCause: PropTypes.string,
    modalState: PropTypes.string,
    customerAccounts: PropTypes.array,
    modalConsNo: PropTypes.string,
    modalDebtorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    modalExpl: PropTypes.string,
    modalResol: PropTypes.string,
    modalRefer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    modalOccuredAt: PropTypes.string,
    updateLocalData: PropTypes.func.isRequired,
    safetyTypes: PropTypes.array,
    setIsSuccessfull: PropTypes.func.isRequired,
    fetchData: PropTypes.func
};