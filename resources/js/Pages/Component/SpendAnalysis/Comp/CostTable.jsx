import TableStructure from "@/Components/TableStructure";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { getSpendAnalysisTable } from "@/Components/utils/filters";
import { useDisclosure } from "@heroui/react";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import { useCallback, useRef, useState } from "react";
import AddModel from "./AddModel";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { formatDateToExcel } from "@/CommonFunctions";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import React from "react";

function CostTable({ filters }) {
    const gridRef = useRef(null);
    const [selected] = useState({});
    const chartsData = [
        {
            ConsignmentID: 550010,
            ConsignmentNo: "RFOO1519",
            DespatchDate: "2025-01-15T00:00:00",
            SenderReference: "SO-128892",
            ReceiverReference: "0109501381",
            CodeRef: "TIMESLOT",
            DescriptionRef: "TIMESLOT CHARGE (PER C/N)",
            Cost: 1000,
            TotalAdditionalCharge: 520,
            fuelLevy: 80,
            GST: 60,
            TotalCost: 1660,
            Weight: 50,
            height: 1.2,
            Cubic: 60,
            NoPallet: 20,
            length: 1.8,
        },
        {
            ConsignmentID: 550010,
            ConsignmentNo: "RFOO1519",
            DespatchDate: "2025-02-20T00:00:00",
            SenderReference: "SO-128892",
            ReceiverReference: "0109501381",
            CodeRef: "TIMESLOT",
            DescriptionRef: "TIMESLOT CHARGE (PER C/N)",
            Cost: 1000,
            TotalAdditionalCharge: 520,
            fuelLevy: 80,
            GST: 60,
            TotalCost: 1660,
            Weight: 50,
            height: 1.2,
            Cubic: 60,
            NoPallet: 20,
            length: 1.8,
        },
        {
            ConsignmentID: 550010,
            ConsignmentNo: "RFOO1519",
            DespatchDate: "2025-06-22T00:00:00",
            SenderReference: "SO-128892",
            ReceiverReference: "0109501381",
            CodeRef: "TIMESLOT",
            DescriptionRef: "TIMESLOT CHARGE (PER C/N)",
            Cost: 1000,
            TotalAdditionalCharge: 520,
            fuelLevy: 80,
            GST: 60,
            TotalCost: 1660,
            Weight: 50,
            height: 1.2,
            Cubic: 60,
            NoPallet: 20,
            length: 1.8,
        },
        {
            ConsignmentID: 550010,
            ConsignmentNo: "RFOO1519",
            DespatchDate: "2025-03-02T00:00:00",
            SenderReference: "SO-128892",
            ReceiverReference: "0109501381",
            CodeRef: "TIMESLOT",
            DescriptionRef: "TIMESLOT CHARGE (PER C/N)",
            Cost: 1000,
            TotalAdditionalCharge: 520,
            fuelLevy: 80,
            GST: 60,
            TotalCost: 1660,
            Weight: 50,
            height: 1.2,
            Cubic: 60,
            NoPallet: 20,
            length: 1.8,
        },
        {
            ConsignmentID: 550010,
            ConsignmentNo: "RFOO1519",
            DespatchDate: "2025-04-21T00:00:00",
            SenderReference: "SO-128892",
            ReceiverReference: "0109501381",
            CodeRef: "TIMESLOT",
            DescriptionRef: "TIMESLOT CHARGE (PER C/N)",
            Cost: 1000,
            TotalAdditionalCharge: 520,
            fuelLevy: 80,
            GST: 60,
            TotalCost: 1660,
            Weight: 50,
            height: 1.2,
            Cubic: 60,
            NoPallet: 20,
            length: 1.8,
        },
        {
            ConsignmentID: 550010,
            ConsignmentNo: "RFOO1519",
            DespatchDate: "2025-07-07T00:00:00",
            SenderReference: "SO-128892",
            ReceiverReference: "0109501381",
            CodeRef: "TIMESLOT",
            DescriptionRef: "TIMESLOT CHARGE (PER C/N)",
            Cost: 1000,
            TotalAdditionalCharge: 520,
            fuelLevy: 80,
            GST: 60,
            TotalCost: 1660,
            Weight: 50,
            height: 1.2,
            Cubic: 60,
            NoPallet: 20,
            length: 1.8,
        },
        {
            ConsignmentID: 550010,
            ConsignmentNo: "RFOO1519",
            DespatchDate: "2025-08-18T00:00:00",
            SenderReference: "SO-128892",
            ReceiverReference: "0109501381",
            CodeRef: "TIMESLOT",
            DescriptionRef: "TIMESLOT CHARGE (PER C/N)",
            Cost: 1000,
            TotalAdditionalCharge: 520,
            fuelLevy: 80,
            GST: 60,
            TotalCost: 1660,
            Weight: 50,
            height: 1.2,
            Cubic: 60,
            NoPallet: 20,
            length: 1.8,
        },
        {
            ConsignmentID: 550010,
            ConsignmentNo: "RFOO1519",
            DespatchDate: "2025-09-15T00:00:00",
            SenderReference: "SO-128892",
            ReceiverReference: "0109501381",
            CodeRef: "TIMESLOT",
            DescriptionRef: "TIMESLOT CHARGE (PER C/N)",
            Cost: 1000,
            TotalAdditionalCharge: 520,
            fuelLevy: 80,
            GST: 60,
            TotalCost: 1660,
            Weight: 50,
            height: 1.2,
            Cubic: 60,
            NoPallet: 20,
            length: 1.8,
        },
        {
            ConsignmentID: 550010,
            ConsignmentNo: "RFOO1519",
            DespatchDate: "2025-10-03T00:00:00",
            SenderReference: "SO-128892",
            ReceiverReference: "0109501381",
            CodeRef: "TIMESLOT",
            DescriptionRef: "TIMESLOT CHARGE (PER C/N)",
            Cost: 1000,
            TotalAdditionalCharge: 520,
            fuelLevy: 80,
            GST: 60,
            TotalCost: 1660,
            Weight: 50,
            height: 1.2,
            Cubic: 60,
            NoPallet: 20,
            length: 1.8,
        },
        {
            ConsignmentID: 550010,
            ConsignmentNo: "RFOO1519",
            DespatchDate: "2025-12-25T00:00:00",
            SenderReference: "SO-128892",
            ReceiverReference: "0109501381",
            CodeRef: "TIMESLOT",
            DescriptionRef: "TIMESLOT CHARGE (PER C/N)",
            Cost: 1000,
            TotalAdditionalCharge: 520,
            fuelLevy: 80,
            GST: 60,
            TotalCost: 1660,
            Weight: 50,
            height: 1.2,
            Cubic: 60,
            NoPallet: 20,
            length: 1.8,
        },
        {
            ConsignmentID: 550010,
            ConsignmentNo: "RFOO1519",
            DespatchDate: "2025-11-14T00:00:00",
            SenderReference: "SO-128892",
            ReceiverReference: "0109501381",
            CodeRef: "TIMESLOT",
            DescriptionRef: "TIMESLOT CHARGE (PER C/N)",
            Cost: 1000,
            TotalAdditionalCharge: 520,
            fuelLevy: 80,
            GST: 60,
            TotalCost: 1660,
            Weight: 50,
            height: 1.2,
            Cubic: 60,
            NoPallet: 20,
            length: 1.8,
        },
        {
            ConsignmentID: 550010,
            ConsignmentNo: "RFOO1519",
            DespatchDate: "2025-09-11T00:00:00",
            SenderReference: "SO-128892",
            ReceiverReference: "0109501381",
            CodeRef: "TIMESLOT",
            DescriptionRef: "TIMESLOT CHARGE (PER C/N)",
            Cost: 1000,
            TotalAdditionalCharge: 520,
            fuelLevy: 80,
            GST: 60,
            TotalCost: 1660,
            Weight: 50,
            height: 1.2,
            Cubic: 60,
            NoPallet: 20,
            length: 1.8,
        },
    ];

    const [filteredData, setFilteredData] = useState(chartsData);
    const [filtersValue, setFiltersValue] = useState(getSpendAnalysisTable());

    const SenderRefOptions = createNewLabelObjects(
        chartsData,
        "SenderReference"
    );
    const ReceiverRefOptions = createNewLabelObjects(
        chartsData,
        "ReceiverReference"
    );
    const CodeRefOptions = createNewLabelObjects(chartsData, "CodeRef");
    const DescRefOptions = createNewLabelObjects(chartsData, "DescriptionRef");

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
        },
        {
            name: "SenderReference",
            header: "Sender Reference",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: SenderRefOptions,
            },
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: ReceiverRefOptions,
            },
        },
        {
            name: "CodeRef",
            header: "Code Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: CodeRefOptions,
            },
        },
        {
            name: "DescriptionRef",
            header: "Description",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: DescRefOptions,
            },
        },
        {
            name: "fuelLevy",
            header: "fuel Levy Charge",
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
            name: "TotalAdditionalCharge",
            header: "Total Additional Charge",
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
            render: ({ value }) => {
                return (
                    <div
                        onClick={onOpen}
                        className="text-blue-400 underline hover:cursor-pointer"
                    >
                        {value}
                    </div>
                );
            },
        },
        {
            name: "GST",
            header: "GST",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "TotalCost",
            header: "Total Cost",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "Weight",
            header: "Total Weight",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "height",
            header: "Total Height",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "Cubic",
            header: "Cubic weight",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "length",
            header: "Length",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "NoPallet",
            header: "No Pallet",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
    ]);

    React.useEffect(() => {
        if (filters) {
            const filtered = chartsData.filter((item) => {
                const despatchDate = new Date(item.DespatchDate);
                const monthAbbreviation = despatchDate.toLocaleString(
                    "default",
                    { month: "short" }
                );

                return (
                    (filters.service === "" ||
                        item.service === filters.service) &&
                    (filters.date === "" ||
                        monthAbbreviation === filters.date) &&
                    (filters.additionalCosts === "" ||
                        item.additionalCosts === filters.additionalCosts)
                );
            });
            setFilteredData(filtered);
        }
    }, [filters]);
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

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const renderTable = useCallback(() => {
        return (
            <div className="px-4 sm:px-6 lg:px-0 w-full bg-smooth">
                <TableStructure
                    handleDownloadExcel={handleDownloadExcel}
                    id={"ConsignmentId"}
                    minHeight="70vh"
                    gridRef={gridRef}
                    filterValueElements={filtersValue}
                    setFilterValueElements={setFiltersValue}
                    selected={selected}
                    tableDataElements={filteredData}
                    columnsElements={columns}
                />
                <AddModel
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onOpenChange={onOpenChange}
                />
            </div>
        );
    }, [columns, chartsData]);

    return renderTable();
}
export default CostTable;
