import TableStructure from "@/Components/TableStructure";
import { getFiltersChartsTable } from "@/Components/utils/filters";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import React from "react";
import { useRef } from "react";
import { useCallback } from "react";
import { useState } from "react";
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

    const [columns] = useState([
        {
            name: "consid",
            header: "Cons ID",
            group: "personalInfo",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
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
            name: "ChargeToId",
            header: "Charge To ID",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            type: "number",
            filterEditor: NumberFilter,
        },
        {
            name: "ReceiverName",
            header: "Receiver Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverState",
            header: "Receiver State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "TotalQuantity",
            header: "Total Quantity",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
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
            name: "TotalPalletSpace",
            header: "Total Pallet Space",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "TotalChep",
            header: "Total Chep",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "TotalLoscam",
            header: "Total Loscam",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "TotalCustomerOwn",
            header: "Total Customer Own",
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
            name: "FuelLevy",
            header: "Fuel Levy",
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
            filterEditor: StringFilter,
        },
        {
            name: "POD",
            header: "POD",
            type: "boolean",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 100,
            filterEditor: StringFilter,
        },
        {
            name: "MatchDel",
            header: "Match Del",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
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
    const renderTable = useCallback(() => {
        return (
            <div className="px-4 sm:px-6 lg:px-0 w-full bg-smooth">
                <TableStructure
                    // handleDownloadExcel={handleDownloadExcel}
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
