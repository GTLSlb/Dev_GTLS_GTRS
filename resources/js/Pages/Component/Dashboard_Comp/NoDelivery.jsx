import { useRef, useState } from "react";
import { useEffect } from "react";
import ExcelJS from "exceljs";
import { Fragment } from "react";
import moment from "moment";
import { saveAs } from "file-saver";
import { Popover, Transition } from "@headlessui/react";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import swal from "sweetalert";
import axios from "axios";
import TableStructure from "@/Components/TableStructure";
import {
    ChevronDownIcon
} from "@heroicons/react/20/solid";
import { isDummyAccount } from "@/CommonFunctions";

export default function NoDelivery({
    NoDelData,
    setNoDelData,
    setActiveIndexGTRS,
    filterValue,
    setFilterValue,
    setLastIndex,
    setactiveCon,
    currentUser,
    AToken,
    url,
}) {
    window.moment = moment;

    const [isFetching, setIsFetching] = useState();
    useEffect(() => {
        if (NoDelData === null || NoDelData === undefined) {
            setIsFetching(true);
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        axios
            .get(`${url}NoDelInfo`, {
                headers: {
                    UserId: currentUser?.UserId,
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
                    setNoDelData(parsedData);
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
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(6);
        setactiveCon(coindex);
    };

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
        NoDelData?.map((val) => {
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
                            cellValueLowerCase?.length > 0 &&
                                valLowerCase?.includes(cellValueLowerCase);
                            break;
                        case "notContains":
                            conditionMet =
                            cellValueLowerCase?.length > 0 &&
                                !valLowerCase.includes(cellValueLowerCase);
                            break;
                        case "eq":
                            conditionMet =
                            cellValueLowerCase?.length > 0 &&
                                cellValueLowerCase === valLowerCase;
                            break;
                        case "neq":
                            conditionMet =
                            cellValueLowerCase?.length > 0 &&
                                cellValueLowerCase !== valLowerCase;
                            break;
                        case "empty":
                            conditionMet =
                            cellValueLowerCase?.length > 0 && val[col.name] === "";
                            break;
                        case "notEmpty":
                            conditionMet =
                            cellValueLowerCase?.length > 0 && val[col.name] !== "";
                            break;
                        case "startsWith":
                            conditionMet =
                            cellValueLowerCase?.length > 0 &&
                                valLowerCase.startsWith(cellValueLowerCase);
                            break;
                        case "endsWith":
                            conditionMet =
                            cellValueLowerCase?.length > 0 &&
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

                            break;case "inrange":
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
                    if (header?.name?.toLowerCase() === formattedColumn) {
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
            ConsignmentNo: "Consignment No",
            DespatchDateTime: "Despatch DateTime",
            SenderName: "Sender Name",
            SenderReference: "Sender Reference",
            Send_Suburb: "Sender Suburb",
            Send_State: "Sender State",
            AdminStatusCodes_Description: "Status",
            ReceiverName: "Receiver Name",
            ReceiverReference: "Receiver Reference",
            Del_Suburb: "Receiver Suburb",
            Del_State: "Receiver State",
            Timeslot: "Timeslot",
            POD: "POD",
            DeliveryRequiredDateTime: "Delivery Required DateTime",
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
                    if (columnKey === "SenderSuburb") {
                        acc[columnKey] = person["Send_Suburb"];
                    } else if (columnKey === "Status") {
                        acc[columnKey] = person["AdminStatusCodes_Description"];
                    } else if (columnKey === "SenderState") {
                        acc[columnKey] = person["Send_State"];
                    } else if (columnKey === "ReceiverSuburb") {
                        acc[columnKey] = person["Del_Suburb"];
                    } else if (
                        ["DespatchDateTime", "DeliveryRequiredDateTime"].includes(columnKey)
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
                    } else if (columnKey === "ReceiverState") {
                        acc[columnKey] = person["Del_State"];
                    } else {
                        acc[column.replace(/\s+/g, "")] =
                            person[column.replace(/\s+/g, "")];
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
        data?.forEach((rowData) => {
            const row = worksheet.addRow(Object.values(rowData));
    
            // Apply date format to the DespatchDateTime column
            const despatchDateIndex = newSelectedColumns.indexOf("Despatch DateTime");
            if (despatchDateIndex !== -1) {
                const cell = row.getCell(despatchDateIndex + 1);
                cell.numFmt = 'dd-mm-yyyy hh:mm AM/PM';
            }
    
            // Apply date format to the DeliveryRequiredDateTime column
            const deliveryReqDateIndex = newSelectedColumns.indexOf("Delivery Required DateTime");
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
            saveAs(blob, "NoDeliveryinfo.xlsx");
        });
    }
    
    const [selected, setSelected] = useState([]);
    const createNewLabelObjects = (data, fieldName) => {
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
    
        // Sort the array alphabetically by label
        return newData.sort((a, b) => a.label.localeCompare(b.label));
    };
    
    const senderSuburbs = createNewLabelObjects(NoDelData, "Send_Suburb");
    const senderStates = createNewLabelObjects(NoDelData, "Send_State");
    const status = createNewLabelObjects(
        NoDelData,
        "AdminStatusCodes_Description"
    );
    const receiverSuburbs = createNewLabelObjects(NoDelData, "Del_Suburb");
    const receiverStates = createNewLabelObjects(NoDelData, "Del_State");
    const description = createNewLabelObjects(NoDelData, "Description");
    function getMinMaxValue(data, fieldName, identifier) {
        // Check for null safety
        if (!data || !Array.isArray(data) || data.length === 0) {
            return null;
        }

        // Sort the data based on the fieldName
        const sortedData = [...data].sort((a, b) => {
            if (a[fieldName] < b[fieldName]) return -1;
            if (a[fieldName] > b[fieldName]) return 1;
            return 0;
        });

        // Return the minimum or maximum value based on the identifier
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

    const minDate = getMinMaxValue(NoDelData, "DespatchDateTime", 1);
    const maxDate = getMinMaxValue(NoDelData, "DespatchDateTime", 2);

    const minDaterdd = getMinMaxValue(NoDelData, "DeliveryRequiredDateTime", 1);
    const maxDaterdd = getMinMaxValue(NoDelData, "DeliveryRequiredDateTime", 2);

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
    const columns = [
        {
            name: "ConsignmentNo",
            header: "Cons No",
            group: "personalInfo",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 hover:cursor-pointer"
                        onClick={() => handleClick(data.ConsignmentID)}
                    >
                        {isDummyAccount(value)}
                    </span>
                );
            },
        },
        {
            name: "DespatchDateTime",
            header: "Despatch Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
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
            name: "SenderName",
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
            name: "SenderReference",
            header: "Sender Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "senderInfo",
            render: ({ value }) => {
                return isDummyAccount(value);
            },
        },
        {
            name: "Send_Suburb",
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
            name: "Send_State",
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
            name: "AdminStatusCodes_Description",
            header: "Status",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: status,
            },
        },
        {
            name: "ReceiverName",
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
            name: "ReceiverReference",
            header: "Receiver Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "receiverInfo",
            render: ({ value }) => {
                return isDummyAccount(value);
            },
        },
        {
            name: "Del_Suburb",
            header: "Receiver Suburb",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverSuburbs,
            },
            group: "receiverInfo",
        },
        {
            name: "Del_State",
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
            name: "Timeslot",
            header: "Timeslot",
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
        {
            name: "DeliveryRequiredDateTime",
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
            name: "Description",
            header: "Description",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: description,
            },
        },
    ];
    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);
    const handleMouseEnter = () => {
        if (NoDelData.length === 0) {
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
                        <div className="sm:flex justify-between w-full items-center mt-6">
                            <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                No Delivery information
                            </h1>
                            <Popover className="relative object-right flex-item md:ml-auto">
                                <button onMouseEnter={handleMouseEnter}>
                                    <Popover.Button
                                        className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                            NoDelData?.length === 0
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-gray-800"
                                        } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                        disabled={NoDelData?.length === 0}
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
                                                            value="ConsignmentNo"
                                                            className="text-dark focus:ring-goldd rounded "
                                                        />{" "}
                                                        Consignment Number
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="DespatchDateTime"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Despatch Date
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
                                                            value="Send_Suburb"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Sender Suburb
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Send_State"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Sender State
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
                                                            value="Receiver Name"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Receiver Name
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="ReceiverReference"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Receiver Reference
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Del_Suburb"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Receiver Suburb
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Del_State"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Receiver State
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Timeslot"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Timeslot
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
                                                            value="DeliveryRequiredDateTime"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Delivery Required
                                                        DateTime
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
                        id={"ConsignmentID"}
                        gridRef={gridRef}
                        groupsElements={groups}
                        setFilterValueElements={setFilterValue}
                        setSelected={setSelected}
                        selected={selected}
                        tableDataElements={NoDelData}
                        filterValueElements={filterValue}
                        columnsElements={columns}
                    />
                </div>
            )}
        </div>
    );
}
