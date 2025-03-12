import React, { useState, useEffect, useMemo, useRef } from "react";
import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from "handsontable/registry";
// import "handsontable/styles/handsontable.css";
// import "handsontable/styles/ht-theme-main.css";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-horizon.css";
import "handsontable/styles/ht-theme-main.min.css";
import moment from "moment";
import axios from "axios";
import { Button, Spinner } from "@nextui-org/react";
import { EyeIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

registerAllModules();

import {
    canAddDeliveryReportComment,
    canEditDeliveryReportComment,
    canViewMetcashDeliveryReport,
    canViewWoolworthsDeliveryReport,
    canViewOtherDeliveryReport,
    AlertToast,
} from "@/permissions";
import swal from "sweetalert";

export default function ExcelDeliveryReport({
    url,
    AToken,
    deliveryReportData,
    currentUser,
    userPermission,
    setActiveIndexGTRS,
    setactiveCon,
    fetchDeliveryReport,
    deliveryCommentsOptions,
}) {
    const hotTableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const buttonClickCallback = () => {
        const hot = hotTableRef.current?.hotInstance;
        const exportPlugin = hot?.getPlugin("exportFile");

        exportPlugin?.downloadFile("csv", {
            bom: false,
            columnDelimiter: ",",
            columnHeaders: true,
            exportHiddenColumns: true,
            exportHiddenRows: true,
            fileExtension: "csv",
            filename: "DeliveryReport_[YYYY]-[MM]-[DD]",
            mimeType: "text/csv",
            rowDelimiter: "\r\n",
            rowHeaders: false,
        });
    };

    // Navigation when clicking a consignment number
    const handleClick = (coindex) => {
        setactiveCon(coindex);
        setActiveIndexGTRS(3);
    };

    // States for modals and comment details
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [commentsData, setCommentsData] = useState(null);
    const [consId, setConsId] = useState(null);
    const handleViewComments = (data) => {
        setCommentsData(data?.Comments);
        setConsId(data?.ConsignmentID);
        setIsViewModalOpen(true);
    };
    const handleViewClose = () => {
        setIsViewModalOpen(false);
        setCommentsData(null);
    };

    // Tab (report type) state
    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    // Used to show a spinner in the cell when saving changes
    const [cellLoading, setCellLoading] = useState(null);

    // Compute filtered data sets based on CustomerTypeId
    const [filteredMetcashData, setFilteredMetcashData] = useState(
        deliveryReportData?.filter((item) => item?.CustomerTypeId === 1) || []
    );
    const [filteredWoolworthData, setFilteredWoolworthData] = useState(
        deliveryReportData?.filter((item) => item?.CustomerTypeId === 2) || []
    );
    const [filteredOtherData, setFilteredOtherData] = useState(
        deliveryReportData?.filter((item) => item?.CustomerTypeId === 3) || []
    );

    useEffect(() => {
        if (deliveryReportData?.length > 0) {
            setFilteredMetcashData(
                deliveryReportData.filter((item) => item?.CustomerTypeId === 1)
            );
            setFilteredWoolworthData(
                deliveryReportData.filter((item) => item?.CustomerTypeId === 2)
            );
            setFilteredOtherData(
                deliveryReportData.filter((item) => item?.CustomerTypeId === 3)
            );
        }
    }, [deliveryReportData]);

    // Set the active tab based on permissions
    useEffect(() => {
        if (currentUser) {
            if (canViewMetcashDeliveryReport(currentUser)) {
                setActiveComponentIndex(0);
            } else if (canViewWoolworthsDeliveryReport(currentUser)) {
                setActiveComponentIndex(1);
            } else if (canViewOtherDeliveryReport(currentUser)) {
                setActiveComponentIndex(2);
            }
        }
    }, [currentUser]);
    
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
    const handleButtonClick = (rowData) => {
        // alert(`Action clicked for Consignment: ${rowData.ConsignmentNo}`);
        // Example: Navigate to details page
        navigate("/gtrs/consignment-details", {
            state: { activeCons: rowData.ConsignmentID },
        });
    };

    // 📌 Custom Button Renderer
    const buttonRenderer = (
        instance,
        td,
        row,
        col,
        prop,
        value,
        cellProperties
    ) => {
        td.innerHTML = ""; // Clear existing content

        // Create container div for buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "flex space-x-2 w-[15rem]"; // Tailwind for spacing

        // 🔍 View Button
        const viewButton = document.createElement("button");
        viewButton.className =
            "flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition";
        viewButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25M8.25 9V5.25M15.75 5.25V4.5a2.25 2.25 0 00-4.5 0v.75M8.25 5.25V4.5a2.25 2.25 0 00-4.5 0v.75"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9h-7.5a4.5 4.5 0 00-4.5 4.5v4.5a2.25 2.25 0 002.25 2.25h11.25a2.25 2.25 0 002.25-2.25v-4.5a4.5 4.5 0 00-4.5-4.5z"></path>
        </svg> View`;
        viewButton.onclick = () => {
            const rowData = instance.getSourceDataAtRow(row);
            handleButtonClick(rowData);
        };

        // 🗑️ Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.className =
            "flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded shadow-md hover:bg-red-600 transition";
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
        </svg> Delete`;
        deleteButton.onclick = () => {
            const rowData = instance.getSourceDataAtRow(row);
            alert(`Deleting consignment: ${rowData.ConsignmentNo}`);
            // TODO: Implement actual delete logic
        };

        // Append buttons to container
        buttonContainer.appendChild(viewButton);
        buttonContainer.appendChild(deleteButton);

        // Append container to cell
        td.appendChild(buttonContainer);

        return td;
    };

    const dateRenderer = (
        instance,
        td,
        row,
        col,
        prop,
        value,
        cellProperties
    ) => {
        // If the cell has a value, format it
        if (value) {
            td.innerText = moment(value).format("DD/MM/YYYY"); // Change format here
        } else {
            td.innerText = ""; // If no value, keep it empty
        }

        td.classList.add("htLeft"); // Align text to the right
        return td;
    };
    const hotColumns = [
        {
            data: "ConsignmentNo",
            title: "Consignment Number",
            type: "text",
            readOnly: true,
            editor: false,
        },
        {
            data: "AccountNumber",
            title: "Account Number",
            type: "text",
            readOnly: true,
            editor: false,
        },
        {
            data: "DespatchDateTime",
            title: "Despatch Date",
            type: "date",
            readOnly: true,
            editor: false,
            renderer: dateRenderer,
        },
        {
            data: "SenderName",
            title: "Sender Name",
            type: "text",
            readOnly: true,
            editor: false,
        },
        {
            data: "SenderReference",
            title: "Sender Reference",
            type: "text",
            readOnly: true,
            editor: false,
        },
        {
            data: "SenderState",
            title: "Sender State",
            type: "text",
            readOnly: true,
            editor: false,
        },
        {
            data: "SenderZone",
            title: "Sender Zone",
            type: "text",
            readOnly: true,
            editor: false,
        },
        {
            data: "ReceiverName",
            title: "Receiver Name",
            type: "text",
            readOnly: true,
            editor: false,
        },
        {
            data: "ReceiverReference",
            title: "Receiver Reference",
            type: "text",
            readOnly: true,
            editor: false,
        },
        {
            data: "ReceiverState",
            title: "Receiver State",
            type: "text",
            readOnly: true,
            editor: false,
        },
        {
            data: "ReceiverZone",
            title: "Receiver Zone",
            type: "text",
            readOnly: true,
            editor: false,
        },
        {
            data: "ConsignmentStatus",
            title: "Consignment Status",
            type: "text",
            readOnly: true,
            editor: false,
        },
        {
            data: "DeliveryInstructions",
            title: "Special Instructions",
            type: "text",
            readOnly: true,
            width: 400,
            editor: false,
        },
        {
            data: "DeliveryRequiredDateTime",
            title: "Delivery Required DateTime",
            type: "date",
            readOnly: true,
            editor: false,
            renderer: dateRenderer, // ✅ Applies the custom renderer
        },
        {
            data: "DeliveredDateTime",
            title: "Delivered DateTime",
            type: "date",
            readOnly: true,
            editor: false,
            renderer: dateRenderer,
        },
        {
            data: "Comment",
            title: "Comments",
            type: "autocomplete",
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
            data: "POD",
            title: "POD Avl",
            readOnly: true,
            type: "checkbox",
            editor: false,
        },
    ];

    const [changedRows, setChangedRows] = useState([]); // Stores changed rows

    const handleAfterChange = (changes, source) => {
        if (source === "loadData" || !changes) return;

        setChangedRows((prevChanges) => {
            let updatedChanges = [...prevChanges]; // Clone the existing changes array

            changes.forEach(([row, prop, oldValue, newValue]) => {
                if (newValue !== oldValue) {
                    const hotInstance = hotTableRef.current?.hotInstance;
                    if (!hotInstance) {
                        console.error("❌ Handsontable instance is undefined!");
                        return updatedChanges;
                    }

                    const rowData = hotInstance.getSourceDataAtRow(row);
                    if (!rowData || !rowData.ConsignmentID) {
                        console.warn(
                            "⚠️ Row data is undefined or missing ConsignmentID!",
                            rowData
                        );
                        return updatedChanges;
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
            return updatedChanges; // Ensure we return a new array
        });
    };

    function SaveComments() {
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
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
                setChangedRows([]);
                setIsLoading(false);
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

    useEffect(() => {
        if (hotTableRef.current) {
            setTimeout(() => {
                hotTableRef.current.hotInstance.render();
            }, 100);
        }
    }, []);
    const handleSaveShortcut = (event) => {
        if (event.ctrlKey && event.key === "s") {
            event.preventDefault(); // ✅ Prevent browser's default "Save Page" action
            if (changedRows.length > 0) {
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
            const filtersPlugin = hotInstance.getPlugin("filters");
            filtersPlugin.clearConditions(); // Clears all filter conditions
            filtersPlugin.filter(); // Reapplies filters (removes them)
        }
    };

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
                    {canViewMetcashDeliveryReport(currentUser) && (
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
                    {canViewWoolworthsDeliveryReport(currentUser) && (
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
                    {canViewOtherDeliveryReport(currentUser) && (
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
                <Button
                    className="bg-dark text-white px-4 py-2"
                    onClick={() => SaveComments()}
                    isDisabled={changedRows.length === 0}
                    size="sm"
                >
                    Save
                </Button>
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
                        colHeaders={hotColumns.map((col) => col.title)}
                        columns={hotColumns}
                        fixedColumnsStart={1}
                        width="100%"
                        height={"600px"}
                        manualColumnMove={true}
                        licenseKey="non-commercial-and-evaluation"
                        rowHeaders={true}
                        afterChange={handleAfterChange}
                        autoWrapRow={true}
                        manualColumnResize={true}
                        autoWrapCol={true}
                        filters={true} // ✅ Enable filtering
                        dropdownMenu={true} // ✅ Show dropdown for filtering
                        columnSorting={true} // ✅ Enable sorting
                        // contextMenu={true}
                        settings={{
                            useTheme: null, // ✅ Ensures Handsontable doesn’t depend on a missing theme
                        }}
                    />
                </div>
            )}

            {isViewModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Comments</h2>
                        <div className="mb-4">
                            {commentsData || "No comments"}
                        </div>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={handleViewClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {cellLoading && (
                <div className="absolute inset-0 flex justify-center items-center">
                    <Spinner color="default" size="sm" />
                </div>
            )}
        </div>
    );
}