import { useState } from "react";
import "../../../css/reactdatagrid.css";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import TableStructure from "@/Components/TableStructure";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { useEffect,useRef } from "react";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function GtrsCons({
    setActiveIndexGTRS,
    setactiveCon,
    consData,
    minDate,
    maxDate,
    filterValue,
    setFilterValue,
    setLastIndex,
    accData,
}) {
    
    window.moment = moment;
    const [filteredData, setFilteredData] = useState(consData);
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(1);
        setactiveCon(coindex);
    };
    const [selected, setSelected] = useState({});
    const headers = [
        "Consignment No",
        "Service",
        "Account Name",
        "Despatch Date",
        "Status",
        "Sender Name",
        "Sender State",
        "Sender Suburb",
        "Sender Zone",
        "Receiver Name",
        "Receiver State",
        "Receiver Suburb",
        "Receiver Zone",
        "POD",
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
                    if (column.replace(/\s+/g, "") === "DespatchDate") {
                        acc[column.replace(/\s+/g, "")] =
                            moment(
                                person["DespatchDate"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY hh:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["DespatchDate"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else {
                        acc[column.replace(/\s+/g, "")] =
                            person[column.replace(/\s+/g, "")];
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
            saveAs(blob, "Consignments.xlsx");
        });
    }
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
    const createNewLabelObjects = (data, fieldName) => {
        let id = 1; // Initialize the ID
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];

        // Map through the data and create new objects
        data.forEach((item) => {
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
    const senderStateOptions = createNewLabelObjects(consData, "SenderState");
    const senderZoneOptions = createNewLabelObjects(consData, "SenderZone");
    const receiverStateOptions = createNewLabelObjects(
        consData,
        "ReceiverState"
    );
    const receiverZoneOptions = createNewLabelObjects(consData, "ReceiverZone");
    const serviceOptions = createNewLabelObjects(consData, "Service");
    const statusOptions = createNewLabelObjects(consData, "Status");
    
    const groups = [
        {
            name: "senderDetails",
            header: "Sender Details",
            headerAlign: "center",
        },
        {
            name: "receiverDetails",
            header: "Receiver Details",
            headerAlign: "center",
        },
    ];
    const columns = [
        {
            name: "ConsignmentNo",
            header: "Cons No",
            group: "personalInfo",
            filterEditor: StringFilter,
            headerAlign: "center",
            textAlign: "center",
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
            name: "AccountName",
            header: "Account Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Service",
            header: "Service",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: serviceOptions,
            },
        },
        {
            name: "DespatchDate",
            header: "Despatch date",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "Status",
            header: "Status",
            type: "string",
            defaultWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: statusOptions,
            },
        },
        {
            name: "SenderName",
            header: "Sender Name",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "SenderState",
            header: "Sender State",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStateOptions,
            },
        },
        {
            name: "SenderSuburb",
            header: "Sender Suburb",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "SenderZone",
            header: "Sender Zone",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderZoneOptions,
            },
        },
        {
            name: "SenderReference",
            header: "Sender Reference",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverName",
            header: "Receiver Name",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverState",
            header: "Receiver State",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStateOptions,
            },
        },
        {
            name: "ReceiverSuburb",
            header: "Receiver Suburb",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverZone",
            header: "Receiver Zone",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverZoneOptions,
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
        // {
        //     header: "Edit",
        //     headerAlign: "center",
        //     textAlign: "center",
        //     render: ({ value, data }) => {
        //         return (
        //                 <Button
        //                     onClick={() => {
        //                         testButton(data);
        //                     }}
        //                 >
        //                     Edit
        //                 </Button>
        //         );
        //     },
        // },
    ];
    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = consData.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeToID);

            return chargeToMatch;
        });
        return filtered;
    };
    useEffect(() => {
        setFilteredData(filterData());
    }, [accData]);

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Consignments
                    </h1>
                </div>
                <Popover className="relative object-right flex-item md:ml-auto">
                    <div onMouseEnter={handleMouseEnter}>
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
                    </div>
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
                                                value="Consignment No"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Consignment Number
                                        </label>
                                        <label className="">
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
                                                value="Service"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Service
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="DespatchDate"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Despatch Date
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Status"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Status
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Sender Name"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Sender Name
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Sender State"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Sender State
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Sender Suburb"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Sender Suburb
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Sender Zone"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Sender Zone
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Receiver Name"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Receiver Name
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Receiver State"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Receiver State
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Receiver Suburb"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Receiver Suburb
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Receiver Zone"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Receiver Zone
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="POD"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            POD
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
            <TableStructure
                id={"ConsignmentId"}
                setSelected={setSelected}
                gridRef={gridRef}
                selected={selected}
                tableDataElements={filteredData}
                filterValueElements={filterValue}
                setFilterValueElements={setFilterValue}
                groupsElements={groups}
                columnsElements={columns}
            />
        </div>
    );
}