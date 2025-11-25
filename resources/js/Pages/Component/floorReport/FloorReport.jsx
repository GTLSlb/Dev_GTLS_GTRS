registerAllModules();
import React, {
    useState,
    useEffect,
    useMemo,
    useRef,
    useCallback,
    useContext,
} from "react";

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import axios from "axios";
import moment from "moment";
import swal from "sweetalert";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Handsontable from "handsontable";
import { canViewDetails } from "@/permissions";
import { useNavigate } from "react-router-dom";
import { CustomContext } from "@/CommonContext";
import { ToastContainer } from "react-toastify";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-horizon.css";
import "handsontable/styles/ht-theme-main.min.css";
import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from "handsontable/registry";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { handleSessionExpiration } from "@/CommonFunctions";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Date range filter options
const DATE_RANGE_OPTIONS = {
    TODAY: "today",
    YESTERDAY: "yesterday",
    LAST_WEEK: "lastWeek",
    LAST_MONTH: "lastMonth",
    LAST_2_MONTHS: "last2Months",
    LAST_3_MONTHS: "last3Months",
    LAST_6_MONTHS: "last6Months",
    LAST_YEAR: "lastYear",
};

export default function FloorReport() {
    const navigate = useNavigate();
    const hotTableRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [floorData, setFloorData] = useState([]);
    const [dateRange, setDateRange] = useState(DATE_RANGE_OPTIONS.TODAY);
    const { Token, user, userPermissions, url } = useContext(CustomContext);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const dateFields = [
        "DespatchDateTime",
        "EventDateTime",
        "RDD",
        "OldRdd",
        "NewRdd",
    ];

    // Columns to hide by default
    const defaultHiddenColumnTitles = [
        "Despatch Date",
        "Sender Name",
        "Sender State",
        "Sender Suburb",
        "Sender Zone",
        "Receiver Suburb",
        "Receiver Zone",
        "Original RDD",
        "Timeslot Required",
        "Timeslot Booked",
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
                            "YYYY-MM-DD HH:mm:ss",
                            "DD-MM-YYYY hh:mm A",
                            "DD/MM/YYYY hh:mm A",
                            "YYYY-MM-DD",
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
        [floorData]
    );

    // Initialize visible columns with defaults
    const initializeVisibleColumns = useCallback((columns) => {
        const visibleSet = new Set();
        columns.forEach((col, index) => {
            if (!defaultHiddenColumnTitles.includes(col.title)) {
                visibleSet.add(String(index));
            }
        });
        return visibleSet;
    }, []);

    const [hiddenColumns, setHiddenColumns] = useState([]);

    // Handsontable renderers
    const dateRenderer = useCallback((instance, td, row, col, prop, value) => {
        // Display date with time
        td.innerText = value ? moment(value).format("DD/MM/YYYY hh:mm A") : "";
        td.classList.add("htLeft");
        // Store the date-only value for filtering
        td.setAttribute('data-filter-value', value ? moment(value).format("DD/MM/YYYY") : "");
        return td;
    }, []);

    const noTimeDateRenderer = useCallback(
        (instance, td, row, col, prop, value) => {
            td.innerText = value ? moment(value).format("DD/MM/YYYY") : "";
            td.classList.add("htLeft");
            return td;
        },
        []
    );

    const rddDateRenderer = useCallback(
        (instance, td, row, col, prop, value) => {
            // Display date without time to avoid filter issues
            const formatted = value
                ? moment(value).format("DD/MM/YYYY")
                : "";
            td.innerText = formatted;
            td.classList.add("htLeft");

            // Highlight RDD based on date comparison
            if (value) {
                const today = moment().startOf("day");
                const rddDate = moment(value).startOf("day");

                if (rddDate.isBefore(today)) {
                    // RDD has passed - highlight in red
                    td.style.backgroundColor = "#fee2e2"; // light red
                    td.style.color = "#991b1b"; // dark red
                    td.style.fontWeight = "600";
                } else if (rddDate.isSame(today)) {
                    // RDD is today - highlight in yellow
                    td.style.backgroundColor = "#fef3c7"; // light yellow
                    td.style.color = "#92400e"; // dark yellow/brown
                    td.style.fontWeight = "600";
                }
            }

            return td;
        },
        []
    );

    const booleanRenderer = useCallback(
        (instance, td, row, col, prop, value) => {
            Handsontable.dom.empty(td);
            td.classList.add("htCenter");

            if (value === "YES") {
                const badge = document.createElement("span");
                badge.className =
                    "inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800";
                badge.textContent = "Yes";
                td.appendChild(badge);
            } else if (value === "NO") {
                const badge = document.createElement("span");
                badge.className =
                    "inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800";
                badge.textContent = "No";
                td.appendChild(badge);
            }

            return td;
        },
        []
    );

    const timeslotbookedRenderer = useCallback(
        (instance, td, row, col, prop, value) => {
            Handsontable.dom.empty(td);
            td.classList.add("htCenter");

            const visualRowData = instance.getSourceDataAtRow(row);
            if (visualRowData.TimeslotRequired !== "YES") {
                return td;
            }

            if (value === "YES") {
                const badge = document.createElement("span");
                badge.className =
                    "inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800";
                badge.textContent = "Yes";
                td.appendChild(badge);
            } else if (value === "NO") {
                const badge = document.createElement("span");
                badge.className =
                    "inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800";
                badge.textContent = "No";
                td.appendChild(badge);
            }

            return td;
        },
        []
    );

    const [detailsData, setDetailsData] = useState(null);

    const handleViewDetails = (data) => {
        setDetailsData(data);
        onOpen();
    };

    const handleConsignmentClick = (consignmentData) => {
        const url = route('consignment-details', { id: consignmentData.ConsignmentID });
        window.open(url, '_blank');
    };

    // Handsontable columns configuration
    const hotColumns = useMemo(
        () => [
            {
                data: "ConsignmentID",
                title: "",
                renderer: (instance, td, row, col, prop, value) => {
                    Handsontable.dom.empty(td);

                    const button = document.createElement("button");
                    button.className = `
                        p-1
                        hover:bg-gray-100
                        rounded
                        transition-colors
                        flex
                        items-center
                        justify-center
                        w-full
                    `;
                    button.title = "View Details";

                    // Right arrow SVG icon
                    const svg = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "svg"
                    );
                    svg.setAttribute("viewBox", "0 0 24 24");
                    svg.setAttribute("fill", "currentColor");
                    svg.setAttribute("class", "w-4 h-4");
                    svg.setAttribute("aria-hidden", "true");

                    const path = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "path"
                    );
                    path.setAttribute("fill-rule", "evenodd");
                    path.setAttribute(
                        "d",
                        "M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                    );
                    path.setAttribute("clip-rule", "evenodd");

                    svg.appendChild(path);
                    button.appendChild(svg);

                    button.addEventListener("click", () => {
                        // Convert visual row index to physical row index
                        const physicalRow = instance.toPhysicalRow(row);
                        // Get the full source data object (includes Details array)
                        const visualRowData =
                            instance.getSourceDataAtRow(physicalRow);
                        handleViewDetails(visualRowData);
                    });

                    td.classList.add("content-center");
                    td.style.textAlign = "center";
                    td.appendChild(button);

                    return td;
                },
                className: "htCenter",
                readOnly: true,
                editor: false,
                width: 50,
                headerClassName: "htCenter",
            },
            {
                data: "ConsignmentNo",
                title: "Cons No",
                type: "text",
                readOnly: true,
                editor: false,
                width: 120,
                headerClassName: "htLeft",
                renderer: (instance, td, row, col, prop, value) => {
                    Handsontable.dom.empty(td);
                    td.classList.add("htLeft");

                    if (canViewDetails(userPermissions)) {
                        const link = document.createElement("a");
                        link.href = "#";
                        link.style.color = "#3b82f6";
                        link.style.textDecoration = "underline";
                        link.style.fontWeight = "600";
                        link.style.cursor = "pointer";
                        link.textContent = value || "";

                        link.addEventListener("click", (e) => {
                            e.preventDefault();
                            const physicalRow = instance.toPhysicalRow(row);
                            const rowData =
                                instance.getSourceDataAtRow(physicalRow);

                            // Call function to handle navigation
                            handleConsignmentClick(rowData);
                        });

                        td.appendChild(link);
                    } else {
                        td.innerText = value || "";
                        td.style.fontWeight = "600";
                    }

                    return td;
                },
            },
            {
                data: "ChargeTo",
                title: "Account Name",
                type: "text",
                readOnly: true,
                editor: false,
                width: 170,
                headerClassName: "htLeft",
            },
            {
                data: "DespatchDateTime",
                title: "Despatch Date",
                type: "text",
                readOnly: true,
                editor: false,
                width: 170,
                headerClassName: "htLeft",
                renderer: dateRenderer,
            },
            {
                data: "SenderName",
                title: "Sender Name",
                type: "text",
                readOnly: true,
                editor: false,
                width: 150,
                headerClassName: "htLeft",
            },
            {
                data: "SenderState",
                title: "Sender State",
                type: "text",
                readOnly: true,
                editor: false,
                width: 120,
                headerClassName: "htLeft",
            },
            {
                data: "SenderSuburb",
                title: "Sender Suburb",
                type: "text",
                readOnly: true,
                editor: false,
                width: 130,
                headerClassName: "htLeft",
            },
            {
                data: "SenderZone",
                title: "Sender Zone",
                type: "text",
                readOnly: true,
                editor: false,
                width: 110,
                headerClassName: "htLeft",
            },
            {
                data: "ReceiverName",
                title: "Receiver Name",
                type: "text",
                readOnly: true,
                editor: false,
                width: 150,
                headerClassName: "htLeft",
            },
            {
                data: "ReceiverState",
                title: "Receiver State",
                type: "text",
                readOnly: true,
                editor: false,
                width: 130,
                headerClassName: "htLeft",
            },
            {
                data: "ReceiverSuburb",
                title: "Receiver Suburb",
                type: "text",
                readOnly: true,
                editor: false,
                width: 130,
                headerClassName: "htLeft",
            },
            {
                data: "ReceiverZone",
                title: "Receiver Zone",
                type: "text",
                readOnly: true,
                editor: false,
                width: 110,
                headerClassName: "htLeft",
            },
            {
                data: "ConsStatus",
                title: "Cons Status",
                type: "text",
                readOnly: true,
                editor: false,
                width: 120,
                headerClassName: "htLeft",
            },
            {
                data: "EventDateTime",
                title: "Floor Scan Date",
                type: "text",
                readOnly: true,
                editor: false,
                width: 170,
                headerClassName: "htLeft",
                renderer: dateRenderer,
            },
            {
                data: "OriginPalletSpaces",
                title: "Cnote Pallet Space",
                type: "numeric",
                readOnly: true,
                editor: false,
                width: 150,
                headerClassName: "htLeft",
            },
            {
                data: "ActualScanned",
                title: "Scanned Events",
                type: "numeric",
                readOnly: true,
                editor: false,
                width: 150,
                headerClassName: "htLeft",
            },
            {
                data: "RDD",
                title: "RDD",
                type: "text",
                readOnly: true,
                editor: false,
                width: 170,
                headerClassName: "htLeft",
                renderer: rddDateRenderer,
            },
            {
                data: "OldRdd",
                title: "Original RDD",
                type: "text",
                readOnly: true,
                editor: false,
                width: 170,
                headerClassName: "htLeft",
                renderer: noTimeDateRenderer,
            },
            {
                data: "TotalDays",
                title: "Total Days",
                type: "numeric",
                readOnly: true,
                editor: false,
                width: 110,
                headerClassName: "htLeft",
            },
            {
                data: "TimeslotRequired",
                title: "Timeslot Required",
                type: "text",
                readOnly: true,
                editor: false,
                width: 130,
                headerClassName: "htLeft",
                renderer: booleanRenderer,
            },
            {
                data: "TimeslotBooked",
                title: "Timeslot Booked",
                type: "text",
                readOnly: true,
                editor: false,
                width: 130,
                headerClassName: "htLeft",
                renderer: timeslotbookedRenderer,
            },
            {
                data: "DockLocation",
                title: "Dock Location",
                type: "text",
                readOnly: true,
                editor: false,
                width: 130,
                headerClassName: "htLeft",
            },
            {
                data: "Depot",
                title: "Depot",
                type: "text",
                readOnly: true,
                editor: false,
                width: 110,
                headerClassName: "htLeft",
            },
        ],
        [dateRenderer, booleanRenderer, rddDateRenderer, noTimeDateRenderer]
    );

    // Initialize visible columns on mount
    const [visibleColumns, setVisibleColumns] = useState(new Set());

    useEffect(() => {
        setVisibleColumns(initializeVisibleColumns(hotColumns));
    }, [hotColumns, initializeVisibleColumns]);

    const colHeaders = useMemo(
        () => hotColumns.map((col) => col.title),
        [hotColumns]
    );

    // Calculate date range filter
    const getDateRange = useCallback(() => {
        const today = moment().startOf("day");
        let startDate, endDate;

        switch (dateRange) {
            case DATE_RANGE_OPTIONS.TODAY:
                startDate = today.clone();
                endDate = today.clone().endOf("day");
                break;
            case DATE_RANGE_OPTIONS.YESTERDAY:
                startDate = today.clone().subtract(1, "day");
                endDate = startDate.clone().endOf("day");
                break;
            case DATE_RANGE_OPTIONS.LAST_WEEK:
                startDate = today.clone().subtract(7, "days");
                endDate = today.clone().endOf("day");
                break;
            case DATE_RANGE_OPTIONS.LAST_MONTH:
                startDate = today.clone().subtract(1, "month");
                endDate = today.clone().endOf("day");
                break;
            case DATE_RANGE_OPTIONS.LAST_2_MONTHS:
                startDate = today.clone().subtract(2, "months");
                endDate = today.clone().endOf("day");
                break;
            case DATE_RANGE_OPTIONS.LAST_3_MONTHS:
                startDate = today.clone().subtract(3, "months");
                endDate = today.clone().endOf("day");
                break;
            case DATE_RANGE_OPTIONS.LAST_6_MONTHS:
                startDate = today.clone().subtract(6, "months");
                endDate = today.clone().endOf("day");
                break;
            case DATE_RANGE_OPTIONS.LAST_YEAR:
                startDate = today.clone().subtract(1, "year");
                endDate = today.clone().endOf("day");
                break;
            default:
                startDate = today.clone();
                endDate = today.clone().endOf("day");
        }

        return { startDate, endDate };
    }, [dateRange]);

    // Filter data based on date range
    const filteredData = useMemo(() => {
        const { startDate, endDate } = getDateRange();

        return formattedData.filter((row) => {
            if (row.EventDateTime) {
                const eventDate = moment(row.EventDateTime);
                return eventDate.isBetween(startDate, endDate, null, "[]");
            }
            return false;
        });
    }, [formattedData, dateRange, getDateRange]);

    // Fetch floor report data
    useEffect(() => {
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
    }, [userPermissions, Token, url, user.UserId]);

    // Export to Excel
    const buttonClickCallback = async () => {
        const hot = hotTableRef.current?.hotInstance;
        if (!hot) return;

        const exportData = hot.getData();
        const allColumns = hot.getColHeader();

        // Filter out empty column headers and get their indices
        const validColumnIndices = allColumns
            .map((col, index) => (col && col.trim() !== "" ? index : null))
            .filter((index) => index !== null);

        // Get only valid columns
        const selectedColumns = validColumnIndices.map(
            (index) => allColumns[index]
        );

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Floor Report");

        const headerRow = worksheet.addRow(selectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" },
        };
        headerRow.alignment = { horizontal: "center", vertical: "middle" };

        const dateColumnIndexes = selectedColumns
            .map((col, index) =>
                [
                    "Despatch Date",
                    "Floor Scan Date",
                    "RDD",
                    "Original RDD",
                ].includes(col)
                    ? index
                    : null
            )
            .filter((index) => index !== null);

        exportData.forEach((rowData) => {
            // Extract only valid columns from row data
            const filteredRowData = validColumnIndices.map(
                (index) => rowData[index]
            );
            const row = worksheet.addRow(filteredRowData);

            let maxHeight = 15;
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const cellValue = cell.value;

                cell.alignment = { wrapText: true, vertical: "top" };

                if (dateColumnIndexes.includes(colNumber - 1) && cellValue) {
                    const date = new Date(cellValue);
                    if (!isNaN(date)) {
                        const excelSerial =
                            (date.getTime() -
                                date.getTimezoneOffset() * 60000) /
                                86400000 +
                            25569;
                        cell.value = excelSerial;
                        cell.numFmt = "dd-mm-yyyy hh:mm";
                    }
                }

                maxHeight = Math.max(
                    maxHeight,
                    (cellValue?.toString() || "").split("\n").length * 25
                );
            });

            row.height = maxHeight;
        });

        worksheet.columns = selectedColumns.map(() => ({ width: 20 }));

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, "Floor-Report.xlsx");
        });
    };

    // Column visibility management
    const applyHiddenColumns = () => {
        const hotInstance = hotTableRef.current?.hotInstance;
        if (!hotInstance) return;

        const totalColumns = hotInstance.countCols();
        const visibleIndexes = Array.from(visibleColumns).map(Number);

        const newColumnsToHide = [];
        for (let i = 0; i < totalColumns; i++) {
            if (!visibleIndexes.includes(i)) {
                newColumnsToHide.push(i);
            }
        }

        const isSame =
            JSON.stringify(hiddenColumns) === JSON.stringify(newColumnsToHide);

        if (!isSame) {
            setHiddenColumns(newColumnsToHide);

            const hiddenPlugin = hotInstance.getPlugin("hiddenColumns");
            hiddenPlugin.hideColumns(newColumnsToHide);
            hiddenPlugin.showColumns(visibleIndexes);
            hotInstance.render();
        }
    };

    useEffect(() => {
        applyHiddenColumns();
    }, [visibleColumns, filteredData]);

    const clearAllFilters = () => {
        const hotInstance = hotTableRef.current?.hotInstance;
        if (hotInstance) {
            const filtersPlugin = hotInstance?.getPlugin("filters");
            filtersPlugin.clearConditions();
            filtersPlugin.filter();
        }
    };

    const renderRowDetails = ({ data, rowIndex }) => {
        const formatDate = (date) => {
            const formatted = moment(date).format("DD-MM-YYYY HH:mm");
            return formatted === "Invalid date" ? "N/A" : formatted;
        };

        return (
            <div className="">
                {data.Details && data.Details.length > 0 && (
                    <div className="w-full space-y-4">
                        <Table aria-label="Item details">
                            <TableHeader>
                                <TableColumn className="w-20">
                                    ITEM #
                                </TableColumn>
                                <TableColumn>TIMESTAMP</TableColumn>
                                <TableColumn>DEPOT</TableColumn>
                                <TableColumn>DOCK</TableColumn>
                                <TableColumn>CREATED BY</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {data.Details.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="text-xs font-medium">
                                            {item.ItemNumber || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {formatDate(item.FSEventTimestamp)}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {item.Depot || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {item.DockLocation || "-"}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {item.CreatedBy || "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return <AnimatedLoading />;
    }

    return (
        <div className="min-h-full px-8">
            <ToastContainer />
            <div className="sm:flex-auto mt-6">
                <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                    Floor Report
                </h1>
            </div>

            <div className="my-4 flex w-full items-center gap-3 justify-between flex-wrap">
                {/* Date Range Filter */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Date Range:
                    </label>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={DATE_RANGE_OPTIONS.TODAY}>Today</option>
                        <option value={DATE_RANGE_OPTIONS.YESTERDAY}>
                            Yesterday
                        </option>
                        <option value={DATE_RANGE_OPTIONS.LAST_WEEK}>
                            Last 7 Days
                        </option>
                        <option value={DATE_RANGE_OPTIONS.LAST_MONTH}>
                            Last Month
                        </option>
                        <option value={DATE_RANGE_OPTIONS.LAST_2_MONTHS}>
                            Last 2 Months
                        </option>
                        <option value={DATE_RANGE_OPTIONS.LAST_3_MONTHS}>
                            Last 3 Months
                        </option>
                        <option value={DATE_RANGE_OPTIONS.LAST_6_MONTHS}>
                            Last 6 Months
                        </option>
                        <option value={DATE_RANGE_OPTIONS.LAST_YEAR}>
                            Last Year
                        </option>
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    <Dropdown>
                        <DropdownTrigger className="hidden xl:flex">
                            <Button
                                endContent={
                                    <ChevronDownIcon className="text-small w-3" />
                                }
                                size="sm"
                                variant="flat"
                                className="bg-gray-800 text-white"
                            >
                                Columns
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={visibleColumns}
                            selectionMode="multiple"
                            onSelectionChange={(keys) => {
                                setVisibleColumns(new Set(keys));
                            }}
                        >
                            {hotColumns.map(
                                (column, index) =>
                                    column.title !== "" && (
                                        <DropdownItem
                                            key={String(index)}
                                            className="capitalize"
                                        >
                                            {capitalize(column.title)}
                                        </DropdownItem>
                                    )
                            )}
                        </DropdownMenu>
                    </Dropdown>
                    <Button
                        className="bg-dark text-white px-4 py-2"
                        size="sm"
                        onClick={clearAllFilters}
                    >
                        Clear Filters
                    </Button>
                    <Button
                        className="bg-dark text-white px-4 py-2"
                        onClick={() => buttonClickCallback()}
                        size="sm"
                    >
                        Export
                    </Button>
                </div>
            </div>

            {filteredData && (
                <div id="" className="ht-theme-main mt-4 pb-10">
                    <HotTable
                        ref={hotTableRef}
                        data={filteredData}
                        colHeaders={colHeaders}
                        columns={hotColumns}
                        fixedColumnsStart={3}
                        width="100%"
                        height={"600px"}
                        contextMenu={[
                            "hidden_columns_show",
                            "hidden_columns_hide",
                        ]}
                        hiddenColumns={{
                            columns: hiddenColumns,
                            indicators: true,
                        }}
                        manualColumnMove={true}
                        licenseKey="non-commercial-and-evaluation"
                        rowHeaders={false}
                        autoWrapRow={true}
                        manualColumnResize={true}
                        autoWrapCol={true}
                        filters={true}
                        dropdownMenu={{
                            items: {
                                filter_by_condition: {},
                                filter_by_value: {},
                                filter_action_bar: {},
                            },
                        }}
                        columnSorting={true}
                        settings={{
                            useTheme: null,
                        }}
                    />
                </div>
            )}

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="3xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="gap-1">
                                Details for {detailsData?.ConsignmentNo}
                            </ModalHeader>
                            <ModalBody>
                                {detailsData &&
                                    renderRowDetails({
                                        data: detailsData,
                                        rowIndex: detailsData.ConsignmentID,
                                    })}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}