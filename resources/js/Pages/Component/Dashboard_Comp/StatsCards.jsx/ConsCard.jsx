import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { formatNumberWithCommas } from "@/CommonFunctions";
import React from "react";
import PropTypes from "prop-types";
function ConsCard({ totalCount }) {
    return (
        <Card className="min-w-[190px] max-w-[400px]">
            <CardHeader className="flex gap-3">
                <div className="flex justify-between text-center items-center w-full">
                    <p className="text-md">No. Consignments</p>
                    <LocalShippingIcon className="w-6 h-6 text-purple-400" />
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p className="w-full text-left text-sm flex items-center">
                    {formatNumberWithCommas(totalCount)}
                </p>
            </CardBody>
        </Card>
    );
}

ConsCard.propTypes = {
    totalCount: PropTypes.number.isRequired,
};

export default ConsCard;
