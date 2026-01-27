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

import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import axios from "axios";
import moment from "moment";
import swal from "sweetalert";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { CustomContext } from "@/CommonContext";
import { ToastContainer } from "react-toastify";
import AnimatedLoading from "@/Components/AnimatedLoading";
import {
    formatNumberWithCommas,
    handleSessionExpiration,
    renderConsDetailsLink,
} from "@/CommonFunctions";
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
    ExclamationTriangleIcon,
    EyeIcon,
    EyeSlashIcon,
} from "@heroicons/react/24/outline";

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
    const { filterVariant } = column.columnDef.meta ?? {};

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
                    <option value="">All</option>
                    {sortedUniqueValues.map((value) => (
                        <option key={value} value={value}>
                            {value}
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

    // If cell value is empty/null
    if (!cellValue) {
        return includeEmpty;
    }

    // If no dates selected but includeEmpty is true, don't show non-empty dates
    if ((!dates || dates.size === 0) && includeEmpty) {
        return false;
    }

    // If dates are selected, check if cell date matches
    if (dates && dates.size > 0) {
        const cellDate = moment(cellValue).format("YYYY-MM-DD");
        return dates.has(cellDate);
    }

    return true;
};

// Column width constants for sticky columns (fixed)
const ACTION_COL_WIDTH = 50;

export default function RunsheetReport() {
    const [loading, setLoading] = useState(true);
    const [runsheetData, setRunsheetData] = useState([]);
    const { Token, user, userPermissions, url } = useContext(CustomContext);

    const [sorting, setSorting] = useState([
        // { id: "EventDateTime", desc: true },
        // { id: "RDD", desc: false },
    ]);

    const [expandedRowId, setExpandedRowId] = useState(null);

    const toggleRowExpansion = (manifestId) => {
        setExpandedRowId((prev) => {
            // If clicking the same row, collapse it
            if (prev === manifestId) {
                return null;
            }
            // Otherwise, expand the new row (collapsing any previously expanded row)
            return manifestId;
        });
    };

    const [columnFilters, setColumnFilters] = useState(() => {
        return [];
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

    const dateFields = ["ManifestDateTime"];

    // Format dates from backend
    const formattedData = useMemo(
        () =>
            runsheetData?.map((row) => {
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
        [runsheetData],
    );

    // Analytics: Toggle visibility
    const [showAnalytics, setShowAnalytics] = useState(true);

    // Analytics: Worst Drivers by POD percentage (only Departed Receiver consignments)
    const driverPodAnalytics = useMemo(() => {
        const driverStats = {};

        runsheetData.forEach((runsheet) => {
            const driverName = runsheet.DriverName;
            if (!driverName) return;

            const consignments = runsheet.Consignments || [];
            if (consignments.length === 0) return;

            consignments.forEach((cons) => {
                // Only count consignments with "Departed Receiver" status
                if (cons.ConsignmentStatus !== "Departed Receiver") return;

                if (!driverStats[driverName]) {
                    driverStats[driverName] = { total: 0, withPod: 0 };
                }

                driverStats[driverName].total++;
                if (cons.POD) {
                    driverStats[driverName].withPod++;
                }
            });
        });

        // Calculate missing POD percentages and sort (descending - highest missing POD rate first)
        const driverList = Object.entries(driverStats)
            .map(([name, stats]) => {
                const missingPod = stats.total - stats.withPod;
                const missingPercentage =
                    stats.total > 0 ? (missingPod / stats.total) * 100 : 0;
                return {
                    name,
                    total: stats.total,
                    withPod: stats.withPod,
                    missingPod,
                    missingPercentage,
                };
            })
            .filter((d) => d.total > 0 && d.missingPod > 0) // Only show drivers with missing PODs
            .sort(
                (a, b) =>
                    b.missingPercentage - a.missingPercentage ||
                    b.missingPod - a.missingPod,
            );

        return driverList;
    }, [runsheetData]);

    // Analytics: Departed consignments with missing POD
    const departedMissingPodAnalytics = useMemo(() => {
        let totalDeparted = 0;
        let departedWithPod = 0;
        let departedMissingPod = 0;
        let totalConsignments = 0;
        const missingPodList = [];

        runsheetData.forEach((runsheet) => {
            const consignments = runsheet.Consignments || [];

            consignments.forEach((cons) => {
                totalConsignments++;
                if (cons.ConsignmentStatus === "Departed Receiver") {
                    totalDeparted++;
                    if (cons.POD) {
                        departedWithPod++;
                    } else {
                        departedMissingPod++;
                        missingPodList.push({
                            consignmentNo: cons.ConsignmentNo,
                            consignmentId: cons.ConsignmentID,
                            driverName: runsheet.DriverName,
                            manifestNo: runsheet.ManifestNo,
                            receiverName: cons.ReceiverName,
                            receiverSuburb: cons.ReceiverSuburb,
                            receiverState: cons.ReceiverState,
                        });
                    }
                }
            });
        });

        return {
            totalConsignments,
            totalDeparted,
            departedWithPod,
            departedMissingPod,
            missingPodPercentage:
                totalDeparted > 0
                    ? (departedMissingPod / totalDeparted) * 100
                    : 0,
            podPercentage:
                totalDeparted > 0 ? (departedWithPod / totalDeparted) * 100 : 0,
            missingPodList,
        };
    }, [runsheetData]);

    // Cell renderers
    const DateCell = ({ value, showTime = true }) => {
        if (!value) return <span className="text-gray-400">-</span>;
        const outputFormat = showTime ? "DD/MM/YYYY hh:mm A" : "DD/MM/YYYY";
        // value is already a Date object from formattedData
        const parsedDate = moment(value);
        return <span>{parsedDate.format(outputFormat)}</span>;
    };

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
                cell: ({ row }) => {
                    const isExpanded =
                        expandedRowId === row.original.ManifestID;
                    return (
                        <button
                            className="p-1 hover:bg-gray-100 rounded transition-colors flex items-center justify-center w-full"
                            title={isExpanded ? "Collapse" : "Expand"}
                            onClick={() =>
                                toggleRowExpansion(row.original.ManifestID)
                            }
                        >
                            {isExpanded ? (
                                <ChevronDownIcon className="w-4 h-4" />
                            ) : (
                                <ChevronRightIcon className="w-4 h-4" />
                            )}
                        </button>
                    );
                },
            },
            {
                accessorKey: "ManifestNo",
                header: "Runsheet No",
                // maxSize: CONS_NO_COL_WIDTH,
                meta: { filterVariant: "text" },
            },
            {
                accessorKey: "ManifestDateTime",
                header: "Runsheet Date",
                meta: { filterVariant: "date" },
                filterFn: dateFilterFn,
                cell: ({ getValue }) => (
                    <DateCell value={getValue()} showTime={false} />
                ),
            },
            {
                accessorKey: "Depot",
                header: "Depot",
                meta: { filterVariant: "select" },
            },
            {
                accessorKey: "DriverName",
                header: "Driver Name",
                // size: ACTION_COL_WIDTH,
                // minSize: ACTION_COL_WIDTH,
                // maxSize: ACTION_COL_WIDTH,
                meta: { filterVariant: "text" },
            },
        ],
        [userPermissions, expandedRowId],
    );

    // Initialize TanStack Table
    const table = useReactTable({
        data: formattedData,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
        defaultColumn: {
            size: 400,
            minSize: 200,
        },
        initialState: {
            pagination: {
                pageSize: 20,
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

    const fetchData = () => {
        setLoading(true);
        axios
            .get(`${url}/Runsheets`, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((res) => {
                setRunsheetData(res.data || []);
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
            .filter((col) => col.id !== "actions");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Runsheet Report");

        // Add headers with additional consignment columns
        const headers = [
            ...visibleColumns.map((col) => col.columnDef.header),
            "Consignments",
            "Consignment Type",
            "POD",
            "Consignment Status",
            "Receiver Name",
            "Receiver State",
            "Receiver Suburb",
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" },
        };
        headerRow.alignment = { horizontal: "center", vertical: "middle" };

        // Define date columns with their format types
        const dateTimeColumns = [""];
        const dateOnlyColumns = ["Runsheet Date"];
        const dateTimeIndexes = headers
            .map((h, i) => (dateTimeColumns.includes(h) ? i : null))
            .filter((i) => i !== null);

        const dateOnlyIndexes = headers
            .map((h, i) => (dateOnlyColumns.includes(h) ? i : null))
            .filter((i) => i !== null);

        // Add data rows
        let currentRow = 2; // Start after header row
        rows.forEach((row) => {
            const consignments = row.original.Consignments || [];
            const maxRows = Math.max(1, consignments.length);
            const startRow = currentRow;

            // Create rows for this manifest (one row per consignment, or one empty row if no consignments)
            for (let i = 0; i < maxRows; i++) {
                const rowData = visibleColumns.map((col) => {
                    // Only show manifest data in the first row
                    if (i === 0) {
                        const value = row.getValue(col.id);
                        return value;
                    }
                    return "";
                });

                // Add consignment data if it exists
                const consignment = consignments[i];
                if (consignment) {
                    rowData.push(consignment.ConsignmentNo);
                    rowData.push(
                        consignment.TypeID === 1
                            ? "Pickup"
                            : consignment.TypeID === 2
                              ? "Delivery"
                              : "",
                    );
                    rowData.push(consignment.TypeID === 2 ? (consignment.POD ? "TRUE" : "FALSE") : "");
                    rowData.push(consignment.ConsignmentStatus);
                    rowData.push(consignment.ReceiverName);
                    rowData.push(consignment.ReceiverState);
                    rowData.push(consignment.ReceiverSuburb);
                } else {
                    rowData.push(""); // Consignments
                    rowData.push(""); // Consignment Type
                    rowData.push(""); // POD
                    rowData.push(""); // Consignment Status
                    rowData.push(""); // Receiver Name
                    rowData.push(""); // Receiver State
                    rowData.push(""); // Receiver Suburb
                }

                const excelRow = worksheet.addRow(rowData);

                // Style the row
                excelRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    const cellValue = cell.value;
                    cell.alignment = {
                        wrapText: true,
                        vertical: "middle",
                        horizontal: "left",
                    };

                    // Bold and background for manifest columns
                    if (colNumber <= visibleColumns.length) {
                        cell.font = { bold: true };
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FFF9FAFB" },
                        };
                    }

                    // Handle date formatting
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
                        }
                    }

                    // Color code POD column
                    if (colNumber === headers.length && cellValue) {
                        if (cellValue === "TRUE") {
                            cell.font = {
                                color: { argb: "FF22C55E" },
                                bold: true,
                            };
                        } else if (cellValue === "FALSE") {
                            cell.font = {
                                color: { argb: "FFEF4444" },
                                bold: true,
                            };
                        }
                    }
                });

                currentRow++;
            }

            const thinBorder = {
                style: "thin",
                color: { argb: "FF000000" },
            };

            // Apply borders to all cells
            for (let rowNum = startRow; rowNum < currentRow; rowNum++) {
                for (let colNum = 1; colNum <= headers.length; colNum++) {
                    const cell = worksheet.getCell(rowNum, colNum);

                    const isTopRow = rowNum === startRow;
                    const isBottomRow = rowNum === currentRow - 1;
                    const isLeftCol = colNum === 1;
                    const isRightCol = colNum === headers.length;

                    // Build border object - thin borders between cells, thick on outer edges
                    const cellBorder = {
                        top: isTopRow ? thinBorder : thinBorder,
                        bottom: isBottomRow ? thinBorder : thinBorder,
                        left: isLeftCol ? thinBorder : thinBorder,
                        right: isRightCol ? thinBorder : thinBorder,
                    };

                    // Apply border
                    cell.border = cellBorder;
                }
            }

            // Merge cells for manifest columns AFTER applying borders
            if (maxRows > 1) {
                for (let col = 1; col <= visibleColumns.length; col++) {
                    worksheet.mergeCells(startRow, col, currentRow - 1, col);
                }
            }
        });

        // Set column widths
        worksheet.columns = headers.map((header) => {
            if (header === "Manifest No") return { width: 15 };
            if (header === "Runsheet Date") return { width: 20 };
            if (header === "Depot") return { width: 10 };
            if (header === "Driver Name") return { width: 30 };
            if (header === "Consignments") return { width: 20 };
            if (header === "Consignment Type") return { width: 18 };
            if (header === "POD") return { width: 12 };
            if (header === "Consignment Status") return { width: 30 };
            if (header === "Receiver Name") return { width: 30 };
            if (header === "Receiver State") return { width: 15 };
            if (header === "Receiver Suburb") return { width: 20 };
            return { width: 20 };
        });

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, "Runsheet-Report.xlsx");
        });
    };

    const clearAllFilters = () => {
        setColumnFilters([]);
    };

    if (loading) {
        return <AnimatedLoading />;
    }

    return (
        <>
            <div className="min-h-full px-8">
                <ToastContainer />

                <div className="my-4 flex w-full items-center gap-3 justify-end flex-wrap">
                    <div className="sm:flex-auto mt-6">
                        <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                            Runsheet Report
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            className={`px-4 py-2 flex items-center gap-2 ${
                                showAnalytics
                                    ? "bg-gray-200 text-gray-700"
                                    : "bg-dark text-white"
                            }`}
                            size="sm"
                            onClick={() => setShowAnalytics(!showAnalytics)}
                        >
                            {showAnalytics ? (
                                <EyeSlashIcon className="w-4 h-4" />
                            ) : (
                                <EyeIcon className="w-4 h-4" />
                            )}
                            {showAnalytics
                                ? "Hide Analytics"
                                : "Show Analytics"}
                        </Button>
                        <Button
                            className="bg-dark text-white px-4 py-2"
                            size="sm"
                            onClick={clearAllFilters}
                        >
                            Clear Filters
                        </Button>
                        <Button
                            className="bg-dark text-white px-4 py-2"
                            onClick={exportToExcel}
                            size="sm"
                        >
                            Export
                        </Button>
                    </div>
                </div>

                {/* Analytics Section */}
                {showAnalytics && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Worst Drivers by POD Percentage */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                                    <h3 className="text-sm font-semibold text-gray-700">
                                        Drivers with outstanding PODs for
                                        Departed Receiver Consignments
                                    </h3>
                                </div>
                            </div>
                            <div className="p-4">
                                {driverPodAnalytics.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        No driver data available
                                    </p>
                                ) : (
                                    <div className="max-h-[280px] overflow-y-auto pr-2">
                                        <div className="space-y-3">
                                            {driverPodAnalytics.map(
                                                (driver, index) => (
                                                    <div
                                                        key={driver.name}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <div
                                                            className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold bg-gray-100 text-gray-500`}
                                                        >
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-sm font-medium text-gray-700 truncate">
                                                                    {
                                                                        driver.name
                                                                    }
                                                                </span>
                                                                <span
                                                                    className={`text-sm font-semibold ${
                                                                        driver.missingPercentage >=
                                                                        50
                                                                            ? "text-red-600"
                                                                            : "text-green-500"
                                                                    }`}
                                                                >
                                                                    {driver.missingPercentage.toFixed(
                                                                        1,
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full transition-all duration-300 ${
                                                                        driver.missingPercentage >=
                                                                        50
                                                                            ? "bg-red-500"
                                                                            : "bg-green-500"
                                                                    }`}
                                                                    style={{
                                                                        width: `${driver.missingPercentage}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {
                                                                    driver.missingPod
                                                                }{" "}
                                                                / {driver.total}{" "}
                                                                consignments
                                                                with missing POD
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Departed Consignments Missing POD */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Departed Consignments - POD Status
                                </h3>
                            </div>
                            <div className="p-4">
                                {departedMissingPodAnalytics.totalDeparted ===
                                0 ? (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        No departed consignments found
                                    </p>
                                ) : (
                                    <>
                                        {/* Summary Stats */}
                                        <div className="grid grid-cols-4 gap-4 mb-4">
                                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                                <div className="text-2xl font-bold text-yellow-600">
                                                    {formatNumberWithCommas(
                                                        departedMissingPodAnalytics.totalConsignments,
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Total Consignments
                                                </div>
                                            </div>
                                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {formatNumberWithCommas(
                                                        departedMissingPodAnalytics.totalDeparted,
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Total Departed Receiver
                                                </div>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {formatNumberWithCommas(
                                                        departedMissingPodAnalytics.departedWithPod,
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Departed Receiver With POD (
                                                    {departedMissingPodAnalytics.podPercentage.toFixed(
                                                        1,
                                                    )}
                                                    %)
                                                </div>
                                            </div>
                                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {
                                                        departedMissingPodAnalytics.departedMissingPod
                                                    }
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Departed Receiver With
                                                    Missing POD (
                                                    {departedMissingPodAnalytics.missingPodPercentage.toFixed(
                                                        1,
                                                    )}
                                                    %)
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                <span>POD Completion Rate</span>
                                                <span>
                                                    {departedMissingPodAnalytics.podPercentage.toFixed(
                                                        1,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="bg-green-500 h-3 transition-all duration-300"
                                                    style={{
                                                        width: `${departedMissingPodAnalytics.podPercentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Missing POD List (scrollable) */}
                                        {departedMissingPodAnalytics.departedMissingPod >
                                            0 && (
                                            <div>
                                                <div className="text-xs font-medium text-gray-700 mb-2">
                                                    Consignments Missing POD:
                                                </div>
                                                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                                                    {departedMissingPodAnalytics.missingPodList.map(
                                                        (item, index) => (
                                                            <div
                                                                key={
                                                                    item.consignmentId
                                                                }
                                                                className={`px-3 py-2 text-xs flex items-center justify-between ${
                                                                    index %
                                                                        2 ===
                                                                    0
                                                                        ? "bg-white"
                                                                        : "bg-gray-50"
                                                                }`}
                                                            >
                                                                <div>
                                                                    <span className="font-medium text-blue-600">
                                                                        {renderConsDetailsLink(
                                                                            userPermissions,
                                                                            item.consignmentNo,
                                                                            item.consignmentId,
                                                                        )}
                                                                    </span>
                                                                    <span className="text-gray-500 ml-2">
                                                                        (
                                                                        {
                                                                            item.manifestNo
                                                                        }
                                                                        ), (
                                                                        {
                                                                            item.driverName
                                                                        }
                                                                        )
                                                                    </span>
                                                                </div>
                                                                <span className="text-gray-500 truncate max-w-[150px]">
                                                                    {
                                                                        item.receiverSuburb
                                                                    }
                                                                    ,{" "}
                                                                    {
                                                                        item.receiverState
                                                                    }
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Container */}
                <div className="mt-4 tanstackTable pb-4">
                    <div
                        className="overflow-auto border border-gray-200 rounded-t-lg shadow-sm relative"
                        style={{ maxHeight: "600px" }}
                    >
                        <table
                            className="w-full border-collapse"
                            style={{
                                tableLayout: "auto",
                            }}
                        >
                            <thead className="sticky top-0 z-30">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <th
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    className={`
                                                        px-3 py-3 text-left text-xs font-semibold text-gray-700
                                                        uppercase tracking-wider bg-gray-100 border-b-2 border-gray-300
                                                        border-r
                                                    `}
                                                    style={{
                                                        width: header.getSize(),
                                                        minWidth:
                                                            header.column
                                                                .columnDef
                                                                .minSize,
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
                                            const rowBg =
                                                rowIndex % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50";

                                            const isExpanded =
                                                expandedRowId ===
                                                row.original.ManifestID;
                                            const consignments =
                                                row.original.Consignments || [];

                                            return (
                                                <>
                                                    <tr
                                                        key={row.id}
                                                        className={`hover:bg-blue-50 transition-colors ${rowBg}`}
                                                    >
                                                        {row
                                                            .getVisibleCells()
                                                            .map((cell) => {
                                                                return (
                                                                    <td
                                                                        key={
                                                                            cell.id
                                                                        }
                                                                        className={`
                                                                        px-3 py-2.5 text-sm text-gray-700 border-b border-gray-300
                                                                        border-r
                                                                        overflow-hidden text-ellipsis whitespace-nowrap

                                                                    `}
                                                                        style={{
                                                                            width: cell.column.getSize(),
                                                                            minWidth:
                                                                                cell
                                                                                    .column
                                                                                    .columnDef
                                                                                    .minSize,
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
                                                    {isExpanded &&
                                                    consignments.length > 0 ? (
                                                        <tr
                                                            key={`${row.id}-expanded`}
                                                        >
                                                            <td
                                                                colSpan={
                                                                    columns.length
                                                                }
                                                                className={`  px-6 py-4 bg-gray-50 border-b border-gray-300`}
                                                            >
                                                                <div
                                                                    className={`py-2 ml-[${ACTION_COL_WIDTH}px]`}
                                                                    style={{
                                                                        marginLeft: `${ACTION_COL_WIDTH}px`,
                                                                    }}
                                                                >
                                                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                                                        Consignments
                                                                        (
                                                                        {
                                                                            consignments.length
                                                                        }
                                                                        )
                                                                    </h4>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                        {consignments.map(
                                                                            (
                                                                                consignment,
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        consignment.ConsignmentID
                                                                                    }
                                                                                    className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
                                                                                >
                                                                                    <div className="flex items-center justify-between">
                                                                                        <div className="text-sm font-medium text-blue-500 cursor-pointer">
                                                                                            {renderConsDetailsLink(
                                                                                                userPermissions,
                                                                                                consignment.ConsignmentNo,
                                                                                                consignment.ConsignmentID,
                                                                                            )}
                                                                                            <p className="text-gray-500 text-xs">
                                                                                                {
                                                                                                    consignment.ConsignmentStatus
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className="flex flex-row gap-2">
                                                                                            {consignment.TypeID === 2
                                                                                                 && (
                                                                                                <span
                                                                                                    className={`px-2 py-1 text-xs font-semibold rounded ${
                                                                                                        consignment.POD
                                                                                                            ? "bg-green-100 text-green-800"
                                                                                                            : "bg-red-100 text-red-800"
                                                                                                    }`}
                                                                                                >
                                                                                                    {consignment.POD
                                                                                                        ? "POD"
                                                                                                        : "No POD"}
                                                                                                </span>
                                                                                            )}

                                                                                            {consignment.TypeID ===
                                                                                                1 ||
                                                                                            consignment.TypeID ===
                                                                                                2 ? (
                                                                                                <span
                                                                                                    className={`px-2 py-1 text-xs font-semibold text-center rounded ${
                                                                                                        consignment.TypeID ==
                                                                                                        1
                                                                                                            ? "bg-blue-100 text-blue-500"
                                                                                                            : "bg-yellow-100 text-yellow-700"
                                                                                                    }`}
                                                                                                >
                                                                                                    {consignment.TypeID ==
                                                                                                    1
                                                                                                        ? "Pickup"
                                                                                                        : "Delivery"}
                                                                                                </span>
                                                                                            ) : null}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="mt-2 text-xs text-gray-600">
                                                                                        <p className="font-medium">
                                                                                            {
                                                                                                consignment.ReceiverName
                                                                                            }
                                                                                        </p>
                                                                                        <p>
                                                                                            {
                                                                                                consignment.ReceiverSuburb
                                                                                            }

                                                                                            ,{" "}
                                                                                            {
                                                                                                consignment.ReceiverState
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        isExpanded && (
                                                            <tr
                                                                key={`${row.id}-expanded`}
                                                            >
                                                                <td
                                                                    colSpan={
                                                                        columns.length
                                                                    }
                                                                    className={` ml-[${ACTION_COL_WIDTH}px] px-6 py-10 bg-gray-50 border-b border-gray-300`}
                                                                >
                                                                    <div
                                                                        className={`py-5 ml-[${ACTION_COL_WIDTH}px]`}
                                                                        style={{
                                                                            marginLeft: `${ACTION_COL_WIDTH}px`,
                                                                        }}
                                                                    >
                                                                        No
                                                                        consignments
                                                                        available.
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </>
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
                                className="py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>
        </>
    );
}
