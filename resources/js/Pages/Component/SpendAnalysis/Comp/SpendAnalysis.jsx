import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Progress,
} from "@heroui/react";
import {
    FaBox,
    FaChartLine,
    FaClipboardCheck,
    FaCube,
    FaDollarSign,
    FaGasPump,
    FaTruck,
    FaUsers,
    FaUserShield,
    FaWeightHanging,
} from "react-icons/fa";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
function SpendAnalysis() {
    const dummySpendData = [
        {
            name: "Week 1",
            cost: 10542,
            additional: 5500,
            fuelLevy: 1000,
            GST: 5,
        },
        {
            name: "Week 2",
            cost: 9450,
            additional: 2000,
            fuelLevy: 1500,
            GST: 4,
        },
        {
            name: "Week 3",
            cost: 8546,
            additional: 3000,
            fuelLevy: 1000,
            GST: 3,
        },
        {
            name: "Week 4",
            cost: 12355,
            additional: 5500,
            fuelLevy: 97.1,
            GST: 3.5,
        },
    ];

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

    const information = [
        { label: "# of Receivers", value: "1,437", icon: <FaUsers /> },
        {
            label: "Total Cost",
            value: "$11,952,429.18",
            icon: <FaDollarSign />,
        },
        {
            label: "Fuel Surcharge cost",
            value: "$795,297.81",
            icon: <FaGasPump />,
        },
        {
            label: "Total Weight",
            value: "112,426.15",
            icon: <FaWeightHanging />,
        },
        { label: "Total pallet space", value: "196,146.50", icon: <FaBox /> },
        { label: "Total Chep", value: "115,444", icon: <FaCube /> },
        { label: "Total Loscam", value: "26,104", icon: <FaTruck /> },
        {
            label: "Total Customer OWN",
            value: "111,159",
            icon: <FaUserShield />,
        },
        {
            label: "# of True PODs",
            value: "17,357",
            icon: <FaClipboardCheck />,
        },
        { label: "% of True PODs", value: "96.59%", icon: <FaChartLine /> },
    ];

    return (
        <div>
            {/* <Stats /> */}
            <div className="flex gap-2 mt-5 h-[80vh]">
                <div className="w-2/3 h-full grid grid-cols-2 gap-2">
                    <Card className="">
                        <CardHeader className="flex justify-between">
                            Cost vs Additional Charges
                        </CardHeader>
                        <CardBody className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dummySpendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={50} />
                                    <Bar
                                        type="monotone"
                                        dataKey="cost"
                                        name="Cost"
                                        fill="#ff7300"
                                    />
                                    <Bar
                                        type="basis"
                                        dataKey="additional"
                                        name="Add Charges"
                                        fill="#8884d8"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardBody>
                    </Card>
                    <Card className="">
                        <CardHeader className="flex justify-between">
                            Cost By State
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
                    <Card className=" col-span-2">
                        <CardHeader>Top Receivers and Spend</CardHeader>
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
                </div>
                <div className="w-1/3 h-full">
                    <Card fullWidth className="h-full">
                        <CardHeader className="font-bold flex flex-col text-lg items-start">
                            Information
                            <Divider className="mt-2" />
                        </CardHeader>
                        <CardBody className="">
                            {information.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-row justify-between mb-3"
                                >
                                    <label className="text-gray-500">
                                        <div className="flex gap-2 justify-center items-center">
                                            <span className="w-4 h-4">
                                                {item.icon}
                                            </span>{" "}
                                            {item.label}:
                                        </div>
                                    </label>
                                    <span className="font-semibold">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                            <div className="flex flex-col gap-4 mt-5">
                                <Progress
                                    aria-label="Loading..."
                                    label={`Total Consignments Pending: ${800}`}
                                    className="mb-2"
                                    classNames={{
                                        indicator: "bg-[#413ea0]",
                                        label: "text-gray-500",
                                    }}
                                    size="md"
                                    value={80}
                                />
                                <Progress
                                    aria-label="Loading..."
                                    label={`Total Consignment Delivered on Time: ${100}`}
                                    className="mb-2"
                                    classNames={{
                                        indicator: "bg-[#82ca9d]",
                                        label: "text-gray-500",
                                    }}
                                    size="md"
                                    value={10}
                                />
                                <Progress
                                    aria-label="Loading..."
                                    label={`Total Consignment Not Delivered on Time: ${100}`}
                                    className="mb-2"
                                    classNames={{
                                        indicator: "bg-[#ff7300]",
                                        label: "text-gray-500",
                                    }}
                                    size="md"
                                    value={10}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default SpendAnalysis;
