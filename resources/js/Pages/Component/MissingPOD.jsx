import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Fragment, useEffect, useState, useRef } from "react";
import { Popover, Transition } from "@headlessui/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import Button from "@inovua/reactdatagrid-community/packages/Button";
import TableStructure from "@/Components/TableStructure";
import { isDummyAccount } from "@/CommonFunctions";
export default function MissingPOD({
    PerfData,
    setActiveIndexGTRS,
    filterValue,
    setFilterValue,
    setLastIndex,
    setactiveCon,
    accData,
}) {
    window.moment = moment;
    const minDateDespatch = getMinMaxValue(PerfData, "DESPATCHDATE", 1);
    const maxDateDespatch = getMinMaxValue(PerfData, "DESPATCHDATE", 2);
    const minDaterdd = getMinMaxValue(PerfData, "DELIVERYREQUIREDDATETIME", 1);
    const maxDaterdd = getMinMaxValue(PerfData, "DELIVERYREQUIREDDATETIME", 2);
    const minDateArrive = getMinMaxValue(PerfData, "ARRIVEDDATETIME", 1);
    const maxDateArrive = getMinMaxValue(PerfData, "ARRIVEDDATETIME", 2);
    const minDateDel = getMinMaxValue(PerfData, "DELIVEREDDATETIME", 1);
    const maxDateDel = getMinMaxValue(PerfData, "DELIVEREDDATETIME", 2);
    // const data = PerfData.filter((obj) => obj.STATUS === "FAIL");
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(5);
        setactiveCon(coindex);
    };
    const falsePodOnly = PerfData.filter(function (entry) {
        return entry.POD === false;
    });
    const [data, setData] = useState(falsePodOnly);
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
        "Sender Name",
        "Sender State",
        "Receiver Name",
        "Receiver State",
        "Status",
        "Service",
        "Despatch DateTime",
        "RDD",
        "Arrived Date Time",
        "Delivered Datetime",
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
        let selectedColVal = allHeaderColumns.filter(
            (col) => col.name !== "edit"
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
                                valLowerCase?.includes(cellValueLowerCase);
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
            selectedColVal = allHeaderColumns?.filter(
                (col) => col?.label?.toString().toLowerCase() !== "edit"
            ); // Use all columns
        } else {
            allHeaderColumns.map((header) => {
                selectedColumns.map((column) => {
                    const formattedColumn = column
                        .replace(/\s/g, "")
                        .toLowerCase();
                    if (
                        header?.name?.replace(/\s/g, "")?.toLowerCase() ==
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
            CONSIGNMENTNUMBER: "Consignemnt Number",
            SENDERNAME: "Sender Name",
            SENDERREFERENCE: "Sender Reference",
            SenderState: "Sender State",
            RECEIVERNAME: "Receiver Name",
            "RECEIVER REFERENCE": "Receiver Reference",
            RECEIVERSTATE: "Receiver State",
            SERVICE: "Service",
            DESPATCHDATE: "Despatch DateTime",
            DELIVERYREQUIREDDATETIME: "RDD",
            ARRIVEDDATETIME: "Arrived Date Time",
            DELIVEREDDATETIME: "Delivered Datetime",
            POD: "POD",
        };
        const fieldsToCheck = [
            "CONSIGNMENTNUMBER",
            "SENDERNAME",
            "SENDERREFERENCE",
            "RECEIVERNAME",
            "RECEIVER REFERENCE",
        ]; // for dummy data
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
                    } else if (column.replace(/\s+/g, "") === "SenderState") {
                        acc[columnKey] = person["SenderState"];
                    } else if (
                        ["ARRIVEDDATETIME", "DELIVERYREQUIREDDATETIME", "DELIVEREDDATETIME", "DESPATCHDATE"].includes(columnKey)
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
                    } else if (column === "Consignemnt Number") {
                        acc[columnKey] = person["CONSIGNMENTNUMBER"];
                    } else if (column.toUpperCase() === "RECEIVER REFERENCE") {
                        acc[columnKey] = isDummyAccount(person["RECEIVER REFERENCE"]);
                    } else if (fieldsToCheck.includes(columnKey)) {
                        acc[column] = isDummyAccount(person[columnKey]);
                    } else {
                        acc[columnKey] = person[columnKey.toUpperCase()];
                    }
    
                    return acc;
                }
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
    
            // Apply date format to the DESPATCHDATE column
            const despatchDateIndex = newSelectedColumns.indexOf("Despatch DateTime");
            if (despatchDateIndex !== -1) {
                const cell = row.getCell(despatchDateIndex + 1);
                cell.numFmt = 'dd-mm-yyyy hh:mm AM/PM';
            }
    
            // Apply date format to the ARRIVEDDATETIME column
            const arrivedDateIndex = newSelectedColumns.indexOf("Arrived Date Time");
            if (arrivedDateIndex !== -1) {
                const cell = row.getCell(arrivedDateIndex + 1);
                cell.numFmt = 'dd-mm-yyyy hh:mm AM/PM';
            }
    
            // Apply date format to the DELIVEREDDATETIME column
            const deliveredDateIndex = newSelectedColumns.indexOf("Delivered Datetime");
            if (deliveredDateIndex !== -1) {
                const cell = row.getCell(deliveredDateIndex + 1);
                cell.numFmt = 'dd-mm-yyyy hh:mm AM/PM';
            }
    
            // Apply date format to the DELIVERYREQUIREDDATETIME column
            const deliveryReqDateIndex = newSelectedColumns.indexOf("RDD");
            if (deliveryReqDateIndex !== -1) {
                const cell = row.getCell(deliveryReqDateIndex + 1);
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
            saveAs(blob, "Missing-POD.xlsx");
        });
    }
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
    const createNewLabelObjects = (data, fieldName) => {
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
    
        // Sort the array alphabetically by label
        return newData.sort((a, b) => a.label.localeCompare(b.label));
    };
    
    const senderStates = createNewLabelObjects(falsePodOnly, "SenderState");
    const receiverStates = createNewLabelObjects(falsePodOnly, "RECEIVERSTATE");
    const services = createNewLabelObjects(falsePodOnly, "SERVICE");
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
    const columns = [
        {
            name: "CONSIGNMENTNUMBER",
            header: "Cons No",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 hover:cursor-pointer"
                        onClick={() => handleClick(data.CONSIGNMNENTID)}
                    >
                        {isDummyAccount(value)}
                    </span>
                );
            },
        },
        {
            name: "SENDERNAME",
            header: "Sender Name",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "senderInfo",
            render: ({ value }) => {
                return isDummyAccount(value);
            },
        },
        {
            name: "SENDERREFERENCE",
            header: "Sender Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            group: "senderInfo",
            filterEditor: StringFilter,
            render: ({ value }) => {
                return isDummyAccount(value);
            },
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
            name: "RECEIVERNAME",
            header: "Receiver Name",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "receiverInfo",
            render: ({ value }) => {
                return isDummyAccount(value);
            },
        },
        {
            name: "RECEIVER REFERENCE",
            header: "Receiver Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            group: "receiverInfo",
            filterEditor: StringFilter,
            render: ({ value }) => {
                return isDummyAccount(value);
            },
        },
        {
            name: "RECEIVERSTATE",
            header: "Receiver State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStates,
            },
            group: "receiverInfo",
        },
        {
            name: "SERVICE",
            header: "Service",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: services,
            },
        },
        {
            name: "DESPATCHDATE",
            header: "Despatch Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDateDespatch,
                maxDate: maxDateDespatch,
            },
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
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDaterdd,
                maxDate: maxDaterdd,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "ARRIVEDDATETIME",
            header: "Arrived Date Time",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDateArrive,
                maxDate: maxDateArrive,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "DELIVEREDDATETIME",
            header: "Delivery Date Time",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDateDel,
                maxDate: maxDateDel,
            },
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
    ];

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
    return (
        <div>
            {/* <Sidebar /> */}
            <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex  items-center w-full justify-between mt-6">
                        <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                            Missing POD Report
                        </h1>
                        <Popover className="relative object-right flex-item md:ml-auto">
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
                                                        value="CONSIGNMENTNUMBER"
                                                        className="text-dark focus:ring-goldd rounded "
                                                    />{" "}
                                                    Consignment Number
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="SENDERNAME"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Sender Name
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="SENDERREFERENCE"
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
                                                    Sender State
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="RECEIVERNAME"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Receiver Name
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="RECEIVER REFERENCE"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Receiver Reference
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
                                                        value="DESPATCHDATE"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Despatch DateTime
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="DELIVERYREQUIREDDATETIME"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    RDD
                                                </label>
                                                <label className="">
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
                                                    Delivered Date Time
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
                <div className="mt-4">
                    <div className=" w-full bg-smooth ">
                        <TableStructure
                            id={"CONSIGNMNENTID"}
                            setSelected={setSelected}
                            gridRef={gridRef}
                            selected={selected}
                            groupsElements={groups}
                            tableDataElements={filteredData}
                            filterValueElements={filterValue}
                            setFilterValueElements={setFilterValue}
                            columnsElements={columns}
                        />
                    </div>{" "}
                </div>
            </div>
        </div>
    );
}
