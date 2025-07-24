import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { ChartWrapper } from './Card/ChartWrapper';
import { DurationFilter } from './Card/DurationFilter';
import { dummySpendData } from '../assets/js/dataHandler';
import { useDurationData } from '../assets/js/useDurationData';
import { useMemo } from 'react'; // Don't forget to import useMemo

export function ServiceTypeChart() {
    // You can expand these colors if you expect more service types
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'middle' : 'middle'} dominantBaseline="central" className='text-sm'>
                {`${(percent * 100).toFixed(2)}%`}
            </text>
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

    // Use useMemo to prepare the data for the PieChart
    const pieChartData = useMemo(() => {
        const aggregatedServiceTypes = {};
        let totalOverallItems = 0; // Keep track of the total number of items across all aggregated periods

        getChartData.forEach(periodData => {
            if (periodData.serviceTypeOccurrences && Array.isArray(periodData.serviceTypeOccurrences)) {
                // Add the totalItems from this specific period to the overall total
                totalOverallItems += periodData.totalItems || 0;

                periodData.serviceTypeOccurrences.forEach(serviceTypeItem => {
                    const { type, count } = serviceTypeItem;
                    if (aggregatedServiceTypes[type]) {
                        aggregatedServiceTypes[type] += count;
                    } else {
                        aggregatedServiceTypes[type] = count;
                    }
                });
            }
        });

        // Transform the aggregated counts into { name, value } pairs for the PieChart
        // And recalculate percentages based on the overall total items
        return Object.entries(aggregatedServiceTypes).map(([type, count]) => ({
            name: type,
            value: count, // The value for the pie chart is the count of occurrences
            percentage: totalOverallItems > 0 ? (count / totalOverallItems) * 100 : 0
        }));
    }, [getChartData]);

    // Check if there is any service type data to display
    const hasServiceTypeData = pieChartData.length > 0 && pieChartData.some(item => item.value > 0);

    return (
        <ChartWrapper
            title={"Service Type Distribution"}
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
                hasServiceTypeData ? (
                    <PieChart
                        width={400}
                        height={400}>
                        <Pie
                            data={pieChartData} // Use the processed data
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value" // This should still be 'value' as we formatted it that way
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
                            formatter={(value, name, props) => [`${props.payload.percentage.toFixed(2)}%`, name]}
                        />
                        <Legend
                            layout='horizontal'
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{ paddingTop: '20px' }}
                        />
                    </PieChart>
                ) : (
                    <div className="flex justify-center items-center h-[300px] text-gray-500">
                        No Service Type Data Available for the Selected Period.
                    </div>
                )
            } />
    );
}