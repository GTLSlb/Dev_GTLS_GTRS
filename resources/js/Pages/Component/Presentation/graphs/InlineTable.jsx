import React, { useState, useCallback, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import axios from "axios";
import "../../../../../css/graphTable.css";
import { AlertToast } from "@/permissions";
import { ToastContainer } from "react-toastify";
import { CustomContext } from "@/CommonContext";

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
        setLocalGraphData(graphData);
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

    const columns = [
        { name: "metric", header: "", defaultFlex: 1, minWidth: 100 },
    ];
    const originalDataTemplate = {};

    const recordMap = {};

    function CustomNumericEditor(props) {
        const { value, onChange, onComplete, cellProps } = props;
        const [inputValue, setInputValue] = useState(value);

        let max;
        if (cellProps.rowIndex === 0 || cellProps.rowIndex === 3) {
            max = null;
        } else {
            max = dataSource[0][cellProps.id];
        }

        const onValueChange = (e) => {
            let newValue = e.target.value;

            if (cellProps.rowIndex === 1 || cellProps.rowIndex === 2) {
                if (max !== null && parseFloat(newValue) > max) {
                    newValue = max;
                }
            }

            setInputValue(newValue);
            onChange(newValue);
        };

        const handleComplete = () => {
            onComplete(inputValue);
        };

        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                handleComplete();
            }
        };

        return (
            <input
                type="number"
                min={0}
                max={null}
                step={1}
                value={inputValue}
                onChange={onValueChange}
                onBlur={handleComplete}
                onKeyDown={handleKeyDown}
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
            editor: CustomNumericEditor,

            editable: (editValue, cellProps) => {
                return (
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
            recordMap[columnName] = {
                ...record,
            };
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
            recordMap[columnName] = {
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

    const [dataSource, setDataSource] = useState(originalData);
    const [validationErrors, setValidationErrors] = useState({});

    const onEditComplete = useCallback(
        ({ value, columnId, rowIndex }) => {
            const data = [...dataSource];
            let formattedValue = value;

            if (rowIndex === 3) {
                formattedValue =
                    value == null ? "" : `${parseFloat(value).toFixed(2)}%`;
            }

            data[rowIndex][columnId] = formattedValue;

            const baseRecord = { ...recordMap[columnId] };
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

            baseRecord[updatedField] = parseFloat(value);

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

            recordMap[columnId] = baseRecord;

            axios
                .post(`${url}Add/KpiPackRecord`, baseRecord, {
                    headers: {
                        UserId: user.UserId,
                        Authorization: `Bearer ${Token}`,
                    },
                })
                .then(() => {
                    const updatedData = updateLocalData(
                        localGraphData,
                        baseRecord
                    );

                    setLocalGraphData(updatedData);
                    setGraphData(updatedData);
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
                            ...newRecord,
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
                    <div className="test">{value}</div>
                </div>
            );
        },
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
                editable={true}
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
