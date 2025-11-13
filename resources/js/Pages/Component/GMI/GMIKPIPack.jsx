import React, { useContext } from "react";
import ConsignmentGraph from "../Presentation/ReportTabs/ConsignmentGraph";
import { CustomContext } from "@/CommonContext";

function GMIKPIPack() {
    const { url, userPermissions, Token } = useContext(CustomContext);
    const activeComponentIndex = 0;
    const customers = [
        {
            value: 8, // Customer Type ID from Database
            label: "GMI ALL LANES",
        },
    ];
    let components = [
        <ConsignmentGraph
            key={activeComponentIndex}
            url={url}
            userPermissions={userPermissions}
            Token={Token}
            customers={customers}
            CustomerId={3} // Customer Id from Database
        />,
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20 h-full">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        GMI KPI Pack Report
                    </h1>
                </div>
            </div>

            {components[activeComponentIndex]}
        </div>
    );
}

export default GMIKPIPack;
