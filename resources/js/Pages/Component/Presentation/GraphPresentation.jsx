import React from "react";
import { useState } from "react";
import BarGraph from "./graphs/BarGraph";
import GroupedBar from "./graphs/GroupedBar";
import ConsignmentGraph from "./ReportTabs/ConsignmentGraph";
import TotalFailPODGraph from "./ReportTabs/TotalFailPODGraph";

const MultiChartLine = () => {
    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    const handleItemClick = (index) => {
        setActiveComponentIndex(index);
    };
    let components = [<ConsignmentGraph />, <TotalFailPODGraph />];
    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Unilever Reports
                    </h1>
                </div>
            </div>
            <ul className="flex space-x-0 mt-5">
                <li
                    className={`cursor-pointer ${
                        activeComponentIndex === 0
                            ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                            : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                    }`}
                    onClick={() => handleItemClick(0)}
                >
                    <div className="px-2"> Report 1 </div>
                </li>
                <li
                    className={`cursor-pointer ${
                        activeComponentIndex === 1
                            ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                            : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                    }`}
                    onClick={() => handleItemClick(1)}
                >
                    <div className="px-2"> Report 2 </div>
                </li>
            </ul>
            <div className="grid grid-cols-2 gap-4">
                {/* <BarGraph />
            <GroupedBar /> */}
            </div>
            {components[activeComponentIndex]}
        </div>
    );
};

export default MultiChartLine;