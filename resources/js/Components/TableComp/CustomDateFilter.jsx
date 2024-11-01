import React, { useState } from "react";

const CustomDateFilter = ({ value, onChange, minDate, maxDate }, props) => {
    const [filterType, setFilterType] = useState("eq"); // Default filter type
    const [selectedDate, setSelectedDate] = useState(value?.date || null);
    const [startDate, setStartDate] = useState(value?.start || null);
    const [endDate, setEndDate] = useState(value?.end || null);
    console.log(onChange)
    const handleFilterTypeChange = (e) => {
        const newFilterType = e.target.value;
        setFilterType(newFilterType);

        // Reset date values when filter type changes
        setSelectedDate(null);
        setStartDate(null);
        setEndDate(null);
        onChange({
            name: "DespatchDate",
            operator: newFilterType,
            type: "date",
            value: null,
        }); // Reset filter value for new type
    };

    const handleSingleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        onChange({
            name: "DespatchDate",
            operator: filterType,
            type: "date",
            value: date,
        });
    };

    const handleStartDateChange = (e) => {
        const date = e.target.value;
        setStartDate(date);
        onChange({
            name: "DespatchDate",
            operator: "range",
            type: "date",
            value: { start: date, end: endDate },
        });
    };

    const handleEndDateChange = (e) => {
        const date = e.target.value;
        setEndDate(date);
        onChange({
            name: "DespatchDate",
            operator: "range",
            type: "date",
            value: { start: startDate, end: date },
        });
    };

    const clearDate = () => {
        setSelectedDate(null);
        setStartDate(null);
        setEndDate(null);
        onChange({
            name: "DespatchDate",
            operator: filterType,
            type: "date",
            value: null,
        }); // Clear the filter
    };

    return (
        <div>
            {/* Filter type dropdown */}
            <select value={filterType} onChange={handleFilterTypeChange}>
                <option value="eq">Equal</option>
                <option value="before">Before</option>
                <option value="after">After</option>
                <option value="range">Range</option>
            </select>

            {/* Conditional rendering based on filter type */}
            {filterType === "eq" && (
                <input
                    type="date"
                    value={selectedDate || ""}
                    onChange={handleSingleDateChange}
                    min={minDate}
                    max={maxDate}
                    placeholder="Select a date"
                />
            )}

            {filterType === "before" && (
                <input
                    type="date"
                    value={selectedDate || ""}
                    onChange={handleSingleDateChange}
                    min={minDate}
                    max={maxDate}
                    placeholder="Select a date"
                />
            )}

            {filterType === "after" && (
                <input
                    type="date"
                    value={selectedDate || ""}
                    onChange={handleSingleDateChange}
                    min={minDate}
                    max={maxDate}
                    placeholder="Select a date"
                />
            )}

            {filterType === "range" && (
                <div>
                    <input
                        type="date"
                        value={startDate || ""}
                        onChange={handleStartDateChange}
                        min={minDate}
                        max={maxDate}
                        placeholder="Start date"
                    />
                    <input
                        type="date"
                        value={endDate || ""}
                        onChange={handleEndDateChange}
                        min={minDate}
                        max={maxDate}
                        placeholder="End date"
                    />
                </div>
            )}

            {/* Clear button */}
            <button onClick={clearDate}>Clear</button>
        </div>
    );
};

export default CustomDateFilter;
