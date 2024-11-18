function getCountByState(data) {
    const problemsByState = {};

    data.forEach((item) => {
        const state = item.State;

        if (state in problemsByState) {
            problemsByState[state]++;
        } else {
            problemsByState[state] = 1;
        }
    });

    return problemsByState;
}


function compareLabels(objectArray, safetyObjects) {
    const newArray = objectArray.map((obj) => {
        const safetyObject = safetyObjects.find(
            (safetyObj) => obj.label === safetyObj.SafetyTypeId
        );
        if (safetyObject) {
            return {
                ...obj,
                label: safetyObject.SafetyTypeName,
            };
        }
        return obj;
    });

    return newArray;
}

function countSafetyTypesByMonth(data) {
    const counts = {};

    // Loop through the safety reports
    data.forEach((report) => {
        // Get the month and year from the Date property
        const date = new Date(report.OccuredAt);
        const year = date.getFullYear();
        const month = date.getMonth();

        // Create a new date with the year and month
        const firstDayOfMonth = new Date(year, month, 1);

        // Format the date as desired (e.g., "MM-DD-YYYY")
        const formattedDate = `${(firstDayOfMonth.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${"01"}-${firstDayOfMonth.getFullYear()}`;

        // Check if the date exists in the counts object
        if (!counts[formattedDate]) {
            counts[formattedDate] = {};
        }

        // Increment the count for the safety type
        const safetyType = report.SafetyType;
        if (!counts[formattedDate][safetyType]) {
            counts[formattedDate][safetyType] = 1;
        } else {
            counts[formattedDate][safetyType]++;
        }
    });

    return counts;
}

const countRecordsByMonth = (data) => {
    const counts = {}; // Object to store counts for each month
    data.forEach((item) => {
        const date = new Date(item.OccuredAt);
        const year = date.getFullYear(); // Get the year
        const month = date.getMonth(); // Get the month (0-11)
        const formattedDate = `${String(month + 1).padStart(
            2,
            "0"
        )}-${String(1).padStart(2, "0")}-${year}`;
        // Increment the count for the month
        if (counts[formattedDate]) {
            counts[formattedDate]++;
        } else {
            counts[formattedDate] = 1;
        }
    });


    return counts;
};

const calculateSafetyTypePercentage = (data) => {
    const totalCount = data.length;
    const typeCounts = {};

    data.forEach((item) => {
        const safetyType = item.SafetyType;

        if (typeCounts[safetyType]) {
            typeCounts[safetyType]++;
        } else {
            typeCounts[safetyType] = 1;
        }
    });

    const typePercentages = {};

    for (const type in typeCounts) {
        const count = typeCounts[type];
        const percentage = (count / totalCount) * 100;
        typePercentages[type] = percentage.toFixed(0);
    }

    return typePercentages;
};

function getStateLabel(stateId) {
    // Map stateId to state label
    switch (stateId) {
        case "1":
            return "VIC";
        case "2":
            return "NSW";
        case "3":
            return "QLD";
        case "4":
            return "SA";
        case "5":
            return "ACT";
        // Handle other states as needed
        default:
            return stateId;
    }
}

function countRecordsByStateAndType(data, safetyTypes) {
    const stateCounts = {};
    const typeCounts = {};

    // Count occurrences of each state and type
    data.forEach((record) => {
        const state = getStateLabel(record.State);
        const type = record.SafetyType.toString();

        // Count state occurrences
        stateCounts[state] = (stateCounts[state] || 0) + 1;

        // Count type occurrences
        if (!(state in typeCounts)) {
            typeCounts[state] = {};
        }
        typeCounts[state][type] = (typeCounts[state][type] || 0) + 1;
    });

    // Prepare the result
    const result = [];
    for (const state in typeCounts) {
        for (const type in typeCounts[state]) {
            const count = typeCounts[state][type];
            const safetyType = safetyTypes.find(
                (t) => t.SafetyTypeId === parseInt(type)
            );
            const typeName = safetyType ? safetyType.SafetyTypeName : type;
            result.push({ state, value: count, type: typeName });
        }
    }

    return result;
}

const countReportsBySafetyType = (jsonData) => {
    const counts = {};

    jsonData.forEach((item) => {
        const safetyType = item.SafetyType;
        counts[safetyType] = (counts[safetyType] || 0) + 1;
    });

    const result = Object.entries(counts).map(([label, value]) => ({
        label: parseInt(label),
        value,
    }));

    return result;
};

function normalizeData(data) {
    const normalizedArray = [];

    for (const date in data) {
        for (const type in data[date]) {
            normalizedArray.push({
                date: date,
                safetyType: type,
                count: data[date][type]
            });
        }
    }

    return normalizedArray;
}


module.exports = {getCountByState, compareLabels, normalizeData, countSafetyTypesByMonth, getStateLabel, countReportsBySafetyType, countRecordsByMonth, calculateSafetyTypePercentage,countRecordsByStateAndType}
