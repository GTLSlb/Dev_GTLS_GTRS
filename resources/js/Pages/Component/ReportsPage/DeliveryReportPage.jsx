import React, { useState, useEffect } from "react";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import MetcashReports from "./MetcashReports";
import WoolworthsReports from "./WoolworthsReports";
import OtherReports from "./OtherReports";
import { EyeIcon, PlusIcon } from "@heroicons/react/20/solid";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { getFiltersDeliveryReport } from "@/Components/utils/filters";

export default function DailyReportPage({
    url,
    AToken,
    dailyReportData,
    currentUser,
    fetchDeliveryReport,
    setActiveIndexGTRS,
    setLastIndex,
    setactiveCon,
}) {

    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(21);
        setactiveCon(coindex);
    };
    const [receiverZoneOptions, setReceiverZoneOptions] = useState([
        {
            id: "NSW",
            label: "NSW",
        },
        {
            id: "SA",
            label: "SA",
        },
        {
            id: "VIC",
            label: "VIC",
        },
        {
            id: "QLD",
            label: "QLD",
        },
    ]);
    const [consStateOptions, setConsStateOptions] = useState([
        {
            id: "Delivered",
            label: "Delivered",
        },
        {
            id: "Depot",
            label: "Depot",
        },
        {
            id: "ON-FOR-DELIVERY",
            label: "ON-FOR-DELIVERY",
        },
        {
            id: "Loaded",
            label: "Loaded",
        },
    ]);
    const [podAvlOptions, setPodAvlOptions] = useState([
        {
            id: "YES",
            label: "YES",
        },
        {
            id: "NO",
            label: "NO",
        },
    ]);
    const [senderZoneOptions, setSenderZoneOptions] = useState([
        {
            id: "NSW",
            label: "NSW",
        },
        {
            id: "SA",
            label: "SA",
        },
        {
            id: "VIC",
            label: "VIC",
        },
        {
            id: "QLD",
            label: "QLD",
        },
    ]);

    const minDate = getMinMaxValue("2022-01-01", "DESPATCHDATE", 1);
    const maxDate = getMinMaxValue("2024-12-31", "DESPATCHDATE", 2);

    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    const [filterValue, setFilterValue] = useState(getFiltersDeliveryReport(minDate, maxDate));

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

    const [consId, setConsId] = useState(null);
    const [commentsData, setCommentsData] = useState(null);

    const handleAddComment = (consId) => {
        setConsId(consId);
        setIsAddModalOpen(true);
    };

    useEffect(() => {
        if(dailyReportData?.length > 0 && consId){
            setCommentsData(dailyReportData.find((data) => data.ConsignmentID == consId)?.Comments);
        }
    },[dailyReportData, consId]);
    const handleViewComments = (data) => {
        setCommentsData(data?.Comments);
        setConsId(data?.ConsignmentID);
        setIsViewModalOpen(true);
    };

    const columns = [
        {
            name: "AccountNumber",
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
            name: "DespatchDateTime",
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
            render: ({ value, data }) => {
                return (
                    <div>
                        <span
                            className="underline text-blue-500 hover:cursor-pointer"
                            onClick={() => handleClick(data.ConsignmentID)}
                        >
                            {" "}
                            {value}
                        </span>
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
            defaultWidth: 180,
            filterEditor: StringFilter,
        },
        {
            name: "SenderState",
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
            name: "ReceiverReference",
            header: "Receiver Reference",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 180,
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverState",
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
            name: "DeliveryInstructions",
            header: "Special Instructions",
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
                return value?moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY"):""
            },
        },
        {
            name: "POD",
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
            render: ({ value, data }) => {
                return (
                    <div>
                        {data?.POD ?
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        True
                    </span> : <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        false
                    </span>}
                    </div>
                );
            },
        },
        {
            name: "Comments",
            header: "Comments",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 280,
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return (
                    <div className="flex gap-4 items-center px-2">
                        <div className="flex flex-col">
                            {
                                data?.hasOwnProperty("Comments")
                                && (
                                    data?.Comments?.length > 0
                                    && data?.Comments?.slice(0, 2)?.map((item) => (
                                        <div key={item?.CommentId} className="flex gap-2">
                                            <span>{moment(item?.AddedAt).format("DD-MM-YYYY")} {", "}</span>
                                            <span>{item?.Comment}</span>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>
                );
            },
        },
        {
            name: "Actions",
            header: "Actions",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            render: ({ value, data }) => {
                return (
                    <div className="flex gap-4 items-center px-2">
                        <span
                            className="underline text-blue-400 hover:cursor-pointer"
                            onClick={() => handleViewComments(data)}
                        >
                            <EyeIcon className="h-5 w-5" />
                        </span>
                        <span
                            className="underline text-green-500 hover:cursor-pointer"
                            onClick={() => handleAddComment(data.ConsignmentID)}
                        >
                            <PlusIcon className="h-5 w-5" />
                        </span>
                    </div>
                );
            },
        },
    ];

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const handleAddClose = () => {
        setIsAddModalOpen(false);
    };
    const handleViewClose = () => {
        setIsViewModalOpen(false);
        setCommentsData(null);
    };

    const [filteredMetcashData, setFilteredMetcashData] = useState(dailyReportData?.filter((item) => item?.CustomerTypeId == 1));
    const [filteredWoolworthData, setFilteredWoolworthData] = useState(dailyReportData?.filter((item) => item?.CustomerTypeId == 2));
    const [filteredOtherData, setFilteredOtherData] = useState(dailyReportData?.filter((item) => item?.CustomerTypeId == 3));
    useEffect(() => {
        if(dailyReportData?.length > 0){
            setFilteredMetcashData(dailyReportData?.filter((item) => item?.CustomerTypeId == 1));
            setFilteredWoolworthData(dailyReportData?.filter((item) => item?.CustomerTypeId == 2));
            setFilteredOtherData(dailyReportData?.filter((item) => item?.CustomerTypeId == 3));
        }
    },[dailyReportData])

    let components = [
        <MetcashReports
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            groups={groups}
            columns={columns}
            data={filteredMetcashData}
            url={url}
            AToken={AToken}
            consId={consId}
            fetchData={fetchDeliveryReport}
            currentUser={currentUser}
            isViewModalOpen={isViewModalOpen}
            handleViewModalClose={handleViewClose}
            isAddModalOpen={isAddModalOpen}
            handleAddModalClose={handleAddClose}
            commentsData={commentsData}
        />,
        <WoolworthsReports
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            groups={groups}
            columns={columns}
            data={filteredWoolworthData}
            url={url}
            AToken={AToken}
            consId={consId}
            fetchData={fetchDeliveryReport}
            currentUser={currentUser}
            isViewModalOpen={isViewModalOpen}
            handleViewModalClose={handleViewClose}
            isAddModalOpen={isAddModalOpen}
            handleAddModalClose={handleAddClose}
            commentsData={commentsData}
        />,
        <OtherReports
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            groups={groups}
            columns={columns}
            data={filteredOtherData}
            url={url}
            AToken={AToken}
            consId={consId}
            fetchData={fetchDeliveryReport}
            currentUser={currentUser}
            isViewModalOpen={isViewModalOpen}
            handleViewModalClose={handleViewClose}
            isAddModalOpen={isAddModalOpen}
            handleAddModalClose={handleAddClose}
            commentsData={commentsData}
        />,
    ];


    return (
        <div className="min-h-screen h-full px-8">
            <div className="sm:flex-auto mt-6">
                <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                    Unilever Delivery Report
                </h1>
            </div>
            <div className="w-full flex gap-4 items-center mt-4">
                <ul className="flex space-x-0">
                    <li
                        className={`cursor-pointer ${
                            activeComponentIndex === 0
                                ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                        }`}
                        onClick={() => setActiveComponentIndex(0)}
                    >
                        <div className="px-2"> Metcash</div>
                    </li>
                    <li
                        className={`cursor-pointer ${
                            activeComponentIndex === 1
                                ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                        }`}
                        onClick={() => setActiveComponentIndex(1)}
                    >
                        <div className="px-2">Woolworths</div>
                    </li>
                    <li
                        className={`cursor-pointer ${
                            activeComponentIndex === 2
                                ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                        }`}
                        onClick={() => setActiveComponentIndex(2)}
                    >
                        <div className="px-2"> Other</div>
                    </li>
                </ul>
            </div>
            <div>{components[activeComponentIndex]}</div>
        </div>
    );
}
