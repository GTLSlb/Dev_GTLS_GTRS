import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

import { ChartWrapper } from "./Card/ChartWrapper";
import { dummySpendData } from "../assets/js/dataHandler";
import { useDurationData } from "../assets/js/useDurationData";
import { DurationFilter } from "./Card/DurationFilter";
import { formatNumberWithCommas } from "@/CommonFunctions";
import { Divider, Select, SelectItem } from "@heroui/react";
import { useState } from "react";

function CostByStateChart() {
    const stateOptions = [
        { label: "NSW", value: "nsw" },
        { label: "QLD", value: "qld" },
        { label: "SA", value: "sa" },
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

    const [selectedState, setSelectedState] = useState(
        new Set(stateOptions.map((option) => option.value))
    );

    return (
        <ChartWrapper
            title={"Cost By State"}
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
                            selectedKeys={selectedState}
                            onSelectionChange={setSelectedState}
                            className="mt-2"
                        >
                            {stateOptions.map((option) => (
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
                <BarChart
                    width={700}
                    height={600}
                    data={getChartData}
                    margin={{
                        top: 0,
                        right: 20,
                        bottom: 0,
                        left: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) => `$${formatNumberWithCommas(v)}`}
                        angle={-45}
                    />
                    <Tooltip
                        contentStyle={{
                            fontSize: 12,
                            backgroundColor: "white",
                            borderRadius: 8,
                        }}
                    />
                    <Legend verticalAlign="top" height={50} />
                    {selectedState.has("qld") && (
                        <Bar
                            dataKey="qld"
                            stackId="a"
                            name="QLD"
                            fill="#8884d8"
                        />
                    )}
                    {selectedState.has("nsw") && (
                        <Bar
                            dataKey="nsw"
                            stackId="a"
                            name="NSW"
                            fill="#82ca9d"
                        />
                    )}
                    {selectedState.has("sa") && (
                        <Bar
                            dataKey="sa"
                            stackId="a"
                            name="SA"
                            fill="#952988"
                        />
                    )}
                </BarChart>
            }
        />
    );
}

export default CostByStateChart;
