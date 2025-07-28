import React, { useState } from "react";
import BarChart from "../charts/BarChart01";
import { useEffect } from "react";
import PropTypes from "prop-types";

function DashboardCard02(props) {
    const { consByMonthData } = props;
    const [chartData, setchartData] = useState({
      labels : [],
      datasets : [],
    });

    useEffect(() => {
        if (consByMonthData !== null) {
            const tempchart = {
                labels: consByMonthData.firstDaysOfMonth,
                datasets: [
                    {
                        label: "Counter",
                        data: Object.values(
                            consByMonthData?.consignmentCounter
                        ),
                        backgroundColor:
                            "#d5b132",
                        hoverBackgroundColor:
                            "#1e191a",
                        barPercentage: 0.66,
                        categoryPercentage: 0.66,
                    },
                ],
            }
            setchartData(tempchart);
        }
    }, [consByMonthData])

    return (
        <div className="flex flex-col h-full col-span-full lg:col-span-8 sm:col-span-6 bg-white shadow-lg rounded-lg border border-slate-200">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">
                    Consignment By Month
                </h2>
            </header>
            {/* Chart built with Chart.js 3 */}
            {/* Change the height attribute to adjust the chart height */}
            <BarChart data={chartData} width={595} height={200} />
        </div>
    );
}

DashboardCard02.propTypes = {
    consByMonthData: PropTypes.object,
};

export default DashboardCard02;
