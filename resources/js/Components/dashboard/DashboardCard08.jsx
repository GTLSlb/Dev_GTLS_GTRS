import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
// import LineChart from '../../charts/LineChart02';
import LineChart from '../charts/LineChart02';
// Import utilities
import { tailwindConfig } from '../utils/Utils';

function DashboardCard08(props) {
  const {transportData} = props;
  const [chartData, setchartData] = useState({
    labels : [],
    datasets : [],
  });

  useEffect(()=>{
    if (transportData !== null) {
      const stateArray = Array.from(transportData.uniqueState);
      const tempchart = 
      {labels: transportData.firstDaysOfMonth,
      datasets: [
        // Indigo line
        {
          label: "NSW",
          data: Object.values(transportData?.resultforVIC),
          borderColor:  tailwindConfig().theme.colors.gray[500],
          fill: false,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        },
        // Blue line
        {
          label:"VIC",
          data: Object.values(transportData?.resultforNSW),
          borderColor: "#d5b132",
          fill: false,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.blue[400],
        },
        // Green line
        {
          label:  "QLD",
          data: Object.values(transportData?.resultforQLD),
          borderColor: "#1e191a",
          fill: false,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.green[500],
        },
        {
          label:  "SA",
          data: Object.values(transportData?.resultforSA),
          borderColor: "#cabe9b",
          fill: false,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.red[500],
        },
        {
          label:  "ACT",
          data: Object.values(transportData?.resultforACT),
          borderColor: "#F7DC6F",
          fill: false,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor:  tailwindConfig().theme.colors.red[500],
        },
      ],
    }
    setchartData(tempchart);

    }
  },[transportData])


  return (
    <div className="flex flex-col h-full col-span-full sm:col-span-8 bg-white shadow-lg rounded-lg border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100 flex items-center">
        <h2 className="font-semibold text-slate-800">Spend By State</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <LineChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard08;
