import { ChartWrapper } from "./Card/ChartWrapper";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DurationFilter } from "./Card/DurationFilter";
import { dummySpendData } from "../assets/js/dataHandler";
import { useDurationData } from "../assets/js/useDurationData";
import { formatNumberWithCommas } from "@/CommonFunctions";

export function TrendCost() {
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
        setSelectedQuarterKey
    } = useDurationData(dummySpendData);

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
                    <Tooltip contentStyle={{
                        fontSize: 12,
                        backgroundColor: "white",
                        borderRadius: 8,
                    }} />
                    <Legend />
                    <Line type="monotone" dataKey="cost" stroke="#8884d8" />
                    <Line type="monotone" dataKey="additional" stroke="#82ca9d" />
                </LineChart>}
        />
    )
}