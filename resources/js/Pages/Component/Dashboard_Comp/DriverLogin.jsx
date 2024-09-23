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
import {
    formatDateToExcel,
    getApiRequest,
    handleSessionExpiration,
} from "@/CommonFunctions";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import ExportPopover from "@/Components/ExportPopover";

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
    async function fetchData() {
        const data = await getApiRequest(`${url}DriverLogin`, {
            UserId: currentUser?.UserId,
        });

        if (data) {
            setDriverData(data);
            setIsFetching(false);
        }
    }
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
    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, DriverData); // Fetch the filtered data

        // Dynamically create column mapping from the `columns` array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers for specific columns
        const customCellHandlers = {
            DespatchDateTime: (value) =>
                value ? formatDateToExcel(value) : "",
            LastActiveUTC: (value) => (value ? formatDateToExcel(value) : ""),
            DeviceSimType: (value, item) =>
                item["MobilityDeviceSimTypes_Description"] || value,
            SmartSCANVersion: (value, item) =>
                item["SmartSCANSoftwareVersion"] || value,
            DeviceModel: (value, item) =>
                item["MobilityDeviceModels_Description"] || value,
            DeviceMakes: (value, item) =>
                item["MobilityDeviceMakes_Description"] || value,
            VLink: (value, item) => item["UsedForVLink"] || value,
            SmartSCANFreight: (value, item) =>
                item["UsedForSmartSCANFreight"] || value,
            SmartSCAN: (value, item) => item["UsedForSmartSCAN"] || value,
        };

        // Call the `exportToExcel` function
        exportToExcel(
            jsonData, // Filtered data
            columnMapping, // Dynamic column mapping from columns
            "Driver-Login.xlsx", // Export file name
            customCellHandlers, // Custom handlers for formatting cells
            ["DespatchDateTime", "LastActiveUTC"]
        );
    };

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
                            <ExportPopover
                                columns={columns}
                                handleDownloadExcel={handleDownloadExcel}
                                filteredData={DriverData}
                            />
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
