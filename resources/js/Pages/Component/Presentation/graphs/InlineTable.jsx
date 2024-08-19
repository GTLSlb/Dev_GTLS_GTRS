import React, { useState, useCallback } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";

// Provided JSON data
const jsonData = [
    { MonthDate: "2023-08-01" },
    { MonthDate: "2023-09-01" },
    { MonthDate: "2023-10-01" },
    { MonthDate: "2023-11-01" },
    {
        MonthDate: "2023-12-01",
        Record: [
            {
                RecordId: 7,
                CustomerId: 1,
                CustomerTypeId: 2,
                ReportMonth: "2023-12-01",
                TotalCons: 3,
                TotalFails: 1,
                TotalNoPod: 5,
                KpiBenchMark: 2.0,
            },
        ],
    },
    {
        MonthDate: "2024-01-01",
        Record: [
            {
                RecordId: 6,
                CustomerId: 1,
                CustomerTypeId: 2,
                ReportMonth: "2024-01-01",
                TotalCons: 3,
                TotalFails: 1,
                TotalNoPod: 5,
                KpiBenchMark: 2.0,
            },
        ],
    },
    {
        MonthDate: "2024-02-01",
        Record: [
            {
                RecordId: 5,
                CustomerId: 1,
                CustomerTypeId: 2,
                ReportMonth: "2024-02-01",
                TotalCons: 32,
                TotalFails: 1,
                TotalNoPod: 5,
                KpiBenchMark: 8.0,
            },
        ],
    },
    { MonthDate: "2024-03-01" },
    {
        MonthDate: "2024-04-01",
        Record: [
            {
                RecordId: 4,
                CustomerId: 1,
                CustomerTypeId: 2,
                ReportMonth: "2024-04-01",
                TotalCons: 12,
                TotalFails: 1,
                TotalNoPod: 5,
                KpiBenchMark: 8.0,
            },
        ],
    },
    { MonthDate: "2024-05-01" },
    {
        MonthDate: "2024-06-01",
        Record: [
            {
                RecordId: 2,
                CustomerId: 1,
                CustomerTypeId: 2,
                ReportMonth: "2024-06-01",
                TotalCons: 72,
                TotalFails: 1,
                TotalNoPod: 5,
                KpiBenchMark: 98.0,
            },
        ],
    },
    {
        MonthDate: "2024-07-01",
        Record: [
            {
                RecordId: 1,
                CustomerId: 1,
                CustomerTypeId: 2,
                ReportMonth: "2024-07-01",
                TotalCons: 53,
                TotalFails: 11,
                TotalNoPod: 8,
                KpiBenchMark: 98.0,
            },
        ],
    },
    {
        MonthDate: "2024-08-01",
        Record: [
            {
                RecordId: 3,
                CustomerId: 1,
                CustomerTypeId: 2,
                ReportMonth: "2024-08-01",
                TotalCons: 82,
                TotalFails: 1,
                TotalNoPod: 5,
                KpiBenchMark: 98.0,
            },
        ],
    },
];

// Function to format date to column name
const formatDateToColumnName = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEPT",
        "OCT",
        "NOV",
        "DEC",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month}${year}`;
};

// Generate columns and originalData
const columns = [{ name: "metric", header: "", defaultFlex: 1, minWidth: 100 }];
const originalDataTemplate = {};

jsonData.forEach((item) => {
    const columnName = formatDateToColumnName(item.MonthDate);
    columns.push({
        name: columnName,
        header: columnName,
        defaultFlex: 1,
        minWidth: 100,
        editable: true,
    });

    originalDataTemplate[columnName] = "";
});

const originalData = [
    { ...originalDataTemplate, metric: "Total" },
    { ...originalDataTemplate, metric: "Total Fails" },
    { ...originalDataTemplate, metric: "Total NO POD" },
    { ...originalDataTemplate, metric: "KPI BenchMark" },
];

// Store original records to track RecordIds and other details
const recordMap = {};

// Populate originalData with values from the JSON
jsonData.forEach((item) => {
    const columnName = formatDateToColumnName(item.MonthDate);
    if (item.Record && item.Record.length > 0) {
        const record = item.Record[0];
        recordMap[columnName] = record;

        originalData[0][columnName] = record.TotalCons || 0;
        originalData[1][columnName] = record.TotalFails || 0;
        originalData[2][columnName] = record.TotalNoPod || 0;
        originalData[3][columnName] = record.KpiBenchMark || 0;
    } else {
        recordMap[columnName] = {
            RecordId: null,
            CustomerId: 1,
            CustomerTypeId: 2,
            ReportMonth: item.MonthDate,
        };
    }
});

// Component
function InlineTable() {
    const [gridRef, setGridRef] = useState(null);
    const [dataSource, setDataSource] = useState(originalData);
    const [validationErrors, setValidationErrors] = useState({});

    const onEditComplete = useCallback(
        ({ value, columnId, rowIndex }) => {
            const data = [...dataSource];
            data[rowIndex][columnId] = value;

            const baseRecord = recordMap[columnId];

            let updatedField = "";
            switch (rowIndex) {
                case 0:
                    updatedField = "TotalCons";
                    break;
                case 1:
                    updatedField = "TotalFails";
                    break;
                case 2:
                    updatedField = "TotalNoPod";
                    break;
                case 3:
                    updatedField = "KpiBenchMark";
                    break;
                default:
                    break;
            }

            baseRecord[updatedField] = value;

            if (baseRecord.RecordId === null) {
                if (
                    baseRecord.TotalCons == null ||
                    baseRecord.TotalFails == null ||
                    baseRecord.TotalNoPod == null ||
                    baseRecord.KpiBenchMark == null
                ) {
                    setValidationErrors((prev) => ({
                        ...prev,
                        [`${columnId}`]: true,
                    }));
                    return;
                } else {
                    setValidationErrors((prev) => ({
                        ...prev,
                        [`${columnId}`]: false,
                    }));
                }
            }

            const requestObject = {
                ...baseRecord,
            };

            console.log("Request Object:", requestObject);

            setDataSource(data);
        },
        [dataSource]
    );

    const modifiedColumns = columns.map((col) => ({
        ...col,
        onRender: (cellProps, { data }) => {
            console.log(cellProps)
            const columnKey = cellProps.name; // Use name as the column identifier
            console.log(columnKey)
            cellProps.style.background = data.age > 30 ? "#251c0c" : "#252854";
        },
        render: ({ value, name, rowIndex, cellProps }) => {
            const columnKey = cellProps.name; // Use name as the column identifier
            const hasError = validationErrors[columnKey];
            return (
                <div
                    style={{
                        color: hasError ? "black" : "black",
                        backgroundColor: hasError
                            ? "rgba(255, 0, 0, 0.2)"
                            : "transparent",
                    }}
                >
                    <div className="w-full h-full p-2"> {value} </div>
                </div>
            );
        },
    }));

    return (
        <div className="mt-10">
            <ReactDataGrid
                onReady={setGridRef}
                idProperty="metric"
                style={{ minHeight: 200 }}
                onEditComplete={onEditComplete}
                editable={true}
                columns={modifiedColumns}
                showZebraRows={false}
                dataSource={dataSource}
            />
        </div>
    );
}

export default InlineTable;
