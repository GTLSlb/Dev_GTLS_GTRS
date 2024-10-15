import React, { useState, useRef } from "react";
import TableStructure from "@/Components/TableStructure";
import AddComment from "./Modals/AddComment";
import ViewComments from "./Modals/ViewComments";
import ExportBtn from "./ExportBtn";

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

    return (
        <div>
            <ExportBtn unileverClient={"Woolworths"} filteredData ={data} gridRef={gridRef}/>
            {filterValue && data && (
                <TableStructure
                    id={"ReportId"}
                    rowHeight={50}
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
