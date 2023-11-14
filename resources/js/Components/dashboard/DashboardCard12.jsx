import React from "react";
import { useEffect } from "react";
import BarChart from "../charts/BarChart03";

// Import utilities
import { tailwindConfig } from "../utils/Utils";
import { useState } from "react";
function DashboardCard12(props) {
    const { stateCounterData } = props;
    const [chartData, setchartData] = useState({
        labels: [],
        datasets: [],
    });
    useEffect(() => {
        if (stateCounterData !== null) {
            const tempchart = {
                labels: ["Reasons"],
                datasets: [   
                    {
                        label: "VIC",
                        data: [stateCounterData?.VicCounter],
                        backgroundColor:
                        "#d5b132",
                        hoverBackgroundColor:
                        "#4F4F4F",
                        barPercentage: 1,
                        categoryPercentage: 1,
                    },
                    {
                        label: "NSW",
                        data: [stateCounterData?.NswCounter],
                        backgroundColor:
                        tailwindConfig().theme.colors.gray[500],
                        hoverBackgroundColor:
                        "#c2bdab",
                        barPercentage: 1,
                        categoryPercentage: 1,
                    },
                    {
                        label: "QLD",
                        data: [stateCounterData?.QldCounter],
                        backgroundColor: "#1e191a",
                        hoverBackgroundColor:
                        "#84867f",
                        barPercentage: 1,
                        categoryPercentage: 1,
                    },
                    {
                        label: "SA",
                        data: [stateCounterData?.SACounter],
                        backgroundColor:
                        "#cabe9b",
                        hoverBackgroundColor:
                        "#8E919B",
                        barPercentage: 1,
                        categoryPercentage: 1,
                    },
                    {
                        label: "ACT",
                        data: [stateCounterData?.ACTCounter],
                        backgroundColor:
                        "#F7DC6F",
                        hoverBackgroundColor:
                        "#8E919B",
                        barPercentage: 1,
                        categoryPercentage: 1,
                    },
                ],
            };
            setchartData(tempchart);
        }
    },[stateCounterData]);
  

    return (
        <div className="col-span-full h-full xl:col-span-6  bg-white shadow-lg rounded-lg border border-slate-200">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">
                    Consignment By State
                </h2>
            </header>
            {/* Chart built with Chart.js 3 */}
            <div className="grow">
                {/* Change the height attribute to adjust the chart height */}
                <BarChart data={chartData} width={595} height={48} />
            </div>
        </div>
    );
}

export default DashboardCard12;
