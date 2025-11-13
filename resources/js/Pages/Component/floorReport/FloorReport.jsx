import { CustomContext } from "@/CommonContext";
import AnimatedLoading from "@/Components/AnimatedLoading";
import TableStructure from "@/Components/TableStructure";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import {
    getFiltersFloorReport,
    getFiltersTimeSlot,
} from "@/Components/utils/filters";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import axios from "axios";
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import swal from "sweetalert";
import {
    convertToIso,
    handleSessionExpiration,
    renderConsDetailsLink,
} from "@/CommonFunctions";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import {
    Card,
    CardBody,
    Chip,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";

function FloorReport() {
    const { url, Token, user, userPermissions } = useContext(CustomContext);
    const gridRef = useRef(null);
    const [selected] = useState({});
    const [floorData, setFloorData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});

    const renderRowDetailsWithTable = ({ data, rowIndex }) => {
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

    const renderRowDetails = useCallback(({ data, rowIndex }) => {
        return (
            <div
                style={{
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    borderTop: "1px solid #e0e0e0",
                }}
            >
                <div className="grid grid-cols-2 gap-6">
                    {/* Left Column - Sender Details */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">
                            Sender Details
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Name:
                                </span>
                                <span className="text-gray-800">
                                    {data.SenderName || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    State:
                                </span>
                                <span className="text-gray-800">
                                    {data.SenderState || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Zone:
                                </span>
                                <span className="text-gray-800">
                                    {data.SenderZone || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Suburb:
                                </span>
                                <span className="text-gray-800">
                                    {data.SenderSuburb || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Receiver Details */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">
                            Receiver Details
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Name:
                                </span>
                                <span className="text-gray-800">
                                    {data.ReceiverName || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    State:
                                </span>
                                <span className="text-gray-800">
                                    {data.ReceiverState || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Zone:
                                </span>
                                <span className="text-gray-800">
                                    {data.ReceiverZone || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Suburb:
                                </span>
                                <span className="text-gray-800">
                                    {data.ReceiverSuburb || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operational Details */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                    <div>
                        <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">
                            Operational Info
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Depot:
                                </span>
                                <span className="text-gray-800">
                                    {data.Depot || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Dock Location:
                                </span>
                                <span className="text-gray-800">
                                    {data.DockLocation || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Scan Action:
                                </span>
                                <span className="text-gray-800">
                                    {data.ScanAction || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Account Name:
                                </span>
                                <span className="text-gray-800">
                                    {data.ChargeTo || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">
                            Status & Dates
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Status:
                                </span>
                                <span className="text-gray-800">
                                    {data.ConsStatus || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Event Date:
                                </span>
                                <span className="text-gray-800">
                                    {moment(data.EventDateTime).format(
                                        "DD-MM-YYYY hh:mm A"
                                    ) === "Invalid date"
                                        ? "N/A"
                                        : moment(data.EventDateTime).format(
                                              "DD-MM-YYYY hh:mm A"
                                          )}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    RDD:
                                </span>
                                <span className="text-gray-800">
                                    {moment(data.RDD).format(
                                        "DD-MM-YYYY hh:mm A"
                                    ) === "Invalid date"
                                        ? "N/A"
                                        : moment(data.RDD).format(
                                              "DD-MM-YYYY hh:mm A"
                                          )}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Despatch Date:
                                </span>
                                <span className="text-gray-800">
                                    {moment(data.DespatchDateTime).format(
                                        "DD-MM-YYYY hh:mm A"
                                    ) === "Invalid date"
                                        ? "N/A"
                                        : moment(data.DespatchDateTime).format(
                                              "DD-MM-YYYY hh:mm A"
                                          )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeslot Info */}
                <div className="mt-6 pt-4 border-t">
                    <h4 className="font-bold text-gray-800 mb-3">
                        Timeslot Information
                    </h4>
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-600">
                                Timeslot Required:
                            </span>
                            {data.TimeslotRequired === "YES" ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                    Yes
                                </span>
                            ) : data.TimeslotRequired === "NO" ? (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                    No
                                </span>
                            ) : (
                                <span>N/A</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-600">
                                Timeslot Booked:
                            </span>
                            {data.TimeslotBooked === "YES" ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                    Yes
                                </span>
                            ) : data.TimeslotBooked === "NO" ? (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                    No
                                </span>
                            ) : (
                                <span>N/A</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }, []);

    useEffect(() => {
        axios
            .get(`${url}/FloorReport`, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((res) => {
                const rawData = res.data;
                const parsedData = rawData.map((item) => {
                    if (item.OldRdd) {
                        return {
                            ...item,
                            OldRdd: convertToIso(item.OldRdd),
                            NewRdd: convertToIso(item.NewRdd),
                        };
                    }
                    return item;
                });
                setFloorData(parsedData || []);

                const senderStateOptions = createNewLabelObjects(
                    parsedData,
                    "SenderState"
                );
                const senderZoneOptions = createNewLabelObjects(
                    parsedData,
                    "SenderZone"
                );
                const senderSuburbOptions = createNewLabelObjects(
                    parsedData,
                    "SenderSuburb"
                );
                const receiverStateOptions = createNewLabelObjects(
                    parsedData,
                    "ReceiverState"
                );
                const receiverZoneOptions = createNewLabelObjects(
                    parsedData,
                    "ReceiverZone"
                );
                const receiverSuburbOptions = createNewLabelObjects(
                    parsedData,
                    "ReceiverSuburb"
                );
                const ConsStatusOptions = createNewLabelObjects(
                    parsedData,
                    "ConsStatus"
                );
                const ScanActionsOptions = createNewLabelObjects(
                    parsedData,
                    "ScanAction"
                );
                const DockLocationOptions = createNewLabelObjects(
                    parsedData,
                    "DockLocation"
                );
                const DepotOptions = createNewLabelObjects(parsedData, "Depot");
                const TimeslotRequiredOptions = createNewLabelObjects(
                    parsedData,
                    "TimeslotRequired"
                );
                const TimeslotBookedOptions = createNewLabelObjects(
                    parsedData,
                    "TimeslotBooked"
                );
                const minDespatchDateCreated = getMinMaxValue(
                    parsedData,
                    "DespatchDateTime",
                    1
                );
                const maxDespatchDateCreated = getMinMaxValue(
                    parsedData,
                    "ConsCreated",
                    2
                );
                const minEventDateCreated = getMinMaxValue(
                    parsedData,
                    "EventDateTime",
                    1
                );
                const maxEventDateCreated = getMinMaxValue(
                    parsedData,
                    "EventDateTime",
                    2
                );

                const minDateOldRdd = getMinMaxValue(parsedData, "OldRdd", 1);
                const maxDateOldRdd = getMinMaxValue(parsedData, "OldRdd", 2);

                const minDateNewRdd = getMinMaxValue(parsedData, "NewRdd", 1);
                const maxDateNewRdd = getMinMaxValue(parsedData, "NewRdd", 2);

                const minRDDDate = getMinMaxValue(parsedData, "RDD", 1);
                const maxRDDDate = getMinMaxValue(parsedData, "RDD", 2);

                setColumns([
                    {
                        name: "ConsignmentNo",
                        header: "Cons No",
                        group: "personalInfo",
                        filterEditor: StringFilter,
                        headerAlign: "center",
                        textAlign: "center",
                        render: ({ value, data }) => {
                            return renderConsDetailsLink(
                                userPermissions,
                                value,
                                data.ConsignmentID
                            );
                        },
                    },
                    {
                        name: "ChargeTo",
                        header: "Account Name",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 170,
                        filterEditor: StringFilter,
                    },
                    {
                        name: "DespatchDateTime",
                        header: "Despatch Data",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultFlex: 1,
                        minWidth: 200,
                        dateFormat: "DD-MM-YYYY",
                        filterable: true,
                        filterEditor: DateFilter,
                        filterEditorProps: {
                            minDate: minDespatchDateCreated,
                            maxDate: maxDespatchDateCreated,
                        },
                        render: ({ value }) => {
                            return moment(value).format("DD-MM-YYYY hh:mm A") ==
                                "Invalid date"
                                ? ""
                                : moment(value).format("DD-MM-YYYY hh:mm A");
                        },
                    },
                    {
                        name: "SenderName",
                        header: "Sender Name",
                        group: "senderDetails",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 200,
                        filterEditor: StringFilter,
                    },
                    {
                        name: "SenderState",
                        header: "Sender State",
                        group: "senderDetails",
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: senderStateOptions,
                        },
                    },
                    {
                        name: "SenderSuburb",
                        header: "Sender Suburb",
                        group: "senderDetails",
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: senderSuburbOptions,
                        },
                    },
                    {
                        name: "SenderZone",
                        header: "Sender Zone",
                        group: "senderDetails",
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: senderZoneOptions,
                        },
                    },
                    {
                        name: "ReceiverName",
                        header: "Receiver Name",
                        group: "receiverDetails",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 200,
                        filterEditor: StringFilter,
                    },
                    {
                        name: "ReceiverState",
                        header: "Receiver State",
                        group: "receiverDetails",
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: receiverStateOptions,
                        },
                    },
                    {
                        name: "ReceiverSuburb",
                        header: "Receiver Suburb",
                        group: "receiverDetails",
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: receiverSuburbOptions,
                        },
                    },
                    {
                        name: "ReceiverZone",
                        header: "Receiver Zone",
                        group: "receiverDetails",
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: receiverZoneOptions,
                        },
                    },
                    {
                        name: "ConsStatus",
                        header: "Cons Status",
                        type: "string",
                        defaultWidth: 200,
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: ConsStatusOptions,
                        },
                    },
                    {
                        name: "EventDateTime",
                        header: "Event Date",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultFlex: 1,
                        minWidth: 200,
                        dateFormat: "DD-MM-YYYY",
                        filterable: true,
                        filterEditor: DateFilter,
                        filterEditorProps: {
                            minDate: minEventDateCreated,
                            maxDate: maxEventDateCreated,
                        },
                        render: ({ value }) => {
                            return moment(value).format("DD-MM-YYYY hh:mm A") ==
                                "Invalid date"
                                ? ""
                                : moment(value).format("DD-MM-YYYY hh:mm A");
                        },
                    },
                    {
                        name: "ActualScanned",
                        header: "Actual Scanned",
                        type: "number",
                        defaultWidth: 150,
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: NumberFilter,
                    },
                    {
                        name: "OriginPalletSpaces",
                        header: "Origin Pallet Spaces",
                        type: "number",
                        defaultWidth: 150,
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: NumberFilter,
                    },
                    {
                        name: "OldRdd",
                        header: "Original RDD",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 170,
                        dateFormat: "DD-MM-YYYY",
                        filterEditor: DateFilter,

                        render: ({ value }) => {
                            return moment(value).format("DD-MM-YYYY hh:mm A") ==
                                "Invalid date"
                                ? ""
                                : moment(value).format("DD-MM-YYYY hh:mm A");
                        },
                    },
                    {
                        name: "NewRdd",
                        header: "New RDD",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 170,
                        dateFormat: "DD-MM-YYYY",
                        filterEditor: DateFilter,
                        filterEditorProps: {
                            minDate: minDateOldRdd,
                            maxDate: maxDateOldRdd,
                        },
                        render: ({ value }) => {
                            return moment(value).format("DD-MM-YYYY hh:mm A") ==
                                "Invalid date"
                                ? ""
                                : moment(value).format("DD-MM-YYYY hh:mm A");
                        },
                    },

                    {
                        name: "RDD",
                        header: "RDD",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultFlex: 1,
                        minWidth: 200,
                        dateFormat: "DD-MM-YYYY",
                        filterable: true,
                        filterEditor: DateFilter,
                        filterEditorProps: {
                            minDate: minRDDDate,
                            maxDate: maxRDDDate,
                        },
                        render: ({ value }) => {
                            return moment(value).format("DD-MM-YYYY hh:mm A") ==
                                "Invalid date"
                                ? ""
                                : moment(value).format("DD-MM-YYYY hh:mm A");
                        },
                    },
                    {
                        name: "TimeslotRequired",
                        header: "Timeslot required",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: TimeslotRequiredOptions,
                        },
                        render: ({ value }) => {
                            return (
                                <div>
                                    {value == "YES" ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                            True
                                        </span>
                                    ) : value == "NO" ? (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                            False
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            );
                        },
                    },
                    {
                        name: "TimeslotBooked",
                        header: "Timeslot Booked",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: TimeslotBookedOptions,
                        },
                        render: ({ value }) => {
                            return (
                                <div>
                                    {value == "YES" ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                            True
                                        </span>
                                    ) : value == "NO" ? (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                            False
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            );
                        },
                    },
                    {
                        name: "ScanAction",
                        header: "Scan Action",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 170,
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: ScanActionsOptions,
                        },
                    },

                    {
                        name: "DockLocation",
                        header: "Dock Location",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 170,
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: DockLocationOptions,
                        },
                    },
                    {
                        name: "Depot",
                        header: "Depot",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 170,
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: DepotOptions,
                        },
                    },
                ]);
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
                }
            });
    }, [userPermissions, Token, url]);

    const [filtersValue, setFiltersValue] = useState(getFiltersFloorReport());

    function handleDownloadExcel() {
        const jsonData = handleFilterTable(gridRef, floorData);

        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        const customCellHandlers = {
            ConsCreated: (value) => {
                const date = new Date(value);
                return !isNaN(date)
                    ? (date.getTime() - date.getTimezoneOffset() * 60000) /
                          86400000 +
                          25569
                    : "";
            },
            PickupCompletedDate: (value) => {
                const date = new Date(value);
                return !isNaN(date)
                    ? (date.getTime() - date.getTimezoneOffset() * 60000) /
                          86400000 +
                          25569
                    : "";
            },
            LogCreated: (value) => {
                const date = new Date(value);
                return !isNaN(date)
                    ? (date.getTime() - date.getTimezoneOffset() * 60000) /
                          86400000 +
                          25569
                    : "";
            },
        };

        exportToExcel(
            jsonData,
            columnMapping,
            "TimeSlot-Data.xlsx",
            customCellHandlers,
            ["ConsCreated", "PickupCompletedDate", "LogCreated"]
        );
    }

    const Title = () => {
        return (
            <>
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto md:mt-2">
                        <h1 className="text-2xl px-2 font-extrabold text-gray-600">
                            Floor Report
                        </h1>
                    </div>
                </div>
            </>
        );
    };

    const groups = [
        {
            name: "senderDetails",
            header: "Sender Details",
            headerAlign: "center",
        },
        {
            name: "receiverDetails",
            header: "Receiver Details",
            headerAlign: "center",
        },
    ];

    const renderTable = useCallback(() => {
        return (
            <div className="px-4 sm:px-6 pb-4 bg-smooth">
                <div className="px-4 sm:px-6 lg:px-0 w-full bg-smooth">
                    <TableStructure
                        handleDownloadExcel={handleDownloadExcel}
                        title={Title()}
                        id={"ConsignmentNo"}
                        gridRef={gridRef}
                        selected={selected}
                        tableDataElements={floorData}
                        filterValueElements={filtersValue}
                        setFilterValueElements={setFiltersValue}
                        columnsElements={columns}
                        renderRowDetails={renderRowDetailsWithTable}
                        rowExpandHeight={400}
                        groupsElements={groups}
                        detailsDisplayMode="modal"
                    />
                </div>
            </div>
        );
    }, [
        columns,
        floorData,
        filtersValue,
        setFiltersValue,
        expandedRows,
        renderRowDetails,
        renderRowDetailsWithTable,
    ]);

    return loading ? <AnimatedLoading /> : renderTable();
}

export default FloorReport;
