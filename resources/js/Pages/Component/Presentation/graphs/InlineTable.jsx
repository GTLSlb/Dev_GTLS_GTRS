import React, { useState } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import axios from "axios";
import { useCallback } from "react";
import "../../../../../css/graphTable.css";
import NumericEditor from "@inovua/reactdatagrid-community/NumericEditor";

// Component
function InlineTable({
    graphData,
    url,
    currentUser,
    userPermission,
    getReportData,
    selectedReceiver,
    setGraphData,
    updateData,
}) {
    const [jsonData, setJsonData] = useState(graphData);
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
        return `${month} ${year}`;
    };

    // Generate columns and originalData
    const columns = [
        { name: "metric", header: "", defaultFlex: 1, minWidth: 100 },
    ];
    const originalDataTemplate = {};

    // Create original data template and columns dynamically

    jsonData.forEach((item) => {
        const columnName = formatDateToColumnName(item.MonthDate);
        columns.push({
            name: columnName,
            header: columnName,
            defaultFlex: 1,
            minWidth: 100,
            sortable: false,
            editor: NumericEditor,
            editable: true, // Use the lookup function here
            render: ({ value }) => {
                return <div className="font-normal">{value}</div>; // Render value as text
            },
        });

        originalDataTemplate[columnName] = "";
    });

    const originalData = [
        { ...originalDataTemplate, metric: "Total" },
        { ...originalDataTemplate, metric: "Total Fails" },
        { ...originalDataTemplate, metric: "Total NO POD" },
        { ...originalDataTemplate, metric: "KPI BenchMark" },
        { ...originalDataTemplate, metric: "Ontime %" },
        { ...originalDataTemplate, metric: "POD %" },
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
            // originalData[3][columnName] = `${(record.KpiBenchMark || 0).toFixed(2)}%`; // Ensure percentages are formatted
            originalData[3][columnName] = `${(
                (record.KpiBenchMark || 0) * 1
            ).toFixed(2)}%`; // Ensure percentages are formatted
            originalData[4][columnName] = `${(
                (record.onTimePercentage || 0) * 1
            ).toFixed(2)}%`; // Ensure percentages are formatted
            originalData[5][columnName] = `${(
                (record.PODPercentage || 0) * 1
            ).toFixed(2)}%`; // Ensure percentages are formatted
        } else {
            recordMap[columnName] = {
                RecordId: null,
                CustomerId: 1,
                CustomerTypeId: selectedReceiver.value,
                ReportMonth: item.MonthDate,
            };
        }
    });

    const [gridRef, setGridRef] = useState(null);
    const [dataSource, setDataSource] = useState(originalData);
    const [validationErrors, setValidationErrors] = useState({});

    // Lookup function to determine editability based on rowIndex and columnName

    const percentageRows = dataSource.filter((row) => row.metric.includes("%"));
    const nonPercentageRows = dataSource.filter(
        (row) => !row.metric.includes("%")
    );

    const onEditComplete = useCallback(
        ({ value, columnId, rowIndex }) => {
            const data = [...dataSource]; // Clone dataSource to prevent direct state mutation
            // data[rowIndex][columnId] = value;
            let formattedValue = value;

            // Format the KPI Benchmark row value as a percentage
            if (rowIndex === 3) {
                // Assuming KPI Benchmark is at index 3
                formattedValue =
                    value == null ? "" : `${parseFloat(value).toFixed(2)} %`;
            }

            data[rowIndex][columnId] = formattedValue;

            const baseRecord = recordMap[columnId];
            let updatedField = "";

            // Determine which field has been updated based on the row index
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
                    baseRecord[updatedField] = parseFloat(value);
                    break;
                default:
                    break;
            }

            baseRecord[updatedField] = value;

            // Update percentages if necessary
            if (
                baseRecord.TotalCons != null ||
                (baseRecord.TotalCons != "" && baseRecord.TotalFails != null) ||
                (baseRecord.TotalFails != "" &&
                    baseRecord.TotalNoPod != null) ||
                baseRecord.TotalNoPod != ""
            ) {
                    if(baseRecord.TotalCons == 0 || baseRecord.TotalCons == null){
                        baseRecord.onTimePercentage = 0
                    }else {
                        baseRecord.onTimePercentage = ((baseRecord.TotalCons - baseRecord.TotalFails) / baseRecord.TotalCons) * 100
                    }
                    if(baseRecord.TotalCons == 0 || baseRecord.TotalCons == null){
                        baseRecord.PODPercentage = 0
                    }else {
                        baseRecord.PODPercentage = ((baseRecord.TotalCons - baseRecord.TotalFails) / baseRecord.TotalCons) * 100
                    }
                data[4][columnId] = `${(
                    baseRecord.onTimePercentage || 0
                ).toFixed(2)}%`;
                data[5][columnId] = `${(baseRecord.PODPercentage || 0).toFixed(
                    2
                )}%`;
            }

            // Validate if all necessary fields are provided before making an API request
            if (baseRecord.TotalCons == null || baseRecord.TotalCons === "") {
                console.log("Validation failed: TotalCons is null or empty");
                setValidationErrors((prev) => ({
                    ...prev,
                    [`${columnId}`]: true,
                }));
            } else if (
                baseRecord.TotalFails == null ||
                baseRecord.TotalFails === ""
            ) {
                console.log("Validation failed: TotalFails is null or empty");
                setValidationErrors((prev) => ({
                    ...prev,
                    [`${columnId}`]: true,
                }));
            } else if (
                baseRecord.TotalNoPod == null ||
                baseRecord.TotalNoPod === ""
            ) {
                console.log("Validation failed: TotalNoPod is null or empty");
                setValidationErrors((prev) => ({
                    ...prev,
                    [`${columnId}`]: true,
                }));
            } else if (
                baseRecord.KpiBenchMark == null ||
                baseRecord.KpiBenchMark === ""
            ) {
                console.log("Validation failed: KpiBenchMark is null or empty");
                setValidationErrors((prev) => ({
                    ...prev,
                    [`${columnId}`]: true,
                }));
            } else {
                setValidationErrors((prev) => ({
                    ...prev,
                    [`${columnId}`]: false,
                }));
            }

            // API request to update the backend
            axios
                .post(`${url}Add/KpiPackRecord`, baseRecord, {
                    headers: {
                        UserId: currentUser.UserId,
                    },
                })
                .then((res) => {
                    // Update local state based on the backend confirmation/response
                    updateLocalData(baseRecord, columnId, rowIndex, data);
                })
                .catch((err) => {
                    console.log(err);
                    alert("Failed to update record. Please try again.");
                });

            setDataSource(data);
        },
        [dataSource, jsonData]
    );

    // Function to update local state
    const updateLocalData = (record, columnId, rowIndex, newData) => {
        const updatedJsonData = jsonData.map((item) => {
            if (formatDateToColumnName(item.MonthDate) === columnId) {
                return {
                    ...item,
                    Record: [{ ...item.Record[0], ...record }],
                };
            }
            return item;
        });
        setGraphData(updatedJsonData);
        setJsonData(updatedJsonData);
        setDataSource(newData);
    };

    const modifiedColumns = columns.map((col) => ({
        ...col,
        onRender: (cellProps, { value }) => {
            const hasError = validationErrors[cellProps.name];
            // Apply bold style only for the "metric" column

            const isMetricColumn = col.name == "metric";
            cellProps.style.background = hasError ? "#f6d3d0" : "transparent";
            return (
                <div
                    style={{
                        fontWeight: isMetricColumn ? "bold" : "normal", // Bold for "metric" column, normal for others
                        color: hasError ? "black" : "black",
                        backgroundColor: hasError ? "#f6d3d0" : "transparent",
                    }}
                >
                    <div className="test"> {value}</div>
                </div>
            );
        },
    }));

    const editableColumns = modifiedColumns.map((col) => ({
        ...col,
        editable: col.name === "metric" ? false : true, // Make the 'metric' column non-editable
    }));

    const nonEditableColumns = modifiedColumns.map((col) => ({
        ...col,
        editable: false, // Make columns non-editable for the second table
    }));

    return (
        <div className="mt-10">

            <ReactDataGrid
                onReady={setGridRef}
                idProperty="metric"
                style={{ minHeight: 203, fontWeight: "bold" }}
                onEditComplete={onEditComplete}
                editable={true}
                columns={editableColumns}
                showZebraRows={false}
                dataSource={nonPercentageRows}
                showColumnMenuTool={false}
            />

            <ReactDataGrid
                onReady={setGridRef}
                idProperty="metric"
                style={{ minHeight: 82, marginTop: -1, fontWeight: "bold"   }}
                editable={false}
                columns={nonEditableColumns}
                showZebraRows={false}
                dataSource={percentageRows}
                defaultShowHeader={false}
                showColumnMenuTool={false}
            />

        </div>
    );
}

export default InlineTable;
