import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { each, groupBy } from "@antv/util";
import { useRef } from "react";

const DashStackedBarChart = (props) => {
    const chartRef = useRef(null);
    const chartTitle = props.chartTitle;
    const byStateAndType = props.chartData;
    const [data, setData] = useState(byStateAndType);
    // Generate annotations for each year
    const generateAnnotations = () => {
        const annotations = [];
        each(groupBy(data, "state"), (values, k) => {
            const value = values.reduce((a, b) => a + b.value, 0);
            annotations.push({
                type: "text",
                position: [k, value],
                content: `${value}`,
                style: {
                    textAlign: "center",
                    fontSize: 13,
                },
                offsetY: -10,
            });
        });
        return annotations;
    };
    const config = {
        data,
        isStack: true,
        xField: "date",
        yField: "amount",
        color: [
            "#4F4F4F",
            "#F1E6C4",
            "#E2C047",
            "#f8dc9d",
            "#d9e74",
            "#9c8b80",
            "#c2bdab",
            "#84867f",
        ],
        seriesField: "state",
        label: {
            position: "middle",
            layout: [
                {
                    type: "interval-adjust-position",
                },
                {
                    type: "interval-hide-overlap",
                },
                {
                    type: "adjust-color",
                },
            ],
        },
        annotations: generateAnnotations(),
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

export default DashStackedBarChart;
