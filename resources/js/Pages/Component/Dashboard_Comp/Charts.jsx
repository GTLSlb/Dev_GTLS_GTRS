import React, { useEffect, useState, useMemo } from "react";
import {
  calculateStatistics,
  getConsStatusCounter,
  getKPIPerformanceCounter,
  getKPIStatusCounter,
  getMonthlyData,
  getMonthlyRecordCounts,
  getPODCounts,
  getPODCountsByState,
  getStateRecordCounts,
  getStateTotalWeights,
} from "@/Components/utils/chartFunc";
import MultiChartLine from "./Dashboard_Charts/MultiLineChart";
import DoubleBarChart from "./Dashboard_Charts/DoublBarChart";
import BasicColumnCharts from "./Dashboard_Charts/BasicColumnChart";
import { ArrowsPointingOutIcon } from "@heroicons/react/20/solid";
import DashboardCard07 from "@/Components/dashboard/DashboardCard07";
import BasicPieCharts from "@/Components/dashboard/DashboardCard13";
import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);

function Charts({
  layout,
  filteredData,
  setLayout,
  setShowTable,
  setChartFilter,
  setChartName,
}) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [cols, setCols] = useState(window.innerWidth < 1300 ? 1 : 2);

  useEffect(() => {
    const handleResize = () => {
      const newCols =
        window.innerWidth < 768 ? 1 : window.innerWidth < 1300 ? 1 : 2;
      setCols(newCols);
    };
    // Call once to set initial value
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoize all expensive chart data calculations so they run only when filteredData changes.
  const statisticsData = useMemo(
    () => calculateStatistics(filteredData),
    [filteredData]
  );
  const monthlyData = useMemo(() => getMonthlyData(filteredData), [filteredData]);
  const kpiPerformance = useMemo(
    () => getKPIPerformanceCounter(filteredData),
    [filteredData]
  );
  const monthlyRecordCounts = useMemo(
    () => getMonthlyRecordCounts(filteredData),
    [filteredData]
  );
  const consStatus = useMemo(
    () => getConsStatusCounter(filteredData),
    [filteredData]
  );
  const podCounts = useMemo(() => getPODCounts(filteredData), [filteredData]);
  const podCountsByState = useMemo(
    () => getPODCountsByState(filteredData),
    [filteredData]
  );
  const stateTotalWeights = useMemo(
    () => getStateTotalWeights(filteredData),
    [filteredData]
  );
  const stateRecordCounts = useMemo(
    () => getStateRecordCounts(filteredData),
    [filteredData]
  );
  const kpiStatus = useMemo(
    () => getKPIStatusCounter(filteredData),
    [filteredData]
  );

  return (
    <ReactGridLayout
      key={`grid-${cols}`} // re-render grid only when column count changes
      className="layout custom-grid"
      layout={layout}
      cols={cols}
      rowHeight={cols === 1 ? 120 : 110}
      width={1200}
      isResizable={false}
      isDraggable={!isMobile}
    >
      <div key="card01" className="relative drag-over">
        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
        <DashboardCard07 InfoData={statisticsData} />
      </div>
      <div key="card02" className="relative">
        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
        <MultiChartLine chartData={monthlyData} chartTitle="Spend By State" />
      </div>
      <div key="card03" className="relative">
        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
        <BasicPieCharts
          chartData={kpiPerformance}
          labelContent="{value} - {percentage}"
          chartTitle="On Time Performance"
          setShowTable={setShowTable}
          setChartFilter={setChartFilter}
          setChartName={setChartName}
        />
      </div>
      <div key="card04" className="relative">
        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
        <BasicColumnCharts
          chartData={monthlyRecordCounts}
          chartTitle="Consignment By Month"
          setShowTable={setShowTable}
          setChartFilter={setChartFilter}
          setChartName={setChartName}
        />
      </div>
      <div key="card05" className="relative">
        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
        <BasicPieCharts
          chartData={consStatus}
          labelContent="{value} - {percentage}"
          chartTitle="Consignment Status"
          setShowTable={setShowTable}
          setChartFilter={setChartFilter}
          setChartName={setChartName}
        />
      </div>
      <div key="card06" className="relative">
        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
        <DoubleBarChart
          chartData={podCounts}
          chartTitle="POD True vs False"
          setShowTable={setShowTable}
          setChartFilter={setChartFilter}
          setChartName={setChartName}
        />
      </div>
      <div key="card07" className="relative">
        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
        <BasicPieCharts
          chartData={podCountsByState}
          chartTitle="POD Status By State"
          labelContent="{value} - {percentage}"
          setShowTable={setShowTable}
          setChartFilter={setChartFilter}
          setChartName={setChartName}
        />
      </div>
      <div key="card08" className="relative">
        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
        <BasicColumnCharts
          chartData={stateTotalWeights}
          chartTitle="Weight By state"
          setShowTable={setShowTable}
          setChartFilter={setChartFilter}
          setChartName={setChartName}
        />
      </div>
      <div key="card09">
        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
        <BasicColumnCharts
          chartData={stateRecordCounts}
          chartTitle="Consignments By state"
          setShowTable={setShowTable}
          setChartFilter={setChartFilter}
          setChartName={setChartName}
        />
      </div>
      <div key="card10" className="relative hidden">
        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
        <BasicPieCharts
          chartData={kpiStatus}
          chartTitle="KPI Status"
          labelContent="{value} - {percentage}"
          setShowTable={setShowTable}
          setChartFilter={setChartFilter}
        />
      </div>
    </ReactGridLayout>
  );
}

export default React.memo(Charts);
