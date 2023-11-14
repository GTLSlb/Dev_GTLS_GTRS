import ReactDataGrid from "@inovua/reactdatagrid-community";
import filter from "@inovua/reactdatagrid-community/filter";
import "@inovua/reactdatagrid-community/index.css";
import { useEffect } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { useState } from "react";

export default function TableStructure({
    tableDataElements,
    filterValueElements,
    groupsElements,
    columnsElements,
    filterTypesElements,
    setSelected,
    selected,
    id,
}) {
    const [tableData, setTableData] = useState(tableDataElements);
    const [currentPage, setCurrentPage] = useState(4);
    const [filters, setFilters] = useState(filterValueElements);
    const [selectedRows, setSelectedRows] = useState();
    const [groups, setGroups] = useState(groupsElements);
    const [columns, setColumns] = useState(columnsElements);
    const [filterTypes, setfilterTypes] = useState(filterTypesElements);
    useEffect(() => {
        setTableData(tableDataElements);
    }, [tableDataElements]);
    useEffect(() => {
        setColumns(columnsElements);
    }, [columnsElements]);
    // const [selected, setSelected] = useState({});
    const gridRef = useRef(null);
    const scrollProps = Object.assign(
        {},
        ReactDataGrid.defaultProps.scrollProps,
        {
            autoHide: true,
            alwaysShowTrack: true,
            scrollThumbWidth: 10,
            scrollThumbOverWidth: 10,
        }
    );
    const rowStyle = ({ data }) => {
        const colorMap = {
            ca: "#7986cb",
            uk: "#ef9a9a",
        };
        return {
            color: colorMap[data.country],
        };
    };
    const gridStyle = { minHeight: 600 };
    const onFilterValueChange = useCallback((filterValue) => {
        console.log(filterValue)
        setFilters(filterValue);
    }, []);
    // const onSelectionChange = useCallback(
    //     ({ selected }) => {
    //         if (selected === true) {
    //             if (filters) {
    //                 setSelected(filter(tableData, filters));
    //                 setSelectedRows(selected);
    //             } else {
    //                 console.log("No filters")
    //                 setSelected(tableData);
    //                 setSelectedRows(selected);
    //             }
    //         } else {
    //             setSelected(selected);
    //             setSelectedRows(selected);
    //         }
    //     },
    //     [filters]
    // );
    return (
        <div className="">
            {/* <Sidebar /> */}
            <div className=" py-5 ">
                {tableData ? (
                    <ReactDataGrid
                        idProperty={id}
                        handle={(ref) =>
                            (gridRef.current = ref ? ref.current : null)
                        }
                        className={"rounded-lg shadow-lg overflow-hidden"}
                        pagination
                        rowStyle={rowStyle}
                        filterTypes={filterTypes}
                        scrollProps={scrollProps}
                        showColumnMenuTool={true}
                        enableColumnAutosize={false}
                        showColumnMenuLockOptions={false}
                        showColumnMenuGroupOptions={false}
                        selected={selectedRows}
                        style={gridStyle}
                        // onSelectionChange={onSelectionChange}
                        onFilterValueChange={onFilterValueChange}
                        defaultFilterValue={filters}
                        columns={columns}
                        groups={groups}
                        dataSource={tableData}
                    />
                ) : null}
            </div>
        </div>
    );
}
