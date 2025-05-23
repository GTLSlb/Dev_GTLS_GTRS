import React from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import PaidIcon from "@mui/icons-material/Paid";
import { formatNumberWithCommas } from "@/CommonFunctions";
function AmountCard({ totalCost }) {
    return (
        <Card className="min-w-[190px] max-w-[400px]">
            <CardHeader className="flex gap-3">
                <div className="flex justify-between text-center items-center w-full">
                    <p className="text-md">Total Cost</p>
                    <PaidIcon className="w-6 h-6 text-green-400" />
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p className="w-full text-left text-sm">
                    ${formatNumberWithCommas(totalCost)}
                </p>
            </CardBody>
        </Card>
    );
}

export default AmountCard;