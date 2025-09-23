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
import { ChartWrapper } from "./Card/ChartWrapper";
import { useState, useEffect } from "react"; // Import useEffect for initial state
import { useDurationData } from "../assets/js/useDurationData";
import { dummySpendData, getDateRange } from "../assets/js/dataHandler";
import { DurationFilter } from "./Card/DurationFilter";
import { formatNumberWithCommas } from "@/CommonFunctions";
import { NoData } from "../Comp/NoDataChart";

function TopReceiversCharts({
    filters,
    setFilters,
    setSelected,
    clearChartsFilters,
}) {
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

    const Receiverdata = getChartData;

    const [displayAllReceivers, setDisplayAllReceivers] = useState(false);
    const sortedReceiverData = [...Receiverdata].sort(
        (a, b) => b.cost - a.cost
    );
    const chartData = displayAllReceivers
        ? sortedReceiverData
        : sortedReceiverData;
    const handleChartModalOpen = () => {
        setDisplayAllReceivers(true);
    };
    const handleChartModalClose = () => {
        setDisplayAllReceivers(false);
    };
    const handleClick = (data) => {
        clearChartsFilters();
        setFilters({
            ...filters,
            receiver: data.activeLabel,
        });
        setSelected("table");
    };
    const hasData = getChartData.length > 0;
    return (
        <ChartWrapper
            title={"Top Receivers and Spend"}
            cardClassName={"col-span-2"}
            onModalOpen={handleChartModalOpen}
            onModalClose={handleChartModalClose}
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
                </>
            }
            children={
                hasData ? (
                    <ComposedChart
                        data={chartData} // Use the conditionally sliced data
                        width={displayAllReceivers ? 700 : 400} // Adjust width based on view
                        height={displayAllReceivers ? 600 : 300} // Adjust height based on view
                        interval={0}
                        margin={{
                            top: 0,
                            right: 20,
                            bottom: displayAllReceivers ? 30 : 10,
                            left: 0,
                        }}
                        onClick={handleClick}
                        syncId="chart-sync-id"
                        empty={<p className="text-center">No data available</p>}
                    >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis
                            dataKey="receiver"
                            tick={{ fontSize: displayAllReceivers ? 10 : 12 }}
                            angle={displayAllReceivers ? -45 : 0}
                            textAnchor={displayAllReceivers ? "end" : "middle"}
                        />
                        <YAxis
                            yAxisId="left"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(v) =>
                                `$${formatNumberWithCommas(v)}`
                            }
                            domain={["auto", "auto"]}
                            syncId="chart-sync-id"
                            angle={-45}
                        />
                        <YAxis
                            yAxisId="right"
                            tick={{ fontSize: 12 }}
                            orientation="right"
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
                        <Line
                            type="monotone"
                            name="Cons Nb"
                            dataKey="receiverCount"
                            stroke="#ff7300"
                            yAxisId="right"
                            intercept={0}
                        />
                    </ComposedChart>
                ) : (
                    <NoData />
                )
            }
        />
    );
}

export default TopReceiversCharts;
