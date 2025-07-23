import React, { useEffect } from "react";
import BarChart from "../charts/BarChart01";

// Import utilities
import PropTypes from "prop-types";
import { useState } from "react";
function DashboardCard04(props) {
    const { podCounterData } = props;
    const [chartData, setchartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        if (podCounterData !== null) {
            const arrayofDates = podCounterData.firstDaysOfMonth;
            const objectWithFalseDates = podCounterData.resultforFalsePOD;
            const objectWithTrueDates = podCounterData.resultforTruePOD;
            arrayofDates.forEach((date) => {
                // If the date is not present in the object, add it with a value of 0
                if (!objectWithFalseDates[date]) {
                    objectWithFalseDates[date] = 0;
                }
            });
            const falsedataArray = Object.entries(objectWithFalseDates).map(
                ([date, value]) => ({ date, value })
            );
            falsedataArray.sort((a, b) => new Date(a.date) - new Date(b.date));

            const falseobj = falsedataArray.reduce((acc, { date, value }) => {
                acc[date] = value;
                return acc;
            }, {});
            const falseCounter = Object.values(falseobj);

            const truedataArray = Object.entries(objectWithTrueDates).map(
                ([date, value]) => ({ date, value })
            );
            truedataArray.sort((a, b) => new Date(a.date) - new Date(b.date));

            const trueobj = truedataArray.reduce((acc, { date, value }) => {
                acc[date] = value;
                return acc;
            }, {});
            const trueCounter = Object.values(trueobj);
            const tempchart = {
              labels: podCounterData.firstDaysOfMonth,
              datasets: [
                  // Light blue bars
                  {
                      label: "False",
                      data: falseCounter,
                      backgroundColor: "#1e191a",
                      hoverBackgroundColor: "#cabe9b",
                      barPercentage: 0.66,
                      categoryPercentage: 0.66,
                  },
                  // Blue bars
                  {
                      label: "True",
                      data: trueCounter,
                      backgroundColor: "#d5b132",
                      hoverBackgroundColor: "#cabe9b",
                      barPercentage: 0.66,
                      categoryPercentage: 0.66,
                  },
              ],
          }
          setchartData(tempchart);
        }
    },[podCounterData]);

    return (
        <div className="flex flex-col h-full col-span-full lg:col-span-8 sm:col-span-6 bg-white shadow-lg rounded-lg border border-slate-200">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">
                    POD True VS False
                </h2>
            </header>
            {/* Chart built with Chart.js 3 */}
            {/* Change the height attribute to adjust the chart height */}
            <BarChart data={chartData} width={595} height={200} />
        </div>
    );
}

DashboardCard04.propTypes = {
    podCounterData: PropTypes.object.isRequired,
};

export default DashboardCard04;
