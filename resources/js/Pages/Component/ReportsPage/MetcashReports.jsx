import React, { useState, useRef } from "react";
import TableStructure from "@/Components/TableStructure";
import AddComment from "./Modals/AddComment";
import ViewComments from "./Modals/ViewComments";
import ExportBtn from "./ExportBtn";
import { useEffect } from "react";
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
    setCellLoading,
}) {
    const gridRef = useRef(null);
    const [selected, setSelected] = useState([]);
    const [rowHeight, setRowHeight] = useState();
    const getRowHeight = (row) => {
        let rowHeight = 60;
        data?.map((item) => {
          if (item?.hasOwnProperty('Comments')) {
            item?.Comments?.map((comment) => {
              const commentLength = comment?.Comment?.length * 3; //3px per letter
              const maxCommentLength = 280 - 10; // 280px column width - 10px bottom padding
              const commentRows = Math.ceil(commentLength / maxCommentLength);
              rowHeight = Math.max(rowHeight, commentRows * 40 + 10); // 40px per row + 10px bottom padding
            });
          }
        });

        return rowHeight;
      };
    useEffect(() => {
        setRowHeight(getRowHeight())
    },[])

    return (
        <div>
            <ExportBtn unileverClient={"Metcash"} filteredData ={data} gridRef={gridRef}/>
            {filterValue && data && (
                <TableStructure
                    rowHeight={50}
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
                setCellLoading={setCellLoading}
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
