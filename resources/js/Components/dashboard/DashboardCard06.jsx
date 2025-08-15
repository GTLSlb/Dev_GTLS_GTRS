import React from "react";
import { useEffect } from "react";
import DoughnutChart from "../charts/DoughnutChart";
import PropTypes from "prop-types";
// Import utilities
import { useState } from "react";
import { tailwindConfig } from "../utils/Utils";


function DashboardCard06(props) {
  const chartTitle=props.chartTitle;
    const { consStatusData } = props;
    const [chartData, setChartData] = useState({
      labels: [],
      datasets: [],
    });
    
    useEffect(() => {
      if (consStatusData !== null) {
    
        const tempChartData = {
          labels: Object.keys(consStatusData),
          datasets: [
            {
              label: "Total",
              data: Object.values(consStatusData),
              backgroundColor: [
                "#4F4F4F",
                "#9c8b80",
                "#E2C047",
                "#84867f",
                "#F1E6C4",
                "#c2bdab",
                "#84867f",
                "#f8dc9d",
            ],
              hoverBackgroundColor: [
                "#B49115",
                "#c2bdab",
                "#f8dc9d",
                "#E2C047",
                "#f8dc9d",
                "#9c8b80",
                "#c2bdab",
                "#84867f",
              ],
              hoverBorderColor: tailwindConfig().theme.colors.white,
            },
          ],
        };
    
        setChartData(tempChartData);
      }
    }, [consStatusData]);

    return (
        <div className="flex flex-col h-full col-span-full sm:col-span-4 xl:col-span-4 bg-white shadow-lg rounded-lg border border-slate-200">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">
                    {chartTitle}
                </h2>
            </header>
            {/* Chart built with Chart.js 3 */}
            {/* Change the height attribute to adjust the chart height */}
            <DoughnutChart data={chartData} width={389} height={200} />
        </div>
    );
}

DashboardCard06.propTypes = {
    chartTitle: PropTypes.string,
    consStatusData: PropTypes.object,
};

export default DashboardCard06;
