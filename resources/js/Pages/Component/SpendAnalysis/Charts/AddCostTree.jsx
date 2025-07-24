import React, { useMemo } from "react";
import { Treemap, Tooltip } from "recharts";
import { ChartWrapper } from "./Card/ChartWrapper";
import { DurationFilter } from "./Card/DurationFilter";
import { dummySpendData } from "../assets/js/dataHandler";
import { useDurationData } from "../assets/js/useDurationData";

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

    const fillColor = depth < 2 && root && root.children && root.children.length > 0
        ? colors[Math.floor((index / root.children.length) * colors.length)]
        : (depth === 0 ? colors[0] : "none");

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
                >
                    {name}
                </text>
            ) : null}
            {depth === 1 ? (
                <text x={x + 4} y={y + 18} fill="#fff" fontSize={12} className="font-light">
                    {`${name}: $${totalCost ? totalCost.toFixed(2) : 0}`}
                </text>
            ) : null}
        </g>
    );
};

export default function AddCostTree() {
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


    const treemapData = useMemo(() => {
        const chartData = getChartData;

        if (!chartData || chartData.length === 0) {
            return [];
        }

        const combinedAdditionalCostsMap = {};
        chartData.forEach(periodData => {
            if (periodData.additionalCosts) {
                periodData.additionalCosts.forEach(costItem => {
                    combinedAdditionalCostsMap[costItem.name] =
                        (combinedAdditionalCostsMap[costItem.name] || 0) + costItem.totalCost;
                });
            }
        });

        return Object.entries(combinedAdditionalCostsMap).map(([name, totalCost]) => ({
            name,
            totalCost: totalCost
        }));

    }, [getChartData]);

    const CustomTooltip = ({ active, payload, label, name }) => {
        const isVisible = active && payload && payload.length;
        return (
            <div className="bg-white p-2 rounded-lg text-sm" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
                {isVisible && (
                    <p className="label">{`${active}  : ${payload[0].value}`}</p>
                )}
            </div>
        );
    };

    return (
        <ChartWrapper
            cardClassName={"col-span-2 p-2"}
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
            title={"Additional Cost Type"}
            children={
                <Treemap
                    width={700}
                    height={600}
                    data={treemapData}
                    dataKey="totalCost"
                    stroke="#fff"
                    fill="#8884d8"
                    animationDuration={500}
                    content={<CustomizedContent colors={COLORS} />}
                >
                    <Tooltip content={CustomTooltip} />
                </Treemap>
            }
        />
    );
}