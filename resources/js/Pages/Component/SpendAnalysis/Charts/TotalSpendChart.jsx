import { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { FunnelIcon } from "@heroicons/react/24/outline";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    DateRangePicker,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@heroui/react";

const dummySpendData = [
    {
        name: "Week 1",
        cost: 10542,
        additional: 5500,
        fuelLevy: 150,
        GST: 5,
    },
    {
        name: "Week 2",
        cost: 9450,
        additional: 2000,
        fuelLevy: 80,
        GST: 4,
    },
    {
        name: "Week 3",
        cost: 8546,
        additional: 3000,
        fuelLevy: 300,
        GST: 3,
    },
    {
        name: "Week 4",
        cost: 12355,
        additional: 5500,
        fuelLevy: 85,
        GST: 3.5,
    },
];

function TotalSpendChart() {
    const [activeLegend, setActiveLegend] = useState({
        cost: true,
        additional: true,
        fuelLevy: true,
        GST: true, // Keep this for consistency, even if not charted yet
    });

    const handleLegendClick = (dataKey) => {
        // Check if the clicked dataKey is the ONLY one currently active
        const isCurrentlyIsolated =
            activeLegend[dataKey] &&
            Object.values(activeLegend).filter((val) => val).length === 1;

        if (isCurrentlyIsolated) {
            // If it's currently isolated, reset to show all
            setActiveLegend({
                cost: true,
                additional: true,
                fuelLevy: true,
                GST: true,
            });
        } else {
            // Otherwise, isolate the clicked dataKey
            setActiveLegend({
                cost: dataKey === "cost",
                additional: dataKey === "additional",
                fuelLevy: dataKey === "fuelLevy",
                GST: dataKey === "GST",
            });
        }
    };

    return (
        <Card className="">
            <CardHeader className="flex justify-between">
                Total Spend
                <Popover placement="bottom-end" showArrow={true}>
                    <PopoverTrigger>
                        <Button variant="bordered" isIconOnly>
                            <FunnelIcon className="max-w-4 max-h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                        <DateRangePicker
                            size="sm"
                            label="Date Range"
                            variant="underline"
                        />
                    </PopoverContent>
                </Popover>
            </CardHeader>
            <CardBody className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dummySpendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend
                            verticalAlign="top"
                            height={50}
                            onClick={(e) => handleLegendClick(e.dataKey)}
                        />
                        {activeLegend.cost && (
                            <Bar
                                type="monotone"
                                dataKey="cost"
                                name="Cost"
                                fill="#ff7300"
                            />
                        )}
                        {activeLegend.additional && (
                            <Bar
                                type="basis"
                                dataKey="additional"
                                name="Add Charges"
                                fill="#8884d8"
                            />
                        )}
                        {activeLegend.fuelLevy && (
                            <Bar
                                type="basis"
                                dataKey="fuelLevy"
                                name="Fuel Levy"
                                fill="#82ca9d"
                            />
                        )}
                        {/* If you uncomment the GST bar, apply the same conditional rendering */}
                        {/* {activeLegend.GST && (
                            <Bar
                                type="basis"
                                dataKey="GST"
                                name="GST"
                                fill="#FFC658"
                            />
                        )} */}
                    </BarChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
}

export default TotalSpendChart;
