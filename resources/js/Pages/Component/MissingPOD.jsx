import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import Button from "@inovua/reactdatagrid-community/packages/Button";
import TableStructure from "@/Components/TableStructure";
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
    function handleDownloadExcel() {
        // Get the selected columns or use all columns if none are selected
        let selectedColumns = Array.from(
            document.querySelectorAll('input[name="column"]:checked')
        ).map((checkbox) => checkbox.value);

        if (selectedColumns.length === 0) {
            selectedColumns = headers; // Use all columns
        }

        // Extract the data for the selected columns
        const data = filteredData.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (person[columnKey] === true) {
                        acc[columnKey] = "true";
                    } else if (person[columnKey] === false) {
                        acc[columnKey] = "false";
                    } else if (column.replace(/\s+/g, "") === "SenderState") {
                        acc[columnKey] = person["SenderState"];
                    } else if (column.toUpperCase() === "ARRIVED DATE TIME") {
                        const ArrivedDateTime = person["ARRIVEDDATETIME"];
                        acc[columnKey] = ArrivedDateTime
                            ? moment(
                                  ArrivedDateTime.replace("T", " "),
                                  "YYYY-MM-DD HH:mm:ss"
                              ).format("DD-MM-YYYY h:mm A")
                            : null;
                    } else if (column.toUpperCase() === "RDD") {
                        const deliveryRequiredDateTime =
                            person["DELIVERYREQUIREDDATETIME"];
                        acc[columnKey] = deliveryRequiredDateTime
                            ? moment(
                                  deliveryRequiredDateTime.replace("T", " "),
                                  "YYYY-MM-DD HH:mm:ss"
                              ).format("DD-MM-YYYY h:mm A")
                            : null;
                    } else if (column.toUpperCase() === "DELIVERED DATETIME") {
                        const deliveredDateTime = person["DELIVEREDDATETIME"];
                        acc[columnKey] = deliveredDateTime
                            ? moment(
                                  deliveredDateTime.replace("T", " "),
                                  "YYYY-MM-DD HH:mm:ss"
                              ).format("DD-MM-YYYY h:mm A")
                            : null;
                    } else if (column.toUpperCase() === "DESPATCH DATETIME") {
                        const despatchDate = person["DESPATCHDATE"];
                        acc[columnKey] = despatchDate
                            ? moment(
                                  despatchDate.replace("T", " "),
                                  "YYYY-MM-DD HH:mm:ss"
                              ).format("DD-MM-YYYY h:mm A")
                            : null;
                    } else if (column === "Consignemnt Number") {
                        acc[columnKey] = person["CONSIGNMENTNUMBER"];
                    } else {
                        acc[columnKey] = person[columnKey.toUpperCase()];
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
                        onClick={() => handleClick(data.ConsignmentId)}
                    >
                        {" "}
                        {value}
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
                                                        value="SENDERZONE"
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
                                                        value="RECEIVERZONE"
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
                            W
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