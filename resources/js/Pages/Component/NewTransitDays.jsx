import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { useState, useEffect, useRef } from "react";
import ExcelJS from "exceljs";
import TableStructure from "@/Components/TableStructure";
import { ChevronDownIcon, PencilIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
    canAddNewTransitDays,
    canAddTransitDays,
    canEditTransitDays,
} from "@/permissions";
import swal from "sweetalert";
import axios from "axios";
import GtamButton from "./GTAM/components/Buttons/GtamButton";
import { isDummyAccount } from "@/CommonFunctions";

function NewTransitDays({
    setActiveIndexGTRS,
    setNewTransitDays,
    setNewTransitDay,
    newTransitDays,
    accData,
    currentUser,
    filterValue,
    setFilterValue,
    AToken,
    url,
}) {
    const [isFetching, setIsFetching] = useState(true);
    const [selected, setSelected] = useState([]);
    const [filteredData, setFilteredData] = useState(newTransitDays);
    const gridRef = useRef(null);
    const fetchData = async () => {
        try {
            axios
                .get(`${url}TransitNew`, {
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
                        setNewTransitDays(parsedData);
                        setIsFetching(false);
                    });
                });
        } catch (error) {
            if (error.response && error.response.status === 401) {
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
        }
    };
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
    const createNewLabelObjects = (data, fieldName) => {
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];
        // Map through the data and create new objects
        data?.forEach((item) => {
            const fieldValue = item[fieldName];
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
    // const [receiverStateOptions, setReceiverStateOptions] = useState([]);
    const receiverStateOptions = createNewLabelObjects(
        newTransitDays,
        "ReceiverState"
    );
    const senderStateOptions = createNewLabelObjects(
        newTransitDays,
        "SenderState"
    );
    const customers = getUniqueCustomers(newTransitDays);
    function getUniqueCustomers(data) {
        // Create a Set to store unique customer names
        const customerSet = new Set();

        // Loop through each object in the data array
        data?.forEach((item) => {
            // Add the CustomerName to the set
            customerSet.add(item.CustomerName);
        });

        // Convert the set to an array of objects with id and label
        const uniqueCustomers = Array.from(customerSet).map((customer) => ({
            id: customer,
            label: customer,
        }));

        return uniqueCustomers;
    }

    const types = getUniqueCustomerTypes(newTransitDays);
    const [isMessageVisible, setMessageVisible] = useState(false);

    function getUniqueCustomerTypes(data) {
        // Create a Map to store unique customer types with their corresponding IDs
        const typeMap = new Map();

        // Loop through each object in the data array
        data?.forEach((item) => {
            // Add the customer type to the map with the CustomerTypeId as the key
            // only if the CustomerType is not an empty string
            if (
                item.CustomerType &&
                item.CustomerType.trim() !== "" &&
                !typeMap.has(item.CustomerTypeId)
            ) {
                typeMap.set(item.CustomerTypeId, item.CustomerType);
            }
        });

        // Convert the map to an array of objects with id and label
        const uniqueCustomers = Array.from(typeMap).map(([id, label]) => ({
            id,
            label,
        }));

        return uniqueCustomers;
    }
    const columns = [
        {
            name: "CustomerName",
            header: "Customer Name",
            type: "string",
            headerAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: customers,
            },
            render: ({ value }) => {
                return isDummyAccount(value);
            },
        },
        {
            name: "CustomerTypeId",
            header: "Customer Type",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: types,
            },
            render: ({ value, data }) => {
                return <div>{isDummyAccount(data.CustomerType)}</div>;
            },
        },
        {
            name: "SenderState",
            header: "Sender State",
            type: "string",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStateOptions,
            },
        },
        {
            name: "SenderPostCode",
            header: "Sender PostCode",
            type: "number",
            headerAlign: "center",
            group: "senderDetails",
            minWidth: 170,
            defaultFlex: 1,
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "ReceiverName",
            header: "Receiver Name",
            type: "string",
            group: "receiverDetails",
            headerAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            textAlign: "center",
            filterEditor: StringFilter,
            render: ({ value }) => {
                return isDummyAccount(value);
            },
        },
        {
            name: "ReceiverState",
            header: "Receiver State",
            group: "receiverDetails",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStateOptions,
            },
        },
        {
            name: "ReceiverPostCode",
            header: "Receiver PostCode",
            type: "number",
            headerAlign: "center",
            group: "receiverDetails",
            minWidth: 170,
            defaultFlex: 1,
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "ZoneCode",
            header: "Zone Code",
            type: "string",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "ZoneDescription",
            header: "Zone Description",
            type: "string",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "FtlLtl",
            header: "FTL/LTL",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "TransitTime",
            header: "Transit Time",
            type: "number",
            headerAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "edit",
            header: "Edit",
            headerAlign: "center",
            textAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            render: ({ value, data }) => {
                return (
                    <div>
                        {canEditTransitDays(currentUser) ? (
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
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        setFilteredData(newTransitDays);
    }, [newTransitDays]);
    function handleEditClick(object) {
        setNewTransitDay(object);
        setActiveIndexGTRS(19);
    }

    function AddTransit() {
        setNewTransitDay(null);
        setActiveIndexGTRS(19);
    }

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

        const columnMapping = {
            CustomerName: "Customer Name",
            CustomerType: "Customer Type",
            SenderState: "Sender State",
            SenderPostCode: "Sender PostCode",
            ReceiverName: "Receiver Name",
            ReceiverState: "Receiver State",
            ReceiverState: "Receiver State",
            ReceiverPostCode: "Receiver Postal Code",
            ZoneCode: 'Zone Code',
            ZoneDescription:'Zone Description',
            FtlLtl:'FTL/LTL',
            TransitTime: "Transit Time",
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
            saveAs(blob, "TransitDays-Report.xlsx");
        });
    }
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
            {isFetching ? (
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
                    <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex w-full items-center justify-between mt-2 lg:mt-6">
                                <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                    Transit Days
                                </h1>
                                <div className="flex gap-5">
                                    {canAddNewTransitDays(currentUser) ? (
                                        <GtamButton
                                            name={"Add +"}
                                            onClick={AddTransit}
                                            className="w-[5.5rem] h-[36px]"
                                        />
                                    ) : null}
                                    <Popover className="relative ">
                                        <button onMouseEnter={handleMouseEnter}>
                                            <Popover.Button
                                                className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                                    filteredData?.length === 0
                                                        ? "bg-gray-300 cursor-not-allowed"
                                                        : "bg-gray-800"
                                                } px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
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
                                            <Popover.Panel className="absolute left-20 lg:left-0 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                                <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                    <div className="p-4">
                                                        <div className="mt-2 flex flex-col">
                                                            <label className="">
                                                                <input
                                                                    type="checkbox"
                                                                    name="column"
                                                                    value="CustomerName"
                                                                    className="text-dark focus:ring-goldd rounded "
                                                                />{" "}
                                                                Customer Name
                                                            </label>
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    name="column"
                                                                    value="CustomerType"
                                                                    className="text-dark rounded focus:ring-goldd"
                                                                />{" "}
                                                                Customer Type
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
                                                                    value="SenderPostCode"
                                                                    className="text-dark rounded focus:ring-goldd"
                                                                />{" "}
                                                                Sender PostCode
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
                                                                    value="ReceiverState"
                                                                    className="text-dark rounded focus:ring-goldd"
                                                                />{" "}
                                                                Receiver State
                                                            </label>
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    name="column"
                                                                    value="ReceiverPostCode"
                                                                    className="text-dark rounded focus:ring-goldd"
                                                                />{" "}
                                                                Receiver
                                                                PostCode
                                                            </label>
                                                            <label className="">
                                                                <input
                                                                    type="checkbox"
                                                                    name="column"
                                                                    value="TransitTime"
                                                                    className="text-dark rounded focus:ring-goldd"
                                                                />{" "}
                                                                Transit Time
                                                            </label>
                                                            <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ZoneCode"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Zone Code
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ZoneDescription"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Zone Description
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="FtlLtl"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            FTL/LTL
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
                            id={"TransitId"}
                            setSelected={setSelected}
                            gridRef={gridRef}
                            selected={selected}
                            groupsElements={groups}
                            tableDataElements={newTransitDays}
                            filterValueElements={filterValue}
                            setFilterValueElements={setFilterValue}
                            columnsElements={columns}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
export default NewTransitDays;
