import { Fragment, useEffect, useState, useRef } from "react";
import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import TableStructure from "@/Components/TableStructure";
import { forwardRef } from "react";
import { saveAs } from "file-saver";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function DifotReport({
    difotData,
    filterValue,
    setFilterValue,
}) {
    window.moment = moment;

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
    const minDaterdd = getMinMaxValue(difotData, "DeliveryRequiredDateTime", 1);
    const maxDaterdd = getMinMaxValue(difotData, "DeliveryRequiredDateTime", 2);
    const minDateActualDel = getMinMaxValue(difotData, "DeliveredDate", 1);
    const maxDateActualDel = getMinMaxValue(difotData, "DeliveredDate", 2);
    const minDateChangedAt = getMinMaxValue(difotData, "ChangedAt", 1);
    const maxDateChangedAt = getMinMaxValue(difotData, "ChangedAt", 2);

    const falsePodOnly = difotData?.filter(function (entry) {
        return entry.POD === false;
    });

    const [data, setData] = useState(falsePodOnly);

    const gridRef = useRef(null);
    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable();

        const columnMapping = {
            DeliveryNo: "Delivery No",
            PickupDate: "Pickup Date",
            SenderName: "Sender Name",
            SenderSuburb: "Sender Suburb",
            SenderState: "Sender State",
            SenderReference: "Sender Reference",
            CustomerName: "Customer Name",
            CustomerState: "Customer State",
            CustomerPostalCode: "Customer Postal Code",
            CustomerSpaces: "Customer Spaces",
            CustomerPallets: "Customer Pallets",
            PalletsWeight: "Pallets Weight",
            CustomerPO: "Customer PO",
            ReceiverReference: "Receiver Reference",
            Service: "Service",
            DeliveryRequiredDateTime: "RDD",
            NewDeliveryRequiredDateTime: "New RDD",
            Reason: "Reason",
            ReasonDescription: "Reason Description",
            ChangedAt: "ChangedAt",
            RddTime: "Rdd Time",
            NewRddTime: "New RDD ime",
            LTLFTL: "LTL/FTL",
            Status: "Status",
            ActualDeliveryDate: "Actual Delivery Date",
            OnTime: "On Time",
            POD: "POD",
            GTLSError: "GTLS Error",
            DelayReason: "Delay Reason",
            TransportComments: "Transport Comments",
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
        data.forEach((rowData) => {
            const row = worksheet.addRow(Object.values(rowData));

            // Apply date format to the DespatchDateTime column
            const despatchDateIndex =
                newSelectedColumns.indexOf("Despatch DateTime");
            if (despatchDateIndex !== -1) {
                const cell = row.getCell(despatchDateIndex + 1);
                cell.numFmt = "dd-mm-yyyy hh:mm AM/PM";
            }

            // Apply date format to the DeliveryRequiredDateTime column
            const deliveryReqDateIndex = newSelectedColumns.indexOf(
                "Delivery Required DateTime"
            );
            if (deliveryReqDateIndex !== -1) {
                const cell = row.getCell(deliveryReqDateIndex + 1);
                cell.numFmt = "dd-mm-yyyy hh:mm AM/PM";
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
    };
    const [selected, setSelected] = useState([]);

    const groups = [
        {
            name: "senderInfo",
            header: "Sender Details",
            headerAlign: "center",
        },
        {
            name: "customerInfo",
            header: "Customer Details",
            headerAlign: "center",
        },
    ];

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

    const senderStates = createNewLabelObjects(falsePodOnly, "SenderState");
    const receiverStates = createNewLabelObjects(falsePodOnly, "ReceiverState");
    const services = createNewLabelObjects(falsePodOnly, "Service");
    const LTLFTLOptions = createNewLabelObjects(data, "LTLFTL");
    const StatusOptions = createNewLabelObjects(data, "Status");

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
        },
        {
            name: "SenderSuburb",
            header: "Sender Suburb",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            group: "senderInfo",
            filterEditor: StringFilter,
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
            name: "SenderReference",
            header: "Sender Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            group: "senderInfo",
            filterEditor: StringFilter,
        },
        {
            name: "CustomerName",
            header: "Customer Name",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "customerInfo",
        },
        {
            name: "CustomerState",
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
            group: "customerInfo",
        },
        {
            name: "CustomerPostalCode",
            header: "Customer Postal Code",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "customerInfo",
        },
        {
            name: "CustomerSpaces",
            header: "Spaces",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "customerInfo",
        },
        {
            name: "CustomerPallets",
            header: "Pallets",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "customerInfo",
        },
        {
            name: "PalletsWeight",
            header: "Weight",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "customerInfo",
        },
        {
            name: "CustomerPO",
            header: "Customer PO",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "customerInfo",
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
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
            name: "RddTime",
            header: "RDD Time",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: RDDTimeFilter,
        },
        {
            name: "NewDeliveryRequiredDateTime",
            header: "New RDD",
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
            name: "NewRddTime",
            header: "New RDD Time",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: RDDTimeFilter,
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
            name: "ReasonDescription",
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
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
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
        },
        {
            name: "ActualDeliveryDate",
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
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "OnTime",
            header: "OnTime",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            render: ({ value }) => {
                return value ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        YES
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        No
                    </span>
                );
            },
        },
        {
            name: "GTLSError",
            header: "GTLS Error",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            render: ({ value }) => {
                return value ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        YES
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-0.5 text-sm font-medium"></span>
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
                        False
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
        },
        {
            name: "TransportComments",
            header: "Transport Comments",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
    ];
    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);
    const handleMouseEnter = () => {
        if (data.length === 0) {
            setHoverMessage("No Data Found");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 1000);
        }
    };
    return (
        <div>
            <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                <div className="sm:flex sm:items-center">
                                    <div className="sm:flex  items-center w-full justify-between mt-6">
                                        <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                            DIFOT Report
                                        </h1>
                                        <Popover className="relative object-right flex-item md:ml-auto">
                                            <button onMouseEnter={handleMouseEnter}>
                                                <Popover.Button
                                                    className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                                        data.length === 0
                                                            ? "bg-gray-300 cursor-not-allowed"
                                                            : "bg-gray-800"
                                                    } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                                    disabled={data.length === 0}
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
                            id={"ConsignmentID"}
                            handleDownloadExcel={handleDownloadExcel}
                            title={"DIFOT Report"}
                            setSelected={setSelected}
                            gridRef={gridRef}
                            selected={selected}
                            groupsElements={groups}
                            tableDataElements={data}
                            filterValueElements={filterValue}
                            setFilterValueElements={setFilterValue}
                            columnsElements={columns}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
