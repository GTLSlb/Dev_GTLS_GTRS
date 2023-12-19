import { useLayoutEffect, useRef, useState } from "react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import notFound from "../../../assets/pictures/NotFound.png";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import ExcelJS from "exceljs";
import { Fragment } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Popover, Transition } from "@headlessui/react";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import BoolFilter from "@inovua/reactdatagrid-community/BoolFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import Button from "@inovua/reactdatagrid-community/packages/Button";
import TableStructure from "@/Components/TableStructure";
import {
    ChevronDownIcon,
    PhoneIcon,
    PlayCircleIcon,
} from "@heroicons/react/20/solid";
import ReactDataGrid from "@inovua/reactdatagrid-community";

const report = [
    {
        ConsignmentId: 275576,
        ConsignmentNo: "FOR100312",
        SenderName: "INDUSTRIAL STEEL",
        ReceiverName: "R AND A CONCRETING",
        FromState: "QLD",
        ToState: "VIC",
        POD: true,
        MatchTransit: false,
        MatchRdd: false,
    },
    // More people...
];
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function NoDelivery({
    NoDelData,
    setNoDelData,
    setActiveIndexGTRS,
    filterValue,
    setFilterValue,
    setLastIndex,
    setactiveCon,
    currentUser,
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
            .get(`${url}/NoDelInfo`, {
                headers: {
                    UserId: currentUser?.UserId,
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
                console.log(err);
            });
    };
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(6);
        setactiveCon(coindex);
    };
    const headers = [
        "Consignment No",
        "Despatch DateTime",
        "Sender Name",
        "Sender Suburb",
        "Sender State",
        "Status",
        "Receiver Name",
        "Receiver Suburb",
        "Receiver State",
        "Timeslot",
        "POD",
        "IsLocal",
        "Delivery Required DateTime",
        "Description",
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
        const data = NoDelData.map((person) =>
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
                        column.replace(/\s+/g, "") === "DespatchDateTime"
                    ) {
                        acc[columnKey] =
                            moment(
                                person["DespatchDateTime"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["DespatchDateTime"].replace(
                                          "T",
                                          " "
                                      ),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (
                        column.replace(/\s+/g, "") ===
                        "DeliveryRequiredDateTime"
                    ) {
                        acc[columnKey] =
                            moment(
                                person["DeliveryRequiredDateTime"].replace(
                                    "T",
                                    " "
                                ),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person[
                                          "DeliveryRequiredDateTime"
                                      ].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
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
            saveAs(blob, "NoDeliveryinfo.xlsx");
        });
    }
    const [selected, setSelected] = useState([]);
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
                        onClick={() => handleClick(data.ConsignmentId)}
                    >
                        {" "}
                        {value}
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
                                                            value="SenderName"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Sender
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
                                                            value="Sender State"
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
                                                            value="Receiver Suburb"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Receiver Suburb
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Receiver State"
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
                                                    {/* <label className="">
                                                                <input
                                                                    type="checkbox"
                                                                    name="column"
                                                                    value="IsLocal"
                                                                    className="text-dark rounded focus:ring-goldd"
                                                                />{" "}
                                                                IsLocal
                                                            </label> */}
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