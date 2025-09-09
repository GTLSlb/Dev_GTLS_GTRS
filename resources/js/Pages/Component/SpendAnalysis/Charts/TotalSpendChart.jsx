import { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChartWrapper } from "./Card/ChartWrapper";
import { Divider, Select, SelectItem } from "@heroui/react";
import { useDurationData } from "../assets/js/useDurationData.js";
import { dummySpendData } from "../assets/js/dataHandler";
import { DurationFilter } from "./Card/DurationFilter";
import { formatNumberWithCommas } from "@/CommonFunctions";
import { NoData } from "../Comp/NoDataChart";

const barTypeOptions = [
    { label: "Cost", value: "cost" },
    { label: "Fuel Levy", value: "fuelLevy" },
    { label: "Additional Charges", value: "additional" },
    { label: "GST", value: "GST" },
];

function TotalSpendChart({ filters, setFilters, setSelected }) {
    const [selectedBarTypes, setSelectedBarTypes] = useState(
        new Set(barTypeOptions.map((option) => option.value))
    );

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

    const handleLegendClick = (dataKey) => {
        const isCurrentlyIsolated =
            activeLegend[dataKey] &&
            Object.values(activeLegend).filter((val) => val).length === 1;

        if (isCurrentlyIsolated) {
            // If the clicked item is the only one active, show all
            setActiveLegend({
                cost: true,
                additional: true,
                fuelLevy: true,
                GST: true,
            });
        } else {
            // Otherwise, isolate the clicked item
            setActiveLegend({
                cost: dataKey === "cost",
                additional: dataKey === "additional",
                fuelLevy: dataKey === "fuelLevy",
                GST: dataKey === "GST",
            });
        }
    };

    const hasData = getChartData.length > 0;

    return (
        <ChartWrapper
            title={"Total Spend"}
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
                    <div className="w-full ">
                        <Divider />
                        <Select
                            placeholder="Select Bar Types"
                            disallowEmptySelection
                            size="sm"
                            selectionMode="multiple" // Key property for multi-select
                            selectedKeys={selectedBarTypes}
                            onSelectionChange={setSelectedBarTypes}
                            className=" mt-2"
                            aria-label="Select bar types for chart"
                        >
                            {barTypeOptions.map((option) => (
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
                        data={getChartData}
                        width={700}
                        height={600}
                        onClick={(e) => {
                            console.log({ ...filters, date: e.activeLabel });
                            setSelected("table");
                        }}
                        margin={{
                            top: 0,
                            right: 30,
                            left: 0,
                            bottom: 5,
                        }}
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
                            formatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Legend
                            verticalAlign="top"
                            height={50}
                            fontSize={10}
                            className="!text-sm"
                            wrapperStyle={{ fontSize: 12 }}
                            onClick={(e) => handleLegendClick(e.dataKey)}
                        />
                        {selectedBarTypes.has("cost") && (
                            <Bar dataKey="cost" name="Cost" fill="#ff7300" />
                        )}
                        {selectedBarTypes.has("additional") && (
                            <Bar
                                dataKey="additional"
                                name="Add Charges"
                                fill="#8884d8"
                            />
                        )}
                        {selectedBarTypes.has("fuelLevy") && (
                            <Bar
                                dataKey="fuelLevy"
                                name="Fuel Levy"
                                fill="#82ca9d"
                            />
                        )}
                        {selectedBarTypes.has("GST") && (
                            <Bar dataKey="GST" name="GST" fill="#FFC658" />
                        )}
                    </BarChart>
                ) : (
                    <NoData />
                )
            }
        ></ChartWrapper>
    );
}

export default TotalSpendChart;
