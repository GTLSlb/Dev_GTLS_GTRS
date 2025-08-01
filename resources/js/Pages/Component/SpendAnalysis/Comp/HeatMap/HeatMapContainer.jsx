import React from "react";
import HeatMap from "./HeatMap";
import "leaflet/dist/leaflet.css";
import HeatSidebar from "./HeatSidebar";

function HeatMapContainer() {
    return (
        <div className="mt-10">
            <h2 className="mb-5">Australia Object Density Heat Map</h2>
            <div className="w-full flex gap-4 ">
                <div className="w-3/4">
                    <HeatMap />
                </div>
                <div className="w-1/4">
                    <HeatSidebar />
                </div>
            </div>
        </div>
    );
}

export default HeatMapContainer;
