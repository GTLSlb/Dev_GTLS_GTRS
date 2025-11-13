import { CustomContext } from "@/CommonContext";
import AnimatedLoading from "@/Components/AnimatedLoading";
import TableStructure from "@/Components/TableStructure";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { getFiltersTimeSlot } from "@/Components/utils/filters";
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
    handleSessionExpiration,
    renderConsDetailsLink,
} from "@/CommonFunctions";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
function TimeSlotReport() {
    const { url, Token, user, userPermissions } = useContext(CustomContext);
    const gridRef = useRef(null);
    const [selected] = useState({});
    const [timeSlotData, setTimeSlotData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        axios
            .get(`${url}/TimeSlotBooking`, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((res) => {
                const parsedData = res.data;
                setTimeSlotData(parsedData || []);
                const TimeslotRequiredOptions = createNewLabelObjects(
                    parsedData,
                    "TimeslotRequired"
                );
                const TimeslotBookedOptions = createNewLabelObjects(
                    parsedData,
                    "TimeslotBooked"
                );
                const OldDataOptions = createNewLabelObjects(
                    parsedData,
                    "OldData"
                );
                const NewDataOptions = createNewLabelObjects(
                    parsedData,
                    "NewData"
                );

                const ConsStatusOptions = createNewLabelObjects(
                    parsedData,
                    "ConsStatus"
                );
                const AdminStatusOptions = createNewLabelObjects(
                    parsedData,
                    "AdminStatus"
                );
                const minDateCreated = getMinMaxValue(
                    parsedData,
                    "ConsCreated",
                    1
                );
                const maxDateCreated = getMinMaxValue(
                    parsedData,
                    "ConsCreated",
                    2
                );
                const minDatePickup = getMinMaxValue(
                    parsedData,
                    "PickupCompletedDate",
                    1
                );
                const maxDatePickup = getMinMaxValue(
                    parsedData,
                    "PickupCompletedDate",
                    2
                );
                const minDateLogCreated = getMinMaxValue(
                    parsedData,
                    "PickupCompletedDate",
                    1
                );
                const maxDateLogCreated = getMinMaxValue(
                    parsedData,
                    "PickupCompletedDate",
                    2
                );
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
                                    {value == "TRUE" ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                            True
                                        </span>
                                    ) : value == "FALSE" ? (
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
                        name: "Information",
                        header: "Information",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 170,
                        filterEditor: StringFilter,
                    },
                    {
                        name: "OldData",
                        header: "Old Data",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: OldDataOptions,
                        },
                        render: ({ value }) => {
                            return (
                                <div>
                                    {value == "True" ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                            True
                                        </span>
                                    ) : value == "False" ? (
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
                        name: "NewData",
                        header: "New Data",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: NewDataOptions,
                        },
                        render: ({ value }) => {
                            return (
                                <div>
                                    {value == "True" ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                            True
                                        </span>
                                    ) : value == "False" ? (
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
                        name: "LogCreatedBy",
                        header: "Booked by",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 170,
                        filterEditor: StringFilter,
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
                    // Hidden for now may remove it or keep it as it is
                    // {
                    //     name: "AdminStatus",
                    //     header: "Admin Status",
                    //     type: "string",
                    //     defaultWidth: 200,
                    //     headerAlign: "center",
                    //     textAlign: "center",
                    //     filterEditor: SelectFilter,
                    //     filterEditorProps: {
                    //         multiple: true,
                    //         wrapMultiple: false,
                    //         dataSource: AdminStatusOptions,
                    //     },
                    // },
                    {
                        name: "ConsCreated",
                        header: "Consignment created at",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultFlex: 1,
                        minWidth: 200,
                        dateFormat: "DD-MM-YYYY",
                        filterable: true,
                        filterEditor: DateFilter,
                        filterEditorProps: {
                            minDate: minDateCreated,
                            maxDate: maxDateCreated,
                        },
                        render: ({ value }) => {
                            return moment(value).format("DD-MM-YYYY hh:mm A") ==
                                "Invalid date"
                                ? ""
                                : moment(value).format("DD-MM-YYYY hh:mm A");
                        },
                    },
                    {
                        name: "PickupCompletedDate",
                        header: "Pickup completed at",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultFlex: 1,
                        minWidth: 200,
                        dateFormat: "DD-MM-YYYY",
                        filterable: true,
                        filterEditor: DateFilter,
                        filterEditorProps: {
                            minDate: minDatePickup,
                            maxDate: maxDatePickup,
                        },
                        render: ({ value }) => {
                            return moment(value).format("DD-MM-YYYY hh:mm A") ==
                                "Invalid date"
                                ? ""
                                : moment(value).format("DD-MM-YYYY hh:mm A");
                        },
                    },
                    {
                        name: "LogCreated",
                        header: "Booking created at",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultFlex: 1,
                        minWidth: 200,
                        dateFormat: "DD-MM-YYYY",
                        filterable: true,
                        filterEditor: DateFilter,
                        filterEditorProps: {
                            minDate: minDateLogCreated,
                            maxDate: maxDateLogCreated,
                        },
                        render: ({ value }) => {
                            return moment(value).format("DD-MM-YYYY hh:mm A") ==
                                "Invalid date"
                                ? ""
                                : moment(value).format("DD-MM-YYYY hh:mm A");
                        },
                    },
                    {
                        name: "DiffConsTimeslot",
                        header: "Time taken to book from creation of Consignment",
                        group: "senderDetails",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 200,
                        filterEditor: StringFilter,
                    },
                    {
                        name: "DiffTimeslotPickup",
                        header: "Time taken to book from Pickup Completed.",
                        group: "senderDetails",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 200,
                        filterEditor: StringFilter,
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

    const [filtersValue, setFiltersValue] = useState(getFiltersTimeSlot());

    function handleDownloadExcel() {
        const jsonData = handleFilterTable(gridRef, timeSlotData);

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
                            Timeslot Booking Performance Report
                        </h1>
                        <h4 className="text-base px-2 font-extrabold text-gray-500">
                            This report returns only required timeslot consignments
                        </h4>
                    </div>
                </div>
            </>
        );
    };

    const renderTable = useCallback(() => {
        return (
            <div className="px-4 sm:px-6 pb-4 bg-smooth">
                <div className="px-4 sm:px-6 lg:px-0 w-full bg-smooth">
                    <TableStructure
                        handleDownloadExcel={handleDownloadExcel}
                        title={Title()}
                        id={"ConsignmentID"}
                        gridRef={gridRef}
                        selected={selected}
                        tableDataElements={timeSlotData}
                        filterValueElements={filtersValue}
                        setFilterValueElements={setFiltersValue}
                        columnsElements={columns}
                    />
                </div>
            </div>
        );
    }, [columns, timeSlotData, filtersValue, setFiltersValue]);

    return loading ? <AnimatedLoading /> : renderTable();
}

export default TimeSlotReport;
