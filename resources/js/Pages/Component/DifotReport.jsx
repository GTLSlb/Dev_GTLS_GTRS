import {
    Fragment,
    useEffect,
    useState,
    useRef,
    useImperativeHandle,
    useContext,
} from "react";
import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import TableStructure from "@/Components/TableStructure";
import { forwardRef } from "react";
import ExcelJS from "exceljs";
import swal from "sweetalert";
import { saveAs } from "file-saver";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { formatDateToExcel, handleSessionExpiration } from "@/CommonFunctions";
import { CustomContext } from "@/CommonContext";

function parseDateString(dateString) {
    // Check if it's a full datetime with time part
    if (dateString.includes("AM") || dateString.includes("PM")) {
        // Let JavaScript parse it directly
        return new Date(dateString);
    }

    // Handle format like "25/07/2025"
    const [day, month, year] = dateString.split("/");
    return new Date(year, month - 1, day); // month is 0-indexed
}

export default function DifotReport({
    // difotData,
    filterValue,
    setFilterValue,
    // fetchData,
    accData,
}) {
    const { url, Token, currentUser } = useContext(CustomContext);
    const [filteredData, setFilteredData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [difotData, setDifotData] = useState([]);
    useEffect(() => {
        fetchDifotReportData();
    }, []);
    const fetchDifotReportData = async (setCellLoading) => {
        try {
            const res = await axios.get(`${url}Difot/Report`, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            });
            if (res.data == "" || res.data == []) {
                setDifotData([]);
            } else {
                setDifotData(
                    res?.data?.map((item) => {
                        return {
                            ...item,
                            Spaces: item?.Spaces?.toString(),
                            Pallets: item?.Pallets?.toString(),
                            Weight: item?.Weight?.toString(),
                        };
                    }) || []
                );
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Handle 401 error using SweetAlert
                swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    type: "success",
                    icon: "info",
                    confirmButtonText: "OK",
                }).then(async function () {
                    await handleSessionExpiration();
                });
            } else {
                // Handle other errors
                console.log(err);
                // Check if setCellLoading exists before calling it
                if (typeof setCellLoading === "function") {
                    setCellLoading(null);
                }
            }
        }
    };

    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = difotData.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeToID);

            return chargeToMatch;
        });
        return filtered;
    };
    useEffect(() => {
        if (difotData) {
            const filtered = filterData();
            setFilteredData(filtered);
        }
    }, [difotData, accData]);

    useEffect(() => {
        if (filteredData != null && filteredData.length > 0) {
            setIsLoading(false);
        }
    }, [filteredData]);

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

    const minDatePickup = getMinMaxValue(difotData, "DespatchDate", 1);
    const maxDatePickup = getMinMaxValue(difotData, "DespatchDate", 2);
    const minDateRdd = getMinMaxValue(difotData, "RDD", 1);
    const maxDateRdd = getMinMaxValue(difotData, "RDD", 2);
    const minDateOldRdd = getMinMaxValue(difotData, "OldRdd", 1);
    const maxDateOldRdd = getMinMaxValue(difotData, "OldRdd", 2);
    const minDateNewRdd = getMinMaxValue(difotData, "NewRdd", 1);
    const maxDateNewRdd = getMinMaxValue(difotData, "NewRdd", 2);
    const minDateActualDel = getMinMaxValue(difotData, "ActualDeliveyDate", 1);
    const maxDateActualDel = getMinMaxValue(difotData, "ActualDeliveyDate", 2);
    const minDateChangedAt = getMinMaxValue(difotData, "ChangedAt", 1);
    const maxDateChangedAt = getMinMaxValue(difotData, "ChangedAt", 2);
    const gridRef = useRef(null);

    const RDDTimeFilter = forwardRef(({ filterValue, onChange }, ref) => {
        const [value, setValue] = useState(
            filterValue ? filterValue.value : ""
        );

        const handleChange = (event) => {
            const newValue = event.target.value + ":00";
            setValue(newValue);
            onChange({
                name: "RddTime",
                value: newValue,
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        const handleClear = () => {
            setValue("");
            onChange({
                name: "RddTime",
                value: "",
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        useEffect(() => {
            setValue(filterValue ? filterValue.value : "");
        }, [filterValue]);

        useImperativeHandle(ref, () => ({
            setValue: (newValue) => {
                setValue(newValue);
            },
        }));

        return (
            <div className="flex gap-2 mx-1">
                <input
                    type="time"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm"
                    value={value.slice(0, 5)}
                    onChange={handleChange}
                />
                <button onClick={handleClear}>
                    <svg
                        tabIndex="0"
                        className="InovuaReactDataGrid__column-header__filter-settings-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                    >
                        <path
                            fillRule="evenodd"
                            d="M13.222 2H.778C.348 2 0 1.552 0 1s.348-1 .778-1h12.444c.43 0 .778.448.778 1s-.348 1-.778 1zM1.556 3.111l3.888 4.667v5.444c0 .43.349.778.778.778h1.556c.43 0 .778-.348.778-.778V7.778l3.888-4.667H1.556z"
                        ></path>
                    </svg>
                </button>
            </div>
        );
    });

    const NewRDDTimeFilter = forwardRef(({ filterValue, onChange }, ref) => {
        const [value, setValue] = useState(
            filterValue ? filterValue.value : ""
        );

        const handleChange = (event) => {
            const newValue = event.target.value + ":00";
            setValue(newValue);
            onChange({
                name: "NewRddTime",
                value: newValue,
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        const handleClear = () => {
            setValue("");
            onChange({
                name: "NewRddTime",
                value: "",
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        useEffect(() => {
            setValue(filterValue ? filterValue.value : "");
        }, [filterValue]);

        useImperativeHandle(ref, () => ({
            setValue: (newValue) => {
                setValue(newValue);
            },
        }));

        return (
            <div className="flex gap-2 mx-1">
                <input
                    type="time"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm"
                    value={value.slice(0, 5)}
                    onChange={handleChange}
                />
                <button onClick={handleClear}>
                    <svg
                        tabIndex="0"
                        className="InovuaReactDataGrid__column-header__filter-settings-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                    >
                        <path
                            fillRule="evenodd"
                            d="M13.222 2H.778C.348 2 0 1.552 0 1s.348-1 .778-1h12.444c.43 0 .778.448.778 1s-.348 1-.778 1zM1.556 3.111l3.888 4.667v5.444c0 .43.349.778.778.778h1.556c.43 0 .778-.348.778-.778V7.778l3.888-4.667H1.556z"
                        ></path>
                    </svg>
                </button>
            </div>
        );
    });
    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, difotData);
        const columnMapping = {
            DeliveryNo: "Delivery No",
            PickupDate: "Pickup Date",
            SenderName: "Sender Name",
            SenderSuburb: "Sender Suburb",
            SenderState: "Sender State",
            SenderReference: "Sender Reference",
            CustomerName: "Customer Name",
            Spaces: "Spaces",
            Pallets: "Pallets",
            Weight: "Weight",
            CustomerPO: "Customer PO",
            ReceiverPostCode: "Receiver Post Code",
            ReceiverState: "Receiver State",
            ReceiverReference: "Receiver Reference",
            Service: "Service",
            RDD: "RDD",
            OldRdd: "Old RDD",
            NewRdd: "New RDD",
            RddTime: "RDD Time",
            NewRddTime: "New RDD Time",
            Reason: "Reason",
            ReasonDesc: "Reason Description",
            ChangedAt: "ChangedAt",
            DeliveryComment: "Delivery Comment",
            LTLFTL: "LTL/FTL",
            ActualDeliveyDate: "Actual Delivery Date",
            OnTime: "On Time",
            GtlsError: "GTLS Error",
            Status: "Status",
            POD: "POD",
            DelayReason: "Delay Reason",
            TransportComment: "Transport Comments",
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
                    if (
                        [
                            "OldRdd",
                            "ActualDeliveyDate",
                            "PickupDate",
                            "NewRdd",
                            "ChangedAt",
                            "RDD",
                        ].includes(columnKey)
                    ) {
                        const rawDate = person[columnKey];

                        // Step 1: Standardize the date string to DD-MM-YYYY using moment
                        const dateValue =
                            rawDate == null
                                ? ""
                                : moment(rawDate.replace(/\//g, "-"), [
                                      "D-M-YYYY hh:mm:ss A",
                                      "D-M-YYYY hh:mm A",
                                      "D-M-YYYY",
                                      moment.ISO_8601,
                                  ]).isValid()
                                ? moment(rawDate.replace(/\//g, "-"), [
                                      "D-M-YYYY hh:mm:ss A",
                                      "D-M-YYYY hh:mm A",
                                      "D-M-YYYY",
                                      moment.ISO_8601,
                                  ]).format("DD-MM-YYYY")
                                : "";

                        // Step 2: Parse "DD-MM-YYYY" into a Date object
                        let parsedDate = null;
                        if (dateValue) {
                            const [day, month, year] = dateValue.split("-");
                            parsedDate = new Date(
                                parseInt(year),
                                parseInt(month) - 1,
                                parseInt(day)
                            );
                        }

                        // Step 3: Convert to Excel serial number if valid
                        if (parsedDate && !isNaN(parsedDate.getTime())) {
                            parsedDate = formatDateToExcel(parsedDate);
                            // console.log(parsedDate);
                            acc[columnKey] = parsedDate;
                        } else {
                            acc[columnKey] = "";
                        }
                    } else if (["OldRdd"].includes(columnKey)) {
                        const rawDate = person[columnKey];
                        const parsed = moment(
                            rawDate,
                            [
                                "D/M/YYYY hh:mm:ss A",
                                "D-M-YYYY hh:mm:ss A",
                                "D/M/YYYY hh:mm A",
                                "D-M-YYYY hh:mm A",
                                "D/M/YYYY",
                                "D-M-YYYY",
                                moment.ISO_8601,
                            ] // no strict mode
                        ); // true = strict parsing

                        acc[columnKey] = parsed.isValid()
                            ? parsed.format("DD-MM-YYYY")
                            : "";
                    } else if (["NewRdd"].includes(columnKey)) {
                        acc[columnKey] = person[columnKey]?.replace(/\//g, "-");
                        //value.replace(/\//g, '-')
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

            // Apply date format to the DespatchDateTime column
            const despatchDateIndex = newSelectedColumns.indexOf("Pickup Date");
            if (despatchDateIndex !== -1) {
                const cell = row.getCell(despatchDateIndex + 1);
                cell.numFmt = "dd-mm-yyyy";
            }

            const OldRddIndex = newSelectedColumns.indexOf("Old RDD");
            // console.log("OldRddIndex", OldRddIndex);
            if (OldRddIndex !== -1) {
                const cell = row.getCell(OldRddIndex + 1);
                cell.numFmt = "dd-mm-yyyy";
            }

            const NewRDDIndex = newSelectedColumns.indexOf("New RDD");
            if (NewRDDIndex !== -1) {
                const cell = row.getCell(NewRDDIndex + 1);
                cell.numFmt = "dd-mm-yyyy";
            }

            const ChangedAtIndex = newSelectedColumns.indexOf("ChangedAt");
            if (ChangedAtIndex !== -1) {
                const cell = row.getCell(ChangedAtIndex + 1);
                cell.numFmt = "dd-mm-yyyy hh:mm AM/PM";
            }

            const ActualDeliveryDateIndex = newSelectedColumns.indexOf(
                "Actual Delivery Date"
            );
            if (ActualDeliveryDateIndex !== -1) {
                const cell = row.getCell(ActualDeliveryDateIndex + 1);
                cell.numFmt = "dd-mm-yyyy";
            }

            // Apply date format to the DeliveryRequiredDateTime column
            const deliveryReqDateIndex = newSelectedColumns.indexOf("RDD");
            if (deliveryReqDateIndex !== -1) {
                const cell = row.getCell(deliveryReqDateIndex + 1);
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
            saveAs(blob, "DifotReport.xlsx");
        });
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
        {
            name: "customerInfo",
            header: "Customer Details",
            headerAlign: "center",
        },
    ];

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
                    id: fieldValue?.toString(),
                    label: fieldValue?.toString(),
                };
                fieldValue == undefined ? null : newData.push(newObject);
            }
        });
        return newData;
    };

    const senderStates = createNewLabelObjects(difotData, "SenderState");
    const receiverStates = createNewLabelObjects(difotData, "ReceiverState");
    const services = createNewLabelObjects(difotData, "Service");
    const LTLFTLOptions = createNewLabelObjects(difotData, "LTLFTL");
    const StatusOptions = createNewLabelObjects(difotData, "OnTime");
    const GtlsErrorOptions = createNewLabelObjects(difotData, "GtlsError");
    const PODOptions = createNewLabelObjects(difotData, "POD");

    const columns = [
        {
            name: "DeliveryNo",
            header: "Delivery No",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "DebtorName",
            header: "Account name",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "PickupDate",
            header: "Pickup Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDatePickup,
                maxDate: maxDatePickup,
            },
            render: ({ value, cellProps }) => {
                return value == undefined || value == null
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A") ==
                      "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY");
            },
        },
        {
            name: "SenderName",
            header: "Name",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "senderInfo",
        },
        {
            name: "SenderSuburb",
            header: "Suburb",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            group: "senderInfo",
            filterEditor: StringFilter,
        },
        {
            name: "SenderState",
            header: "State",
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
            name: "CustomerName",
            header: "Customer Name",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverState",
            header: "State",
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
        },
        {
            name: "ReceiverPostCode",
            header: "Post Code",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Spaces",
            header: "Spaces",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Pallets",
            header: "Pallets",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Weight",
            header: "Weight",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "CustomerPO",
            header: "Customer PO",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "SenderReference",
            header: "Sender Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            render: ({ value }) => {
                return (
                    <span className="flex justify-start items-left text-left">
                        {value}
                    </span>
                );
            },
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Service",
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
            name: "RDD",
            header: "RDD",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDateRdd,
                maxDate: maxDateRdd,
            },
            render: ({ value, cellProps }) => {
                return (cellProps.data?.hasOwnProperty("RDD") &&
                    value == undefined) ||
                    value == null
                    ? ""
                    : cellProps.data?.hasOwnProperty("RDD") &&
                      moment(value).format("DD-MM-YYYY hh:mm A") ==
                          "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY");
            },
        },
        {
            name: "RddTime",
            header: "RDD Time",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: RDDTimeFilter,
        },
        {
            name: "OldRdd",
            header: "Old RDD",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDateOldRdd,
                maxDate: maxDateOldRdd,
            },
            render: ({ value, cellProps }) => {
                const dateValue =
                    value == null
                        ? ""
                        : moment(
                              value.replace(/\//g, "-"),
                              [
                                  "D-M-YYYY hh:mm:ss A",
                                  "D-M-YYYY hh:mm A",
                                  "D-M-YYYY",
                                  moment.ISO_8601,
                              ] // No `true` → non-strict parsing
                          ).isValid()
                        ? moment(value.replace(/\//g, "-"), [
                              "D-M-YYYY hh:mm:ss A",
                              "D-M-YYYY hh:mm A",
                              "D-M-YYYY",
                              moment.ISO_8601,
                          ]).format("DD-MM-YYYY")
                        : "";
                return (
                    <span className="flex justify-center items-center text-left">
                        {dateValue}
                    </span>
                );
            },
        },
        {
            name: "NewRdd",
            header: "New RDD",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDateNewRdd,
                maxDate: maxDateNewRdd,
            },
            render: ({ value, cellProps }) => {
                return value == undefined || value == null
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A") ==
                      "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY");
            },
        },
        {
            name: "NewRddTime",
            header: "New RDD Time",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NewRDDTimeFilter,
        },
        {
            name: "Reason",
            header: "Reason",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ReasonDesc",
            header: "Reason Description",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ChangedAt",
            header: "Changed At",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDateChangedAt,
                maxDate: maxDateChangedAt,
            },
            render: ({ value, cellProps }) => {
                return value == undefined || value == null
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A") ==
                      "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "DeliveryComment",
            header: "Delivery Comment",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "LTLFTL",
            header: "LTL/FTL",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: LTLFTLOptions,
            },
        },
        {
            name: "Status",
            header: "Status",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ActualDeliveyDate",
            header: "Actual Delivery Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDateActualDel,
                maxDate: maxDateActualDel,
            },
            render: ({ value, cellProps }) => {
                return value == undefined || value == null
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A") ==
                      "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY");
            },
        },
        {
            name: "OnTime",
            header: "On Time",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: StatusOptions,
            },
            render: ({ value }) => {
                return value?.toLowerCase() == "yes" ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        {value}
                    </span>
                ) : value?.toLowerCase() == "no" ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        {value}
                    </span>
                ) : value?.toLowerCase() == "pending" ? (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
                        {value}
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-0.5 text-sm">
                        {value ? value : ""}
                    </span>
                );
            },
        },
        {
            name: "GtlsError",
            header: "GTLS Error",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: GtlsErrorOptions,
            },
            render: ({ value }) => {
                return value?.toLowerCase() == "yes" ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        {value}
                    </span>
                ) : value?.toLowerCase() == "no" ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        {value}
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-0.5 text-sm">
                        {value ? value : ""}
                    </span>
                );
            },
        },
        {
            name: "DelayReason",
            header: "Delay Reason",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            render: ({ value }) => {
                return (
                    <span className="flex justify-start items-left text-left">
                        {value}
                    </span>
                );
            },
        },
        {
            name: "DelayDescription",
            header: "Delay Description",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Explanation",
            header: "Explanation",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Resolution",
            header: "Resolution",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "POD",
            header: "POD",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: PODOptions,
            },
            render: ({ value }) => {
                return value == true ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        {value?.toString()}
                    </span>
                ) : value == false ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        {value?.toString()}
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-0.5 text-sm">
                        {value ? value.toString() : ""}
                    </span>
                );
            },
        },
    ];

    return (
        <div>
            <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20 h-full">
                <div className="mt-4 h-full">
                    {isLoading ? (
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
                        <div className=" w-full bg-smooth h-full">
                            <TableStructure
                                id={"ConsignmentID"}
                                handleDownloadExcel={handleDownloadExcel}
                                title={"DIFOT Report"}
                                setSelected={setSelected}
                                gridRef={gridRef}
                                selected={selected}
                                groupsElements={groups}
                                tableDataElements={filteredData}
                                filterValueElements={filterValue}
                                setFilteredData={setFilteredData}
                                setFilterValueElements={setFilterValue}
                                columnsElements={columns}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}