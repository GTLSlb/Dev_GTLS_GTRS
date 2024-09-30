import React, { useState, useEffect } from "react";
import { Line } from "@ant-design/plots";

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
                    `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
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

export default MultiChartLine;
