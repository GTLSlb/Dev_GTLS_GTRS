// dateUtils.js

/**
 * Get the minimum or maximum date from a dataset and return it in "DD-MM-YYYY" format.
 * @param {Array} data - The dataset to filter and sort.
 * @param {string} fieldName - The field name containing the date.
 * @param {number} identifier - 1 for min date, 2 for max date.
 * @returns {string|null} - The formatted date or null if no valid dates are found.
 */
export function getMinMaxValue(data, fieldName, identifier) {
    // Check for null safety
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    // Filter out entries with empty or invalid dates
    const validData = data.filter(
        (item) => item[fieldName] && !isNaN(new Date(item[fieldName]))
    );

    // If no valid dates are found, return null
    if (validData.length === 0) {
        return null;
    }

    // Sort the valid data based on the fieldName
    const sortedData = [...validData].sort((a, b) => {
        return new Date(a[fieldName]) - new Date(b[fieldName]);
    });

    // Determine the result date based on the identifier
    let resultDate;
    if (identifier === 1) {
        resultDate = new Date(sortedData[0][fieldName]);
    } else if (identifier === 2) {
        resultDate = new Date(sortedData[sortedData.length - 1][fieldName]);
    } else {
        return null;
    }

    // Convert the resultDate to the desired format "DD-MM-YYYY"
    const day = String(resultDate.getDate()).padStart(2, "0");
    const month = String(resultDate.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
    const year = resultDate.getFullYear();

    return `${day}-${month}-${year}`;
}

export function getOldestDespatchDate(data) {
    // Filter out elements with invalid 'CreatedDate' values
    const validData = data.filter((item) => isValidDate(item.DespatchDate));

    // Sort the validData array based on the 'CreatedDate' property
    const sortedData = validData.sort(
        (a, b) => new Date(a.DespatchDate) - new Date(b.DespatchDate)
    );

    // Check if the sortedData array is empty
    if (sortedData.length === 0) {
        return null; // No valid dates found
    }

    // Extract only the date part from the 'CreatedDate' of the first element (oldest date)
    const oldestDate = new Date(
        sortedData[0]?.DespatchDate
    ).toLocaleDateString("en-CA");
    // Return the oldest date in the 'YYYY-MM-DD' format
    return oldestDate;
}
export function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date);
}
export function getLatestDespatchDate(data) {
    const validData = data.filter((item) => isValidDate(item.DespatchDate));

    // Sort the data array based on the 'DespatchDate' property in descending order
    const sortedData = validData.sort(
        (a, b) => new Date(b.DespatchDate) - new Date(a.DespatchDate)
    );
    if (sortedData.length === 0) {
        return null; // No valid dates found
    }
    const latestDate = new Date(
        sortedData[0]?.DespatchDate
    ).toLocaleDateString("en-CA");

    // Return the 'DespatchDate' of the first element (latest date)
    return latestDate;
}
