import { Card, CardBody, CardHeader, Divider, Progress } from "@heroui/react";
import { FaDollarSign, FaUsers, FaTruckLoading } from "react-icons/fa";
import { dummySpendData, parseHeatMapData } from "../../assets/js/dataHandler";

function HeatSidebar() {
    const information = parseHeatMapData(dummySpendData);
    // const information = [
    //     {
    //         groupName: "General Information",
    //         items: [
    //             { label: "# of Receivers", value: "1,437", icon: <FaUsers /> },
    //             {
    //                 label: "Total Cost",
    //                 value: "$11,952,429.18",
    //                 icon: <FaDollarSign />,
    //             },
    //         ],
    //     },
    //     {
    //         groupName: "Consignments by State",
    //         items: [
    //             {
    //                 label: "Total cons in NSW",
    //                 value: "1,437",
    //                 icon: <FaTruckLoading />,
    //             },
    //             {
    //                 label: "Total cons in QLD",
    //                 value: "1,437",
    //                 icon: <FaTruckLoading />,
    //             },
    //             {
    //                 label: "Total cons in VIC",
    //                 value: "1,437",
    //                 icon: <FaTruckLoading />,
    //             },
    //             {
    //                 label: "Total cons in SA",
    //                 value: "1,437",
    //                 icon: <FaTruckLoading />,
    //             },
    //         ],
    //     },
    // ];

    return (
        <div className="h-[80vh]">
            <Card fullWidth className="h-full">
                <CardHeader className="font-bold flex flex-col text-lg items-start">
                    Information
                    <Divider className="mt-2" />
                </CardHeader>
                <CardBody className="">
                    {/* General Information and Consignment by State */}
                    {/* Don't show the consignment status group here*/}
                    {information?.slice(0, information.length - 1)?.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            {groupIndex > 0 && <Divider className="my-4" />} {/* Add divider before each group except the first */}
                            <h3 className="font-semibold text-md mb-2">{group.groupName}</h3>
                            {group.items.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="flex flex-row justify-between mb-3"
                                >
                                    <label className="text-gray-500">
                                        <div className="flex gap-2 justify-center items-center">
                                            <span className="w-4 h-4">{item.icon}</span>{" "}
                                            {item.label}:
                                        </div>
                                    </label>
                                    <span className="font-semibold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                    {/* Consignment Status */}
                    <div className="flex flex-col gap-4 mt-5 ">
                        <Progress
                            aria-label="Loading..."
                            label={`Total Consignments Pending: ${information.reduce((acc, group) => {
                                if (group.groupName === "Consignment Status") {
                                    const pendingItem = group.items.find(item => item.label === "PENDING");
                                    if (pendingItem) {
                                        return acc + parseInt(pendingItem.value.replace(/,/g, ''));
                                    }
                                }
                                return acc;
                            }, 0)}`}
                            className="mb-2"
                            classNames={{
                                indicator: "bg-[#413ea0]",
                                label: "text-gray-500",
                            }}
                            size="md"
                            value={information.reduce((acc, group) => {
                                if (group.groupName === "Consignment Status") {
                                    const pendingItem = group.items.find(item => item.label === "PENDING");
                                    if (pendingItem) {
                                        return acc + parseInt(pendingItem.value.replace(/,/g, ''));
                                    }
                                }
                                return acc;
                            }, 0)}
                        />
                        <Progress
                            aria-label="Loading..."
                            label={`Total Consignment Delivered on Time: ${information.reduce((acc, group) => {
                                if (group.groupName === "Consignment Status") {
                                    const pendingItem = group.items.find(item => item.label === "PASS");
                                    if (pendingItem) {
                                        return acc + parseInt(pendingItem.value.replace(/,/g, ''));
                                    }
                                }
                                return acc;
                            }, 0)}`}
                            className="mb-2"
                            classNames={{
                                indicator: "bg-[#82ca9d]",
                                label: "text-gray-500",
                            }}
                            size="md"
                            value={information.reduce((acc, group) => {
                                if (group.groupName === "Consignment Status") {
                                    const pendingItem = group.items.find(item => item.label === "PASS");
                                    if (pendingItem) {
                                        return acc + parseInt(pendingItem.value.replace(/,/g, ''));
                                    }
                                }
                                return acc;
                            }, 0)}
                        />
                        <Progress
                            aria-label="Loading..."
                            label={`Total Consignment Not Delivered on Time: ${information.reduce((acc, group) => {
                                if (group.groupName === "Consignment Status") {
                                    const pendingItem = group.items.find(item => item.label === "FAIL");
                                    if (pendingItem) {
                                        return acc + parseInt(pendingItem.value.replace(/,/g, ''));
                                    }
                                }
                                return acc;
                            }, 0)}`}
                            className="mb-2"
                            classNames={{
                                indicator: "bg-[#ff7300]",
                                label: "text-gray-500",
                            }}
                            size="md"
                            value={information.reduce((acc, group) => {
                                if (group.groupName === "Consignment Status") {
                                    const pendingItem = group.items.find(item => item.label === "FAIL");
                                    if (pendingItem) {
                                        return acc + parseInt(pendingItem.value.replace(/,/g, ''));
                                    }
                                }
                                return acc;
                            }, 0)}
                        />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default HeatSidebar;
