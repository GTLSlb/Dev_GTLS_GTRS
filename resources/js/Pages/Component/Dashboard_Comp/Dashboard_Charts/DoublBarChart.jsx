import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";

const DoubleBarChart = (props) => {
    const chartData = props.chartData;
    const chartTitle = props.chartTitle;
    const [data, setData] = useState([]);
    useEffect(() => {
        setData(chartData);
    }, [chartData]);
    const config = {
        data,
        isGroup: true,
        xField: "monthYear",
        yField: "value",
        seriesField: "pod",
        color: ["#ebcb7a", "#4F4F4F"],
        label: {
            position: "middle",
            // 'top', 'bottom', 'middle'
            layout: [
                // {
                //     type: "interval-adjust-position",
                // }, 
                {
                    type: "interval-hide-overlap",
                },
                {
                    type: "adjust-color",
                },
            ],
        },
    };
    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg h-full rounded-sm border border-slate-200 ">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">{chartTitle}</h2>
            </header>
            {/*  <div className="">
                
            </div> */}
            <Column {...config} className="p-4" />
        </div>
    );
};

export default DoubleBarChart;
