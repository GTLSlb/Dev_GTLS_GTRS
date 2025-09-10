import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
    gridKey,
    setShowTable,
    setChartFilter,
    setChartName,
}) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [cols, setCols] = useState(2);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCols(1);
            } else if (window.innerWidth < 1300) {
                setCols(1);
            } else {
                setCols(2);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <ReactGridLayout
            key={gridKey}
            className="layout custom-grid"
            layout={layout}
            cols={cols}
            rowHeight={110}
            // width={1200}
            autoSize={true}
            isResizable={false}
            isDraggable={!isMobile}
        >
            <div key="card01" className="relative drag-over">
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <DashboardCard07 InfoData={calculateStatistics(filteredData)} />{" "}
            </div>
            <div key="card02" className="relative">
                {" "}
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <MultiChartLine
                    chartData={getMonthlyData(filteredData)}
                    chartTitle={"Spend By State"}
                />{" "}
            </div>
            <div key="card03" className="relative">
                {" "}
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <BasicPieCharts
                    chartData={getKPIPerformanceCounter(filteredData)}
                    labelContent="{value} - {percentage}"
                    chartTitle={"On Time Performance"}
                    setShowTable={setShowTable}
                    setChartFilter={setChartFilter}
                    setChartName={setChartName}
                />{" "}
            </div>
            <div key="card04" className="relative">
                {" "}
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <BasicColumnCharts
                    chartData={getMonthlyRecordCounts(filteredData)}
                    chartTitle={"Consignment By Month"}
                    setShowTable={setShowTable}
                    setChartFilter={setChartFilter}
                    setChartName={setChartName}
                />{" "}
            </div>
            <div key="card05" className="relative">
                {" "}
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <BasicPieCharts
                    chartData={getConsStatusCounter(filteredData)}
                    labelContent="{value} - {percentage}"
                    chartTitle={"Consignment Status"}
                    setShowTable={setShowTable}
                    setChartFilter={setChartFilter}
                    setChartName={setChartName}
                />{" "}
            </div>

            <div key="card06" className="relative">
                {" "}
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <DoubleBarChart
                    chartData={getPODCounts(filteredData)}
                    chartTitle={"POD True vs False"}
                    setShowTable={setShowTable}
                    setChartFilter={setChartFilter}
                    setChartName={setChartName}
                />{" "}
            </div>
            <div key="card07" className="relative">
                {" "}
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <BasicPieCharts
                    chartData={getPODCountsByState(filteredData)}
                    chartTitle={"POD Status By State"}
                    labelContent="{value} - {percentage}"
                    setShowTable={setShowTable}
                    setChartFilter={setChartFilter}
                    setChartName={setChartName}
                />{" "}
            </div>
            <div key="card08" className="relative">
                {" "}
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <BasicColumnCharts
                    chartData={getStateTotalWeights(filteredData)}
                    chartTitle={"Weight By state"}
                    setShowTable={setShowTable}
                    setChartFilter={setChartFilter}
                    setChartName={setChartName}
                />{" "}
            </div>

            <div key="card09">
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <BasicColumnCharts
                    chartData={getStateRecordCounts(filteredData)}
                    chartTitle={"Consignments By state"}
                    setShowTable={setShowTable}
                    setChartFilter={setChartFilter}
                    setChartName={setChartName}
                />{" "}
            </div>

            <div key="card10" className="relative hidden">
                {" "}
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <BasicPieCharts
                    chartData={getKPIStatusCounter(filteredData)}
                    chartTitle={"KPI Status"}
                    labelContent="{value} - {percentage}"
                    setShowTable={setShowTable}
                    setChartFilter={setChartFilter}
                />{" "}
            </div>
        </ReactGridLayout>
    );
}

Charts.propTypes = {
    layout: PropTypes.array,
    filteredData: PropTypes.array,
    gridKey: PropTypes.string,
    setShowTable: PropTypes.func,
    setChartFilter: PropTypes.func,
    setChartName: PropTypes.func,
};

export default Charts;
