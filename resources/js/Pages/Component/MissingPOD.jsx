import { Fragment, useEffect, useState, useRef } from "react";
import moment from "moment";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import TableStructure from "@/Components/TableStructure";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { formatDateToExcel } from "@/CommonFunctions";
import ExportPopover from "@/Components/ExportPopover";
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
    const gridRef = useRef(null);
    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, filteredData); // Fetch the filtered data

        // Dynamically create column mapping from selected columns
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers (e.g., formatting dates)
        const customCellHandlers = {
            DESPATCHDATE: (value) => (value ? formatDateToExcel(value) : ""),
            ARRIVEDDATETIME: (value) => (value ? formatDateToExcel(value) : ""),
            DELIVEREDDATETIME: (value) =>
                value ? formatDateToExcel(value) : "",
            DELIVERYREQUIREDDATETIME: (value) =>
                value ? formatDateToExcel(value) : "",
            POD: (value) => (value ? value : "No POD"), // Example of custom handling for a non-date field
        };

        // Call the exportToExcel function with the data, column mapping, and custom handlers
        exportToExcel(
            jsonData,
            columnMapping,
            "Missing-POD.xlsx", // Filename for the exported Excel file
            customCellHandlers,
            [
                "DESPATCHDATE",
                "ARRIVEDDATETIME",
                "DELIVEREDDATETIME",
                "DELIVERYREQUIREDDATETIME",
                "POD",
            ]
        );
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
    ];

    const senderStates = createNewLabelObjects(falsePodOnly, "SenderState");
    const receiverStates = createNewLabelObjects(falsePodOnly, "RECEIVERSTATE");
    const services = createNewLabelObjects(falsePodOnly, "SERVICE");

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
                        onClick={() => handleClick(data.CONSIGNMNENTID)}
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
    return (
        <div>
            {/* <Sidebar /> */}
            <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex  items-center w-full justify-between mt-6">
                        <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                            Missing POD Report
                        </h1>
                        <ExportPopover
                            columns={columns}
                            handleDownloadExcel={handleDownloadExcel}
                            filteredData={filteredData}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <div className=" w-full bg-smooth ">
                        <TableStructure
                            id={"CONSIGNMNENTID"}
                            setSelected={setSelected}
                            gridRef={gridRef}
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
