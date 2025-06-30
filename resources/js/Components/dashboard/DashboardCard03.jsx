import React, { useEffect, useState } from "react";
import BarChart from "../charts/BarChart03";
import PropTypes from "prop-types";

// Import utilities
import { tailwindConfig } from "@/Components/utils/Utils";

function DashboardCard11(props) {
    const { weightStateData } = props;
    const [chartData, setchartData] = useState({
        labels: [],
        datasets: [],
    });
    useEffect(() => {
        if (weightStateData !== null) {
            const tempchart = {
                labels: ["Reasons"],
                datasets: [
                            
                    {
                        label: "VIC",
                        data: [weightStateData.weightforVIC],
                        backgroundColor:
                        "#d5b132",
                        hoverBackgroundColor:
                            tailwindConfig().theme.colors.gray[800],
                        barPercentage: 1,
                        categoryPercentage: 1,
                    },
                    {
                        label: "NSW",
                        data: [weightStateData.weightforNSW],
                        backgroundColor:
                        tailwindConfig().theme.colors.gray[500],
                        hoverBackgroundColor:
                        "#F1E6C4",
                        barPercentage: 1,
                        categoryPercentage: 1,
                    },
                    {
                        label: "QLD",
                        data: [weightStateData.weightforQLD],
                        backgroundColor:
                        "#1e191a",
                        hoverBackgroundColor:
                        "#E2C047",
                        barPercentage: 1,
                        categoryPercentage: 1,
                    },
                    {
                        label: "SA",
                        data: [weightStateData.weightforSA],
                        backgroundColor: "#cabe9b",
                        hoverBackgroundColor:
                        "#E2C047",
                        barPercentage: 1,
                        categoryPercentage: 1,
                    },
                    {
                        label: "ACT",
                        data: [weightStateData.weightforACT],
                        backgroundColor:
                        "#F7DC6F",
                        hoverBackgroundColor:
                        "#E2C047",
                        barPercentage: 1,
                        categoryPercentage: 1,
                    },
                ],
            };
            setchartData(tempchart);
        }
        
    }, [weightStateData]);

  

    return (
        <div className="col-span-full h-full xl:col-span-6 lg:col-span-4 bg-white shadow-lg rounded-lg border border-slate-200">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">
                    Weight By State{" "}
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

DashboardCard11.propTypes = {
    weightStateData: PropTypes.object.isRequired,
};

export default DashboardCard11;
