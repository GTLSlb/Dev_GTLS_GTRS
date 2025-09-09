import { ChartWrapper } from "./Card/ChartWrapper";
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { DurationFilter } from "./Card/DurationFilter";
import { dummySpendData } from "../assets/js/dataHandler";
import { useDurationData } from "../assets/js/useDurationData";
import { Divider, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { NoData } from "../Comp/NoDataChart";
export function AmtVsType({ filters, setFilters, setSelected }) {
    const cosTypeOptions = [
        { label: "Weight", value: "weight" },
        { label: "Pallet Space", value: "pallet-space" },
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

    const [selectedCosType, setSelectedCosType] = useState(
        new Set(cosTypeOptions.map((option) => option.value))
    );
    return (
        <ChartWrapper
            title={"Spend vs Type"}
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
                            selectedKeys={selectedCosType}
                            onSelectionChange={setSelectedCosType}
                            className="mt-2"
                        >
                            {cosTypeOptions.map((option) => (
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
                getChartData.length === 0 ? (
                    <NoData />
                ) : (
                    <ComposedChart
                        width={700}
                        height={600}
                        data={getChartData}
                        onClick={(e)=>{setFilters({...filters, "date": e.activeLabel}); setSelected("table")}}
                        syncId="chart-sync-id" // Synchronize all axes
                    >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis
                            dataKey="name"
                            scale="band"
                            tick={{ fontSize: 12 }}
                            tickSize={10}
                        />
                        <YAxis
                            yAxisId="left"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(v) => `$${v}`}
                            domain={["auto", "auto"]}
                            syncId="chart-sync-id"
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(v) => v}
                            domain={["auto", "auto"]}
                            syncId="chart-sync-id"
                        />
                        <Tooltip
                            contentStyle={{
                                fontSize: 12,
                                backgroundColor: "white",
                                borderRadius: 8,
                            }}
                        />
                        <Legend verticalAlign="top" height={50} />
                        <Bar
                            dataKey="cost"
                            name="Spend"
                            fill="#413ea0"
                            yAxisId="left"
                            intercept={0}
                        />
                        {selectedCosType.has("weight") && (
                            <Line
                                type="monotone"
                                name="Weight"
                                dataKey="weight"
                                stroke="#8DC77B"
                                yAxisId="right"
                                intercept={0}
                            />
                        )}
                        {selectedCosType.has("pallet-space") && (
                            <Line
                                type="monotone"
                                name="Pallet Space"
                                dataKey="palletSpace"
                                stroke="#ff7300"
                                yAxisId="right"
                                intercept={0}
                            />
                        )}
                    </ComposedChart>
                )
            }
        />
    );
}
