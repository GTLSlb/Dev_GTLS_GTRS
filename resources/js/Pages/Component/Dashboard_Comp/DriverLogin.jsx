import { useLayoutEffect, useRef, useState } from "react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { Fragment } from "react";
import notFound from "../../../assets/pictures/NotFound.png";
import ExcelJS from "exceljs";
import moment from "moment";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import BoolFilter from "@inovua/reactdatagrid-community/BoolFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import Button from "@inovua/reactdatagrid-community/packages/Button";
import TableStructure from "@/Components/TableStructure";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import swal from 'sweetalert';
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
                    title: 'Session Expired!',
                    text: "Please login again",
                    type: 'success',
                    icon: "info",
                    confirmButtonText: 'OK'
                  }).then(function() {
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
    function handleDownloadExcel() {
        // Get the selected columns or use all columns if none are selected
        let selectedColumns = Array.from(
            document.querySelectorAll('input[name="column"]:checked')
        ).map((checkbox) => checkbox.value);

        if (selectedColumns.length === 0) {
            selectedColumns = headers; // Use all columns
        }

        // Extract the data for the selected columns
        const data = DriverData.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");

                if (columnKey) {
                    if (columnKey === "DeviceSimType") {
                        acc[columnKey] =
                            person["MobilityDeviceSimTypes_Description"];
                    } else if (columnKey === "SmartSCANVersion") {
                        acc[columnKey] = person["SmartSCANSoftwareVersion"];
                    } else if (columnKey === "DeviceModel") {
                        acc[columnKey] =
                            person["MobilityDeviceModels_Description"];
                    } else if (columnKey === "LastActiveUTC") {
                        acc[columnKey] =
                            person["LastActiveUTC"] == ""
                                ? ""
                                : moment(
                                      person["LastActiveUTC"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (columnKey === "DeviceMakes") {
                        acc[columnKey] =
                            person["MobilityDeviceMakes_Description"];
                    } else if (columnKey === "VLink") {
                        acc[columnKey] = person["UsedForVLink"];
                    } else if (columnKey === "SmartSCANFreight") {
                        acc[columnKey] = person["UsedForSmartSCANFreight"];
                    } else if (columnKey === "SmartSCAN") {
                        acc[columnKey] = person["UsedForSmartSCAN"];
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
                                                            value="Smart SCAN"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Smart SCAN
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Smart SCAN Freight"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Smart SCAN Freight
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Smart SCAN Version"
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
                                                            value="VLink"
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
                                                            value="Device Sim Type"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Device Sim Type
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Device Model"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Device Model
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Device Makes"
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