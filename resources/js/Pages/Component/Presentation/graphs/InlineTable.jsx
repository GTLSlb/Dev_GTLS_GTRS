import React, { useState, useCallback, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import axios from "axios";
import "../../../../../css/graphTable.css";
import { AlertToast } from "@/permissions";
import { ToastContainer } from "react-toastify";
import { CustomContext } from "@/CommonContext";

// Component
function InlineTable({
    graphData,
    CustomerId,
    setGraphData,
    selectedReceiver,
}) {
    const { Token, user, url } = useContext(CustomContext);
    const jsonData = graphData;
    const [localGraphData, setLocalGraphData] = useState(graphData);

    useEffect(() => {
        setLocalGraphData(graphData); // Sync with the initial data or props
    }, [graphData]);

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

    // Store original records to track RecordIds and other details
    const recordMap = {};

    // Create original data template and columns dynamically
    function CustomNumericEditor(props) {
        const { value, onChange, onComplete, cellProps } = props; // Destructure relevant props
        const [inputValue, setInputValue] = useState(value);

        // Determine the maximum value dynamically based on your logic
        let max;
        if (cellProps.rowIndex === 0 || cellProps.rowIndex === 3) {
            max = null;
        } else {
            max = dataSource[0][cellProps.id];
        }

        const onValueChange = (e) => {
            let newValue = e.target.value;

            // Check if the new value exceeds the max limit
            if (cellProps.rowIndex === 1 || cellProps.rowIndex === 2) {
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
    CustomNumericEditor.propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onChange: PropTypes.func,
        onComplete: PropTypes.func,
        cellProps: PropTypes.object,
    };

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
            editable: (cellProps) => {
                return Promise.resolve(
                    // eslint-disable-next-line react/prop-types
                    cellProps.data.metric !== "Ontime %" &&
                    // eslint-disable-next-line react/prop-types
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

    // Populate originalData with values from the JSON
    jsonData.forEach((item) => {
        const columnName = formatDateToColumnName(item.MonthDate);
        if (item.Record && item.Record.length > 0) {
            const record = item.Record[0];
            recordMap[columnName] = {
                ...record, // Ensure all fields are included
            };
            originalData[0][columnName] = record.TotalCons || 0;
            originalData[1][columnName] = record.TotalFails || 0;
            originalData[2][columnName] = record.TotalNoPod || 0;
            originalData[3][columnName] =
                record.KpiBenchMark != null
                    ? `${parseFloat(record.KpiBenchMark).toFixed(2)}%`
                    : ""; // Ensure percentages are formatted
            originalData[4][columnName] =
                record.onTimePercentage != null
                    ? `${parseFloat(record.onTimePercentage).toFixed(2)}%`
                    : ""; // Ensure percentages are formatted
            originalData[5][columnName] =
                record.PODPercentage != null
                    ? `${parseFloat(record.PODPercentage).toFixed(2)}%`
                    : ""; // Ensure percentages are formatted
        } else {
            recordMap[columnName] = {
                RecordId: null,
                CustomerId: CustomerId, // Replace with actual CustomerId if available
                CustomerTypeId: selectedReceiver.value,
                ReportMonth: item.MonthDate,
                TotalCons: null,
                TotalFails: null,
                TotalNoPod: null,
                KpiBenchMark: null,
                onTimePercentage: null,
                PODPercentage: null,
            };
        }
    });

    const [dataSource, setDataSource] = useState(originalData);
    const [validationErrors, setValidationErrors] = useState({});
    // Lookup function to determine editability based on rowIndex and columnName

    const onEditComplete = useCallback(
        ({ value, columnId, rowIndex }) => {
            const data = [...dataSource];
            let formattedValue = value;

            // Format the KPI Benchmark row value as a percentage
            if (rowIndex === 3) {
                formattedValue =
                    value == null ? "" : `${parseFloat(value).toFixed(2)}%`;
            }

            data[rowIndex][columnId] = formattedValue;

            const baseRecord = { ...recordMap[columnId] };
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
                    break;
                default:
                    break;
            }

            // Update baseRecord with the parsed numerical value
            baseRecord[updatedField] = parseFloat(value);

            // Ensure other fields are preserved by getting their current values from dataSource
            const fieldRowIndexMap = {
                TotalCons: 0,
                TotalFails: 1,
                TotalNoPod: 2,
                KpiBenchMark: 3,
            };

            const fieldNames = [
                "TotalCons",
                "TotalFails",
                "TotalNoPod",
                "KpiBenchMark",
            ];
            fieldNames.forEach((field) => {
                if (field !== updatedField) {
                    if (baseRecord[field] == null || baseRecord[field] === "") {
                        const rowIdx = fieldRowIndexMap[field];
                        const fieldValue = dataSource[rowIdx][columnId];
                        if (fieldValue != null && fieldValue !== "") {
                            const parsedValue = parseFloat(
                                fieldValue.toString().replace("%", "")
                            );
                            baseRecord[field] = parsedValue;
                        }
                    }
                }
            });

            // Recalculate percentages
            if (baseRecord.TotalCons && baseRecord.TotalCons !== 0) {
                if (
                    baseRecord.TotalFails == null ||
                    baseRecord.TotalFails === ""
                ) {
                    baseRecord.onTimePercentage = "";
                } else {
                    baseRecord.onTimePercentage = (
                        ((baseRecord.TotalCons - baseRecord.TotalFails) /
                            baseRecord.TotalCons) *
                        100
                    ).toFixed(2);
                }

                if (
                    baseRecord.TotalNoPod == null ||
                    baseRecord.TotalNoPod === ""
                ) {
                    baseRecord.PODPercentage = "";
                } else {
                    baseRecord.PODPercentage = (
                        ((baseRecord.TotalCons - baseRecord.TotalNoPod) /
                            baseRecord.TotalCons) *
                        100
                    ).toFixed(2);
                }
            } else {
                baseRecord.onTimePercentage = "";
                baseRecord.PODPercentage = "";
            }

            data[4][columnId] = baseRecord.onTimePercentage
                ? `${baseRecord.onTimePercentage}%`
                : "";
            data[5][columnId] = baseRecord.PODPercentage
                ? `${baseRecord.PODPercentage}%`
                : "";

            // Validate fields before making an API request
            if (
                baseRecord.TotalCons == null ||
                baseRecord.TotalCons === "" ||
                Number.isNaN(baseRecord.TotalCons) ||
                baseRecord.TotalFails == null ||
                baseRecord.TotalFails === "" ||
                Number.isNaN(baseRecord.TotalFails) ||
                baseRecord.TotalNoPod == null ||
                baseRecord.TotalNoPod === "" ||
                Number.isNaN(baseRecord.TotalNoPod) ||
                baseRecord.KpiBenchMark == null ||
                baseRecord.KpiBenchMark === "" ||
                Number.isNaN(baseRecord.KpiBenchMark)
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

            // Update recordMap with the updated baseRecord
            recordMap[columnId] = baseRecord;

            axios
                .post(`${url}Add/KpiPackRecord`, baseRecord, {
                    headers: {
                        UserId: user.UserId,
                        Authorization: `Bearer ${Token}`,
                    },
                })
                .then(() => {
                    // Use functional updates to ensure you're working with the latest data
                    const updatedData = updateLocalData(
                        localGraphData,
                        baseRecord
                    );
                    // Persist updates
                    setLocalGraphData(updatedData);
                    setGraphData(updatedData); // Optional: If parent component needs the updates
                })
                .catch((err) => {
                    console.error(err);
                    AlertToast(err.response.data.Message, 2);
                });

            setDataSource(data);
        },
        [dataSource, localGraphData]
    );

    const updateLocalData = (records, newRecord) => {
        const newMonthDate = newRecord.ReportMonth;
        const updatedRecords = records.map((monthData) => {
            if (monthData.MonthDate === newMonthDate) {
                const existingRecord =
                    monthData.Record && monthData.Record[0]
                        ? monthData.Record[0]
                        : {};
                return {
                    ...monthData,
                    Record: [
                        {
                            ...existingRecord,
                            ...newRecord, // Merge newRecord with existingRecord
                        },
                    ],
                };
            }
            return monthData;
        });
        return updatedRecords;
    };

    const modifiedColumns = columns.map((col) => ({
        ...col,
        onRender: (cellProps, { value }) => {
    // eslint-disable-next-line react/prop-types
    const hasError = validationErrors[cellProps.name];
    const isMetricColumn = col.name === "metric";

    // eslint-disable-next-line react/prop-types
    cellProps.style.background = hasError ? "#f6d3d0" : "transparent";

    return (
        <div
            style={{
                fontWeight: isMetricColumn ? "bold" : "normal",
                color: hasError ? "black" : "black",
                backgroundColor: hasError ? "#f6d3d0" : "transparent",
            }}
        >
            <div className="test">{value}</div>
        </div>
    );
}
    }));

    const editableColumns = modifiedColumns.map((col) => ({
        ...col,
    }));

    return (
        <div className="mt-10">
            {/* Added toast container since it wasn't showing */}
            <ToastContainer />
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
InlineTable.propTypes = {
    graphData: PropTypes.array,
    url: PropTypes.string,
    CustomerId: PropTypes.number,
    setGraphData: PropTypes.func,
    Token: PropTypes.string,
    selectedReceiver: PropTypes.object,
};

export default InlineTable;
