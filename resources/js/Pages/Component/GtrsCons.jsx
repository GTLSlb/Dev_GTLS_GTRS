import { useState } from "react";
import "../../../css/reactdatagrid.css";
import TableStructure from "@/Components/TableStructure";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { useEffect, useRef } from "react";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import ExportPopover from "@/Components/ExportPopover";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
export default function GtrsCons({
    setActiveIndexGTRS,
    setactiveCon,
    consData,
    minDate,
    maxDate,
    filterValue,
    setFilterValue,
    setLastIndex,
    accData,
}) {
    window.moment = moment;
    const [filteredData, setFilteredData] = useState(consData);
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(1);
        setactiveCon(coindex);
    };
    const [selected, setSelected] = useState({});

    const gridRef = useRef(null);
    function handleDownloadExcel() {
        const jsonData = handleFilterTable(gridRef, filteredData);

        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        const customCellHandlers = {
            DespatchDate: (value) => {
                const date = new Date(value);
                return !isNaN(date)
                    ? (date.getTime() - date.getTimezoneOffset() * 60000) / 86400000 + 25569 // Excel date serial number
                    : "";
            },
        };
    console.log(columnMapping)
        // Call the exportToExcel function
        exportToExcel(jsonData, columnMapping, "Consignments.xlsx", customCellHandlers,["DespatchDate"]);
    }

    const senderStateOptions = createNewLabelObjects(consData, "SenderState");
    const senderZoneOptions = createNewLabelObjects(consData, "SenderZone");
    const receiverStateOptions = createNewLabelObjects(
        consData,
        "ReceiverState"
    );
    const receiverZoneOptions = createNewLabelObjects(consData, "ReceiverZone");
    const serviceOptions = createNewLabelObjects(consData, "Service");
    const statusOptions = createNewLabelObjects(consData, "Status");

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
    const columns = [
        {
            name: "ConsignmentNo",
            header: "Cons No",
            group: "personalInfo",
            filterEditor: StringFilter,
            headerAlign: "center",
            textAlign: "center",
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
            name: "AccountName",
            header: "Account Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Service",
            header: "Service",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: serviceOptions,
            },
        },
        {
            name: "DespatchDate",
            header: "Despatch date",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
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
            name: "Status",
            header: "Status",
            type: "string",
            defaultWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: statusOptions,
            },
        },
        {
            name: "SenderName",
            header: "Sender Name",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "SenderState",
            header: "Sender State",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStateOptions,
            },
        },
        {
            name: "SenderSuburb",
            header: "Sender Suburb",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "SenderZone",
            header: "Sender Zone",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderZoneOptions,
            },
        },
        {
            name: "SenderReference",
            header: "Sender Reference",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverName",
            header: "Receiver Name",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverState",
            header: "Receiver State",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStateOptions,
            },
        },
        {
            name: "ReceiverSuburb",
            header: "Receiver Suburb",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverZone",
            header: "Receiver Zone",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverZoneOptions,
            },
        },
        {
            name: "POD",
            header: "POD",
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
    ];
    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = consData.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeToID);

            return chargeToMatch;
        });
        return filtered;
    };
    useEffect(() => {
        setFilteredData(filterData());
    }, [accData]);

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Consignments
                    </h1>
                </div>
                <ExportPopover
                    columns={columns}
                    handleDownloadExcel={handleDownloadExcel}
                    filteredData={filteredData}
                />
            </div>
            <TableStructure
                id={"ConsignmentId"}
                setSelected={setSelected}
                gridRef={gridRef}
                selected={selected}
                tableDataElements={filteredData}
                filterValueElements={filterValue}
                setFilterValueElements={setFilterValue}
                groupsElements={groups}
                columnsElements={columns}
            />
        </div>
    );
}
