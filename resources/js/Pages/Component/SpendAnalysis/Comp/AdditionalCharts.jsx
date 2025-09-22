import "../assets/css/chart.css";
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Progress,
    Select,
    SelectItem,
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
import CostByStateChart from "../Charts/CostByStateChart";
import TopReceiversCharts from "../Charts/TopReceiversCharts";
import DemurrageCost from "../Charts/DemurrageChart";
import {
    dummySpendData,
    parseOperationAnalysisInfo,
} from "../assets/js/dataHandler";

function AdditionalCharts({
    filters,
    setFilters,
    setSelected,
    clearChartsFilters,
}) {
    const information = parseOperationAnalysisInfo(dummySpendData);
    // const information = [
    //     { label: "# of Receivers", value: "1,437", icon: <FaUsers /> },
    //     {
    //         label: "Total Spend",
    //         value: "$11,952,429.18",
    //         icon: <FaDollarSign />,
    //     },
    //     {
    //         label: "Fuel Surcharge cost",
    //         value: "$795,297.81",
    //         icon: <FaGasPump />,
    //     },
    //     {
    //         label: "Total Weight",
    //         value: "112,426.15",
    //         icon: <FaWeightHanging />,
    //     },
    //     { label: "Total pallet space", value: "196,146.50", icon: <FaBox /> },
    //     { label: "Total Chep", value: "115,444", icon: <FaCube /> },
    //     { label: "Total Loscam", value: "26,104", icon: <FaTruck /> },
    //     {
    //         label: "Total Customer OWN",
    //         value: "111,159",
    //         icon: <FaUserShield />,
    //     },
    //     {
    //         label: "# of True PODs",
    //         value: "17,357",
    //         icon: <FaClipboardCheck />,
    //     },
    //     { label: "% of True PODs", value: "96.59%", icon: <FaChartLine /> },
    // ];
    return (
        <div>
            <div className="flex gap-2 mt-2 h-[80vh]">
                <div className="w-2/3 h-full grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-2">
                    <CostByStateChart
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        clearChartsFilters={clearChartsFilters}
                    />
                    <DemurrageCost
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        clearChartsFilters={clearChartsFilters}
                    />
                    <TopReceiversCharts
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        clearChartsFilters={clearChartsFilters}
                    />
                </div>
                <div className="w-1/3 h-full">
                    <Card fullWidth className="h-full">
                        <CardHeader className="font-bold flex flex-col text-lg items-start">
                            Information
                            <Divider className="mt-2" />
                        </CardHeader>
                        <CardBody className="">
                            {information
                                ?.slice(0, information.length - 1)
                                ?.map((item, index) => (
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
                            {/* <ServiceTypeChart /> */}
                            <div className="flex flex-col gap-4 mt-5 ">
                                <Progress
                                    aria-label="Loading..."
                                    label={`Total Consignments Pending: ${information.reduce(
                                        (acc, group) => {
                                            if (
                                                group.groupName ===
                                                "Consignment Status"
                                            ) {
                                                const pendingItem =
                                                    group.items.find(
                                                        (item) =>
                                                            item.label ===
                                                            "PENDING"
                                                    );
                                                if (pendingItem) {
                                                    return (
                                                        acc +
                                                        parseInt(
                                                            pendingItem.value.replace(
                                                                /,/g,
                                                                ""
                                                            )
                                                        )
                                                    );
                                                }
                                            }
                                            return acc;
                                        },
                                        0
                                    )}`}
                                    className="mb-2"
                                    classNames={{
                                        indicator: "bg-[#413ea0]",
                                        label: "text-gray-500",
                                    }}
                                    size="md"
                                    value={information.reduce((acc, group) => {
                                        if (
                                            group.groupName ===
                                            "Consignment Status"
                                        ) {
                                            const pendingItem =
                                                group.items.find(
                                                    (item) =>
                                                        item.label === "PENDING"
                                                );
                                            if (pendingItem) {
                                                return (
                                                    acc +
                                                    parseInt(
                                                        pendingItem.value.replace(
                                                            /,/g,
                                                            ""
                                                        )
                                                    )
                                                );
                                            }
                                        }
                                        return acc;
                                    }, 0)}
                                />
                                <Progress
                                    aria-label="Loading..."
                                    label={`Total Consignment Delivered on Time: ${information.reduce(
                                        (acc, group) => {
                                            if (
                                                group.groupName ===
                                                "Consignment Status"
                                            ) {
                                                const pendingItem =
                                                    group.items.find(
                                                        (item) =>
                                                            item.label ===
                                                            "PASS"
                                                    );
                                                if (pendingItem) {
                                                    return (
                                                        acc +
                                                        parseInt(
                                                            pendingItem.value.replace(
                                                                /,/g,
                                                                ""
                                                            )
                                                        )
                                                    );
                                                }
                                            }
                                            return acc;
                                        },
                                        0
                                    )}`}
                                    className="mb-2"
                                    classNames={{
                                        indicator: "bg-[#82ca9d]",
                                        label: "text-gray-500",
                                    }}
                                    size="md"
                                    value={information.reduce((acc, group) => {
                                        if (
                                            group.groupName ===
                                            "Consignment Status"
                                        ) {
                                            const pendingItem =
                                                group.items.find(
                                                    (item) =>
                                                        item.label === "PASS"
                                                );
                                            if (pendingItem) {
                                                return (
                                                    acc +
                                                    parseInt(
                                                        pendingItem.value.replace(
                                                            /,/g,
                                                            ""
                                                        )
                                                    )
                                                );
                                            }
                                        }
                                        return acc;
                                    }, 0)}
                                />
                                <Progress
                                    aria-label="Loading..."
                                    label={`Total Consignment Not Delivered on Time: ${information.reduce(
                                        (acc, group) => {
                                            if (
                                                group.groupName ===
                                                "Consignment Status"
                                            ) {
                                                const pendingItem =
                                                    group.items.find(
                                                        (item) =>
                                                            item.label ===
                                                            "FAIL"
                                                    );
                                                if (pendingItem) {
                                                    return (
                                                        acc +
                                                        parseInt(
                                                            pendingItem.value.replace(
                                                                /,/g,
                                                                ""
                                                            )
                                                        )
                                                    );
                                                }
                                            }
                                            return acc;
                                        },
                                        0
                                    )}`}
                                    className="mb-2"
                                    classNames={{
                                        indicator: "bg-[#ff7300]",
                                        label: "text-gray-500",
                                    }}
                                    size="md"
                                    value={information.reduce((acc, group) => {
                                        if (
                                            group.groupName ===
                                            "Consignment Status"
                                        ) {
                                            const pendingItem =
                                                group.items.find(
                                                    (item) =>
                                                        item.label === "FAIL"
                                                );
                                            if (pendingItem) {
                                                return (
                                                    acc +
                                                    parseInt(
                                                        pendingItem.value.replace(
                                                            /,/g,
                                                            ""
                                                        )
                                                    )
                                                );
                                            }
                                        }
                                        return acc;
                                    }, 0)}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default AdditionalCharts;
