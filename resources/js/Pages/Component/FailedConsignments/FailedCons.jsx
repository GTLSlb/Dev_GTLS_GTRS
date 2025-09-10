import React, { useContext, useRef, useState } from "react";
import PropTypes from "prop-types";
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
import {
    formatDateToExcel,
    renderConsDetailsLink,
    renderIncidentDetailsLink,
} from "@/CommonFunctions";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { CustomContext } from "@/CommonContext";

export default function FailedCons({
    PerfData,
    failedReasons,
    filterValue,
    setFilterValue,
    accData,
}) {
    const { url, Token, userPermissions } = useContext(CustomContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState();
    const handleEditClick = (reason) => {
        setReason(reason);
        setIsModalOpen(!isModalOpen);
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
    const reasonOptions = failedReasons?.map((reason) => ({
        id: reason.ReasonId,
        label: reason.ReasonName,
    }));
    const senderZoneOptions = createNewLabelObjects(data, "SenderState");
    const receiverZoneOptions = createNewLabelObjects(data, "RECEIVERSTATE");
    const senderZoneOptions1 = createNewLabelObjects(data, "SENDERZONE");
    const receiverZoneOptions1 = createNewLabelObjects(data, "RECEIVERZONE");
    const states = createNewLabelObjects(data, "State");
    const departments = createNewLabelObjects(data, "Department");
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

    const columns = [
        {
            name: "ConsignmentNo",
            header: "Cons No",
            headerAlign: "center",
            textAlign: "center",
            group: "personalInfo",
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
            name: "IncidentNo",
            defaultWidth: 170,
            header: "Incident No",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            render: ({ value, data }) => {
                return renderIncidentDetailsLink(
                    userPermissions,
                    value,
                    data.IncidentId
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
            render: ({ value }) => {
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
            render: ({ data }) => {
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
            render: ({ value }) => {
                return value;
            },
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
            render: ({ value }) => {
                return value;
            },
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
            name: "SenderZone",
            header: "Sender Zone",
            headerAlign: "center",
            group: "senderInfo",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderZoneOptions1,
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
            render: ({ value }) => {
                return value;
            },
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
            render: ({ value }) => {
                return value;
            },
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
            name: "ReceiverZone",
            header: "Receiver Zone",
            headerAlign: "center",
            group: "receiverInfo",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverZoneOptions1,
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
        if (canEditFailedConsignments(userPermissions)) {
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
            [
                "DespatchDate",
                "ArrivedDatetime",
                "DeliveredDate",
                "DeliveryRequiredDateTime",
                "KpiDatetime",
            ]
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
    return (
        <div className="mt-4">
            {/* <Sidebar /> */}
            {!newColumns ? (
                <AnimatedLoading />
            ) : (
                <div className=" w-full bg-smooth ">
                    <TableStructure
                        id={"ConsignmentID"}
                        handleDownloadExcel={handleDownloadExcel}
                        title={"Failed Consignments"}
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
                Token={Token}
                isOpen={isModalOpen}
                reason={reason}
                setReason={setReason}
                handleClose={handleEditClick}
                failedReasons={failedReasons}
                userPermissions={userPermissions}
                updateLocalData={updateLocalData}
            />
        </div>
    );
}

FailedCons.propTypes = {
    PerfData: PropTypes.array,
    filterValue: PropTypes.array,
    setFilterValue: PropTypes.func,
    accData: PropTypes.array,
    failedReasons: PropTypes.array,
};
