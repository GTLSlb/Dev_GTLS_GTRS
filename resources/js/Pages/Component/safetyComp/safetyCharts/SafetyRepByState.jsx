import React from "react";
import BarChart03 from "@/Components/charts/BarChart03";
import { tailwindConfig } from "@/Components/utils/Utils";
import { useState } from "react";
import { useEffect } from "react";

function SafetyRepByState(props) {
    function sumObjectValues(obj) {
        let sum = 0;
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                sum += obj[key];
            }
        }
        return sum;
    }
    const chartTitle = props.chartTitle;
    const singleBarValue = props.singleBarValue;
    const totalSum = sumObjectValues(singleBarValue);
    useEffect(() => {
        if (singleBarValue !== null) {
            const chartData = {
                labels: ["Reasons"],
                datasets: getChartData(singleBarValue),
            };
        }
    }, [singleBarValue]);

    function getChartData(stateCounts) {
        const colorArray = [
            "#F5D657",
            "#A3A6AF",
            "#7F7F7F",
            "#F3E9CE",
            "#FFED93",
            "#E2C047",
            "#8E919B",
            "#4F4F4F",
            "#F1E6C4",
            "#FFE680",
        ];

        const datasets = Object.entries(stateCounts).map(
            ([label, value], index) => {
                const backgroundColor =
                    colorArray.length > 0
                        ? colorArray[index % colorArray.length]
                        : "#000000";
                const hoverBackgroundColor =
                    colorArray.length > 0
                        ? colorArray[(index + 5) % colorArray.length]
                        : "#000000";

                return {
                    label: label,
                    data: [value],
                    backgroundColor: backgroundColor,
                    hoverBackgroundColor: hoverBackgroundColor,
                    barPercentage: 1,
                    categoryPercentage: 1,
                };
            }
        );

        return datasets;
    }

    const chartData = {
        labels: ["Reasons"],
        datasets: getChartData(singleBarValue),
    };

    return (
        <div className="col-span-full xl:col-span-6 bg-white shadow-lg h-full rounded-sm border border-slate-200">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">{chartTitle}</h2>
            </header>
            <div className="px-5 py-3">
                <div className="flex items-start">
                    <div className="text-3xl font-bold text-slate-800 mr-2">
                        {totalSum} Reports
                    </div>
                </div>
            </div>
            {/* Chart built with Chart.js 3 */}
            <div className="grow">
                {/* Change the height attribute to adjust the chart height */}
                <BarChart03 data={chartData} width={595} height={48} />
            </div>
        </div>
    );
}

export default SafetyRepByState;
