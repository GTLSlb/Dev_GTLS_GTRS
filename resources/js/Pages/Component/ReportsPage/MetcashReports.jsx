import React, { useState, useEffect, useRef } from "react";
import TableStructure from "@/Components/TableStructure";
import AddComment from "./Modals/AddComment";
import ViewComments from "./Modals/ViewComments";
import ExportBtn from "../ExportBtn"

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

    const getRowHeight = () => {
        const baseHeight = 30; // Base row height

        // Initialize a variable to track the maximum height
        let maxHeight = baseHeight;
        console.log(data);
        // Iterate over each row in the data
        data?.map((row) => {
            // Calculate comments height based on the total length of the Comment property in Comments array
            const commentsHeight = row?.hasOwnProperty("Comments") ? row?.Comments?.reduce((total, comment) => total + (comment.Comment.length || 0), 0) : 30;

            // Assuming each character in Comments adds a height of ~1px
            const commentsRowHeight = commentsHeight * 1; // Adjust multiplier as needed
            console.log(commentsRowHeight);

            // Update maxHeight if the current row's height is greater
            maxHeight = Math.max(maxHeight, commentsRowHeight);
        });

        // Return the maximum height found
        return maxHeight;
    };

    const [rowHeight, setRowHeight] = useState(null);
    useEffect(() => {
        if (data) {
            setRowHeight(getRowHeight(data))
        }
    }, [data]);

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
            {filterValue && data && rowHeight && (
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
                    rowHeight={rowHeight}
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
