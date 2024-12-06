import React from "react";
import { useState } from "react";
import ConsignmentGraph from "./ReportTabs/ConsignmentGraph";
import TotalFailPODGraph from "./ReportTabs/TotalFailPODGraph";

const MultiChartLine = ({ url, currentUser, AToken }) => {
    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    const customers = [
        {
            value: 1,
            label: "Unilever/ Metcash 12 Monthly Consignment",
        },
        {
            value: 3,
            label: "Unilever Monthly Consignment",
        },
        {
            value: 2,
            label: "Unilever/ Woolworth 12 Monthly Consignment",
        },
    ];

    let components = [
        <ConsignmentGraph
            url={url}
            currentUser={currentUser}
            AToken={AToken}
            customers={customers}
            CustomerId={1}
        />, // Graph and Table
        <TotalFailPODGraph />, // The 3 charts
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Unilever Reports
                    </h1>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {/* <BarGraph />
            <GroupedBar /> */}
            </div>
            {components[activeComponentIndex]}
        </div>
    );
};

export default MultiChartLine;
