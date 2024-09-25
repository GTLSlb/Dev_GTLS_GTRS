import { useRef, useState } from "react";
import { useEffect } from "react";
import ModalRDD from "@/Components/modalRDD";
import moment from "moment";
import React from "react";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import TableStructure from "@/Components/TableStructure";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { canEditRDD } from "@/permissions";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import ExportPopover from "@/Components/ExportPopover";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { formatDateToExcel } from "@/CommonFunctions";
import { useNavigate } from "react-router-dom";

export default function RDDreason({
    setActiveIndexGTRS,
    setactiveCon,
    rddData,
    url,
    setIncidentId,
    AToken,
    setrddData,
    filterValue,
    setFilterValue,
    setLastIndex,
    currentUser,
    userPermission,
    rddReasons,
    accData,
}) {
    window.moment = moment;
    const navigate = useNavigate();
    const updateLocalData = (id, reason, note) => {
        // Find the item in the local data with the matching id
        const updatedData = rddData.map((item) => {
            if (item.AuditId === id) {
                // Update the reason of the matching item
                return { ...item, Reason: reason, ReasonDesc: note };
            }
            return item;
        });
        // Update the state with the modified local data
        setrddData(updatedData);
    };
    const handleClick = (coindex) => {
        navigate("/gtrs/consignment-details", { state: { activeCons: coindex } });
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredData, setFilteredData] = useState(rddData);
    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = rddData?.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.DebtorId);

            return chargeToMatch;
        });
        return filtered;
    };
    useEffect(() => {
        setFilteredData(rddData);
    }, [rddData]);
    useEffect(() => {
        setFilteredData(filterData());
    }, [accData]);
    const [consignment, SetConsignment] = useState();
    const gridRef = useRef(null);

    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, filteredData); // Fetch filtered data

        // Create dynamic column mapping from the columns array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers (for formatting dates and other custom fields)
        const customCellHandlers = {
            DespatchDate: (value) => (value ? formatDateToExcel(value) : ""),
            ChangeAt: (value) => (value ? formatDateToExcel(value) : ""),
            OldRdd: (value) => (value ? formatDateToExcel(value) : ""),
            NewRdd: (value) => (value ? formatDateToExcel(value) : ""),
            Reason: (value, item) => {
                const reason = rddReasons?.find(
                    (reason) => reason.ReasonId === item.Reason
                );
                return reason?.ReasonName || "";
            },
        };

        // Call the exportToExcel function
        exportToExcel(
            jsonData,
            columnMapping,
            "RDD-Report.xlsx",
            customCellHandlers,
            ["DespatchDate", "ChangeAt", "OldRdd", "NewRdd"]
        );
    };
    const handleEditClick = (consignmentrdd) => {
        SetConsignment(consignmentrdd);
        const isModalCurrentlyOpen = !isModalOpen;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpen(isModalCurrentlyOpen);
    };
    const [selected, setSelected] = useState([]);
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
    const accountOptions = createNewLabelObjects(rddData, "AccountNumber");
    const senderSuburbs = createNewLabelObjects(rddData, "SenderSuburb");
    const senderStates = createNewLabelObjects(rddData, "SenderState");
    const receiverSuburbs = createNewLabelObjects(rddData, "ReceiverSuburb");
    const receiverStates = createNewLabelObjects(rddData, "ReceiverState");

    const minDespatchDate = getMinMaxValue(rddData, "DespatchDate", 1);
    const maxDespatchDate = getMinMaxValue(rddData, "DespatchDate", 2);
    const minOldRddDate = getMinMaxValue(rddData, "OldRdd", 1);
    const maxOldRddDate = getMinMaxValue(rddData, "OldRdd", 2);
    const minNewRddDate = getMinMaxValue(rddData, "NewRdd", 1);
    const maxNewRddDate = getMinMaxValue(rddData, "NewRdd", 2);
    const columns = [
        {
            name: "ConsignmentNo",
            header: "Cons No",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 hover:cursor-pointer"
                        onClick={() => handleClick(data.ConsignmentId)}
                    >
                        {" "}
                        {value}
                    </span>
                );
            },
        },
        {
            name: "DebtorName",
            header: "Debtor Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "AccountNumber",
            header: "Account Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: accountOptions,
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
                            setIncidentId(data.IncidentId);
                            setActiveIndexGTRS(22);
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
            header: "Sender Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "senderInfo",
        },
        {
            name: "SenderReference",
            header: "Sender Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "senderInfo",
        },
        {
            name: "SenderAddress",
            header: "Sender Address",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "senderInfo",
        },
        {
            name: "SenderSuburb",
            header: "Sender Suburb",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderSuburbs,
            },
            group: "senderInfo",
        },
        {
            name: "SenderState",
            header: "Sender State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStates,
            },
            group: "senderInfo",
        },
        {
            name: "ReceiverName",
            header: "Receiver Name",
            type: "string",
            headerAlign: "center",
            defaultWidth: 170,
            textAlign: "center",
            filterEditor: StringFilter,
            group: "receiverInfo",
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "receiverInfo",
        },
        {
            name: "ReceiverAddress",
            header: "Receiver Address",
            type: "string",
            headerAlign: "center",
            defaultWidth: 170,
            textAlign: "start",
            filterEditor: StringFilter,
            group: "receiverInfo",
        },
        {
            name: "ReceiverSuburb",
            header: "Receiver Suburb",
            type: "string",
            headerAlign: "center",
            defaultWidth: 170,
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverSuburbs,
            },
            group: "receiverInfo",
        },
        {
            name: "ReceiverState",
            header: "Receiver State",
            type: "string",
            defaultWidth: 170,
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStates,
            },
            group: "receiverInfo",
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
            name: "OldRdd",
            header: "Old Rdd",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minOldRddDate,
                maxDate: maxOldRddDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "NewRdd",
            header: "New Rdd",
            textAlign: "center",
            headerAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minNewRddDate,
                maxDate: maxNewRddDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD/MM/YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
    ];
    const newArray = columns.slice(0, -1);
    const [newColumns, setNewColumns] = useState();
    useEffect(() => {
        if (canEditRDD(userPermission)) {
            setNewColumns(columns);
        } else {
            setNewColumns(newArray);
        }
    }, []);
    return (
        <div className=" w-full bg-smooth ">
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
                    <div className="mt-8">
                        <div className="w-full relative">
                            <div className=" sm:border-gray-200 text-gray-400 flex flex-col justify-between items-center  md:flex-row gap-y-6 gap-x-2  w-full">
                                <div className="sm:flex sm:items-center">
                                    <div className="sm:flex-auto">
                                        <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                            RDD Report
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
                        id={"AuditId"}
                        gridRef={gridRef}
                        setSelected={setSelected}
                        groupsElements={groups}
                        selected={selected}
                        tableDataElements={filteredData}
                        filterValueElements={filterValue}
                        setFilterValueElements={setFilterValue}
                        columnsElements={newColumns}
                    />
                </div>
            )}
            <ModalRDD
                url={url}
                AToken={AToken}
                isOpen={isModalOpen}
                updateLocalData={updateLocalData}
                handleClose={handleEditClick}
                consignment={consignment}
                rddReasons={rddReasons}
                currentUser={currentUser}
                userPermission={userPermission}
            />
        </div>
    );
}
