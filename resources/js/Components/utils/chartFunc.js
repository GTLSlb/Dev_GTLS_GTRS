const shuttleDebtorIds = [1514, 244];
export const calculateStatistics = (data, filteredSafety) => {
    let safetyCounter = 0;
    const uniqueReceivers = new Set();
    let totalWeight = 0;
    let totalPalletSpace = 0;
    let totalLoscam = 0;
    let totalCustomerOwn = 0;
    let totalCost = 0;
    let totalNoConsPassed = 0;
    let totalConsFailed = 0;
    let totalConsPending = 0;
    let podCounter = 0;
    let totalChep = 0;
    let fuelLevy = 0;
    if (filteredSafety) {
        safetyCounter = Object.keys(filteredSafety).length;
    } else {
        safetyCounter = 0;
    }
    for (const {
        ReceiverName,
        TottalWeight,
        TotalPalletSpace,
        TotalLoscam,
        TotalCustomerOwn,
        TotalChep,
        NetAmount,
        ConsStatus,
        POD,
        FuelLevy,
        ChargeToId,
    } of data) {
        uniqueReceivers.add(ReceiverName);
        totalWeight += TottalWeight;
        totalPalletSpace += TotalPalletSpace;
        totalLoscam += TotalLoscam;
        totalCustomerOwn += TotalCustomerOwn;
        totalChep += TotalChep;
        totalCost += NetAmount;
        fuelLevy += FuelLevy;
        // Calculate other statistics
        if (ConsStatus === "PASS") {
            totalNoConsPassed++;
        } else if (ConsStatus === "FAIL") {
            if (shuttleDebtorIds.includes(ChargeToId)) {
                totalNoConsPassed++;
            } else {
                totalConsFailed++;
            }
        } else if (ConsStatus === "PENDING") {
            totalConsPending++;
        }
        if (POD) {
            podCounter++;
        }
    }

    const totalNoConsShipped =
        totalConsPending + totalConsFailed + totalNoConsPassed;
    const numUniqueReceivers = uniqueReceivers.size;
    const podPercentage = (podCounter / data.length) * 100;

    fuelLevy = isNaN(fuelLevy) ? 0 : fuelLevy;
    return {
        numUniqueReceivers,
        totalWeight,
        totalPalletSpace,
        totalLoscam,
        totalCustomerOwn,
        totalCost,
        totalNoConsShipped,
        totalNoConsPassed,
        totalConsPending,
        totalConsFailed,
        podCounter,
        podPercentage,
        totalChep,
        safetyCounter,
        fuelLevy,
    };
};
export const getConsStatusCounter = (data) => {
    const counter = [];

    for (const item of data) {
        const consStatus = item.ConsStatus;

        const existingStatus = counter.find((obj) => obj.label === consStatus);

        if (existingStatus) {
            existingStatus.value++;
        } else {
            counter.push({ label: consStatus, value: 1 });
        }
    }

    return counter;
};
export const getKPIStatusCounter = (data) => {
    const counter = [];
    for (const item of data) {
        // Convert the boolean KPIStatus to 'pass' or 'fail'
        const KPIStatus =
            item.MatchDel == 0 ? "N/A" : item.MatchDel == 1 ? "Pass" : "Fail";
        const existingStatus = counter.find((obj) => obj.label === KPIStatus);

        if (existingStatus) {
            existingStatus.value++;
        } else {
            counter.push({ label: KPIStatus, value: 1 });
        }
    }

    return counter;
};
// Information for the first charts
export const getStateRecordCounts = (data) => {
    const stateCounts = {};

    for (const item of data) {
        const state = item.ReceiverState;
        if (!stateCounts[state]) {
            stateCounts[state] = 0;
        }

        stateCounts[state]++;
    }
    const stateRecordCounts = Object.entries(stateCounts).map(
        ([state, value]) => ({
            data: state,
            value,
        })
    );

    return stateRecordCounts;
};
export const getStateTotalWeights = (data) => {
    const stateWeights = {};

    for (const item of data) {
        const state = item.ReceiverState;
        const weight = item.TottalWeight;

        if (!stateWeights[state]) {
            stateWeights[state] = 0;
        }

        stateWeights[state] += weight;
    }

    const stateTotalWeights = Object.entries(stateWeights).map(
        ([state, value]) => ({
            data: state,
            value: parseFloat(value.toFixed(2)),
        })
    );

    return stateTotalWeights;
};
export const getMonthlyData = (data) => {
    const firstDayData = {};

    for (const item of data) {
        const state = item.ReceiverState;
        const amount = Math.round(Number(item.NetAmount) * 100);
        const despatchDate = new Date(item.DespatchDate);
        const year = despatchDate.getFullYear();
        const month = (despatchDate.getMonth() + 1).toString().padStart(2, "0");
        const formattedDate = `${year}-${month}`;
        const key = `${formattedDate}-${state}`;

        if (Object.prototype.hasOwnProperty.call(firstDayData, key)) {
            firstDayData[key].amount += amount;
        } else {
            firstDayData[key] = {
                month: formattedDate,
                amount,
                state,
            };
        }
    }

    const sortedData = Object.values(firstDayData).sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA - dateB;
    });
    return sortedData;
};
export const getMonthlyRecordCounts = (data) => {
    const monthlyCounts = {};

    for (const item of data) {
        const despatchDate = new Date(item.DespatchDate);
        const month = despatchDate.getMonth() + 1;
        const year = despatchDate.getFullYear();
        const monthYear = `${year}-${month.toString().padStart(2, "0")}`;

        if (Object.prototype.hasOwnProperty.call(monthlyCounts, monthYear)) {
            monthlyCounts[monthYear]++;
        } else {
            monthlyCounts[monthYear] = 1;
        }
    }

    const sortedCounts = Object.entries(monthlyCounts).sort(([a], [b]) => {
        const [yearA, monthA] = a.split("-");
        const [yearB, monthB] = b.split("-");
        return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });

    const monthlyRecordCounts = sortedCounts.map(([monthYear, value]) => ({
        data: monthYear,
        value,
    }));
    return monthlyRecordCounts;
};
export const getPODCounts = (data) => {
    const podCounts = {};
    const today = new Date(); // Get today's date

    for (const item of data) {
        const despatchDate = new Date(item.DespatchDate);
        if (despatchDate > today) {
            continue; // Skip data with a future despatch date
        }

        const month = despatchDate.getMonth() + 1;
        const year = despatchDate.getFullYear();
        const monthYear = `${year}-${month.toString().padStart(2, "0")}`;
        const pod = item.POD;

        if (Object.prototype.hasOwnProperty.call(podCounts, monthYear)) {
            if (pod) {
                podCounts[monthYear].true++;
            } else {
                podCounts[monthYear].false++;
            }
        } else {
            podCounts[monthYear] = {
                monthYear,
                true: pod ? 1 : 0,
                false: pod ? 0 : 1,
            };
        }
    }

    const formattedCounts = Object.entries(podCounts).flatMap(
        ([monthYear, counts]) => [
            { pod: "true", monthYear, value: counts.true },
            { pod: "false", monthYear, value: counts.false },
        ]
    );

    formattedCounts.sort((a, b) => {
        const [yearA, monthA] = a.monthYear.split("-");
        const [yearB, monthB] = b.monthYear.split("-");
        return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });

    return formattedCounts;
};

export function getPODCountsByState(data) {
    const podCountsByState = [];

    data.forEach((item) => {
        const state = item.ReceiverState;
        const pod = item.POD;

        const existingState = podCountsByState.find(
            (obj) => obj.label === state
        );

        if (existingState) {
            existingState.value += pod ? 1 : 0;
        } else {
            podCountsByState.push({ label: state, value: pod ? 1 : 0 });
        }
    });

    return podCountsByState;
}

export const getKPIPerformanceCounter = (data) => {
    const counter = [];

    for (const item of data) {
        let consStatus = item.ConsStatus;

        if (consStatus === "PENDING") {
            continue;
        }
        if (consStatus === "PASS") {
            consStatus = "Delivered on Time";
        } else if (consStatus === "FAIL") {
            consStatus = "Not Delivered on Time";
        }

        const existingStatus = counter.find((obj) => obj.label === consStatus);

        if (existingStatus) {
            existingStatus.value++;
        } else {
            counter.push({ label: consStatus, value: 1 });
        }
    }

    return counter;
};
