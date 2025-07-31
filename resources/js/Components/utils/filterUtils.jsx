import moment from "moment/moment";

export const handleFilterTable = (gridRef, filteredData) => {
    // Get the selected columns or use all columns if none are selected
    let selectedColumns = Array.from(
        document.querySelectorAll('input[name="column"]:checked')
    ).map((checkbox) => checkbox.value);

    let allHeaderColumns =
        gridRef != null &&
        gridRef?.current?.visibleColumns.map((column) => ({
            name: column.name,
            value: column.computedFilterValue?.value,
            type: column.computedFilterValue?.type,
            operator: column.computedFilterValue?.operator,
        }));
    let selectedColVal = allHeaderColumns?.filter((col) => col.name !== "edit");
    const filterValue = [];
    filteredData?.map((val) => {
        let isMatch = true;
        for (const col of selectedColVal) {
            const { value, type, operator } = col;
            const cellValue = value;
            let conditionMet = false;
            // Skip the filter condition if no filter is set (cellValue is null or empty)
            if (!cellValue || cellValue.length === 0) {
                conditionMet = true;
                continue;
            }
            if (type === "string") {
                const valLowerCase = val[col.name]?.toString().toLowerCase();
                const cellValueLowerCase = cellValue?.toString().toLowerCase();

                switch (operator) {
                    case "contains":
                        conditionMet =
                            cellValue?.length > 0 &&
                            valLowerCase?.includes(cellValueLowerCase);
                        break;
                    case "notContains":
                        conditionMet =
                            cellValue?.length > 0 &&
                            !valLowerCase?.includes(cellValueLowerCase);
                        break;
                    case "eq":
                        conditionMet =
                            cellValue?.length > 0 &&
                            cellValueLowerCase === valLowerCase;
                        break;
                    case "neq":
                        conditionMet =
                            cellValue?.length > 0 &&
                            cellValueLowerCase !== valLowerCase;
                        break;
                    case "empty":
                        conditionMet =
                            cellValue?.length > 0 && val[col.name] === "";
                        break;
                    case "notEmpty":
                        conditionMet =
                            cellValue?.length > 0 && val[col.name] !== "";
                        break;
                    case "startsWith":
                        conditionMet =
                            cellValue?.length > 0 &&
                            valLowerCase.startsWith(cellValueLowerCase);
                        break;
                    case "endsWith":
                        conditionMet =
                            cellValue?.length > 0 &&
                            valLowerCase.endsWith(cellValueLowerCase);
                        break;
                    // ... (add other string type conditions here)
                }
            } else if (type === "number") {
                const numericCellValue = parseFloat(cellValue);
                const numericValue = parseFloat(val[col.name]);

                switch (operator) {
                    case "eq":
                        conditionMet =
                            numericCellValue != "" &&
                            numericValue != "" &&
                            numericValue === numericCellValue;
                        break;
                    case "neq":
                        conditionMet =
                            numericCellValue != "" &&
                            numericValue != "" &&
                            numericValue !== numericCellValue;
                        break;
                    case "gt":
                        conditionMet =
                            numericCellValue != "" &&
                            numericValue != "" &&
                            numericValue > numericCellValue;
                        break;
                    case "gte":
                        conditionMet =
                            numericCellValue != "" &&
                            numericValue != "" &&
                            numericValue >= numericCellValue;
                        break;
                    case "lt":
                        conditionMet =
                            numericCellValue != "" &&
                            numericValue != "" &&
                            numericValue < numericCellValue;
                        break;
                    case "lte":
                        conditionMet =
                            numericCellValue != "" &&
                            numericValue != "" &&
                            numericValue <= numericCellValue;
                        break;
                    case "inrange": {
                        const rangeValues = value.split(",");
                        const minRangeValue = parseFloat(rangeValues[0]);
                        const maxRangeValue = parseFloat(rangeValues[1]);
                        conditionMet =
                            cellValue?.length > 0 &&
                            numericCellValue >= minRangeValue &&
                            numericCellValue <= maxRangeValue;
                        break;
                    }
                    case "notinrange": {
                        const rangeValuesNotBetween = value.split(",");
                        const minRangeValueNotBetween = parseFloat(
                            rangeValuesNotBetween[0]
                        );
                        const maxRangeValueNotBetween = parseFloat(
                            rangeValuesNotBetween[1]
                        );
                        conditionMet =
                            cellValue?.length > 0 &&
                            (numericCellValue < minRangeValueNotBetween ||
                                numericCellValue > maxRangeValueNotBetween);
                        break;
                    }
                    // ... (add other number type conditions here if necessary)
                }
            } else if (type === "boolean") {
                // Assuming booleanCellValue is a string 'true' or 'false' and needs conversion to a boolean
                const booleanCellValue = cellValue === "true";
                const booleanValue = val[col.name] === true; // Convert to boolean if it's not already

                switch (operator) {
                    case "eq":
                        conditionMet =
                            cellValue?.length > 0 &&
                            booleanCellValue === booleanValue;
                        break;
                    case "neq":
                        conditionMet =
                            cellValue?.length > 0 &&
                            booleanCellValue !== booleanValue;
                        break;
                    // ... (add other boolean type conditions here if necessary)
                }
            } else if (type === "select") {
                const cellValueLowerCase = cellValue?.toString().toLowerCase();
                const valLowerCase = val[col.name]?.toString().toLowerCase();

                switch (operator) {
                    case "eq":
                        conditionMet =
                            (cellValue?.length > 0 || cellValue >= 0) &&
                            cellValueLowerCase === valLowerCase;
                        break;
                    case "neq":
                        // This case seems to be duplicated in your original code, you might want to check this
                        conditionMet =
                            cellValue?.length > 0 &&
                            cellValueLowerCase !== valLowerCase;
                        break;
                    case "inlist": {
                        const listValues = Array.isArray(value)
                            ? value.map((v) =>
                                  typeof v === "string"
                                      ? v.toLowerCase()
                                      : String(v)
                              )
                            : [
                                  typeof value === "string"
                                      ? value.toLowerCase()
                                      : String(value),
                              ];

                        conditionMet =
                            cellValue?.length > 0 &&
                            listValues.includes(valLowerCase);

                        break;
                    }
                    case "notinlist": {
                        const listValuesNotIn = Array.isArray(value)
                            ? value.map((v) => v.toLowerCase())
                            : [value?.toLowerCase()];
                        conditionMet =
                            cellValue?.length > 0 &&
                            !listValuesNotIn.includes(valLowerCase);
                        break;
                    }
                    // ... (add other select type conditions here if necessary)
                }
            } else if (type === "date") {
                const dateValue = moment(
                    val[col.name]?.replace("T", " "),
                    "YYYY-MM-DD HH:mm:ss"
                );
                const hasStartDate =
                    cellValue?.start && cellValue.start.length > 0;
                const hasEndDate = cellValue?.end && cellValue.end.length > 0;
                const dateCellValueStart = hasStartDate
                    ? moment(cellValue.start, "DD-MM-YYYY")
                    : null;
                const dateCellValueEnd = hasEndDate
                    ? moment(cellValue.end, "DD-MM-YYYY").endOf("day")
                    : null;

                switch (operator) {
                    case "after": {
                        // Parse the cellValue date with the format you know it might have
                        const afterd = moment(cellValue, "DD-MM-YYYY", true);

                        // Parse the dateValue as an ISO 8601 date string
                        const afterdateToCompare = moment(dateValue);

                        // Check if both dates are valid and if cellValue is after dateValue
                        conditionMet =
                            afterd.isValid() &&
                            afterdateToCompare.isValid() &&
                            afterdateToCompare.isAfter(afterd);

                        break;
                    }
                    case "afterOrOn": {
                        const afterOrOnd = moment(
                            cellValue,
                            "DD-MM-YYYY",
                            true
                        );
                        const afterOrOnDateToCompare = moment(dateValue);

                        conditionMet =
                            afterOrOnd.isValid() &&
                            afterOrOnDateToCompare.isValid() &&
                            afterOrOnDateToCompare.isSameOrAfter(afterOrOnd);
                        break;
                    }

                    case "before": {
                        const befored = moment(cellValue, "DD-MM-YYYY", true);
                        const beforeDateToCompare = moment(dateValue);

                        conditionMet =
                            befored.isValid() &&
                            beforeDateToCompare.isValid() &&
                            beforeDateToCompare.isBefore(befored);

                        break;
                    }

                    case "beforeOrOn": {
                        const beforeOrOnd = moment(
                            cellValue,
                            "DD-MM-YYYY",
                            true
                        );
                        const beforeOrOnDateToCompare = moment(dateValue);

                        conditionMet =
                            beforeOrOnd.isValid() &&
                            beforeOrOnDateToCompare.isValid() &&
                            beforeOrOnDateToCompare.isSameOrBefore(beforeOrOnd);

                        break;
                    }
                    case "eq": {
                        // Parse the cellValue date with the format you know it might have
                        const d = moment(
                            cellValue,
                            ["DD-MM-YYYY", moment.ISO_8601],
                            true
                        );

                        // Parse the dateValue with the expected format or formats
                        const dateToCompare = moment(
                            dateValue,
                            ["YYYY-MM-DD HH:mm:ss", moment.ISO_8601],
                            true
                        );

                        // Check if both dates are valid and if they represent the same calendar day
                        conditionMet =
                            cellValue &&
                            d.isValid() &&
                            dateToCompare.isValid() &&
                            d.isSame(dateToCompare, "day");

                        break;
                    }
                    case "neq": {
                        const neqd = moment(cellValue, "DD-MM-YYYY", true);
                        const neqDateToCompare = moment(dateValue);

                        conditionMet =
                            neqd.isValid() &&
                            neqDateToCompare.isValid() &&
                            !neqd.isSame(neqDateToCompare, "day");

                        break;
                    }

                    case "inrange":
                        conditionMet =
                            (!hasStartDate ||
                                dateValue.isSameOrAfter(dateCellValueStart)) &&
                            (!hasEndDate ||
                                dateValue.isSameOrBefore(dateCellValueEnd));
                        break;
                    case "notinrange":
                        conditionMet =
                            (hasStartDate &&
                                dateValue.isBefore(dateCellValueStart)) ||
                            (hasEndDate && dateValue.isAfter(dateCellValueEnd));
                        break;
                    // ... (add other date type conditions here if necessary)
                }
            }

            if (!conditionMet) {
                isMatch = false;
                break;
            }
        }
        if (isMatch) {
            filterValue.push(val);
        }
    });
    selectedColVal = [];
    if (selectedColumns.length === 0) {
        selectedColVal = allHeaderColumns.filter((col) => col.name !== "edit"); // Use all columns
    } else {
        allHeaderColumns.map((header) => {
            selectedColumns.map((column) => {
                const formattedColumn = column.replace(/\s/g, "").toLowerCase();
                if (header.name.toLowerCase() === formattedColumn) {
                    selectedColVal.push(header);
                }
            });
        });
    }
    return { selectedColumns: selectedColVal, filterValue: filterValue };
};
