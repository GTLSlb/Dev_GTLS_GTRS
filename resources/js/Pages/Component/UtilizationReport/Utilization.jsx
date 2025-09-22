import TableStructure from "@/Components/TableStructure";
import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import swal from "sweetalert";
import { CustomContext } from "@/CommonContext";
import {
    handleSessionExpiration,
    AlertToast,
    renderConsDetailsLink,
} from "@/CommonFunctions";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import { getFiltersUtilization } from "@/Components/utils/filters";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";

export default function Utilization() {
    const gridRef = useRef(null);
    const { url, Token, user, userPermissions } = useContext(CustomContext);
    const [utilizationData, setUtilizationData] = useState();
    const minDate = getMinMaxValue(utilizationData, "ManifestDateTime", 1);
    const maxDate = getMinMaxValue(utilizationData, "ManifestDateTime", 2);
    const [filterValue, setFilterValue] = useState(
        getFiltersUtilization(minDate, maxDate)
    );
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetchUtilizationReportData();
    }, []);
    console.log(filterValue);
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
                    header: "Session Expired!",
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
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        {
            name: "ManifestDateTime",
            header: "Date",
            type: "date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
            },
        },
        {
            name: "ManifestNo",
            header: "Manifest",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ShiftType",
            header: "Day or Night Shift",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: createNewLabelObjects(utilizationData, "ShiftType"),
            },
        },
        {
            name: "ConsignmentNo",
            header: "Consignment No",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return renderConsDetailsLink(
                    userPermissions,
                    value,
                    data.ConsignmentID
                );
            },
        },
        {
            name: "RegistrationNumber",
            header: "Rego",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },

        {
            name: "TrailerType",
            header: "Trailer Type",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: createNewLabelObjects(utilizationData, "TrailerType"),
            },
        },
        {
            name: "ProductType",
            header: "Product Type",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: createNewLabelObjects(utilizationData, "ProductType"),
            },
        },
        {
            name: "ReceiverReference",
            header: "OBD Number",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "SenderName",
            header: "Pick Up Point",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "PalletsCollected",
            header: "Pallets Collected",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "PalletsVehicleCapacity",
            header: "Vehicle Capacity",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "PalletUtilization",
            header: "Vehicle Pallet Utilisation (%)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     td.innerText = value + "%";
            //     td.classList.add("htLeft");
            //     return td;
            // },
        },
        {
            name: "Weight",
            header: "Load Weight (T)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "WeightVehicleCapacity",
            header: "Vehicle Capacity (T)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "WeightUtilization",
            header: "Load Weight Utilisation (%)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     td.innerText = value + "%";
            //     td.classList.add("htLeft");
            //     return td;
            // },
        },
        {
            name: "PickupTimeIn",
            header: "Pickup Time In",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     td.classList.remove("htInvalid");
            //     td.classList.add("htLeft");

            //     if (value != "" && value != null && value != undefined) {
            //         if (timeValidatorRegexp.test(value)) {
            //             const formattedTime = value.replace(
            //                 timeValidatorRegexp,
            //                 (_, hour, minute, second) => {
            //                     const hours = hour.padStart(2, "0");
            //                     const minutes = minute
            //                         ? minute.padStart(2, "0")
            //                         : "00";
            //                     const seconds = second
            //                         ? second.padStart(2, "0")
            //                         : null;

            //                     // return hh:mm if no seconds, otherwise hh:mm:ss
            //                     return seconds
            //                         ? `${hours}:${minutes}:${seconds}`
            //                         : `${hours}:${minutes}`;
            //                 }
            //             );
            //             td.innerText = formattedTime;
            //         } else {
            //             td.classList.add("htInvalid");
            //         }
            //     } else {
            //         td.innerText = "";
            //     }

            //     return td;
            // },
        },
        {
            name: "PickupTimeOut",
            header: "Pickup Time Out",
            type: "text",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     td.classList.remove("htInvalid");

            //     if (value != "" && value != null && value != undefined) {
            //         if (timeValidatorRegexp.test(value)) {
            //             const formattedTime = value.replace(
            //                 timeValidatorRegexp,
            //                 (_, hour, minute, second) => {
            //                     const hours = hour.padStart(2, "0");
            //                     const minutes = minute
            //                         ? minute.padStart(2, "0")
            //                         : "00";
            //                     const seconds = second
            //                         ? second.padStart(2, "0")
            //                         : null;

            //                     // Decide whether to include seconds
            //                     return seconds
            //                         ? `${hours}:${minutes}:${seconds}`
            //                         : `${hours}:${minutes}`;
            //                 }
            //             );
            //             td.innerText = formattedTime;
            //         } else {
            //             td.classList.add("htInvalid");
            //         }
            //     } else {
            //         td.innerText = value ?? "";
            //     }

            //     td.classList.add("htLeft");
            //     return td;
            // },
        },
        {
            name: "CollectionTurnaroundTime",
            header: "Collection Turnaround Time",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     const timeIn = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("PickupTimeIn")
            //     );
            //     const timeOut = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("PickupTimeOut")
            //     );
            //     const hasValidValues =
            //         timeIn != null &&
            //         timeOut != null &&
            //         timeIn != "" &&
            //         timeOut != "" &&
            //         timeIn != undefined &&
            //         timeOut != undefined;

            //     const formattedDiff = hasValidValues
            //         ? calculateTimeDifference(timeIn, timeOut)
            //         : "";

            //     td.innerText = formattedDiff;
            //     td.classList.add("htLeft");
            //     return td;
            // },
        },
        {
            name: "PickupAllowTime",
            header: "North Rock Allow Time (45Min)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     const timeIn = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("PickupTimeIn")
            //     );
            //     const timeOut = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("PickupTimeOut")
            //     );

            //     const formattedDiff = calculateAllowTime(timeIn, timeOut, 45);
            //     td.innerText = formattedDiff;

            //     td.classList.add("htLeft");
            //     return td;
            // },
        },
        {
            name: "CollectionDemurrageCharges",
            header: "Demurrage Charges ($97.85 Per Hr or $1.63 Per Minute)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     const timeIn = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("PickupTimeIn")
            //     );
            //     const timeOut = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("PickupTimeOut")
            //     );
            //     const demurrageCharges = calculateDemurrageCharges(
            //         timeIn,
            //         timeOut,
            //         45
            //     );
            //     td.innerText = `$ ${demurrageCharges.toFixed(2)}`;
            //     td.classList.add("htLeft");
            //     return td;
            // },
        },
        {
            name: "PickupReason",
            header: "Pickup Reason",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverName",
            header: "Delivery Point",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },

        {
            name: "DelTimeIn",
            header: "Time In",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     if (value != null) {
            //         let parts = value?.split(":");
            //         let shortTimeStr = parts?.slice(0, 2).join(":");
            //         td.innerText = shortTimeStr;

            //         td.classList.add("htLeft");
            //         return td;
            //     } else {
            //         td.innerText = "";
            //         td.classList.add("htLeft");
            //         return td;
            //     }
            // },
        },
        {
            name: "DelTimeOut",
            header: "Time Out",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     if (value != null) {
            //         let parts = value?.split(":");
            //         let shortTimeStr = parts?.slice(0, 2).join(":");
            //         td.innerText = shortTimeStr;

            //         td.classList.add("htLeft");
            //         return td;
            //     } else {
            //         td.innerText = "";
            //         td.classList.add("htLeft");
            //         return td;
            //     }
            // },
        },
        {
            name: "UnloadTime",
            header: "Unload Turnaround Time",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     if (value != null) {
            //         let parts = value?.split(":");
            //         let shortTimeStr = parts?.slice(0, 2).join(":");
            //         td.innerText = shortTimeStr;

            //         td.classList.add("htLeft");
            //         return td;
            //     } else {
            //         td.innerText = "";
            //         td.classList.add("htLeft");
            //         return td;
            //     }
            // },
        },
        {
            name: "DeliveryAllowTime",
            header: "Ingleburn Allow Time (30Min)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     const timeIn = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("DelTimeIn")
            //     );
            //     const timeOut = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("DelTimeOut")
            //     );

            //     const hasValidValues =
            //         timeIn != null &&
            //         timeOut != null &&
            //         timeIn != "" &&
            //         timeOut != "" &&
            //         timeIn != undefined &&
            //         timeOut != undefined;

            //     const formattedDiff = hasValidValues
            //         ? calculateAllowTime(timeIn, timeOut, 30)
            //         : "";
            //     td.innerText = formattedDiff;

            //     td.classList.add("htLeft");
            //     return td;
            // },
        },
        {
            name: "UnloadDemurrageCharges",
            header: "Unload Demurrage Charges ($97.85 Per Hr or $1.63 Per Minute)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     const timeIn = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("DelTimeIn")
            //     );
            //     const timeOut = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("DelTimeOut")
            //     );
            //     const demurrageCharges = calculateDemurrageCharges(
            //         timeIn,
            //         timeOut,
            //         30
            //     );
            //     td.innerText = `$ ${demurrageCharges.toFixed(2)}`;
            //     td.classList.add("htLeft");
            //     return td;
            // },
        },
        {
            name: "DeliveryReason",
            header: "Delivery Reason",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "TravelTime",
            header: "Travel time between sites",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     const deliveryTimeIn = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("DelTimeIn")
            //     );
            //     const pickupTimeOut = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("PickupTimeOut")
            //     );

            //     const formattedDiff = getTimeDifference(
            //         pickupTimeOut,
            //         deliveryTimeIn
            //     );

            //     td.innerText = formattedDiff;
            //     td.classList.add("htLeft");
            //     return td;
            // },
        },
        {
            name: "TotalCharge",
            header: "Total Charge Amount",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     const delTimeIn = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("DelTimeIn")
            //     );
            //     const delTimeOut = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("DelTimeOut")
            //     );
            //     const unloadDemurrageCharges = calculateDemurrageCharges(
            //         delTimeIn,
            //         delTimeOut,
            //         30
            //     );
            //     const pickupTimeIn = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("PickupTimeIn")
            //     );
            //     const pickupTimeOut = instance.getDataAtCell(
            //         row,
            //         instance.propToCol("PickupTimeOut")
            //     );
            //     const collectionDemurrageCharges = calculateDemurrageCharges(
            //         pickupTimeIn,
            //         pickupTimeOut,
            //         45
            //     );
            //     const unloadDemurrageNumber =
            //         typeof unloadDemurrageCharges === "string"
            //             ? Number(unloadDemurrageCharges)
            //             : unloadDemurrageCharges;
            //     const collectionDemurrageNumber =
            //         typeof collectionDemurrageCharges === "string"
            //             ? Number(collectionDemurrageCharges)
            //             : collectionDemurrageCharges;

            //     const sum = unloadDemurrageNumber + collectionDemurrageNumber;
            //     td.innerText = `$ ${sum.toFixed(2)}`;
            //     td.classList.add("htLeft");
            //     return td;
            // },
        },

        {
            name: "ProofOfDemurrage",
            header: "PROOF OF DEMURRAGE",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "RevisedUtilization",
            header: "Revised Utilisation%",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            // renderer: (instance, td, row, col, prop, value, cellProperties) => {
            //     const vehicleUtil = calculateUtilization(
            //         instance,
            //         row,
            //         "PalletsCollected",
            //         "PalletsVehicleCapacity"
            //     );

            //     const weightUtil = calculateUtilization(
            //         instance,
            //         row,
            //         "Weight",
            //         "WeightVehicleCapacity"
            //     );

            //     const max = Math.max(vehicleUtil, weightUtil);
            //     td.innerText = max + "%";
            //     td.classList.add("htLeft");
            //     return td;
            // },
        },
    ];

    const [selected, setSelected] = useState([]);
    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, utilizationData); // Fetch the filtered data

        // Dynamically create column mapping from the columns array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers for specific columns
        const customCellHandlers = {
            DespatchDateTime: (value) =>
                value ? formatDateToExcel(value) : "",
            DeliveryRequiredDateTime: (value) =>
                value ? formatDateToExcel(value) : "",
            SenderSuburb: (value, item) => item["Send_Suburb"] || value,
            SenderState: (value, item) => item["Send_State"] || value,
            ReceiverSuburb: (value, item) => item["Del_Suburb"] || value,
            ReceiverState: (value, item) => item["Del_State"] || value,
            POD: (value) => (value ? "True" : "False"),
            Timeslot: (value) => (value ? "True" : "False"),
            Status: (value, item) =>
                item["AdminStatusCodes_Description"] || value,
        };

        // Call the `exportToExcel` function
        exportToExcel(
            jsonData, // Filtered data
            columnMapping, // Dynamic column mapping from columns
            "NoDeliveryinfo.xlsx", // Export file name
            customCellHandlers, // Custom handlers for formatting cells
            ["DespatchDateTime", "DeliveryRequiredDateTime"] // Column names
        );
    };

    return isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
            <AnimatedLoading />
        </div>
    ) : (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
            <TableStructure
                id={"ConsignmentID"}
                gridRef={gridRef}
                handleDownloadExcel={handleDownloadExcel}
                title={"Unilever Utilization Report"}
                setFilterValueElements={setFilterValue}
                setSelected={setSelected}
                selected={selected}
                tableDataElements={utilizationData}
                filterValueElements={filterValue}
                columnsElements={columns}
            />
        </div>
    );
}
