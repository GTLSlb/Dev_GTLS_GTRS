import InvoicesButton from "../components/InvoicesButton";
import { Fragment, useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import * as signalRCore from "@microsoft/signalr";
import {
    CheckIcon,
    ChevronUpDownIcon,
    ChevronLeftIcon,
} from "@heroicons/react/20/solid";
import Select from "react-select";

import moment from "moment/moment";
import DropBox from "../components/DropBox";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function CreatePO({
    PO,
    setPO,
    states,
    AlertToast,
    getPOs,
    setActiveIndexInv,
    supplierData,
    companies,
    url,
    currentUser,
    categories,
    hubConnection
}) {
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [isLoading, SetIsLoading] = useState(false);

    useEffect(() => {
        // Filter the data based on userStateId
        let filtered = [];
        if (currentUser.role_id == 6 || currentUser.role_id == 7) {
            filtered = companies.filter(
                (item) =>
                    item.StateId === currentUser.state && item.StatusId == 1
            );
        } else {
            filtered = companies.filter((item) => item.StatusId == 1);
        }

        setFilteredCompanies(filtered);
    }, [companies]);
    const [stateValue, setStateValue] = useState(1);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [existedFiles, setExistedFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [stateField, setstateField] = useState(true);
    const [selectedState, setSelectedState] = useState();
    const [selectedCompany, setSelectedCompany] = useState();
    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [poDate, setPoDate] = useState("");
    const [description, setDescription] = useState("");
    const Amount = document.getElementById("Amount")?.value;
    const [amount, setAmount] = useState(Amount);
    function GoBack() {
        setActiveIndexInv(2);
    }
    useEffect(() => {
        if (PO) {
            setSelectedState(
                transformToStateOption(
                    states?.find((state) => state.StateId === PO.StateId)
                )
            );
            setSelectedCompany(
                transformToCompanyOption(
                    companies?.find(
                        (company) => company.CompanyId === PO.CompanyId
                    )
                )
            );
            setSelectedSupplier(
                transformToSupplierOption(
                    supplierData?.find(
                        (supplier) => supplier.SupplierId === PO.SupplierId
                    )
                )
            );
            setSelectedCategory(
                transformToCategoryOption(
                    categories?.find(
                        (category) => category.CategoryId === PO.CategoryId
                    )
                )
            );
        }
    }, []);
    useEffect(() => {
        HideShowState();
        if (!PO) {
            document.getElementById("PoDate").value = "";
            document.getElementById("Amount").value = "";
            document.getElementById("Description").value = "";
            setExistedFiles([]);
            setAmount();
            setNewFiles([]);
            setSelectedFiles([]);
        }
    }, [PO]);
    function HideShowState() {
        if (currentUser.role_id == 6 || currentUser.role_id == 7) {
            setstateField(false);
        } else {
            setstateField(true);
        }
    }
    function determineStateValue() {
        if (currentUser.role_id == 6 || currentUser.role_id == 7) {
            setStateValue(currentUser.state);
        } else {
            setStateValue(selectedState?.value);
        }
    }
    useEffect(() => {
        determineStateValue();
    }, [selectedState?.value]);

    let filenamesArray = [];

    const handleFileUpload = async () => {
        if (newFiles.length > 0) {
            try {
                const uploadPromises = newFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                        const response = await axios.post(
                            "/api/uploadPO",
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
                        } else {
                        }
                    } catch (error) {
                        console.error("Error:", error);
                    }
                });

                // Wait for all uploads to complete before proceeding
                await Promise.all(uploadPromises);
                // After all uploads are complete, you can proceed with further actions
                handleCreatePO();
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            handleCreatePO();
            //   alert("Please select one or more files first.");
        }
    };

    const deleteFilesWithStatusTwo = async (fileNamesToDelete) => {
        try {
            const response = await axios.delete("/api/delete-files", {
                data: { fileNames: fileNamesToDelete },
            });
            // Success message from the server
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCreatePO = () => {
        SetIsLoading(true);
        // Get the input values here and update the newobject state
        let approval = 1;
        let secondapproval = 1;
        if (currentUser.role_id == 6) {
            approval = 2;
            secondapproval = 1;
        } else if (currentUser.role_id == 7) {
            approval = 1;
            secondapproval = 1;
        }
        if (PO) {
            approval = PO.ApprovalStatus;
        }
        existedFiles.map((file) => {
            filenamesArray.push({
                DocId: file.DocId,
                DocName: file.DocName,
                DocStatus: file.DocStatus,
            });
        });
        const inputValues = {
            PoId: PO?.PoId,
            StateId: stateValue,
            SupplierId: selectedSupplier.value,
            CompanyId: selectedCompany.value,
            CategoryId: selectedCategory.value,
            PoDate: document.getElementById("PoDate").value,
            Amount: document.getElementById("Amount").value,
            ApprovalStatus: approval,
            SecondApproval: secondapproval,
            PoDoc: filenamesArray,
            Description: document.getElementById("Description").value,
            AddedBy: currentUser.user_id,
        };
        axios
            .post(`${url}api/GTIS/Add/PO`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                getPOs();
                setPO(null);
                AlertToast("Saved Successfully", 1);
                const fileNamesToDelete = existedFiles
                    .filter((file) => file.DocStatus === 2)
                    .map((file) => file.DocName);
                if (fileNamesToDelete.length > 0) {
                    deleteFilesWithStatusTwo(fileNamesToDelete);
                }
                SetIsLoading(false);
                if (
                    hubConnection &&
                    hubConnection.state === signalR.HubConnectionState.Connected
                ) {
                    hubConnection
                        .invoke("SendNotification", res.data)
                        .catch((error) => {
                            console.error("Error sending notification:", error);
                        });
                }
            })
            .catch((err) => {
                SetIsLoading(false);
                AlertToast("Error please try again.", 2);
            });
    };

    const validateForm = (e) => {
        e.preventDefault();
        if (poDate === "" || description === "" || amount === "") {
            AlertToast("Please fill in all required fields !", 2);
        } else {
            handleFileUpload();
        }
    };
    const validateEditForm = (e) => {
        e.preventDefault();
        if (
            document.getElementById("PoDate")?.value === "" ||
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
        } else if(selectedState){
            filteredData = jsonData.filter(
                (item) =>
                    item.StateId === selectedState.value && item.StatusId === 1
            );
        }else {
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

    if (PO) {
        return (
            <div className="p-5 flex justify-center bg-smooth">
                <div className="bg-white rounded-xl w-full lg:w-3/6 p-5 shadow">
                    <form onSubmit={validateEditForm}>
                        <h1 className="font-bold text-dark text-3xl">
                            Edit PO
                        </h1>
                        <div className="grid grid-cols-2 div p-2 gap-y-2 pb-20 mt-5 text-sm sm:text-base">
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
                                            options={stateSelectOption(states)}
                                            onChange={handleStateSelectChange}
                                            className="basic-multi-select text-red "
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                            ) : null}
                            <h1 className="text-gray-400 border-b">Company:</h1>
                            <div className="pb-2 border-b">
                                <div className="flex flex-col gap-y-2">
                                    <Select
                                        placeholder={<div>Company</div>}
                                        styles={customStyles}
                                        name="colors"
                                        value={selectedCompany}
                                        isSearchable={true} // Set isSearchable to false to disable the search functionality
                                        options={companySelectOption(companies)}
                                        onChange={handleCompanySelectChange}
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
                                        onChange={handleCategorySelectChange}
                                        className="basic-multi-select text-red "
                                        classNamePrefix="select"
                                    />
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
                                        onChange={handleStateSelectChange}
                                        className="basic-multi-select text-red "
                                        classNamePrefix="select"
                                    />
                                </div>
                            </div>
                            <h1 className="text-gray-400 border-b">
                                Date:<span className="text-red-500">*</span>
                            </h1>
                            <div className="border-b pb-2">
                                <input
                                    type="date"
                                    required
                                    name="to-date"
                                    id="PoDate"
                                    defaultValue={moment(
                                        PO?.PoDate.replace("T", " "),
                                        "YYYY-MM-DD HH:mm:ss"
                                    ).format("YYYY-MM-DD")}
                                    className="block w-full lg:w-3/6 max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                />
                            </div>
                            <h1 className="text-gray-400 border-b">
                                Description:
                                <span className="text-red-500">*</span>
                            </h1>
                            <div className="border-b pb-2">
                                <input
                                    type="text"
                                    id="Description"
                                    required
                                    defaultValue={PO.Description}
                                    className="rounded w-full h-7  border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                />
                            </div>
                            <h1 className="text-gray-400 border-b">
                                Amount:<span className="text-red-500">*</span>
                            </h1>
                            <div className="border-b pb-2">
                                <input
                                        type="text"
                                        required
                                        id="Amount"
                                        defaultValue={PO.Amount}
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
                                                setAmount(cleanedValue);
                                            }
                                        }}
                                        value={amount}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                            </div>
                            <h1 className="text-gray-400 border-b">File:</h1>
                            <div className="pb-2 border-b">
                                <DropBox
                                    selectedFiles={selectedFiles}
                                    setSelectedFiles={setSelectedFiles}
                                    existedFiles={existedFiles}
                                    setExistedFiles={setExistedFiles}
                                    newFiles={newFiles}
                                    setNewFiles={setNewFiles}
                                    object={PO}
                                    path={"POs"}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end w-full gap-x-2">
                            <InvoicesButton
                                name="Cancel"
                                onClick={() => {
                                    GoBack();
                                }}
                                icon={<ChevronLeftIcon className="mr-1 h-5" />}
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
                                //     validateEditForm();
                                // }}
                            />
                        </div>
                    </form>
                </div>
            </div>
        );
    } else {
        return (
            <div className="p-5 flex justify-center bg-smooth">
                <div className="bg-white rounded-xl w-full lg:w-3/6 p-5 shadow">
                    <form onSubmit={validateForm}>
                        <h1 className="font-bold text-dark text-3xl">
                            Create PO
                        </h1>
                        <div className="grid grid-cols-2 div p-2 gap-y-2 pb-20 mt-5 text-sm sm:text-base">
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
                                            options={stateSelectOption(states)}
                                            onChange={handleStateSelectChange}
                                            className="basic-multi-select text-red "
                                            classNamePrefix="select"
                                            required
                                        />
                                    </div>
                                </div>
                            ) : null}
                            <h1 className="text-gray-400 border-b">
                                Company:<span className="text-red-500">*</span>
                            </h1>
                            <div className="pb-2 w-full border-b">
                                <div className="flex flex-col gap-y-2">
                                    <Select
                                        placeholder={<div>Company</div>}
                                        styles={customStyles}
                                        name="colors"
                                        value={selectedCompany}
                                        isSearchable={true} // Set isSearchable to false to disable the search functionality
                                        options={companySelectOption(companies)}
                                        onChange={handleCompanySelectChange}
                                        className="basic-multi-select text-red "
                                        classNamePrefix="select"
                                        required
                                    />
                                </div>
                            </div>
                            <h1 className="text-gray-400 border-b">
                                Category:<span className="text-red-500">*</span>
                            </h1>
                            <div className="border-b pb-2">
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
                                        onChange={handleCategorySelectChange}
                                        className="basic-multi-select text-red "
                                        classNamePrefix="select"
                                        required
                                    />
                                </div>
                            </div>
                            <h1 className="text-gray-400 border-b">
                                Supplier:<span className="text-red-500">*</span>
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
                                        onChange={handleSupplierSelectChange}
                                        className="basic-multi-select text-red "
                                        classNamePrefix="select"
                                        required
                                    />
                                </div>
                            </div>
                            <h1 className="text-gray-400 border-b">
                                Date:<span className="text-red-500">*</span>
                            </h1>
                            <div className="border-b pb-2">
                                <input
                                    type="date"
                                    required
                                    name="to-date"
                                    id="PoDate"
                                    onChange={(e) => {
                                        setPoDate(e.target.value);
                                    }}
                                    className="block w-full lg:w-3/6 max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                />
                            </div>
                            <h1 className="text-gray-400 border-b">
                                Description:
                                <span className="text-red-500">*</span>
                            </h1>
                            <div className="border-b pb-2">
                                <input
                                    type="text"
                                    required
                                    id="Description"
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    className="rounded w-full h-7  border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                />
                            </div>
                            <h1 className="text-gray-400 border-b">
                                Amount:<span className="text-red-500">*</span>
                            </h1>
                            <div className="border-b pb-2">
                                 <input
                                        type="text"
                                        required
                                        id="Amount"
                                        // defaultValue={invoice?.Amount}
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
                                                setAmount(cleanedValue);
                                            }
                                        }}
                                        value={amount}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                            </div>
                            <h1 className="text-gray-400 border-b">File:</h1>
                            <div className="pb-2 border-b">
                                <DropBox
                                    selectedFiles={selectedFiles}
                                    setSelectedFiles={setSelectedFiles}
                                    existedFiles={existedFiles}
                                    setExistedFiles={setExistedFiles}
                                    newFiles={newFiles}
                                    setNewFiles={setNewFiles}
                                    path={"POs"}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end w-full gap-x-2">
                            <InvoicesButton
                                name="Cancel"
                                onClick={() => {
                                    GoBack();
                                }}
                                icon={<ChevronLeftIcon className="mr-1 h-5" />}
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
                    </form>
                </div>
            </div>
        );
    }
}
