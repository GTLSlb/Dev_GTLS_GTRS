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
    currentUser,
    getReportData,
    selectedReceiver,
    setGraphData,
    updateData,
}) {
    function generateMonthArrayFromJson(data) {
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
                            return `${datasetLabel}: ${value}`;
                        } else {
                            return `${datasetLabel}: ${value}%`;
                        }
                    },
                },
            },
        },
    };

    return (
        <div>
            {/* Charts */}
            <Bar ref={chartRef} data={data} options={options} />
            {/* Table */}
            <InlineTable
                getReportData={getReportData}
                graphData={graphData}
                url={url}
                currentUser={currentUser}
                selectedReceiver={selectedReceiver}
                setGraphData={setGraphData}
                updateData={updateData}
            />
        </div>
    );
}

export default BarGraph;
