import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import {
    Card,
    CardBody,
    CardHeader,
    Button,
    DateRangePicker,
    Popover,
    PopoverTrigger,
    Select,
    SelectItem,
    PopoverContent,
} from "@heroui/react";
import { FunnelIcon } from "@heroicons/react/24/outline";

const states = [
    { key: "sa", label: "SA" },
    { key: "qld", label: "QLD" },
    { key: "nsw", label: "NSW" },
];

function CostByStateChart() {
    const Statesdata = [
        {
            name: "Jan 2025",
            nsw: 4000,
            qld: 2400,
            sa: 2400,
        },
        {
            name: "Feb 2025",
            nsw: 3000,
            qld: 1398,
            sa: 2210,
        },
        {
            name: "Mar 2025",
            nsw: 2000,
            qld: 9800,
            sa: 2290,
        },
        {
            name: "Apr 2025",
            nsw: 2780,
            qld: 3908,
            sa: 2000,
        },
        {
            name: "May 2025",
            nsw: 1890,
            qld: 4800,
            sa: 2181,
        },
        {
            name: "Jun 2025",
            nsw: 2390,
            qld: 3800,
            sa: 2500,
        },
        {
            name: "July 2025",
            nsw: 3490,
            qld: 4300,
            sa: 2100,
        },
    ];
    return (
        <Card className="">
            <CardHeader className="flex justify-between">
                Cost By State
                <Popover placement="bottom" showArrow={true}>
                    <PopoverTrigger>
                        <Button variant="bordered" isIconOnly>
                            <FunnelIcon className="max-w-4 max-h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                        <Select  size="sm" variant="none" className="" label="Select a state">
                            {states.map((state) => (
                                <SelectItem key={state.key}>
                                    {state.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <DateRangePicker
                            size="sm"
                            label="Range"
                            variant="underline"
                        />
                    </PopoverContent>
                </Popover>
            </CardHeader>
            <CardBody className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={Statesdata}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend verticalAlign="top" height={50} />
                        <Bar
                            dataKey="qld"
                            stackId="a"
                            name="QLD"
                            fill="#8884d8"
                        />
                        <Bar
                            dataKey="nsw"
                            stackId="a"
                            name="NSW"
                            fill="#82ca9d"
                        />
                        <Bar
                            dataKey="sa"
                            stackId="a"
                            name="SA"
                            fill="#952988"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
}

export default CostByStateChart;
