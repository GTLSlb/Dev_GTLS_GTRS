import { registerAllModules } from "handsontable/registry";
registerAllModules();
import Handsontable from "handsontable";
import React, {
    useState,
    useEffect,
    useMemo,
    useRef,
    useCallback,
    useContext,
} from "react";
import { HotTable } from "@handsontable/react-wrapper";

import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-horizon.css";
import "handsontable/styles/ht-theme-main.min.css";
import moment from "moment";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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
import { ToastContainer } from "react-toastify";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { AlertToast } from "@/permissions";
import swal from "sweetalert";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CustomContext } from "@/CommonContext";
import { handleSessionExpiration } from "@/CommonFunctions";
import CommentsModal from "../ReportsPage/Modals/CommentsModal";

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function FloorReport() {
    const { Token, user, userPermissions, url } = useContext(CustomContext);
    const [loading, setLoading] = useState(true);
    const [floorData, setFloorData] = useState([]);
    const hotTableRef = useRef(null);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const dateFields = [
        "DespatchDateTime",
        "EventDateTime",
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
                            "DD-MM-YYYY hh:mm A",
                            "DD/MM/YYYY hh:mm A",
                            "YYYY-MM-DDTHH:mm:ssZ",
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

    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState(
        new Set([
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
        ])
    );
    const [hiddenColumns, setHiddenColumns] = useState([]);

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

    // Handsontable renderers
    const dateRenderer = useCallback((instance, td, row, col, prop, value) => {
        td.innerText = value ? moment(value).format("DD/MM/YYYY hh:mm A") : "";
        td.classList.add("htLeft");
        return td;
    }, []);

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
                        // Option 1: Get the visual (filtered/sorted) row data
                        const visualRowData = instance.getSourceDataAtRow(row);

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
                type: "date",
                dateFormat: "DD/MM/YYYY",
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
                type: "date",
                dateFormat: "DD/MM/YYYY",
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
                type: "date",
                dateFormat: "DD/MM/YYYY",
                readOnly: true,
                editor: false,
                width: 170,
                headerClassName: "htLeft",
                renderer: dateRenderer,
            },
            {
                data: "OldRdd",
                title: "Original RDD",
                type: "date",
                dateFormat: "DD/MM/YYYY",
                readOnly: true,
                editor: false,
                width: 170,
                headerClassName: "htLeft",
                renderer: dateRenderer,
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
        [dateRenderer, booleanRenderer]
    );

    const colHeaders = useMemo(
        () => hotColumns.map((col) => col.title),
        [hotColumns]
    );

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
    }, [visibleColumns, formattedData]);

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
            const formatted = moment(date).format("DD-MM-YYYY hh:mm A");
            return formatted === "Invalid date" ? "N/A" : formatted;
        };

        return (
            <div className="">
                {/* Details Table - If there are line items */}
                {data.Details && data.Details.length > 0 && (
                    <div className="w-full space-y-4">
                        <Table aria-label="Item details">
                            <TableHeader>
                                <TableColumn className="w-20">
                                    ITEM #
                                </TableColumn>
                                <TableColumn>TIMESTAMP</TableColumn>
                                {/* <TableColumn>FS REFERENCE</TableColumn> */}
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
                                        {/* <TableCell className="text-xs">
                                                {item.FSReference || "N/A"}
                                            </TableCell> */}
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

            <div className="my-4 flex w-full items-center gap-3 justify-end">
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
                        {hotColumns
                            .filter((item) => !item.title == "")
                            .map((column, index) => (
                                <DropdownItem
                                    key={String(index)}
                                    className="capitalize"
                                >
                                    {capitalize(column.title)}
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
                <Button
                    className="bg-dark text-white px-4 py-2"
                    onClick={() => buttonClickCallback()}
                    size="sm"
                >
                    Export
                </Button>
            </div>

            {formattedData && (
                <div id="" className="ht-theme-main mt-4 pb-10">
                    <HotTable
                        ref={hotTableRef}
                        data={formattedData}
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
