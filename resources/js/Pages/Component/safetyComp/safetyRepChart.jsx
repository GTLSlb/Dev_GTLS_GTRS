import React from "react";
import BarCharData from "./safetyCharts/SafetyCard02";
import propTypes from "prop-types";
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
const ReactGridLayout = WidthProvider(RGL);
import "react-resizable/css/styles.css";
import { useEffect, useState, useMemo, useCallback } from "react";
import SafetyRepByState from "./safetyCharts/SafetyRepByState";
import MultiBarChart from "./safetyCharts/SafetyDoubleBarChart";
import BasicPieCharts from "@/Components/dashboard/DashboardCard13";
import {
    ArrowsPointingOutIcon,
} from "@heroicons/react/20/solid";
import StackedBarChart from "./safetyCharts/StackedBarChart";

export default function SafetyRepChart({
    filteredData,
    safetyTypes,
}) {
    const [layout, setLayout] = useState([
        { i: "card01", x: 0, y: 0, w: 2, h: 4 }, // Reports By Month
        { i: "card02", x: 0, y: 0, w: 1, h: 4 }, // Type of Problems
        { i: "card03", x: 1, y: 0, w: 1, h: 4 }, // Report Type By Month
        { i: "card04", x: 0, y: 2, w: 1, h: 4 }, // Consignment By Month
        { i: "card05", x: 1, y: 2, w: 1, h: 4 }, // Pod True Vs False
    ]);
    const [cols, setCols] = useState(2);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCols(1);
            } else if (window.innerWidth < 1200) {
                setCols(2);
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

    useEffect(() => {
        // Update the layout when cols change
        setLayout((prevLayout) =>
            prevLayout.map((item, index) => ({
                ...item,
                x: index % cols,
                w: index === 0 ? cols : 1,
            }))
        );
    }, [cols]);

    // Memoize all data processing functions to prevent infinite loops
    const countRecordsByMonth = useCallback((data) => {
        if (!data || data.length === 0) return {};
        
        const counts = {};
        data.forEach((item) => {
            const date = new Date(item.OccuredAt);
            const year = date.getFullYear();
            const month = date.getMonth();
            const formattedDate = `${String(month + 1).padStart(
                2,
                "0"
            )}-${String(1).padStart(2, "0")}-${year}`;
            
            if (counts[formattedDate]) {
                counts[formattedDate]++;
            } else {
                counts[formattedDate] = 1;
            }
        });

        return counts;
    }, []);

    const countReportsBySafetyType = useCallback((jsonData) => {
        if (!jsonData || jsonData.length === 0) return [];
        
        const counts = {};

        jsonData.forEach((item) => {
            const safetyType = item.SafetyType;
            counts[safetyType] = (counts[safetyType] || 0) + 1;
        });

        const result = Object.entries(counts).map(([label, value]) => ({
            label: parseInt(label),
            value,
        }));

        return result;
    }, []);

    const compareLabels = useCallback((objectArray, safetyObjects) => {
        if (!objectArray || !safetyObjects) return [];
        
        const newArray = objectArray.map((obj) => {
            const safetyObject = safetyObjects.find(
                (safetyObj) => obj.label === safetyObj.SafetyTypeId
            );
            if (safetyObject) {
                return {
                    ...obj,
                    label: safetyObject.SafetyTypeName,
                };
            }
            return obj;
        });

        return newArray;
    }, []);

    const countSafetyTypesByMonth = useCallback((data) => {
        if (!data || data.length === 0) return {};
        
        const counts = {};

        data.forEach((report) => {
            const date = new Date(report.OccuredAt);
            const year = date.getFullYear();
            const month = date.getMonth();

            const firstDayOfMonth = new Date(year, month, 1);

            const formattedDate = `${(firstDayOfMonth.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${"01"}-${firstDayOfMonth.getFullYear()}`;

            if (!counts[formattedDate]) {
                counts[formattedDate] = {};
            }

            const safetyType = report.SafetyType;
            if (!counts[formattedDate][safetyType]) {
                counts[formattedDate][safetyType] = 1;
            } else {
                counts[formattedDate][safetyType]++;
            }
        });

        return counts;
    }, []);

    const getCountByState = useCallback((data) => {
        if (!data || data.length === 0) return {};
        
        const problemsByState = {};

        data.forEach((item) => {
            const state = item.State;

            if (state in problemsByState) {
                problemsByState[state]++;
            } else {
                problemsByState[state] = 1;
            }
        });

        return problemsByState;
    }, []);

    const getStateLabel = useCallback((stateId) => {
        switch (stateId) {
            case "1":
                return "VIC";
            case "2":
                return "NSW";
            case "3":
                return "QLD";
            case "4":
                return "SA";
            case "5":
                return "ACT";
            default:
                return stateId;
        }
    }, []);

    const countRecordsByStateAndType = useCallback((data) => {
        if (!data || data.length === 0 || !safetyTypes) return [];
        
        const stateCounts = {};
        const typeCounts = {};

        data.forEach((record) => {
            const state = getStateLabel(record.State);
            const type = record.SafetyType.toString();

            stateCounts[state] = (stateCounts[state] || 0) + 1;

            if (!(state in typeCounts)) {
                typeCounts[state] = {};
            }
            typeCounts[state][type] = (typeCounts[state][type] || 0) + 1;
        });

        const result = [];
        for (const state in typeCounts) {
            for (const type in typeCounts[state]) {
                const count = typeCounts[state][type];
                const safetyType = safetyTypes.find(
                    (t) => t.SafetyTypeId === parseInt(type)
                );
                const typeName = safetyType ? safetyType.SafetyTypeName : type;
                result.push({ state, value: count, type: typeName });
            }
        }

        return result;
    }, [safetyTypes, getStateLabel]);

    // Memoize all computed data to prevent recalculation on every render
    const recordCounts = useMemo(() => countRecordsByMonth(filteredData), [filteredData, countRecordsByMonth]);
    
    const counter = useMemo(() => countReportsBySafetyType(filteredData), [filteredData, countReportsBySafetyType]);
    
    const labeledCounter = useMemo(() => compareLabels(counter, safetyTypes), [counter, safetyTypes, compareLabels]);
    
    const problemsByState = useMemo(() => getCountByState(filteredData), [filteredData, getCountByState]);
    
    const typesbymonth = useMemo(() => countSafetyTypesByMonth(filteredData), [filteredData, countSafetyTypesByMonth]);
    
    const byStateAndType = useMemo(() => countRecordsByStateAndType(filteredData), [filteredData, countRecordsByStateAndType]);

    const isMobile = useMemo(() => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent), []);

    const ResetLayout = useCallback(() => {
        setLayout([
            { i: "card01", x: 0, y: 0, w: 2, h: 4 },
            { i: "card02", x: 0, y: 0, w: 1, h: 4 },
            { i: "card03", x: 1, y: 0, w: 1, h: 4 },
            { i: "card04", x: 0, y: 2, w: 1, h: 4 },
            { i: "card05", x: 1, y: 2, w: 1, h: 4 },
        ]);
    }, []);

    // Early return if no data
    if (!filteredData || filteredData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center mt-10">
                <div className="text-center flex justify-center flex-col">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Congrats! <br/> Nothing To Show
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="hidden md:flex w-full justify-end px-2">
                <button
                    className="items-center w-auto h-[36px] rounded-md border bg-gray-800 px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={ResetLayout}
                >
                    Reset layout
                </button>
            </div>
            
            <ReactGridLayout
                className="layout custom-grid"
                layout={layout}
                cols={cols}
                rowHeight={100}
                width={1200}
                isResizable={false}
                isDraggable={!isMobile}
                autoSize={true}
                onLayoutChange={(layout) => setLayout(layout)}
                dragEnterChild="drag-over"
                dragLeaveChild="drag-out"
            >
                <div key="card01" className="relative">
                    <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                    <BarCharData
                        chartTitle="Reports By Month"
                        barValues={recordCounts}
                    />
                </div>
                
                <div key="card02" className="relative">
                    <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                    <BasicPieCharts
                        chartData={labeledCounter}
                        chartTitle="POD Status By State"
                    />
                </div>
                
                <div key="card03" className="relative">
                    <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                    <SafetyRepByState
                        chartTitle="Reports By State"
                        singleBarValue={problemsByState}
                    />
                </div>
                
                <div key="card04" className="relative">
                    <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                    <MultiBarChart
                        chartTitle="Report Type By Month"
                        typesbymonth={typesbymonth}
                        safetyTypes={safetyTypes}
                    />
                </div>
                
                <div key="card05" className="relative">
                    <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                    <StackedBarChart
                        chartTitle="Report By State and By Type"
                        byStateAndType={byStateAndType}
                        safetyTypes={safetyTypes}
                    />
                </div>
            </ReactGridLayout>
        </div>
    );
}

SafetyRepChart.propTypes = {
    filteredData: propTypes.array,
    safetyTypes: propTypes.array,
};