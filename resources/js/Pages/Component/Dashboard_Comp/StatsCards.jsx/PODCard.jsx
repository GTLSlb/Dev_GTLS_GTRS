import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import TaskIcon from "@mui/icons-material/Task";
import { formatNumberWithCommas } from "@/CommonFunctions";
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

export default PODCard;
