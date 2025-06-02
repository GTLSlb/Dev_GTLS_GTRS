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
    AreaChart,
    Area,
} from "recharts";
import DifotStats from "./DifotStats";

// Dummy data for the charts
const dummyLineData = [
    { name: "Week 1", costToServe: 15000 },
    { name: "Week 2", costToServe: 15500 },
    { name: "Week 3", costToServe: 16000 },
    { name: "Week 4", costToServe: 15800 },
];

const dummyStackedData = [
    {
        name: "Week 1",
        transportation: 4000,
        labor: 3000,
        fuel: 2000,
        overhead: 3000,
    },
    {
        name: "Week 2",
        transportation: 4200,
        labor: 3100,
        fuel: 2200,
        overhead: 3200,
    },
    {
        name: "Week 3",
        transportation: 4100,
        labor: 3050,
        fuel: 2100,
        overhead: 3100,
    },
    {
        name: "Week 4",
        transportation: 4300,
        labor: 3150,
        fuel: 2300,
        overhead: 3300,
    },
];

const dummyPieData = [
    { name: "Transportation", value: 40 },
    { name: "Labor", value: 25 },
    { name: "Fuel", value: 20 },
    { name: "Overhead", value: 15 },
];

const dummyAreaData = [
    { name: "Week 1", cumulativeCost: 15000 },
    { name: "Week 2", cumulativeCost: 30500 },
    { name: "Week 3", cumulativeCost: 46500 },
    { name: "Week 4", cumulativeCost: 62300 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function FinancialDashboard() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* Key Financial Metrics */}
            <div className="lg:col-span-2">
                <DifotStats />
            </div>
    
            {/* Service Cost Breakdown (Stacked Bar Chart) */}
            <Card>
                <CardHeader>Service Cost Breakdown</CardHeader>
                <CardBody className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dummyStackedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="transportation"
                                stackId="a"
                                fill="#8884d8"
                            />
                            <Bar dataKey="labor" stackId="a" fill="#82ca9d" />
                            <Bar dataKey="fuel" stackId="a" fill="#ffc658" />
                            <Bar
                                dataKey="overhead"
                                stackId="a"
                                fill="#d0ed57"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>

            {/* Cost Driver Distribution (Pie Chart) */}
            <Card>
                <CardHeader>Cost Driver Distribution</CardHeader>
                <CardBody className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dummyPieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={40}
                                fill="#8884d8"
                                label
                            >
                                {dummyPieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>

            {/* Cost Trend Over Time (Line Chart) */}
            <Card>
                <CardHeader>Cost Trend Over Time</CardHeader>
                <CardBody className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dummyLineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="costToServe"
                                stroke="#8884d8"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>

            {/* Cumulative Cost Trend (Area Chart) */}
            <Card className="">
                <CardHeader>Cumulative Cost Trend</CardHeader>
                <CardBody className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dummyAreaData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="cumulativeCost"
                                stroke="#82ca9d"
                                fill="#82ca9d"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>
        </div>
    );
}

export default FinancialDashboard;
