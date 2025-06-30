import React from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import PropTypes from "prop-types";
import ScaleIcon from "@mui/icons-material/Scale";
import { formatNumberWithCommas } from "@/CommonFunctions";

function WeightCard({ totalWeight }) {
    return (
        <Card className="min-w-[190px] max-w-[400px]">
            <CardHeader className="flex gap-3">
                <div className="flex justify-between text-center items-center w-full">
                    <p className="text-md">Total Weight</p>
                    <ScaleIcon className="w-6 h-6 text-blue-400" />
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p className="w-full text-left text-sm">
                    {formatNumberWithCommas(totalWeight)} T
                </p>
            </CardBody>
        </Card>
    );
}

WeightCard.propTypes = {
    totalWeight: PropTypes.number.isRequired,
};

export default WeightCard;
