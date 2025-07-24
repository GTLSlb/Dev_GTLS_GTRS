import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { ChartWrapper } from "./Card/ChartWrapper";
import { DurationFilter } from './Card/DurationFilter';
import { dummySpendData } from '../assets/js/dataHandler';
import { useDurationData } from '../assets/js/useDurationData';
import { useMemo } from 'react';
function DemurrageCost() {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57'];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index, name }, props) => {
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 0) * cos;
        const sy = cy + (outerRadius + 0) * sin;
        const mx = cx + (outerRadius + 0) * cos;
        const my = cy + (outerRadius + 0) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 20;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';
        return (
            <g>
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={COLORS[index]} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={COLORS[index]} stroke="none" />
                <text className='text-sm' x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} fill={COLORS[index]} textAnchor={textAnchor} dominantBaseline="central">
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
        setSelectedQuarterKey
    } = useDurationData(dummySpendData);

    const pieChartData = useMemo(() => {
        const aggregatedDemurrage = {};
        getChartData.forEach(periodData => {
            if (periodData.demurrage && Array.isArray(periodData.demurrage)) {
                periodData.demurrage.forEach(demurrageItem => {
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

    const hasDemurrageData = pieChartData.length > 0 && pieChartData.some(item => item.value > 0);

    return (
        <ChartWrapper
            title={"Demurrage Cost"}
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
                hasDemurrageData ? (
                    <PieChart
                        className=''
                        width={400}
                        height={400}>
                        <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            // outerRadius={50}
                            fill="#8884d8"
                            dataKey="value"
                        // label={{ offsetRadius: 10, position: 'outside' }} // Adjust offsetRadius as needed

                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                fontSize: 12,
                                backgroundColor: "white",
                                borderRadius: 8,
                            }}
                            formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
                        />
                        <Legend
                            layout='horizontal'
                            verticalAlign="bottom"
                            align="center"
                            fontSize={10}
                            wrapperStyle={{ fontSize: 12, paddingTop: '20px' }}
                        />
                    </PieChart>
                ) : (
                    <div className="flex justify-center items-center h-[300px] text-gray-500">
                        No Demurrage Data Available for the Selected Period.
                    </div>
                )
            }
        />
    );
}
export default DemurrageCost;