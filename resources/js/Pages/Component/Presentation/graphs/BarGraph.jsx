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
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useRef } from "react";
import { useEffect } from "react";

import { useState } from "react";
import BarTable from "./BarTable";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Legend,
    Tooltip,
    Title
);
function BarGraph({ colLabel, dataTotal, dataOnTime, dataKPI, dataPOD }) {
    const chartRef = useRef(null);
    const [colWidth, setColWidth] = useState(0);

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

    useEffect(() => {
        if (chartRef.current) {
            const chart = chartRef.current;
            const chartArea = chart.chartArea;
            const barCount = chart.data.labels.length;
            const categoryWidth = (chartArea.right - chartArea.left) / barCount;
            setColWidth(categoryWidth);
        }
    }, []);

    function addEmptyStringAtStart(arr) {
        // Create a new array with an empty string at the start
        const updatedArray = ['', ...arr];
        return updatedArray;
      }

    return (
        <div>
            <Bar ref={chartRef} data={data} options={options} />
            <BarTable
                colKPI={dataKPI}
                colLabel={addEmptyStringAtStart(colLabel)}
                colTotal={dataTotal}
                colOnTime={dataOnTime}
                colPOD={dataPOD}
                colWidth={colWidth}
            />
        </div>
    );
}

export default BarGraph;
