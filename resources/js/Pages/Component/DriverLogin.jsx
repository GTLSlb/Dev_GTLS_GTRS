import { useRef, useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import TableStructure from "@/Components/TableStructure";
import { formatDateToExcel, getApiRequest } from "@/CommonFunctions";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import AnimatedLoading from "@/Components/AnimatedLoading";

export default function DriverLogin({
    DriverData,
    setDriverData,
    filterValue,
    setFilterValue,
    url,
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

    return (
        <div>
            {/* <Sidebar /> */}
            {isFetching && <AnimatedLoading />}
            {!isFetching && (
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <TableStructure
                        id={"MobilityDeviceID"}
                        gridRef={gridRef}
                        setSelected={setSelected}
                        handleDownloadExcel={handleDownloadExcel}
                        title={"Driver Login"}
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