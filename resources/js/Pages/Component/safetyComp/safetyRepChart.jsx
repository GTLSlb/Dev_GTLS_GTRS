import React from "react";
import BarCharData from "./safetyCharts/SafetyCard02";
import propTypes from "prop-types";
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
const ReactGridLayout = WidthProvider(RGL);
import "react-resizable/css/styles.css";
import { useEffect } from "react";
import { useState } from "react";
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
        // { i: "card06", x: 8, y: 4, w: 6, h: 4.5 }, // Pod Status
        // { i: "card07", x: 0, y: 4, w: 6, h: 3 },
        // { i: "card08", x: 6, y: 4, w: 6, h: 3 },
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
                x: index % cols, // Distribute the divs evenly between x=0 and x=1
                w: index === 0 ? cols : 1, // Set the width to cols for the first div, and 1 for others
            }))
        );
    }, [cols]);
    const countRecordsByMonth = (data) => {
        const counts = {}; // Object to store counts for each month
        data.forEach((item) => {
            const date = new Date(item.OccuredAt);
            const year = date.getFullYear(); // Get the year
            const month = date.getMonth(); // Get the month (0-11)
            const formattedDate = `${String(month + 1).padStart(
                2,
                "0"
            )}-${String(1).padStart(2, "0")}-${year}`;
            // Increment the count for the month
            if (counts[formattedDate]) {
                counts[formattedDate]++;
            } else {
                counts[formattedDate] = 1;
            }
        });

        return counts;
    };

    const countReportsBySafetyType = (jsonData) => {
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
    };
    const counter = countReportsBySafetyType(filteredData);
    function compareLabels(objectArray, safetyObjects) {
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
    }
    function countSafetyTypesByMonth(data) {
        const counts = {};

        // Loop through the safety reports
        data.forEach((report) => {
            // Get the month and year from the Date property
            const date = new Date(report.OccuredAt);
            const year = date.getFullYear();
            const month = date.getMonth();

            // Create a new date with the year and month
            const firstDayOfMonth = new Date(year, month, 1);

            // Format the date as desired (e.g., "MM-DD-YYYY")
            const formattedDate = `${(firstDayOfMonth.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${"01"}-${firstDayOfMonth.getFullYear()}`;

            // Check if the date exists in the counts object
            if (!counts[formattedDate]) {
                counts[formattedDate] = {};
            }

            // Increment the count for the safety type
            const safetyType = report.SafetyType;
            if (!counts[formattedDate][safetyType]) {
                counts[formattedDate][safetyType] = 1;
            } else {
                counts[formattedDate][safetyType]++;
            }
        });

        return counts;
    }
    function getCountByState(data) {
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
    }
    function countRecordsByStateAndType(data) {
        const stateCounts = {};
        const typeCounts = {};

        // Count occurrences of each state and type
        data.forEach((record) => {
            const state = getStateLabel(record.State);
            const type = record.SafetyType.toString();

            // Count state occurrences
            stateCounts[state] = (stateCounts[state] || 0) + 1;

            // Count type occurrences
            if (!(state in typeCounts)) {
                typeCounts[state] = {};
            }
            typeCounts[state][type] = (typeCounts[state][type] || 0) + 1;
        });

        // Prepare the result
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
    }

    function getStateLabel(stateId) {
        // Map stateId to state label
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
            // Handle other states as needed
            default:
                return stateId;
        }
    }
    const problemsByState = getCountByState(filteredData);
    const typesbymonth = countSafetyTypesByMonth(filteredData);
    const recordCounts = countRecordsByMonth(filteredData);
    const byStateAndType = countRecordsByStateAndType(filteredData);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const ResetLayout = () => {
        // Filter the options based on the selected receivers
        setLayout([
            { i: "card01", x: 0, y: 0, w: 2, h: 4 }, // Reports By Month
            { i: "card02", x: 0, y: 0, w: 1, h: 4 }, // Type of Problems
            { i: "card03", x: 1, y: 0, w: 1, h: 4 }, // Report Type By Month
            { i: "card04", x: 0, y: 2, w: 1, h: 4 }, // Consignment By Month
            { i: "card05", x: 1, y: 2, w: 1, h: 4 }, // Pod True Vs False
            // { i: "card06", x: 8, y: 4, w: 6, h: 4.5 }, // Pod Status
            // { i: "card07", x: 0, y: 4, w: 6, h: 3 },
            // { i: "card08", x: 6, y: 4, w: 6, h: 3 },
        ]);
    };

    return (
        <div>
            <div className="hidden md:flex w-full justify-end px-2">
                <button
                    className={`  items-center w-auto h-[36px] rounded-md border bg-gray-800 px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    onClick={ResetLayout}
                >
                    Reset layout
                </button>
            </div>
            {filteredData.length > 0 ? (
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
                    {/* Place your components with drag-and-drop functionality */}
                    <div key="card01" className="relative">
                        {" "}
                        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                        <BarCharData
                            chartTitle={"Reports By Month"}
                            barValues={recordCounts}
                        />
                    </div>
                    <div key="card02" className="relative">
                        {" "}
                        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                        <BasicPieCharts
                            chartData={compareLabels(counter, safetyTypes)}
                            chartTitle={"POD Status By State"}
                        />
                    </div>
                    <div key="card03" className="relative">
                        {" "}
                        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                        <SafetyRepByState
                            chartTitle={"Reports By State"}
                            singleBarValue={problemsByState}
                        />
                    </div>
                    <div key="card04" className="relative">
                        {" "}
                        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                        <MultiBarChart
                            chartTitle={"Report Type By Month"}
                            typesbymonth={typesbymonth}
                            safetyTypes={safetyTypes}
                        />
                    </div>
                    <div key="card05" className="relative">
                        {" "}
                        <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                        <StackedBarChart
                            chartTitle={"Report By State and By Type"}
                            byStateAndType={byStateAndType}
                            safetyTypes={safetyTypes}
                        />
                    </div>
                </ReactGridLayout>
            ) : (
                <div className="h-64 flex items-center justify-center mt-10">
                    <div className="text-center flex justify-center flex-col">
                        {/* <img src={notFound} alt="" className="w-52 h-auto " /> */}
                        <h1 className="text-3xl font-bold text-gray-900">
                            Congrats! <br/> Nothing To Show
                        </h1>
                    </div>
                </div>
            )}
        </div>
    );
}
SafetyRepChart.propTypes = {
    filteredData: propTypes.array,
    safetyTypes: propTypes.array,
};
