/**
 * Creates an array of unique label objects from the specified field in the data array.
 * Each label object has the structure: { id: value, label: value }
 *
 * @param {Array} data - The array of data to process.
 * @param {string} fieldName - The field name to extract unique values from.
 * @returns {Array} - An array of objects with unique id and label properties.
 */
export const createNewLabelObjects = (data, fieldName) => {
    const uniqueLabels = new Set(); // To keep track of unique labels
    const newData = [];

    // Map through the data and create new objects
    data?.forEach((item) => {
        const fieldValue = item[fieldName];
        if (
            fieldValue &&
            fieldValue.trim() !== "" &&
            !uniqueLabels.has(fieldValue)
        ) {
            uniqueLabels.add(fieldValue);
            const newObject = {
                id: fieldValue,
                label: fieldValue,
            };
            newData.push(newObject);
        }
    });
    return newData.sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Creates an array of unique label objects from the specified field in the data array.
 * Each label object has the structure: { id: value, label: value }
 *
 * @param {Array} data - The array of data to process.
 * @param {string} fieldName - The field name to extract unique values from.
 * @returns {Array} - An array of objects with unique id and label properties.
 */
export const createNewLabelObjectsUsingIds = (data, IdName, fieldName) => {
    const uniqueLabels = new Set(); // To keep track of unique labels
    const newData = [];

    // Map through the data and create new objects
    data?.forEach((item) => {
        const fieldValue = item[fieldName];
        const fieldValueId = item[IdName];
        if (
            fieldValue &&
            fieldValue.trim() !== "" &&
            !uniqueLabels.has(fieldValue)
        ) {
            uniqueLabels.add(fieldValue);
            const newObject = {
                id: fieldValueId,
                label: fieldValue,
            };
            newData.push(newObject);
        }
    });
    return newData.sort((a, b) => a.label.localeCompare(b.label));
};
