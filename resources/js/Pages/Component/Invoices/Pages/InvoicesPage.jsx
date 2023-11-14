import { useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import {
    BanknotesIcon,
    DocumentChartBarIcon,
    DocumentCheckIcon,
    CreditCardIcon,
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

export default function InvoicesPage({
    setActiveIndexInv,
    invoices,
    states,
    supplierData,
    companies,
    AlertToast,
    setPODetails,
    POs,
    setPOBack,
    activeJob,
    setActiveJob,
    currentPage,
    setCurrentPage,
    selectedRecords,
    setSelectedRecords,
    originalData,
    setOriginalData,
    sortedData,
    setSortedData,
    invoiceNbSearch,
    setInvoiceNbSearch,
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
    getInvoices,
    activeIndexInv,
    categories,
    setInvoice,
    currentUser,
    setInvoices,
    setLoadingInvoices,
    loadingInvoices,
    setInvoiceDetails,
    hubConnection,
    scrollInvoice,
    setScrollInvoice,
}) {
    useEffect(() => {
        setLoadingInvoices(true);
        axios
            .get(`${url}api/GTIS/Invoices`, {
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
                    setInvoices(parsedData);
                    setLoadingInvoices(false);
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
    const [filteredInvoices, setFilteredInvoices] = useState(
        filterbyState(invoices)
    );
    // const [activeJob, setActiveJob] = useState(0);
    // const [currentPage, setCurrentPage] = useState(0);
    // const [selectedRecords, setSelectedRecords] = useState([]);
    // const [originalData, setOriginalData] = useState([]);
    // const [sortedData, setSortedData] = useState(filteredInvoices);
    // const [invoiceNbSearch, setInvoiceNbSearch] = useState();
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
    // const [startDate, setStartDate] = useState(getOldestInvoiceDate(invoices));
    // const [endDate, setEndDate] = useState(getLatestInvoiceDate(invoices));

    useEffect(() => {
        setStartDate(getOldestInvoiceDate(invoices));
        setEndDate(getLatestInvoiceDate(invoices));
        setSortedData(filterbyState(invoices));
    }, []);

    // useEffect(() => {
    //     setSortedData(filteredInvoices);
    // }, [filteredInvoices]);
    useEffect(() => {
        const tempdata = sortedData;
        setFilteredInvoices(tempdata);
        setSortedData(tempdata);
    }, [sortedData]);
    useEffect(
        () => {
            setFilteredInvoices(filterRecords(filterbyState(invoices)));
            setOriginalData(filterRecords(filterbyState(invoices)));
        },
        [
            invoices,
            loadingInvoices,
            activeJob,
            startDate,
            endDate,
            invoiceNbSearch,
            selectedStateOptions,
            selectedSupplierOptions,
            selectedCompanyOptions,
        ],
        []
    );
    function getOldestInvoiceDate(data) {
        // Filter out elements with invalid 'CreatedDate' values
        let validData = [];
        if (Array.isArray(data)) {
            validData = data.filter((item) => isValidDate(item?.InvoiceDate));
        }
        // Sort the validData array based on the 'CreatedDate' property
        const sortedData = validData.sort(
            (a, b) => new Date(a.InvoiceDate) - new Date(b.InvoiceDate)
        );
        // Check if the sortedData array is empty
        if (sortedData.length === 0) {
            return null; // No valid dates found
        }
        // Extract only the date part from the 'CreatedDate' of the first element (oldest date)
        const oldestDate = new Date(
            sortedData[0]?.InvoiceDate
        ).toLocaleDateString("en-CA");
        // Return the oldest date in the 'YYYY-MM-DD' format
        return oldestDate;
    }
    function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date);
    }
    function getLatestInvoiceDate(data) {
        let validData = [];
        if (Array.isArray(data)) {
            validData = data.filter((item) => isValidDate(item?.InvoiceDate));
        }
        // Sort the data array based on the 'DespatchDate' property in descending order
        const sortedData = validData.sort(
            (a, b) => new Date(b.InvoiceDate) - new Date(a.InvoiceDate)
        );
        if (sortedData.length === 0) {
            return null; // No valid dates found
        }
        const latestDate = new Date(
            sortedData[0]?.InvoiceDate
        ).toLocaleDateString("en-CA");

        // Return the 'DespatchDate' of the first element (latest date)
        return latestDate;
    }
    const filterRecords = (jsonData) => {
        setSelectedRecords([]);
        let filteredData;
        filteredData = Array.isArray(jsonData)
            ? jsonData.filter((record) => {
                  if (activeJob == 1) {
                      // If Waiting For Approval Tab
                      if (
                          currentUser.role_id == 6 ||
                          currentUser.role_id == 7
                      ) {
                          // If State Manager or assistant
                          return (
                              record.ApprovalStatus == 1 && // First Approval Waiting
                              record.SecondApproval == 1 // Second Approval Also Waiting
                          );
                      } else {
                          return record.SecondApproval == 1; // return if Second Approval if waiting
                      }
                  } else if (activeJob == 2) {
                      // Bills Tab
                      return (
                          record.PaymentStatus === false && //  return where unpaid
                          record.SecondApproval == 2 // and second approved
                      );
                  } else if (activeJob == 3) {
                      // Paid Invoices
                      return record.PaymentStatus === true; //  Return paid records
                  } else if (activeJob == 0) {
                      return true; // Return All Records
                  } else {
                      return false; // Invalid activeJob, return empty array
                  }
              })
            : [];
        const selectedStateName = selectedStateOptions.map(
            (receiver) => receiver.value
        );
        const selectedSupplierName = selectedSupplierOptions.map(
            (receiver) => receiver.value
        );
        const selectedCompanyName = selectedCompanyOptions.map(
            (receiver) => receiver.value
        );
        // Perform the additional filtering based on invoiceNbSearch
        filteredData = filteredData.filter((record) => {
            const isStateIncluded =
                selectedStateName.length === 0 ||
                selectedStateName?.includes(record.StateId);
            const invoiceNbMatch = invoiceNbSearch
                ? record.InvoiceNo.toLowerCase().includes(
                      invoiceNbSearch.toLowerCase()
                  )
                : true;
            const isSupplierIncluded =
                selectedSupplierName.length === 0 ||
                selectedSupplierName?.includes(record.SupplierId);
            const isCompanyIncluded =
                selectedCompanyName.length === 0 ||
                selectedCompanyName?.includes(record.CompanyId);
            const itemDate = new Date(record.InvoiceDate);
            const filterStartDate = new Date(startDate);
            const filterEndDate = new Date(endDate);
            filterStartDate.setHours(0);
            filterEndDate.setSeconds(59);
            filterEndDate.setMinutes(59);
            filterEndDate.setHours(23);

            // Additional condition for currentUser.role_id and record.StateId
            const isStateMatching = currentUser.state == record.StateId;
            return (
                itemDate >= filterStartDate &&
                itemDate <= filterEndDate &&
                invoiceNbMatch &&
                isStateIncluded &&
                isSupplierIncluded &&
                isCompanyIncluded &&
                (isStateMatching || (!isStateMatching && isStateIncluded)) // Include this line
            );
        });
        return filteredData;
    };

    const handleStartDateChange = (event) => {
        const value = event.target.value;
        setStartDate(value);
        // setSDate(value);
    };
    const handleEndDateChange = (event) => {
        const value = event.target.value;
        setEndDate(value);
    };
    function handleSearchChange(event) {
        setInvoiceNbSearch(event.target.value);
    }
    function AssistantOrManager() {
        if (currentUser.role_id == 6 || currentUser.role_id == 7) return true;
        else return false;
    }
    const [invoicesfilterTabs, setInvoicesfilterTabs] = useState([
        {
            id: 0,
            name: "Invoices",
            icon: DocumentChartBarIcon,
            current: true,
            role: ["1", "6", "7", "8", "9", "10"],
        },
        {
            id: 1,
            name: "Waiting Approval",
            icon: DocumentCheckIcon,
            current: false,
            role: ["1", "6", "7", "8", "9", "10"],
        },
        {
            id: 2,
            name: "Bills",
            icon: BanknotesIcon,
            current: false,
            role: ["1", "8", "9", "10"],
        },
        {
            id: 3,
            name: "Paid Invoices",
            icon: CheckIcon,
            current: false,
            role: ["1", "6", "7", "8", "9", "10"],
        },
    ]);
    const header = [
        { key: "InvoiceNo", label: "Invoice No", Filter: TextFilter },
        { key: "PoNb", label: "Po No", Filter: TextFilter },
        { key: "StateId", label: "State", Filter: TextFilter },
        { key: "SupplierId", label: "Supplier", Filter: TextFilter },
        { key: "CompanyId", label: "Company", Filter: TextFilter },
        { key: "CategoryId", label: "Category", Filter: TextFilter },
        { key: "InvoiceDate", label: "Invoice Date", Filter: TextFilter },
        { key: "DueDate", label: "Due Date", Filter: TextFilter },
        { key: "Amount", label: "Amount", Filter: TextFilter },
        { key: "PaymentTypeId", label: "Payment Type", Filter: TextFilter },
        { key: "ProcessedBank", label: "Processed Bank", Filter: TextFilter },
        { key: "PaymentDate", label: "Payment Date", Filter: TextFilter },
        { key: "ApprovalStatus", label: "Approval Status", Filter: TextFilter },
        { key: "FirstApprovedBy", label: "Approved By", Filter: TextFilter },
        { key: "SecondApproval", label: "Second Approval", Filter: TextFilter },
        {
            key: "SecondApprovedBy",
            label: "Authorized By ",
            Filter: TextFilter,
        },
        { key: "PaymentStatus", label: "Payment Status", Filter: TextFilter },
        { key: "PodRequired", label: "Pod Required", Filter: TextFilter },
        { key: "Description", label: "Description", Filter: TextFilter },
    ];
    function changeFilterTabfirst(index) {
        setSelectedRecords([]);
        setActiveJob(index);
        // setCurrentPage(0)
        const updatedElements = invoicesfilterTabs
            .filter((item) => item.role.includes(currentUser.role_id))
            .map((element) => {
                if (element.id === index) {
                    return { ...element, current: true };
                } else {
                    return { ...element, current: false };
                }
            });
        setInvoicesfilterTabs(updatedElements);
    }
    function changeFilterTab(index) {
        setSelectedRecords([]);
        setActiveJob(index);
        setCurrentPage(0)
        const updatedElements = invoicesfilterTabs
            .filter((item) => item.role.includes(currentUser.role_id))
            .map((element) => {
                if (element.id === index) {
                    return { ...element, current: true };
                } else {
                    return { ...element, current: false };
                }
            });
        setInvoicesfilterTabs(updatedElements);
    }
    useEffect(() => {
        changeFilterTabfirst(activeJob);
    }, []);
    function handleCreate() {
        setInvoice(null);
        setActiveIndexInv(7);
    }
    const stateSelectOption = (jsonData) => {
        const transformedData = jsonData.map((item) => ({
            value: item.StateId,
            label: item.StateCode,
        }));
        transformedData.sort((a, b) => a.label.localeCompare(b.label));
        return transformedData;
    };
    const companySelectOption = (jsonData) => {
        const transformedData = jsonData.map((item) => ({
            value: item.CompanyId,
            label: item.CompanyName,
        }));
        transformedData.sort((a, b) => a.label.localeCompare(b.label));
        return transformedData;
    };
    const supplierSelectOption = (jsonData) => {
        const transformedData = jsonData.map((item) => ({
            value: item.SupplierId,
            label: item.SupplierName,
        }));
        transformedData.sort((a, b) => a.label.localeCompare(b.label));
        return transformedData;
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
    function PaySelected() {
        let inputValues = selectedRecords
            .filter((item) => item.SecondApproval == 2)
            .map((item) => {
                return { ["InvoiceId"]: item["InvoiceId"] };
            });
        axios
            .post(`${url}api/GTIS/PayInvoice`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                    Payment_Status: 1,
                },
            })
            .then((res) => {
                AlertToast("Paid Successfully", 1);
                setSelectedRecords([]);
                getInvoices();
            })
            .catch((err) => {
                AlertToast("Error please try again.", 2);
                console.log(err);
            });
    }
    function ApproveSelected() {
        let toApprove = selectedRecords
            .map((item) => {
                return { ["OwnerId"]: item["InvoiceId"] };
            });
            let type = 0;
            if (currentUser.role_id == 10) {
                type = 2;
            } else {
                type = 1;
            }
            const inputValues = {
                ApprovalModel: 1,
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
                    getInvoices();
                    if (
                        hubConnection &&
                        hubConnection.state === signalR.HubConnectionState.Connected
                    ) {console.log(res.data)
                        
                        res.data.map((item)=>{
                            let array =[]
                            array.push(item)
                            hubConnection
                            .invoke("SendNotification", array)
                            .catch((error) => {
                                console.error("Error sending notification:", error);
                            });})
                        
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    function showhideCreateButton() {
        if (currentUser.role_id == 10) {
            return false;
        } else {
            return true;
        }
    }
    const headers = [
        "Invoice No",
        "Po Nb",
        "State",
        "Supplier",
        "Company",
        "Category",
        "Invoice Date",
        "Due Date",
        "Amount",
        "Payment Type",
        "Processed Bank",
        "Payment Date",
        "Approval Status",
        "Approved By",
        "Second Approval",
        "Authorized By",
        "Payment Status",
        "Pod Required",
        "Description",
    ];
    function handleDownloadExcel() {
        // Get the selected columns or use all columns if none are selected
        let selectedColumns = headers;

        // Extract the data for the selected columns  moment(consignment.DespatchDate, 'YYYY-MM-DD').format('DD-MM-YYYY')
        const data = selectedRecords.map((object) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (column.replace(/\s+/g, "") === "InvoiceDate") {
                        acc[column.replace(/\s+/g, "")] =
                            moment(
                                object["InvoiceDate"].replace("T", " "),
                                "YYYY-MM-DD"
                            ).format("DD-MM-YYYY") == "Invalid date"
                                ? ""
                                : moment(
                                      object["InvoiceDate"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY");
                    } else if (column.replace(/\s+/g, "") === "DueDate") {
                        acc[column.replace(/\s+/g, "")] =
                            moment(
                                object["DueDate"].replace("T", " "),
                                "YYYY-MM-DD"
                            ).format("DD-MM-YYYY hh:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      object["DueDate"].replace("T", " "),
                                      "YYYY-MM-DD"
                                  ).format("DD-MM-YYYY");
                    } else if (column.replace(/\s+/g, "") === "PaymentDate") {
                        acc[column.replace(/\s+/g, "")] =
                            moment(
                                object["PaymentDate"].replace("T", " "),
                                "YYYY-MM-DD"
                            ).format("DD-MM-YYYY") == "Invalid date"
                                ? ""
                                : moment(
                                      object["PaymentDate"].replace("T", " "),
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
                    } else if (columnKey === "PaymentStatus") {
                        if (object["PaymentStatus"] == true) {
                            acc[columnKey] = "Paid";
                        } else {
                            acc[columnKey] = "Not paid";
                        }
                    } else if (columnKey === "SecondApproval") {
                        if (object["SecondApproval"] == 1) {
                            acc[columnKey] = "Waiting";
                        } else if (object["SecondApproval"] == 2) {
                            acc[columnKey] = "Approved";
                        } else {
                            acc[columnKey] = "Rejected";
                        }
                    } else if (columnKey === "PaymentType") {
                        if (object["PaymentTypeId"] == 1) {
                            acc[columnKey] = "Credit card";
                        } else if (object["PaymentTypeId"] == 2) {
                            acc[columnKey] = "Cash";
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
            saveAs(blob, "Invoices.xlsx");
        });
    }

    return (
        <div className="p-5 bg-smooth">
            <div className="flex gap-x-1 items-center">
                <h1 className="font-bold text-dark text-3xl">Invoices</h1>{" "}
                <p className="mt-auto text-gray-400">
                    ({filteredInvoices?.length})
                </p>
                <div className=" ml-auto flex gap-x-2">
                    {selectedRecords.length > 0 && activeJob == 2 ? (
                        <button
                            type="button"
                            className={
                                "inline-flex items-center justify-center w-[5.5rem] h-[27px] rounded-md border border-transparent bg-goldd px-3 py-2 text-xs font-medium leading-4 text-dark shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-goldt focus:ring-offset-2"
                            }
                            onClick={PaySelected}
                        >
                            <CreditCardIcon className="h-5 mr-2" />
                            <span>Pay</span>
                        </button>
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
                    {selectedRecords.length > 0 ? (
                        <div className=" ">
                            <InvoicesButton
                                name="Export"
                                onClick={() => handleDownloadExcel()}
                                className="w-auto ml-auto"
                            />
                        </div>
                    ) : null}
                    {showhideCreateButton() ? (
                        <div className="hidden sm:block">
                            <InvoicesButton
                                name="Create invoice"
                                onClick={() => handleCreate()}
                                className="w-auto ml-auto"
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
                            defaultValue={
                                invoiceNbSearch ? invoiceNbSearch : ""
                            }
                            placeholder="Invoice No"
                            onChange={handleSearchChange}
                            className="w-full py-0.5 h-[35px] pl-12 pr-4 text-gray-500 border-none rounded-md outline-none "
                        />
                    </div>
                </div>
                <div className="col-span-1 ">
                    <div className="flex lg:items-center flex-col md:flex-row">
                        <input
                            value={startDate}
                            min={getOldestInvoiceDate(invoices)}
                            max={endDate}
                            type="date"
                            name="to-date"
                            id="to-date"
                            onChange={handleStartDateChange}
                            className="block w-full max-w-lg h-[35px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        />
                        <div className="px-2">to</div>
                        <input
                            min={startDate}
                            max={getLatestInvoiceDate(invoices)}
                            value={endDate}
                            onChange={handleEndDateChange}
                            type="date"
                            name="to-date"
                            id="to-date"
                            className="block w-full max-w-lg h-[35px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-3 mt-5">
                {!AssistantOrManager() ? (
                    <div>
                        <div className="mt-2 w-full sm:mt-0">
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
                                className="basic-multi-select z-40"
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
                            // styles={customStyles}
                            isMulti
                            name="colors"
                            defaultValue={selectedSupplier}
                            isClearable={true}
                            isSearchable={true}
                            options={supplierSelectOption(supplierData)}
                            onChange={handleSupplierSelectChange}
                            className="basic-multi-select z-30"
                            classNamePrefix="select"
                        />
                    </div>
                </div>
                <div>
                    {" "}
                    <div className="mt-2 w-full sm:mt-0 ">
                        <Select
                            placeholder={<div>Company... </div>}
                            // styles={customStyles}
                            isMulti
                            name="colors"
                            defaultValue={selectedCompany}
                            isClearable={true}
                            isSearchable={true}
                            options={companySelectOption(companies)}
                            onChange={handleCompanySelectChange}
                            className="basic-multi-select z-20"
                            classNamePrefix="select"
                        />
                    </div>
                </div>
            </div>

            <ul className="flex space-x-2 mt-5 border-b">
                {invoicesfilterTabs
                    .filter((item) => item.role.includes(currentUser.role_id))
                    .map((job, index) => (
                        <li
                            key={index}
                            className={`cursor-pointer text-xs flex flex-row sm:text-base py-2 ${
                                job.current === true
                                    ? "text-dark border-b-4  border-goldd font-bold "
                                    : "text-gray-400 "
                            }`}
                            onClick={() => changeFilterTab(job.id)}
                        >
                            <job.icon className="w-5 hidden sm:block" />
                            <div className="px-2"> {job.name}</div>
                        </li>
                    ))}
            </ul>
            {loadingInvoices ? (
                <div className="md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
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
                        sortedData={filteredInvoices}
                        setSortedData={setFilteredInvoices}
                        currentUser={currentUser}
                        header={header}
                        setInvoiceDetails={setInvoiceDetails}
                        body={filteredInvoices}
                        POs={POs}
                        states={states}
                        selectedRecords={selectedRecords}
                        setSelectedRecords={setSelectedRecords}
                        supplierData={supplierData}
                        setPODetails={setPODetails}
                        setPOBack={setPOBack}
                        companies={companies}
                        categories={categories}
                        setInvoice={setInvoice}
                        scroll={scrollInvoice}
                        setScroll={setScrollInvoice}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setActiveIndexInv={setActiveIndexInv}
                    />
                </div>
            )}
        </div>
    );
}
