import { Card, CardHeader, CardBody } from "@nextui-org/react";
function DifotStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
                ["DIFOT Rate (%)", "91.4%"],
                ["OTD (%)", "94.2%"],
                ["In-Full Delivery (%)", "97.1%"],
                ["Avg Delivery Time", "1.3 days"],
                ["Late Deliveries (%)", "5.8%"],
                ["Return & Redelivery Rate", "8.5%"],
            ].map(([label, value]) => (
                <Card key={label} className="h-20">
                    <CardHeader className="truncate text-sm">{label}</CardHeader>
                    <CardBody className="p-0 pl-3">
                        <div className="text-xl font-bold p-0">{value}</div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}

export default DifotStats;
