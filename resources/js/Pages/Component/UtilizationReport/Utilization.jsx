import TableStructure from "@/Components/TableStructure";
import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import swal from "sweetalert";
import { CustomContext } from "@/CommonContext";
import {
    handleSessionExpiration,
    renderConsDetailsLink,
    formatDateToExcel,
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
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";

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
    const isALink = (value) => {
        const urlPattern = new RegExp(
            "^(https?:\\/\\/)?" + // protocol
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                "(\\#[-a-z\\d_]*)?$",
            "i"
        ); // fragment locator
        return !!urlPattern.test(value);
    }
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
            name: "SenderReference",
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
            filterEditor: NumberFilter,
        },
        {
            name: "PalletsVehicleCapacity",
            header: "Vehicle Capacity",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: NumberFilter,
        },
        {
            name: "PalletUtilization",
            header: "Vehicle Pallet Utilisation (%)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 230,
            filterEditor: NumberFilter,
            render: ({ value, data }) => {
                return (
                    <div className="flex justify-center items-center">
                        <span>{value} %</span>
                    </div>
                );
            },
        },
        {
            name: "Weight",
            header: "Load Weight (T)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: NumberFilter,
        },
        {
            name: "WeightVehicleCapacity",
            header: "Vehicle Capacity (T)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 180,
            filterEditor: NumberFilter,
        },
        {
            name: "WeightUtilization",
            header: "Load Weight Utilisation (%)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 230,
            filterEditor: NumberFilter,
            render: ({ value, data }) => {
                return (
                    <div className="flex justify-center items-center">
                        <span>{value} %</span>
                    </div>
                );
            },
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
            filterEditor: TimeFilter,
        },
        {
            name: "ExtraCollectionTimeInMinutes",
            // header: "North Rock Allow Time (45Min)",
            header: "Extra Pickup Time (45Min)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 270,
            filterEditor: NumberFilter,
        },
        {
            name: "CollectionDemurrageCharges",
            header: "Demurrage Charges ($1.75 Per Minute)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 400,
            filterEditor: NumberFilter,
            render: ({ value, data }) => {
                return (
                    <div className="flex justify-center items-center">
                        <span>${value.toFixed(2)}</span>
                    </div>
                );
            },
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
            header: "Delivery Time In",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: TimeFilter,
        },
        {
            name: "DelTimeOut",
            header: "Delivery Time Out",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: TimeFilter,
        },
        {
            name: "UnloadTime",
            header: "Unload Turnaround Time",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: TimeFilter,
        },
        {
            name: "ExtraUnloadTimeInMinutes",
            // header: "Ingleburn Allow Time (30Min)",
            header: "Extra Delivery Time (30Min)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 270,
            filterEditor: NumberFilter,
        },
        {
            name: "UnloadDemurrageCharges",
            header: "Unload Demurrage Charges ($1.75 Per Minute)",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 470,
            filterEditor: NumberFilter,
            render: ({ value, data }) => {
                return (
                    <div className="flex justify-center items-center">
                        <span>$ {value.toFixed(2)}</span>
                    </div>
                );
            },
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
            filterEditor: TimeFilter,
        },
        {
            name: "TotalCharge",
            header: "Total Charge Amount",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: NumberFilter,
            render: ({ value, data }) => {
                return (
                    <div className="flex justify-center items-center">
                        <span>$ {value}</span>
                    </div>
                );
            },
        },
        {
            name: "ProofOfDemurrage",
            header: "Proof Of Demurrage",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 250,
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                const links = value.split('\n').map((link, index) => (
                    <div key={index} className={`flex justify-center items-center ${isALink(link) && `text-blue-500 underline cursor-pointer`}`}>
                        {isALink(link) ? <a target="_blank" href={link}>{link}</a> : <span>{link}</span>}
                    </div>
                ));
                return (
                    <div className="flex flex-col justify-center items-center">
                        {links}
                    </div>
                );
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
            // Date format like this "dd-mm-yyyy"
            ManifestDateTime: (value) =>
                value ? formatDateToExcel(value, "dd-mm-yyyy") : "",
            PalletUtilization: (value) => (typeof value === "number" ? `${value} %` : 0),
            WeightUtilization: (value) => (typeof value === "number" ? `${value} %` : 0),
            CollectionDemurrageCharges: (value) => (typeof value === "number" ? `$${value.toFixed(2)}` : "$0.00"),
            UnloadDemurrageCharges: (value) => (typeof value === "number" ? `$${value.toFixed(2)}` : "$0.00"),
            TotalCharge: (value) => (typeof value === "number" ? `$${value}` : "$0"),
        };

        // Call the `exportToExcel` function
        exportToExcel(
            jsonData, // Filtered data
            columnMapping, // Dynamic column mapping from columns
            "ShuttleUtilisationReport.xlsx", // Export file name
            customCellHandlers, // Custom handlers for formatting cells
            ["ManifestDateTime"], // Column names
            [
                { field: "ManifestDateTime", format: "dd-mm-yyyy" },
            ]
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
                title={"Shuttle Utilisation Report"}
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
