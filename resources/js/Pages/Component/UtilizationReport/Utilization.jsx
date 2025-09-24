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
import { forwardRef, useImperativeHandle } from "react";
import { PencilIcon } from "@heroicons/react/20/solid";
import { canEditUtilizationReport } from "@/permissions";
import UtilizationModal from "./UtilizationModal";
import moment from "moment";

export default function Utilization() {
    const gridRef = useRef(null);
    const { url, Token, user, userPermissions } = useContext(CustomContext);
    const [utilizationData, setUtilizationData] = useState();
    const minDate = getMinMaxValue(utilizationData, "ManifestDateTime", 1);
    const maxDate = getMinMaxValue(utilizationData, "ManifestDateTime", 2);
    const [filterValue, setFilterValue] = useState(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchUtilizationReportData();
    }, []);

    useEffect(() => {
        if(utilizationData && minDate != null && maxDate != null){
            setFilterValue(getFiltersUtilization(minDate, maxDate));
        }
    }, [utilizationData]);
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
                console.error(err);

                if (typeof setCellLoading === "function") {
                    setCellLoading(null);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const TimeFilter = forwardRef(({ filterValue, onChange }, ref) => {
        const [value, setValue] = useState(
            filterValue ? filterValue.value : ""
        );

        const handleChange = (event) => {
            const newValue = event.target.value + ":00";
            setValue(newValue);
            onChange({
                name: filterValue.name,
                value: newValue,
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        const handleClear = () => {
            setValue("");
            onChange({
                name: filterValue.name,
                value: "",
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        useEffect(() => {
            setValue(filterValue ? filterValue.value : "");
        }, [filterValue]);

        useImperativeHandle(ref, () => ({
            setValue: (newValue) => {
                setValue(newValue);
            },
        }));

        return (
            <div className="flex gap-2 p-[4px]">
                <input
                    type="time"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm h-[32px]"
                    value={value.slice(0, 5)}
                    onChange={handleChange}
                />
                <button onClick={handleClear}>
                    <svg
                        tabIndex="0"
                        className="InovuaReactDataGrid__column-header__filter-settings-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                    >
                        <path
                            fillRule="evenodd"
                            d="M13.222 2H.778C.348 2 0 1.552 0 1s.348-1 .778-1h12.444c.43 0 .778.448.778 1s-.348 1-.778 1zM1.556 3.111l3.888 4.667v5.444c0 .43.349.778.778.778h1.556c.43 0 .778-.348.778-.778V7.778l3.888-4.667H1.556z"
                        ></path>
                    </svg>
                </button>
            </div>
        );
    });

    const scrollIntoView = () => {
        const button = document.getElementById("modal-title");
        if (button) {
            button.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
            });
        }
    };

    const columns = useMemo(() => {
        // Return null if we don't have the required data yet
        if (!utilizationData || minDate == null || maxDate == null || filterValue == null) {
            setIsLoading(true);
            return null;
        }

        const baseColumns = [
        {
            name: "ManifestDateTime",
            header: "Date",
            type: "date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
            },
            render: ({ value, cellProps }) => {
                return value == undefined || value == null
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A") ==
                      "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY");
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
            defaultWidth: 230,
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return `${value} %`;
            },
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
            defaultWidth: 180,
            filterEditor: StringFilter,
        },
        {
            name: "WeightUtilization",
            header: "Load Weight Utilisation (%)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 230,
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return `${value} %`;
            }
        },
        {
            name: "PickupTimeIn",
            header: "Pickup Time In",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: TimeFilter,
        },
        {
            name: "PickupTimeOut",
            header: "Pickup Time Out",
            type: "text",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: TimeFilter,
        },
        {
            name: "CollectionTime",
            header: "Collection Turnaround Time",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 230,
            filterEditor: StringFilter,
        },
        {
            name: "PickupAllowTime",
            header: "North Rock Allow Time (45Min)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 270,
        },
        {
            name: "CollectionDemurrageCharges",
            header: "Demurrage Charges ($97.85 Per Hr or $1.63 Per Minute)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 400,
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
            filterEditor: TimeFilter,
        },
        {
            name: "DelTimeOut",
            header: "Time Out",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: TimeFilter,
        },
        {
            name: "ExtraUnloadTimeInMinutes",
            header: "Unload Turnaround Time",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "DeliveryAllowTime",
            header: "Ingleburn Allow Time (30Min)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 270,
            filterEditor: StringFilter,
        },
        {
            name: "UnloadDemurrageCharges",
            header: "Unload Demurrage Charges ($97.85 Per Hr or $1.63 Per Minute)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 470,
            filterEditor: StringFilter,
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
            defaultWidth: 210,
            filterEditor: StringFilter,
        },
        {
            name: "TotalCharge",
            header: "Total Charge Amount",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },

        {
            name: "ProofOfDemurrage",
            header: "Proof Of Demurrage",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "RevisedUtilization",
            header: "Revised Utilisation %",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 210,
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return `${Math.max(data.WeightUtilization, data.PalletUtilization)} %`;
            },
        },
    ];

        // Add edit column only if user has edit permissions
        if (userPermissions && !canEditUtilizationReport(userPermissions)) {
            baseColumns.push({
                name: "edit",
                header: "Edit",
                headerAlign: "center",
                textAlign: "center",
                defaultWidth: 100,
                render: ({ data }) => {
                    return (
                        <div>
                            <button
                                className="rounded text-blue-500 justify-center items-center"
                                onClick={() => {
                                    handleEditClick(data);
                                    scrollIntoView();
                                }}
                            >
                                <span className="flex gap-x-1">
                                    <PencilIcon className="h-4" />
                                    Edit
                                </span>
                            </button>
                        </div>
                    );
                },
            });
        }
        setIsLoading(false);
        return baseColumns;
    }, [utilizationData, userPermissions, minDate, maxDate, filterValue]);

    function handleEditClick(object) {
        // Open edit module with the selected object
        setSelected(object);
        setShowEdit(true);
    }

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
        <div id="TitleSection" className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
            <UtilizationModal
                isOpen={showEdit}
                handleClose={() => setShowEdit(false)}
                item={selected}
                fetchUtilizationReportData={fetchUtilizationReportData}
            />
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
