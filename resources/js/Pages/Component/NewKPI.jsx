import { useState } from "react";
import { useEffect, useRef } from "react";
import moment from "moment";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import { ChevronDownIcon, PencilIcon } from "@heroicons/react/20/solid";
import TableStructure from "@/Components/TableStructure";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import KPIModalAddReason from "./KPI/KPImodal";
import LottieComponent from "@/Components/lottie/LottieComponent";
import Truck from "../../Components/lottie/Data/Truck.json";
import Success from "../../Components/lottie/Data/Success.json";
import { canCalculateNewKPI, canEditNewKPI } from "@/permissions";
import axios from "axios";
import swal from "sweetalert";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import NewKPIModalAddReason from "./KPI/NEWKPIModal";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function NewKPI({
    url,
    userBody,
    currentUser,
    setActiveIndexGTRS,
    setLastIndex,
    setactiveCon,
    filterValue,
    AToken,
    setFilterValue,
    KPIData,
    setKPIData,
    accData,
    kpireasonsData,
}) {
    window.moment = moment;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState();
    const [reason, setReason] = useState();
    useEffect(() => {
        if (KPIData.length == 0) {
            setIsFetching(true);
            fetchData();
        }
    }, []); // Empty dependency array ensures the effect runs only once

    const [reasonOptions, setReasonOptions] = useState([]);
    const [receiverStateOptions, setReceiverStateOptions] = useState([]);
    const [senderStateOptions, setSenderStateOptions] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${url}/KPINew`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            });

            // Convert TransitDays to string
            const modifiedData = response.data.map((item) => ({
                ...item,
                TransitDays: item.TransitDays.toString(),
            }));

            setKPIData(modifiedData);
            setSenderStateOptions(
                createNewLabelObjects(modifiedData, "SenderState")
            );
            setReceiverStateOptions(
                createNewLabelObjects(modifiedData, "ReceiverState")
            );
            setReasonOptions(
                kpireasonsData.map((reason) => ({
                    id: reason.ReasonId,
                    label: reason.ReasonName,
                }))
            );
            setIsFetching(false);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    type: "error",
                    icon: "info",
                    confirmButtonText: "OK",
                }).then(() => {
                    axios
                        .post("/logoutAPI")
                        .then((response) => {
                            if (response.status === 200) {
                                window.location.href = "/";
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                });
            } else {
                console.error(error);
            }
        }
    };

    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(2);
        setactiveCon(coindex);
    };
    const [filteredData, setFilteredData] = useState(
        KPIData.map((item) => {
            if (item?.TransitDays) {
                item.TransitDays = parseInt(item.TransitDays);
            }
            return item;
        })
    );

    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = KPIData?.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeToId);

            return chargeToMatch;
        });
        const filteredKPI = filtered.map((item) => {
            if (item?.TransitDays) {
                item.TransitDays = parseInt(item.TransitDays);
            }
            return item;
        });

        return filteredKPI;
    };
    useEffect(() => {
        setFilteredData(filterData());
        setReceiverStateOptions(
            createNewLabelObjects(filterData(), "ReceiverState")
        );
        setSenderStateOptions(
            createNewLabelObjects(filterData(), "SenderState")
        );
    }, [accData, KPIData]);
    const [selected, setSelected] = useState([]);
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
            ConsignmentNo: "Consignment No",
            SenderName: "Sender Name",
            SenderReference: "Sender Reference",
            SenderState: "Sender State",
            ReceiverName: "Receiver Name",
            ReceiverReference: "Receiver Reference",
            ReceiverState: "Receiver State",
            ReceiverSuburb: "Receiver Suburb",
            ReceiverPostCode: "Receiver Postal Code",
            DispatchDate: "Dispatch Date",
            DeliveryDate: "Delivery Date",
            TransitDays: "Transit Days",
            CalculatedDelDate: "Calculated Delivery Date",
            ReasonId: "Reason",
            MatchDel: "Pass/Fail",
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
            saveAs(blob, "New-KPI-Report.xlsx");
        });
    }

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
    const minDispatchDate = getMinMaxValue(KPIData, "DispatchDate", 1);
    const maxDispatchDate = getMinMaxValue(KPIData, "DispatchDate", 2);
    const minRDDDate = getMinMaxValue(KPIData, "RDD", 1);
    const maxRDDDate = getMinMaxValue(KPIData, "RDD", 2);
    const minDeliveryDate = getMinMaxValue(KPIData, "DeliveryDate", 1);
    const maxDeliveryDate = getMinMaxValue(KPIData, "DeliveryDate", 2);
    const minCalcDate = getMinMaxValue(KPIData, "CalculatedDelDate", 1);
    const maxCalcDate = getMinMaxValue(KPIData, "CalculatedDelDate", 2);
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
    const handleEditClick = (reason) => {
        setReason(reason);
        setIsModalOpen(!isModalOpen);
    };
    const updateLocalData = (id, reason) => {
        // Find the item in the local data with the matching id
        const updatedData = KPIData.map((item) => {
            if (item.ConsignmentId === id) {
                // Update the reason of the matching item
                return { ...item, ReasonId: reason };
            }
            return item;
        });
        setKPIData(updatedData);

        setSenderStateOptions(
            createNewLabelObjects(updatedData, "SenderState")
        );
        setReceiverStateOptions(
            createNewLabelObjects(updatedData, "ReceiverState")
        );
        setReasonOptions(
            kpireasonsData.map((reason) => ({
                id: reason.ReasonId,
                label: reason.ReasonName,
            }))
        );
    };

    const kpiStatusOptions = [
        {
            id: 0,
            label: "N/A",
        },
        {
            id: 1,
            label: "Pass",
        },
        {
            id: 2,
            label: "Fail",
        },
    ];
    const columns = [
        {
            name: "ConsignmentNo",
            headerAlign: "center",
            textAlign: "center",
            header: "Cons No",
            group: "personalInfo",
            filterEditor: StringFilter,
            // filterEditorProps: {
            //     placeholder: "Name",
            //     renderSettings: ({ className }) => filterIcon(className),
            // },
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
            name: "SenderName",
            header: "Name",
            group: "senderDetails",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "SenderReference",
            group: "senderDetails",
            header: "Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "SenderState",
            group: "senderDetails",
            header: "State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStateOptions,
            },
            defaultWidth: 200,
        },
        {
            name: "ReceiverName",
            group: "receiverDetails",
            header: "Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverReference",
            group: "receiverDetails",
            header: "Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverState",
            group: "receiverDetails",
            header: "State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStateOptions,
            },
            defaultWidth: 200,
        },
        {
            name: "ReceiverSuburb",
            group: "receiverDetails",
            header: "Suburb",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverPostCode",
            group: "receiverDetails",
            header: "Post Code",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "DispatchDate",
            header: "Despatch Date",
            defaultFlex: 1,
            minWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDispatchDate,
                maxDate: maxDispatchDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "RDD",
            header: "Required Date",
            defaultFlex: 1,
            minWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minRDDDate,
                maxDate: maxRDDDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "DeliveryDate",
            header: "Delivery Date",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDeliveryDate,
                maxDate: maxDeliveryDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "TransitDays",
            header: "Transit Days",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
            defaultWidth: 200,
        },
        {
            name: "CalculatedDelDate",
            header: "Calculated Delivery Date",
            headerAlign: "center",
            textAlign: "center",
            dateFormat: "DD-MM-YYYY",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minCalcDate,
                maxDate: maxCalcDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY") == "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY");
            },
        },
        {
            name: "MatchDel",
            header: "Pass/Fail",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: kpiStatusOptions,
            },

            render: ({ value }) => {
                return value == 1 ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        Pass
                    </span>
                ) : value == 2 ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        Fail
                    </span>
                ) : null;
            },
        },
        {
            name: "ReasonId",
            header: "Reason",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
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
                            kpireasonsData?.find(
                                (reason) => reason.ReasonId === value
                            )?.ReasonName
                        }
                    </div>
                );
            },
        },
        {
            name: "Edit",
            header: "Edit",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 100,
            render: ({ value, data }) => {
                return (
                    <div>
                        {canEditNewKPI(currentUser) ? (
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
    const [newColumns, setNewColumns] = useState([]);

    useEffect(() => {
        if (canEditNewKPI(currentUser)) {
            setNewColumns(columns);
        } else {
            setNewColumns(newArray);
        }
    }, []);

    useEffect(() => {
        let arr = newColumns.map((item) => {
            if (item?.name === "ReasonId") {
                item.filterEditorProps = {
                    ...item.filterEditorProps,
                    dataSource: reasonOptions,
                };
            }
            if (item?.name == "SenderState") {
                item.filterEditorProps = {
                    ...item.filterEditorProps,
                    dataSource: senderStateOptions,
                };
            }
            if (item?.name == "ReceiverState") {
                item.filterEditorProps = {
                    ...item.filterEditorProps,
                    dataSource: receiverStateOptions,
                };
            }
            return item;
        });
    }, [reasonOptions, receiverStateOptions, senderStateOptions]);

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
    const [statusMessage, setStatusMessage] = useState("");
    const messageDisplayTime = 3000; // Time in milliseconds (3000ms = 3 seconds)
    const clearStatusMessage = () => {
        setStatusMessage("");
    };
    function CalculateKPI() {
        setLoading(true);
        axios
            .get(`${url}KPIReportNew`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
                setStatusMessage("Success!");
                setTimeout(clearStatusMessage, messageDisplayTime);
                setLoading(false);
                fetchData();
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
                    setLoading(false);
                    setTimeout(clearStatusMessage, messageDisplayTime);
                    console.log(err);
                }
            });
    }

    const customFilterTypes = Object.assign({}, ReactDataGrid.defaultProps.filterTypes, {
      number: {
        name: 'number',
        operators: [
          {
            name: 'empty',
            fn: ({ value }) => value == null || value === ''
          },
          {
            name: 'notEmpty',
            fn: ({ value }) => value != null && value !== ''
          },
          {
            name: 'eq',
            fn: ({ value, filterValue }) => value == null || filterValue == null ? true : value == filterValue
          },
          {
            name: 'neq',
            fn: ({ value, filterValue }) => value == null || filterValue == null ? true : value != filterValue
          },
          {
            name: 'gt',
            fn: ({ value, filterValue }) => value > filterValue
          },
          {
            name: 'gte',
            fn: ({ value, filterValue }) => value >= filterValue
          },
          {
            name: 'lt',
            fn: ({ value, filterValue }) => value < filterValue
          },
          {
            name: 'lte',
            fn: ({ value, filterValue }) => value <= filterValue
          },
          {
            name: 'inRange',
            fn: ({ value, filterValue }) => {
              const [min, max] = filterValue.split(':').map(Number);
              return value >= min && value <= max;
            }
          }
        ]
      }
    });

    return (
        <div>
            {/* <Sidebar /> */}
            {isFetching && newColumns && columns ? (
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
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex w-full items-center justify-between mt-2 lg:mt-6">
                            <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                New KPI Report
                            </h1>
                            <div className="object-right flex gap-x-2 md:ml-auto">
                                {statusMessage && (
                                    <LottieComponent
                                        animationData={Success}
                                        loop={false}
                                        autoplay={true}
                                        height={35}
                                        width={35}
                                    />
                                )}
                                {loading && (
                                    <LottieComponent
                                        animationData={Truck}
                                        autoplay={true}
                                        height={35}
                                        width={35}
                                    />
                                )}
                                {canCalculateNewKPI(currentUser) ? (
                                    <button
                                        className={`inline-flex items-center w-[11rem] h-[36px] rounded-md border bg-gray-800 px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                        disabled={
                                            filteredData?.length === 0 ||
                                            loading
                                        }
                                        onClick={() => CalculateKPI()}
                                    >
                                        Calculate New KPI Report
                                    </button>
                                ) : null}
                                <Popover className="relative ">
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
                                                                value="SenderName"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender
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
                                                            Sender State
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ReceiverName"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver
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
                                                                value="DispatchDate"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Despatch Date
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="RDD"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            RDD
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="DeliveryDate"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Delivery Date
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="MatchDel"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Pass / Fail
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
                        gridRef={gridRef}
                        id={"ConsignmentId"}
                        setSelected={setSelected}
                        selected={selected}
                        filterTypesElements={customFilterTypes}
                        groupsElements={groups}
                        tableDataElements={filteredData}
                        filterValueElements={filterValue}
                        setFilterValueElements={setFilterValue}
                        columnsElements={newColumns}
                    />
                </div>
            )}
            <NewKPIModalAddReason
                AToken={AToken}
                url={url}
                isOpen={isModalOpen}
                kpi={reason}
                setReason={setReason}
                handleClose={handleEditClick}
                updateLocalData={updateLocalData}
                kpiReasons={kpireasonsData}
                currentUser={currentUser}
            />
        </div>
    );
}

export default NewKPI;
