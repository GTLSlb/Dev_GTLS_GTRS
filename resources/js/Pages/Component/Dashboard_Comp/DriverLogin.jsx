import { useLayoutEffect, useRef, useState } from "react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { Fragment } from "react";
import ExcelJS from "exceljs";
import moment from "moment";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import TableStructure from "@/Components/TableStructure";
import swal from "sweetalert";
import axios from "axios";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function DriverLogin({
    DriverData,
    setDriverData,
    filterValue,
    setFilterValue,
    url,
    AToken,
    currentUser,
}) {
    window.moment = moment;

    const [isFetching, setIsFetching] = useState();
    useEffect(() => {
        if (DriverData === null || DriverData === undefined) {
            setIsFetching(true);
            fetchData();
        }
    }, []);
    const fetchData = async () => {
        axios
            .get(`${url}DriverLogin`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });

                parsedDataPromise.then((parsedData) => {
                    setDriverData(parsedData);
                    setIsFetching(false);
                });
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Handle 401 error using SweetAlert
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        type: "success",
                        icon: "info",
                        confirmButtonText: "OK",
                    }).then(function () {
                        axios
                            .post("/logoutAPI")
                            .then((response) => {
                                if (response.status == 200) {
                                    window.location.href = "/";
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    });
                } else {
                    // Handle other errors
                    console.log(err);
                }
            });
    };
    const tableRef = useRef(null);
    const headers = [
        "Name",
        "Device Code",
        "Smart SCAN",
        "Smart SCAN Freight",
        "Smart SCAN Version",
        "Description",
        "Last Active UTC",
        "VLink",
        "Software Version",
        "Device Sim Type",
        "Device Model",
        "Device Makes",
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
        let selectedColVal = allHeaderColumns.filter(
            (col) => col.name !== "edit"
        );
        const filterValue = [];
        DriverData?.forEach((val) => {
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

                            break;case "inrange":
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

        const columnMapping = {
            "ConsignmentNo": "Consignment No",
            "SenderReference": "Sender Reference",
            "ReceiverReference": "Receiver Reference",
            "Quantity": "Quantity",
            "TotalCharge": "Total Charge",
            "CodeRef": "Code Ref",
            "DescriptionRef": "Description Ref",
            "FuelLevyAmountRef": "Fuel Levy Amount Ref",
            "DespatchDateTime": "Despatch DateTime",
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
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (columnKey === "DeviceSimType") {
                        acc[columnKey] = person["MobilityDeviceSimTypes_Description"];
                    } else if (columnKey === "SmartSCANVersion") {
                        acc[columnKey] = person["SmartSCANSoftwareVersion"];
                    } else if (columnKey === "DeviceModel") {
                        acc[columnKey] = person["MobilityDeviceModels_Description"];
                    } else if (columnKey === "LastActiveUTC") {
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
                    } else if (columnKey === "DeviceMakes") {
                        acc[columnKey] = person["MobilityDeviceMakes_Description"];
                    } else if (columnKey === "VLink") {
                        acc[columnKey] = person["UsedForVLink"];
                    } else if (columnKey === "SmartSCANFreight") {
                        acc[columnKey] = person["UsedForSmartSCANFreight"];
                    } else if (columnKey === "SmartSCAN") {
                        acc[columnKey] = person["UsedForSmartSCAN"];
                    } else if (columnKey === "DespatchDateTime") {
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
                    } else {
                        acc[column.replace(/\s+/g, "")] = person[column.replace(/\s+/g, "")];
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

        // Apply custom styles to the header row
        const headerRow = worksheet.addRow(newSelectedColumns);
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

            // Apply date format to the LastActiveUTC column
            const lastActiveUtcIndex = newSelectedColumns.indexOf("LastActiveUTC");
            if (lastActiveUtcIndex !== -1) {
                const cell = row.getCell(lastActiveUtcIndex + 1);
                cell.numFmt = 'dd-mm-yyyy hh:mm AM/PM';
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
            saveAs(blob, "Driver-Login.xlsx");
        });
    }


    const [selected, setSelected] = useState([]);

    const filterIcon = (className) => {
        return (
            <svg
                className={className}
                enable-background="new 0 0 24 24"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
            >
                <g>
                    <path d="M0,0h24 M24,24H0" fill="none" />
                    <path d="M7,6h10l-5.01,6.3L7,6z M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6 c0,0,3.72-4.8,5.74-7.39C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z" />
                    <path d="M0,0h24v24H0V0z" fill="none" />
                </g>
            </svg>
        );
    };
    const createNewLabelObjects = (data, fieldName) => {
        let id = 1; // Initialize the ID (Note: This ID is initialized but not used in the provided code)
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];

        // Map through the data and create new objects
        data?.forEach((item) => {
            const fieldValue = item[fieldName];

            // Check if the label is not already included and is not null or empty
            if (
                fieldValue &&
                fieldValue.trim() !== "" &&
                !uniqueLabels.has(fieldValue)
            ) {
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
    const reference = createNewLabelObjects(DriverData, "DeviceCode");
    const version = createNewLabelObjects(
        DriverData,
        "SmartSCANSoftwareVersion"
    );
    const description = createNewLabelObjects(DriverData, "Description");
    const softwareVersion = createNewLabelObjects(
        DriverData,
        "SoftwareVersion"
    );
    const DeviceSimType = createNewLabelObjects(
        DriverData,
        "MobilityDeviceSimTypes_Description"
    );
    const DeviceModels = createNewLabelObjects(
        DriverData,
        "MobilityDeviceModels_Description"
    );
    const DeviceMakes = createNewLabelObjects(
        DriverData,
        "MobilityDeviceMakes_Description"
    );

    const columns = [
        {
            name: "Name",
            header: "Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "DeviceCode",
            header: "Device Code",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: reference,
            },
        },
        {
            name: "UsedForSmartSCAN",
            header: "Smart SCAN",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
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
            name: "UsedForSmartSCANFreight",
            header: "Smart SCAN Freight",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
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
            name: "SmartSCANSoftwareVersion",
            header: "Smart SCAN Version",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: version,
            },
        },
        {
            name: "Description",
            header: "Description",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: description,
            },
        },
        {
            name: "LastActiveUTC",
            header: "Last Active UTC",
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
            name: "UsedForVLink",
            header: "VLink",
            type: "string",
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
            name: "SoftwareVersion",
            header: "Software Version",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: softwareVersion,
            },
        },
        {
            name: "MobilityDeviceSimTypes_Description",
            header: "Device Sim Type",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: DeviceSimType,
            },
        },
        {
            name: "MobilityDeviceModels_Description",
            header: "Device Model",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: DeviceModels,
            },
        },
        {
            name: "MobilityDeviceMakes_Description",
            header: "Device Makes",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: DeviceMakes,
            },
        },
    ];
    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);
    const handleMouseEnter = () => {
        if (DriverData?.length === 0) {
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
            {isFetching && (
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
            )}
            {!isFetching && (
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto mt-6">
                            <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                Driver Login
                            </h1>
                        </div>
                        <div className="absolute left-auto right-10 top-9">
                            <Popover className="relative object-right flex-item md:ml-auto">
                                <button onMouseEnter={handleMouseEnter}>
                                    <Popover.Button
                                        className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                            DriverData?.length === 0
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-gray-800"
                                        } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                        disabled={DriverData?.length === 0}
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
                                                            value="Name"
                                                            className="text-dark focus:ring-goldd rounded "
                                                        />{" "}
                                                        Name
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Device Code"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Device Code
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="UsedForSmartSCAN"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Smart SCAN
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="UsedForSmartSCANFreight"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Smart SCAN Freight
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="SmartSCANSoftwareVersion"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Smart SCAN Version
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Description"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Description
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Last Active UTC"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Last Active UTC
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="UsedForVLink"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        VLink
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Software Version"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Software Version
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="MobilityDeviceSimTypes_Description"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Device Sim Type
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="MobilityDeviceModels_Description"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Device Model
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="MobilityDeviceMakes_Description"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Device Makes
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
                    <TableStructure
                        id={"MobilityDeviceID"}
                        gridRef={gridRef}
                        setSelected={setSelected}
                        selected={selected}
                        tableDataElements={DriverData}
                        filterValueElements={filterValue}
                        setFilterValueElements={setFilterValue}
                        columnsElements={columns}
                    />
                </div>
            )}
        </div>
    );
}
