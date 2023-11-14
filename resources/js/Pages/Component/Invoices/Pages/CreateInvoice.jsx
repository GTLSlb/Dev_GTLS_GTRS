import InvoicesButton from "../components/InvoicesButton";
import { Fragment, useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import * as signalRCore from "@microsoft/signalr";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    ChevronLeftIcon,
} from "@heroicons/react/20/solid";
import Select from "react-select";

import moment from "moment";
import DropBox from "../components/DropBox";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function CreateInvoice({
    states,
    supplierData,
    companies,
    url,
    AlertToast,
    setActiveIndexInv,
    categories,
    getInvoices,
    invoice,
    setInvoice,
    currentUser,
    hubConnection,
    invoices,
}) {
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [isLoading, SetIsLoading] = useState(false);
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: "unset",
            height: "auto",
            // Add more styles here as needed
        }),
        option: (provided, state) => ({
            ...provided,
            color: "black",
            // Add more styles here as needed
        }),
        multiValue: (provided) => ({
            ...provided,
            // width: "30%",
            overflow: "hidden",
        }),
        valueContainer: (provided) => ({
            ...provided,
            width: "400px",
            maxHeight: "500px", // Set the maximum height for the value container
            overflow: "auto", // Enable scrolling if the content exceeds the maximum height
            // fontSize: '10px',
        }),
        inputContainer: (provided) => ({
            ...provided,
            height: "100px",
            border: "red",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            whiteSpace: "nowrap", // Prevent text wrapping
            overflow: "hidden",
            textOverflow: "ellipsis", // Display ellipsis when text overflows
            fontSize: "12px",
            // Add more styles here as needed
        }),
        // Add more style functions here as needed
    };
    useEffect(() => {
        if (!invoice) {
            setSelectedCompany(filteredCompanies[0]);
        }
    }, [filteredCompanies]);
    const Amount = document.getElementById("Amount")?.value;
    const [invoiceAmount, setInvoiceAmount] = useState(Amount);

    useEffect(() => {
        setInvoiceAmount(Amount);
    }, [Amount]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedState, setSelectedState] = useState();
    const [selectedCompany, setSelectedCompany] = useState(
        filteredCompanies[0]
    );
    const [selectedSupplier, setSelectedSupplier] = useState();
    const [selectedCategory, setSelectedCategory] = useState();
    const [approvalStatus, setApprovalStatus] = useState(1);
    const [secondapprovalStatus, setSecondApprovalStatus] = useState(1);
    const [existedFiles, setExistedFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [stateValue, setStateValue] = useState(1);
    const [stateField, setstateField] = useState(true);
    const [paymentField, setpaymentField] = useState();
    const [paymentType, setPaymentType] = useState(2);
    const [paymentStatus, setPaymentStatus] = useState(0);
    const [processedBankValue, setProcessedBankValue] = useState("");
    const [paymentDateValue, setPaymentDateValue] = useState("");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [description, setDescription] = useState("");

    const handleResetValues = () => {
        setProcessedBankValue("");
        setPaymentDateValue("");
    };
    function determinePaymentStatusValue() {
        const status = event.target.checked;
        if (status) {
            setPaymentStatus(1);
        } else {
            setPaymentStatus(0);
        }
    }
    const deleteFilesWithStatusTwo = async (fileNamesToDelete) => {
        try {
            axios
                .delete("/delete-file", {
                    data: { file_names: fileNamesToDelete }, // Make sure the key matches your API parameter name
                })
                .then((res) => {});
            // Success message from the server
        } catch (error) {
            console.error("Error:", error);
        }
    };
    useEffect(() => {
        if (invoice) {
            setPaymentType(invoice.PaymentTypeId);
            if (invoice.PodRequired == 1) {
                setcheckbox(true);
            } else {
                setcheckbox(false);
            }
        }
    }, []);
    function determinePaymentStatus() {
        const value = event.target.value;
        if (value == 1) {
            //if credit card type
            setPaymentType(value); // set the value of the payment Type
            setPaymentStatus(1); // Set the payment status true if the payment is credit card
        } else {
            //if cash type
            setPaymentStatus(0); // Set the payment status true if the payment is Cash
            setPaymentType(value); // set the value of the payment Type
        }
    }
    function HideShowPaymenFields() {
        if (paymentType == 1) {
            setpaymentField(false); //show processed Bank and payment data but hide the paid checkbox
        } else {
            setpaymentField(true); //hide processed Bank and payment data but show the paid checkbox
        }
    }
    function HideShowState() {
        if (currentUser.role_id == 6 || currentUser.role_id == 7) {
            setstateField(false); //hide the state field for the state manager and the assistant
        } else {
            setstateField(true); //show the state field for everyone else
        }
    }
    function determineStateValue() {
        if (currentUser.role_id == 6 || currentUser.role_id == 7) {
            setStateValue(currentUser.state); // assign the state value of the request with the current user state when SM or assistant
        } else {
            setStateValue(selectedState?.value); // assign the state value of the request with the selected state in the field
        }
    }
    useEffect(() => {
        HideShowPaymenFields();
    }, [paymentType]);
    useEffect(() => {
        determineStateValue();
    }, [selectedState?.value]);
    useEffect(() => {
        HideShowState();
        defineApprovalStatus();
        if (invoice) {
            //if editing an Invoice
            setSelectedState(
                transformToStateOption(
                    states?.find((state) => state.StateId === invoice.StateId)
                )
            );
            setSelectedCompany(
                transformToCompanyOption(
                    companies?.find(
                        (company) => company.CompanyId === invoice.CompanyId
                    )
                )
            );
            // setSelectedSupplier(
            //     supplierData?.find(
            //         (supplier) => supplier.SupplierId === invoice.SupplierId
            //     )
            // );
            setSelectedSupplier(
                transformToSupplierOption(
                    supplierData?.find(
                        (supplier) => supplier.SupplierId === invoice.SupplierId
                    )
                )
            );
            setSelectedCategory(
                transformToCategoryOption(
                    categories?.find(
                        (category) => category.CategoryId === invoice.CategoryId
                    )
                )
            );
        }
    }, []);
    function defineApprovalStatus() {
        if (currentUser.role_id == 6) {
            setApprovalStatus(2);
            setSecondApprovalStatus(1);
        } else if (currentUser.role_id == 7) {
            setApprovalStatus(1);
            setSecondApprovalStatus(1);
        }
    }
    function handleAmountChange() {}
    useEffect(() => {
        if (!invoice) {
            handleResetValues();
            setExistedFiles([]);
            setNewFiles([]);
            setSelectedFiles([]);
            setInvoiceAmount();
            document.getElementById("InvoiceDate").value = "";
            document.getElementById("DueDate").value = "";
            document.getElementById("Amount").value = "";
            document.getElementById("PaymentTypeId").value = 2;
            document.getElementById("InvoiceNo").value = "";
            document.getElementById("Description").value = "";
        }
    }, [invoice]);
    let filenamesArray = [];
    const handleFileUpload = async () => {
        SetIsLoading(true);

        if (newFiles.length > 0) {
            try {
                const uploadPromises = newFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                        const response = await axios.post(
                            "/api/upload",
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        );

                        if (response.status === 200) {
                            const filename = response.data.filename;
                            filenamesArray.push({
                                DocId: null,
                                DocName: filename,
                                DocStatus: 1,
                            });

                            // You can perform any additional actions here for each uploaded file if needed
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        SetIsLoading(false);
                    }
                });

                // Wait for all uploads to complete before proceeding
                await Promise.all(uploadPromises);
                // After all uploads are complete, you can proceed with further actions
                handleCreateInvoice();
            } catch (error) {
                console.error("Error:", error);
                SetIsLoading(false);
            }
        } else {
            handleCreateInvoice();
            //   alert("Please select one or more files first.");
        }
    };
    const [checkbox, setcheckbox] = useState(false);
    // Function to handle changes in the input field
    const handleInputChange = (event) => {
        setcheckbox(event.target.checked);
    };
    const handleCreateInvoice = () => {
        defineApprovalStatus();
        existedFiles.map((file) => {
            filenamesArray.push({
                DocId: file.DocId,
                DocName: file.DocName,
                DocStatus: file.DocStatus,
            });
        });
        // Get the input values here and update the newobject state
        let PodRequired = 0;
        let Paid = 0;
        if (checkbox == true) {
            PodRequired = 1;
        }
        if (document.getElementById("PaymentStatus")?.value == "on") {
            Paid = 1;
        }

        const inputValues = {
            InvoiceId: invoice?.InvoiceId,
            InvoiceNo: document.getElementById("InvoiceNo").value,
            StateId: stateValue,
            SupplierId: selectedSupplier.value,
            CompanyId: selectedCompany.value,
            CategoryId: selectedCategory.value,
            InvoiceDate: document.getElementById("InvoiceDate").value,
            DueDate: document.getElementById("DueDate").value,
            Amount: invoiceAmount,
            PaymentTypeId: document.getElementById("PaymentTypeId").value,
            ProcessedBank: document.getElementById("ProcessedBank")?.value,
            PaymentDate: document.getElementById("PaymentDate")?.value,
            SecondApproval: secondapprovalStatus,
            ApprovalStatus: approvalStatus,
            PaymentStatus: paymentStatus,
            PodRequired: PodRequired,
            InvoiceDoc: filenamesArray,
            Description: document.getElementById("Description").value,
            AddedBy: currentUser.user_id,
        };

        const duplicateInvoice = invoices.find(
            (mapppedinvoice) =>
                mapppedinvoice.InvoiceNo === inputValues.InvoiceNo &&
                mapppedinvoice.SupplierId === inputValues.SupplierId && 
                mapppedinvoice.InvoiceId !== inputValues.InvoiceId
        );
        if (duplicateInvoice) {
            SetIsLoading(false);
            AlertToast("Invoice number for the same supplier already exist", 2);
            return;
        }
        axios
            .post(`${url}api/GTIS/Add/Invoice`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                getInvoices();
                setInvoice(null);
                const fileNamesToDelete = existedFiles
                    .filter((file) => file.DocStatus === 2)
                    .map((file) => file.DocName);
                if (fileNamesToDelete.length > 0) {
                    deleteFilesWithStatusTwo(fileNamesToDelete);
                }
                AlertToast("Saved Successfully", 1);
                SetIsLoading(false);
                // Check if hubConnection exists and is in the "Connected" state
                if (
                    hubConnection &&
                    hubConnection.state === signalR.HubConnectionState.Connected
                ) {
                    hubConnection
                        .invoke("SendNotification", res.data)
                        .catch((error) => {
                            console.error("Error sending notification:", error);
                        });
                } else {
                    console.warn("HubConnection is not ready.");
                }
            })
            .catch((err) => {
                SetIsLoading(false);
                AlertToast("Error please try again.", 2);
            });
    };
    function GoBack() {
        setActiveIndexInv(1);
    }
    const validateForm = (e) => {
        e.preventDefault();
        if (
            invoiceNo === "" ||
            invoiceDate === "" ||
            dueDate === "" ||
            description === "" ||
            invoiceAmount === ""
        ) {
            AlertToast("Please fill in all required fields !", 2);
        } else {
            handleFileUpload();
        }
    };
    const validateEditForm = (e) => {
        e.preventDefault();
        if (
            document.getElementById("InvoiceNo")?.value === "" ||
            document.getElementById("InvoiceDate")?.value === "" ||
            document.getElementById("DueDate")?.value === "" ||
            document.getElementById("Description")?.value === "" ||
            document.getElementById("Amount")?.value === ""
        ) {
            AlertToast("Please fill in all required fields !", 2);
        } else {
            handleFileUpload();
        }
    };
    const supplierSelectOption = (jsonData) => {
        const transformedData = jsonData.map((item) => ({
            value: item.SupplierId,
            label: item.SupplierName,
        }));
        return transformedData;
    };
    const categorySelectOption = (jsonData) => {
        const filteredData = jsonData.filter((item) => item.StatusId === 1);
        const transformedData = filteredData.map((item) => ({
            value: item.CategoryId,
            label: item.CategoryName,
        }));
        return transformedData;
    };
    const stateSelectOption = (jsonData) => {
        const filteredData = jsonData.filter((item) => item.StatusId === 1);
        const transformedData = filteredData.map((item) => ({
            value: item.StateId,
            label: item.StateName,
        }));
        return transformedData;
    };
    const companySelectOption = (jsonData) => {
        let filteredData;
        if (currentUser.role_id == 6 || currentUser.role_id == 7) {
            filteredData = jsonData.filter(
                (item) =>
                    item.StateId === currentUser.state && item.StatusId === 1
            );
        } else if (selectedState) {
            filteredData = jsonData.filter(
                (item) =>
                    item.StateId === selectedState.value && item.StatusId === 1
            );
        } else {
            filteredData = jsonData.filter((item) => item.StatusId === 1);
        }
        const transformedData = filteredData.map((item) => ({
            value: item.CompanyId,
            label: item.CompanyName,
        }));

        return transformedData;
    };
    const handleSupplierSelectChange = (selectedOptions) => {
        setSelectedSupplier(selectedOptions);
    };
    const handleCategorySelectChange = (selectedOptions) => {
        setSelectedCategory(selectedOptions);
    };
    const handleStateSelectChange = (selectedOptions) => {
        setSelectedState(selectedOptions);
    };
    const handleCompanySelectChange = (selectedOptions) => {
        setSelectedCompany(selectedOptions);
    };
    function transformToSupplierOption(inputObject) {
        const outputObject = {
            value: inputObject?.SupplierId,
            label: inputObject?.SupplierName,
        };
        return outputObject;
    }
    function transformToStateOption(inputObject) {
        const outputObject = {
            value: inputObject?.StateId,
            label: inputObject?.StateName,
        };
        return outputObject;
    }
    function transformToCompanyOption(inputObject) {
        const outputObject = {
            value: inputObject?.CompanyId,
            label: inputObject?.CompanyName,
        };
        return outputObject;
    }
    function transformToCategoryOption(inputObject) {
        const outputObject = {
            value: inputObject?.CategoryId,
            label: inputObject?.CategoryName,
        };
        return outputObject;
    }
    function getCurrentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month because it's zero-based
        const day = String(currentDate.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    const todayDate = getCurrentDate();
    if (invoice) {
        return (
            <div className="bg-smooth flex justify-center">
                <div className="w-full lg:w-1/2 p-5 gap-x-5 gap-y-5">
                    <form onSubmit={validateEditForm}>
                        {" "}
                        <div className="rounded-xl shadow bg-white p-5 ">
                            <div className="">
                                <h1 className="font-bold text-dark text-3xl">
                                    Edit Invoice
                                </h1>
                            </div>
                            <div className="grid grid-cols-2 p-2 gap-y-2 mt-5 pb-5 text-sm sm:text-base">
                                {/* State Field */}
                                {stateField == true ? (
                                    <h1 className="text-gray-400 border-b">
                                        State:
                                    </h1>
                                ) : null}
                                {stateField == true ? (
                                    <div className="pb-2 border-b">
                                        <div className="flex flex-col gap-y-2">
                                            <Select
                                                placeholder={<div>State</div>}
                                                styles={customStyles}
                                                name="colors"
                                                value={selectedState}
                                                isSearchable={true} // Set isSearchable to false to disable the search functionality
                                                options={stateSelectOption(
                                                    states
                                                )}
                                                onChange={
                                                    handleStateSelectChange
                                                }
                                                className="basic-multi-select text-red "
                                                classNamePrefix="select"
                                            />
                                        </div>
                                    </div>
                                ) : null}
                                {/* Companies Field */}
                                <h1 className="text-gray-400 border-b">
                                    Company:
                                </h1>
                                <div className="pb-2 w-full border-b">
                                    <div className="pb-2 border-b">
                                        <div className="flex flex-col gap-y-2">
                                            <Select
                                                placeholder={<div>Company</div>}
                                                styles={customStyles}
                                                name="colors"
                                                value={selectedCompany}
                                                isSearchable={true} // Set isSearchable to false to disable the search functionality
                                                options={companySelectOption(
                                                    companies
                                                )}
                                                onChange={
                                                    handleCompanySelectChange
                                                }
                                                className="basic-multi-select text-red "
                                                classNamePrefix="select"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Supplier:
                                </h1>
                                <div className="pb-2 border-b">
                                    <div className="flex flex-col gap-y-2">
                                        <Select
                                            placeholder={<div>Supplier</div>}
                                            styles={customStyles}
                                            name="colors"
                                            value={selectedSupplier}
                                            isSearchable={true} // Set isSearchable to false to disable the search functionality
                                            options={supplierSelectOption(
                                                supplierData
                                            )}
                                            onChange={
                                                handleSupplierSelectChange
                                            }
                                            className="basic-multi-select text-red "
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Category:
                                </h1>
                                <div className="pb-2 border-b">
                                    <div className="flex flex-col gap-y-2">
                                        <Select
                                            placeholder={<div>Category</div>}
                                            styles={customStyles}
                                            name="colors"
                                            value={selectedCategory}
                                            isSearchable={true} // Set isSearchable to false to disable the search functionality
                                            options={categorySelectOption(
                                                categories
                                            )}
                                            onChange={
                                                handleCategorySelectChange
                                            }
                                            className="basic-multi-select text-red "
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Invoice #:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        required
                                        id="InvoiceNo"
                                        defaultValue={invoice.InvoiceNo}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Invoice Date:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="date"
                                        required
                                        id="InvoiceDate"
                                        defaultValue={moment(
                                            invoice?.InvoiceDate.replace(
                                                "T",
                                                " "
                                            ),
                                            "YYYY-MM-DD HH:mm:ss"
                                        ).format("YYYY-MM-DD")}
                                        name="to-date"
                                        max={todayDate}
                                        className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Due Date:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="date"
                                        required
                                        name="to-date"
                                        defaultValue={moment(
                                            invoice?.DueDate.replace("T", " "),
                                            "YYYY-MM-DD HH:mm:ss"
                                        ).format("YYYY-MM-DD")}
                                        id="DueDate"
                                        className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Description:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        required
                                        id="Description"
                                        defaultValue={invoice.Description}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Amount:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        required
                                        id="Amount"
                                        defaultValue={invoice?.Amount}
                                        onChange={(e) => {
                                            // Remove any non-numeric characters except the decimal point
                                            const cleanedValue =
                                                e.target.value.replace(
                                                    /[^0-9.]/g,
                                                    ""
                                                );
                                            // Ensure only one decimal point is allowed
                                            const decimalCount =
                                                cleanedValue.split(".").length -
                                                1;
                                            if (decimalCount <= 1) {
                                                setInvoiceAmount(cleanedValue);
                                            }
                                        }}
                                        value={invoiceAmount}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Payment Type:
                                </h1>
                                <div className="pb-2 border-b ">
                                    <select
                                        id="PaymentTypeId"
                                        onChange={determinePaymentStatus}
                                        defaultValue={invoice.PaymentTypeId}
                                        className="rounded w-full border-gray-200 border-1 f focus:ring focus:ring-goldt"
                                    >
                                        <option value="2">Cash</option>
                                        <option value="1">Credit Card</option>
                                    </select>
                                </div>
                                {paymentField ? (
                                    <h1 className="text-gray-400 border-b hidden">
                                        Paid:
                                    </h1>
                                ) : null}
                                {paymentField ? (
                                    <div className="pb-2 border-b hidden">
                                        <input
                                            type="checkbox"
                                            id="PaymentStatus"
                                            onClick={
                                                determinePaymentStatusValue
                                            }
                                            defaultChecked={
                                                invoice.PaymentStatus
                                            }
                                            className="rounded text-green-500 focus:ring-green-300"
                                        />
                                    </div>
                                ) : null}
                                {!paymentField ? (
                                    <h1 className="text-gray-400 border-b">
                                        Processed Bank:
                                    </h1>
                                ) : null}
                                {!paymentField ? (
                                    <div className="pb-2 border-b">
                                        <input
                                            type="text"
                                            id="ProcessedBank"
                                            defaultValue={invoice.ProcessedBank}
                                            className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                        />
                                    </div>
                                ) : null}
                                {!paymentField ? (
                                    <h1 className="text-gray-400 border-b">
                                        Payment Date:
                                    </h1>
                                ) : null}
                                {!paymentField ? (
                                    <div className="pb-2 border-b">
                                        <input
                                            type="date"
                                            defaultValue={moment(
                                                invoice?.PaymentDate.replace(
                                                    "T",
                                                    " "
                                                ),
                                                "YYYY-MM-DD HH:mm:ss"
                                            ).format("YYYY-MM-DD")}
                                            id="PaymentDate"
                                            name="to-date"
                                            className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                ) : null}
                                <h1 className="text-gray-400 border-b">
                                    POD Required:
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="checkbox"
                                        id="PodRequired"
                                        defaultChecked={invoice.PodRequired}
                                        value={checkbox}
                                        onChange={handleInputChange}
                                        className="rounded text-green-500 focus:ring-green-300"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    File:
                                </h1>
                                <DropBox
                                    selectedFiles={selectedFiles}
                                    setSelectedFiles={setSelectedFiles}
                                    existedFiles={existedFiles}
                                    setExistedFiles={setExistedFiles}
                                    newFiles={newFiles}
                                    setNewFiles={setNewFiles}
                                    object={invoice}
                                    path={"Invoices"}
                                />
                            </div>
                            <div className="flex justify-end w-full gap-x-2">
                                <InvoicesButton
                                    name="Cancel"
                                    onClick={() => {
                                        GoBack();
                                    }}
                                    icon={
                                        <ChevronLeftIcon className="mr-1 h-5" />
                                    }
                                />
                                <InvoicesButton
                                    type={"submit"}
                                    name={
                                        isLoading ? (
                                            <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-smooth"></div>
                                            </div>
                                        ) : (
                                            "Save"
                                        )
                                    }
                                    disabled={isLoading}
                                    // onClick={() => {
                                    //     ();
                                    // }}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    } else {
        return (
            <div className="bg-smooth flex justify-center">
                <div className="w-full lg:w-1/2 p-5 gap-x-5 gap-y-5">
                    <form onSubmit={validateForm}>
                        <div className="rounded-xl shadow bg-white p-5 ">
                            <div className="">
                                <h1 className="font-bold text-dark text-3xl">
                                    Create Invoice
                                </h1>
                            </div>

                            <div className="grid grid-cols-2 p-2 gap-y-2  pb-5 mt-5 text-sm sm:text-base">
                                {stateField == true ? (
                                    <h1 className="text-gray-400 border-b">
                                        State:
                                        <span className="text-red-500">*</span>
                                    </h1>
                                ) : null}
                                {stateField == true ? (
                                    <div className="pb-2 border-b">
                                        <div className="flex flex-col gap-y-2">
                                            <Select
                                                placeholder={<div>State</div>}
                                                styles={customStyles}
                                                name="colors"
                                                value={selectedState}
                                                isSearchable={true} // Set isSearchable to false to disable the search functionality
                                                options={stateSelectOption(
                                                    states
                                                )}
                                                onChange={
                                                    handleStateSelectChange
                                                }
                                                required
                                                className="basic-multi-select text-red "
                                                classNamePrefix="select"
                                            />
                                        </div>
                                    </div>
                                ) : null}
                                <h1 className="text-gray-400 border-b">
                                    Company:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <div className="flex flex-col gap-y-2">
                                        <Select
                                            placeholder={<div>Company</div>}
                                            styles={customStyles}
                                            name="colors"
                                            value={selectedCompany}
                                            isSearchable={true} // Set isSearchable to false to disable the search functionality
                                            options={companySelectOption(
                                                companies
                                            )}
                                            onChange={handleCompanySelectChange}
                                            required
                                            className="basic-multi-select text-red "
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Supplier:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <div className="flex flex-col gap-y-2">
                                        <Select
                                            placeholder={<div>Supplier</div>}
                                            styles={customStyles}
                                            name="colors"
                                            value={selectedSupplier}
                                            isSearchable={true} // Set isSearchable to false to disable the search functionality
                                            options={supplierSelectOption(
                                                supplierData
                                            )}
                                            onChange={
                                                handleSupplierSelectChange
                                            }
                                            className="basic-multi-select text-red "
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Category:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <div className="flex flex-col gap-y-2">
                                        <Select
                                            placeholder={<div>Category</div>}
                                            styles={customStyles}
                                            name="colors"
                                            value={selectedCategory}
                                            isSearchable={true} // Set isSearchable to false to disable the search functionality
                                            options={categorySelectOption(
                                                categories
                                            )}
                                            onChange={
                                                handleCategorySelectChange
                                            }
                                            className="basic-multi-select text-red "
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Invoice #:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        id="InvoiceNo"
                                        required
                                        onChange={(e) => {
                                            setInvoiceNo(e.target.value);
                                        }}
                                        defaultValue=""
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Invoice Date:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="date"
                                        id="InvoiceDate"
                                        required
                                        defaultValue={""}
                                        onChange={(e) => {
                                            setInvoiceDate(e.target.value);
                                        }}
                                        name="to-date"
                                        max={todayDate}
                                        className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Due Date:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="date"
                                        name="to-date"
                                        required
                                        defaultValue={""}
                                        onChange={(e) => {
                                            setDueDate(e.target.value);
                                        }}
                                        id="DueDate"
                                        className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Description:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        required
                                        defaultValue={""}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                        }}
                                        id="Description"
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Amount:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        required
                                        id="Amount"
                                        onChange={(e) => {
                                            // Remove any non-numeric characters except the decimal point
                                            const cleanedValue =
                                                e.target.value.replace(
                                                    /[^0-9.]/g,
                                                    ""
                                                );

                                            // Ensure only one decimal point is allowed
                                            const decimalCount =
                                                cleanedValue.split(".").length -
                                                1;
                                            if (decimalCount <= 1) {
                                                setInvoiceAmount(cleanedValue);
                                            }
                                        }}
                                        value={invoiceAmount}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Payment Type:
                                </h1>
                                <div className="pb-2 border-b">
                                    <select
                                        id="PaymentTypeId"
                                        defaultChecked={paymentType}
                                        onChange={determinePaymentStatus}
                                        className="rounded w-full border-gray-200 border-1 f focus:ring focus:ring-goldt"
                                    >
                                        <option value="2">Cash</option>
                                        <option value="1">Credit Card</option>
                                    </select>
                                </div>
                                {paymentField ? (
                                    <h1 className="text-gray-400 border-b hidden">
                                        Paid:
                                    </h1>
                                ) : null}
                                {paymentField ? (
                                    <div className="pb-2 border-b hidden">
                                        <input
                                            type="checkbox"
                                            id="PaymentStatus"
                                            onClick={
                                                determinePaymentStatusValue
                                            }
                                            className="rounded text-green-500 focus:ring-green-300"
                                        />
                                    </div>
                                ) : null}
                                {!paymentField ? (
                                    <h1 className="text-gray-400 border-b">
                                        Processed Bank:{" "}
                                        <span className="text-red-500">*</span>
                                    </h1>
                                ) : null}
                                {!paymentField ? (
                                    <div className="pb-2 border-b">
                                        <input
                                            type="text"
                                            id="ProcessedBank"
                                            required
                                            defaultValue={processedBankValue}
                                            onChange={(e) => {
                                                setProcessedBankValue(
                                                    e.target.value
                                                );
                                            }}
                                            className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                        />
                                    </div>
                                ) : null}
                                {!paymentField ? (
                                    <h1 className="text-gray-400 border-b">
                                        Payment Date:{" "}
                                        <span className="text-red-500">*</span>
                                    </h1>
                                ) : null}
                                {!paymentField ? (
                                    <div className="pb-2 border-b">
                                        <input
                                            type="date"
                                            id="PaymentDate"
                                            required
                                            defaultValue={paymentDateValue}
                                            onChange={(e) => {
                                                setPaymentDateValue(
                                                    e.target.value
                                                );
                                            }}
                                            name="to-date"
                                            className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                ) : null}
                                <h1 className="text-gray-400 border-b">
                                    POD Required:
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="checkbox"
                                        id="PodRequired"
                                        value={checkbox} // Set the input value to the state variable
                                        onChange={handleInputChange} // Handle input changes
                                        className="rounded text-green-500 focus:ring-green-300"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    File:
                                </h1>
                                <div className="pb-2 border-b">
                                    <DropBox
                                        selectedFiles={selectedFiles}
                                        setSelectedFiles={setSelectedFiles}
                                        existedFiles={existedFiles}
                                        setExistedFiles={setExistedFiles}
                                        path={"Invoices"}
                                        newFiles={newFiles}
                                        setNewFiles={setNewFiles}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end w-full gap-x-2">
                                <InvoicesButton
                                    name="Cancel"
                                    onClick={() => {
                                        GoBack();
                                    }}
                                    icon={
                                        <ChevronLeftIcon className="mr-1 h-5" />
                                    }
                                />
                                <InvoicesButton
                                    type={"submit"}
                                    name={
                                        isLoading ? (
                                            <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-smooth"></div>
                                            </div>
                                        ) : (
                                            "Add"
                                        )
                                    }
                                    disabled={isLoading}
                                    // onClick={() => {
                                    //     validateEditForm();
                                    // }}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
