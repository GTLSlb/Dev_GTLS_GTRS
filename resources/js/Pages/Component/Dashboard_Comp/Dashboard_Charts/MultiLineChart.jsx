import React, { useState, useEffect } from "react";
import { Line } from "@ant-design/plots";
import PropTypes from "prop-types";

const MultiChartLine = (props) => {
    const chartData = props.chartData;
    const chartTitle = props.chartTitle;
    const [data, setData] = useState([]);
    
    useEffect(() => {
        const filteredData = chartData.filter(
            (item) => !isNaN(Date.parse(item.month)) && !isNaN(item.amount)
        );
        setData(filteredData);
    }, [chartData]);
    
    const config = {
        data,
        xField: "month",
        yField: "amount",
        seriesField: "state",
        color: [
            "#B49115",
            "#8E919B",
            "#4F4F4F",
            "#D0C194",
            "#FFDB49",
        ],
        xAxis: {
            type: "cat",
        },
        yAxis: {
            label: {
                formatter: (v) =>
                    v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
        },
        
        tooltip: {
            formatter: (datum) => ({
                name: datum.state,
                value: Number(datum.amount)
                    .toFixed(2) // Limit to two decimal places
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ","), // Add commas
            }),
        },
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg h-full rounded-sm border border-slate-200 ">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800"> {chartTitle} </h2>
            </header>
            <Line {...config} className="p-4" />
        </div>
    );
};

MultiChartLine.propTypes = {
    chartData: PropTypes.array.isRequired,
    chartTitle: PropTypes.string.isRequired,
};

export default MultiChartLine;
