import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { ChartWrapper } from "./Card/ChartWrapper";
import { DurationFilter } from "./Card/DurationFilter";
import { dummySpendData } from "../assets/js/dataHandler";
import { useDurationData } from "../assets/js/useDurationData";
import { useMemo, useState } from "react";
import { Divider, Select, SelectItem } from "@heroui/react";

export function ServiceTypeChart() {
    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#8884d8",
        "#82ca9d",
        "#ffc658",
        "#d0ed57",
    ];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "middle" : "middle"}
                dominantBaseline="central"
                className="text-sm"
            >
                {`${(percent * 100).toFixed(2)}%`}
            </text>
        );
    };

    const {
        getChartData,
        selectedPeriodKey,
        setSelectedPeriodKey,
        selectedYearKey,
        setSelectedYearKey,
        selectedMonthKey,
        setSelectedMonthKey,
        availableYears,
        selectedPeriodValue,
        selectedQuarterKey,
        setSelectedQuarterKey,
    } = useDurationData(dummySpendData);

    const [selectedServiceType, setSelectedServiceType] = useState(new Set());

    const availableServiceTypes = useMemo(() => {
        const serviceTypes = new Set();
        getChartData.forEach((periodData) => {
            if (
                periodData.serviceTypeOccurrences &&
                Array.isArray(periodData.serviceTypeOccurrences)
            ) {
                periodData.serviceTypeOccurrences.forEach((serviceTypeItem) => {
                    serviceTypes.add(serviceTypeItem.type);
                });
            }
        });
        return Array.from(serviceTypes);
    }, [getChartData]);

    const pieChartData = useMemo(() => {
        const aggregatedServiceTypes = {};
        let totalOverallItems = 0;

        getChartData.forEach((periodData) => {
            if (
                periodData.serviceTypeOccurrences &&
                Array.isArray(periodData.serviceTypeOccurrences)
            ) {
                periodData.serviceTypeOccurrences.forEach((serviceTypeItem) => {
                    const { type, count } = serviceTypeItem;

                    // Fix 2: Proper filtering logic for Set
                    // If nothing selected (size 0) or if the type is in the selected set
                    if (
                        selectedServiceType.size === 0 ||
                        selectedServiceType.has(type)
                    ) {
                        totalOverallItems += count;
                        if (aggregatedServiceTypes[type]) {
                            aggregatedServiceTypes[type] += count;
                        } else {
                            aggregatedServiceTypes[type] = count;
                        }
                    }
                });
            }
        });

        const filteredData = Object.entries(aggregatedServiceTypes).filter(
            ([type, count]) => count > 0
        );

        return filteredData.map(([type, count]) => ({
            name: type,
            value: count,
            percentage:
                totalOverallItems > 0 ? (count / totalOverallItems) * 100 : 0,
        }));
    }, [getChartData, selectedServiceType]);

    const hasServiceTypeData =
        pieChartData.length > 0 && pieChartData.some((item) => item.value > 0);

    const getColors = (data) => {
        if (data.length === 1) {
            const serviceTypeIndex = availableServiceTypes.findIndex(
                (type) => type === data[0].name
            );
            return [COLORS[serviceTypeIndex % COLORS.length]];
        }
        return data.map((entry, index) => COLORS[index % COLORS.length]);
    };

    const pieChartColors = getColors(pieChartData);

    return (
        <ChartWrapper
            title={"Service Type Distribution"}
            modalSize="xl"
            filterChildren={
                <>
                    <DurationFilter
                        selectedPeriodKey={selectedPeriodKey}
                        setSelectedPeriodKey={setSelectedPeriodKey}
                        selectedYearKey={selectedYearKey}
                        setSelectedYearKey={setSelectedYearKey}
                        selectedMonthKey={selectedMonthKey}
                        setSelectedMonthKey={setSelectedMonthKey}
                        availableYears={availableYears}
                        selectedPeriodValue={selectedPeriodValue}
                        selectedQuarterKey={selectedQuarterKey}
                        setSelectedQuarterKey={setSelectedQuarterKey}
                    />
                    <div className="w-full">
                        <Divider />
                        <Select
                            placeholder="Select Service Types"
                            size="sm"
                            selectionMode="multiple"
                            selectedKeys={selectedServiceType}
                            onSelectionChange={setSelectedServiceType}
                            className="mt-2"
                        >
                            {availableServiceTypes.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </>
            }
            children={
                hasServiceTypeData ? (
                    <PieChart width={400} height={300}>
                        <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={pieChartColors[index]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                fontSize: 12,
                                backgroundColor: "white",
                                borderRadius: 8,
                            }}
                            formatter={(value, name, props) => [
                                `${props.payload.percentage.toFixed(2)}%`,
                                name,
                            ]}
                        />
                        <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{ paddingTop: "20px" }}
                        />
                    </PieChart>
                ) : (
                    <div className="flex justify-center items-center h-[300px] text-gray-500">
                        No Service Type Data Available for the Selected Period.
                    </div>
                )
            }
        />
    );
}
