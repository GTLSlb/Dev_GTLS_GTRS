import React, { useState, useEffect, useRef } from "react";
import TableStructure from "@/Components/TableStructure";

export default function MetcashReports({ filterValue, setFilterValue, groups, columns, data }) {
    const gridRef = useRef(null);
    const [selected, setSelected] = useState([]);
    return(
        <div>
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
            </div>
    );
}
