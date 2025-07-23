import React from "react";
import PropTypes from "prop-types";
import ConsignmentGraph from "../Presentation/ReportTabs/ConsignmentGraph";
// import axios from "axios";
function RealFoodKPIPack({ url, currentUser, AToken }) {
    const activeComponentIndex = 0; // Assuming you want to show the first component by default
    const customers = [
        {
            value: 4,
            label: "Real Food Woolworth Monthly Consignment",
        },
        {
            value: 5,
            label: "Real Food GHPL Monthly Consignment",
        },
        {
            value: 6,
            label: "Real Food IGA-Metcash Monthly Consignment",
        },
        {
            value: 7,
            label: "Real Food Other Monthly Consignment",
        },
    ];
    let components = [
        <ConsignmentGraph
            key={activeComponentIndex}
            url={url}
            currentUser={currentUser}
            Token={Token}
            customers={customers}
            CustomerId={2}
        />,
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Real Food KPI Pack Report
                    </h1>
                </div>
            </div>

            {components[activeComponentIndex]}
        </div>
    );
}
RealFoodKPIPack.propTypes = {
    url: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,    
    AToken: PropTypes.string.isRequired,    
};

export default RealFoodKPIPack;
