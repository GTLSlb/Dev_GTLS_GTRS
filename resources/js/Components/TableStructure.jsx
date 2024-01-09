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
    setFilterValueElements,
    groupsElements,
    columnsElements,
    filterTypesElements,
    setFilterTypesElements,
    setSelected,
    gridRef,
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
        setFilters(filterValueElements);
    }, [filterValueElements]);
    useEffect(() => {
        setColumns(columnsElements);
    }, [columnsElements]);
    // const [selected, setSelected] = useState({});

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
        setFilterValueElements(filterValue);
    }, []);

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
                        showColumnMenuTool={false}
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
                ) : (
                    <div className="h-64 flex items-center justify-center mt-10">
                        <div class="text-center flex justify-center flex-col">
                            {/* <img src={notFound} alt="" className="w-52 h-auto " /> */}
                            <h1 class="text-3xl font-bold text-gray-900">
                                Congrats! <br /> Nothing To Show
                            </h1>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
