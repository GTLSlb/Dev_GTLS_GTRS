import React, { useEffect, useState, useMemo, useCallback } from "react";
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
    setShowTable,
    setChartFilter,
    setChartName,
}) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [cols, setCols] = useState(() => window.innerWidth < 1300 ? 1 : 2);

    // Memoize all chart data calculations with proper dependencies
    const chartData = useMemo(() => {
        // Only recalculate if filteredData actually changed
        if (!filteredData || filteredData.length === 0) {
            return {
                statistics: {},
                monthlyData: [],
                kpiPerformance: [],
                monthlyRecords: [],
                consStatus: [],
                podCounts: [],
                podCountsByState: [],
                stateTotalWeights: [],
                stateRecordCounts: [],
                kpiStatus: [],
            };
        }

        return {
            statistics: calculateStatistics(filteredData),
            monthlyData: getMonthlyData(filteredData),
            kpiPerformance: getKPIPerformanceCounter(filteredData),
            monthlyRecords: getMonthlyRecordCounts(filteredData),
            consStatus: getConsStatusCounter(filteredData),
            podCounts: getPODCounts(filteredData),
            podCountsByState: getPODCountsByState(filteredData),
            stateTotalWeights: getStateTotalWeights(filteredData),
            stateRecordCounts: getStateRecordCounts(filteredData),
            kpiStatus: getKPIStatusCounter(filteredData),
        };
    }, [filteredData]);

    // Debounced resize handler to prevent excessive re-renders
    const handleResize = useCallback(() => {
        const newCols =
            window.innerWidth < 768 ? 1 : window.innerWidth < 1300 ? 1 : 2;
        setCols(prev => prev !== newCols ? newCols : prev);
    }, []);

    useEffect(() => {
        // Set initial value
        handleResize();
        
        // Debounce resize events
        let timeoutId;
        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 150);
        };
        
        window.addEventListener("resize", debouncedResize);
        return () => {
            window.removeEventListener("resize", debouncedResize);
            clearTimeout(timeoutId);
        };
    }, [handleResize]);

    // Memoize the grid key to prevent unnecessary re-renders
    const gridKey = useMemo(() => `grid-${cols}-${filteredData?.length || 0}`, [cols, filteredData?.length]);

    // Memoize grid props to prevent unnecessary re-renders
    const gridProps = useMemo(() => ({
        className: "layout custom-grid",
        layout,
        cols,
        rowHeight: cols === 1 ? 120 : 110,
        width: 1200,
        isResizable: false,
        isDraggable: !isMobile,
        useCSSTransforms: false, // This can help reduce re-renders
        margin: [10, 10],
        containerPadding: [0, 0],
    }), [layout, cols, isMobile]);

    return (
        <ReactGridLayout
            key={gridKey}
            {...gridProps}
        >
            <div key="card01" className="relative drag-over">
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <DashboardCard07 InfoData={chartData.statistics} />
            </div>
            <div key="card02" className="relative">
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <MultiChartLine
                    chartData={chartData.monthlyData}
                    chartTitle="Spend By State"
                />
            </div>
            <div key="card03" className="relative">
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <BasicPieCharts
                    chartData={chartData.kpiPerformance}
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
                    chartData={chartData.monthlyRecords}
                    chartTitle="Consignment By Month"
                    setShowTable={setShowTable}
                    setChartFilter={setChartFilter}
                    setChartName={setChartName}
                />
            </div>
            <div key="card05" className="relative">
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <BasicPieCharts
                    chartData={chartData.consStatus}
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
                    chartData={chartData.podCounts}
                    chartTitle="POD True vs False"
                    setShowTable={setShowTable}
                    setChartFilter={setChartFilter}
                    setChartName={setChartName}
                />
            </div>
            <div key="card07" className="relative">
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <BasicPieCharts
                    chartData={chartData.podCountsByState}
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
                    chartData={chartData.stateTotalWeights}
                    chartTitle="Weight By state"
                    setShowTable={setShowTable}
                    setChartFilter={setChartFilter}
                    setChartName={setChartName}
                />
            </div>
            <div key="card09">
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <BasicColumnCharts
                    chartData={chartData.stateRecordCounts}
                    chartTitle="Consignments By state"
                    setShowTable={setShowTable}
                    setChartFilter={setChartFilter}
                    setChartName={setChartName}
                />
            </div>
            <div key="card10" className="relative hidden">
                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                <BasicPieCharts
                    chartData={chartData.kpiStatus}
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