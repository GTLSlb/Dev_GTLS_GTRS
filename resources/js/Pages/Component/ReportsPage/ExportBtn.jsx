import { useLayoutEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { useEffect } from "react";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";

import {
    ChevronDownIcon,
    PhoneIcon,
    PlayCircleIcon,
} from "@heroicons/react/20/solid";
import moment from "moment";

export default function ExportBtn({ unileverClient, filteredData, gridRef }) {
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

    const formatDate = (dateString) => {
        if (dateString) {
            const [date, time] = dateString.split("T");
            const [day, month, year] = date.split("-");
            // Using template literals to format the date
            return `${year}-${month}-${day}`;
        } else {
            return dateString;
        }
    };

    function handleFilterTable() {
        // Get the selected columns or use all columns if none are selected
        let selectedColumns = Array.from(
            document.querySelectorAll('input[name="column"]:checked')
        ).map((checkbox) => checkbox.value);

        let allHeaderColumns = gridRef.current.visibleColumns.map((column) => ({
            name: column.name,
            value: column.computedFilterValue?.value,
            type: column.computedFilterValue?.type,
            label: column.computedHeader,
            operator: column.computedFilterValue?.operator,
        }));

        let selectedColVal = allHeaderColumns.filter(
            (col) => col?.label?.toString()?.toLowerCase() !== "actions"
        );

        const filterValue = [];
        filteredData?.map((val) => {
            let isMatch = true;

            for (const col of selectedColVal) {
                const { name, value, type, operator } = col;
                const cellValue = value;
                let conditionMet = false;
                // Skip the filter condition if no filter is set (cellValue is null or empty)
                if (!cellValue || cellValue.length === 0) {
                    conditionMet = true;
                    continue;
                }
                if (type === "string") {
                    const valLowerCase =
                        Array.isArray(val[col.name]) &&
                        val[col.name].length > 0 &&
                        val[col.name][0].Comment
                            ? val[col.name][0].Comment.toString().toLowerCase()
                            : "";

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
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue === numericCellValue;
                            break;
                        case "neq":
                            conditionMet =
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue !== numericCellValue;
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
                                ? value.map((v) => {
                                      if (typeof v === "string") {
                                          return v.toLowerCase();
                                      } else {
                                          return v.toString();
                                      }
                                  })
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
                        val[col.name]?.replace("T", " "),
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
            // Use all columns except edit
            selectedColVal = allHeaderColumns.filter(
                (col) => col?.label?.toString().toLowerCase() !== "actions"
            );
        } else {
            allHeaderColumns.map((header) => {
                selectedColumns.map((column) => {
                    const formattedColumn = column
                        .replace(/\s/g, "")
                        .toLowerCase();
                    if (
                        header?.name?.replace(/\s/g, "").toLowerCase() ===
                        formattedColumn
                    ) {
                        selectedColVal.push(header);
                    }
                });
            });
        }

        return { selectedColumns: selectedColVal, filterValue: filterValue };
    }

    function handleDownloadExcel() {
        const jsonData = handleFilterTable();

        const columnMapping = {
            AccountNumber: "Account Number",
            DespatchDateTime: "Despatch Date",
            ConsignmentNo: "Consignment Number",
            SenderName: "Sender Name",
            SenderReference: "Sender Reference",
            SenderState: "Sender Zone",
            ReceiverName: "Receiver Name",
            ReceiverReference: "Receiver Reference",
            ReceiverState: "Receiver Zone",
            ConsignmentStatus: "Consignment Status",
            DeliveryInstructions: "Delivery Instructions",
            DeliveryRequiredDateTime: "Delivery Required Date",
            DeliveredDateTime: "Delivered Date",
            POD: "POD Available",
            Comments: "Comments",
        };

        const selectedColumns = jsonData?.selectedColumns.map(
            (column) => column.name
        );
        const newSelectedColumns = selectedColumns.map(
            (column) => columnMapping[column] || column // Replace with new name, or keep original if not found in mapping
        );

        const filterValue = jsonData?.filterValue;
        const data = filterValue.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column?.replace(/\s+/g, "");
                if (columnKey) {
                    if (person[columnKey] === true) {
                        acc[columnKey] = "true";
                    } else if (person[columnKey] === false) {
                        acc[columnKey] = "false";
                    } else if (
                        [
                            "DespatchDateTime",
                            "DeliveryRequiredDateTime",
                        ].includes(columnKey)
                    ) {
                        const date = new Date(person[columnKey]);
                        if (!isNaN(date)) {
                            acc[columnKey] =
                                (date.getTime() -
                                    date.getTimezoneOffset() * 60000) /
                                    86400000 +
                                25569; // Convert to Excel date serial number
                        } else {
                            acc[columnKey] = "";
                        }
                    } else if (columnKey === "DeliveredDateTime") {
                        acc[columnKey] = moment(person[columnKey]).isValid()
                            ? moment(person[columnKey]).format("DD-MM-YYYY")
                            : "";
                    } else if (columnKey === "Comments") {
                        acc[columnKey] = person[columnKey]?.[0]
                            ? `${person[columnKey][0].Comment}`
                            : "";
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
        const worksheet = workbook.addWorksheet("Sheet1");

        // Add a header row
        const headerRow = worksheet.addRow(newSelectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" }, // Yellow background color
        };
        headerRow.alignment = { horizontal: "left", vertical: "left" };

        // Function to calculate row height based on content length
        const calculateRowHeight = (cellValue) => {
            if (!cellValue) return 20; // Default row height
            const lines = cellValue.split("\n").length;
            return Math.max(20, lines * 25); // Dynamic height, adjust 25px per line
        };

        const dateColumns = [
            "DespatchDateTime",
            "DeliveryRequiredDateTime",
            "DeliveredDateTime",
        ];

        // Add data rows
        data.forEach((rowData) => {
            const row = worksheet.addRow(Object.values(rowData));

            // Apply date formats dynamically to date columns
            dateColumns?.forEach((col) => {
                const index = selectedColumns.indexOf(col);
                if (index !== -1) {
                    const cell = row.getCell(index + 1); // ExcelJS uses 1-based indexing
                    cell.numFmt = "dd-mm-yyyy hh:mm AM/PM"; // You can adjust this format as needed
                }
            });

            // Calculate the maximum height needed for each row based on multiline content
            let maxHeight = 15; // Start with the default height

            row.eachCell({ includeEmpty: true }, (cell) => {
                const cellValue = cell.value?.toString() || "";

                // Enable text wrapping for multiline content
                cell.alignment = { wrapText: true, vertical: "top" };

                // Calculate the height for this particular cell
                const rowHeight = calculateRowHeight(cellValue);

                // Keep track of the maximum height needed for this row
                maxHeight = Math.max(maxHeight, rowHeight);
            });

            // Set the row height to the maximum calculated height for the row
            row.height = maxHeight;
        });

        // Set column widths
        worksheet.columns = newSelectedColumns.map(() => ({
            width: 20,
        }));

        // Generate and save the Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, `Delivery Report ${unileverClient}.xlsx`);
        });
    }

    return (
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
                                    disabled={filteredData?.length === 0}
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
                                                        value="AccountNumber"
                                                        className="text-dark focus:ring-goldd rounded "
                                                    />{" "}
                                                    Account Number
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="DespatchDateTime"
                                                        className="text-dark focus:ring-goldd rounded "
                                                    />{" "}
                                                    Despatch Date
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="ConsignmentNo"
                                                        className="text-dark focus:ring-goldd rounded "
                                                    />{" "}
                                                    Consignment Number
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="SenderName"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Sender Name
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="SenderReference"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Sender Reference
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="SenderState"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Sender Zone
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="ReceiverName"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Receiver Name
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="ReceiverReference"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Receiver Reference
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="ReceiverState"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Receiver Zone
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="ConsignmentStatus"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Consignment Status
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="DeliveryInstructions"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Delivery Instructions
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="DeliveryRequiredDateTime"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Delivery Required Date
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="DeliveredDateTime"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Delivered Date
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="POD"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    POD Available
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Comments"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Comments
                                                </label>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                            <button
                                                onClick={handleDownloadExcel}
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
        </div>
    );
}
