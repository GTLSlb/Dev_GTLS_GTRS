import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from "handsontable/registry";
import { HyperFormula } from "hyperformula";
import React, { useContext, useEffect, useRef, useState } from "react";

import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-horizon.css";
import "handsontable/styles/ht-theme-main.min.css";
import moment from "moment";
import { ToastContainer } from "react-toastify";

registerAllModules();

import { CustomContext } from "@/CommonContext";
import { handleSessionExpiration } from "@/CommonFunctions";
import { AlertToast } from "@/permissions";
import { Button, Spinner } from "@heroui/react";
import swal from "sweetalert";
import AnimatedLoading from "@/Components/AnimatedLoading";

export default function Utilization() {
    const { url, Token, user } = useContext(CustomContext);
    const [utilizationData, setUtilizationData] = useState();
    useEffect(() => {
        fetchUtilizationReportData();
    }, []);
    const fetchUtilizationReportData = async () => {
        try {
            const res = await axios.get(`${url}Utilization/Report`, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            });
            setUtilizationData(res.data || []);
        } catch (err) {
            if (err.response && err.response.status === 401) {
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
                console.log(err);

                if (typeof setCellLoading === "function") {
                    setCellLoading(null);
                }
            }
        }
    };
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

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Utilization Report");

        const headerRow = worksheet.addRow(selectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" },
        };
        headerRow.alignment = { horizontal: "center", vertical: "middle" };

        const calculateRowHeight = (cellValue) => {
            if (!cellValue) return 20;
            const lines = cellValue.split("\n").length;
            return Math.max(20, lines * 25);
        };

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

        exportData.forEach((rowData) => {
            const row = worksheet.addRow(rowData);

            let maxHeight = 15;
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const cellValue = cell.value?.toString() || "";

                cell.alignment = { wrapText: true, vertical: "top" };

                if (dateColumnIndexes.includes(colNumber - 1)) {
                    const parsedDate = new Date(cellValue);
                    if (!isNaN(parsedDate)) {
                        cell.value = parsedDate;
                        cell.numFmt = "dd-mm-yyy hh:mm";
                    }
                }

                maxHeight = Math.max(maxHeight, calculateRowHeight(cellValue));
            });

            row.height = maxHeight;
        });

        worksheet.columns = selectedColumns.map(() => ({ width: 20 }));

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

    const [activeComponentIndex] = useState(0);

    const [cellLoading, setCellLoading] = useState(null);

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
        if (!timeIn || !timeOut) return "N/A";

        const timeInMoment = moment(timeIn, "HH:mm");
        const timeOutMoment = moment(timeOut, "HH:mm");

        const diff = timeOutMoment.diff(timeInMoment, "minutes");

        return moment.utc(diff * 60000).format("HH:mm");
    };

    const calculateAllowTime = (timeIn, timeOut, allowance) => {
        const timeInMoment = moment(timeIn, "HH:mm");
        const timeOutMoment = moment(timeOut, "HH:mm");

        if (!timeInMoment.isValid() || !timeOutMoment.isValid()) {
            return "";
        }

        let diff = 0;
        if (timeOut == "00:00" || timeOut == "00:00:00") {
            diff = (timeOutMoment.diff(timeInMoment, "minutes") + 1440) % 1440;
        } else {
            diff = timeOutMoment.diff(timeInMoment, "minutes");
        }

        let collectionTurnaroundTime = diff;

        if (
            collectionTurnaroundTime <= 0 ||
            collectionTurnaroundTime <= allowance
        ) {
            collectionTurnaroundTime = 0;
        } else {
            collectionTurnaroundTime = collectionTurnaroundTime - allowance;
        }

        return moment.utc(collectionTurnaroundTime * 60000).format("HH:mm");
    };

    const calculateUtilization = (instance, row, col1, col2) => {
        const val1 = instance.getDataAtCell(row, instance.propToCol(col1));
        const val2 = instance.getDataAtCell(row, instance.propToCol(col2));

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
            renderer: dateRenderer,
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
                td.innerText = value + "%";
                td.classList.add("htLeft");
                return td;
            },
        },
        {
            data: "PickupTimeIn",
            title: "Pickup Time In",
            type: "text",
            readOnly: false,
            allowInvalid: true,
            fillHandle: "vertical",
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                td.classList.remove("htInvalid");
                td.classList.add("htLeft");

                if (value != "" && value != null && value != undefined) {
                    if (timeValidatorRegexp.test(value)) {
                        const formattedTime = value.replace(
                            timeValidatorRegexp,
                            (hour, minute) => {
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
                    td.innerText = "";
                }

                return td;
            },
        },
        {
            data: "PickupTimeOut",
            title: "Pickup Time Out",
            type: "text",
            readOnly: false,
            allowInvalid: true,
            allowEmpty: true,
            numericFormat: null,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                td.classList.remove("htInvalid");
                if (value != "" && value != null && value != undefined) {
                    if (timeValidatorRegexp.test(value)) {
                        const formattedTime = value.replace(
                            timeValidatorRegexp,
                            (hour, minute) => {
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
                const hasValidValues =
                    timeIn != null &&
                    timeOut != null &&
                    timeIn != "" &&
                    timeOut != "" &&
                    timeIn != undefined &&
                    timeOut != undefined;

                const formattedDiff = hasValidValues
                    ? calculateTimeDifference(timeIn, timeOut)
                    : "";

                td.innerText = formattedDiff;
                td.classList.add("htLeft");
                return td;
            },
        },
        {
            data: "PickupAllowTime",
            title: "North Rock Allow Time (45Min)",
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

                const formattedDiff = calculateAllowTime(timeIn, timeOut, 45);
                td.innerText = formattedDiff;

                td.classList.add("htLeft");
                return td;
            },
        },
        {
            data: "CollectionDemurrageCharges",
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
                td.innerText = `$ ${demurrageCharges.toFixed(2)}`;
                td.classList.add("htLeft");
                return td;
            },
        },
        {
            data: "PickupReason",
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
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                if (value != null) {
                    let parts = value?.split(":");
                    let shortTimeStr = parts?.slice(0, 2).join(":");
                    td.innerText = shortTimeStr;

                    td.classList.add("htLeft");
                    return td;
                } else {
                    td.innerText = "";
                    td.classList.add("htLeft");
                    return td;
                }
            },
        },
        {
            data: "DelTimeOut",
            title: "Time Out",
            type: "date",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                if (value != null) {
                    let parts = value?.split(":");
                    let shortTimeStr = parts?.slice(0, 2).join(":");
                    td.innerText = shortTimeStr;

                    td.classList.add("htLeft");
                    return td;
                } else {
                    td.innerText = "";
                    td.classList.add("htLeft");
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
                if (value != null) {
                    let parts = value?.split(":");
                    let shortTimeStr = parts?.slice(0, 2).join(":");
                    td.innerText = shortTimeStr;

                    td.classList.add("htLeft");
                    return td;
                } else {
                    td.innerText = "";
                    td.classList.add("htLeft");
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

                const hasValidValues =
                    timeIn != null &&
                    timeOut != null &&
                    timeIn != "" &&
                    timeOut != "" &&
                    timeIn != undefined &&
                    timeOut != undefined;

                const formattedDiff = hasValidValues
                    ? calculateAllowTime(timeIn, timeOut, 30)
                    : "";
                td.innerText = formattedDiff;

                td.classList.add("htLeft");
                return td;
            },
        },
        {
            data: "UnloadDemurrageCharges",
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
                td.innerText = `$ ${demurrageCharges.toFixed(2)}`;
                td.classList.add("htLeft");
                return td;
            },
        },
        {
            data: "DeliveryReason",
            title: "Delivery Reason",
            type: "text",
            readOnly: false,
        },
        {
            data: "TravelTime",
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
                td.classList.add("htLeft");
                return td;
            },
        },
        {
            data: "TotalCharge",
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

                const sum = unloadDemurrageNumber + collectionDemurrageNumber;
                td.innerText = `$ ${sum.toFixed(2)}`;
                td.classList.add("htLeft");
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
            data: "RevisedUtilization",
            title: "Revised Utilisation%",
            type: "numeric",
            readOnly: true,
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                const vehicleUtil = calculateUtilization(
                    instance,
                    row,
                    "PalletsCollected",
                    "PalletsVehicleCapacity"
                );

                const weightUtil = calculateUtilization(
                    instance,
                    row,
                    "Weight",
                    "WeightVehicleCapacity"
                );

                const max = Math.max(vehicleUtil, weightUtil);
                td.innerText = max + "%";
                td.classList.add("htLeft");
                return td;
            },
        },
    ];

    const [changedRows, setChangedRows] = useState([]);

    const calculateDemurrageCharges = (timeIn, timeOut, allowTime) => {
        const timeDiff = moment(
            calculateAllowTime(timeIn, timeOut, allowTime),
            "HH:mm"
        );
        const timeDiffHours = timeDiff.hours();
        const timeDiffMinutes = timeDiff.minutes();
        let demurrageCharges = 0;
        if (timeDiffHours > 0 || timeDiffMinutes > 0) {
            const hoursCharge = timeDiffHours * 97.85;
            const minutesCharge = timeDiffMinutes * 1.63;

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

        const sum = unloadDemurrageNumber + collectionDemurrageNumber;
        return sum;
    };
    const getTimeDifference = (time1, time2) => {
        const timeInMoment = moment(time1, "HH:mm");
        const timeOutMoment = moment(time2, "HH:mm");

        if (!timeInMoment.isValid() || !timeOutMoment.isValid()) {
            return "00:00";
        }

        const diff = timeOutMoment.diff(timeInMoment, "minutes");

        const formattedDiff = moment.utc(diff * 60000).format("HH:mm");

        return formattedDiff;
    };
    const handleAddEditUtilization = () => {
        setIsLoading(true);

        const inputValues = changedRows.map((item) => ({
            UtilizationId: item.hasOwnProperty("UtilizationId")
                ? item.UtilizationId
                : null,
            ConsignmentId: item.ConsignmentID,
            PickupTimeIn: item.hasOwnProperty("PickupTimeIn")
                ? item?.PickupTimeIn?.replace(
                      timeValidatorRegexp,
                      (hour, minute) => {
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
                      (hour, minute) => {
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
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then(() => {
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
            let updatedChanges = [...prevChanges];
            const hotInstance = hotTableRef.current?.hotInstance;

            changes.forEach(([prop, oldValue, newValue]) => {
                let newValueToUse = newValue;
                if (newValue !== oldValue && source === "Autofill.fill") {
                    const selectedRange = hotInstance.getSelected();
                    if (selectedRange[0] && selectedRange[0].length === 4) {
                        const [startRow, startCol, endRow, endCol] =
                            selectedRange[0];

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

                            const valueToAutofill = hotInstance.getDataAtCell(
                                startRow,
                                startCol
                            );
                            newValueToUse = valueToAutofill;
                        }
                    }
                } else {
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

            return updatedChanges;
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
            event.preventDefault();
            if (changedRows.length > 0) {
                handleAddEditUtilization();
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
            filtersPlugin.clearConditions();
            filtersPlugin.filter();
        }
    };

    const hyperformulaInstance = HyperFormula.buildEmpty({
        licenseKey: "internal-use-in-handsontable",
        autoWrapRow: false,
        autoWrapCol: false,
        autoFill: true,
        autoInsertCol: false,
        autoInsertRow: false,
    });

    if (!tableData || isLoading) {
        return <AnimatedLoading />;
    }
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
                        filters={true}
                        dropdownMenu={{
                            items: {
                                filter_by_condition: {},
                                filter_by_value: {},
                                filter_action_bar: {},
                                separator1: "---------",
                            },
                        }}
                        columnSorting={true}
                        settings={{
                            useTheme: null,
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
