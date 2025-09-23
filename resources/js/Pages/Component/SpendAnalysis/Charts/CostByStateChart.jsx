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
import { dummySpendData, getUniqueStates, getDateRange } from "../assets/js/dataHandler";
import { useDurationData } from "../assets/js/useDurationData";
import { DurationFilter } from "./Card/DurationFilter";
import { formatNumberWithCommas } from "@/CommonFunctions";
import { Divider, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { NoData } from "../Comp/NoDataChart";

function CostByStateChart({
    filters,
    setFilters,
    setSelected,
    clearChartsFilters,
}) {
    const stateOptions = getUniqueStates(dummySpendData);

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
        selectedYearValue,
        setSelectedQuarterKey,
    } = useDurationData(dummySpendData);

    const [selectedState, setSelectedState] = useState(
        new Set(stateOptions.map((option) => option.value))
    );
    const handleClick = (data) => {
        clearChartsFilters();
        setFilters({
            ...filters,
            dateStart: getDateRange(data.activeLabel, selectedYearValue).start,
            dateEnd: getDateRange(data.activeLabel, selectedYearValue).end,
        });
        setSelected("table");
    };

    const hasData = getChartData.length > 0;
    return (
        <ChartWrapper
            title={"Spend By State"}
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
                            selectedKeys={selectedState}
                            onSelectionChange={setSelectedState}
                            className="mt-2"
                        >
                            {stateOptions?.map((option) => (
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
                        onClick={handleClick}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(v) =>
                                `$${formatNumberWithCommas(v)}`
                            }
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
                        {stateOptions
                        .filter((state) => Array.from(selectedState)?.includes(state.value))
                        .map((state) => (
                            <Bar
                            key={state.value}
                            dataKey={state.value.toUpperCase()}
                            stackId={state.value.slice(0, 1)}
                            name={state.label}
                            fill={state.color}
                            />
                        ))}
                    </BarChart>
                ) : (
                    <NoData />
                )
            }
        />
    );
}

export default CostByStateChart;
