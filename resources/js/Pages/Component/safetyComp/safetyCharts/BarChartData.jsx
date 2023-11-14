import React from "react";
import { useEffect } from "react";
import DoughnutChart from "./Charts/DoughnutChart";
// Import utilities
import { useState } from "react";
import { tailwindConfig } from "@/Components/utils/Utils";

function BarCharData(props) {
    const chartPerc = props.chartPerc;
    const chartTitle = props.chartTitle;
    const safetyTypes = props.safetyTypes;
    const [chartData, setchartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        if (chartPerc !== null) {
            const entries = Object.entries(chartPerc);
            const tempChartData = {
                labels: entries.map((entry) => {
                    const value = parseInt(entry[0]);
                    const safetyType = safetyTypes.find(
                        (type) => type.SafetyTypeId === value
                    );
                    return safetyType ? safetyType.SafetyTypeName : value;
                }),

                datasets: [
                    {
                        label: "Total",
                        data: entries.map((entry) => entry[1]),
                        backgroundColor: [
                            "#4F4F4F",
                            "#F1E6C4",
                            "#E2C047",
                            "#f8dc9d",
                            "#d9e74",
                            "#9c8b80",
                            "#c2bdab",
                            "#84867f",
                        ],
                        hoverBackgroundColor: ["#000000", "#D0C194", "#B49115"],
                        hoverBorderColor: tailwindConfig().theme.colors.white,
                    },
                ],
            };
            setchartData(tempChartData);
        }
    }, [chartPerc]);

    return (
        <div className="flex flex-col h-full col-span-full sm:col-span-4 xl:col-span-4 bg-white shadow-lg rounded-lg border border-slate-200">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">{chartTitle}</h2>
            </header>
            <DoughnutChart data={chartData} width={389} height={200} />
        </div>
    );
}

export default BarCharData;


