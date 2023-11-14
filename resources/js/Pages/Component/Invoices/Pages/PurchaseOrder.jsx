import { useState } from "react";
import {
    NoSymbolIcon,
    DocumentChartBarIcon,
    DocumentCheckIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import ExcelJS from "exceljs";
import { TextFilter } from "../components/TextFilter";
import MainTable from "../components/MainTable";
import InvoicesButton from "../components/InvoicesButton";
import { useEffect } from "react";
import Select from "react-select";
import moment from "moment/moment";
import * as signalR from "@microsoft/signalr";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function PurchaseOrder({
    setActiveIndexInv,
    POs,
    filteredPOs,
    setFilteredPOs,
    sortedData,
    setSortedData,
    currentPage,
    setCurrentPage,
    activeJob,
    setActiveJob,
    selectedRecords,
    setSelectedRecords,
    originalData,
    setOriginalData,
    poNbSearch,
    setpoNbSearch,
    // selectedState,
    // setSelectedState,
    // selectedSupplier,
    // setSelectedSupplier,
    // selectedCompany,
    // setSelectedCompany,
    selectedStateOptions,
    setselectedStateOptions,
    selectedSupplierOptions,
    setselectedSupplierOptions,
    selectedCompanyOptions,
    setselectedCompanyOptions,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    url,
    states,
    setPO,
    supplierData,
    companies,
    setPOBack,
    categories,
    setPODetails,
    currentUser,
    getPOs,
    loadingPOs,
    setPOs,
    hubConnection,
    setLoadingPOs,
    activeIndexInv,
    scrollPO,
    setScrollPO,
}) {
    useEffect(() => {
        setLoadingPOs(true);
        axios
            .get(`${url}api/GTIS/POs`, {
                headers: {
                    UserId: currentUser.user_id,
                    PO_Id: null,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setPOs(parsedData);
                    setActiveIndexInv(2);
                    setLoadingPOs(false);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [activeIndexInv]);
    function filterbyState(jsonData) {
        if (!jsonData || jsonData.length === 0) {
            return [];
        }
        if (currentUser.role_id == 6 || currentUser.role_id == 7) {
            return jsonData.filter(
                (item) => item.StateId === currentUser.state
            );
        } else {
            return jsonData;
        }
    }
    // const [filteredPOs, setFilteredPOs] = useState(filterbyState(POs));
    // const [sortedData, setSortedData] = useState(filteredPOs);
    // const [currentPage, setCurrentPage] = useState(0);
    // const [activeJob, setActiveJob] = useState(0);
    // const [selectedRecords, setSelectedRecords] = useState([]);
    // const [originalData, setOriginalData] = useState([]);
    // const [poNbSearch, setpoNbSearch] = useState();
    const [selectedState, setSelectedState] = useState(selectedStateOptions);
    const [selectedSupplier, setSelectedSupplier] = useState(
        selectedSupplierOptions
    );
    const [selectedCompany, setSelectedCompany] = useState(
        selectedCompanyOptions
    );
    // const [selectedStateOptions, setselectedStateOptions] = useState([]);
    // const [selectedSupplierOptions, setselectedSupplierOptions] = useState([]);
    // const [selectedCompanyOptions, setselectedCompanyOptions] = useState([]);
    // const [startDate, setStartDate] = useState(getOldestPoDate(POs));
    // const [endDate, setEndDate] = useState(getLatestPoDate(POs));
    useEffect(() => {
        setStartDate(getOldestPoDate(POs));
        setEndDate(getLatestPoDate(POs));
        setSortedData(filterbyState(POs));
    }, []);

    useEffect(() => {
        setFilteredPOs(sortedData);
    }, [sortedData]);
    const customStyles = {
        control: (provided) => ({
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
    function getOldestPoDate(data) {
        // Filter out elements with invalid 'CreatedDate' values
        let validData = [];
        if (Array.isArray(data)) {
            validData = data.filter((item) => isValidDate(item?.PoDate));
        }
        // Sort the validData array based on the 'CreatedDate' property
        const sortedData = validData.sort(
            (a, b) => new Date(a.PoDate) - new Date(b.PoDate)
        );
        // Check if the sortedData array is empty
        if (sortedData.length === 0) {
            return null; // No valid dates found
        }
        // Extract only the date part from the 'CreatedDate' of the first element (oldest date)
        const oldestDate = new Date(sortedData[0]?.PoDate).toLocaleDateString(
            "en-CA"
        );
        // Return the oldest date in the 'YYYY-MM-DD' format
        return oldestDate;
    }
    function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date);
    }
    function getLatestPoDate(data) {
        let validData = [];
        if (Array.isArray(data)) {
            validData = data.filter((item) => isValidDate(item?.PoDate));
        }
        // Sort the data array based on the 'DespatchDate' property in descending order
        const sortedData = validData.sort(
            (a, b) => new Date(b.PoDate) - new Date(a.PoDate)
        );
        if (sortedData.length === 0) {
            return null; // No valid dates found
        }
        const latestDate = new Date(sortedData[0]?.PoDate).toLocaleDateString(
            "en-CA"
        );

        // Return the 'DespatchDate' of the first element (latest date)
        return latestDate;
    }
    useEffect(() => {
        setFilteredPOs(filterbyState(POs));
    }, [POs]);
    useEffect(() => {
        setFilteredPOs(filterRecords(filterbyState(POs)));
        setOriginalData(filterRecords(filterbyState(POs)));
    }, [
        POs,
        activeJob,
        startDate,
        endDate,
        poNbSearch,
        selectedStateOptions,
        selectedSupplierOptions,
        selectedCompanyOptions,
    ]);

    const [purchasorderfilter, setpurchasorderfilter] = useState([
        {
            id: 0,
            name: "All",
            icon: DocumentChartBarIcon,
            current: true,
        },
        {
            id: 1,
            name: "Waiting approval",
            icon: DocumentCheckIcon,
            current: false,
        },
        {
            id: 4,
            name: "Approved",
            icon: CheckCircleIcon,
            current: false,
        },
        {
            id: 2,
            name: "Rejected",
            icon: NoSymbolIcon,
            current: false,
        },
        {
            id: 3,
            name: "Closed",
            icon: ExclamationCircleIcon,
            current: false,
        },
    ]);
    const filterRecords = (jsonData) => {
        let filteredData = Array.isArray(jsonData)
            ? jsonData.filter((record) => {
                  if (activeJob == 1) {
                      // Waiting Approval Tab
                      if (
                          currentUser.role_id == 6 ||
                          currentUser.role_id == 7
                      ) {
                          // For SM and For Assistants
                          return record.ApprovalStatus == 1; // It will show First approvals
                      } else {
                          // for others
                          return record.SecondApproval == 1; // it will show second approvals
                      }
                  } else if (activeJob == 2) {
                      // Reject Tab
                      if (
                          currentUser.role_id == 6 || // for Sm
                          currentUser.role_id == 7 // for assistant
                      ) {
                          return record.ApprovalStatus == 3; // rejected first status
                      } else {
                          return record.SecondApproval == 3; // rejected second Status
                      }
                  } else if (activeJob == 3) {
                      return record.MatchInvoice == 3; // Rejected
                  } else if (activeJob == 4) {
                      return record.SecondApproval == 2;
                  } else if (activeJob == 0) {
                      return true; // Invalid activeJob, return empty array
                  } else {
                      return false; // Invalid activeJob, return empty array
                  }
              })
            : [];
        // If the currentUser role is 6 or 7, filter based on StateId
        if (currentUser.role_id == 6 || currentUser.role_id == 7) {
            filteredData = filteredData.filter(
                (record) => record.StateId == currentUser.state
            );
        }
        const selectedStateName = selectedStateOptions.map(
            (receiver) => receiver.value
        );
        const selectedSupplierName = selectedSupplierOptions.map(
            (receiver) => receiver.value
        );
        const selectedCompanyName = selectedCompanyOptions.map(
            (receiver) => receiver.value
        );
        // // Perform the additional filtering based on poNbSearch
        filteredData = filteredData.filter((record) => {
            const isStateIncluded =
                selectedStateName.length === 0 ||
                selectedStateName?.includes(record.StateId);
            const invoiceNbMatch = poNbSearch
                ? record.PoNo.toLowerCase().includes(poNbSearch.toLowerCase())
                : true;
            const isSupplierIncluded =
                selectedSupplierName.length === 0 ||
                selectedSupplierName?.includes(record.SupplierId);
            const isCompanyIncluded =
                selectedCompanyName.length === 0 ||
                selectedCompanyName?.includes(record.CompanyId);
            const itemDate = new Date(record.PoDate);
            const filterStartDate = new Date(startDate);
            const filterEndDate = new Date(endDate);
            filterStartDate.setHours(0);
            filterEndDate.setSeconds(59);
            filterEndDate.setMinutes(59);
            filterEndDate.setHours(23);
            return (
                itemDate >= filterStartDate &&
                itemDate <= filterEndDate &&
                invoiceNbMatch &&
                isStateIncluded &&
                isSupplierIncluded &&
                isCompanyIncluded
            );
        });
        return filteredData;
    };
    function changeFilter(index) {
        setActiveJob(index);
        setCurrentPage(0)
        const updatedElements = purchasorderfilter.map((element) => {
            if (element.id === index) {
                return { ...element, current: true };
            } else {
                return { ...element, current: false };
            }
        });
        setpurchasorderfilter(updatedElements);
    }
    function changeFilterfirst(index) {
        setActiveJob(index);
        // setCurrentPage(0)
        const updatedElements = purchasorderfilter.map((element) => {
            if (element.id === index) {
                return { ...element, current: true };
            } else {
                return { ...element, current: false };
            }
        });
        setpurchasorderfilter(updatedElements);
    }
    useEffect(() => {
        changeFilterfirst(activeJob);
    }, []);
    function handleCreate() {
        setPO(null);
        setActiveIndexInv(8);
    }
    const stateSelectOption = (jsonData) => {
        const transformedData = jsonData.map((item) => ({
            value: item.StateId,
            label: item.StateCode,
        }));
        return transformedData;
    };
    const companySelectOption = (jsonData) => {
        const transformedData = jsonData.map((item) => ({
            value: item.CompanyId,
            label: item.CompanyName,
        }));
        return transformedData;
    };
    const supplierSelectOption = (jsonData) => {
        const transformedData = jsonData.map((item) => ({
            value: item.SupplierId,
            label: item.SupplierName,
        }));
        return transformedData;
    };
    const header = [
        { key: "PoNo", label: "Po No", Filter: TextFilter },
        { key: "StateId", label: "State", Filter: TextFilter },
        { key: "SupplierId", label: "Supplier", Filter: TextFilter },
        { key: "CompanyId", label: "Company", Filter: TextFilter },
        { key: "CategoryId", label: "Category", Filter: TextFilter },
        { key: "PoDate", label: "Po Date", Filter: TextFilter },
        { key: "Amount", label: "Amount", Filter: TextFilter },
        { key: "ApprovalStatus", label: "Approval Status", Filter: TextFilter },
        { key: "FirstApprovedBy", label: "Approved By", Filter: TextFilter },
        { key: "SecondApproval", label: "Second Approval", Filter: TextFilter },
        { key: "SecondApprovedBy", label: "Authorized By", Filter: TextFilter },
        { key: "Description", label: "Description", Filter: TextFilter },
        { key: "MatchInvoice", label: "Match Invoice", Filter: TextFilter },
    ];
    const handleStartDateChange = (event) => {
        const value = event.target.value;
        setStartDate(value);
        // setSDate(value);
    };
    const handleEndDateChange = (event) => {
        const value = event.target.value;
        setEndDate(value);
    };
    const handleStateSelectChange = (selectedOptions) => {
        setselectedStateOptions(selectedOptions);
        // filterData(SDate, EDate, selectedReceiver);
    };
    const handleSupplierSelectChange = (selectedOptions) => {
        setselectedSupplierOptions(selectedOptions);
        // filterData(SDate, EDate, selectedReceiver);
    };
    const handleCompanySelectChange = (selectedOptions) => {
        setselectedCompanyOptions(selectedOptions);
        // filterData(SDate, EDate, selectedReceiver);
    };
    function handleSearchChange(event) {
        setpoNbSearch(event.target.value);
    }
    function showhideCreateButton() {
        if (currentUser.role_id == 8 || currentUser.role_id == 10) {
            return false;
        } else {
            return true;
        }
    }

    const headers = [
        "Po No",
        "State",
        "Supplier",
        "Company",
        "Category",
        "Po Date",
        "Amount",
        "Approval Status",
        "Approved By",
        "Second Approval",
        "Authorized By",
        "Description",
        "Match Invoice",
    ];

    function handleDownloadExcel() {
        // Get the selected columns or use all columns if none are selected
        let selectedColumns = headers;

        // Extract the data for the selected columns  moment(consignment.DespatchDate, 'YYYY-MM-DD').format('DD-MM-YYYY')
        const data = selectedRecords.map((object) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (column.replace(/\s+/g, "") === "PoDate") {
                        acc[column.replace(/\s+/g, "")] =
                            moment(
                                object["PoDate"].replace("T", " "),
                                "YYYY-MM-DD"
                            ).format("DD-MM-YYYY") == "Invalid date"
                                ? ""
                                : moment(
                                      object["PoDate"].replace("T", " "),
                                      "YYYY-MM-DD"
                                  ).format("DD-MM-YYYY");
                    } else if (columnKey === "ApprovalStatus") {
                        if (object["ApprovalStatus"] == 1) {
                            acc[columnKey] = "Waiting";
                        } else if (object["ApprovalStatus"] == 2) {
                            acc[columnKey] = "Approved";
                        } else {
                            acc[columnKey] = "Rejected";
                        }
                    } else if (columnKey === "SecondApproval") {
                        if (object["SecondApproval"] == 1) {
                            acc[columnKey] = "Waiting";
                        } else if (object["SecondApproval"] == 2) {
                            acc[columnKey] = "Approved";
                        } else {
                            acc[columnKey] = "Rejected";
                        }
                    } else if (columnKey === "MatchInvoice") {
                        if (object["MatchInvoice"] == 1) {
                            acc[columnKey] = "Waiting";
                        } else if (object["MatchInvoice"] == 2) {
                            acc[columnKey] = "Match";
                        } else {
                            acc[columnKey] = "Closed";
                        }
                    } else if (columnKey === "State") {
                        const State = states?.find(
                            (state) => state.StateId === object.StateId
                        );
                        acc[columnKey] = State?.StateCode;
                    } else if (columnKey === "Supplier") {
                        const Supplier = supplierData?.find(
                            (supplier) =>
                                supplier.SupplierId === object.SupplierId
                        );
                        acc[columnKey] = Supplier?.SupplierName;
                    } else if (columnKey === "Company") {
                        const Company = companies?.find(
                            (company) => company.CompanyId === object.CompanyId
                        );
                        acc[columnKey] = Company?.CompanyName;
                    } else if (columnKey === "Category") {
                        const Category = categories?.find(
                            (category) =>
                                category.CategoryId === object.CategoryId
                        );
                        acc[columnKey] = Category?.CategoryName;
                    } else if (columnKey === "AuthorizedBy") {
                        acc[columnKey] = object?.SecondApprovedBy;
                    } else if (columnKey === "ApprovedBy") {
                        acc[columnKey] = object?.FirstApprovedBy;
                    } else {
                        acc[column.replace(/\s+/g, "")] =
                            object[column.replace(/\s+/g, "")];
                    }
                }
                return acc;
            }, {})
        );

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();

        // Add a worksheet to the workbook
        const worksheet = workbook.addWorksheet("Sheet1");

        // Apply custom styles to the header row
        const headerRow = worksheet.addRow(selectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" }, // Yellow background color (#e2b540)
        };
        headerRow.alignment = { horizontal: "center" };

        // Add the data to the worksheet
        data.forEach((rowData) => {
            const row = worksheet.addRow(Object.values(rowData));

            // Set left alignment for each cell in the row
            row.eachCell((cell) => {
                cell.alignment = { horizontal: "left" };
            });
        });

        // Set column widths
        const columnWidths = selectedColumns.map(() => 15); // Set width of each column
        worksheet.columns = columnWidths.map((width, index) => ({
            width,
            key: selectedColumns[index],
        }));

        // Generate the Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            // Convert the buffer to a Blob
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Save the file using FileSaver.js or alternative method
            saveAs(blob, "Purchase orders.xlsx");
        });
    }
    function AssistantOrManager() {
        if (currentUser.role_id == 6 || currentUser.role_id == 7) return true;
        else return false;
    }

    function ApproveSelected() {
        let toApprove = selectedRecords.map((item) => {
            return { ["OwnerId"]: item["PoId"] };
        });
        let type = 0;
        if (currentUser.role_id == 10) {
            type = 2;
        } else {
            type = 1;
        }
        const inputValues = {
            ApprovalModel: 2,
            ApprovalType: type,
            MainId: toApprove,
            StatusId: 2,
            AddedBy: currentUser.user_id,
        };
        axios
            .post(`${url}api/GTIS/ApprovalStatus`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                getPOs();
                if (
                    hubConnection &&
                    hubConnection.state === signalR.HubConnectionState.Connected
                ) {
                    res.data.map((item) => {
                        let array = [];
                        array.push(item);
                        hubConnection
                            .invoke("SendNotification", array)
                            .catch((error) => {
                                console.error(
                                    "Error sending notification:",
                                    error
                                );
                            });
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="p-5 bg-smooth">
            <div className="flex gap-x-1 items-center">
                <h1 className="font-bold text-dark text-3xl">Purchase Order</h1>{" "}
                <p className="mt-auto text-gray-400">({filteredPOs?.length})</p>
                <div className=" ml-auto flex gap-x-2">
                    {selectedRecords.length > 0 ? (
                        <div className=" ">
                            <InvoicesButton
                                name="Export"
                                onClick={() => handleDownloadExcel()}
                                className="w-auto ml-auto"
                            />
                        </div>
                    ) : null}
                    {selectedRecords.length > 0 &&
                    activeJob == 1 &&
                    (currentUser.role_id == 10 ||
                        currentUser.role_id == 6 ||
                        currentUser.role_id == 1) ? (
                        <div className=" ">
                            <InvoicesButton
                                name="Approve"
                                onClick={() => ApproveSelected()}
                                className="w-auto ml-auto"
                            />
                        </div>
                    ) : null}
                    {showhideCreateButton() ? (
                        <div className="hidden sm:block">
                            <InvoicesButton
                                name="Create PO"
                                onClick={() => handleCreate()}
                                className="w-auto ml-auto "
                            />
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-3 mt-5">
                <div>
                    <div className="relative border rounded">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-400 left-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Po No"
                            defaultValue={poNbSearch ? poNbSearch : ""}
                            onChange={handleSearchChange}
                            className="w-full py-0.5 h-[35px] pl-12 pr-4 text-gray-500 border-none rounded-md outline-none "
                        />
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex lg:items-center flex-col md:flex-row">
                        <input
                            value={startDate}
                            min={getOldestPoDate(POs)}
                            max={endDate}
                            type="date"
                            name="to-date"
                            id="to-date"
                            onChange={handleStartDateChange}
                            className="block w-full md:max-w-lg h-[35px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        />
                        <div className="px-2 ">to</div>
                        <input
                            min={startDate}
                            max={getLatestPoDate(POs)}
                            value={endDate}
                            onChange={handleEndDateChange}
                            type="date"
                            name="to-date"
                            id="to-date"
                            className="block w-full md:max-w-lg h-[35px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-3 mt-5">
                {!AssistantOrManager() ? (
                    <div>
                        <div className="mt-2 w-full sm:mt-0 ">
                            <Select
                                placeholder={<div>State... </div>}
                                // styles={customStyles}
                                isMulti
                                name="colors"
                                defaultValue={selectedState}
                                isClearable={true}
                                isSearchable={true}
                                options={stateSelectOption(states)}
                                onChange={handleStateSelectChange}
                                className="basic-multi-select z-20"
                                classNamePrefix="select"
                                id="stateSelect"
                            />
                        </div>
                    </div>
                ) : null}
                <div>
                    {" "}
                    <div className="mt-2 w-full sm:mt-0 ">
                        <Select
                            placeholder={<div>Supplier... </div>}
                            styles={customStyles}
                            isMulti
                            name="colors"
                            defaultValue={selectedSupplier}
                            isSearchable={false} // Set isSearchable to false to disable the search functionality
                            options={supplierSelectOption(supplierData)}
                            onChange={handleSupplierSelectChange}
                            className="basic-multi-select z-20 "
                            classNamePrefix="select"
                        />
                    </div>
                </div>
                <div>
                    {" "}
                    <div className="mt-2 w-full sm:mt-0 ">
                        <Select
                            placeholder={<div>Company... </div>}
                            styles={customStyles}
                            isMulti
                            name="colors"
                            defaultValue={selectedCompany}
                            isSearchable={false} // Set isSearchable to false to disable the search functionality
                            options={companySelectOption(companies)}
                            onChange={handleCompanySelectChange}
                            className="basic-multi-select z-20"
                            classNamePrefix="select"
                        />
                    </div>
                </div>
            </div>
            <ul className="flex space-x-2 mt-5 border-b">
                {purchasorderfilter.map((job, index) => (
                    <li
                        key={index}
                        className={`cursor-pointer text-xs flex flex-row sm:text-base py-2 ${
                            job.current === true
                                ? "text-dark border-b-4  border-goldd font-bold "
                                : "text-gray-400 "
                        }`}
                        onClick={() => changeFilter(job.id)}
                    >
                        <job.icon className="w-5 hidden sm:block" />
                        <div className="px-2"> {job.name}</div>
                    </li>
                ))}
            </ul>
            {loadingPOs ? (
                <div className="min-h-screen md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce200`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full animate-bounce400`}
                        ></div>
                    </div>
                    <div className="text-dark mt-4 font-bold">
                        Please wait while we get the data for you.
                    </div>
                </div>
            ) : (
                <div>
                    {" "}
                    <MainTable
                        originalData={originalData}
                        sortedData={filteredPOs}
                        setSortedData={setFilteredPOs}
                        header={header}
                        body={filteredPOs}
                        states={states}
                        setPO={setPO}
                        selectedRecords={selectedRecords}
                        setSelectedRecords={setSelectedRecords}
                        supplierData={supplierData}
                        companies={companies}
                        categories={categories}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setPOBack={setPOBack}
                        setPODetails={setPODetails}
                        setActiveIndexInv={setActiveIndexInv}
                        currentUser={currentUser}
                        scroll={scrollPO}
                        setScroll={setScrollPO}
                    />
                </div>
            )}
        </div>
    );
}
