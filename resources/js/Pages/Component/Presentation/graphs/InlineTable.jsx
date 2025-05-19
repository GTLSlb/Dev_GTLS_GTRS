import React, {
    useRef,
    useState,
    useCallback,
    useEffect,
    useMemo,
} from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import axios from "axios";
import "../../../../../css/graphTable.css";
import NumericEditor from "@inovua/reactdatagrid-community/NumericEditor";
import { set } from "date-fns";

function InlineTable({
    graphData,
    url,
    currentUser,
    getReportData,
    AToken,
    originalgraphData,
    CustomerId,
    selectedReceiver,
    setGraphData,
}) {
    const [jsonData, setJsonData] = useState(graphData);
    const [localGraphData, setLocalGraphData] = useState(graphData);
    const [validationErrors, setValidationErrors] = useState({});
    const recordMapRef = useRef({});

    useEffect(() => {
        setLocalGraphData(graphData); // Sync with the initial data or props
    }, [graphData]);

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

    const { columns, originalData } = useMemo(() => {
        const columns = [
            { name: "metric", header: "", defaultFlex: 1, minWidth: 100 },
        ];
        const originalDataTemplate = {};
        const newRecordMap = {};

        jsonData.forEach((item) => {
            const columnName = formatDateToColumnName(item.MonthDate);
            columns.push({
                name: columnName,
                header: columnName,
                defaultFlex: 1,
                minWidth: 100,
                sortable: false,
                editor: CustomNumericEditor,

                editable: (editValue, cellProps) => {
                    return Promise.resolve(
                        cellProps.data.metric !== "Ontime %" &&
                            cellProps.data.metric !== "POD %"
                    );
                },

                render: ({ value }) => {
                    return <div className="font-normal">{value}</div>;
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

        jsonData.forEach((item) => {
            const columnName = formatDateToColumnName(item.MonthDate);
            if (item.Record && item.Record.length > 0) {
                const record = item.Record[0];
                newRecordMap[columnName] = { ...record };
                originalData[0][columnName] = record.TotalCons || 0;
                originalData[1][columnName] = record.TotalFails || 0;
                originalData[2][columnName] = record.TotalNoPod || 0;
                originalData[3][columnName] =
                    record.KpiBenchMark != null
                        ? `${parseFloat(record.KpiBenchMark).toFixed(2)}%`
                        : "";
                originalData[4][columnName] =
                    record.onTimePercentage != null
                        ? `${parseFloat(record.onTimePercentage).toFixed(2)}%`
                        : "";
                originalData[5][columnName] =
                    record.PODPercentage != null
                        ? `${parseFloat(record.PODPercentage).toFixed(2)}%`
                        : "";
            } else {
                newRecordMap[columnName] = {
                    RecordId: null,
                    CustomerId: CustomerId,
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

        // Update recordMapRef.current
        recordMapRef.current = newRecordMap;

        return { columns, originalData };
    }, [jsonData, CustomerId, selectedReceiver.value]);

    const [dataSource, setDataSource] = useState(originalData);

    useEffect(() => {
        setDataSource(originalData);
    }, [originalData]);

    function CustomNumericEditor(props) {
        const { value, onChange, onComplete, cellProps } = props; // Destructure relevant props
        const [inputValue, setInputValue] = useState(value);

        // Update inputValue when the `value` prop changes
        useEffect(() => {
            setInputValue(value);
        }, [value]);

        let max;
        if (cellProps.rowIndex === 0 || cellProps.rowIndex === 3) {
            max = null;
        } else {
            max = dataSource[0][cellProps.id];
        }

        const validateAndAdjustValue = (valueToSave) => {
            if (cellProps.rowIndex === 0) {
                const comparisonValue1 =
                    parseFloat(dataSource[1][cellProps.id]) || 0;
                const comparisonValue2 =
                    parseFloat(dataSource[2][cellProps.id]) || 0;
                const minimumValue = Math.max(
                    comparisonValue1,
                    comparisonValue2
                );

                // Ensure the value is at least the maximum of row 1 and row 2 values
                if (valueToSave < minimumValue) {
                    valueToSave = minimumValue;
                }
            }
            return valueToSave;
        };

        const onValueChange = (e) => {
            let newValue = e.target.value;
            if (cellProps.rowIndex === 1 || cellProps.rowIndex === 2) {
                if (max !== null && parseFloat(newValue) > max) {
                    newValue = max; // Set to max if it exceeds
                }
            }
            setInputValue(newValue); // Update the local state
            onChange(newValue); // Call onChange to update the grid's internal state
        };

        const handleComplete = () => {
            let valueToSave = parseFloat(inputValue);

            // Adjust the value dynamically based on the validation logic
            valueToSave = validateAndAdjustValue(valueToSave);

            // Save the adjusted value and close the editor
            onComplete(valueToSave);
        };

        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                handleComplete(); // Save and close editor on Enter key
            }
        };

        return (
            <input
                type="number"
                min={0} // Minimum value
                step={1} // Step size
                max={max}
                value={inputValue}
                onChange={onValueChange}
                onBlur={handleComplete} // Save and close editor when input loses focus
                onKeyDown={handleKeyDown} // Save and close editor when Enter is pressed
                style={{ width: "100%", height: "100%" }}
            />
        );
    }

    const onEditComplete = useCallback(
        ({ value, columnId, rowIndex }) => {
            const data = [...dataSource];
            let formattedValue = value;
    
            if (rowIndex === 3) {
                formattedValue =
                    value == null ? "" : `${parseFloat(value).toFixed(2)}%`;
            }
    
            data[rowIndex][columnId] = formattedValue;
    
            // Build baseRecord using RecordId from recordMapRef.current and field values from dataSource
            const fieldRowIndexMap = {
                TotalCons: 0,
                TotalFails: 1,
                TotalNoPod: 2,
                KpiBenchMark: 3,
            };
    
            const baseRecord = {
                // Retrieve RecordId from recordMapRef.current
                RecordId: recordMapRef.current[columnId]?.RecordId || null,
                CustomerId: CustomerId,
                CustomerTypeId: selectedReceiver.value,
                // Map columnId back to the original MonthDate
                ReportMonth: jsonData.find(
                    (item) => formatDateToColumnName(item.MonthDate) === columnId
                )?.MonthDate,
            };
    
            // Extract field values from dataSource
            Object.entries(fieldRowIndexMap).forEach(([field, idx]) => {
                let fieldValue = data[idx][columnId];
                if (fieldValue != null && fieldValue !== "") {
                    fieldValue = parseFloat(fieldValue.toString().replace("%", ""));
                    baseRecord[field] = fieldValue;
                } else {
                    baseRecord[field] = null;
                }
            });
    
            // Compute percentages
            if (baseRecord.TotalCons && baseRecord.TotalCons !== 0) {
                baseRecord.onTimePercentage = baseRecord.TotalFails != null
                    ? (
                          ((baseRecord.TotalCons - baseRecord.TotalFails) /
                              baseRecord.TotalCons) *
                          100
                      ).toFixed(2)
                    : "";
                baseRecord.PODPercentage = baseRecord.TotalNoPod != null
                    ? (
                          ((baseRecord.TotalCons - baseRecord.TotalNoPod) /
                              baseRecord.TotalCons) *
                          100
                      ).toFixed(2)
                    : "";
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
    
            // Perform validation
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
                Number.isNaN(baseRecord.KpiBenchMark) ||
                baseRecord.TotalCons < baseRecord.TotalFails ||
                baseRecord.TotalCons < baseRecord.TotalNoPod
            ) {
                setValidationErrors((prev) => ({
                    ...prev,
                    [`${columnId}`]: true,
                }));
                setDataSource(data); // Update the data source with the new edits
                return;
            } else {
                setValidationErrors((prev) => ({
                    ...prev,
                    [`${columnId}`]: false,
                }));
            }
    
            // Update dataSource before sending the request
            setDataSource(data);
    
            axios
                .post(`${url}Add/KpiPackRecord`, baseRecord, {
                    headers: {
                        UserId: currentUser.UserId,
                        Authorization: `Bearer ${AToken}`,
                    },
                })
                .then((res) => {
                    const { RecordId } = res.data;
                    if (!RecordId || RecordId === 0) {
                        throw new Error("Invalid RecordId returned.");
                    }
    
                    const updatedRecord = { ...baseRecord, RecordId: RecordId };
    
                    // Update recordMapRef.current with the latest RecordId and field values
                    recordMapRef.current[columnId] = updatedRecord;
    
                    const updatedData = updateLocalData(
                        localGraphData,
                        updatedRecord
                    );
                    setLocalGraphData(updatedData);
                    setGraphData(updatedData);
                })
                .catch((err) => {
                    console.error("Error updating recordMap:", err);
                });
        },
        [dataSource, url, currentUser.UserId, AToken]
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
            const hasError = validationErrors[cellProps.name];
            const isMetricColumn = col.name === "metric";
            cellProps.style.background = hasError ? "#f6d3d0" : "transparent";
            return (
                <div
                    style={{
                        fontWeight: isMetricColumn ? "bold" : "normal",
                        color: hasError ? "black" : "black",
                        backgroundColor: hasError ? "#f6d3d0" : "transparent",
                    }}
                >
                    <div className="test"> {value}</div>
                </div>
            );
        },
    }));

    return (
        <div className="mt-10">
            <ReactDataGrid
                idProperty="metric"
                style={{ minHeight: 284, fontWeight: "bold" }}
                onEditComplete={onEditComplete}
                columns={modifiedColumns}
                showZebraRows={false}
                dataSource={dataSource}
                showColumnMenuTool={false}
            />
        </div>
    );
}

export default InlineTable;
