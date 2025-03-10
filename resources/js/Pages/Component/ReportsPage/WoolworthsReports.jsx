import React, { useState, useRef } from "react";
import TableStructure from "@/Components/TableStructure";
import AddComment from "./Modals/AddComment";
import ViewComments from "./Modals/ViewComments";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { formatDateToExcel } from "@/CommonFunctions";
import { exportToExcel } from "@/Components/utils/excelUtils";

export default function WoolworthsReports({
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
    deliveryCommentsOptions,
    fetchDeliveryReportCommentsData,
}) {
    const gridRef = useRef(null);
    const [selected, setSelected] = useState([]);
    const formatDate = (dateString) => {
        if (dateString) {
            const [date, time] = dateString.split("T");
            const [day, month, year] = date.split("-");
            // Using template literals to format the date
            return `${year}-${month}-${day}`;
        } else {
            return dateString;
        }
    };
    function handleDownloadExcel() {
        const jsonData = handleFilterTable(gridRef, data);

        // Dynamically create column mapping from the `columns` array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers
        const customCellHandlers = {
            DespatchDateTime: (value) => formatDateToExcel(value),
            DeliveryRequiredDateTime: (value) => formatDateToExcel(value),
            DeliveredDateTime: (value) => formatDateToExcel(value),
            Comments: (value) =>
                value
                    ?.map(
                        (item) => `${formatDate(item.AddedAt)}, ${item.Comment}`
                    )
                    .join("\n"),
            POD: (value) => (value ? value : "FALSE"),
        };

        // Call the `exportToExcel` function
        exportToExcel(
            jsonData, // Filtered data
            columnMapping, // Dynamic column mapping from columns
            "Unilever-Woolworth-Reports.xlsx", // Export file name
            customCellHandlers, // Custom handlers for formatting cells
            [
                "DespatchDateTime",
                "DeliveryRequiredDateTime",
                "DeliveredDateTime",
            ]
        );
    }

    return (
        <div>
            {filterValue && data && (
                <TableStructure
                    id={"ReportId"}
                    rowHeight={50}
                    handleDownloadExcel={handleDownloadExcel}
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
                deliveryCommentsOptions={deliveryCommentsOptions}
                fetchDeliveryReportCommentsData={fetchDeliveryReportCommentsData}
            />
        </div>
    );
}
