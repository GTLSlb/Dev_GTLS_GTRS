import { useRef, useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import SetFailedReasonModal from "@/Components/SetFailedReasonModal";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import TableStructure from "@/Components/TableStructure";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { canEditFailedConsignments } from "@/permissions";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { formatDateToExcel } from "@/CommonFunctions";
import ExportPopover from "@/Components/ExportPopover";
import { useNavigate } from "react-router-dom";

export default function FailedCons({
    PerfData,
    failedReasons,
    url,
    setIncidentId,
    AToken,
    filterValue,
    setFilterValue,
    setActiveIndexGTRS,
    setLastIndex,
    setactiveCon,
    currentUser,
    userPermission,
    accData,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [reason, setReason] = useState();
    const handleEditClick = (reason) => {
        setReason(reason);
        setIsModalOpen(!isModalOpen);
    };
    // const data = PerfData.filter((obj) => obj.STATUS === "FAIL");
    const handleClick = (coindex) => {
        navigate("/gtrs/consignment-details", { state: { activeCons: coindex } });
    };
    const excludedDebtorIds = [1514, 364, 247, 246, 245, 244];
    const [data, setData] = useState(
        PerfData?.filter(
            (obj) =>
                obj.Status === "FAIL" &&
                !excludedDebtorIds.includes(obj.ChargeToID)
        )
    );
    const [filteredData, setFilteredData] = useState(data);
    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = data?.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeToID);

            return chargeToMatch;
        });
        return filtered;
    };
    useEffect(() => {
        setFilteredData(filterData());
    }, [accData]);

    const reasonOptions = failedReasons?.map((reason) => ({
        id: reason.ReasonId,
        label: reason.ReasonName,
    }));
    const referenceOptions = [
        {
            id: 1,
            label: "Internal",
        },
        {
            id: 2,
            label: "External",
        },
    ];
    const groups = [
        {
            name: "senderInfo",
            header: "Sender Details",
            headerAlign: "center",
        },
        {
            name: "receiverInfo",
            header: "Receiver Details",
            headerAlign: "center",
        },
    ];
    const senderZoneOptions = createNewLabelObjects(data, "SenderState");
    const receiverZoneOptions = createNewLabelObjects(data, "ReceiverState");
    const states = createNewLabelObjects(data, "State");
    const departments = createNewLabelObjects(data, "Department");
    // Usage example remains the same
    const minKPIDate = getMinMaxValue(data, "KpiDatetime", 1);
    const maxKPIDate = getMinMaxValue(data, "KpiDatetime", 2);

    const minDespatchDate = getMinMaxValue(data, "DespatchDate", 1);
    const maxDespatchDate = getMinMaxValue(data, "DespatchDate", 2);

    const minRddDate = getMinMaxValue(data, "DeliveryRequiredDateTime", 1);
    const maxRddDate = getMinMaxValue(data, "DeliveryRequiredDateTime", 2);

    const minArrivedDate = getMinMaxValue(data, "ArrivedDatetime", 1);
    const maxArrivedDate = getMinMaxValue(data, "ArrivedDatetime", 2);

    const minDeliveredDate = getMinMaxValue(data, "DeliveredDate", 1);
    const maxDeliveredDate = getMinMaxValue(data, "DeliveredDate", 2);

    const Roles = ["1", "3", "4", "5"];

    const columns = [
        {
            name: "ConsignmentNo",
            header: "Cons No",
            headerAlign: "center",
            textAlign: "center",
            group: "personalInfo",
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 hover:cursor-pointer"
                        onClick={() => handleClick(data.ConsignmentID)}
                    >
                        {" "}
                        {value}
                    </span>
                );
            },
        },
        {
            name: "IncidentNo",
            defaultWidth: 170,
            header: "Incident No",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 hover:cursor-pointer"
                        onClick={() => {
                            navigate("/gtrs/incident", { state: { incidentId: data.IncidentId } });
                        }}
                    >
                        {" "}
                        {value}
                    </span>
                );
            },
            filterEditor: StringFilter,
        },
        {
            name: "IncidentTypeName",
            defaultWidth: 170,
            header: "Incident Type",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            render: ({ value, data }) => {
                return <span className=""> {value}</span>;
            },
            filterEditor: StringFilter,
        },
        {
            name: "IncidentStatusName",
            header: "Status",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            render: ({ value, data }) => {
                return <span className=""> {data.IncidentStatusName}</span>;
            },
        },
        {
            name: "SenderName",
            defaultWidth: 170,
            header: "Sender Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",

            group: "senderInfo",
            filterEditor: StringFilter,
        },
        {
            name: "SenderReference",
            defaultWidth: 170,
            header: "Sender Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            group: "senderInfo",
            filterEditor: StringFilter,
        },
        {
            name: "SenderState",
            header: "Sender State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            group: "senderInfo",
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
            type: "string",
            defaultWidth: 170,
            headerAlign: "center",
            textAlign: "center",
            group: "receiverInfo",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            type: "string",
            defaultWidth: 170,
            headerAlign: "center",
            textAlign: "center",
            group: "receiverInfo",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverState",
            header: "Receiver State",
            headerAlign: "center",
            textAlign: "center",
            group: "receiverInfo",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverZoneOptions,
            },
        },
        {
            name: "Service",
            header: "Service",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "KpiDatetime",
            header: "KPI DateTime",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditorProps: {
                minDate: minKPIDate,
                maxDate: maxKPIDate,
            },
            filterEditor: DateFilter,
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "DespatchDate",
            header: "Despatch Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDespatchDate,
                maxDate: maxDespatchDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "DeliveryRequiredDateTime",
            header: "RDD",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditorProps: {
                minDate: minRddDate,
                maxDate: maxRddDate,
            },
            filterEditor: DateFilter,
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "ArrivedDatetime",
            header: "Arrived time",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditorProps: {
                minDate: minArrivedDate,
                maxDate: maxArrivedDate,
            },
            filterEditor: DateFilter,
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "DeliveredDate",
            header: "Delivered time",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditorProps: {
                minDate: minDeliveredDate,
                maxDate: maxDeliveredDate,
            },
            filterEditor: DateFilter,
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "POD",
            header: "POD",
            headerAlign: "center",
            textAlign: "center",
            render: ({ value }) => {
                return value ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        True
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        false
                    </span>
                );
            },
        },
        // {
        //     name: "FailedReason",
        //     header: "Reason",
        //     headerAlign: "center",
        //     textAlign: "start",
        //     defaultWidth: 300,
        //     filterEditor: SelectFilter,
        //     filterEditorProps: {
        //         multiple: true,
        //         wrapMultiple: false,
        //         dataSource: reasonOptions,
        //     },
        //     render: ({ value }) => {
        //         return (
        //             <div>
        //                 {/* {value} */}
        //                 {
        //                     failedReasons?.find(
        //                         (reason) => reason.ReasonId === value
        //                     )?.ReasonName
        //                 }
        //             </div>
        //         );
        //     },
        // },
        // {
        //     name: "FailedReasonDesc",
        //     header: "Main cause",
        //     headerAlign: "center",
        //     textAlign: "start",
        //     defaultWidth: 300,
        //     filterEditor: StringFilter,
        // },
        // {
        //     name: "State",
        //     header: "State",
        //     headerAlign: "center",
        //     textAlign: "center",
        //     filterEditor: SelectFilter,
        //     filterEditorProps: {
        //         multiple: true,
        //         wrapMultiple: false,
        //         dataSource: states,
        //     },
        // },
        // {
        //     name: "Reference",
        //     header: "Reference",
        //     headerAlign: "center",
        //     textAlign: "center",
        //     filterEditor: SelectFilter,
        //     filterEditorProps: {
        //         multiple: true,
        //         wrapMultiple: false,
        //         dataSource: referenceOptions,
        //     },
        //     render: ({ value }) => {
        //         return value == 1 ? (
        //             <span>Internal</span>
        //         ) : value == 2 ? (
        //             <span>External</span>
        //         ) : (
        //             <span></span>
        //         );
        //     },
        // },
        // {
        //     name: "Department",
        //     header: "Department",
        //     headerAlign: "center",
        //     textAlign: "start",
        //     filterEditor: SelectFilter,
        //     filterEditorProps: {
        //         multiple: true,
        //         wrapMultiple: false,
        //         dataSource: departments,
        //     },
        // },
        // {
        //     name: "OccuredAt",
        //     header: "Occured at",
        //     headerAlign: "center",
        //     textAlign: "center",
        //     defaultWidth: 170,
        //     dateFormat: "DD-MM-YYYY",
        //     filterEditor: DateFilter,
        //     render: ({ value, cellProps }) => {
        //         return moment(value).format("DD-MM-YYYY hh:mm A") ==
        //             "Invalid date"
        //             ? ""
        //             : moment(value).format("DD-MM-YYYY hh:mm A");
        //     },
        // },
        // {
        //     name: "FailedNote",
        //     header: "Explanation",
        //     headerAlign: "center",
        //     textAlign: "start",
        // },
        // {
        //     header: "Edit",
        //     headerAlign: "center",
        //     textAlign: "center",
        //     defaultWidth: 100,
        //     render: ({ value, data }) => {
        //         return (
        //             <div>
        //                 {canEditFailedConsignments(currentUser) ? (
        //                     <button
        //                         className={
        //                             "rounded text-blue-500 justify-center items-center  "
        //                         }
        //                         onClick={() => {
        //                             handleEditClick(data);
        //                         }}
        //                     >
        //                         <span className="flex gap-x-1">
        //                             <PencilIcon className="h-4" />
        //                             Edit
        //                         </span>
        //                     </button>
        //                 ) : (
        //                     <div></div>
        //                 )}
        //             </div>
        //         );
        //     },
        // },
    ];
    const newArray = columns.slice(0, -1);
    const [newColumns, setNewColumns] = useState();

    useEffect(() => {
        if (canEditFailedConsignments(userPermission)) {
            setNewColumns(columns);
        } else {
            setNewColumns(newArray);
        }
    }, []);

    const gridRef = useRef(null);

    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, filteredData); // Fetch filtered data

        // Dynamically create the column mapping from the `columns` array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers (e.g., for formatting dates, failed reasons, etc.)
        const customCellHandlers = {
            DespatchDate: (value) => formatDateToExcel(value),
            ArrivedDatetime: (value) => formatDateToExcel(value),
            DeliveredDate: (value) => formatDateToExcel(value),
            DeliveryRequiredDateTime: (value) => formatDateToExcel(value),
            KpiDatetime: (value) => formatDateToExcel(value),
            FailedReason: (value, item) => {
                const failedReason = failedReasons?.find(
                    (reason) => reason.ReasonId === item.FailedReason
                );
                return failedReason?.ReasonName || "";
            },
            Reference: (value) =>
                value === 1 ? "Internal" : value === 2 ? "External" : "",
        };

        // Call the exportToExcel function
        exportToExcel(
            jsonData,
            columnMapping,
            "Failed-Consignments.xlsx",
            customCellHandlers,
            ["DespatchDate", "ArrivedDatetime", "DeliveredDate", "DeliveryRequiredDateTime", "KpiDatetime"]
        );
    };

    const updateLocalData = (
        id,
        reasonid,
        note,
        description,
        department,
        resolution,
        reference,
        state,
        OccuredAt
    ) => {
        // Find the item in the local data with the matching id
        const updatedData = filteredData?.map((item) => {
            if (item.CONSIGNMNENTID === id) {
                // Update the reason of the matching item
                return {
                    ...item,
                    FailedReason: reasonid,
                    FailedReasonDesc: description,
                    FailedNote: note,
                    Department: department,
                    Resolution: resolution,
                    Reference: reference,
                    State: state,
                    OccuredAt: OccuredAt,
                };
            }
            return item;
        });
        setData(updatedData);
        setFilteredData(updatedData);
    };
    const [selected, setSelected] = useState([]);
    console.log(filteredData);
    return (
        <div className="mt-4">
            {/* <Sidebar /> */}
            {!newColumns ? (
                <div className="min-h-screen md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce200`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full animate-bounce400`}
                        ></div>
                    </div>
                    <div className="text-dark mt-4 font-bold">
                        Please wait while we get the data for you.
                    </div>
                </div>
            ) : (
                <div className=" w-full bg-smooth ">
                    <div className="">
                        <div className="w-full relative">
                            <div className=" sm:border-gray-200 text-gray-400 flex flex-col justify-between md:flex-row gap-y-4 gap-x-2 md:items-center">
                                <div className="sm:flex sm:items-center">
                                    <div className="sm:flex-auto ">
                                        <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                            Failed Consignments Report
                                        </h1>
                                    </div>
                                </div>
                                <ExportPopover
                                    columns={columns}
                                    handleDownloadExcel={handleDownloadExcel}
                                    filteredData={filteredData}
                                />
                            </div>
                        </div>
                    </div>
                    <TableStructure
                        id={"ConsignmentID"}
                        gridRef={gridRef}
                        setSelected={setSelected}
                        selected={selected}
                        groupsElements={groups}
                        setFilterValueElements={setFilterValue}
                        tableDataElements={filteredData}
                        filterValueElements={filterValue}
                        columnsElements={newColumns}
                    />
                </div>
            )}

            <SetFailedReasonModal
                url={url}
                AToken={AToken}
                isOpen={isModalOpen}
                reason={reason}
                setReason={setReason}
                handleClose={handleEditClick}
                failedReasons={failedReasons}
                currentUser={currentUser}
                userPermission={userPermission}
                updateLocalData={updateLocalData}
            />
        </div>
    );
}
