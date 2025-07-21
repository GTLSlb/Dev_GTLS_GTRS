import { HotTable } from "@handsontable/react-wrapper";
import { HyperFormula } from "hyperformula";
import { registerAllModules } from "handsontable/registry";
import { useEffect, useMemo, useRef, useState } from "react";
// import "handsontable/styles/handsontable.css";
// import "handsontable/styles/ht-theme-main.css";
import { Button, Spinner } from "@nextui-org/react";
import axios from "axios";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-horizon.css";
import "handsontable/styles/ht-theme-main.min.css";
import moment from "moment";
import { ToastContainer } from "react-toastify";

registerAllModules();

import { AlertToast } from "@/permissions";
import swal from "sweetalert";
import UtilizationImport from "../modals/UtilizationImport";

export default function Utilization({
    url,
    AToken,
    utilizationData,
    currentUser,
}) {
    const hotTableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState(utilizationData);

    useEffect(() => {
        setTableData(utilizationData);
    }, [utilizationData]);

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

    const calculateTimeDifference = (timeIn, timeOut) => {
        // If either of the times is missing, return "N/A"
        if (!timeIn || !timeOut) return "N/A";

        // Convert to moments (or Date objects)
        const timeInMoment = moment(timeIn, "HH:mm");
        const timeOutMoment = moment(timeOut, "HH:mm");

        // Calculate the difference in minutes
        const diff = timeOutMoment.diff(timeInMoment, "minutes");

        // Return the formatted difference as HH:mm
        return moment.utc(diff * 60000).format("HH:mm");
    };

    const calculateAllowTime = (timeIn, timeOut, allowance) => {
        const timeInMoment = moment(timeIn, "HH:mm");
        const timeOutMoment = moment(timeOut, "HH:mm");

        // If either timeIn or timeOut is invalid, return empty string
        if (!timeInMoment.isValid() || !timeOutMoment.isValid()) {
            return ""; // Return empty if invalid time
        }

        // Calculate the difference in minutes

        let diff = 0;
        if (timeOut == "00:00" || timeOut == "00:00:00") {
            diff = (timeOutMoment.diff(timeInMoment, "minutes") + 1440) % 1440; // 1440 = 24 hours in minutes
        } else {
            diff = timeOutMoment.diff(timeInMoment, "minutes");
        }
        // Apply the logic for Collection Turnaround Time based on your formula
        let collectionTurnaroundTime = diff;

        // Apply the formula (adjusting for 45 minutes)
        if (
            collectionTurnaroundTime <= 0 ||
            collectionTurnaroundTime <= allowance
        ) {
            collectionTurnaroundTime = 0;
        } else {
            collectionTurnaroundTime = collectionTurnaroundTime - allowance;
        }

        // Format the result (convert minutes to HH:mm format)
        return moment.utc(collectionTurnaroundTime * 60000).format("HH:mm");
    };

    const convertToMinutes = (time) => {
        const timeMoment = moment(time, "HH:mm");

        // Return the total minutes from midnight
        return timeMoment.isValid()
            ? timeMoment.hours() * 60 + timeMoment.minutes()
            : 0;
    };

    const calculateUtilization = (instance, row, col1, col2) => {
        const val1 = instance.getDataAtCell(row, instance.propToCol(col1));
        const val2 = instance.getDataAtCell(row, instance.propToCol(col2));
        // Calculate the pallet/vehicle utilization
        const util = val1 && val2 ? ((val1 / val2) * 100).toFixed(2) : "0";
        return util;
    };
    const timeValidatorRegexp =
        /^(0?[0-9]|1[0-9]|2[0-3])(?::([0-5][0-9]))?(?::([0-5][0-9]))?$/;
    const hotColumns = [
        {
            data: "ManifestDateTime",
            title: "Date",
            type: "date",
            readOnly: true,
            renderer: dateRenderer, // You can use this to format the date
        },
        {
            data: "ManifestNo",
            title: "Manifest",
            type: "text",
            readOnly: true,
        },
        {
            data: "ShiftType",
            title: "Day or Night Shift",
            type: "text",
            readOnly: true,
        },
        {
            data: "ConsignmentNo",
            title: "Consignment No",
            type: "text",
            readOnly: true,
        },
        {
            data: "RegistrationNumber",
            title: "Rego",
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
            data: "ReceiverReference",
            title: "OBD Number",
            type: "text",
            readOnly: true,
        },
        {
            data: "SenderName",
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
            data: "PalletsVehicleCapacity",
            title: "Vehicle Capacity",
            type: "numeric",
            readOnly: true,
        },
        {
            data: "PalletUtilization",
            title: "Vehicle Pallet Utilisation (%)",
            type: "numeric",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                // const val = calculateUtilization(
                //     instance,
                //     row,
                //     "PalletsCollected",
                //     "PalletsVehicleCapacity"
                // );
                td.innerText = value + "%";
                td.classList.add("htLeft");
                return td;
            },
        },
        {
            data: "Weight",
            title: "Load Weight (T)",
            type: "numeric",
            readOnly: true,
        },
        {
            data: "WeightVehicleCapacity",
            title: "Vehicle Capacity (T)",
            type: "numeric",
            readOnly: true,
        },
        {
            data: "WeightUtilization",
            title: "Load Weight Utilisation (%)",
            type: "numeric",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                // const val = calculateUtilization(
                //     instance,
                //     row,
                //     "Weight",
                //     "WeightVehicleCapacity"
                // );
                td.innerText = value + "%";
                td.classList.add("htLeft");
                return td;
            },
        },
        {
            data: "PickupTimeIn",
            title: "Pickup Time In",
            type: "text",
            readOnly: false, // Format as time //editable //10:00
            allowInvalid: true,
            fillHandle: "vertical",
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                // TextRenderer(instance, td, row, col, prop, value, cellProperties);
                td.classList.remove("htInvalid");
                td.classList.add("htLeft"); // Ensure alignment is always applied

                // Step 3: Apply your custom formatting and validation display
                if (value != "" && value != null && value != undefined) {
                    if (timeValidatorRegexp.test(value)) {
                        // If value is valid and needs formatting, apply it
                        const formattedTime = value.replace(
                            timeValidatorRegexp,
                            (match, hour, minute, second) => {
                                const hours = hour.padStart(2, "0");
                                const minutes = minute
                                    ? minute.padStart(2, "0")
                                    : "00";
                                return `${hours}:${minutes}`;
                            }
                        );
                        td.innerText = formattedTime; // Overwrite with formatted time
                    } else {
                        // If value is not valid according to regex
                        td.classList.add("htInvalid");
                    }
                } else {
                    // If value is explicitly null, undefined, or empty string,
                    td.innerText = ""; // TextRenderer usually handles this.
                }

                return td;
            },
        },
        {
            data: "PickupTimeOut",
            title: "Pickup Time Out",
            type: "text",
            readOnly: false, // Format as as time //editable //10:00
            allowInvalid: true,
            allowEmpty: true,
            numericFormat: null,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                td.classList.remove("htInvalid");
                if (value != "" && value != null && value != undefined) {
                    if (timeValidatorRegexp.test(value)) {
                        const formattedTime = value.replace(
                            timeValidatorRegexp,
                            (match, hour, minute, second) => {
                                const hours = hour.padStart(2, "0");
                                const minutes = minute
                                    ? minute.padStart(2, "0")
                                    : "00";
                                return `${hours}:${minutes}`;
                            }
                        );
                        td.innerText = formattedTime;
                    } else {
                        td.classList.add("htInvalid");
                    }
                } else {
                    td.innerText = value;
                }
                td.classList.add("htLeft");
                return td;
            },
        },
        {
            data: "CollectionTurnaroundTime",
            title: "Collection Turnaround Time",
            type: "date",
            readOnly: true, // Time out - time in //editable //10:00  as time
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                const timeIn = instance.getDataAtCell(
                    row,
                    instance.propToCol("PickupTimeIn")
                );
                const timeOut = instance.getDataAtCell(
                    row,
                    instance.propToCol("PickupTimeOut")
                );
                const hasValidValues =
                    timeIn != null &&
                    timeOut != null &&
                    timeIn != "" &&
                    timeOut != "" &&
                    timeIn != undefined &&
                    timeOut != undefined;
                // Use the reusable function to calculate the time difference
                const formattedDiff = hasValidValues
                    ? calculateTimeDifference(timeIn, timeOut)
                    : "";

                td.innerText = formattedDiff; // Set the result into the table cell
                td.classList.add("htLeft"); // Align text to the left
                return td;
            },
        },
        {
            data: "PickupAllowTime",
            title: "North Rock Allow Time (45Min)", //calculate based on time in and time out and allowed time
            type: "text",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                const timeIn = instance.getDataAtCell(
                    row,
                    instance.propToCol("PickupTimeIn")
                );
                const timeOut = instance.getDataAtCell(
                    row,
                    instance.propToCol("PickupTimeOut")
                );
                // If TimeIn or TimeOut is missing
                // Convert to moments (or Date objects)
                const formattedDiff = calculateAllowTime(timeIn, timeOut, 45); // 0.03125 days = 45 minutes
                td.innerText = formattedDiff;

                td.classList.add("htLeft"); // Align text to the left
                return td;
            },
        },
        {
            data: "CollectionDemurrageCharges", //calculate based on pickup time in and time out //debatable
            title: "Demurrage Charges ($97.85 Per Hr or $1.63 Per Minute)",
            type: "numeric",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                const timeIn = instance.getDataAtCell(
                    row,
                    instance.propToCol("PickupTimeIn")
                );
                const timeOut = instance.getDataAtCell(
                    row,
                    instance.propToCol("PickupTimeOut")
                );
                const demurrageCharges = calculateDemurrageCharges(
                    timeIn,
                    timeOut,
                    45
                );
                td.innerText = `$ ${demurrageCharges.toFixed(2)}`; // Display with 2 decimal places
                td.classList.add("htLeft"); // Align text to the left
                return td;
            },
        },
        {
            data: "PickupReason", //editable
            title: "Pickup Reason",
            type: "text",
            readOnly: false,
        },
        {
            data: "ReceiverName",
            title: "Delivery Point",
            type: "text",
            readOnly: true,
        },

        {
            data: "DelTimeIn",
            title: "Time In",
            type: "date",
            readOnly: true, // Format as date
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                // text format should be HH:mm instead of HH:mm
                if (value != null) {
                    let parts = value?.split(":");
                    let shortTimeStr = parts?.slice(0, 2).join(":");
                    td.innerText = shortTimeStr;

                    td.classList.add("htLeft"); // Align text to the left
                    return td;
                } else {
                    td.innerText = "";
                    td.classList.add("htLeft"); // Align text to the left
                    return td;
                }
            },
        },
        {
            data: "DelTimeOut",
            title: "Time Out",
            type: "date",
            readOnly: true, // Format as date
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                // text format should be HH:mm instead of HH:mm
                if (value != null) {
                    let parts = value?.split(":");
                    let shortTimeStr = parts?.slice(0, 2).join(":");
                    td.innerText = shortTimeStr;

                    td.classList.add("htLeft"); // Align text to the left
                    return td;
                } else {
                    td.innerText = "";
                    td.classList.add("htLeft"); // Align text to the left
                    return td;
                }
            },
        },
        {
            data: "UnloadTime",
            title: "Unload Turnaround Time",
            type: "text",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                // text format should be HH:mm instead of HH:mm
                if (value != null) {
                    let parts = value?.split(":");
                    let shortTimeStr = parts?.slice(0, 2).join(":");
                    td.innerText = shortTimeStr;

                    td.classList.add("htLeft"); // Align text to the left
                    return td;
                } else {
                    td.innerText = "";
                    td.classList.add("htLeft"); // Align text to the left
                    return td;
                }
            },
        },
        {
            data: "DeliveryAllowTime",
            title: "Ingleburn Allow Time (30Min)",
            type: "text",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                const timeIn = instance.getDataAtCell(
                    row,
                    instance.propToCol("DelTimeIn")
                );
                const timeOut = instance.getDataAtCell(
                    row,
                    instance.propToCol("DelTimeOut")
                );
                // If TimeIn or TimeOut is missing
                const hasValidValues =
                    timeIn != null &&
                    timeOut != null &&
                    timeIn != "" &&
                    timeOut != "" &&
                    timeIn != undefined &&
                    timeOut != undefined;

                // Convert to moments (or Date objects)
                const formattedDiff = hasValidValues
                    ? calculateAllowTime(timeIn, timeOut, 30)
                    : ""; // 0.0208333 days = 30 minutes
                td.innerText = formattedDiff;

                td.classList.add("htLeft"); // Align text to the left
                return td;
            },
        },
        {
            data: "UnloadDemurrageCharges", //db
            title: "Unload Demurrage Charges ($97.85 Per Hr or $1.63 Per Minute)",
            type: "numeric",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                const timeIn = instance.getDataAtCell(
                    row,
                    instance.propToCol("DelTimeIn")
                );
                const timeOut = instance.getDataAtCell(
                    row,
                    instance.propToCol("DelTimeOut")
                );
                const demurrageCharges = calculateDemurrageCharges(
                    timeIn,
                    timeOut,
                    30
                );
                td.innerText = `$ ${demurrageCharges.toFixed(2)}`; // Display with 2 decimal places
                td.classList.add("htLeft"); // Align text to the left
                return td;
            },
        },
        {
            data: "DeliveryReason", //editable
            title: "Delivery Reason",
            type: "text",
            readOnly: false,
        },
        {
            data: "TravelTime", //editable
            title: "Travel time between sites",
            type: "text",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                const deliveryTimeIn = instance.getDataAtCell(
                    row,
                    instance.propToCol("DelTimeIn")
                );
                const pickupTimeOut = instance.getDataAtCell(
                    row,
                    instance.propToCol("PickupTimeOut")
                );

                const formattedDiff = getTimeDifference(
                    pickupTimeOut,
                    deliveryTimeIn
                );

                td.innerText = formattedDiff;
                td.classList.add("htLeft"); // Align text to the left
                return td;
            },
        },
        {
            data: "TotalCharge", // sum of two demurages (collection + unload)
            title: "Total Charge Amount",
            type: "numeric",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                const delTimeIn = instance.getDataAtCell(
                    row,
                    instance.propToCol("DelTimeIn")
                );
                const delTimeOut = instance.getDataAtCell(
                    row,
                    instance.propToCol("DelTimeOut")
                );
                const unloadDemurrageCharges = calculateDemurrageCharges(
                    delTimeIn,
                    delTimeOut,
                    30
                );
                const pickupTimeIn = instance.getDataAtCell(
                    row,
                    instance.propToCol("PickupTimeIn")
                );
                const pickupTimeOut = instance.getDataAtCell(
                    row,
                    instance.propToCol("PickupTimeOut")
                );
                const collectionDemurrageCharges = calculateDemurrageCharges(
                    pickupTimeIn,
                    pickupTimeOut,
                    45
                );
                const unloadDemurrageNumber =
                    typeof unloadDemurrageCharges === "string"
                        ? Number(unloadDemurrageCharges)
                        : unloadDemurrageCharges;
                const collectionDemurrageNumber =
                    typeof collectionDemurrageCharges === "string"
                        ? Number(collectionDemurrageCharges)
                        : collectionDemurrageCharges;

                // Calculate the sum
                const sum = unloadDemurrageNumber + collectionDemurrageNumber;
                td.innerText = `$ ${sum.toFixed(2)}`;
                td.classList.add("htLeft"); // Align text to the left
                return td;
            },
        },

        {
            data: "ProofOfDemurrage",
            title: "PROOF OF DEMURRAGE",
            type: "text",
            readOnly: true,
        },
        {
            data: "RevisedUtilization", //max between utilization (weight) and (pallets) //db
            title: "Revised Utilisation%",
            type: "numeric",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                // Recalculate the utilization values since they are not stored in the database
                // Calculate the pallet/vehicle utilization
                const vehicleUtil = calculateUtilization(
                    instance,
                    row,
                    "PalletsCollected",
                    "PalletsVehicleCapacity"
                );

                // Get the values of Weight and VehicleCapacity
                const weightUtil = calculateUtilization(
                    instance,
                    row,
                    "Weight",
                    "WeightVehicleCapacity"
                );

                // Get the maximum of the two utilizations
                const max = Math.max(vehicleUtil, weightUtil);
                td.innerText = max + "%";
                td.classList.add("htLeft"); // Align text to the left
                return td;
            },
        },
    ];

    const [changedRows, setChangedRows] = useState([]); // Stores changed rows

    const calculateDemurrageCharges = (timeIn, timeOut, allowTime) => {
        const timeDiff = moment(
            calculateAllowTime(timeIn, timeOut, allowTime),
            "HH:mm"
        );
        const timeDiffHours = timeDiff.hours();
        const timeDiffMinutes = timeDiff.minutes();
        let demurrageCharges = 0;
        if (timeDiffHours > 0 || timeDiffMinutes > 0) {
            const hoursCharge = timeDiffHours * 97.85; // Charge per hour
            const minutesCharge = timeDiffMinutes * 1.63; // Charge per minute

            demurrageCharges = hoursCharge + minutesCharge;
        }
        return demurrageCharges;
    };
    const calculateTotalChargeAmount = (item) => {
        const unloadDemurrage = item.UnloadDemurrageCharges;
        const collectionDemurrage = calculateDemurrageCharges(
            item.PickupTimeIn,
            item.PickupTimeOut,
            45
        );

        const unloadDemurrageNumber =
            typeof unloadDemurrage === "string"
                ? Number(unloadDemurrage)
                : unloadDemurrage;
        const collectionDemurrageNumber =
            typeof collectionDemurrage === "string"
                ? Number(collectionDemurrage)
                : collectionDemurrage;

        // Calculate the sum
        const sum = unloadDemurrageNumber + collectionDemurrageNumber;
        return sum;
    };
    const getTimeDifference = (time1, time2) => {
        const timeInMoment = moment(time1, "HH:mm");
        const timeOutMoment = moment(time2, "HH:mm");

        // If either timeIn or timeOut is invalid, return empty string
        if (!timeInMoment.isValid() || !timeOutMoment.isValid()) {
            return "00:00"; // Return empty if invalid time
        }

        // Calculate the difference in minutes
        const diff = timeOutMoment.diff(timeInMoment, "minutes");

        // Format the result (convert minutes to HH:mm format)
        const formattedDiff = moment.utc(diff * 60000).format("HH:mm");

        return formattedDiff;
    };
    const handleAddEditUtilization = () => {
        setIsLoading(true);
        // function accepts an array of objects
        // map over the changedRows object and only keep:
        // UtilizationId, ConsignmentId, PickupTimeIn, PickupTimeOut, CollectionTime, CollectionDemurrage, PickupReason, DeliveryReason, TotalChargeAmount, ExtraCollectionTime
        const inputValues = changedRows.map((item) => ({
            UtilizationId: item.hasOwnProperty("UtilizationId")
                ? item.UtilizationId
                : null,
            ConsignmentId: item.ConsignmentID,
            PickupTimeIn: item.hasOwnProperty("PickupTimeIn")
                ? item?.PickupTimeIn?.replace(
                      timeValidatorRegexp,
                      (match, hour, minute, second) => {
                          const hours = hour.padStart(2, "0");
                          const minutes = minute
                              ? minute.padStart(2, "0")
                              : "00";
                          return `${hours}:${minutes}`;
                      }
                  )
                : null,
            PickupTimeOut: item.hasOwnProperty("PickupTimeOut")
                ? item?.PickupTimeOut?.replace(
                      timeValidatorRegexp,
                      (match, hour, minute, second) => {
                          const hours = hour.padStart(2, "0");
                          const minutes = minute
                              ? minute.padStart(2, "0")
                              : "00";
                          return `${hours}:${minutes}`;
                      }
                  )
                : null,
            CollectionTime:
                item.hasOwnProperty("PickupTimeOut") &&
                item.hasOwnProperty("PickupTimeIn")
                    ? getTimeDifference(item.PickupTimeIn, item.PickupTimeOut)
                    : null,
            CollectionDemurrage:
                item.hasOwnProperty("PickupTimeOut") &&
                item.hasOwnProperty("PickupTimeIn")
                    ? calculateDemurrageCharges(
                          item.PickupTimeIn,
                          item.PickupTimeOut,
                          45
                      )
                    : null,
            PickupReason:
                item.PickupReason == undefined ? "" : item.PickupReason,
            DeliveryReason:
                item.DeliveryReason == undefined ? "" : item.DeliveryReason,
            TravelTime: item.hasOwnProperty("PickupTimeOut")
                ? getTimeDifference(item.PickupTimeOut, item.DelTimeIn)
                : null,
            TotalChargeAmount:
                item.hasOwnProperty("PickupTimeOut") &&
                item.hasOwnProperty("PickupTimeIn")
                    ? calculateTotalChargeAmount(item)
                    : null,
            ExtraCollectionTime:
                item.hasOwnProperty("PickupTimeOut") &&
                item.hasOwnProperty("PickupTimeIn")
                    ? moment(
                          calculateTimeDifference(
                              item.PickupTimeIn,
                              item.PickupTimeOut
                          ),
                          "HH:mm"
                      )
                          .subtract(item.PickupAllowTime, "minutes")
                          .format("HH:mm")
                    : null,
        }));
        axios
            .post(`${url}Add/UtilizationReport`, inputValues, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
                AlertToast("Saved successfully", 1);
                setChangedRows([]);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                AlertToast("Something went wrong", 2);
                setIsLoading(false);
            });
    };

    const handleAfterChange = (changes, source) => {
        if (source === "loadData" || !changes) return;
        setChangedRows((prevChanges) => {
            let updatedChanges = [...prevChanges]; // Clone the existing changes array
            const hotInstance = hotTableRef.current?.hotInstance;

            changes.forEach(([row, prop, oldValue, newValue]) => {
                let newValueToUse = newValue;
                if (newValue !== oldValue && source === "Autofill.fill") {
                    const selectedRange = hotInstance.getSelected();
                    if (selectedRange[0] && selectedRange[0].length === 4) {
                        const [startRow, startCol, endRow, endCol] =
                            selectedRange[0];

                        // If it's a single cell selection (which is typical for autofill source)
                        if (startRow === endRow && startCol === endCol) {
                            const valueToAutofill = hotInstance.getDataAtCell(
                                startRow,
                                startCol
                            );

                            newValueToUse = valueToAutofill;
                        } else {
                            console.warn(
                                "Multiple cells or a different type of range is selected. Autofill usually starts from a single cell."
                            );
                            // Handle scenarios where a range might be selected before dragging the fill handle.
                            // The value would still come from the top-left cell of the initial selection.
                            const valueToAutofill = hotInstance.getDataAtCell(
                                startRow,
                                startCol
                            );
                            newValueToUse = valueToAutofill;
                        }
                    }
                } else if (
                    newValue !== oldValue &&
                    source === "Autofill.fill" &&
                    newValueToUse !== oldValue
                ) {
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
                            [prop]: newValueToUse,
                        };
                    } else {
                        updatedChanges.push({
                            ...rowData,
                            [prop]: newValueToUse,
                        });
                    }
                    const newTableData = [...tableData]; // Use tableData from state
                    if (newTableData[row]) {
                        newTableData[row][prop] = newValueToUse;
                    } else {
                        // This case handles new rows added by Handsontable (e.g., by autofilling past the last row)
                        // If ConsignmentID is auto-generated on new rows, you'd handle that here.
                        const newRowData = hotInstance.getSourceDataAtRow(row); // Get full new row data
                        newTableData[row] = {
                            ...newRowData,
                            [prop]: newValueToUse,
                        };
                    }
                    setTableData(newTableData);
                } else {
                    const rowData = hotInstance.getSourceDataAtRow(row);
                    const existingObj = tableData?.find(
                        (item) =>
                            item.ConsignmentNo === hotInstance.getData()[0][3]
                    );
                    const existingIndex = updatedChanges.findIndex(
                        (item) =>
                            item.ConsignmentID === existingObj.ConsignmentID
                    );
                    if (existingIndex > -1) {
                        updatedChanges[existingIndex] = {
                            ...updatedChanges[existingIndex],
                            [prop]: newValueToUse,
                        };
                    } else {
                        updatedChanges.push({
                            ...existingObj,
                            [prop]: newValueToUse,
                        });
                    }
                }
            });

            return updatedChanges; // Ensure we return a new array
        });
    };

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
                handleAddEditUtilization(); // ✅ Call the save function here
                // SaveComments();
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
        licenseKey: "internal-use-in-handsontable",
        autoWrapRow: false,
        autoWrapCol: false,
        autoFill: true,
        autoInsertCol: false,
        autoInsertRow: false,
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
                    onClick={() => handleAddEditUtilization()}
                    isDisabled={changedRows.length === 0 || isLoading}
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
                {/*<UtilizationImport />*/}
            </div>
            {tableData && !isLoading && (
                <div id="" className="ht-theme-main mt-4 pb-10">
                    <HotTable
                        ref={hotTableRef}
                        data={tableData?.slice(0, 1000)}
                        colHeaders={hotColumns.map((col) => col.title)}
                        columns={hotColumns}
                        width="100%"
                        height={"600px"}
                        manualColumnMove={true}
                        formulas={{
                            engine: hyperformulaInstance,
                            sheetName: "Sheet1",
                        }}
                        licenseKey="non-commercial-and-evaluation"
                        rowHeaders={true}
                        autoInsertRow={false}
                        autoInsertCol={false}
                        afterChange={handleAfterChange}
                        autoWrapRow={false}
                        manualColumnResize={true}
                        renderAllRows={false}
                        viewportRowRenderingOffset={10}
                        viewportColumnRenderingOffset={10}
                        autoWrapCol={false}
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
            {isLoading && (
                <div className="min-h-screen md:pl-20 -mt-24 h-full flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div
                            className={`h-4 w-4 bg-goldd rounded-full mr-5 animate-bounce`}
                        ></div>
                        <div
                            className={`h-4 w-4 bg-goldd rounded-full mr-5 animate-bounce200`}
                        ></div>
                        <div
                            className={`h-4 w-4 bg-goldd rounded-full animate-bounce400`}
                        ></div>
                    </div>
                    <div className="text-dark mt-4 font-bold">
                        Please wait while we get the data for you.
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
