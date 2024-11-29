import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/plots";

const BasicPieCharts = (props) => {
    const chartTitle = props.chartTitle;
    const chartData = props.chartData;
    const [data, setData] = useState([]);
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
            content: "{name} - {value} - {percentage}",
            style: {
                fontSize: 12,
              },
        },
        interactions: [
            {
                type: "element-selected",
            },
            {
                type: "element-active",
            },
        ],
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

export default BasicPieCharts;
