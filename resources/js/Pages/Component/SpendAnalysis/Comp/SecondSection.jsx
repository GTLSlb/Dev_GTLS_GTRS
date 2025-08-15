import { Card, CardHeader, CardBody } from "@heroui/react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Stats from "./Stats";
import React from "react";

const dummyData = [
    { name: "Week 1", difot: 90, otd: 92, inFull: 95, returnRate: 5 },
    { name: "Week 2", difot: 91, otd: 94, inFull: 96, returnRate: 4 },
    { name: "Week 3", difot: 92, otd: 93, inFull: 97, returnRate: 3 },
    { name: "Week 4", difot: 91.4, otd: 94.2, inFull: 97.1, returnRate: 3.5 },
];

function SecondSection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* KPI Tiles */}
            <div className="lg:col-span-2">
                <Stats />
            </div>
            <Card>
                <CardHeader>Geo DIFOT Map</CardHeader>
                <CardBody className="h-44 flex items-center justify-center text-muted-foreground">
                    <span>Insert map component or static image</span>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>Order Accuracy Breakdown</CardHeader>
                <CardBody className="h-44 flex items-center justify-center text-muted-foreground">
                    <span>Stacked bar chart placeholder</span>
                </CardBody>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>Return & Redelivery Over Time</CardHeader>
                <CardBody className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dummyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="returnRate"
                                stroke="#ff7300"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>
        </div>
    );
}

export default SecondSection;
