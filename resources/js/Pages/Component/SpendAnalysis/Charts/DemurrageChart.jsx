import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { ChartWrapper } from "./Card/ChartWrapper";
import { DurationFilter } from "./Card/DurationFilter";
import { dummySpendData } from "../assets/js/dataHandler";
import { useDurationData } from "../assets/js/useDurationData";
import { useMemo, useState } from "react";
import { Divider, Select, SelectItem } from "@heroui/react";
import { NoData } from "../Comp/NoDataChart";

function DemurrageCost() {
    const demmurageTypeOptions = [
        { label: "Semi Demurrage", value: "Semi Demurrage" },
        { label: "BD Demurrage", value: "BD Demurrage" },
        { label: "Rigid Demurrage", value: "Rigid Demurrage" },
        { label: "Demurrage", value: "Demurrage" },
    ];
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
        outerRadius,
        percent,
        index,
    }) => {
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 0) * cos;
        const sy = cy + (outerRadius + 0) * sin;
        const mx = cx + (outerRadius + 0) * cos;
        const my = cy + (outerRadius + 0) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 20;
        const ey = my;
        const textAnchor = cos >= 0 ? "start" : "end";

        const filteredData = pieChartData.filter((entry) =>
            selectedTypes.has(entry.name)
        );
        const originalIndex = demmurageTypeOptions.findIndex(
            (option) => option.value === filteredData[index].name
        );
        const color = COLORS[originalIndex % COLORS.length];

        return (
            <g>
                <path
                    d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                    stroke={color}
                    fill="none"
                />
                <circle cx={ex} cy={ey} r={2} fill={color} stroke="none" />
                <text
                    className="text-sm"
                    x={ex + (cos >= 0 ? 1 : -1) * 8}
                    y={ey}
                    fill={color}
                    textAnchor={textAnchor}
                    dominantBaseline="central"
                >
                    {`(${(percent * 100).toFixed(0)}%)`}
                </text>
            </g>
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

    const pieChartData = useMemo(() => {
        const aggregatedDemurrage = {};
        getChartData.forEach((periodData) => {
            if (periodData.demurrage && Array.isArray(periodData.demurrage)) {
                periodData.demurrage.forEach((demurrageItem) => {
                    const { type, totalCost } = demurrageItem;
                    if (aggregatedDemurrage[type]) {
                        aggregatedDemurrage[type] += totalCost;
                    } else {
                        aggregatedDemurrage[type] = totalCost;
                    }
                });
            }
        });
        return Object.entries(aggregatedDemurrage).map(([type, totalCost]) => ({
            name: type,
            value: totalCost,
        }));
    }, [getChartData]);

    const [selectedTypes, setSelectedTypes] = useState(
        new Set(demmurageTypeOptions.map((option) => option.value))
    );

    const filteredPieChartData = useMemo(() => {
        return pieChartData.filter((entry) => selectedTypes.has(entry.name));
    }, [pieChartData, selectedTypes]);

    const hasData = getChartData.length > 0;

    return (
        <ChartWrapper
            title={"Demurrage Cost"}
            modalSize={"xl"}
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
                            placeholder="Select Bar Types"
                            disallowEmptySelection
                            size="sm"
                            selectionMode="multiple"
                            selectedKeys={selectedTypes}
                            onSelectionChange={setSelectedTypes}
                            className="mt-2"
                        >
                            {demmurageTypeOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </>
            }
            children={
                hasData ? (
                    <PieChart className="" width={400} height={400}>
                        <Pie
                            data={filteredPieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {/* Map over the filtered data to create cells with the correct colors */}
                            {filteredPieChartData.map((entry, index) => {
                                const originalIndex =
                                    demmurageTypeOptions.findIndex(
                                        (option) => option.value === entry.name
                                    );
                                const color =
                                    COLORS[originalIndex % COLORS.length];
                                return (
                                    <Cell key={`cell-${index}`} fill={color} />
                                );
                            })}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                fontSize: 12,
                                backgroundColor: "white",
                                borderRadius: 8,
                            }}
                            formatter={(value, name) => [
                                `$${value.toFixed(2)}`,
                                name,
                            ]}
                        />
                        <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            fontSize={10}
                            wrapperStyle={{ fontSize: 12, paddingTop: "20px" }}
                        />
                    </PieChart>
                ) : (
                    <NoData />
                )
            }
        />
    );
}

export default DemurrageCost;
