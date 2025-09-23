import { useState, useMemo } from "react";

export const months = [
    { value: 0, label: "Jan" }, { value: 1, label: "Feb" }, { value: 2, label: "Mar" },
    { value: 3, label: "Apr" }, { value: 4, label: "May" }, { value: 5, label: "Jun" },
    { value: 6, label: "Jul" }, { value: 7, label: "Aug" }, { value: 8, label: "Sep" },
    { value: 9, label: "Oct" }, { value: 10, label: "Nov" }, { value: 11, label: "Dec" },
];

export const quarters = [
    { value: 0, label: "Q1 (Jan-Mar)" },
    { value: 1, label: "Q2 (Apr-Jun)" },
    { value: 2, label: "Q3 (Jul-Sep)" },
    { value: 3, label: "Q4 (Oct-Dec)" },
];

export const periodOptions = [
    { value: "yearly", label: "Yearly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "monthly", label: "Monthly" },
];

export function useDurationData(dummySpendData) {
    const availableYears = useMemo(() => {
        const yearsSet = new Set();
        dummySpendData.forEach(item => yearsSet.add(new Date(item.date).getFullYear()));
        return Array.from(yearsSet)
            .sort((a, b) => a - b)
            .map(year => ({ value: String(year), label: String(year) }));
    }, [dummySpendData]);

    const [selectedPeriodKey, setSelectedPeriodKey] = useState(new Set(["yearly"]));
    const [selectedYearKey, setSelectedYearKey] = useState(
        new Set([String(availableYears[availableYears.length - 1]?.value)])
    );
    const [selectedMonthKey, setSelectedMonthKey] = useState(new Set([String(months[0]?.value)]));
    const [selectedQuarterKey, setSelectedQuarterKey] = useState(new Set());

    const selectedPeriodValue = Array.from(selectedPeriodKey)[0] || "yearly";
    const selectedYearValue = Array.from(selectedYearKey)[0] ? parseInt(Array.from(selectedYearKey)[0], 10) : null;
    const selectedMonthValue = Array.from(selectedMonthKey)[0] ? parseInt(Array.from(selectedMonthKey)[0], 10) : null;
    const selectedQuarterValue = Array.from(selectedQuarterKey)[0] ? parseInt(Array.from(selectedQuarterKey)[0], 10) : null;


    const getChartData = useMemo(() => {
        if (!selectedYearValue) return [];

        let filteredData = dummySpendData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getFullYear() === selectedYearValue;
        });

        const addToAggregate = (agg, item) => {
            agg.cost += item.cost;
            agg.additional += item.additional;
            agg.fuelLevy += item.fuelLevy;
            agg.GST += item.GST;
            agg.totalItems = (agg.totalItems || 0) + 1;
            agg.weight = (agg.weight || 0) + (item.weight || 0);
            agg.palletSpace = (agg.palletSpace || 0) + (item.palletSpace || 0);

            if (item.state) {
                if (!agg[item.state]) agg[item.state] = 0;
                agg[item.state] += item.cost;
            }

            if (item.receiver) {
                if (!agg._receiverMap) agg._receiverMap = {};
                agg._receiverMap[item.receiver] = (agg._receiverMap[item.receiver] || 0) + 1;
            }

            if (item.demurrageType && item.demurrageCost) {
                if (!agg._demurrageMap) agg._demurrageMap = {};
                agg._demurrageMap[item.demurrageType] = (agg._demurrageMap[item.demurrageType] || 0) + item.demurrageCost;
            }

            if (item.serviceType) {
                if (!agg._serviceTypeMap) agg._serviceTypeMap = {};
                agg._serviceTypeMap[item.serviceType] = (agg._serviceTypeMap[item.serviceType] || 0) + 1;
            }

            if (item.additionalCost && Array.isArray(item.additionalCost)) {
                if (!agg._additionalCostMap) agg._additionalCostMap = {};
                item.additionalCost.forEach(ac => {
                    if (ac.name && typeof ac.cost === 'number') {
                        agg._additionalCostMap[ac.name] = (agg._additionalCostMap[ac.name] || 0) + ac.cost;
                    }
                });
            }
        };

        const initializeAggregateObject = (name) => ({
            name,
            cost: 0,
            additional: 0,
            fuelLevy: 0,
            GST: 0,
            totalItems: 0,
            weight: 0,
            palletSpace: 0,
            demurrage: [],
            totalDemurrageCost: 0,
            serviceTypeOccurrences: [],
            additionalCosts: [],
            _additionalCostMap: {},
        });


        const finalizeAggregates = (aggregates) => {
            Object.values(aggregates).forEach(agg => {
                if (agg.totalItems === 0) {
                    if (selectedPeriodValue === "monthly") {
                        return;
                    }
                }

                if (agg._receiverMap) {
                    const entries = Object.entries(agg._receiverMap);
                    entries.sort((a, b) => b[1] - a[1]);
                    agg.receiver = entries[0][0];
                    agg.receiverCount = entries[0][1];
                    delete agg._receiverMap;
                }
                
                if (agg._demurrageMap) {
                    agg.demurrage = Object.entries(agg._demurrageMap).map(([type, totalCost]) => ({
                        type,
                        totalCost
                    }));
                    agg.totalDemurrageCost = Object.values(agg._demurrageMap).reduce((sum, cost) => sum + cost, 0);
                    delete agg._demurrageMap;
                }

                if (agg._serviceTypeMap) {
                    agg.serviceTypeOccurrences = Object.entries(agg._serviceTypeMap).map(([type, count]) => ({
                        type,
                        count,
                        percentage: agg.totalItems > 0 ? (count / agg.totalItems) * 100 : 0
                    }));
                    delete agg._serviceTypeMap;
                }

                
                if (agg._additionalCostMap) {
                    agg.additionalCosts = Object.entries(agg._additionalCostMap).map(([name, totalCost]) => ({
                        name,
                        totalCost
                    }));
                    delete agg._additionalCostMap; 
                }
            });
        };

        if (selectedPeriodValue === "yearly") {
            const monthlyAggregates = {};
            months.forEach(month => {
                monthlyAggregates[month.label] = initializeAggregateObject(month.label);
            });

            filteredData.forEach(item => {
                const itemDate = new Date(item.date);
                const monthName = months[itemDate.getMonth()].label;
                addToAggregate(monthlyAggregates[monthName], item);
            });

            finalizeAggregates(monthlyAggregates);
            return months.map(month => monthlyAggregates[month.label]);

        } else if (selectedPeriodValue === "quarterly") {
            if (selectedQuarterValue !== null) {
                const startMonth = selectedQuarterValue * 3;
                const monthsInSelectedQuarter = [startMonth, startMonth + 1, startMonth + 2];
                
                filteredData = filteredData.filter(item => {
                    const itemMonth = new Date(item.date).getMonth();
                    return monthsInSelectedQuarter.includes(itemMonth);
                });

                const dataToAggregateByMonth = {};
                monthsInSelectedQuarter.forEach(monthIndex => {
                    const month = months[monthIndex];
                    dataToAggregateByMonth[month.label] = initializeAggregateObject(month.label);
                });

                filteredData.forEach(item => {
                    const itemDate = new Date(item.date);
                    const monthName = months[itemDate.getMonth()].label;
                    addToAggregate(dataToAggregateByMonth[monthName], item);
                });

                finalizeAggregates(dataToAggregateByMonth);
                return monthsInSelectedQuarter.map(monthIndex => dataToAggregateByMonth[months[monthIndex].label]);

            } else {
                const quarterlyAggregates = {};
                quarters.forEach(quarter => {
                    const quarterShortName = quarter.label.split(' ')[0]; 
                    quarterlyAggregates[quarterShortName] = initializeAggregateObject(quarterShortName);
                });

                filteredData.forEach(item => {
                    const itemDate = new Date(item.date);
                    const quarterIndex = Math.floor(itemDate.getMonth() / 3);
                    const quarterShortName = quarters[quarterIndex].label.split(' ')[0];
                    addToAggregate(quarterlyAggregates[quarterShortName], item);
                });

                finalizeAggregates(quarterlyAggregates);
                return quarters.map(quarter => quarterlyAggregates[quarter.label.split(' ')[0]]);
            }

        } else if (selectedPeriodValue === "monthly") {
            if (selectedMonthValue == null) return [];

            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getMonth() === selectedMonthValue;
            });

            const weeklyAggregates = {};
            filteredData.forEach(item => {
                const itemDate = new Date(item.date);
                const firstDayOfMonth = new Date(itemDate.getFullYear(), itemDate.getMonth(), 1);
                const dayOfWeek = firstDayOfMonth.getDay();
                const offset = (dayOfWeek === 0) ? 6 : dayOfWeek - 1; 

                const dayOfMonth = itemDate.getDate();
                const weekOfMonth = Math.ceil((dayOfMonth + offset) / 7);
                const weekName = `Week ${weekOfMonth}`;

                if (!weeklyAggregates[weekName]) {
                    weeklyAggregates[weekName] = initializeAggregateObject(weekName);
                }
                addToAggregate(weeklyAggregates[weekName], item);
            });

            finalizeAggregates(weeklyAggregates);
            return Object.values(weeklyAggregates).sort((a, b) => {
                const weekA = parseInt(a.name.split(' ')[1]);
                const weekB = parseInt(b.name.split(' ')[1]);
                return weekA - weekB;
            });
        }

        return [];
    }, [selectedYearValue, selectedPeriodValue, selectedMonthValue, selectedQuarterValue, dummySpendData]);

    return {
        getChartData,
        selectedPeriodKey,
        setSelectedPeriodKey,
        selectedYearKey,
        setSelectedYearKey,
        selectedMonthKey,
        setSelectedMonthKey,
        selectedQuarterKey,
        setSelectedQuarterKey,
        availableYears,
        selectedPeriodValue,
        selectedYearValue,
        months,
        quarters
    };
}