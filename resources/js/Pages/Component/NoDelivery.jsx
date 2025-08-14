import { useContext, useRef, useState } from "react";
import React from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import moment from "moment";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import TableStructure from "@/Components/TableStructure";
import {
    formatDateToExcel,
    renderConsDetailsLink,
    useApiRequests,
} from "@/CommonFunctions";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { CustomContext } from "@/CommonContext";

export default function NoDelivery({
    NoDelData,
    setNoDelData,
    filterValue,
    setFilterValue,
    userPermission,
}) {
    const { user, url } = useContext(CustomContext);
    const { getApiRequest } = useApiRequests();
    window.moment = moment;

    const [isFetching, setIsFetching] = useState();
    useEffect(() => {
        if (NoDelData === null || NoDelData === undefined) {
            setIsFetching(true);
            fetchData();
        }
    }, []);

    async function fetchData() {
        const data = await getApiRequest(`${url}NoDelInfo`, {
            UserId: user?.UserId,
        });

        if (data) {
            setNoDelData(data);
            setIsFetching(false);
        }
    }

    const gridRef = useRef(null);
    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, NoDelData); // Fetch the filtered data

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

    const [selected, setSelected] = useState([]);
    const senderSuburbs = createNewLabelObjects(NoDelData, "Send_Suburb");
    const senderStates = createNewLabelObjects(NoDelData, "Send_State");
    const status = createNewLabelObjects(
        NoDelData,
        "AdminStatusCodes_Description"
    );
    const receiverSuburbs = createNewLabelObjects(NoDelData, "Del_Suburb");
    const receiverStates = createNewLabelObjects(NoDelData, "Del_State");
    const description = createNewLabelObjects(NoDelData, "Description");

    // Usage example remains the same

    const minDate = getMinMaxValue(NoDelData, "DespatchDateTime", 1);
    const maxDate = getMinMaxValue(NoDelData, "DespatchDateTime", 2);

    const minDaterdd = getMinMaxValue(NoDelData, "DeliveryRequiredDateTime", 1);
    const maxDaterdd = getMinMaxValue(NoDelData, "DeliveryRequiredDateTime", 2);

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
    const columns = [
        {
            name: "ConsignmentNo",
            header: "Cons No",
            group: "personalInfo",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,

            render: ({ value, data }) => {
                return renderConsDetailsLink(userPermission, value, data);
            },
        },
        {
            name: "DespatchDateTime",
            header: "Despatch Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
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
            type: "string",
            headerAlign: "center",
            textAlign: "start",
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
            name: "Send_Suburb",
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
            name: "Send_State",
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
            name: "AdminStatusCodes_Description",
            header: "Status",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: status,
            },
        },
        {
            name: "ReceiverName",
            header: "Receiver Name",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
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
            name: "Del_Suburb",
            header: "Receiver Suburb",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverSuburbs,
            },
            group: "receiverInfo",
        },
        {
            name: "Del_State",
            header: "Receiver State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStates,
            },
            group: "receiverInfo",
        },
        {
            name: "Timeslot",
            header: "Timeslot",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
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
        {
            name: "POD",
            header: "POD",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
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
        {
            name: "DeliveryRequiredDateTime",
            header: "RDD",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDaterdd,
                maxDate: maxDaterdd,
            },
            render: ({ value }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "Description",
            header: "Description",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: description,
            },
        },
    ];

    return (
        <div>
            {/* <Sidebar /> */}
            {isFetching && <AnimatedLoading />}
            {!isFetching && (
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <TableStructure
                        id={"ConsignmentID"}
                        gridRef={gridRef}
                        groupsElements={groups}
                        handleDownloadExcel={handleDownloadExcel}
                        title={"No Delivery Information"}
                        setFilterValueElements={setFilterValue}
                        setSelected={setSelected}
                        selected={selected}
                        tableDataElements={NoDelData}
                        filterValueElements={filterValue}
                        columnsElements={columns}
                    />
                </div>
            )}
        </div>
    );
}

NoDelivery.propTypes = {
    NoDelData: PropTypes.array,
    setNoDelData: PropTypes.func,
    filterValue: PropTypes.array,
    setFilterValue: PropTypes.func,
    currentUser: PropTypes.object,
    userPermission: PropTypes.object,
    url: PropTypes.string,
};
