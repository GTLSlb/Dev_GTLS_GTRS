import { Card, CardHeader, CardBody } from "@heroui/react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import DifotStats from "./DifotStats";

const dummyData = [
    { name: "Week 1", difot: 90, otd: 92, inFull: 95, returnRate: 5 },
    { name: "Week 2", difot: 91, otd: 94, inFull: 96, returnRate: 4 },
    { name: "Week 3", difot: 92, otd: 93, inFull: 97, returnRate: 3 },
    { name: "Week 4", difot: 91.4, otd: 94.2, inFull: 97.1, returnRate: 3.5 },
];

const pieData = [
    { name: "Rescheduled", value: 45 },
    { name: "Failed", value: 25 },
    { name: "No Answer", value: 30 },
];

const colors = ["#8884d8", "#82ca9d", "#ffc658"];

function FirstSection() {
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {/* KPI Tiles */}
                <div className="lg:col-span-2">
                    <DifotStats />
                </div>

                <Card>
                    <CardHeader>DIFOT Over Time</CardHeader>
                    <CardBody className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dummyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="difot"
                                    stroke="#8884d8"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>OTD vs In-Full</CardHeader>
                    <CardBody className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dummyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="otd" fill="#82ca9d" name="OTD" />
                                <Bar
                                    dataKey="inFull"
                                    fill="#ffc658"
                                    name="In-Full"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>Average Delivery Time (Dummy)</CardHeader>
                    <CardBody className="h-44 flex items-center justify-center text-muted-foreground">
                        <span>Replace with Line Chart or Value Timeline</span>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>Delivery Exceptions</CardHeader>
                    <CardBody className="h-44 p-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    dataKey="value"
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={50}
                                    fill="#8884d8"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={colors[index % colors.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default FirstSection;
