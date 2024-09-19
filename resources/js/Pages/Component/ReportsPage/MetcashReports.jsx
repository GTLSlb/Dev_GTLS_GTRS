import React, { useState, useEffect } from "react";
import TableStructure from "@/Components/TableStructure";

export default function MetcashReports() {
    return(
        <div>
                {filterValue && filteredData && (
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
                )}
            </div>
    );
}
