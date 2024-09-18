import React, { useState, useEffect, useRef } from "react";
import TableStructure from "@/Components/TableStructure";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import { getMinMaxValue } from "@/CommonFunctions";
import { Spinner, Select, SelectItem } from "@nextui-org/react";
export default function DailyReportPage({
    url,
    AToken,
    dailyReportData,
    user,
    currentUser,
    userPermission,
}) {
    const gridRef = useRef(null);
    const [selected, setSelected] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [selectedRecords, setselectedRecords] = useState([]);
    const [receiverZoneOptions, setReceiverZoneOptions] = useState([]);
    const [consStateOptions, setConsStateOptions] = useState([]);
    const [podAvlOptions, setPodAvlOptions] = useState([]);
    const [senderZoneOptions, setSenderZoneOptions] = useState([]);

    const minDate = getMinMaxValue("2022-01-01", "DESPATCHDATE", 1);
    const maxDate = getMinMaxValue("2024-12-31", "DESPATCHDATE", 2);

    const [unileverCustomers, setUnileverCustomers] = useState([
        {
            CustomerId: 1,
            CustomerName: "Woolworths",
        },
        {
            CustomerId: 2,
            CustomerName: "Metcash",
        },
    ]);

    const [filterValue, setFilterValue] = useState([
        {
            name: "AccountNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderZone",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverZone",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "SpecialInstructions",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "Comments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "CorrectiveAction",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PastComments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "Report",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "GTLSReasonCode",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "GTLSComments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PastReasonCode",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PastCorrectiveAction",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PODAvl",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ConsignmentStatus",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },
        {
            name: "DeliveryRequiredDateTime",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },
        {
            name: "DeliveredDateTime",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },
    ]);

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
    const columns = [
        {
            name: "AccountNo",
            header: "Account Number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
            render: ({ value }) => {
                return <div>{value}</div>;
            },
        },
        {
            name: "DespatchDate",
            header: "Despatch date",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "ConsignmentNo",
            header: "Consignment Number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
            render: ({ value }) => {
                return (
                    <div>
                        {value}
                        {/* {
                            customerAccounts?.find(
                                (customer) => customer.DebtorId == value
                            )?.AccountNo
                        } */}
                    </div>
                );
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
            name: "SenderReference",
            header: "Sender Reference",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "SenderZone",
            header: "Sender Zone",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
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
            name: "ReceiverReference",
            header: "Receiver Reference",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
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
            name: "ConsignmentStatus",
            header: "Consignment Status",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: consStateOptions,
            },
        },
        {
            name: "SpecialInstructions",
            header: "Special Instructions",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Comments",
            header: "Comments",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "CorrectiveAction",
            header: "Corrective Actions",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "DeliveryRequiredDateTime",
            header: "Delivery Required DateTime",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "DeliveredDateTime",
            header: "Delivered DateTime",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "PODAvl",
            header: "POD Avl",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: podAvlOptions,
            },
        },
        {
            name: "PastComments",
            header: "Past Comments",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "PastCorrectiveAction",
            header: "Past Corrective Actions",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Report",
            header: "Report",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "GTLSReasonCode",
            header: "GTLS Reason Code",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "GTLSComments",
            header: "GTLS Comments",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "PastReasonCode",
            header: "Past Reason Code",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "PastComments",
            header: "Past Comments",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
    ];

    const [filteredData, setFilteredData] = useState(dailyReportData);
    const filterDataBasedOnUser = (val) => {
        let newData = [];

        if(val != ""){
            const selectedUserName = unileverCustomers?.find((item) => item?.CustomerId == val)?.CustomerName;
        dailyReportData?.map((item) => {
            if(selectedUserName == "Woolworths"){
                if(item?.ReceiverName == "AUST SAFEWAY - MULGRAVE" || item?.ReceiverName.toLowerCase().includes("woolworths")){
                    newData.push(item);
                }
            }else{
                if(item?.ReceiverName != "AUST SAFEWAY - MULGRAVE" && !item?.ReceiverName.toLowerCase().includes("woolworths")){
                    newData.push(item);
                }
            }
        })
        }else{
            newData = dailyReportData;
        }

        setFilteredData(newData);
    }

    return (
        <div className="min-h-screen h-full px-8">
            <div className="sm:flex-auto mt-6">
                <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                    Unilever Daily Report
                </h1>
            </div>
            <div className="w-full flex gap-4 items-center mt-4">
                <p className="whitespace-nowrap text-[#787878]">Filter By</p>
                <div className="w-full md:w-[18%]">
                    <Select
                        type="text"
                        label=""
                        labelPlacement="inside"
                        value={selectedUser?.toString()}
                        defaultSelectedKeys={[selectedUser?.toString()]}
                        classNames={{
                            mainWrapper: "bg-transparent",
                            trigger: [
                                "border border-default-300",
                                "bg-gradient-to-b from-[#FFFFFF] to-{#F4F4F4}",
                                "backdrop-blur-xl",
                                "backdrop-saturate-200",
                                "hover:bg-default-200/70",
                                "group-data-[focused=true]:bg-default-200/50",
                                "!cursor-text",
                            ],
                        }}
                        onChange={(e) => filterDataBasedOnUser(e.target.value)}
                    >
                        {unileverCustomers?.map((user) => (
                            <SelectItem
                                key={user.CustomerId}
                                value={user.CustomerId?.toString()}
                            >
                                {user.CustomerName}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>
            <div>
                <TableStructure
                    id={"ReportId"}
                    setSelected={setSelected}
                    gridRef={gridRef}
                    selected={selected}
                    setFilterValueElements={setFilterValue}
                    tableDataElements={filteredData}
                    filterValueElements={filterValue}
                    groupsElements={groups}
                    columnsElements={columns}
                />
            </div>
        </div>
    );
}
