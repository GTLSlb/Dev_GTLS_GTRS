import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    Card,
    CardBody,
    CardHeader,
    Select,
    SelectItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Button,
} from "@heroui/react";
import { FunnelIcon } from "@heroicons/react/24/outline";


function TopReceiversCharts() {
    const Receiverdata = [
        { name: "Receiver 1", amt: 4000, cnb: 85 },
        { name: "Receiver 2", amt: 3000, cnb: 78 },
        { name: "Receiver 3", amt: 2000, cnb: 64 },
        { name: "Receiver 4", amt: 2780, cnb: 92 },
        { name: "Receiver 5", amt: 1890, cnb: 55 },
        { name: "Receiver 6", amt: 2390, cnb: 70 },
        { name: "Receiver 7", amt: 3490, cnb: 88 },
        { name: "Receiver 8", amt: 3100, cnb: 76 },
        { name: "Receiver 9", amt: 2200, cnb: 60 },
        { name: "Receiver 10", amt: 2650, cnb: 68 },
        { name: "Receiver 11", amt: 1800, cnb: 53 },
        { name: "Receiver 12", amt: 2950, cnb: 80 },
        { name: "Receiver 13", amt: 3300, cnb: 90 },
        { name: "Receiver 14", amt: 2100, cnb: 58 },
        { name: "Receiver 15", amt: 2750, cnb: 73 },
        { name: "Receiver 16", amt: 2400, cnb: 66 },
        { name: "Receiver 17", amt: 3600, cnb: 95 },
        { name: "Receiver 18", amt: 1950, cnb: 62 },
        { name: "Receiver 19", amt: 2850, cnb: 82 },
        { name: "Receiver 20", amt: 3200, cnb: 89 },
    ];
    return (
        <Card className=" col-span-2">
            <CardHeader className="flex justify-between">
                Top Receivers and Spend
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
                <Select
                    variant="underline"
                    className="w-[200px] shadow-none"
                    label="Select a receiver"
                >
                    {Receiverdata.map((state) => (
                        <SelectItem key={state.name}>{state.name}</SelectItem>
                    ))}
                </Select>
            </CardHeader>
            <CardBody className="h-80">
                <ResponsiveContainer>
                    <ComposedChart
                        data={Receiverdata}
                        interval={0}
                        margin={{
                            top: 0,
                            right: 20,
                            bottom: 30,
                            left: 20,
                        }}
                        syncId="chart-sync-id" // Synchronize all axes
                    >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis
                            dataKey="name"
                            scale="band"
                            interval={0}
                            tick={{ fontSize: 12 }} // Adjust font size to fit better
                            angle={-45} // Rotates the tick labels to avoid overlap
                            textAnchor="end" // Aligns the text properly
                        />
                        <YAxis
                            yAxisId="left"
                            label={{
                                value: "Amount ($)",
                                angle: -90,
                                offset: "-10",
                                position: "insideLeft",
                            }}
                            tickFormatter={(v) => `$${v}`}
                            domain={["auto", "auto"]}
                            syncId="chart-sync-id"
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            label={{
                                value: "CNB Score",
                                angle: 90,
                                position: "insideRight",
                            }}
                            tickFormatter={(v) => v}
                            domain={["auto", "auto"]}
                            syncId="chart-sync-id"
                        />
                        <Tooltip />
                        <Legend verticalAlign="top" height={50} />
                        <Bar
                            dataKey="amt"
                            name="Amount"
                            fill="#413ea0"
                            yAxisId="left"
                            intercept={0}
                        />
                        <Line
                            type="monotone"
                            name="Cons Nb"
                            dataKey="cnb"
                            stroke="#ff7300"
                            yAxisId="right"
                            intercept={0}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
}

export default TopReceiversCharts;
