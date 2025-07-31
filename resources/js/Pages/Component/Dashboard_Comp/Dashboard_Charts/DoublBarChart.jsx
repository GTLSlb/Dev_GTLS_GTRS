import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Column } from "@ant-design/plots";

const DoubleBarChart = (props) => {
    const {
        chartTitle,
        chartData,
        setShowTable,
        setChartFilter,
        setChartName,
    } = props;

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
            layout: [
                {
                    type: "interval-hide-overlap",
                },
                {
                    type: "adjust-color",
                },
            ],
        },
        onReady: (plot) => {
            plot.on("element:click", (event) => {
                const { data } = event.data;

                if (chartTitle === "POD True vs False") {
                    const [year, month] = data.monthYear.split("-");
                    const startDate = `01-${month}-${year}`;
                    const lastDay = new Date(year, month, 0).getDate(); // Correctly gets the last day of the month
                    const endDate = `${lastDay}-${month}-${year}`; // Formats it as "DD-MM-YYYY"

                    setChartName(chartTitle);
                    setChartFilter((prev) => ({
                        ...prev,
                        dateStart: startDate,
                        dateEnd: endDate,
                        PODValue: data.pod === "true" ? [true] : [false],
                    }));
                }

                setShowTable(true);
            });
        },
    };
    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg h-full rounded-sm border border-slate-200 ">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">{chartTitle}</h2>
            </header>
            <Column {...config} className="p-4" />
        </div>
    );
};

DoubleBarChart.propTypes = {
    chartTitle: PropTypes.string,
    chartData: PropTypes.array,
    setShowTable: PropTypes.func,
    setChartFilter: PropTypes.func,
    setChartName: PropTypes.func,
};

export default DoubleBarChart;
