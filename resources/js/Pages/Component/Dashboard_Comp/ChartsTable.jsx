import { formatDateToExcel } from "@/CommonFunctions";
import TableStructure from "@/Components/TableStructure";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { getFiltersChartsTable } from "@/Components/utils/filters";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function ChartsTable({
    chartsData,
    setShowTable,
    chartFilter,
    setChartFilter,
}) {
    const gridRef = useRef(null);
    const [selected] = useState({});
    const [filtersValue, setFiltersValue] = useState(
        getFiltersChartsTable(chartFilter)
    );

    const navigate = useNavigate();
    const handleClick = (coindex) => {
        navigate("/gtrs/consignment-details", {
            state: { activeCons: coindex },
        });
    };

    const podAvlOptions = [
        {
            id: true,
            label: "True",
        },
        {
            id: false,
            label: "False",
        },
    ];

    const DebtorNamesOptions = createNewLabelObjects(chartsData, "DebtorName");
    const ConsStatusOptions = createNewLabelObjects(chartsData, "ConsStatus");
    const ReceiverNamesOptions = createNewLabelObjects(
        chartsData,
        "ReceiverName"
    );
    const ReceiverStatesOptions = createNewLabelObjects(
        chartsData,
        "ReceiverState"
    );

    const SenderNamesOptions = createNewLabelObjects(chartsData, "SenderName");
    const SenderStatesOptions = createNewLabelObjects(
        chartsData,
        "SenderState"
    );

    const [columns] = useState([
        {
            name: "ConsignmentNo",
            header: "Consignment Number",
            group: "personalInfo",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 hover:cursor-pointer"
                        onClick={() => handleClick(data.consid)}
                    >
                        {" "}
                        {value}
                    </span>
                );
            },
        },
        {
            name: "DebtorName",
            header: "Debtor Name",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: DebtorNamesOptions,
            },
        },
        {
            name: "ReceiverName",
            header: "Receiver Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: ReceiverNamesOptions,
            },
        },
        {
            name: "ReceiverState",
            header: "Receiver State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: ReceiverStatesOptions,
            },
        },
        {
            name: "SenderName",
            header: "Sender Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: SenderNamesOptions,
            },
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
                dataSource: SenderStatesOptions,
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
            filterable: true,
            filterEditor: DateFilter,
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "TottalWeight",
            header: "Total Weight",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "NetAmount",
            header: "Net Amount",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "ConsStatus",
            header: "Consignment Status",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: ConsStatusOptions,
            },
            render: ({ value, data }) => {
                return (
                    <div>
                        {value == "PASS" ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                Pass
                            </span>
                        ) : value == "FAIL" ? (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                Fail
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800">
                                Pending
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            name: "POD",
            header: "POD",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: podAvlOptions,
            },
            render: ({ value, data }) => {
                return (
                    <div>
                        {data?.POD ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                True
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                false
                            </span>
                        )}
                    </div>
                );
            },
        },
    ]);

    const showCharts = () => {
        setChartFilter(getFiltersChartsTable());
        setShowTable(false);
    };

    const backButton = () => {
        return (
            <button
                className={`flex gap-2 items-center w-auto h-[36px] rounded-md  border bg-gray-800 px-4 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-none`}
                onClick={showCharts}
            >
                <ChevronLeftIcon className="h-4 w-4" /> Back
            </button>
        );
    };

    function handleDownloadExcel() {
        const jsonData = handleFilterTable(gridRef, chartsData);

        // Dynamically create column mapping from the `columns` array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers
        const customCellHandlers = {
            DespatchDate: (value) => formatDateToExcel(value),
        };

        // Call the `exportToExcel` function
        exportToExcel(
            jsonData, // Filtered data
            columnMapping, // Dynamic column mapping from columns
            "Dashboard-Data.xlsx", // Export file name
            customCellHandlers, // Custom handlers for formatting cells
            ["DespatchDate"]
        );
    }

    const renderTable = useCallback(() => {
        return (
            <div className="px-4 sm:px-6 lg:px-0 w-full bg-smooth">
                <TableStructure
                    handleDownloadExcel={handleDownloadExcel}
                    title={backButton()}
                    id={"ConsignmentId"}
                    // setSelected={setSelected}
                    gridRef={gridRef}
                    selected={selected}
                    tableDataElements={chartsData}
                    filterValueElements={filtersValue}
                    setFilterValueElements={setFiltersValue}
                    columnsElements={columns}
                />
            </div>
        );
    }, [columns, filtersValue, chartsData]);

    return renderTable();
}

export default ChartsTable;
