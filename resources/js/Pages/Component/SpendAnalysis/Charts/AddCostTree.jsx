import React, { useMemo } from "react";
import { Treemap, Tooltip } from "recharts";
import { ChartWrapper } from "./Card/ChartWrapper";
import { DurationFilter } from "./Card/DurationFilter";
import { dummySpendData } from "../assets/js/dataHandler";
import { useDurationData } from "../assets/js/useDurationData";
import { NoData } from "../Comp/NoDataChart";

const COLORS = [
    "#8889DD",
    "#9597E4",
    "#8DC77B",
    "#A5D297",
    "#E2CF45",
    "#F8C12D",
];

const CustomizedContent = (props) => {
    const { root, depth, x, y, width, height, index, colors, name, totalCost } =
        props;

    const fillColor =
        depth < 2 && root && root.children && root.children.length > 0
            ? colors[Math.floor((index / root.children.length) * colors.length)]
            : depth === 0
            ? colors[0]
            : "none";

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fontSize={12}
                style={{
                    fill: fillColor,
                    stroke: "#fff",
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {depth === 1 ? (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 7}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={12}
                    fontWeight="50"
                    letterSpacing={1}
                >
                    {name}
                </text>
            ) : null}
            {depth === 1 ? (
                <>
                    <text
                        x={x + 8}
                        y={y + 15}
                        fill="#fff"
                        fontSize={11}
                        fontWeight="0"
                        // stroke="#000"
                        strokeWidth="0.5"
                        letterSpacing={1}
                    >
                        {`$${totalCost ? totalCost.toFixed(2) : 0}`}
                    </text>
                </>
            ) : null}
        </g>
    );
};

export default function AddCostTree({filters, setFilters, setSelected}) {
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

    const treemapData = useMemo(() => {
        const chartData = getChartData;

        if (!chartData || chartData.length === 0) {
            return [];
        }

        const combinedAdditionalCostsMap = {};
        chartData.forEach((periodData) => {
            if (periodData.additionalCosts) {
                periodData.additionalCosts.forEach((costItem) => {
                    combinedAdditionalCostsMap[costItem.name] =
                        (combinedAdditionalCostsMap[costItem.name] || 0) +
                        costItem.totalCost;
                });
            }
        });

        return Object.entries(combinedAdditionalCostsMap).map(
            ([name, totalCost]) => ({
                name,
                totalCost: totalCost,
            })
        );
    }, [getChartData]);



    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-2 rounded-lg shadow-lg border text-sm">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-gray-600">
                        ${data.totalCost?.toFixed(2) || 0}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ChartWrapper
            cardClassName={"col-span-2 p-2 pt-0"}
            modalSize={"2xl"}
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
            title={"Additional Charges Type"}
            children={
                treemapData.length === 0 ? (
                    <NoData />
                ) : (
                    <Treemap
                        width={700}
                        height={600}
                        data={treemapData}
                        dataKey="totalCost"
                        stroke="#fff"
                        fill="#8884d8"
                        animationDuration={500}
                        onClick={(e)=> {setFilters({...filters, "additionalCosts": e.name}); setSelected("table")}}
                        content={<CustomizedContent colors={COLORS} />}
                    >
                        <Tooltip content={CustomTooltip} />
                    </Treemap>
                )
            }
        />
    );
}
