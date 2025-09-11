import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Pie } from "@ant-design/plots";

const BasicPieCharts = (props) => {
    const {
        chartTitle,
        chartData,
        setShowTable,
        setChartFilter,
        setChartName,
    } = props;
    const [data, setData] = useState([]);
    const [legendPosition, setLegendPosition] = useState("right");

    const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);

    const updateLegendPosition = () => {
        if (window.innerWidth <= 1550) {
            setLegendPosition("bottom"); // Laptop screen or smaller
        } else {
            setLegendPosition("right"); // Larger screens
        }
    };

    useEffect(() => {
        // Update legend position on load
        updateLegendPosition();

        // Add event listener for screen resize
        window.addEventListener("resize", updateLegendPosition);

        // Clean up the event listener
        return () => {
            window.removeEventListener("resize", updateLegendPosition);
        };
    }, [window.innerWidth]);

    useEffect(() => {
        setData(chartData);
    }, [chartData]);

    const config = {
        appendPadding: 10,
        data,
        angleField: "value",
        colorField: "label",
        color: [
            "#E2C047",
            "#4F4F4F",
            "#F1E6C4",
            "#9c8b80",
            "#c2bdab",
            "#84867f",
            "#f8dc9d",
            "#d9e74",
        ],
        radius: 0.75,
        label: {
            type: "spider",
            labelHeight: 30,
            // content: "{name} - {value} - {percentage}",
            content: (data) =>
                `${data.value.toLocaleString()} (${(data.percent * 100).toFixed(
                    2
                )} %)`,
            style: {
                fontSize: 12,
                textAlign: "center",
                lineHeight: 16, // Adjust line height to improve wrapping
                wordBreak: "break-word", // Allow word wrapping
            },
        },
        tooltip: {
            formatter: (datum) => {
                return {
                    name: datum.label,
                    value: `${((datum.value / totalValue) * 100).toFixed(2)}%`, // Display percentage
                };
            },
        },
        legend: {
            position: legendPosition,
            layout: legendPosition === "bottom" ? "horizontal" : "vertical",
        },
        interactions: [
            {
                type: "element-selected",
            },
            {
                type: "element-active",
            },
        ],
        state: {
            active: {
                style: {
                    cursor: "pointer",
                },
            },
        },
        onReady: (plot) => {
            plot.on("element:dblclick", (event) => {
                const { data } = event.data;

                setChartName(chartTitle);
                if (chartTitle === "On Time Performance") {
                    const value =
                        data.label === "Delivered on Time" ? "PASS" : "FAIL";

                    setChartFilter((prev) => ({
                        ...prev,
                        consStatus: value,
                    }));
                } else if (chartTitle === "Consignment Status") {
                    setChartFilter((prev) => ({
                        ...prev,
                        consStatus: data.label,
                    }));
                } else if (chartTitle === "POD Status By State") {
                    setChartFilter((prev) => ({
                        ...prev,
                        ReceiverState: data.label,
                        PODValue: [true],
                    }));
                } else if (chartTitle === "KPI Status") {
                    const value =
                        data.label === "Pass"
                            ? 1
                            : data.label === "N/A"
                            ? 0
                            : 2;
                    setChartFilter((prev) => ({
                        ...prev,
                        MatchDel: [value],
                    }));
                }

                setShowTable(true);
                // alert(`You clicked on ${data.label} with value ${data.value}`);
            });
        },
    };
    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg h-full rounded-sm border border-slate-200 ">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">{chartTitle}</h2>
            </header>
            <Pie {...config} className="p-4" />
        </div>
    );
};

BasicPieCharts.propTypes = {
    chartTitle: PropTypes.string,
    chartData: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.number,
        })
    ),
    setShowTable: PropTypes.func,
    setChartFilter: PropTypes.func,
    setChartName: PropTypes.func,
};

export default BasicPieCharts;
