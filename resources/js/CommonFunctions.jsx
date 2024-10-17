

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

    // Convert the resultDate to the desired format "01-10-2023"
    const day = String(resultDate.getDate()).padStart(2, "0");
    const month = String(resultDate.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
    const year = resultDate.getFullYear();

    return `${day}-${month}-${year}`;
}


export const formatDateToExcel = (dateValue) => {
    const date = new Date(dateValue);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return ""; // Return empty string if invalid date
    }

    // Convert to Excel date serial number format
    return (date.getTime() - date.getTimezoneOffset() * 60000) / 86400000 + 25569;
};
