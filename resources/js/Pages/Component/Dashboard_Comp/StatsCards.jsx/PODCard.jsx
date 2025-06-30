import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import TaskIcon from "@mui/icons-material/Task";
import { formatNumberWithCommas } from "@/CommonFunctions";
import React from "react";
import PropTypes from "prop-types";
function PODCard({ totalPODTrue, totalCount }) {
    const podPercentage = (totalPODTrue / totalCount) * 100;

    return (
        <Card className="min-w-[190px] max-w-[400px]">
            <CardHeader className="flex gap-3">
                <div className="flex justify-between text-center items-center w-full">
                    <p className="text-md">True PODs</p>
                    <TaskIcon className="w-6 h-6 text-yellow-400" />
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p className="w-full text-left text-sm flex items-center">
                    {formatNumberWithCommas(totalPODTrue)} /
                    {formatNumberWithCommas(podPercentage)} %
                </p>
            </CardBody>
        </Card>
    );
}

PODCard.propTypes = {
    totalPODTrue: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
};

export default PODCard;
