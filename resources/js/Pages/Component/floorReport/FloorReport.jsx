import "../../../../css/resizer.css";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    getFacetedRowModel,
    getFacetedUniqueValues,
} from "@tanstack/react-table";

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@heroui/react";
import axios from "axios";
import moment from "moment";
import swal from "sweetalert";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import PropTypes from "prop-types";
import { CustomContext } from "@/CommonContext";
import { ToastContainer } from "react-toastify";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { handleSessionExpiration } from "@/CommonFunctions";
import { useState, useEffect, useMemo, useContext } from "react";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    ChevronUpDownIcon,
    FunnelIcon,
    XMarkIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    CalendarDaysIcon,
    PlusCircleIcon,
    CubeIcon,
} from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/solid";
import { Pie, Column } from "@ant-design/plots";

import DetailsModal from "./DetailsModal";
import FloorCommentsModal from "./FloorCommentsModal";
import AddFloorCommentsModal from "./AddFloorCommentsModal";
import { canViewFloorComments } from "@/permissions";

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function DateColumnFilter({ column, table }) {
    const [expandedYears, setExpandedYears] = useState(new Set());
    const [expandedMonths, setExpandedMonths] = useState(new Set());
    const [selectedDates, setSelectedDates] = useState(new Set());
    const [includeEmpty, setIncludeEmpty] = useState(false);

    // Get all unique dates from the column data
    const availableDates = useMemo(() => {
        const dates = new Set();
        const rows = table.getPreFilteredRowModel().rows;

        rows.forEach((row) => {
            const value = row.getValue(column.id);
            if (value) {
                const dateStr = moment(value).format("YYYY-MM-DD");
                dates.add(dateStr);
            }
        });

        return Array.from(dates).sort().reverse(); // Most recent first
    }, [table.getPreFilteredRowModel().rows, column.id]);

    // Group dates by year and month
    const dateHierarchy = useMemo(() => {
        const hierarchy = {};

        availableDates.forEach((dateStr) => {
            const date = moment(dateStr);
            const year = date.year();
            const month = date.month(); // 0-11
            const day = date.date();

            if (!hierarchy[year]) {
                hierarchy[year] = {};
            }
            if (!hierarchy[year][month]) {
                hierarchy[year][month] = [];
            }
            hierarchy[year][month].push({
                date: dateStr,
                day: day,
                fullDate: date.format("DD/MM/YYYY"),
            });
        });

        return hierarchy;
    }, [availableDates]);

    // Sync selected dates with filter value
    useEffect(() => {
        const currentFilter = column.getFilterValue();
        if (currentFilter) {
            if (currentFilter.dates && currentFilter.dates.size > 0) {
                setSelectedDates(new Set(currentFilter.dates));
            } else {
                setSelectedDates(new Set());
            }
            if (currentFilter.includeEmpty !== undefined) {
                setIncludeEmpty(currentFilter.includeEmpty);
            }
        } else {
            setSelectedDates(new Set());
            setIncludeEmpty(false);
        }
    }, [column.getFilterValue()]);

    const toggleYear = (year) => {
        const newExpanded = new Set(expandedYears);
        if (newExpanded.has(year)) {
            newExpanded.delete(year);
        } else {
            newExpanded.add(year);
        }
        setExpandedYears(newExpanded);
    };

    const toggleMonth = (yearMonth) => {
        const newExpanded = new Set(expandedMonths);
        if (newExpanded.has(yearMonth)) {
            newExpanded.delete(yearMonth);
        } else {
            newExpanded.add(yearMonth);
        }
        setExpandedMonths(newExpanded);
    };

    const handleDateSelection = (dateStr) => {
        const newSelected = new Set(selectedDates);
        if (newSelected.has(dateStr)) {
            newSelected.delete(dateStr);
        } else {
            newSelected.add(dateStr);
        }
        setSelectedDates(newSelected);

        // When selecting dates, disable "Only Null" filter
        setIncludeEmpty(false);

        // Apply filter based on selection
        if (newSelected.size > 0) {
            column.setFilterValue({ dates: newSelected, includeEmpty: false });
        } else {
            column.setFilterValue(undefined);
        }
    };

    const handleYearSelection = (year) => {
        const yearDates = Object.values(dateHierarchy[year] || {})
            .flat()
            .map((d) => d.date);
        const allSelected = yearDates.every((date) => selectedDates.has(date));

        const newSelected = new Set(selectedDates);
        yearDates.forEach((date) => {
            if (allSelected) {
                newSelected.delete(date);
            } else {
                newSelected.add(date);
            }
        });
        setSelectedDates(newSelected);

        // When selecting dates, disable "Only Null" filter
        setIncludeEmpty(false);

        // Apply filter
        if (newSelected.size > 0) {
            column.setFilterValue({ dates: newSelected, includeEmpty: false });
        } else {
            column.setFilterValue(undefined);
        }
    };

    const handleMonthSelection = (year, month) => {
        const monthDates = (dateHierarchy[year]?.[month] || []).map(
            (d) => d.date,
        );
        const allSelected = monthDates.every((date) => selectedDates.has(date));

        const newSelected = new Set(selectedDates);
        monthDates.forEach((date) => {
            if (allSelected) {
                newSelected.delete(date);
            } else {
                newSelected.add(date);
            }
        });
        setSelectedDates(newSelected);

        // When selecting dates, disable "Only Null" filter
        setIncludeEmpty(false);

        // Apply filter
        if (newSelected.size > 0) {
            column.setFilterValue({ dates: newSelected, includeEmpty: false });
        } else {
            column.setFilterValue(undefined);
        }
    };

    const handleEmptyToggle = () => {
        const newIncludeEmpty = !includeEmpty;
        setIncludeEmpty(newIncludeEmpty);

        // When checking "Only Null", clear selected dates
        if (newIncludeEmpty) {
            setSelectedDates(new Set());
            column.setFilterValue({ dates: new Set(), includeEmpty: true });
        } else {
            column.setFilterValue(undefined);
        }
    };

    const clearFilter = () => {
        setSelectedDates(new Set());
        setIncludeEmpty(false);
        column.setFilterValue(undefined);
    };

    const hasFilter = selectedDates.size > 0 || includeEmpty;
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    return (
        <div className="flex flex-col gap-2 p-3 w-80">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span>Filter by Date</span>
                </div>
                {hasFilter && (
                    <button
                        onClick={clearFilter}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                        <XMarkIcon className="w-3 h-3" />
                        Clear{" "}
                        {includeEmpty ? "(Null)" : `(${selectedDates.size})`}
                    </button>
                )}
            </div>

            {/* Empty/Null Filter Option */}
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                <input
                    type="checkbox"
                    id="only-null-dates"
                    checked={includeEmpty}
                    onChange={handleEmptyToggle}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                    htmlFor="only-null-dates"
                    className="text-sm text-gray-700 cursor-pointer"
                >
                    Null Dates
                </label>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Hierarchical Date Selection */}
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                {Object.keys(dateHierarchy).length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                        No dates available
                    </div>
                ) : (
                    Object.keys(dateHierarchy)
                        .sort((a, b) => b - a)
                        .map((year) => {
                            const yearNum = parseInt(year);
                            const isYearExpanded = expandedYears.has(yearNum);
                            const yearDates = Object.values(
                                dateHierarchy[yearNum],
                            )
                                .flat()
                                .map((d) => d.date);
                            const yearSelectedCount = yearDates.filter((d) =>
                                selectedDates.has(d),
                            ).length;
                            const isYearFullySelected =
                                yearSelectedCount === yearDates.length;
                            const isYearPartiallySelected =
                                yearSelectedCount > 0 && !isYearFullySelected;

                            return (
                                <div
                                    key={year}
                                    className="border-b border-gray-200 last:border-b-0"
                                >
                                    {/* Year Row */}
                                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 bg-gray-100">
                                        <button
                                            onClick={() => toggleYear(yearNum)}
                                            className="p-0.5 hover:bg-gray-200 rounded"
                                        >
                                            {isYearExpanded ? (
                                                <ChevronDownIcon className="w-3 h-3" />
                                            ) : (
                                                <ChevronRightIcon className="w-3 h-3" />
                                            )}
                                        </button>
                                        <input
                                            type="checkbox"
                                            checked={isYearFullySelected}
                                            ref={(el) => {
                                                if (el)
                                                    el.indeterminate =
                                                        isYearPartiallySelected;
                                            }}
                                            onChange={() =>
                                                handleYearSelection(yearNum)
                                            }
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-semibold text-gray-800 flex-1">
                                            {year}
                                        </span>
                                        {yearSelectedCount > 0 && (
                                            <span className="text-xs text-blue-600 font-medium">
                                                ({yearSelectedCount})
                                            </span>
                                        )}
                                    </div>

                                    {/* Months */}
                                    {isYearExpanded && (
                                        <div className="bg-white">
                                            {Object.keys(dateHierarchy[yearNum])
                                                .sort((a, b) => b - a)
                                                .map((month) => {
                                                    const monthNum =
                                                        parseInt(month);
                                                    const monthKey = `${year}-${month}`;
                                                    const isMonthExpanded =
                                                        expandedMonths.has(
                                                            monthKey,
                                                        );
                                                    const monthDates =
                                                        dateHierarchy[yearNum][
                                                            monthNum
                                                        ].map((d) => d.date);
                                                    const monthSelectedCount =
                                                        monthDates.filter((d) =>
                                                            selectedDates.has(
                                                                d,
                                                            ),
                                                        ).length;
                                                    const isMonthFullySelected =
                                                        monthSelectedCount ===
                                                        monthDates.length;
                                                    const isMonthPartiallySelected =
                                                        monthSelectedCount >
                                                            0 &&
                                                        !isMonthFullySelected;

                                                    return (
                                                        <div key={monthKey}>
                                                            {/* Month Row */}
                                                            <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 pl-8">
                                                                <button
                                                                    onClick={() =>
                                                                        toggleMonth(
                                                                            monthKey,
                                                                        )
                                                                    }
                                                                    className="p-0.5 hover:bg-gray-200 rounded"
                                                                >
                                                                    {isMonthExpanded ? (
                                                                        <ChevronDownIcon className="w-3 h-3" />
                                                                    ) : (
                                                                        <ChevronRightIcon className="w-3 h-3" />
                                                                    )}
                                                                </button>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        isMonthFullySelected
                                                                    }
                                                                    ref={(
                                                                        el,
                                                                    ) => {
                                                                        if (el)
                                                                            el.indeterminate =
                                                                                isMonthPartiallySelected;
                                                                    }}
                                                                    onChange={() =>
                                                                        handleMonthSelection(
                                                                            yearNum,
                                                                            monthNum,
                                                                        )
                                                                    }
                                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                                />
                                                                <span className="text-sm text-gray-700 flex-1">
                                                                    {
                                                                        monthNames[
                                                                            monthNum
                                                                        ]
                                                                    }
                                                                </span>
                                                                {monthSelectedCount >
                                                                    0 && (
                                                                    <span className="text-xs text-blue-600 font-medium">
                                                                        (
                                                                        {
                                                                            monthSelectedCount
                                                                        }
                                                                        )
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Days */}
                                                            {isMonthExpanded && (
                                                                <div className="bg-gray-50">
                                                                    {dateHierarchy[
                                                                        yearNum
                                                                    ][
                                                                        monthNum
                                                                    ].map(
                                                                        (
                                                                            dateObj,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    dateObj.date
                                                                                }
                                                                                className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 pl-16"
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={selectedDates.has(
                                                                                        dateObj.date,
                                                                                    )}
                                                                                    onChange={() =>
                                                                                        handleDateSelection(
                                                                                            dateObj.date,
                                                                                        )
                                                                                    }
                                                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                                                />
                                                                                <span className="text-xs text-gray-600">
                                                                                    {
                                                                                        dateObj.fullDate
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                )}
            </div>
        </div>
    );
}

// Filter component for column headers
function ColumnFilter({ column, table }) {
    const columnFilterValue = column.getFilterValue();
    const { filterVariant, filterLabelMap } = column.columnDef.meta ?? {};

    const sortedUniqueValues = useMemo(() => {
        if (filterVariant === "select") {
            const uniqueValues = Array.from(
                column.getFacetedUniqueValues().keys(),
            )
                .filter((v) => v !== null && v !== undefined && v !== "")
                .sort();
            return uniqueValues;
        }
        return [];
    }, [column.getFacetedUniqueValues(), filterVariant]);

    if (filterVariant === "select") {
        return (
            <div className="flex flex-col gap-2 p-3 min-w-[200px]">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                        Filter
                    </span>
                    {columnFilterValue && (
                        <button
                            onClick={() => column.setFilterValue(undefined)}
                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                            <XMarkIcon className="w-3 h-3" />
                            Clear
                        </button>
                    )}
                </div>
                <select
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) =>
                        column.setFilterValue(e.target.value || undefined)
                    }
                    value={columnFilterValue ?? ""}
                >
                    <option value="">
                        {filterLabelMap?.[""] ?? "All"}
                    </option>
                    {sortedUniqueValues.map((value) => (
                        <option key={value} value={value}>
                            {filterLabelMap?.[value] ?? value}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    if (filterVariant === "date") {
        return <DateColumnFilter column={column} table={table} />;
    }

    if (filterVariant === "number") {
        return <NumberColumnFilter column={column} />;
    }

    // Default text filter
    return (
        <div className="flex flex-col gap-2 p-3 min-w-[200px]">
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                    Search
                </span>
                {columnFilterValue && (
                    <button
                        onClick={() => column.setFilterValue(undefined)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                        <XMarkIcon className="w-3 h-3" />
                        Clear
                    </button>
                )}
            </div>
            <input
                type="text"
                placeholder="Type to search..."
                value={columnFilterValue ?? ""}
                onChange={(e) =>
                    column.setFilterValue(e.target.value || undefined)
                }
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}

// Number filter component
function NumberColumnFilter({ column }) {
    const columnFilterValue = column.getFilterValue() || {};
    const [min, setMin] = useState(columnFilterValue.min ?? "");
    const [max, setMax] = useState(columnFilterValue.max ?? "");

    const applyFilter = (newMin, newMax) => {
        const minVal = newMin === "" ? undefined : Number(newMin);
        const maxVal = newMax === "" ? undefined : Number(newMax);

        if (minVal === undefined && maxVal === undefined) {
            column.setFilterValue(undefined);
        } else {
            column.setFilterValue({ min: minVal, max: maxVal });
        }
    };

    const handleMinChange = (e) => {
        const value = e.target.value;
        setMin(value);
        applyFilter(value, max);
    };

    const handleMaxChange = (e) => {
        const value = e.target.value;
        setMax(value);
        applyFilter(min, value);
    };

    const clearFilter = () => {
        setMin("");
        setMax("");
        column.setFilterValue(undefined);
    };

    const hasFilter = min !== "" || max !== "";

    return (
        <div className="flex flex-col gap-2 p-3 min-w-[200px]">
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                    Filter by Range
                </span>
                {hasFilter && (
                    <button
                        onClick={clearFilter}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                        <XMarkIcon className="w-3 h-3" />
                        Clear
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                        Minimum
                    </label>
                    <input
                        type="number"
                        placeholder="Min"
                        value={min}
                        onChange={handleMinChange}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                        Maximum
                    </label>
                    <input
                        type="number"
                        placeholder="Max"
                        value={max}
                        onChange={handleMaxChange}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}

// Date filter function - for individual date selection
const dateFilterFn = (row, columnId, filterValue) => {
    if (!filterValue) return true;

    const cellValue = row.getValue(columnId);

    // Handle the new filter structure with dates Set and includeEmpty boolean
    const dates = filterValue.dates || filterValue;
    const includeEmpty = filterValue.includeEmpty || false;
    const beforeDate = filterValue.beforeDate;
    const afterDate = filterValue.afterDate;

    // If cell value is empty/null
    if (!cellValue) {
        return includeEmpty;
    }

    // If no dates selected but includeEmpty is true, don't show non-empty dates
    if ((!dates || dates.size === 0) && includeEmpty) {
        return false;
    }

    const cellDate = moment(cellValue).format("YYYY-MM-DD");

    // Handle before date filter (Past Due)
    if (beforeDate) {
        return moment(cellDate).isBefore(beforeDate);
    }

    // Handle after date filter (Future)
    if (afterDate) {
        return moment(cellDate).isAfter(afterDate);
    }

    // If dates are selected, check if cell date matches
    if (dates && dates.size > 0) {
        return dates.has(cellDate);
    }

    return true;
};

// Number filter function - for range filtering
const numberFilterFn = (row, columnId, filterValue) => {
    if (!filterValue) return true;

    const cellValue = row.getValue(columnId);
    if (cellValue === null || cellValue === undefined) return false;

    const numValue = Number(cellValue);
    if (isNaN(numValue)) return false;

    const { min, max } = filterValue;

    if (min !== undefined && max !== undefined) {
        return numValue >= min && numValue <= max;
    } else if (min !== undefined) {
        return numValue >= min;
    } else if (max !== undefined) {
        return numValue <= max;
    }

    return true;
};

// Column width constants for sticky columns (fixed)
const ACTION_COL_WIDTH = 50;
const CONS_NO_COL_WIDTH = 130;

// Summary Cards Components
function TotalScannedCard({ total, depotBreakdown, availableDepots }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 col-span-2 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
                <CubeIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-600 uppercase">
                    Total Items Scanned
                </h3>
            </div>
            <p className="text-5xl font-bold text-blue-600 mb-4">
                {total.toLocaleString()}
            </p>

            {/* Depot Breakdown Table */}
            {availableDepots && availableDepots.length > 0 && (
                <div className="mt-4 border-t pt-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        By Depot
                    </h4>
                    <div className="max-h-40 overflow-y-auto">
                        <table className="w-full text-sm">
                            <tbody>
                                {availableDepots
                                    .sort((a, b) => a.localeCompare(b))
                                    .map((depot) => (
                                        <tr
                                            key={depot}
                                            className="border-b border-gray-100 last:border-b-0"
                                        >
                                            <td className="py-1.5 text-gray-700">
                                                {depot}
                                            </td>
                                            <td className="py-1.5 text-right font-semibold text-gray-900">
                                                {(
                                                    depotBreakdown[depot] || 0
                                                ).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

TotalScannedCard.propTypes = {
    total: PropTypes.number.isRequired,
    depotBreakdown: PropTypes.object.isRequired,
    availableDepots: PropTypes.array,
};

function RDDStatusCard({ data, onFilterByRDD }) {
    const rddChartData = useMemo(() => {
        return [
            { category: "Past Due", value: data.rddPast, type: "RDD" },
            { category: "Today", value: data.rddToday, type: "RDD" },
            { category: "Future", value: data.rddFuture, type: "RDD" },
        ].filter((item) => item.value > 0);
    }, [data.rddPast, data.rddToday, data.rddFuture]);

    const rddPieConfig = useMemo(
        () => ({
            data: rddChartData,
            angleField: "value",
            colorField: "category",
            color: (datum) => {
                const colorMap = {
                    "Past Due": "#ef4444",
                    Today: "#eab308",
                    Future: "#22c55e",
                };
                return colorMap[datum.category];
            },
            radius: 0.7,
            innerRadius: 0.5,
            label: {
                type: "inner",
                offset: "-40%",
                content: "{value}",
                style: {
                    fontSize: 14,
                    fontWeight: "bold",
                    textAlign: "center",
                    fill: "#fff",
                },
            },
            legend: {
                position: "bottom",
                layout: "horizontal",
            },
            interactions: [{ type: "element-active" }],
            state: {
                active: {
                    style: {
                        lineWidth: 2,
                        stroke: "#000",
                    },
                },
                selected: {
                    style: {
                        lineWidth: 2,
                        stroke: "#000",
                    },
                },
            },
            statistic: {
                title: {
                    content: "Total",
                    style: {
                        fontSize: "14px",
                    },
                },
                content: {
                    style: {
                        fontSize: "24px",
                        fontWeight: "bold",
                    },
                    content: (
                        data.rddPast +
                        data.rddToday +
                        data.rddFuture
                    ).toString(),
                },
            },
            onReady: (plot) => {
                plot.on("element:click", (evt) => {
                    const { category } = evt.data.data;
                    if (onFilterByRDD) {
                        onFilterByRDD(category);
                    }
                });

                // Change cursor to pointer on hover
                const canvas = plot.chart.getCanvas();
                const canvasEl = canvas.get("el");

                plot.on("element:mouseenter", () => {
                    canvasEl.style.cursor = "pointer";
                });

                plot.on("element:mouseleave", () => {
                    canvasEl.style.cursor = "default";
                });
            },
        }),
        [
            rddChartData,
            data.rddPast,
            data.rddToday,
            data.rddFuture,
            onFilterByRDD,
        ],
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6 col-span-3 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
                RDD Status
            </h3>
            <div className="h-64 cursor-pointer">
                {rddChartData.length > 0 ? (
                    <Pie {...rddPieConfig} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No RDD data available
                    </div>
                )}
            </div>
        </div>
    );
}

RDDStatusCard.propTypes = {
    data: PropTypes.shape({
        rddPast: PropTypes.number.isRequired,
        rddToday: PropTypes.number.isRequired,
        rddFuture: PropTypes.number.isRequired,
    }).isRequired,
    onFilterByRDD: PropTypes.func,
};

function TopStatusesCard({ data, onFilterByStatus }) {
    const statusChartData = useMemo(() => {
        return Object.entries(data)
            .map(([status, count]) => ({
                label: status,
                value: count,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Top 10 statuses
    }, [data]);

    const statusColumnConfig = useMemo(
        () => ({
            data: statusChartData,
            xField: "label",
            yField: "value",
            color: "#E2C047",
            label: {
                position: "middle",
                style: {
                    fill: "#000",
                    fontSize: 12,
                },
            },
            xAxis: {
                label: {
                    autoRotate: false,
                    autoHide: false,
                    style: {
                        fontSize: 11,
                        fontWeight: "bold",
                    },
                    formatter: (text) => {
                        // Wrap words - each word on a new line
                        return text.split(" ").join("\n");
                    },
                },
            },
            yAxis: {
                label: {
                    formatter: (v) => `${v}`,
                },
            },
            appendPadding: [0, 0, 60, 0], // Add padding at bottom for wrapped labels
            onReady: (plot) => {
                plot.on("element:dblclick", (evt) => {
                    const { label } = evt.data.data;
                    if (onFilterByStatus) {
                        onFilterByStatus(label);
                    }
                });

                // Change cursor to pointer on hover
                const canvas = plot.chart.getCanvas();
                const canvasEl = canvas.get("el");

                plot.on("element:mouseenter", () => {
                    canvasEl.style.cursor = "pointer";
                });

                plot.on("element:mouseleave", () => {
                    canvasEl.style.cursor = "default";
                });
            },
        }),
        [statusChartData, onFilterByStatus],
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6 pb-0 border border-gray-200 col-span-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
                Consignment Status
            </h3>
            <div className="h-64 ">
                {statusChartData.length > 0 ? (
                    <Column
                        {...statusColumnConfig}
                        className="!h-80 !cursor-pointer"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No status data available
                    </div>
                )}
            </div>
        </div>
    );
}

TopStatusesCard.propTypes = {
    data: PropTypes.object.isRequired,
    onFilterByStatus: PropTypes.func,
};

export default function FloorReport() {
    const [loading, setLoading] = useState(true);
    const [floorData, setFloorData] = useState([]);
    const { Token, user, userPermissions, url } = useContext(CustomContext);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {
        isOpen: isCommentOpen,
        onOpen: onCommentOpen,
        onOpenChange: onCommentChange,
    } = useDisclosure();
    const {
        isOpen: isAddCommentOpen,
        onOpen: onAddCommentOpen,
        onOpenChange: onAddCommentChange,
    } = useDisclosure();
    const [sorting, setSorting] = useState([
        // { id: "EventDateTime", desc: true },
        // { id: "RDD", desc: false },
    ]);

    const [detailsData, setDetailsData] = useState(null);

    const handleCommentSaved = (consignmentId, comment) => {
        const newCommentObj = {
            Comment: comment,
            AddedBy:
                user?.FullName ||
                user?.UserName ||
                `${user?.FirstName} ${user?.LastName}`,
            AddedAt: new Date().toISOString(),
            ConsId: consignmentId,
        };

        // Update local floor data
        setFloorData((prevData) =>
            prevData.map((row) =>
                row.ConsignmentID === consignmentId
                    ? {
                          ...row,
                          Comment: comment,
                          Comments: [...(row.Comments || []), newCommentObj],
                      }
                    : row,
            ),
        );

        // Update detailsData to show the new comment in the view modal
        if (detailsData && detailsData.ConsignmentID === consignmentId) {
            setDetailsData((prev) => ({
                ...prev,
                Comment: comment,
                Comments: [...(prev.Comments || []), newCommentObj],
            }));
        }

        // Switch from add modal to view modal to show the saved comment
        onAddCommentChange(false);
    };

    const [selectedDepots, setSelectedDepots] = useState([]);
    const [showCharts, setShowCharts] = useState(false);
    const [columnFilters, setColumnFilters] = useState(() => {
        const today = moment().format("YYYY-MM-DD");
        return [
            {
                id: "EventDateTime",
                value: { dates: new Set([today]), includeEmpty: false },
            },
            {
                id: "ReturnCons",
                value: "No",
            },
        ];
    });
    const [columnVisibility, setColumnVisibility] = useState({
        DespatchDateTime: false,
        SenderName: false,
        SenderState: false,
        SenderSuburb: false,
        SenderZone: false,
        ReceiverSuburb: false,
        ReceiverZone: false,
        OldRdd: false,
        TimeslotRequired: false,
        TimeslotBooked: false,
    });

    const dateFields = [
        "DespatchDateTime",
        "EventDateTime",
        "PODDateTime",
        "ConsStatusDate",
        "RDD",
        "OldRdd",
        "NewRdd",
    ];

    // Format dates from backend
    const formattedData = useMemo(
        () =>
            floorData?.map((row) => {
                const newRow = { ...row };

                dateFields.forEach((field) => {
                    if (row[field]) {
                        const parsed = moment(row[field], [
                            "YYYY-MM-DDTHH:mm:ssZ",
                            "YYYY-MM-DDTHH:mm:ss",
                            "DD-MM-YYYY HH:mm A",
                            "DD/MM/YYYY HH:mm A",
                            "D/M/YYYY HH:mm A",
                            "YYYY-MM-DD HH:mm:ss",
                            "DD-MM-YYYY hh:mm A",
                            "DD/MM/YYYY hh:mm A",
                            "D/M/YYYY hh:mm A",
                            "YYYY-MM-DD",
                            "DD/MM/YYYY",
                            "D/M/YYYY",
                        ]);

                        newRow[field] = parsed.isValid()
                            ? parsed.toDate()
                            : null;
                    } else {
                        newRow[field] = null;
                    }
                });

                return newRow;
            }) || [],
        [floorData],
    );

    const handleViewDetails = (data) => {
        setDetailsData(data);
        onOpen();
    };
    const handleViewComments = (data) => {
        setDetailsData(data);
        onCommentOpen();
    };

    // 4. Update handleAddComments
    const handleAddComments = (data) => {
        setDetailsData({
            Comment: "",
            ConsId: data.ConsignmentID,
            FloorCommentId: null,
            ConsignmentID: data.ConsignmentID,
            ConsignmentNo: data.ConsignmentNo,
        });
        onAddCommentOpen();
    };

    const handleEditComments = (data) => {
        setDetailsData({
            Comment: data.Comment,
            ConsId: data.ConsId,
            FloorCommentId: data.FloorCommentId,
        });
        onCommentChange();
        onAddCommentOpen();
    };

    const handleConsignmentClick = (consignmentData) => {
        const url = `/gtrs/consignment-details?consId=${consignmentData.ConsignmentID}`;
        window.open(url, "_blank");
    };

    // Cell renderers
    const DateCell = ({ value, showTime = true }) => {
        if (!value) return <span className="text-gray-400">-</span>;
        const outputFormat = showTime ? "DD/MM/YYYY hh:mm A" : "DD/MM/YYYY";
        // value is already a Date object from formattedData
        const parsedDate = moment(value);
        return <span>{parsedDate.format(outputFormat)}</span>;
    };

    const RDDCell = ({ value }) => {
        if (!value) return <span className="text-gray-400">-</span>;

        const today = moment().startOf("day");
        const rddDate = moment(value).startOf("day");
        const momentValue = moment(value);

        let className = "";
        if (rddDate.isBefore(today)) {
            className =
                "bg-red-300 border-1 border-red-400  text-red-800 font-semibold px-2 py-1 rounded";
        } else if (rddDate.isSame(today)) {
            className =
                "bg-yellow-100 text-yellow-800 font-semibold px-2 py-1 rounded";
        }

        // Check if time is 00:00
        const isTimeEmpty =
            momentValue.hour() === 0 && momentValue.minute() === 0;
        const format = isTimeEmpty ? "DD/MM/YYYY" : "DD/MM/YYYY hh:mm A";

        return <span className={className}>{momentValue.format(format)}</span>;
    };

    const BooleanCell = ({ value }) => {
        if (value === "YES" || value === "Yes" || value === true) {
            return (
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                    {value === true ? " True" : "Yes"}
                </span>
            );
        } else if (value === "NO" || value === "No" || value === false) {
            return (
                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                    {value === false ? " False" : "No"}
                </span>
            );
        }
        return null;
    };

    const TimeslotBookedCell = ({ value, row }) => {
        if (row.original.TimeslotRequired !== "YES") {
            return null;
        }
        return <BooleanCell value={value} />;
    };

    // Get all available depots from the data
    const availableDepots = useMemo(() => {
        const depots = new Set();
        formattedData.forEach((row) => {
            if (row.Depot) {
                depots.add(row.Depot);
            }
        });
        return Array.from(depots).sort();
    }, [formattedData]);

    // Apply depot filter and return cons filter to the data
    const depotFilteredData = useMemo(() => {
        let data = formattedData;

        if (selectedDepots.length > 0) {
            data = data.filter((row) => selectedDepots.includes(row.Depot));
        }
        return data;
    }, [formattedData, selectedDepots]);

    // TanStack Table columns configuration
    const columns = useMemo(
        () => [
            {
                id: "actions",
                header: "",
                size: ACTION_COL_WIDTH,
                minSize: ACTION_COL_WIDTH,
                maxSize: ACTION_COL_WIDTH,
                enableSorting: false,
                enableColumnFilter: false,
                cell: ({ row }) => (
                    <button
                        className="p-1 hover:bg-gray-100 rounded transition-colors flex items-center justify-center w-full"
                        title="View Details"
                        onClick={() => handleViewDetails(row.original)}
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                ),
            },
            {
                accessorKey: "EventDateTime",
                header: "Floor Scan Date",
                meta: { filterVariant: "date" },
                filterFn: dateFilterFn,
                cell: ({ getValue }) => (
                    <DateCell value={getValue()} showTime={true} />
                ),
            },
            {
                accessorKey: "Depot",
                header: "Depot",
                meta: { filterVariant: "select" },
            },
            {
                accessorKey: "ChargeTo",
                header: "Account Name",
                // size: ACTION_COL_WIDTH,
                // minSize: ACTION_COL_WIDTH,
                // maxSize: ACTION_COL_WIDTH,
                meta: { filterVariant: "text" },
            },
            {
                accessorKey: "ConsignmentNo",
                header: "Cons No",
                size: CONS_NO_COL_WIDTH,
                minSize: CONS_NO_COL_WIDTH,
                // maxSize: CONS_NO_COL_WIDTH,
                meta: { filterVariant: "text" },
                cell: ({ row }) => {
                    return (
                        <span
                            className="underline text-blue-500 hover:cursor-pointer"
                            onClick={(e) => {
                                handleConsignmentClick(row.original);
                            }}
                        >
                            {row.original.ConsignmentNo}
                        </span>
                    );
                },
            },
            {
                accessorKey: "DespatchDateTime",
                header: "Despatch Date",
                meta: { filterVariant: "date" },
                filterFn: dateFilterFn,
                cell: ({ getValue }) => (
                    <DateCell value={getValue()} showTime={false} />
                ),
            },
            {
                accessorKey: "RDD",
                header: "RDD",
                meta: { filterVariant: "date" },
                filterFn: dateFilterFn,
                cell: ({ getValue }) => <RDDCell value={getValue()} />,
            },

            {
                accessorKey: "OldRdd",
                header: "Original RDD",
                meta: { filterVariant: "date" },
                filterFn: dateFilterFn,
                cell: ({ getValue }) => (
                    <DateCell value={getValue()} showTime={false} />
                ),
            },
            {
                accessorKey: "ConsStatus",
                header: "Cons Status",
                size: 200,
                // minSize: 100,
                // maxSize: 250,
                meta: { filterVariant: "select" },
            },
            {
                accessorKey: "ConsStatusDate",
                header: "Cons Status Date",
                meta: { filterVariant: "date" },
                filterFn: dateFilterFn,
                cell: ({ getValue }) => (
                    <>
                        <DateCell value={getValue()} showTime={true} />
                    </>
                ),
            },
            {
                accessorKey: "POD",
                header: "POD",
                meta: { filterVariant: "select" },
                cell: ({ getValue }) => <BooleanCell value={getValue()} />,
            },
            {
                accessorKey: "PODDateTime",
                header: "POD Date",
                meta: { filterVariant: "date" },
                filterFn: dateFilterFn,
                cell: ({ getValue }) => (
                    <DateCell value={getValue()} showTime={true} />
                ),
            },
            {
                accessorKey: "SenderName",
                header: "Sender Name",
                meta: { filterVariant: "text" },
            },
            {
                accessorKey: "SenderState",
                header: "Sender State",
                meta: { filterVariant: "select" },
            },
            {
                accessorKey: "SenderSuburb",
                header: "Sender Suburb",
                meta: { filterVariant: "text" },
            },
            {
                accessorKey: "SenderZone",
                header: "Sender Zone",
                meta: { filterVariant: "select" },
            },
            {
                accessorKey: "ReceiverName",
                header: "Receiver Name",
                meta: { filterVariant: "text" },
            },
            {
                accessorKey: "ReceiverState",
                header: "Receiver State",
                meta: { filterVariant: "select" },
            },
            {
                accessorKey: "ReceiverSuburb",
                header: "Receiver Suburb",
                meta: { filterVariant: "text" },
            },
            {
                accessorKey: "ReceiverZone",
                header: "Receiver Zone",
                meta: { filterVariant: "select" },
            },

            {
                accessorKey: "OriginPalletSpaces",
                header: "Cnote Pallet Space",
                meta: { filterVariant: "number" },
                filterFn: numberFilterFn,
            },
            {
                accessorKey: "PalletQuantity",
                header: "Pallet Quantity",
                meta: { filterVariant: "number" },
                filterFn: numberFilterFn,
            },
            {
                accessorKey: "ActualScanned",
                header: "Scanned Events",
                meta: { filterVariant: "number" },
                filterFn: numberFilterFn,
            },
            {
                accessorKey: "TotalDays",
                header: "Total Days",
                meta: { filterVariant: "number" },
                filterFn: numberFilterFn,
            },
            {
                accessorKey: "TimeslotRequired",
                header: "Timeslot Required",
                meta: { filterVariant: "select" },
                cell: ({ getValue }) => <BooleanCell value={getValue()} />,
            },
            {
                accessorKey: "TimeslotBooked",
                header: "Timeslot Booked",
                meta: { filterVariant: "select" },
                cell: ({ getValue, row }) => (
                    <TimeslotBookedCell value={getValue()} row={row} />
                ),
            },
            {
                accessorKey: "DockLocation",
                header: "Dock Location",
                meta: { filterVariant: "text" },
            },
            {
                accessorKey: "DockLocationName",
                header: "Dock Location Name",
                meta: { filterVariant: "text" },
            },
            {
                accessorKey: "ReturnCons",
                header: "Return Consignment",
                meta: {
                    filterVariant: "select",
                    filterLabelMap: {
                        "": "Show all",
                        Yes: "Show only return",
                        No: "Hide return",
                    },
                },
                cell: ({ getValue }) => <BooleanCell value={getValue()} />,
            },
            {
                accessorKey: "Comment",
                header: "Jaix Latest Comment",
                meta: { filterVariant: "text" },
                size: 230,
                minSize: 230,
                maxSize: 230,
            },
            {
                id: "comments-actions",
                header: "Jaix Comments",
                size: 150,
                minSize: 150,
                maxSize: 150,
                enableSorting: false,
                enableColumnFilter: false,
                cell: ({ row }) => (
                    <div className="flex gap-1">
                        {canViewFloorComments(userPermissions) && (
                            <button
                                className="p-1 hover:bg-gray-100 rounded transition-colors flex items-center justify-center w-full"
                                title="View Details"
                                onClick={() => handleViewComments(row.original)}
                            >
                                <EyeIcon className="w-4 h-4 text-yellow-500" />
                            </button>
                        )}
                    </div>
                ),
            },
        ],
        [userPermissions],
    );

    // Initialize TanStack Table
    const table = useReactTable({
        data: depotFilteredData,
        columns,
        getRowId: (row) =>
            row.ConsignmentID?.toString() || Math.random().toString(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
        defaultColumn: {
            size: 180,
            minSize: 80,
            maxSize: 800,
        },
        initialState: {
            pagination: {
                pageSize: 50,
            },
        },
        enableColumnResizing: true,
        columnResizeMode: "onChange",
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFacetedRowModel: getFacetedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        // columnResizeMode: "onChange",
        // enableColumnResizing: true,
    });

    // Calculate overall summary from filtered data
    const overallSummary = useMemo(() => {
        const filteredRows = table.getFilteredRowModel().rows;
        const summary = {
            totalScanned: 0,
            rddPast: 0,
            rddToday: 0,
            rddFuture: 0,
            rddNull: 0,
            statusBreakdown: {},
            depotBreakdown: {},
        };

        filteredRows.forEach((row) => {
            const rdd = row.original.RDD;
            const status = row.original.ConsStatus;
            const depot = row.original.Depot;
            const details = row.original.Details || [];

            // Count items in Details array instead of just counting rows
            const itemCount = details.length > 0 ? details.length : 1;
            summary.totalScanned += itemCount;

            // Depot breakdown - count items per depot
            if (depot) {
                summary.depotBreakdown[depot] =
                    (summary.depotBreakdown[depot] || 0) + itemCount;
            }

            // RDD categorization
            if (rdd) {
                const rddDate = moment(rdd).startOf("day");
                const today = moment().startOf("day");

                if (rddDate.isBefore(today)) {
                    summary.rddPast++;
                } else if (rddDate.isSame(today)) {
                    summary.rddToday++;
                } else {
                    summary.rddFuture++;
                }
            } else {
                summary.rddNull++;
            }

            // Status breakdown
            if (status) {
                summary.statusBreakdown[status] =
                    (summary.statusBreakdown[status] || 0) + 1;
            }
        });

        return summary;
    }, [table.getFilteredRowModel().rows]);

    const fetchData = () => {
        setLoading(true);
        axios
            .get(`${url}/FloorReport`, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((res) => {
                setFloorData(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        icon: "info",
                        confirmButtonText: "OK",
                    }).then(async function () {
                        await handleSessionExpiration();
                    });
                } else {
                    console.log(err);
                    setLoading(false);
                }
            });
    };

    useEffect(() => {
        fetchData();
    }, [userPermissions, Token, url, user.UserId]);

    // Export to Excel
    const exportToExcel = async () => {
        const rows = table.getFilteredRowModel().rows;
        const visibleColumns = table
            .getAllColumns()
            .filter(
                (col) => col.id !== "actions" && col.id !== "comments-actions",
            );

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Floor Report");

        // Add headers
        const headers = visibleColumns.map((col) => col.columnDef.header);
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" },
        };
        headerRow.alignment = { horizontal: "center", vertical: "middle" };

        // Define date columns with their format types
        const dateTimeColumns = [
            "Floor Scan Date",
            "Cons Status Date",
            "POD Date",
        ];
        const dateOnlyColumns = ["Original RDD", "Despatch Date"];
        const rddColumns = ["RDD"];

        const dateTimeIndexes = headers
            .map((h, i) => (dateTimeColumns.includes(h) ? i : null))
            .filter((i) => i !== null);
        const dateOnlyIndexes = headers
            .map((h, i) => (dateOnlyColumns.includes(h) ? i : null))
            .filter((i) => i !== null);
        const rddIndexes = headers
            .map((h, i) => (rddColumns.includes(h) ? i : null))
            .filter((i) => i !== null);

        // Add data rows
        rows.forEach((row) => {
            const rowData = visibleColumns.map((col) => {
                const value = row.getValue(col.id);
                return value;
            });

            const excelRow = worksheet.addRow(rowData);

            excelRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const cellValue = cell.value;
                cell.alignment = { wrapText: true, vertical: "top" };

                if (
                    cellValue &&
                    cellValue instanceof Date &&
                    !isNaN(cellValue)
                ) {
                    const excelSerial =
                        (cellValue.getTime() -
                            cellValue.getTimezoneOffset() * 60000) /
                            86400000 +
                        25569;
                    cell.value = excelSerial;

                    // Apply appropriate format based on column type
                    if (dateTimeIndexes.includes(colNumber - 1)) {
                        cell.numFmt = "dd-mm-yyyy hh:mm";
                    } else if (dateOnlyIndexes.includes(colNumber - 1)) {
                        cell.numFmt = "dd-mm-yyyy";
                    } else if (rddIndexes.includes(colNumber - 1)) {
                        // RDD shows time only if not 00:00
                        const isTimeEmpty =
                            cellValue.getHours() === 0 &&
                            cellValue.getMinutes() === 0;
                        cell.numFmt = isTimeEmpty
                            ? "dd-mm-yyyy"
                            : "dd-mm-yyyy hh:mm";
                    }
                }
            });
        });

        worksheet.columns = headers.map((header) => {
            if (header === "Jaix Latest Comment") return { width: 40 };
            return { width: 20 };
        });

        // worksheet.columns = headers.map(() => ({ width: 20 }));

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, "Floor-Report.xlsx");
        });
    };

    const clearAllFilters = () => {
        setColumnFilters([]);
        setSelectedDepots([]);
    };

    // Helper function to check if column is sticky
    const isStickyColumn = (columnId) => {
        return ["actions", "ConsignmentNo", "ConsStatus"].includes(columnId);
    };

    // Calculate sticky left position based on column
    const getStickyLeft = (columnId) => {
        if (columnId === "actions") return 0;
        if (columnId === "ConsignmentNo") return ACTION_COL_WIDTH;
        if (columnId === "ConsStatus")
            return ACTION_COL_WIDTH + CONS_NO_COL_WIDTH;
        return undefined;
    };

    // Chart click handlers for filtering
    const handleFilterByRDD = (category) => {
        const today = moment().format("YYYY-MM-DD");

        setColumnFilters((prevFilters) => {
            // Remove existing RDD filter if any
            const otherFilters = prevFilters.filter((f) => f.id !== "RDD");

            // Add RDD filter based on category
            if (category === "Past Due") {
                return [
                    ...otherFilters,
                    {
                        id: "RDD",
                        value: {
                            dates: new Set(),
                            includeEmpty: false,
                            beforeDate: today,
                        },
                    },
                ];
            } else if (category === "Today") {
                return [
                    ...otherFilters,
                    {
                        id: "RDD",
                        value: { dates: new Set([today]), includeEmpty: false },
                    },
                ];
            } else if (category === "Future") {
                return [
                    ...otherFilters,
                    {
                        id: "RDD",
                        value: {
                            dates: new Set(),
                            includeEmpty: false,
                            afterDate: today,
                        },
                    },
                ];
            }
            return prevFilters;
        });
    };

    const handleFilterByStatus = (status) => {
        setColumnFilters((prevFilters) => {
            // Remove existing ConsStatus filter if any
            const otherFilters = prevFilters.filter(
                (f) => f.id !== "ConsStatus",
            );

            // Add ConsStatus filter
            return [
                ...otherFilters,
                {
                    id: "ConsStatus",
                    value: status,
                },
            ];
        });
    };

    if (loading) {
        return <AnimatedLoading />;
    }

    return (
        <>
            <div className="min-h-full px-8">
                <ToastContainer />

                <div className="flex w-full items-center gap-3 justify-between flex-wrap">
                    <div className="sm:flex-auto mt-6">
                        <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                            Floor Report
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Toggle Charts Button */}
                        <Button
                            onClick={() => setShowCharts(!showCharts)}
                            size="sm"
                            variant="flat"
                            className="bg-gray-700 text-white hover:bg-gray-800"
                        >
                            {showCharts ? "Hide Charts" : "Show Charts"}
                        </Button>

                        <Dropdown closeOnSelect={false}>
                            <DropdownTrigger>
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small w-3" />
                                    }
                                    size="sm"
                                    variant="flat"
                                    className="bg-blue-600 text-white"
                                >
                                    {selectedDepots.length === 0
                                        ? "All Depots"
                                        : selectedDepots.length === 1
                                          ? selectedDepots[0]
                                          : selectedDepots.length ===
                                              availableDepots.length
                                            ? "All Depots"
                                            : `${selectedDepots.length} Depots`}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Depot Selection"
                                closeOnSelect={false}
                                selectedKeys={new Set(selectedDepots)}
                                selectionMode="multiple"
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys);
                                    setSelectedDepots(selected);
                                }}
                            >
                                {availableDepots.map((depot) => (
                                    <DropdownItem key={depot}>
                                        {depot}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        <Button
                            className="bg-dark text-white px-4 py-2"
                            size="sm"
                            onClick={clearAllFilters}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>

                {/* Summary Cards Section */}
                <div
                    className={`mb-6 grid grid-cols-1 md:grid-cols-9 gap-4 transition-all duration-300 ease-in-out overflow-hidden ${
                        showCharts
                            ? "opacity-100 max-h-[500px]"
                            : "opacity-0 max-h-0 mb-0"
                    }`}
                >
                    <TotalScannedCard
                        total={overallSummary.totalScanned}
                        depotBreakdown={overallSummary.depotBreakdown}
                        availableDepots={availableDepots}
                    />
                    <RDDStatusCard
                        data={{
                            rddPast: overallSummary.rddPast,
                            rddToday: overallSummary.rddToday,
                            rddFuture: overallSummary.rddFuture,
                        }}
                        onFilterByRDD={handleFilterByRDD}
                    />
                    <TopStatusesCard
                        data={overallSummary.statusBreakdown}
                        onFilterByStatus={handleFilterByStatus}
                    />
                </div>

                <div className="flex w-full items-center gap-3 justify-between flex-wrap">
                    {/* Reference for the row colors in the table */}
                    <div>
                        <div>
                            <span className="text-sm text-gray-800 mr-4">
                                Row:
                            </span>
                            <span className="inline-block w-3 h-3 bg-red-100 border border-red-300 mr-1"></span>
                            <span className="text-sm text-gray-600 mr-4">
                                Scanned Items after POD
                            </span>
                            <span className="inline-block w-3 h-3 bg-blue-100 border border-blue-300 mr-1"></span>
                            <span className="text-sm text-gray-600">
                                Scanned Items after Departure Receiver
                            </span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-800 mr-4">
                                RDD:
                            </span>
                            <span className="inline-block w-3 h-3 bg-red-300 border-1 border-red-500 mr-1"></span>
                            <span className="text-sm text-gray-600 mr-4">
                                Passed RDD
                            </span>
                            <span className="inline-block w-3 h-3 bg-yellow-100 border border-yellow-300 mr-1"></span>
                            <span className="text-sm text-gray-600">
                                Due Today
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Column Visibility Dropdown */}
                        <Dropdown>
                            <DropdownTrigger className="hidden xl:flex">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small w-3" />
                                    }
                                    size="sm"
                                    variant="flat"
                                    className="bg-dark text-white"
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={
                                    new Set(
                                        table
                                            .getAllColumns()
                                            .filter(
                                                (col) =>
                                                    col.getIsVisible() &&
                                                    col.id !== "actions" &&
                                                    col.id !==
                                                        "comments-actions",
                                            )
                                            .map((col) => col.id),
                                    )
                                }
                                className="max-h-96 overflow-y-scroll "
                                selectionMode="multiple"
                                onSelectionChange={(keys) => {
                                    const selectedKeys = new Set(keys);
                                    const newVisibility = {};
                                    table.getAllColumns().forEach((col) => {
                                        if (
                                            col.id !== "actions" &&
                                            col.id !== "comments-actions"
                                        ) {
                                            newVisibility[col.id] =
                                                selectedKeys.has(col.id);
                                        }
                                    });
                                    setColumnVisibility(newVisibility);
                                }}
                            >
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (col) =>
                                            col.id !== "actions" &&
                                            col.id !== "comments-actions",
                                    )
                                    .map((column) => (
                                        <DropdownItem
                                            key={column.id}
                                            className="capitalize"
                                        >
                                            {capitalize(
                                                column.columnDef.header,
                                            )}
                                        </DropdownItem>
                                    ))}
                            </DropdownMenu>
                        </Dropdown>

                        <Button
                            className="bg-dark text-white px-4 py-2"
                            onClick={exportToExcel}
                            size="sm"
                        >
                            Export
                        </Button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="mt-4 tanstackTable pb-4">
                    <div
                        className="overflow-auto border border-gray-200 rounded-t-lg shadow-sm relative"
                        style={{ maxHeight: "600px" }}
                    >
                        <table
                            className="w-full border-collapse"
                            style={{
                                minWidth: "max-content",
                                tableLayout: "fixed",
                            }}
                        >
                            <thead className="sticky top-0 z-30">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            const isSticky = isStickyColumn(
                                                header.column.id,
                                            );
                                            const stickyLeft = getStickyLeft(
                                                header.column.id,
                                            );
                                            const isLastSticky =
                                                header.column.id ===
                                                "ConsStatus";

                                            return (
                                                <th
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    className={`
                                                        px-3 py-3 text-left text-xs font-semibold text-gray-700
                                                        uppercase tracking-wider bg-gray-100 border-b-2 border-gray-300
                                                        border-r
                                                        ${
                                                            isSticky
                                                                ? "sticky z-40"
                                                                : ""
                                                        }
                                                        ${
                                                            isLastSticky
                                                                ? "border-r border-gray-300"
                                                                : ""
                                                        }
                                                    `}
                                                    style={{
                                                        width: header.getSize(),
                                                        minWidth:
                                                            header.column
                                                                .columnDef
                                                                .minSize,
                                                        left: stickyLeft,
                                                    }}
                                                >
                                                    <div className="flex items-center gap-1 relative pr-2">
                                                        {header.isPlaceholder ? null : (
                                                            <>
                                                                <div
                                                                    className={`flex items-center gap-1 flex-1 truncate ${
                                                                        header.column.getCanSort()
                                                                            ? "cursor-pointer select-none hover:text-gray-900"
                                                                            : ""
                                                                    }`}
                                                                    onClick={header.column.getToggleSortingHandler()}
                                                                    title={
                                                                        header
                                                                            .column
                                                                            .columnDef
                                                                            .header
                                                                    }
                                                                >
                                                                    <span
                                                                        className="truncate"
                                                                        style={{
                                                                            whiteSpace:
                                                                                "break-spaces",
                                                                        }}
                                                                    >
                                                                        {flexRender(
                                                                            header
                                                                                .column
                                                                                .columnDef
                                                                                .header,
                                                                            header.getContext(),
                                                                        )}
                                                                    </span>
                                                                    {header.column.getCanSort() && (
                                                                        <span className="flex-shrink-0">
                                                                            {{
                                                                                asc: (
                                                                                    <ChevronUpIcon className="w-3 h-3" />
                                                                                ),
                                                                                desc: (
                                                                                    <ChevronDownIcon className="w-3 h-3" />
                                                                                ),
                                                                            }[
                                                                                header.column.getIsSorted()
                                                                            ] ?? (
                                                                                <ChevronUpDownIcon className="w-3 h-3 opacity-40" />
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {header.column.getCanFilter() && (
                                                                    <Popover placement="bottom-end">
                                                                        <PopoverTrigger>
                                                                            <button
                                                                                className={`p-1 rounded hover:bg-gray-200 flex-shrink-0 ${
                                                                                    header.column.getFilterValue()
                                                                                        ? "text-blue-600"
                                                                                        : "text-gray-400"
                                                                                }`}
                                                                            >
                                                                                <FunnelIcon className="w-3 h-3" />
                                                                            </button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="p-0 shadow-lg border border-gray-200">
                                                                            <ColumnFilter
                                                                                column={
                                                                                    header.column
                                                                                }
                                                                                table={
                                                                                    table
                                                                                }
                                                                            />
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                    {header.column.getCanResize() && (
                                                        <div
                                                            onMouseDown={header.getResizeHandler()}
                                                            onTouchStart={header.getResizeHandler()}
                                                            className={`resizer ${
                                                                header.column.getIsResizing()
                                                                    ? "isResizing"
                                                                    : ""
                                                            }`}
                                                        />
                                                    )}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="bg-white h-[300px]">
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            No data available
                                        </td>
                                    </tr>
                                ) : (
                                    table
                                        .getRowModel()
                                        .rows.map((row, rowIndex) => {
                                            // Check if row is flagged

                                            const isFlaggedRed =
                                                row.original.Flag == 1;
                                            const isFlaggedBlue =
                                                row.original.Flag == 2;
                                            const isFlaggedYellow =
                                                row.original.Flag == 3;
                                            const rowBg = isFlaggedRed
                                                ? "bg-red-100"
                                                : isFlaggedYellow
                                                  ? "bg-yellow-100"
                                                  : isFlaggedBlue
                                                    ? "bg-blue-100"
                                                    : rowIndex % 2 === 0
                                                      ? "bg-white"
                                                      : "bg-gray-50";
                                            const rowBgColor = isFlaggedRed
                                                ? "#fee2e2"
                                                : isFlaggedYellow
                                                  ? "#fef3c7"
                                                  : isFlaggedBlue
                                                    ? "#dbeafe"
                                                    : rowIndex % 2 === 0
                                                      ? "#ffffff"
                                                      : "#f9fafb";

                                            return (
                                                <tr
                                                    key={row.id}
                                                    className={` transition-colors ${rowBg}`}
                                                >
                                                    {row
                                                        .getVisibleCells()
                                                        .map((cell) => {
                                                            const isSticky =
                                                                isStickyColumn(
                                                                    cell.column
                                                                        .id,
                                                                );
                                                            const stickyLeft =
                                                                getStickyLeft(
                                                                    cell.column
                                                                        .id,
                                                                );
                                                            const isLastSticky =
                                                                cell.column
                                                                    .id ===
                                                                "ConsStatus";

                                                            return (
                                                                <td
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                    className={`
                                                                    px-3 py-2.5 text-sm text-gray-700 border-b border-gray-300
                                                                    border-r
                                                                    overflow-hidden text-ellipsis whitespace-nowrap
                                                                    ${
                                                                        isSticky
                                                                            ? "sticky z-20"
                                                                            : ""
                                                                    }
                                                                    ${
                                                                        isLastSticky
                                                                            ? "border-r border-gray-300"
                                                                            : ""
                                                                    }
                                                                `}
                                                                    style={{
                                                                        width: cell.column.getSize(),
                                                                        minWidth:
                                                                            cell
                                                                                .column
                                                                                .columnDef
                                                                                .minSize,
                                                                        left: stickyLeft,
                                                                        backgroundColor:
                                                                            isSticky
                                                                                ? rowBgColor
                                                                                : undefined,
                                                                    }}
                                                                    title={
                                                                        typeof cell.getValue() ===
                                                                        "string"
                                                                            ? cell.getValue()
                                                                            : ""
                                                                    }
                                                                >
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext(),
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                </tr>
                                            );
                                        })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white border border-t-0 border-gray-200 rounded-b-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                                Page{" "}
                                <strong>
                                    {table.getState().pagination.pageIndex + 1}{" "}
                                    of {table.getPageCount() || 1}
                                </strong>
                            </span>
                            <span className="text-sm text-gray-500">
                                | {table.getFilteredRowModel().rows.length}{" "}
                                total records
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                size="sm"
                                variant="flat"
                                isIconOnly
                                onClick={() => table.setPageIndex(0)}
                                isDisabled={!table.getCanPreviousPage()}
                                className="min-w-8 w-8 h-8"
                            >
                                <ChevronDoubleLeftIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="flat"
                                isIconOnly
                                onClick={() => table.previousPage()}
                                isDisabled={!table.getCanPreviousPage()}
                                className="min-w-8 w-8 h-8"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </Button>

                            {/* Page number buttons */}
                            <div className="flex items-center gap-1 mx-2">
                                {(() => {
                                    const currentPage =
                                        table.getState().pagination.pageIndex;
                                    const totalPages =
                                        table.getPageCount() || 1;
                                    const pages = [];

                                    let startPage = Math.max(
                                        0,
                                        currentPage - 2,
                                    );
                                    let endPage = Math.min(
                                        totalPages - 1,
                                        currentPage + 2,
                                    );

                                    if (endPage - startPage < 4) {
                                        if (startPage === 0) {
                                            endPage = Math.min(
                                                totalPages - 1,
                                                4,
                                            );
                                        } else if (endPage === totalPages - 1) {
                                            startPage = Math.max(
                                                0,
                                                totalPages - 5,
                                            );
                                        }
                                    }

                                    for (let i = startPage; i <= endPage; i++) {
                                        pages.push(
                                            <Button
                                                key={i}
                                                size="sm"
                                                variant={
                                                    currentPage === i
                                                        ? "solid"
                                                        : "flat"
                                                }
                                                className={`min-w-8 w-8 h-8 ${
                                                    currentPage === i
                                                        ? "bg-gray-800 text-white"
                                                        : "bg-gray-100"
                                                }`}
                                                onClick={() =>
                                                    table.setPageIndex(i)
                                                }
                                            >
                                                {i + 1}
                                            </Button>,
                                        );
                                    }

                                    return pages;
                                })()}
                            </div>

                            <Button
                                size="sm"
                                variant="flat"
                                isIconOnly
                                onClick={() => table.nextPage()}
                                isDisabled={!table.getCanNextPage()}
                                className="min-w-8 w-8 h-8"
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="flat"
                                isIconOnly
                                onClick={() =>
                                    table.setPageIndex(table.getPageCount() - 1)
                                }
                                isDisabled={!table.getCanNextPage()}
                                className="min-w-8 w-8 h-8"
                            >
                                <ChevronDoubleRightIcon className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                                Rows per page:
                            </span>
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => {
                                    table.setPageSize(Number(e.target.value));
                                }}
                                className="py-1 text-sm border border-gray-300 roundexd-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[10, 20, 30, 50, 100].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <DetailsModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    detailsData={detailsData}
                />

                <FloorCommentsModal
                    isOpen={isCommentOpen}
                    onOpenChange={onCommentChange}
                    commentsData={detailsData}
                    handleAddComments={handleEditComments}
                />

                <AddFloorCommentsModal
                    isOpen={isAddCommentOpen}
                    onOpenChange={onAddCommentChange}
                    onCommentSaved={handleCommentSaved}
                    commentsData={detailsData}
                />
            </div>
        </>
    );
}
