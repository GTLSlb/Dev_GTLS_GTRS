import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";

const BasicColumnCharts = (props) => {
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
        xField: "data",
        yField: "value",
        color: "#ebcb7a", // Set the color of the columns to blue
        label: {
            //  label
            position: "middle",
            // 'top', 'bottom', 'middle',
            style: {
                fill: "#000000",
                opacity: 1,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            state: {
                alias: "State",
            },
            value: {
                alias: "Counter",
            },
        },
        onReady: (plot) => {
            plot.on("element:click", (event) => {
                const { data } = event.data;

                setChartName(chartTitle);
                if (chartTitle === "Consignment By Month") {
                    const [year, month] = data.data.split("-");
                    const startDate = `01-${month}-${year}`;
                    const lastDay = new Date(year, month, 0).getDate(); // Correctly gets the last day of the month
                    const endDate = `${lastDay}-${month}-${year}`; // Formats it as "DD-MM-YYYY"

                    setChartFilter((prev) => ({
                        ...prev,
                        dateStart: startDate,
                        dateEnd: endDate,
                    }));
                } else if (
                    chartTitle === "Weight By state" ||
                    chartTitle === "Consignments By state"
                ) {
                    setChartFilter((prev) => ({
                        ...prev,
                        ReceiverState: data.data,
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
            <Column {...config} className="p-4" />
        </div>
    );
};

export default BasicColumnCharts;
