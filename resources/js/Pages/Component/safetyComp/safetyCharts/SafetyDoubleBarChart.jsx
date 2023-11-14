import React from "react";
// import BarChart01 from '../../charts/BarChart01';
import BarChart01 from "./Charts/SafetyBarChart01";
// Import utilities
import { tailwindConfig } from "@/Components/utils/Utils";

function MultiBarChart(props) {
    const chartTitle = props.chartTitle;
    const typesbymonth = props.typesbymonth;
    const safetyTypes = props.safetyTypes;

    function getChartData(data) {
        const labels = Object.keys(data);
        const types = Array.from(
            new Set(Object.values(data).flatMap(Object.keys))
        );

        const typeValues = types.map((type) => {
            return labels.map((label) =>
                data[label][type] !== undefined ? data[label][type] : 0
            );
        });

        const datasets = types.map((type, index) => {
            const safetyType = safetyTypes.find(
                (s) => s.SafetyTypeId === Number(type)
            );

            const backgroundColor = [
                "#4F4F4F",
                "#F1E6C4",
                "#E2C047",
                "#f8dc9d",
                "#d9e74",
                "#9c8b80",
                "#c2bdab",
                "#84867f",
            ][index];
            const hoverBackgroundColor = [
                "#B49115",
                "#535B6B",
                "#000000",
                "#E2C047",
                "#f8dc9d",
                "#d9e74",
                "#9c8b80",
                "#c2bdab",
                "#84867f",
            ][index];

            return {
                label: safetyType ? safetyType.SafetyTypeName : `Type ${type}`,
                data: typeValues[index],
                backgroundColor: backgroundColor,
                hoverBackgroundColor: hoverBackgroundColor,
                barPercentage: 0.66,
                categoryPercentage: 0.66,
            };
        });

        return {
            labels: labels,
            datasets: datasets,
        };
    }

    const chartData = getChartData(typesbymonth);
    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg h-full rounded-sm border border-slate-200">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">{chartTitle}</h2>
            </header>
            {/* Chart built with Chart.js 3 */}
            {/* Change the height attribute to adjust the chart height */}
            <BarChart01 data={chartData} width={595} height={248} />
        </div>
    );
}

export default MultiBarChart;
