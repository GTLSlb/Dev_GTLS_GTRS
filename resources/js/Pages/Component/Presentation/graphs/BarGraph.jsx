import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Legend,
    Tooltip,
    Title,
    LineController, // Import LineController
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useRef } from "react";
import { useEffect } from "react";

import { useState } from "react";
import BarTable from "./BarTable";
import InlineTable from "./InlineTable";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Legend,
    Tooltip,
    Title,
    LineController // Register LineController
);
function BarGraph({
    graphData,
    url,
    AToken,
    CustomerId,
    originalgraphData,
    currentUser,
    setGraphData,
    getReportData,
    selectedReceiver,
}) {

    // useEffect(() => {
    //     getReportData();
    // }, [graphData]);
    function generateMonthArrayFromJson(data) {
        const monthNames = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
        ];
        let result = [];

        data.forEach((item) => {
            const date = new Date(item.MonthDate);
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            result.push(`${month} ${year}`);
        });

        return result;
    }

    function getFieldArrayFromJson(data, fieldLabel) {
        let result = [];

        data.forEach((item) => {
            if (item.Record && item.Record.length > 0) {
                const record = item.Record[0];
                result.push(
                    record[fieldLabel] !== undefined ? record[fieldLabel] : 0
                );
            } else {
                result.push(0);
            }
        });

        return result;
    }

    let colLabel = generateMonthArrayFromJson(graphData);
    let dataTotal = getFieldArrayFromJson(graphData, "TotalCons");
    let dataKPI = getFieldArrayFromJson(graphData, "KpiBenchMark");
    let dataOnTime = getFieldArrayFromJson(graphData, "onTimePercentage");
    let dataPOD = getFieldArrayFromJson(graphData, "PODPercentage");

    const chartRef = useRef(null);

    const data = {
        labels: colLabel,
        datasets: [
            {
                type: "bar",
                label: "Total",
                backgroundColor: "rgba(219, 198, 119)",
                data: dataTotal,
                yAxisID: "y-axis-bar",
            },
            {
                type: "line",
                label: "Ontime %",
                backgroundColor: "rgba(0, 196, 89)",
                borderColor: "rgba(0, 196, 89)",
                borderWidth: 2,
                fill: false,
                data: dataOnTime,
                yAxisID: "y-axis-line",
            },
            {
                type: "line",
                label: "KPI Bench Mark",
                backgroundColor: "rgb(255, 0, 0)",
                borderColor: "rgb(255, 0, 0)",
                borderWidth: 2,
                fill: false,
                data: dataKPI,
                yAxisID: "y-axis-line",
            },
            {
                type: "line",
                label: "POD %",
                backgroundColor: "rgb(61,123,199)",
                borderColor: "rgb(61,123,199)",
                borderWidth: 2,
                fill: false,
                data: dataPOD,
                yAxisID: "y-axis-line",
            },
        ],
    };

    const options = {
        aspectRatio: 4,
        responsive: true,
        scales: {
            x: {
                stacked: false,
            },
            "y-axis-bar": {
                type: "linear",
                position: "left",
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Total Count",
                },
            },
            "y-axis-line": {
                type: "linear",
                position: "right",
                beginAtZero: false,
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: "Percentage",
                },
            },
        },
        plugins: {
            tooltip: {
                mode: "index",
                intersect: false,
                callbacks: {
                    title: function (tooltipItems) {
                        return tooltipItems[0].label;
                    },
                    label: function (tooltipItem) {
                        let datasetLabel = tooltipItem.dataset.label || "";
                        let value = tooltipItem.raw;
                        let yAxisID = tooltipItem.dataset.yAxisID;

                        if (yAxisID === "y-axis-bar") {
                            return `${datasetLabel}: ${parseFloat(value).toFixed(2)}`;
                        } else {
                            return `${datasetLabel}: ${parseFloat(value).toFixed(2)}%`;
                        }
                    },
                },
            },
        },
    };

    function updateLocalDataFromJson(newData) {
        // Check if the newData object has the required properties
        if (!newData || !newData.labels || !newData.datasets) {
            console.error("Invalid data format. Please provide a valid JSON object.");
            return;
        }

        // Use the chart reference to access the chart instance
        const chart = chartRef.current;

        if (!chart) {
            console.error("Chart reference is not available.");
            return;
        }

        // Update the labels by merging existing and new labels
        const updatedLabels = Array.from(new Set([...chart.data.labels, ...newData.labels]));

        // Update the datasets
        newData.datasets.forEach((newDataset) => {
            const existingDatasetIndex = chart.data.datasets.findIndex(
                (dataset) => dataset.label === newDataset.label
            );

            if (existingDatasetIndex !== -1) {
                // Update the existing dataset
                chart.data.datasets[existingDatasetIndex].data = mergeData(
                    updatedLabels,
                    chart.data.datasets[existingDatasetIndex].data,
                    newData.labels,
                    newDataset.data
                );
            } else {
                // Add new dataset
                chart.data.datasets.push({
                    ...newDataset,
                    data: mergeData(updatedLabels, [], newData.labels, newDataset.data)
                });
            }
        });

        // Update the chart labels
        chart.data.labels = updatedLabels;

        // Update the chart
        chart.update(); // Pass 'none' to skip animations

        // Optional: Log updated data for debugging
    }

    // Helper function to merge dataset values based on matching labels
    function mergeData(allLabels, existingData, newLabels, newData) {
        // Create a map of new labels to their corresponding data values
        const newDataMap = newLabels.reduce((map, label, index) => {
            map[label] = newData[index];
            return map;
        }, {});

        // Merge existing data with new data based on all labels
        return allLabels.map((label, index) => {
            // If the label is in the new data map, use its value; otherwise, use the existing value or 0
            return newDataMap[label] !== undefined ? newDataMap[label] : (existingData[index] || 0);
        });
    }

    return (
        <div>
            {/* Charts */}
            <Bar ref={chartRef} data={data} options={options} />
            {/* Table */}
            <InlineTable
                AToken={AToken}
                getReportData={getReportData}
                CustomerId={CustomerId}
                graphData={graphData}
                originalgraphData={originalgraphData}
                url={url}
                currentUser={currentUser}
                setGraphData={setGraphData}
                selectedReceiver={selectedReceiver}
            />
        </div>
    );
}

export default BarGraph;
