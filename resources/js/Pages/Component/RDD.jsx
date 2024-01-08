import { useRef, useState } from "react";
import { useEffect } from "react";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import ModalRDD from "@/Components/modalRDD";
import moment from "moment";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import React from "react";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import TableStructure from "@/Components/TableStructure";
import Button from "@inovua/reactdatagrid-community/packages/Button";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { PencilIcon } from "@heroicons/react/24/outline";
import { canEditRDD } from "@/permissions";

export default function RDDreason({
    setActiveIndexGTRS,
    setactiveCon,
    rddData,
    url,
    AToken,
    setrddData,
    filterValue,
    setFilterValue,
    setLastIndex,
    currentUser,
    rddReasons,
    accData,
}) {
    window.moment = moment;
    const updateLocalData = (id, reason, note) => {
        // Find the item in the local data with the matching id
        const updatedData = rddData.map((item) => {
            if (item.AuditId === id) {
                // Update the reason of the matching item
                return { ...item, Reason: reason, ReasonDesc: note };
            }
            return item;
        });
        // Update the state with the modified local data
        setrddData(updatedData);
    };
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(9);
        setactiveCon(coindex);
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredData, setFilteredData] = useState(rddData);
    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = rddData?.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.DebtorId);

            return chargeToMatch;
        });
        return filtered;
    };
    useEffect(() => {
        setFilteredData(rddData);
    }, [rddData]);
    useEffect(() => {
        setFilteredData(filterData());
    }, [accData]);
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [consignment, SetConsignment] = useState();
    const tableRef = useRef(null);
    const headers = [
        "ConsignmentNo",
        "Debtor Name",
        "Account Name",
        "Sender Name",
        "Sender Address",
        "Sender Suburb",
        "Sender State",
        "Receiver Name",
        "Receiver Address",
        "Receiver Suburb",
        "Receiver State",
        "Despatch Date",
        "Old Rdd",
        "New Rdd",
        "Reason",
        "Reason Desc",
        "ChangeAt",
        "ChangedBy",
    ];
    const gridRef = useRef(null);

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
        let selectedColVal = allHeaderColumns.filter(col => col.name !== "edit");

        const filterValue = [];
        filteredData?.map((val) =>{
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
                        case "equals":
                            conditionMet =
                                cellValue?.length > 0 &&
                                numericCellValue === numericValue;
                            break;
                        case "notEquals":
                            conditionMet =
                                cellValue?.length > 0 &&
                                numericCellValue !== numericValue;
                            break;
                        case "greaterThan":
                            conditionMet =
                                cellValue?.length > 0 &&
                                numericCellValue > numericValue;
                            break;
                        case "greaterThanOrEqual":
                            conditionMet =
                                cellValue?.length > 0 &&
                                numericCellValue >= numericValue;
                            break;
                        case "lessThan":
                            conditionMet =
                                cellValue?.length > 0 &&
                                numericCellValue < numericValue;
                            break;
                        case "lessThanOrEqual":
                            conditionMet =
                                cellValue?.length > 0 &&
                                numericCellValue <= numericValue;
                            break;
                        case "between":
                            const rangeValues = value.split(",");
                            const minRangeValue = parseFloat(rangeValues[0]);
                            const maxRangeValue = parseFloat(rangeValues[1]);
                            conditionMet =
                                cellValue?.length > 0 &&
                                numericCellValue >= minRangeValue &&
                                numericCellValue <= maxRangeValue;
                            break;
                        case "notBetween":
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
                    const dateValue = moment(val[col.name].replace("T", " "), "YYYY-MM-DD HH:mm:ss");
                    const hasStartDate = cellValue?.start && cellValue.start.length > 0;
                    const hasEndDate = cellValue?.end && cellValue.end.length > 0;
                    const dateCellValueStart = hasStartDate ? moment(cellValue.start, "DD-MM-YYYY") : null;
                    const dateCellValueEnd = hasEndDate ? moment(cellValue.end, "DD-MM-YYYY").endOf('day') : null;
                
                    switch (operator) {
                        case "after":
                            conditionMet = hasStartDate && dateCellValueStart.isAfter(dateValue);
                            break;
                        case "afterOrOn":
                            conditionMet = hasStartDate && dateCellValueStart.isSameOrAfter(dateValue);
                            break;
                        case "before":
                            conditionMet = hasStartDate && dateCellValueStart.isBefore(dateValue);
                            break;
                        case "beforeOrOn":
                            conditionMet = hasStartDate && dateCellValueStart.isSameOrBefore(dateValue);
                            break;
                        case "eq":
                            conditionMet = hasStartDate && dateCellValueStart.isSame(dateValue);
                            break;
                        case "neq":
                            conditionMet = hasStartDate && !dateCellValueStart.isSame(dateValue);
                            break;
                        case "inrange":
                            conditionMet = (!hasStartDate || dateValue.isSameOrAfter(dateCellValueStart)) &&
                                           (!hasEndDate || dateValue.isSameOrBefore(dateCellValueEnd));
                            break;
                        case "notinrange":
                            conditionMet = (hasStartDate && dateValue.isBefore(dateCellValueStart)) ||
                                           (hasEndDate && dateValue.isAfter(dateCellValueEnd));
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
            selectedColVal = allHeaderColumns.filter(col => col.name !== "edit"); // Use all columns
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
        const filterValue = jsonData?.filterValue;
        const data = filterValue.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (columnKey === "Reason") {
                        const Reason = rddReasons?.find(
                            (reason) => reason.ReasonId === person.Reason
                        );
                        acc[columnKey] = Reason?.ReasonName;
                    } else if (column === "Despatch Date") {
                        acc[columnKey] =
                            moment(
                                person["DespatchDate"],
                                "YYYY-MM-DDTHH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") || "";
                    } else if (column === "Account Name") {
                        acc[columnKey] = person.AccountNumber;
                    } else if (column === "ChangeAt") {
                        acc[columnKey] =
                            moment(
                                person["ChangeAt"],
                                "YYYY-MM-DDTHH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") || "";
                    } else if (column === "Old Rdd") {
                        acc[columnKey] =
                            moment(
                                person["OldRdd"],
                                "DD/MM/YYYY h:mm:ss A"
                            ).format("DD-MM-YYYY h:mm A") || "";
                    } else if (column === "New Rdd") {
                        acc[columnKey] =
                            moment(
                                person["NewRdd"],
                                "DD/MM/YYYY h:mm:ss A"
                            ).format("DD-MM-YYYY h:mm A") || "";
                    } else {
                        acc[columnKey] = person[columnKey];
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
            saveAs(blob, "RDD-Report.xlsx");
        });
    }
    const handleEditClick = (consignmentrdd) => {
        SetConsignment(consignmentrdd);
        const isModalCurrentlyOpen = !isModalOpen;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpen(isModalCurrentlyOpen);
    };
    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);
    const handleMouseEnter = () => {
        if (filteredData.length === 0) {
            setHoverMessage("No Data Found");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 1000);
        }
    };
    const [selected, setSelected] = useState([]);
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
    const reasonOptions = rddReasons.map((reason) => ({
        id: reason.ReasonId,
        label: reason.ReasonName,
    }));
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
    const accountOptions = createNewLabelObjects(rddData, "AccountNumber");
    const senderSuburbs = createNewLabelObjects(rddData, "SenderSuburb");
    const senderStates = createNewLabelObjects(rddData, "SenderState");
    const receiverSuburbs = createNewLabelObjects(rddData, "ReceiverSuburb");
    const receiverStates = createNewLabelObjects(rddData, "ReceiverState");
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
    const minDespatchDate = getMinMaxValue(rddData, "DespatchDate", 1);
    const maxDespatchDate = getMinMaxValue(rddData, "DespatchDate", 2);
    const minOldRddDate = getMinMaxValue(rddData, "OldRdd", 1);
    const maxOldRddDate = getMinMaxValue(rddData, "OldRdd", 2);
    const minNewRddDate = getMinMaxValue(rddData, "NewRdd", 1);
    const maxNewRddDate = getMinMaxValue(rddData, "NewRdd", 2);
    const minChangeAtDate = getMinMaxValue(rddData, "ChangeAt", 1);
    const maxChangeAtDate = getMinMaxValue(rddData, "ChangeAt", 2);
    function convertUtcToUserTimezone(utcDateString) {
        // Create a Date object from the UTC date string
        const utcDate = new Date(utcDateString);

        // Get the current user's timezone
        const targetTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const formatter = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: targetTimezone,
        });
        const convertedDate = formatter.format(utcDate);
        return convertedDate;
    }
    const Roles = ["1", "3", "4", "5"];
    const columns = [
        {
            name: "ConsignmentNo",
            header: "Cons No",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 hover:cursor-pointer"
                        onClick={() => handleClick(data.ConsignmentId)}
                    >
                        {" "}
                        {value}
                    </span>
                );
            },
        },
        {
            name: "DebtorName",
            header: "Debtor Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "AccountNumber",
            header: "Account Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: accountOptions,
            },
        },
        {
            name: "SenderName",
            header: "Sender Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "senderInfo",
        },
        {
            name: "SenderReference",
            header: "Sender Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "senderInfo",
        },
        {
            name: "SenderAddress",
            header: "Sender Address",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "senderInfo",
        },
        {
            name: "SenderSuburb",
            header: "Sender Suburb",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderSuburbs,
            },
            group: "senderInfo",
        },
        {
            name: "SenderState",
            header: "Sender State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStates,
            },
            group: "senderInfo",
        },
        {
            name: "ReceiverName",
            header: "Receiver Name",
            type: "string",
            headerAlign: "center",
            defaultWidth: 170,
            textAlign: "center",
            filterEditor: StringFilter,
            group: "receiverInfo",
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "receiverInfo",
        },
        {
            name: "ReceiverAddress",
            header: "Receiver Address",
            type: "string",
            headerAlign: "center",
            defaultWidth: 170,
            textAlign: "start",
            filterEditor: StringFilter,
            group: "receiverInfo",
        },
        {
            name: "ReceiverSuburb",
            header: "Receiver Suburb",
            type: "string",
            headerAlign: "center",
            defaultWidth: 170,
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverSuburbs,
            },
            group: "receiverInfo",
        },
        {
            name: "ReceiverState",
            header: "Receiver State",
            type: "string",
            defaultWidth: 170,
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStates,
            },
            group: "receiverInfo",
        },
        {
            name: "DespatchDate",
            header: "Despatch Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDespatchDate,
                maxDate: maxDespatchDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "OldRdd",
            header: "Old Rdd",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditorProps: {
                minDate: minOldRddDate,
                maxDate: maxOldRddDate,
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
            name: "NewRdd",
            header: "New Rdd",
            headerAlign: "center",
            textAlign: "center",
            headerAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minNewRddDate,
                maxDate: maxNewRddDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "Reason",
            header: "Reason",
            headerAlign: "center",
            textAlign: "start",
            // defaultFlex: 1,
            defaultWidth: 300,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: reasonOptions,
            },
            render: ({ value }) => {
                return (
                    <div>
                        {/* {value} */}
                        {
                            rddReasons?.find(
                                (reason) => reason.ReasonId === value
                            )?.ReasonName
                        }
                    </div>
                );
            },
        },
        {
            name: "ReasonDesc",
            header: "Reason Description",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 300,
            filterEditor: StringFilter,
        },
        {
            name: "ChangeAt",
            header: "Change At",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minChangeAtDate,
                maxDate: maxChangeAtDate,
            },
            render: ({ value, cellProps }) => {
                {
                    return (
                        <p>
                            {moment(
                                convertUtcToUserTimezone(value + "Z"),

                                "MM/DD/YYYY, h:mm:ss A"
                            ).format("YYYY-MM-DD hh:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      convertUtcToUserTimezone(value + "Z"),

                                      "MM/DD/YYYY, h:mm:ss A"
                                  ).format("DD-MM-YYYY hh:mm A")}
                        </p>
                    );
                }
            },
        },
        {
            name: "ChangedBy",
            header: "Changed By",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "edit",
            header: "edit",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 100,
            render: ({ value, data }) => {
                return (
                    <div>
                        {canEditRDD(currentUser) ? (
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
                        ) : null}
                    </div>
                );
            },
        },
    ];
    const newArray = columns.slice(0, -1);
    const [newColumns, setNewColumns] = useState();

    useEffect(() => {
        if (canEditRDD(currentUser)) {
            setNewColumns(columns);
        } else {
            setNewColumns(newArray);
        }
    }, []);

    return (
        <div className=" w-full bg-smooth ">
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
                    <div className="mt-8">
                        <div className="w-full relative">
                            <div className=" sm:border-gray-200 text-gray-400 flex flex-col  gap-y-6 gap-x-2  w-full">
                                <Popover className="relative object-right flex-item lg:ml-auto">
                                    <button onMouseEnter={handleMouseEnter}>
                                        <Popover.Button
                                            className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                                filteredData.length === 0
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-gray-800"
                                            } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                            disabled={filteredData.length === 0}
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
                                        <Popover.Panel className="absolute left-20 lg:left-0 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                            <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                <div className="p-4">
                                                    <div className="mt-2 flex flex-col">
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
                                                                value="DebtorName"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Debtor Name
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="AccountName"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Account Name
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
                                                                value="SenderAddress"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender Address
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SenderSuburb"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender Suburb
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SenderState"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender State
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ReceiverName"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Name
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ReceiverAddress"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Address
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ReceiverSuburb"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Suburb
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ReceiverState"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver State
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Despatch Date"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Despatch Date
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Old Rdd"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Old Rdd
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="New Rdd"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            New Rdd
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
                                                                value="ReasonDesc"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Reason Desc
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ChangeAt"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Change At
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ChangedBy"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Changed By
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
                        id={"AuditId"}
                        gridRef={gridRef}
                        setSelected={setSelected}
                        groupsElements={groups}
                        selected={selected}
                        tableDataElements={filteredData}
                        filterValueElements={filterValue}
                        setFilterValueElements={setFilterValue}
                        columnsElements={newColumns}
                    />
                </div>
            )}
            <ModalRDD
                url={url}
                AToken={AToken}
                isOpen={isModalOpen}
                updateLocalData={updateLocalData}
                handleClose={handleEditClick}
                consignment={consignment}
                rddReasons={rddReasons}
                currentUser={currentUser}
            />
        </div>
    );
}
