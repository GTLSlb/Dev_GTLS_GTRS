import ConsMap from "./ConsMap";
import React from "react";
import PropTypes from "prop-types";

export default function MapComp({ consignmentToTrack, setActiveIndexGTRS }) {
    return (
        <div>
            <ConsMap
                consignment={consignmentToTrack}
                setActiveIndexGTRS={setActiveIndexGTRS}
            />
        </div>
    );
}
MapComp.propTypes = {
    consignmentToTrack: PropTypes.object,
    setActiveIndexGTRS: PropTypes.func,
};
