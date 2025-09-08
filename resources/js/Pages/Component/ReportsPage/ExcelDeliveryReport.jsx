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

// import "handsontable/styles/handsontable.css";
// import "handsontable/styles/ht-theme-main.css";
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
    Spinner,
    useDisclosure,
} from "@heroui/react";
import { ToastContainer } from "react-toastify";
import {
    canViewMetcashDeliveryReport,
    canViewWoolworthsDeliveryReport,
    canViewOtherDeliveryReport,
    AlertToast,
    canApproveCommentExcelDeliveryReport,
    canEditCommentExcelDeliveryReport,
    canViewCommentsExcelDeliveryReport,
} from "@/permissions";
import swal from "sweetalert";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import CommentsModal from "./Modals/CommentsModal";
import { CustomContext } from "@/CommonContext";
import { handleSessionExpiration } from "@/CommonFunctions";

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ExcelDeliveryReport({
    deliveryReportData,
    commentsCheck,
    fetchDeliveryReport,
    deliveryCommentsOptions,
}) {
    const { Token, user, userPermissions, url } = useContext(CustomContext);

    const dateFields = [
        "DeliveryRequiredDateTime",
        "DespatchDateTime",
        "DeliveredDateTime",
    ];
    // useEffect(() => {
    const formattedData = deliveryReportData?.map((row) => {
        const newRow = { ...row };

        dateFields.forEach((field) => {
            if (row[field]) {
                const parsed = moment(row[field], [
                    "DD-MM-YYYY hh:mm A",
                    "DD/MM/YYYY hh:mm A",
                    "YYYY-MM-DDTHH:mm:ssZ",
                    "YYYY-MM-DD",
                ]);

                newRow[field] = parsed.isValid() ? parsed.toDate() : null;
            } else {
                newRow[field] = null;
            }
        });

        return newRow;
    });
    // }, []);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const hotTableRef = useRef(null);
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(["0", "1", "2", "7", "9", "10", "13", "15", "16", "17", "18"])
    );
    const [hiddenColumns, setHiddenColumns] = useState([
        3, 4, 5, 6, 8, 11, 12, 13,
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const buttonClickCallback = async () => {
        const hot = hotTableRef.current?.hotInstance;
        if (!hot) return;

        const exportData = hot.getData();
        const selectedColumns = hot.getColHeader();

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Delivery Report");

        // Add header row with styling
        const headerRow = worksheet.addRow(selectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" },
        };
        headerRow.alignment = { horizontal: "center", vertical: "middle" };

        // Function to calculate row height for multiline content
        const calculateRowHeight = (cellValue) => {
            if (!cellValue) return 20;
            const lines = cellValue.split("\n")?.length;
            return Math.max(20, lines * 25);
        };

        // Identify the index of the date column
        const dateColumnIndexes = selectedColumns
            .map((col, index) =>
                [
                    "Despatch Date",
                    "Delivery Required DateTime",
                    "Delivered DateTime",
                ].includes(col)
                    ? index
                    : null
            )
            .filter((index) => index !== null);

        // Add data rows
        const approvedCommentsIndex =
            selectedColumns.indexOf("Approved Comments");
        const approvedCommentIndex =
            selectedColumns.indexOf("Approved Comment");

        exportData.forEach((rowData) => {
            if (approvedCommentsIndex !== -1) {
                const commentsArray = rowData[approvedCommentsIndex];
                if (Array.isArray(commentsArray)) {
                    const formattedComments = commentsArray.map(
                        (commentObj) => {
                            const comment = commentObj.Comment || "";
                            const addedAt = commentObj.AddedAt
                                ? new Date(commentObj.AddedAt).toLocaleString(
                                      "en-GB",
                                      {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      }
                                  )
                                : "Unknown time";

                            return `${addedAt}: ${comment}`;
                        }
                    );

                    rowData[approvedCommentsIndex] =
                        formattedComments.join("\n");
                }
            }
            if (approvedCommentIndex !== -1) {
                const commentsArray = rowData[approvedCommentsIndex];
                if (typeof commentsArray === "string") {
                    rowData[approvedCommentIndex] = commentsArray;
                } else if (
                    Array.isArray(commentsArray) &&
                    commentsArray.length > 0
                ) {
                    const lastCommentObj = commentsArray[0];
                    const comment = lastCommentObj.Comment || "";
                    const addedAt = lastCommentObj.AddedAt
                        ? new Date(lastCommentObj.AddedAt).toLocaleString(
                              "en-GB",
                              {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                              }
                          )
                        : "Unknown time";

                    rowData[approvedCommentIndex] = `${addedAt}: ${comment}`;
                } else {
                    rowData[approvedCommentIndex] = ""; // No comments
                }
            }
            const row = worksheet.addRow(rowData);

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
                        cell.value = excelSerial; // Excel serial
                        cell.numFmt = "dd-mm-yyyy hh:mm"; // proper Excel format
                    }
                }

                maxHeight = Math.max(
                    maxHeight,
                    calculateRowHeight(cellValue?.toString() || "")
                );
            });

            row.height = maxHeight;
        });

        // Set column widths dynamically
        worksheet.columns = selectedColumns.map(() => ({ width: 20 }));

        // Generate and save the Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(
                blob,
                activeComponentIndex == 0
                    ? "Unilever-Metcash-Reports.xlsx"
                    : activeComponentIndex == 1
                    ? "Unilever-Woolworths-Reports.xlsx"
                    : activeComponentIndex == 2
                    ? "Unilever-Other-Reports.xlsx"
                    : null
            );
        });
    };
    // States for modals and comment details
    const [commentsData, setCommentsData] = useState(null);
    const handleViewComments = (data) => {
        setCommentsData(data);
        onOpen();
    };

    // Tab (report type) state
    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    // Used to show a spinner in the cell when saving changes
    const [cellLoading] = useState(null);

    // Compute filtered data sets based on CustomerTypeId
    const [filteredMetcashData, setFilteredMetcashData] = useState(
        formattedData?.filter((item) => item?.CustomerTypeId === 1) || []
    );
    const [filteredWoolworthData, setFilteredWoolworthData] = useState(
        formattedData?.filter((item) => item?.CustomerTypeId === 2) || []
    );
    const [filteredOtherData, setFilteredOtherData] = useState(
        formattedData?.filter((item) => item?.CustomerTypeId === 3) || []
    );

    useEffect(() => {
        if (deliveryReportData?.length > 0) {
            setFilteredMetcashData(
                formattedData.filter((item) => item?.CustomerTypeId === 1)
            );
            setFilteredWoolworthData(
                formattedData.filter((item) => item?.CustomerTypeId === 2)
            );
            setFilteredOtherData(
                formattedData.filter((item) => item?.CustomerTypeId === 3)
            );
        }
    }, [deliveryReportData]);

    // Set the active tab based on permissions
    useEffect(() => {
        if (userPermissions) {
            if (canViewMetcashDeliveryReport(userPermissions)) {
                setActiveComponentIndex(0);
            } else if (canViewWoolworthsDeliveryReport(userPermissions)) {
                setActiveComponentIndex(1);
            } else if (canViewOtherDeliveryReport(userPermissions)) {
                setActiveComponentIndex(2);
            }
        }
    }, [userPermissions]);

    useEffect(() => {
        clearAllFilters();
    }, [activeComponentIndex]);

    // Determine the current data set to show
    const tableData = useMemo(() => {
        if (activeComponentIndex === 0) return filteredMetcashData;
        if (activeComponentIndex === 1) return filteredWoolworthData;
        if (activeComponentIndex === 2) return filteredOtherData;
        return [];
    }, [
        activeComponentIndex,
        filteredMetcashData,
        filteredWoolworthData,
        filteredOtherData,
    ]);

    /* ---------------------------
     Handsontable Renderers
  --------------------------- */

    /* ---------------------------
     Handsontable Columns Setup
  --------------------------- */
    const buttonRenderer = useCallback(
        (instance, td, row, col, prop, value, cellProperties) => {
            Handsontable.dom.empty(td);

            const visualRowData = instance.getDataAtRow(row);
            const approvedComments =
                visualRowData?.[instance.propToCol("ApprovedComments")];

            if (
                Array.isArray(approvedComments) &&
                approvedComments.length > 0 &&
                canViewCommentsExcelDeliveryReport(userPermissions)
            ) {
                const button = document.createElement("button");
                button.textContent = "View Comments";

                button.className = `
                px-4 py-1
                text-sm
                bg-gray-800
                text-white
                rounded
                hover:bg-gray-500
                focus:outline-none
                transition
            `;

                button.addEventListener("click", () => {
                    // You might need to pass a full row object if needed
                    handleViewComments(visualRowData);
                });

                td.style.textAlign = "center";
                td.appendChild(button);
            }

            return td;
        },
        []
    );

    const dateRenderer = useCallback((instance, td, row, col, prop, value) => {
        td.innerText = value ? moment(value).format("DD/MM/YYYY hh:mm A") : "";
        td.classList.add("htLeft");
        return td;
    }, []);

    const hotColumns = useMemo(
        () => [
            {
                data: "ConsignmentNo",
                title: "Cons. No.",
                type: "text",
                readOnly: true,
                editor: false,
                width: 120,
                headerClassName: "htLeft",
            },
            {
                data: "AccountNumber",
                title: "Acc. No.",
                type: "text",
                readOnly: true,
                headerTooltips: true,
                editor: false,
                width: 110,
                headerClassName: "htLeft",
            },
            {
                data: "DespatchDateTime",
                title: "Despatch Date",
                type: "date",
                readOnly: true,
                editor: false,
                width: 110,
                headerClassName: "htLeft",
                renderer: dateRenderer,
            },
            {
                data: "SenderName",
                title: "Sender Name",
                type: "text",
                readOnly: true,
                editor: false,
                width: 110,
                headerClassName: "htLeft",
            },
            {
                data: "SenderReference",
                title: "Sender Reference",
                type: "text",
                readOnly: true,
                editor: false,
                headerClassName: "htLeft",
                width: 110,
            },
            {
                data: "SenderState",
                title: "Sender State",
                type: "text",
                readOnly: true,
                headerClassName: "htLeft",
                editor: false,
                width: 110,
            },
            {
                data: "SenderZone",
                title: "Sender Zone",
                type: "text",
                readOnly: true,
                editor: false,
                headerClassName: "htLeft",
                width: 50,
            },
            {
                data: "ReceiverName",
                title: "Rec. Name",
                type: "text",
                readOnly: true,
                headerClassName: "htLeft",
                editor: false,
                width: 110,
            },
            {
                data: "ReceiverReference",
                title: "Rec. Reference",
                type: "text",
                readOnly: true,
                headerClassName: "htLeft",
                editor: false,
                width: 110,
            },
            {
                data: "ReceiverState",
                title: "Rec. State",
                type: "text",
                headerClassName: "htLeft",
                readOnly: true,
                editor: false,
                width: 110,
            },
            {
                data: "ReceiverZone",
                title: "Rec. Zone",
                type: "text",
                readOnly: true,
                headerClassName: "htLeft",
                editor: false,
                width: 110,
            },
            {
                data: "ConsignmentStatus",
                title: "Cons. Status",
                type: "text",
                readOnly: true,
                headerClassName: "htLeft",
                editor: false,
                width: 100,
            },
            {
                data: "DeliveryInstructions",
                title: "Special Instructions",
                type: "text",
                readOnly: true,
                headerClassName: "htLeft",
                editor: false,
                width: 150,
            },
            {
                data: "DeliveryRequiredDateTime",
                title: "Delivery Required DateTime",
                type: "date", // must stay as 'date'
                dateFormat: "DD/MM/YYYY", // for filters and sorting
                correctFormat: true, // try to auto-convert strings (optional)
                readOnly: true,
                editor: false,
                headerClassName: "htLeft",
                width: 150,
                renderer: dateRenderer,
            },
            {
                data: "DeliveredDateTime",
                title: "Delivered Date Time",
                type: "date",
                readOnly: true,
                editor: false,
                headerClassName: "htLeft",
                width: 170,
                renderer: dateRenderer,
            },
            {
                data: "POD",
                title: "POD",
                headerClassName: "htLeft",
                readOnly: true,
                type: "checkbox",
                editor: false,
                width: 110,
            },
            {
                data: "Comment",
                title: "Comments",
                headerClassName: "htLeft",
                type: "autocomplete",
                readOnly: canEditCommentExcelDeliveryReport(userPermissions)
                    ? false
                    : true,
                source:
                    deliveryCommentsOptions?.length > 0
                        ? deliveryCommentsOptions
                              .filter((item) => item.CommentStatus === 1)
                              .map((item) => item.Comment)
                        : ["Loading..."],
                strict: false,
                wordWrap: true, // ✅ Enable text wrapping
                width: 400, // Set a reasonable column width
            },
            {
                data: "ApprovedComments",
                title: "Approved Comment",
                headerClassName: "htLeft",
                renderer: (
                    instance,
                    td,
                    row,
                    col,
                    prop,
                    value,
                    cellProperties
                ) => {
                    const lastValue =
                        Array.isArray(value) && value.length > 0
                            ? value[0].Comment
                            : ""; // handle empty or non-array
                    td.textContent = lastValue;
                    return td;
                },
                editor: false,
                readOnly: true,
                width: 130, // Set a reasonable column width
            },
            {
                data: "ApprovedComments",
                title: "Approved Comments",
                headerClassName: "htLeft",
                renderer: buttonRenderer,
                editor: false,
                readOnly: true,
                width: 130, // Set a reasonable column width
            },
        ],
        [deliveryCommentsOptions]
    );

    const [changedRows, setChangedRows] = useState([]); // Stores changed rows

    const handleAfterChange = (changes, source) => {
        if (source === "loadData" || !changes) return;

        setChangedRows((prevChanges) => {
            let updatedChanges = [...prevChanges]; // Clone the existing changes array
            const hotInstance = hotTableRef.current?.hotInstance;

            if (!hotInstance) {
                console.error("❌ Handsontable instance is undefined!");
                return updatedChanges;
            }
            changes.forEach(([visualRow, prop, oldValue, newValue]) => {
                if (newValue !== oldValue) {
                    const physicalRow = hotInstance.toPhysicalRow(visualRow);
                    const rowData = hotInstance.getSourceDataAtRow(physicalRow);

                    if (!rowData || !rowData.ConsignmentID) {
                        console.warn(
                            "⚠️ Row data is undefined or missing ConsignmentID!",
                            rowData
                        );
                        return;
                    }

                    const existingIndex = updatedChanges.findIndex(
                        (item) => item.ConsignmentID === rowData.ConsignmentID
                    );

                    if (existingIndex > -1) {
                        updatedChanges[existingIndex] = {
                            ...updatedChanges[existingIndex],
                            Comment: newValue,
                        };
                    } else {
                        updatedChanges.push({
                            ...rowData,
                            Comment: newValue,
                        });
                    }
                }
            });

            return updatedChanges;
        });
    };

    function SaveComments() {
        const hotInstance = hotTableRef.current?.hotInstance;
        hotInstance?.deselectCell(); // 👈 clears selection
        setIsLoading(true);
        const inputValues = changedRows?.map((item) => ({
            DeliveryCommentId: item.DeliveryCommentId
                ? item.DeliveryCommentId
                : null,
            ConsId: item.ConsignmentID, // Rename ConsignmentID to ConsId
            Comment: item.Comment, // Keep the Comment field as is
        }));
        axios
            .post(`${url}Add/Delivery/Single/Comment`, inputValues, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then(() => {
                setChangedRows([]);
                setIsLoading(false);
                fetchDeliveryReport();
                AlertToast("Saved successfully", 1);
            })
            .catch((err) => {
                console.log(err);
                AlertToast("Something went wrong", 2);

                if (err.response && err.response.status === 401) {
                    // Handle 401 error using SweetAlert
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        type: "success",
                        icon: "info",
                        confirmButtonText: "OK",
                    }).then(async function () {
                        await handleSessionExpiration();
                    });
                } else {
                    // Handle other errors
                    console.log(err);
                    setIsLoading(false);
                }
            });
    }

    function CheckComments() {
        setIsLoading(true);
        axios
            .post(`${url}Approve/Delivery/Comments`, [], {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then(() => {
                setChangedRows([]);
                setIsLoading(false);
                fetchDeliveryReport();
                AlertToast("Saved successfully", 1);
            })
            .catch((err) => {
                AlertToast("Something went wrong", 2);

                if (err.response && err.response.status === 401) {
                    // Handle 401 error using SweetAlert
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        type: "success",
                        icon: "info",
                        confirmButtonText: "OK",
                    }).then(async function () {
                        await handleSessionExpiration();
                    });
                } else {
                    // Handle other errors
                    console.log(err);
                    setIsLoading(false);
                }
            });
    }
    const handleSaveShortcut = (event) => {
        if (event.ctrlKey && event.key === "s") {
            event.preventDefault(); // ✅ Prevent browser's default "Save Page" action
            if (
                changedRows.length > 0 &&
                !isLoading &&
                canEditCommentExcelDeliveryReport(userPermissions)
            ) {
                SaveComments(); // ✅ Call your save function here
            }
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleSaveShortcut);

        return () => {
            document.removeEventListener("keydown", handleSaveShortcut);
        };
    }, [changedRows]);

    const clearAllFilters = () => {
        const hotInstance = hotTableRef.current?.hotInstance;
        if (hotInstance) {
            const filtersPlugin = hotInstance?.getPlugin("filters");
            filtersPlugin.clearConditions(); // Clears all filter conditions
            filtersPlugin.filter(); // Reapplies filters (removes them)
        }
    };

    const applyDefaultFilter = () => {
        const hotInstance = hotTableRef.current?.hotInstance;
        const filters = hotInstance.getPlugin("filters");
        filters.addCondition(15, "eq", [false], "conjunction"); // Assuming POD is column index 2
        filters.filter();
    };

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

        // 🧠 Avoid updating state and rerendering if nothing actually changed
        if (!isSame) {
            setHiddenColumns(newColumnsToHide);

            const hiddenPlugin = hotInstance.getPlugin("hiddenColumns");
            hiddenPlugin.hideColumns(newColumnsToHide);
            hiddenPlugin.showColumns(visibleIndexes);
            hotInstance.render(); // only render when something changed
        }
    };

    useEffect(() => {
        applyHiddenColumns();
    }, [visibleColumns, tableData]);

    useEffect(() => {
        applyDefaultFilter();
    }, [tableData]);

    const colHeaders = useMemo(
        () => hotColumns.map((col) => col.title),
        [hotColumns]
    );

    return (
        <div className="min-h-full px-8">
            <ToastContainer />
            <div className="sm:flex-auto mt-6">
                <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                    Unilever Delivery Report
                </h1>
            </div>
            <div className="w-full flex gap-4 items-center mt-4">
                <ul className="flex space-x-0">
                    {canViewMetcashDeliveryReport(userPermissions) && (
                        <li
                            className={`cursor-pointer ${
                                activeComponentIndex === 0
                                    ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                    : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                            }`}
                            onClick={() => setActiveComponentIndex(0)}
                        >
                            <div className="px-2">Metcash</div>
                        </li>
                    )}
                    {canViewWoolworthsDeliveryReport(userPermissions) && (
                        <li
                            className={`cursor-pointer ${
                                activeComponentIndex === 1
                                    ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                    : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                            }`}
                            onClick={() => setActiveComponentIndex(1)}
                        >
                            <div className="px-2">Woolworths</div>
                        </li>
                    )}
                    {canViewOtherDeliveryReport(userPermissions) && (
                        <li
                            className={`cursor-pointer ${
                                activeComponentIndex === 2
                                    ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                    : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                            }`}
                            onClick={() => setActiveComponentIndex(2)}
                        >
                            <div className="px-2">Other</div>
                        </li>
                    )}
                </ul>
            </div>
            <div className="my-1 flex w-full items-center gap-3 justify-end">
                {canEditCommentExcelDeliveryReport(userPermissions) && (
                    <Button
                        className="bg-dark text-white px-4 py-2"
                        onClick={() => SaveComments()}
                        isDisabled={changedRows?.length === 0 || isLoading}
                        size="sm"
                    >
                        Save
                    </Button>
                )}

                {canApproveCommentExcelDeliveryReport(userPermissions) && (
                    <Button
                        className="bg-dark text-white px-4 py-2"
                        onClick={() => CheckComments()}
                        isDisabled={isLoading || !commentsCheck}
                        size="sm"
                    >
                        Check
                    </Button>
                )}

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
                        {hotColumns.map((column, index) => (
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
                    Clear
                </Button>
                <Button
                    className="bg-dark text-white px-4 py-2"
                    onClick={() => buttonClickCallback()}
                    size="sm"
                >
                    Export
                </Button>
            </div>
            {tableData && deliveryCommentsOptions && (
                <div id="" className="ht-theme-main mt-4 pb-10">
                    <HotTable
                        ref={hotTableRef}
                        data={tableData}
                        colHeaders={colHeaders}
                        columns={hotColumns}
                        fixedColumnsStart={1}
                        width="100%"
                        height={"600px"}
                        contextMenu={[
                            "hidden_columns_show",
                            "hidden_columns_hide",
                        ]}
                        hiddenColumns={{
                            // columns: [3, 4, 5, 6, 8, 11, 12, 13],
                            columns: hiddenColumns,
                            indicators: true,
                        }}
                        afterInit={() => {
                            // Apply default filter for POD column
                            setTimeout(() => applyDefaultFilter(), 10);
                        }}
                        manualColumnMove={true}
                        licenseKey="non-commercial-and-evaluation"
                        rowHeaders={true}
                        afterChange={handleAfterChange}
                        autoWrapRow={true}
                        manualColumnResize={true}
                        autoWrapCol={true}
                        filters={true} // ✅ Enable filtering
                        dropdownMenu={{
                            items: {
                                filter_by_condition: {}, // ✅ Keep filters
                                filter_by_value: {},
                                filter_action_bar: {},
                                separator1: "---------",
                            },
                        }} // ✅ Show dropdown for filtering
                        columnSorting={true} // ✅ Enable sorting
                        // contextMenu={true}
                        settings={{
                            useTheme: null, // ✅ Ensures Handsontable doesn’t depend on a missing theme
                        }}
                    />
                </div>
            )}

            {/* {isViewModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Comments</h2>
                        <div className="mb-4">
                            {commentsData?.map((comment, index) => (
                                <div key={index}>
                                    <p className="text-gray-800">
                                        {comment?.Comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={handleViewClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )} */}
            <CommentsModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                commentsData={commentsData}
            />
            {cellLoading && (
                <div className="absolute inset-0 flex justify-center items-center">
                    <Spinner color="default" size="sm" />
                </div>
            )}
        </div>
    );
}
