import AddModel from "./AddModel";
import { useDisclosure } from "@heroui/react";
import { formatDate, formatDateToExcel } from "@/CommonFunctions";
import TableStructure from "@/Components/TableStructure";
import React, {
    useCallback,
    useRef,
    useState,
    useMemo,
    useEffect,
} from "react";
import { dummySpendData } from "../assets/js/dataHandler";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { getSpendAnalysisTable } from "@/Components/utils/filters";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";

function CostTable({ filters }) {
    const gridRef = useRef(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Use imported data and add computed fields
    const chartsData = useMemo(
        () =>
            dummySpendData.map((item, index) => ({
                ...item,
                id: index + 1, // Add unique ID for table
                totalCost:
                    item.cost +
                    item.additional +
                    item.fuelLevy +
                    item.GST +
                    item.demurrageCost,
                totalAdditionalCharges:
                    item.additionalCost?.reduce(
                        (sum, charge) => sum + charge.cost,
                        0
                    ) || 0,
                formattedDate: new Date(item.date).toLocaleDateString(),
                monthYear: new Date(item.date).toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                }),
            })),
        []
    );

    const [filteredData, setFilteredData] = useState(chartsData);
    const [filtersValue, setFiltersValue] = useState(() =>
        getSpendAnalysisTable()
    );
    const [selectedRow, setSelectedRow] = useState(null);

    // Memoize filter options
    const filterOptions = useMemo(
        () => ({
            state: createNewLabelObjects(chartsData, "state"),
            receiver: createNewLabelObjects(chartsData, "receiver"),
            demurrageType: createNewLabelObjects(chartsData, "demurrageType"),
            serviceType: createNewLabelObjects(chartsData, "serviceType"),
            monthYear: createNewLabelObjects(chartsData, "monthYear"),
        }),
        [chartsData]
    );

    console.log(dummySpendData);
    // Updated columns for new data structure
    const columns = useMemo(
        () => [
            {
                name: "formattedDate",
                header: "Date",
                headerAlign: "center",
                textAlign: "center",
                defaultFlex: 1,
                minWidth: 200,
                dateFormat: "DD-MM-YYYY",
                filterable: true,
                filterEditor: DateFilter,
                render: ({ value }) => {
                    return value;
                },
            },
            {
                name: "receiver",
                header: "Receiver",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: SelectFilter,
                filterEditorProps: {
                    multiple: true,
                    wrapMultiple: false,
                    dataSource: filterOptions.receiver,
                },
            },
            {
                name: "state",
                header: "State",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: SelectFilter,
                filterEditorProps: {
                    multiple: true,
                    wrapMultiple: false,
                    dataSource: filterOptions.state,
                },
                render: ({ value }) => value?.toUpperCase() || "",
            },
            {
                name: "serviceType",
                header: "Service Type",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: SelectFilter,
                filterEditorProps: {
                    multiple: true,
                    wrapMultiple: false,
                    dataSource: filterOptions.serviceType,
                },
            },
            {
                name: "cost",
                header: "Base Cost",
                type: "number",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: NumberFilter,
                render: ({ value }) => `$${value?.toLocaleString() || "0"}`,
            },
            {
                name: "additional",
                header: "Additional Charges",
                type: "number",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: NumberFilter,
                render: ({ value, data }) => (
                    <div
                        onClick={() => {
                            setSelectedRow(data);
                            onOpen();
                        }}
                        className="text-blue-400 underline hover:cursor-pointer hover:text-blue-600"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setSelectedRow(data);
                                onOpen();
                            }
                        }}
                    >
                        ${value?.toLocaleString() || "0"}
                    </div>
                ),
            },
            {
                name: "fuelLevy",
                header: "Fuel Levy",
                type: "number",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: NumberFilter,
                render: ({ value }) => `$${value?.toLocaleString() || "0"}`,
            },
            {
                name: "GST",
                header: "GST",
                type: "number",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: NumberFilter,
                render: ({ value }) => `$${value?.toLocaleString() || "0"}`,
            },
            {
                name: "demurrageType",
                header: "Demurrage Type",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: SelectFilter,
                filterEditorProps: {
                    multiple: true,
                    wrapMultiple: false,
                    dataSource: filterOptions.demurrageType,
                },
            },
            {
                name: "demurrageCost",
                header: "Demurrage Cost",
                type: "number",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: NumberFilter,
                render: ({ value }) => `$${value?.toLocaleString() || "0"}`,
            },
            {
                name: "weight",
                header: "Weight (kg)",
                type: "number",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: NumberFilter,
                render: ({ value }) => `${value || 0} kg`,
            },
            {
                name: "palletSpace",
                header: "Pallet Spaces",
                type: "number",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: NumberFilter,
            },
            {
                name: "totalAdditionalCharges",
                header: "Total Additional",
                type: "number",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: NumberFilter,
                render: ({ value }) => `$${value?.toLocaleString() || "0"}`,
            },
            {
                name: "totalCost",
                header: "Total Cost",
                type: "number",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 170,
                filterEditor: NumberFilter,
                render: ({ value }) => (
                    <div className="font-semibold text-green-600">
                        ${value?.toLocaleString() || "0"}
                    </div>
                ),
            },
        ],
        [filterOptions, onOpen]
    );

    // Enhanced filtering effect for new data structure
    useEffect(() => {
        if (!filters) {
            setFilteredData(chartsData);
            return;
        }

        const filtered = chartsData.filter((item) => {
            const itemDate = new Date(item.date);
            const monthAbbreviation = itemDate.toLocaleString("default", {
                month: "short",
            });
            const year = itemDate.getFullYear();

            return (
                (!filters.service || item.serviceType === filters.service) &&
                (!filters.date ||
                    monthAbbreviation === filters.date ||
                    item.monthYear === filters.date ||
                    year.toString() === filters.date) &&
                (!filters.state || item.state === filters.state) &&
                (!filters.receiver || item.receiver === filters.receiver) &&
                (!filters.demurrageType ||
                    item.demurrageType === filters.demurrageType)
            );
        });

        setFilteredData(filtered);
    }, [filters, chartsData]);

    // Enhanced download handler
    const handleDownloadExcel = useCallback(() => {
        const jsonData = handleFilterTable(gridRef, filteredData);

        // Process data to flatten additionalCost array for Excel
        const processedData = jsonData.map((item) => ({
            ...item,
            additionalCostDetails:
                item.additionalCost
                    ?.map((cost) => `${cost.name}: $${cost.cost}`)
                    .join("; ") || "",
            coordinates: `${item.receiverLat}, ${item.receiverLng}`,
        }));

        // Dynamic column mapping
        const columnMapping = {
            date: "Date",
            receiver: "Receiver",
            state: "State",
            serviceType: "Service Type",
            cost: "Base Cost",
            additional: "Additional Charges",
            fuelLevy: "Fuel Levy",
            GST: "GST",
            demurrageType: "Demurrage Type",
            demurrageCost: "Demurrage Cost",
            weight: "Weight (kg)",
            palletSpace: "Pallet Spaces",
            totalAdditionalCharges: "Total Additional Charges",
            totalCost: "Total Cost",
            additionalCostDetails: "Additional Cost Breakdown",
            coordinates: "Receiver Coordinates",
        };

        // Custom cell handlers
        const customCellHandlers = {
            date: (value) => formatDateToExcel(value),
            cost: (value) => Number(value),
            additional: (value) => Number(value),
            fuelLevy: (value) => Number(value),
            GST: (value) => Number(value),
            demurrageCost: (value) => Number(value),
            totalCost: (value) => Number(value),
            totalAdditionalCharges: (value) => Number(value),
            weight: (value) => Number(value),
            palletSpace: (value) => Number(value),
        };

        exportToExcel(
            processedData,
            columnMapping,
            "Spend-Analysis-Data.xlsx",
            customCellHandlers,
            [
                "date",
                "cost",
                "additional",
                "fuelLevy",
                "GST",
                "demurrageCost",
                "totalCost",
            ]
        );
    }, [gridRef, filteredData]);

    // Render table with enhanced layout
    const renderTable = useCallback(
        () => (
            <div className="px-4 sm:px-6 lg:px-0 w-full bg-smooth">
                <TableStructure
                    handleDownloadExcel={handleDownloadExcel}
                    id="id"
                    minHeight="70vh"
                    gridRef={gridRef}
                    filterValueElements={filtersValue}
                    setFilterValueElements={setFiltersValue}
                    selected={{}}
                    tableDataElements={filteredData}
                    columnsElements={columns}
                />

                <AddModel
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onOpenChange={onOpenChange}
                    selectedData={selectedRow} // Pass selected row data to modal
                />
            </div>
        ),
        [
            filteredData,
            handleDownloadExcel,
            filtersValue,
            setFiltersValue,
            columns,
            isOpen,
            onOpen,
            onOpenChange,
            selectedRow,
        ]
    );

    return renderTable();
}

export default CostTable;
