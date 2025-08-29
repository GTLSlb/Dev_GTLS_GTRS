import React, { useState } from "react";
import PropTypes from "prop-types";
// import BarChart01 from "../charts/BarChart01";
import BarChart01 from "@/Components/charts/BarChart01";
import { useEffect } from "react";

function SafetyCard02(props) {
    const { barValues } = props;
    const chartTitle = props.chartTitle;
    const [chartData, setchartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        if (barValues !== null) {
            const tempchart = {
                datasets: [
                    {
                        label: "Counter",
                        data: barValues,

                        backgroundColor: "#E2C047",
                        hoverBackgroundColor: "#B49115",
                        barPercentage: 0.66,
                        categoryPercentage: 0.66,
                    },
                ],
            };
            setchartData(tempchart);
        }
    }, []);

    return (
        <div className="flex flex-col h-full col-span-full lg:col-span-8 sm:col-span-6 bg-white shadow-lg rounded-lg border border-slate-200">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">{chartTitle}</h2>
            </header>
            {/* Chart built with Chart.js 3 */}
            {/* Change the height attribute to adjust the chart height */}
            <BarChart01 data={chartData} width={595} height={200} />
        </div>
    );
}

SafetyCard02.propTypes = {
    barValues: PropTypes.array,
    chartTitle: PropTypes.string,
};

export default SafetyCard02;
