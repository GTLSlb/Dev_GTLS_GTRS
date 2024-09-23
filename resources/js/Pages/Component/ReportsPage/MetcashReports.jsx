import React, { useState, useEffect, useRef } from "react";
import TableStructure from "@/Components/TableStructure";
import AddComment from "./Modals/AddComment";
import ViewComments from "./Modals/ViewComments";
import ExportBtn from "../../Component/ExportBtn"

export default function MetcashReports({
    filterValue,
    setFilterValue,
    groups,
    columns,
    data,
    url,
    AToken,
    consId,
    fetchData,
    currentUser,
    isViewModalOpen,
    handleViewModalClose,
    isEditModalOpen,
    handleEditCommentClose,
    isAddModalOpen,
    handleAddModalClose,
    commentsData,
}) {
    const gridRef = useRef(null);
    const [selected, setSelected] = useState([]);
    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);

    const popoverData = [
        {
            label: "Account Number",
            value: "AccountNumber",
        },
        {
            label: "Despatch Date",
            value: "DespatchDate",
        },
        {
            label: "Consignment Number",
            value: "ConsignmentNo",
        },
        {
            label: "Sender Name",
            value: "SenderName",
        },
        {
            label: "Sender Reference",
            value: "SenderReference",
        },
        {
            label: "Sender State",
            value: "SenderState",
        },
        {
            label: "Receiver Name",
            value: "ReceiverName",
        },
        {
            label: "Receiver Reference",
            value: "ReceiverReference",
        },
        {
            label: "Receiver Zone",
            value: "ReceiverState",
        },
        {
            label: "Consignment Status",
            value: "ConsignmentStatus",
        },
        {
            label: "Special Instructions",
            value: "DeliveryInstructions",
        },
        {
            label: "Delivery Required Date",
            value: "DeliveryRequiredDateTime",
        },
        {
            label: "Delivered DateTime",
            value: "DeliveredDateTime",
        },
        {
            label: "POD Avl",
            value: "POD",
        },
        {
            label: "Past Comments",
            value: "Comments",
        },
    ];

    const handleMouseEnter = () => {
        if (data?.length === 0) {
            setHoverMessage("No Data Found");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 1000);
        }
    };
    return (
        <div>
            <ExportBtn
                 handleMouseEnter={handleMouseEnter}
                 filteredData={data}
                 isMessageVisible={isMessageVisible}
                 hoverMessage={hoverMessage}
                 popoverData={popoverData}
                 gridRef={gridRef}
                 workbookName={"Unilever-Metcash-Reports.xlsx"}
            />
            {filterValue && data && (
                <TableStructure
                    id={"ReportId"}
                    setSelected={setSelected}
                    gridRef={gridRef}
                    selected={selected}
                    setFilterValueElements={setFilterValue}
                    tableDataElements={data}
                    filterValueElements={filterValue}
                    groupsElements={groups}
                    columnsElements={columns}
                />
            )}
            <AddComment
                url={url}
                AToken={AToken}
                isOpen={isAddModalOpen}
                handleClose={handleAddModalClose}
                consId={consId}
                fetchData={fetchData}
                currentUser={currentUser}
                commentsData={commentsData}
            />
            <ViewComments
                url={url}
                AToken={AToken}
                isOpen={isViewModalOpen}
                handleClose={handleViewModalClose}
                consId={consId}
                fetchData={fetchData}
                currentUser={currentUser}
                commentsData={commentsData}
            />
        </div>
    );
}
