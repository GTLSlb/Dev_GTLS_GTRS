import { HotTable } from "@handsontable/react-wrapper";
import { HyperFormula } from 'hyperformula';
import { registerAllModules } from "handsontable/registry";
import { useEffect, useMemo, useRef, useState } from "react";
// import "handsontable/styles/handsontable.css";
// import "handsontable/styles/ht-theme-main.css";
import { Button, Spinner } from "@nextui-org/react";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-horizon.css";
import "handsontable/styles/ht-theme-main.min.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

registerAllModules();

import {
    AlertToast,
    canViewMetcashDeliveryReport,
    canViewOtherDeliveryReport,
    canViewWoolworthsDeliveryReport,
} from "@/permissions";
import swal from "sweetalert";

const tableData = [
    {
        Date: "2023-01-03",
        Rego: "CM98UA",
        DayOrNightShift: "DAY",
        TrailerType: "RORO",
        ProductType: "LIQUID",
        OBDNumber: "68777856",
        PickUpPoint: "N Rocks",
        PalletsCollected: 26,
        VehicleCapacity: 26,
        LoadWeightT: 18.09,
        VehicleCapacityT: 22.50,
        LoadWeightUtilisation: "80%",
        TimeIn: "13:30",
        TimeOut: "16:50",
        CollectionTurnaroundTime: "3:20",
        NorthRockAllowTime45Min: "2:35",
        DemurrageCharges1: 0,
        Reason: "",
        DeliveryPoint: "LFX Ingleburn",
        UnloadTurnaroundTime: "0:30",
        IngleburnAllowTime30Min: "0:00",
        DemurrageCharges2: 0,
        TravelTimeBetweenSites: "1:10",
        TotalChargeAmount: 0,
        Manifest: "Manifest001",
        ProofOfDemurrage: "Proof001",
        Invoiced: "Yes",
        KPIWeek: "2023 - Week 02",
        KPIMonth: "2023-Jan",
        CPP: 100,
        RevisedUtilisation: "100%",
    },
    {
        Date: "2023-01-04",
        Rego: "CM99UB",
        DayOrNightShift: "NIGHT",
        TrailerType: "RORO",
        ProductType: "SOLID",
        OBDNumber: "68777857",
        PickUpPoint: "S Rocks",
        PalletsCollected: 28,
        VehicleCapacity: 30,
        LoadWeightT: 20.00,
        VehicleCapacityT: 24.00,
        LoadWeightUtilisation: "83%",
        TimeIn: "14:30",
        TimeOut: "17:00",
        CollectionTurnaroundTime: "3:00",
        NorthRockAllowTime45Min: "2:45",
        DemurrageCharges1: 10,
        Reason: "Delay",
        DeliveryPoint: "LFX Minto",
        UnloadTurnaroundTime: "0:45",
        IngleburnAllowTime30Min: "0:00",
        DemurrageCharges2: 15,
        TravelTimeBetweenSites: "1:15",
        TotalChargeAmount: 25.00,
        Manifest: "Manifest002",
        ProofOfDemurrage: "Proof002",
        Invoiced: "No",
        KPIWeek: "2023 - Week 02",
        KPIMonth: "2023-Jan",
        CPP: 120,
        RevisedUtilisation: "95%",
    }
];


export default function Utilization({
    url,
    AToken,
    deliveryReportData,
    currentUser,
    userPermission,
    deliveryCommentsOptions,
}) {
    const navigate = useNavigate();
    const hotTableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const buttonClickCallback = async () => {
        const hot = hotTableRef.current?.hotInstance;
        if (!hot) return;

        const exportData = hot.getData();
        const selectedColumns = hot.getColHeader();

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Utilization Report");

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
            const lines = cellValue.split("\n").length;
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
        exportData.forEach((rowData) => {
            const row = worksheet.addRow(rowData);

            let maxHeight = 15; // Default row height
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const cellValue = cell.value?.toString() || "";

                // Apply text wrapping
                cell.alignment = { wrapText: true, vertical: "top" };

                // Format date fields
                if (dateColumnIndexes.includes(colNumber - 1)) {
                    const parsedDate = new Date(cellValue);
                    if (!isNaN(parsedDate)) {
                        cell.value = parsedDate;
                        cell.numFmt = "dd-mm-yyy hh:mm"; // Excel date format
                    }
                }

                // Calculate row height based on content
                maxHeight = Math.max(maxHeight, calculateRowHeight(cellValue));
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
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [commentsData, setCommentsData] = useState(null);
    const handleViewClose = () => {
        setIsViewModalOpen(false);
        setCommentsData(null);
    };

    // Tab (report type) state
    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    // Used to show a spinner in the cell when saving changes
    const [cellLoading, setCellLoading] = useState(null);

    const handleButtonClick = (rowData) => {
        // alert(`Action clicked for Consignment: ${rowData.ConsignmentNo}`);
        // Example: Navigate to details page
        navigate("/gtrs/consignment-details", {
            state: { activeCons: rowData.ConsignmentID },
        });
    };

    // 📌 Custom Button Renderer
    // const buttonRenderer = (
    //     instance,
    //     td,
    //     row,
    //     col,
    //     prop,
    //     value,
    //     cellProperties
    // ) => {
    //     td.innerHTML = ""; // Clear existing content

    //     // Create container div for buttons
    //     const buttonContainer = document.createElement("div");
    //     buttonContainer.className = "flex space-x-2 w-[15rem]"; // Tailwind for spacing

    //     // 🔍 View Button
    //     const viewButton = document.createElement("button");
    //     viewButton.className =
    //         "flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition";
    //     viewButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
    //     <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25M8.25 9V5.25M15.75 5.25V4.5a2.25 2.25 0 00-4.5 0v.75M8.25 5.25V4.5a2.25 2.25 0 00-4.5 0v.75"></path>
    //     <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9h-7.5a4.5 4.5 0 00-4.5 4.5v4.5a2.25 2.25 0 002.25 2.25h11.25a2.25 2.25 0 002.25-2.25v-4.5a4.5 4.5 0 00-4.5-4.5z"></path>
    //     </svg> View`;
    //     viewButton.onclick = () => {
    //         const rowData = instance.getSourceDataAtRow(row);
    //         handleButtonClick(rowData);
    //     };

    //     // 🗑️ Delete Button
    //     const deleteButton = document.createElement("button");
    //     deleteButton.className =
    //         "flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded shadow-md hover:bg-red-600 transition";
    //     deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
    //     <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
    //     </svg> Delete`;
    //     deleteButton.onclick = () => {
    //         const rowData = instance.getSourceDataAtRow(row);
    //         alert(`Deleting consignment: ${rowData.ConsignmentNo}`);
    //         // TODO: Implement actual delete logic
    //     };

    //     // Append buttons to container
    //     buttonContainer.appendChild(viewButton);
    //     buttonContainer.appendChild(deleteButton);

    //     // Append container to cell
    //     td.appendChild(buttonContainer);

    //     return td;
    // };

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
            data: "Date",
            title: "Date",
            type: "date",
            readOnly: true,
            renderer: dateRenderer, // You can use this to format the date
        },
        {
            data: "Rego",
            title: "Rego",
            type: "text",
            readOnly: true,
        },
        {
            data: "DayOrNightShift",
            title: "Day or Night Shift",
            type: "text",
            readOnly: true,
        },
        {
            data: "TrailerType",
            title: "Trailer Type",
            type: "text",
            readOnly: true,
        },
        {
            data: "ProductType",
            title: "Product Type",
            type: "text",
            readOnly: true,
        },
        {
            data: "OBDNumber",
            title: "OBD Number",
            type: "text",
            readOnly: true,
        },
        {
            data: "PickUpPoint",
            title: "Pick Up Point",
            type: "text",
            readOnly: true,
        },
        {
            data: "PalletsCollected",
            title: "Pallets Collected",
            type: "numeric",
            readOnly: true,
        },
        {
            data: "VehicleCapacity",
            title: "Vehicle Capacity",
            type: "numeric",
            readOnly: true,
        },
        {
            title: "Vehicle Pallet Utilisation",
            type: "numeric",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                const palletsCollected = instance.getDataAtCell(row, instance.propToCol("PalletsCollected"));
                const vehicleCapacity = instance.getDataAtCell(row, instance.propToCol("VehicleCapacity"));
                
                const util = palletsCollected && vehicleCapacity ? ((palletsCollected / vehicleCapacity) * 100).toFixed(2) + "%" : "0%";
    
                td.innerText = util;
                return td;
            }
        },
        {
            data: "LoadWeightT",
            title: "Load Weight (T)",
            type: "numeric",
            readOnly: true,
        },
        {
            data: "VehicleCapacityT",
            title: "Vehicle Capacity (T)",
            type: "numeric",
            readOnly: true,
        },
        {
            data: "LoadWeightUtilisation",
            title: "Load Weight Utilisation (%)",
            type: "numeric",
            readOnly: true,
        },
        {
            data: "TimeIn",
            title: "Time In",
            type: "date",
            readOnly: true,
            renderer: dateRenderer, // Format as date
        },
        {
            data: "TimeOut",
            title: "Time Out",
            type: "date",
            readOnly: true,
            renderer: dateRenderer, // Format as date
        },
        {
            data: "CollectionTurnaroundTime",
            title: "Collection Turnaround Time",
            type: "text",
            readOnly: true,
        },
        {
            data: "NorthRockAllowTime45Min",
            title: "North Rock Allow Time (45Min)",
            type: "text",
            readOnly: true,
        },
        {
            data: "DemurrageCharges1",
            title: "Demurrage Charges ($97.85 Per Hr or $1.63 Per Minute)",
            type: "numeric",
            readOnly: true,
        },
        {
            data: "Reason",
            title: "Reason",
            type: "text",
            readOnly: true,
        },
        {
            data: "DeliveryPoint",
            title: "Delivery Point",
            type: "text",
            readOnly: true,
        },
        {
            data: "UnloadTurnaroundTime",
            title: "Unload Turnaround Time",
            type: "text",
            readOnly: true,
        },
        {
            data: "IngleburnAllowTime30Min",
            title: "Ingleburn Allow Time (30Min)",
            type: "text",
            readOnly: true,
        },
        {
            data: "DemurrageCharges2",
            title: "Demurrage Charges ($97.85 Per Hr or $1.63 Per Minute)",
            type: "numeric",
            readOnly: true,
        },
        {
            data: "TravelTimeBetweenSites",
            title: "Travel time between sites",
            type: "text",
            readOnly: true,
        },
        {
            data: "TotalChargeAmount",
            title: "Total Charge Amount",
            type: "numeric",
            readOnly: true,
        },
        {
            data: "Manifest",
            title: "Manifest",
            type: "text",
            readOnly: true,
        },
        {
            data: "ProofOfDemurrage",
            title: "PROOF OF DEMURRAGE",
            type: "text",
            readOnly: true,
        },
        {
            data: "Invoiced",
            title: "Invoiced",
            type: "text",
            readOnly: true,
        },
        {
            data: "KPIWeek",
            title: "KPI Week",
            type: "text",
            readOnly: true,
        },
        {
            data: "KPIMonth",
            title: "KPI Month",
            type: "text",
            readOnly: true,
        },
        {
            data: "CPP",
            title: "CPP",
            type: "numeric",
            readOnly: true,
        },
        {
            data: "RevisedUtilisation",
            title: "Revised Utilisation%",
            type: "numeric",
            readOnly: true,
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
                // SaveComments(); // ✅ Call your save function here
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

    const hyperformulaInstance = HyperFormula.buildEmpty({
        // to use an external HyperFormula instance,
        // initialize it with the `'internal-use-in-handsontable'` license key
        licenseKey: 'internal-use-in-handsontable',
      });

    return (
        <div className="min-h-full px-8">
            <ToastContainer />
            <div className="sm:flex-auto mt-6">
                <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                    Unilever Utilization Report
                </h1>
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
            {tableData && (
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
                        formulas={{
                            engine: hyperformulaInstance,
                            sheetName: 'Sheet1',
                          }}
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
            {cellLoading && (
                <div className="absolute inset-0 flex justify-center items-center">
                    <Spinner color="default" size="sm" />
                </div>
            )}
        </div>
    );
}
