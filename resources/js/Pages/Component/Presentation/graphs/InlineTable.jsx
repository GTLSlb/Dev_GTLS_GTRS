import React, { useRef, useState } from "react";
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
    getReportData,
    AToken,
    originalgraphData,
    selectedReceiver,
    setGraphData,
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

    function CustomNumericEditor(props) {
        const { value, onChange, onComplete, cellProps } = props; // Destructure relevant props
        const [inputValue, setInputValue] = useState(value);

        // Determine the maximum value dynamically based on your logic
        let max;
        if (cellProps.rowIndex === 0 && cellProps.rowIndex === 3) {
            max = null;
        } else {
            max = dataSource[0][cellProps.id];
        }

        const onValueChange = (e) => {
            let newValue = e.target.value;

            // Check if the new value exceeds the max limit
            if (cellProps.rowIndex === 1 && cellProps.rowIndex === 2) {
                if (max !== null && parseFloat(newValue) > max) {
                    newValue = max; // Set to max if it exceeds
                }
            }

            setInputValue(newValue); // Update the local state
            onChange(newValue); // Call onChange to update the grid's internal state
        };

        const handleComplete = () => {
            onComplete(inputValue); // Commit the final value and close the editor
        };

        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                handleComplete(); // Save and close editor when Enter is pressed
            }
        };

        return (
            <input
                type="number"
                min={0} // Minimum value
                max={null} // Maximum value
                step={1} // Step size
                value={inputValue}
                onChange={onValueChange}
                onBlur={handleComplete} // Save and close editor when input loses focus
                onKeyDown={handleKeyDown} // Save and close editor when Enter is pressed
                style={{ width: "100%", height: "100%" }}
            />
        );
    }

    jsonData.forEach((item) => {
        const columnName = formatDateToColumnName(item.MonthDate);
        columns.push({
            name: columnName,
            header: columnName,
            defaultFlex: 1,
            minWidth: 100,
            sortable: false,
            editor: CustomNumericEditor, // Use the NumericEditor

            // Adjusted the editable function to properly log the row data
            // Use closure to capture row data
            editable: (editValue, cellProps) => {
                return Promise.resolve(
                    cellProps.data.metric !== "Ontime %" &&
                        cellProps.data.metric !== "POD %"
                );
            },

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

    const [dataSource, setDataSource] = useState(originalData);
    const [validationErrors, setValidationErrors] = useState({});
    // Lookup function to determine editability based on rowIndex and columnName

    const onEditComplete = useCallback(
        ({ value, columnId, rowIndex }) => {
            const data = [...dataSource]; // Clone dataSource to prevent direct state mutation
            let formattedValue = value;

            // Format the KPI Benchmark row value as a percentage
            if (rowIndex === 3) {
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

            // Recalculate percentages
            if (baseRecord.TotalCons && baseRecord.TotalCons !== 0) {
                // Handle OnTime % calculation
                if (
                    baseRecord.TotalFails == null ||
                    baseRecord.TotalFails === ""
                ) {
                    baseRecord.onTimePercentage = ""; // Clear OnTime % if TotalFails is empty
                } else {
                    baseRecord.onTimePercentage = (
                        ((baseRecord.TotalCons - baseRecord.TotalFails) /
                            baseRecord.TotalCons) *
                        100
                    ).toFixed(2);
                }

                // Handle POD % calculation
                if (
                    baseRecord.TotalNoPod == null ||
                    baseRecord.TotalNoPod === ""
                ) {
                    baseRecord.PODPercentage = ""; // Clear POD % if TotalNoPod is empty
                } else {
                    baseRecord.PODPercentage = (
                        ((baseRecord.TotalCons - baseRecord.TotalNoPod) /
                            baseRecord.TotalCons) *
                        100
                    ).toFixed(2);
                }
            } else {
                baseRecord.onTimePercentage = ""; // Clear OnTime % if TotalCons is zero or null
                baseRecord.PODPercentage = ""; // Clear POD % if TotalCons is zero or null
            }

            // Update the data in the dataSource
            data[4][columnId] = baseRecord.onTimePercentage
                ? `${baseRecord.onTimePercentage}%`
                : "";
            data[5][columnId] = baseRecord.PODPercentage
                ? `${baseRecord.PODPercentage}%`
                : "";

            // Validate fields before making an API request
            if (baseRecord.TotalCons == null || baseRecord.TotalCons === "") {
                console.log("Validation failed: TotalCons is null or empty");
                setValidationErrors((prev) => ({
                    ...prev,
                    [`${columnId}`]: true,
                }));
                return;
            } else if (
                baseRecord.TotalFails == null ||
                baseRecord.TotalFails === ""
            ) {
                console.log("Validation failed: TotalFails is null or empty");
                setValidationErrors((prev) => ({
                    ...prev,
                    [`${columnId}`]: true,
                }));
                return;
            } else if (
                baseRecord.TotalNoPod == null ||
                baseRecord.TotalNoPod === ""
            ) {
                console.log("Validation failed: TotalNoPod is null or empty");
                setValidationErrors((prev) => ({
                    ...prev,
                    [`${columnId}`]: true,
                }));
                return;
            } else if (
                baseRecord.KpiBenchMark == null ||
                baseRecord.KpiBenchMark === ""
            ) {
                console.log("Validation failed: KpiBenchMark is null or empty");
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

            // API request to update the backend (Uncomment when ready)

            axios
                .post(`${url}Add/KpiPackRecord`, baseRecord, {
                    headers: {
                        UserId: currentUser.UserId,
                        Authorization: `Bearer ${AToken}`,
                    },
                })
                .then((res) => {
                    setGraphData(
                        updateLocalData(originalgraphData, baseRecord)
                    );
                })
                .catch((err) => {
                    console.log(err);
                });

            setDataSource(data);
        },
        [dataSource, jsonData]
    );

    const updateLocalData = (records, newRecord) => {
        // console.log(records, newRecord);
        // Convert new record's report month to MonthDate format
        const newMonthDate = newRecord.ReportMonth;
        // // Map over records to find and replace the matching month data
        const updatedRecords = records.map((monthData) => {
            if (monthData.MonthDate === newMonthDate) {
                return {
                    ...monthData,
                    Record: [newRecord], // Replace the existing record
                };
            }
            return monthData;
        });
        return updatedRecords;
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
    }));

    return (
        <div className="mt-10">
            <ReactDataGrid
                idProperty="metric"
                style={{ minHeight: 284, fontWeight: "bold" }}
                onEditComplete={onEditComplete}
                columns={editableColumns}
                showZebraRows={false}
                dataSource={dataSource}
                showColumnMenuTool={false}
            />
        </div>
    );
}

export default InlineTable;
