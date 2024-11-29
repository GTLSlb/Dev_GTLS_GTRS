import React, { useState, useEffect, useCallback } from "react";
3;
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import {
    ChevronDownIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import axios from "axios";
import { useDisclosure } from "@nextui-org/react";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import EventModal from "./EventModal";
import { useRef } from "react";
const gtrsWebUrl = window.Laravel.gtrsWeb;

const columnMapping = {
    api_source: "State",
    suburb: "Suburb",
    event_type: "Event Type",
    description: "Event Description",
    start_date: "Start Date",
    end_date: "End Date",
    impact: "Event Impact",
    hours_difference: "Duration Impact",
    road_name: "Road Name",
    advice: "Advice",
    information: "More information",
};
const loadData = ({ skip, limit, sortInfo, filterValue }) => {
    const url =
        `${gtrsWebUrl}get-positions` +
        "?skip=" +
        skip +
        "&limit=" +
        limit +
        "&sortInfo=" +
        JSON.stringify(sortInfo) +
        "&filterBy=" +
        JSON.stringify(filterValue);

    return fetch(url).then((response) => {
        const totalCount = response.headers.get("X-Total-Count");
        return response.json().then((data) => {
            // const totalCount = data.pagination.total;
            return Promise.resolve({ data, count: parseInt(totalCount) });
        });
    });
};

const defaultFilterValue = [
    { name: "suburb", type: "string", operator: "contains", value: "" },
    { name: "api_source", type: "string", operator: "contains", value: "" },
    { name: "event_type", type: "string", operator: "contains", value: "" },
    { name: "description", type: "string", operator: "contains", value: "" },
    {
        name: "start_date",
        type: "date",
        operator: "eq",
        value: "",
        emptyValue: "",
    },
    {
        name: "end_date",
        type: "date",
        operator: "eq",
        value: "",
        emptyValue: "",
    },
    {
        name: "road_name",
        type: "string",
        operator: "contains",
        value: "",
    },
    {
        name: "impact",
        type: "string",
        operator: "contains",
        value: "",
    },
    { name: "advice", type: "string", operator: "contains", value: "" },
    { name: "information", type: "string", operator: "contains", value: "" },
];

function TraffiComp() {
    function formatTime(hours) {
        const years = Math.floor(hours / (24 * 30 * 12));
        const months = Math.floor((hours % (24 * 30 * 12)) / (24 * 30));
        const days = Math.floor((hours % (24 * 30)) / 24);
        const remainingHours = hours % 24;

        const parts = [];

        if (years > 0) {
            parts.push(`${years} year${years > 1 ? "s" : ""}`);
        }
        if (months > 0) {
            parts.push(`${months} month${months > 1 ? "s" : ""}`);
        }
        if (days > 0) {
            parts.push(`${days} day${days > 1 ? "s" : ""}`);
        }
        if (remainingHours > 0) {
            parts.push(
                `${remainingHours} hour${remainingHours > 1 ? "s" : ""}`
            );
        }

        if (parts.length === 0) {
            return null;
        } else if (parts.length > 1) {
            return parts[0];
        }
        // return parts.join(" and ");
    }
    const gridRef = useRef(null);
    const gridStyle = { minHeight: 550, marginTop: 10 };
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [eventDetails, setEventDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [datatoexport, setDatatoexport] = useState([]);
    const [exportLoading, setExportLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    function getAllEvents() {
        axios
            .get(`${gtrsWebUrl}get-eventsCategories`)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        getAllEvents();
    }, []);

    function getEventCategoryById(id) {
        const category = categories.find((event) => event.id === id);
        return category ? category.event_category : "";
    }

    const columns = [
        {
            name: "api_source",
            header: "State",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "suburb",
            header: "Suburb",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "event_type",
            header: "Event Type",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            render: ({ data }) => {
                return getEventCategoryById(data.event_category_id);
            },
        },
        {
            name: "description",
            header: "Event Description",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "start_date",
            header: "Start Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "YYYY-MM-DD",
            filterEditor: DateFilter,
            filterEditorProps: (props, { index }) => {
                // for range and notinrange operators, the index is 1 for the after field
                return {
                    dateFormat: "MM-DD-YYYY",
                };
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "end_date",
            header: "End Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "YYYY-MM-DD",
            filterEditor: DateFilter,
            filterEditorProps: (props, { index }) => {
                // for range and notinrange operators, the index is 1 for the after field
                return {
                    dateFormat: "MM-DD-YYYY",
                };
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "impact",
            header: "Event Impact",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "hours_difference",
            header: "Duration Impact",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            render: ({ value }) => {
                return formatTime(value);
            },
        },
        {
            name: "road_name",
            header: "Road Name",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "advice",
            header: "Advice",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "information",
            header: "More information",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },

    ];

    function handleFilterTable() {
        // Get the selected columns or use all columns if none are selected
        let selectedColumns = Array.from(
            document.querySelectorAll('input[name="column"]:checked')
        ).map((checkbox) => checkbox.value);

        let allHeaderColumns = gridRef.current.visibleColumns.map((column) => ({
            name: column.name,
            value: column.computedFilterValue?.value,
            type: column.computedFilterValue?.type,
            operator: column.computedFilterValue?.operator,
        }));
        let selectedColVal = allHeaderColumns.filter(
            (col) => col.name !== "edit"
        );

        const filterValue = [];
        datatoexport?.map((val) => {
            let isMatch = true;
            for (const col of selectedColVal) {
                const { name, value, type, operator } = col;
                const cellValue = value;
                let conditionMet = false;
                // Skip the filter condition if no filter is set (cellValue is null or empty)
                if (
                    (!cellValue || cellValue.length === 0) &&
                    !(
                        type === "number" &&
                        (operator === "empty" || cellValue === 0)
                    )
                ) {
                    conditionMet = true;
                    continue;
                }
                if (type === "string") {
                    const valLowerCase = val[col.name]
                        ?.toString()
                        .toLowerCase();
                    const cellValueLowerCase = cellValue
                        ?.toString()
                        .toLowerCase();

                    switch (operator) {
                        case "contains":
                            conditionMet =
                                cellValue?.length > 0 &&
                                valLowerCase.includes(cellValueLowerCase);
                            break;
                        case "notContains":
                            conditionMet =
                                cellValue?.length > 0 &&
                                !valLowerCase.includes(cellValueLowerCase);
                            break;
                        case "eq":
                            conditionMet =
                                cellValue?.length > 0 &&
                                cellValueLowerCase === valLowerCase;
                            break;
                        case "neq":
                            conditionMet =
                                cellValue?.length > 0 &&
                                cellValueLowerCase !== valLowerCase;
                            break;
                        case "empty":
                            conditionMet =
                                cellValue?.length > 0 && val[col.name] === "";
                            break;
                        case "notEmpty":
                            conditionMet =
                                cellValue?.length > 0 && val[col.name] !== "";
                            break;
                        case "startsWith":
                            conditionMet =
                                cellValue?.length > 0 &&
                                valLowerCase.startsWith(cellValueLowerCase);
                            break;
                        case "endsWith":
                            conditionMet =
                                cellValue?.length > 0 &&
                                valLowerCase.endsWith(cellValueLowerCase);
                            break;
                        // ... (add other string type conditions here)
                    }
                } else if (type === "number") {
                    const numericCellValue = parseFloat(cellValue);
                    const numericValue = parseFloat(val[col.name]);

                    switch (operator) {
                        case "eq":
                            conditionMet =
                                (numericCellValue !== "" ||
                                    numericCellValue === 0) &&
                                (numericValue !== "" || numericValue === 0) &&
                                numericValue == numericCellValue;
                            break;
                        case "neq":
                            conditionMet =
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue !== numericCellValue;
                            break;
                        case "empty":
                            conditionMet =
                                Number.isNaN(numericCellValue) &&
                                Number.isNaN(numericValue);
                            break;
                        case "gt":
                            conditionMet =
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue > numericCellValue;
                            break;
                        case "gte":
                            conditionMet =
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue >= numericCellValue;
                            break;
                        case "lt":
                            conditionMet =
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue < numericCellValue;
                            break;
                        case "lte":
                            conditionMet =
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue <= numericCellValue;
                            break;
                        case "inrange":
                            const rangeValues = value.split(",");
                            const minRangeValue = parseFloat(rangeValues[0]);
                            const maxRangeValue = parseFloat(rangeValues[1]);
                            conditionMet =
                                cellValue?.length > 0 &&
                                numericCellValue >= minRangeValue &&
                                numericCellValue <= maxRangeValue;
                            break;
                        case "notinrange":
                            const rangeValuesNotBetween = value.split(",");
                            const minRangeValueNotBetween = parseFloat(
                                rangeValuesNotBetween[0]
                            );
                            const maxRangeValueNotBetween = parseFloat(
                                rangeValuesNotBetween[1]
                            );
                            conditionMet =
                                cellValue?.length > 0 &&
                                (numericCellValue < minRangeValueNotBetween ||
                                    numericCellValue > maxRangeValueNotBetween);
                            break;
                        // ... (add other number type conditions here if necessary)
                    }
                } else if (type === "boolean") {
                    // Assuming booleanCellValue is a string 'true' or 'false' and needs conversion to a boolean
                    const booleanCellValue = cellValue === "true";
                    const booleanValue = val[col.name] === true; // Convert to boolean if it's not already

                    switch (operator) {
                        case "eq":
                            conditionMet =
                                cellValue?.length > 0 &&
                                booleanCellValue === booleanValue;
                            break;
                        case "neq":
                            conditionMet =
                                cellValue?.length > 0 &&
                                booleanCellValue !== booleanValue;
                            break;
                        // ... (add other boolean type conditions here if necessary)
                    }
                } else if (type === "select") {
                    const cellValueLowerCase = cellValue
                        ?.toString()
                        .toLowerCase();
                    const valLowerCase = val[col.name]
                        ?.toString()
                        .toLowerCase();

                    switch (operator) {
                        case "eq":
                            conditionMet =
                                cellValue?.length > 0 &&
                                cellValueLowerCase === valLowerCase;
                            break;
                        case "neq":
                            // This case seems to be duplicated in your original code, you might want to check this
                            conditionMet =
                                cellValue?.length > 0 &&
                                cellValueLowerCase !== valLowerCase;
                            break;
                        case "inlist":
                            const listValues = Array.isArray(value)
                                ? value.map((v) => v.toLowerCase())
                                : [value?.toLowerCase()];
                            conditionMet =
                                cellValue?.length > 0 &&
                                listValues.includes(valLowerCase);
                            break;
                        case "notinlist":
                            const listValuesNotIn = Array.isArray(value)
                                ? value.map((v) => v.toLowerCase())
                                : [value?.toLowerCase()];
                            conditionMet =
                                cellValue?.length > 0 &&
                                !listValuesNotIn.includes(valLowerCase);
                            break;
                        // ... (add other select type conditions here if necessary)
                    }
                } else if (type === "date") {
                    const dateValue = moment(
                        val[col.name].replace("T", " "),
                        "YYYY-MM-DD HH:mm:ss"
                    );
                    const hasStartDate =
                        cellValue?.start && cellValue.start.length > 0;
                    const hasEndDate =
                        cellValue?.end && cellValue.end.length > 0;
                    const dateCellValueStart = hasStartDate
                        ? moment(cellValue.start, "DD-MM-YYYY")
                        : null;
                    const dateCellValueEnd = hasEndDate
                        ? moment(cellValue.end, "DD-MM-YYYY").endOf("day")
                        : null;

                    switch (operator) {
                        case "after":
                            // Parse the cellValue date with the format you know it might have
                            const afterd = moment(
                                cellValue,
                                "DD-MM-YYYY",
                                true
                            );

                            // Parse the dateValue as an ISO 8601 date string
                            const afterdateToCompare = moment(dateValue);

                            // Check if both dates are valid and if cellValue is after dateValue
                            conditionMet =
                                afterd.isValid() &&
                                afterdateToCompare.isValid() &&
                                afterdateToCompare.isAfter(afterd);

                            break;
                        case "afterOrOn":
                            const afterOrOnd = moment(
                                cellValue,
                                "DD-MM-YYYY",
                                true
                            );
                            const afterOrOnDateToCompare = moment(dateValue);

                            conditionMet =
                                afterOrOnd.isValid() &&
                                afterOrOnDateToCompare.isValid() &&
                                afterOrOnDateToCompare.isSameOrAfter(
                                    afterOrOnd
                                );
                            break;

                        case "before":
                            const befored = moment(
                                cellValue,
                                "DD-MM-YYYY",
                                true
                            );
                            const beforeDateToCompare = moment(dateValue);

                            conditionMet =
                                befored.isValid() &&
                                beforeDateToCompare.isValid() &&
                                beforeDateToCompare.isBefore(befored);

                            break;

                        case "beforeOrOn":
                            const beforeOrOnd = moment(
                                cellValue,
                                "DD-MM-YYYY",
                                true
                            );
                            const beforeOrOnDateToCompare = moment(dateValue);

                            conditionMet =
                                beforeOrOnd.isValid() &&
                                beforeOrOnDateToCompare.isValid() &&
                                beforeOrOnDateToCompare.isSameOrBefore(
                                    beforeOrOnd
                                );

                            break;
                        case "eq":
                            // Parse the cellValue date with the format you know it might have
                            const d = moment(
                                cellValue,
                                ["DD-MM-YYYY", moment.ISO_8601],
                                true
                            );

                            // Parse the dateValue with the expected format or formats
                            const dateToCompare = moment(
                                dateValue,
                                ["YYYY-MM-DD HH:mm:ss", moment.ISO_8601],
                                true
                            );

                            // Check if both dates are valid and if they represent the same calendar day
                            conditionMet =
                                cellValue &&
                                d.isValid() &&
                                dateToCompare.isValid() &&
                                d.isSame(dateToCompare, "day");

                            break;
                        case "neq":
                            const neqd = moment(cellValue, "DD-MM-YYYY", true);
                            const neqDateToCompare = moment(dateValue);

                            conditionMet =
                                neqd.isValid() &&
                                neqDateToCompare.isValid() &&
                                !neqd.isSame(neqDateToCompare, "day");

                            break;

                        case "inrange":
                            conditionMet =
                                (!hasStartDate ||
                                    dateValue.isSameOrAfter(
                                        dateCellValueStart
                                    )) &&
                                (!hasEndDate ||
                                    dateValue.isSameOrBefore(dateCellValueEnd));
                            break;
                        case "notinrange":
                            conditionMet =
                                (hasStartDate &&
                                    dateValue.isBefore(dateCellValueStart)) ||
                                (hasEndDate &&
                                    dateValue.isAfter(dateCellValueEnd));
                            break;
                        // ... (add other date type conditions here if necessary)
                    }
                }

                if (!conditionMet) {
                    isMatch = false;
                    break;
                }
            }
            if (isMatch) {
                filterValue.push(val);
            }
        });
        selectedColVal = [];
        if (selectedColumns.length === 0) {
            selectedColVal = allHeaderColumns.filter(
                (col) => col.name !== "edit"
            ); // Use all columns
        } else {
            allHeaderColumns.map((header) => {
                selectedColumns.map((column) => {
                    const formattedColumn = column
                        .replace(/\s/g, "")
                        .toLowerCase();
                    if (header.name.toLowerCase() === formattedColumn) {
                        selectedColVal.push(header);
                    }
                });
            });
        }
        return { selectedColumns: selectedColVal, filterValue: filterValue };
    }
    function handleDownloadExcel() {
        const jsonData = handleFilterTable();
        const selectedColumns = jsonData?.selectedColumns.map(
            (column) => column.name
        );
        const newSelectedColumns = selectedColumns.map(
            (column) => columnMapping[column] || column // Replace with new name, or keep original if not found in mapping
        );

        const filterValue = jsonData?.filterValue;
        const data = filterValue.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (person[columnKey] === true) {
                        acc[columnKey] = "true";
                    } else if (person[columnKey] === false) {
                        acc[columnKey] = "false";
                    } else if (
                        ["DispatchDate", "DeliveryDate", "RDD"].includes(
                            columnKey
                        )
                    ) {
                        const date = new Date(person[columnKey]);
                        if (!isNaN(date)) {
                            acc[column] =
                                (date.getTime() -
                                    date.getTimezoneOffset() * 60000) /
                                    86400000 +
                                25569; // Convert to Excel date serial number
                        } else {
                            acc[column] = "";
                        }
                    } else if (columnKey == "CalculatedDelDate") {
                        const date = new Date(person[columnKey]);
                        if (!isNaN(date)) {
                            acc[column] =
                                (date.getTime() -
                                    date.getTimezoneOffset() * 60000) /
                                    86400000 +
                                25569; // Convert to Excel date serial number
                        } else {
                            acc[column] = "";
                        }
                    } else if (columnKey === "MatchRdd") {
                        if (person[columnKey] === 3) {
                            acc[columnKey] = "Pending";
                        } else if (person[columnKey] === 1) {
                            acc[columnKey] = "True";
                        } else if (person[columnKey] === 2) {
                            acc[columnKey] = "False";
                        }
                    } else if (columnKey === "MatchDel") {
                        if (person[columnKey] == 0) {
                            acc[columnKey] = "";
                        } else if (person[columnKey] == 1) {
                            acc[columnKey] = "PASS";
                        } else if (person[columnKey] == 2) {
                            acc[columnKey] = "FAIL";
                        }
                    } else if (columnKey === "ReasonId") {
                        const Reason = kpireasonsData?.find(
                            (reason) => reason.ReasonId === person.ReasonId
                        );
                        acc[columnKey] = Reason?.ReasonName;
                    } else {
                        acc[columnKey] = person[columnKey];
                    }
                } else {
                    acc[columnKey] = person[columnKey];
                }
                return acc;
            }, {})
        );

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();

        // Add a worksheet to the workbook
        const worksheet = workbook.addWorksheet("Sheet1");

        // Apply custom styles to the new header row
        const headerRow = worksheet.addRow(newSelectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" }, // Yellow background color (#e2b540)
        };
        headerRow.alignment = { horizontal: "center" };

        data.forEach((rowData) => {
            const row = worksheet.addRow(Object.values(rowData));
            // Apply date format to the Dispatch Date column
            const dispatchDateIndex =
                newSelectedColumns.indexOf("Dispatch Date");
            if (dispatchDateIndex !== -1) {
                const cell = row.getCell(dispatchDateIndex + 1);
                cell.numFmt = "dd-mm-yyyy hh:mm AM/PM";
            }

            // Apply date format to the Delivery Date column
            const deliveryDateIndex =
                newSelectedColumns.indexOf("Delivery Date");
            if (deliveryDateIndex !== -1) {
                const cell = row.getCell(deliveryDateIndex + 1);
                cell.numFmt = "dd-mm-yyyy hh:mm AM/PM";
            }

            // Apply date format to the RDD column
            const RDDDateIndex = newSelectedColumns.indexOf("RDD");
            if (RDDDateIndex !== -1) {
                const cell = row.getCell(RDDDateIndex + 1);
                cell.numFmt = "dd-mm-yyyy hh:mm AM/PM";
            }
            // Apply date format to the RDD column
            const CalculatedDateIndex = newSelectedColumns.indexOf(
                "Calculated Delivery Date"
            );
            if (CalculatedDateIndex !== -1) {
                const cell = row.getCell(CalculatedDateIndex + 1);
                cell.numFmt = "dd-mm-yyyy";
            }
        });

        // Set column widths
        const columnWidths = selectedColumns.map(() => 20); // Set width of each column
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
            saveAs(blob, "Traffic-report.xlsx");
            setExportLoading(false);
        });
    }
    const getexceldata = ({ skip, limit, sortInfo, filterValue }) => {
        setExportLoading(true)
        const url =
            `${gtrsWebUrl}get-positions`;

        return fetch(url).then((response) => {
            const totalCount = response.headers.get("X-Total-Count");
            return response.json().then((data) => {
                // const totalCount = data.pagination.total;
                setDatatoexport(data);
                handleDownloadExcel();
            });
        });
    };

    const [filterValue, setFilterValue] = useState(defaultFilterValue);

    const dataSource = useCallback(loadData, []);
    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Traffic Report
                    </h1>
                </div>
                <Popover className="relative ">
                    <button>
                        <Popover.Button
                            className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                // datatoexport?.length === 0
                                exportLoading
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-gray-800"
                            } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                            disabled={exportLoading}
                        >
                            {exportLoading ? "Exporting..." : "Export"}
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
                        <Popover.Panel className="absolute left-20 lg:left-0 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                            <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                <div className="p-4">
                                    <div className="mt-2 flex flex-col">
                                        {Object.entries(columnMapping).map(
                                            ([key, value]) => (
                                                <label key={key} className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value={key}
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    {value}
                                                </label>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                    <button
                                        onClick={getexceldata}
                                        disabled={exportLoading}
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
            <ReactDataGrid
                idProperty="id"
                handle={(ref) => (gridRef.current = ref ? ref.current : [])}
                style={gridStyle}
                columns={columns}
                className={"rounded-lg shadow-lg overflow-hidden"}
                showColumnMenuTool={false}
                enableColumnAutosize={false}
                filterValue={filterValue}
                onFilterValueChange={setFilterValue}
                pagination
                dataSource={dataSource}
                defaultLimit={15}
            />
            <EventModal
                getEventCategoryById={getEventCategoryById}
                eventDetails={eventDetails}
                loading={loading}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
        </div>
    );
}

export default TraffiComp;
