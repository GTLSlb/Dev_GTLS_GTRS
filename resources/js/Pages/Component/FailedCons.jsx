import { useLayoutEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { useEffect } from "react";
import * as XLSX from "xlsx";
import notFound from "../../assets/pictures/NotFound.png";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import Button from "@inovua/reactdatagrid-community/packages/Button";
import moment from "moment";
import {
    ChevronDownIcon,
    PhoneIcon,
    PlayCircleIcon,
} from "@heroicons/react/20/solid";
import {
    ArrowPathIcon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import SetFailedReasonModal from "@/Components/SetFailedReasonModal";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import TableStructure from "@/Components/TableStructure";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";

const people = [
    {
        ConsignmentId: 275576,
        ConsignmentNo: "FOR100312",
        SenderName: "INDUSTRIAL STEEL",
        ReceiverName: "R AND A CONCRETING",
        FromState: "QLD",
        ToState: "VIC",
        POD: true,
        MatchTransit: false,
        MatchRdd: false,
    },
    // More people...
];

const Roles = ["1", "3", "4", "5"];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function FailedCons({
    PerfData,
    failedReasons,
    url,
    filterValue,
    setFilterValue,
    setActiveIndexGTRS,
    setLastIndex,
    setactiveCon,
    currentUser,
    accData,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState();
    const handleEditClick = (reason) => {
        setReason(reason);
        setIsModalOpen(!isModalOpen);
    };
    // const data = PerfData.filter((obj) => obj.STATUS === "FAIL");
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(5);
        setactiveCon(coindex);
    };
    const [data, setData] = useState(
        PerfData?.filter((obj) => obj.STATUS === "FAIL")
    );
    const [filteredData, setFilteredData] = useState(data);
    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = data?.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeTo);

            return chargeToMatch;
        });
        return filtered;
    };
    useEffect(() => {
        setFilteredData(filterData());
    }, [accData]);
    const headers = [
        "Consignemnt Number",
        "Status",
        "Sender Name",
        "Sender State",
        "Receiver Name",
        "Receiver State",
        "Service",
        "KPI DateTime",
        "RDD",
        "Arrived Date Time",
        "Delivered Datetime",
        "POD",
        "State",
        "Reason",
        "Main Cause",
        "Reference",
        "Department",
        "Resolution",
        "OccuredAt",
        "Explanation",
    ];
    const reasonOptions = failedReasons?.map((reason) => ({
        id: reason.ReasonId,
        label: reason.ReasonName,
    }));
    const referenceOptions = [
        {
            id: 1,
            label: "Internal",
        },
        {
            id: 2,
            label: "External",
        },
    ];
    const groups = [
        {
            name: "senderInfo",
            header: "Sender Details",
            headerAlign: "center",
        },
        {
            name: "receiverInfo",
            header: "Receiver Details",
            headerAlign: "center",
        },
    ];
    const createNewLabelObjects = (data, fieldName) => {
        let id = 1; // Initialize the ID
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];

        // Map through the data and create new objects
        data?.forEach((item) => {
            const fieldValue = item[fieldName];
            // Check if the label is not already included
            if (!uniqueLabels.has(fieldValue)) {
                uniqueLabels.add(fieldValue);
                const newObject = {
                    id: fieldValue,
                    label: fieldValue,
                };
                newData.push(newObject);
            }
        });
        return newData;
    };
    const senderZoneOptions = createNewLabelObjects(data, "SenderState");
    const receiverZoneOptions = createNewLabelObjects(data, "RECEIVERSTATE");
    const states = createNewLabelObjects(data, "State");
    const departments = createNewLabelObjects(data, "Department");
    function getMinMaxValue(data, fieldName, identifier) {
        // Check for null safety
        if (!data || !Array.isArray(data) || data.length === 0) {
            return null;
        }

        // Filter out entries with empty or invalid dates
        const validData = data.filter(
            (item) => item[fieldName] && !isNaN(new Date(item[fieldName]))
        );

        // If no valid dates are found, return null
        if (validData.length === 0) {
            return null;
        }

        // Sort the valid data based on the fieldName
        const sortedData = [...validData].sort((a, b) => {
            return new Date(a[fieldName]) - new Date(b[fieldName]);
        });

        // Determine the result date based on the identifier
        let resultDate;
        if (identifier === 1) {
            resultDate = new Date(sortedData[0][fieldName]);
        } else if (identifier === 2) {
            resultDate = new Date(sortedData[sortedData.length - 1][fieldName]);
        } else {
            return null;
        }

        // Convert the resultDate to the desired format "01-10-2023"
        const day = String(resultDate.getDate()).padStart(2, "0");
        const month = String(resultDate.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
        const year = resultDate.getFullYear();

        return `${day}-${month}-${year}`;
    }
    // Usage example remains the same
    const minKPIDate = getMinMaxValue(data, "KPI DATETIME", 1);
    const maxKPIDate = getMinMaxValue(data, "KPI DATETIME", 2);

    const minRddDate = getMinMaxValue(data, "DELIVERYREQUIREDDATETIME", 1);
    const maxRddDate = getMinMaxValue(data, "DELIVERYREQUIREDDATETIME", 2);

    const minArrivedDate = getMinMaxValue(data, "ARRIVEDDATETIME", 1);
    const maxArrivedDate = getMinMaxValue(data, "ARRIVEDDATETIME", 2);

    const minDeliveredDate = getMinMaxValue(data, "DELIVEREDDATETIME", 1);
    const maxDeliveredDate = getMinMaxValue(data, "DELIVEREDDATETIME", 2);

    const Roles = ["1", "3", "4", "5"];

    const columns = [
        {
            name: "CONSIGNMENTNUMBER",
            header: "Cons No",
            headerAlign: "center",
            textAlign: "center",
            group: "personalInfo",
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 hover:cursor-pointer"
                        onClick={() => handleClick(data.CONSIGNMNENTID)}
                    >
                        {" "}
                        {value}
                    </span>
                );
            },
        },
        {
            name: "STATUS",
            header: "Status",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
        },
        {
            name: "SENDERNAME",
            defaultWidth: 170,
            header: "Sender Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",

            group: "senderInfo",
            filterEditor: StringFilter,
        },
        {
            name: "SENDERREFERENCE",
            defaultWidth: 170,
            header: "Sender Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            group: "senderInfo",
            filterEditor: StringFilter,
        },
        {
            name: "SenderState",
            header: "Sender State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            group: "senderInfo",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderZoneOptions,
            },
        },
        {
            name: "RECEIVERNAME",
            header: "Receiver Name",
            type: "string",
            defaultWidth: 170,
            headerAlign: "center",
            textAlign: "center",
            group: "receiverInfo",
            filterEditor: StringFilter,
        },
        {
            name: "RECEIVER REFERENCE",
            header: "Receiver Reference",
            type: "string",
            defaultWidth: 170,
            headerAlign: "center",
            textAlign: "center",
            group: "receiverInfo",
            filterEditor: StringFilter,
        },
        {
            name: "RECEIVERSTATE",
            header: "Receiver State",
            headerAlign: "center",
            textAlign: "center",
            group: "receiverInfo",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverZoneOptions,
            },
        },
        {
            name: "SERVICE",
            header: "Service",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "KPI DATETIME",
            header: "KPI Time",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditorProps: {
                minDate: minKPIDate,
                maxDate: maxKPIDate,
            },
            filterEditor: DateFilter,
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "DELIVERYREQUIREDDATETIME",
            header: "RDD",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditorProps: {
                minDate: minRddDate,
                maxDate: maxRddDate,
            },
            filterEditor: DateFilter,
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "ARRIVEDDATETIME",
            header: "Arrived time",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditorProps: {
                minDate: minArrivedDate,
                maxDate: maxArrivedDate,
            },
            filterEditor: DateFilter,
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "DELIVEREDDATETIME",
            header: "Delivered time",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditorProps: {
                minDate: minDeliveredDate,
                maxDate: maxDeliveredDate,
            },
            filterEditor: DateFilter,
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "POD",
            header: "POD",
            headerAlign: "center",
            textAlign: "center",
            render: ({ value }) => {
                return value ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        True
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        false
                    </span>
                );
            },
        },
        {
            name: "FailedReason",
            header: "Reason",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 300,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: reasonOptions,
            },
            render: ({ value }) => {
                return (
                    <div>
                        {/* {value} */}
                        {
                            failedReasons?.find(
                                (reason) => reason.ReasonId === value
                            )?.ReasonName
                        }
                    </div>
                );
            },
        },
        {
            name: "FailedReasonDesc",
            header: "Main cause",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 300,
            filterEditor: StringFilter,
        },
        {
            name: "State",
            header: "State",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: states,
            },
        },
        {
            name: "Reference",
            header: "Reference",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: referenceOptions,
            },
            render: ({ value }) => {
                return value == 1 ? (
                    <span>Internal</span>
                ) : value == 2 ? (
                    <span>External</span>
                ) : (
                    <span></span>
                );
            },
        },
        {
            name: "Department",
            header: "Department",
            headerAlign: "center",
            textAlign: "start",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: departments,
            },
        },
        {
            name: "OccuredAt",
            header: "Occured at",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "FailedNote",
            header: "Explanation",
            headerAlign: "center",
            textAlign: "start",
        },
        {
            header: "",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 100,
            render: ({ value, data }) => {
                return (
                    <div>
                        {Roles.includes(currentUser.role_id) ? (
                            <button
                                className={
                                    "rounded text-blue-500 justify-center items-center  "
                                }
                                onClick={() => {
                                    handleEditClick(data);
                                }}
                            >
                                <span className="flex gap-x-1">
                                    <PencilIcon className="h-4" />
                                    Edit
                                </span>
                            </button>
                        ) : (
                            <div></div>
                        )}
                    </div>
                );
            },
        },
    ];
    const newArray = columns.slice(0, -1);
    const [newColumns, setNewColumns] = useState();

    useEffect(() => {
        if (Roles.includes(currentUser.role_id)) {
            setNewColumns(columns);
        } else {
            setNewColumns(newArray);
        }
    }, []);
    function handleDownloadExcel() {
        // Get the selected columns or use all columns if none are selected
        let selectedColumns = Array.from(
            document.querySelectorAll('input[name="column"]:checked')
        ).map((checkbox) => checkbox.value);

        if (selectedColumns.length === 0) {
            selectedColumns = headers; // Use all columns
        }

        // Extract the data for the selected columns
        const data = filteredData.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (person[columnKey] === true) {
                        acc[columnKey] = "true";
                    } else if (person[columnKey] === false) {
                        acc[columnKey] = "false";
                    } else if (column.toUpperCase() === "KPI DATETIME") {
                        console.log(person);
                        acc[columnKey] =
                            moment(
                                person["KPI DATETIME"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["KPI DATETIME"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column.toUpperCase() === "ARRIVED DATE TIME") {
                        acc[columnKey] =
                            moment(
                                person["ARRIVEDDATETIME"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["ARRIVEDDATETIME"].replace(
                                          "T",
                                          " "
                                      ),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column.toUpperCase() === "RDD") {
                        acc[columnKey] =
                            moment(
                                person["DELIVERYREQUIREDDATETIME"].replace(
                                    "T",
                                    " "
                                ),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person[
                                          "DELIVERYREQUIREDDATETIME"
                                      ].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column.toUpperCase() === "DELIVERED DATETIME") {
                        acc[columnKey] =
                            moment(
                                person["DELIVEREDDATETIME"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["DELIVEREDDATETIME"].replace(
                                          "T",
                                          " "
                                      ),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column.toUpperCase() === "OCCUREDAT") {
                        acc[columnKey] =
                            moment(
                                person["DELIVEREDDATETIME"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["DELIVEREDDATETIME"].replace(
                                          "T",
                                          " "
                                      ),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column === "Consignemnt Number") {
                        acc[columnKey] = person["CONSIGNMENTNUMBER"];
                    } else if (columnKey === "Reason") {
                        const failedReason = failedReasons?.find(
                            (reason) => reason.ReasonId === person.FailedReason
                        );
                        acc[columnKey] = failedReason?.ReasonName;
                    } else if (columnKey === "SenderState") {
                        acc[columnKey] = person["SenderState"];
                    } else if (columnKey === "MainCause") {
                        acc[columnKey] = person["FailedReasonDesc"];
                    } else if (columnKey === "Explanation") {
                        acc[columnKey] = person["FailedNote"];
                    } else if (columnKey === "Reference") {
                        if (person["Reference"] == 1) {
                            acc[columnKey] = "Internal";
                        } else if (person["Reference"] == 2) {
                            acc[columnKey] = "External";
                        } else {
                            acc[columnKey] = "";
                        }
                    } else if (columnKey === "Resolution") {
                        acc[columnKey] = person["Resolution"];
                    } else if (columnKey === "Department") {
                        acc[columnKey] = person["Department"];
                    } else if (columnKey === "State") {
                        acc[columnKey] = person["State"];
                    } else {
                        acc[columnKey] = person[columnKey.toUpperCase()];
                    }
                } else {
                    acc[columnKey] = person[columnKey.toUpperCase()];
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
            worksheet.addRow(Object.values(rowData));
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
            saveAs(blob, "Failed-Consignments.xlsx");
        });
    }
    const updateLocalData = (
        id,
        reasonid,
        note,
        description,
        department,
        resolution,
        reference,
        state,
        OccuredAt
    ) => {
        // Find the item in the local data with the matching id
        const updatedData = filteredData?.map((item) => {
            if (item.CONSIGNMNENTID === id) {
                // Update the reason of the matching item
                return {
                    ...item,
                    FailedReason: reasonid,
                    FailedReasonDesc: description,
                    FailedNote: note,
                    Department: department,
                    Resolution: resolution,
                    Reference: reference,
                    State: state,
                    OccuredAt: OccuredAt,
                };
            }
            return item;
        });
        setData(updatedData);
        setFilteredData(updatedData);
    };
    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);
    const [selected, setSelected] = useState([]);
    const handleMouseEnter = () => {
        if (filteredData.length === 0) {
            setHoverMessage("No Data Found");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 1000);
        }
    };
    return (
        <div>
            {/* <Sidebar /> */}
            {!newColumns ? (
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
                <div className=" w-full bg-smooth ">
                    <div className="">
                        <div className="w-full relative">
                            <div className=" sm:border-gray-200 text-gray-400 flex flex-col justify-between md:flex-row gap-y-4 gap-x-2 md:items-center">
                                <Popover className="relative object-right flex-item md:ml-auto">
                                    <button onMouseEnter={handleMouseEnter}>
                                        <Popover.Button
                                            className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                                filteredData?.length === 0
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-gray-800"
                                            } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                            disabled={
                                                filteredData?.length === 0
                                            }
                                        >
                                            Export
                                            <ChevronDownIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </Popover.Button>
                                    </button>
                                    {isMessageVisible && (
                                        <div className="absolute top-9.5 text-center left-0 md:-left-14 w-[9rem] right-0 bg-red-200 text-dark z-10 text-xs py-2 px-4 rounded-md opacity-100 transition-opacity duration-300">
                                            {hoverMessage}
                                        </div>
                                    )}

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute left-20 lg:-left-5 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                            <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                <div className="p-4">
                                                    <div className="mt-2 flex flex-col">
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="CONSIGNMENTNUMBER"
                                                                className="text-dark focus:ring-goldd rounded "
                                                            />{" "}
                                                            Consignment Number
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="STATUS"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Status
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SENDERNAME"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SenderState"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender State
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="RECEIVERNAME"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="RECEIVERSTATE"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver State
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SERVICE"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Service
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="KPI DATETIME"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            KPI Time
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="DELIVERYREQUIREDDATETIME"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Delivery Required
                                                            DateTime
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ARRIVEDDATETIME"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Arrived Date Time
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="DELIVEREDDATETIME"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Delivery Date
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="POD"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            POD
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Reason"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Reason
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="State"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            State
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Reference"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Reference
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Department"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Department
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Resolution"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Resolution
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="OccuredAt"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Occured At
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Main Cause"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Main Cause
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Explanation"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Explanation
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                                    <button
                                                        onClick={
                                                            handleDownloadExcel
                                                        }
                                                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                                    >
                                                        Export XLS
                                                    </button>
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <TableStructure
                        id={"CONSIGNMNENTID"}
                        setSelected={setSelected}
                        selected={selected}
                        groupsElements={groups}
                        setFilterValueElements={setFilterValue}
                        tableDataElements={filteredData}
                        filterValueElements={filterValue}
                        columnsElements={newColumns}
                    />
                </div>
            )}

            <SetFailedReasonModal
                url={url}
                isOpen={isModalOpen}
                reason={reason}
                setReason={setReason}
                handleClose={handleEditClick}
                failedReasons={failedReasons}
                currentUser={currentUser}
                updateLocalData={updateLocalData}
            />
        </div>
    );
}