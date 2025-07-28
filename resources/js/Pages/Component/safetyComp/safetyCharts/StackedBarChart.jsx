import React from "react";
import PropTypes from "prop-types";
import { Column } from "@ant-design/plots";
import { each, groupBy } from "@antv/util";

const StackedBarChart = (props) => {
    const chartTitle = props.chartTitle;
    const data = props.byStateAndType;
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
        xField: "state",
        yField: "value",
        color: ["#E2C047", "#8E919B", "#4F4F4F"],
        seriesField: "type",
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
            <Column {...config} className="p-4"/>
        </div>
    );
};

StackedBarChart.propTypes = {
    chartTitle: PropTypes.string,
    byStateAndType: PropTypes.arrayOf(
        PropTypes.shape({
            state: PropTypes.string,
            type: PropTypes.string,
            value: PropTypes.number,
        })
    ),
};

export default StackedBarChart;
