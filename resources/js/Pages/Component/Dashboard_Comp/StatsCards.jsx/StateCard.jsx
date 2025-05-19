import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { MapIcon } from "@heroicons/react/24/outline";
function StateCard({ states }) {
    return (
        <Card className="min-w-[190px] max-w-[400px]">
            <CardHeader className="flex gap-3">
                <div className="flex justify-between text-center items-center w-full">
                    <p className="text-md">States</p>
                    <MapIcon className="w-6 h-6 text-red-400" />
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p className="w-full text-left text-sm">{states?.join(", ")}</p>
            </CardBody>
        </Card>
    );
}

export default StateCard;