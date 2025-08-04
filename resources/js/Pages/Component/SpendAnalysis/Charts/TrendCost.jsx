import { ChartWrapper } from "./Card/ChartWrapper";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { DurationFilter } from "./Card/DurationFilter";
import { dummySpendData } from "../assets/js/dataHandler";
import { useDurationData } from "../assets/js/useDurationData";
import { formatNumberWithCommas } from "@/CommonFunctions";
import { Divider, Select, SelectItem } from "@heroui/react";
import { useState } from "react";

export function TrendCost() {
    const costTypeOptions = [
        { label: "Cost", value: "cost" },
        { label: "Additional Charges", value: "additional" },
    ];

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

    const [selectedCostType, setSelectedCostType] = useState(
        new Set(costTypeOptions.map((option) => option.value))
    );

    return (
        <ChartWrapper
            title={"Cost Trend"}
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
                            selectionMode="multiple" // Key property for multi-select
                            selectedKeys={selectedCostType}
                            onSelectionChange={setSelectedCostType}
                            className="mt-2"
                        >
                            {costTypeOptions.map((option) => (
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
                <LineChart
                    width={700}
                    height={600}
                    data={getChartData}
                    margin={{
                        right: 30,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                        angle={-45}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) => `$${formatNumberWithCommas(v)}`}
                    />
                    <Tooltip
                        contentStyle={{
                            fontSize: 12,
                            backgroundColor: "white",
                            borderRadius: 8,
                        }}
                    />
                    <Legend />
                    {selectedCostType.has("cost") && (
                        <Line type="monotone" dataKey="cost" stroke="#8884d8" />
                    )}
                    {selectedCostType.has("additional") && (
                        <Line
                            type="monotone"
                            dataKey="additional"
                            stroke="#82ca9d"
                        />
                    )}
                </LineChart>
            }
        />
    );
}
