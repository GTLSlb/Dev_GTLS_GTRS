import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import { useEffect, useCallback, useState } from "react";

export default function TableStructure({
    tableDataElements,
    settableDataElements,
    filterValueElements,
    setFilterValueElements,
    groupsElements,
    columnsElements,
    filterTypesElements,
    setFilterTypesElements,
    setSelected,
    gridRef,
    selected,
    rowHeight,
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

    const onFilterValueChange = useCallback(
        (filterValue) => {
            setFilterValueElements(filterValue);
        },
        [setFilterValueElements]
    );

    useEffect(() => {
        const handleClick = (event) => {
            const target = event.target;
            const textContent = target.textContent.trim();
            let columnHeader;
            // Handle filter settings button click
            if (
                target.closest(
                    ".InovuaReactDataGrid__column-header__filter-settings"
                )
            ) {
                // Find the header element by navigating up the DOM structure
                const headerElement = target
                    .closest(
                        ".InovuaReactDataGrid__column-header__resize-wrapper"
                    )
                    ?.querySelector(
                        ".InovuaReactDataGrid__column-header__content"
                    );

                columnHeader = headerElement
                    ? headerElement.textContent.trim()
                    : null;

            }

            // Proceed with menu-specific actions only if the menu exists
            const menu = document.querySelector(
                ".inovua-react-toolkit-menu__table"
            );
            if (menu) {
                const handleClick = (event) => {
                    const target = event.target;
                    const textContent = target.textContent.trim();

                    if (textContent === "Clear all") {
                        // Handle "Clear all" action
                        gridRef.current.allColumns.forEach((column) => {
                            if (
                                column.computedFilterValue &&
                                column.computedFilterValue.type === "date"
                            ) {
                                // Clear date filters
                                column.computedFilterValue.value = null;
                                column.computedFilterValue.operator = "eq";
                                column.computedFilterValue.emptyValue = "";
                            }
                        });
                        // Re-render columns state to reflect the cleared filters
                        setColumns((cols) => [...cols]);
                    } else if (textContent === "Clear") {
                        const column = gridRef.current.allColumns.find(
                            (col) =>
                                col.header === columnHeader &&
                                col.computedFilterValue?.type === "date"
                        );
                        if (column && column.computedFilterValue) {
                            // Clear the filter for this specific date column
                            column.computedFilterValue.value = null;
                            column.computedFilterValue.operator = "eq";
                            column.computedFilterValue.emptyValue = "";
                
                            // Re-render columns state to reflect the cleared filter
                            setColumns((cols) => [...cols]);
                          }
                    }
                };

                menu.addEventListener("click", handleClick);

                // Cleanup to prevent multiple listeners
                return () => {
                    menu.removeEventListener("click", handleClick);
                };
            }
        };

        // Attach the event listener to document body to capture all clicks
        document.body.addEventListener("click", handleClick);

        // Cleanup to prevent multiple listeners
        return () => {
            document.body.removeEventListener("click", handleClick);
        };
    }, [columns, gridRef]);

    return (
        <div className="">
            <div className="py-5">
                {tableData ? (
                    <ReactDataGrid
                        idProperty={id}
                        handle={(ref) =>
                            (gridRef.current = ref ? ref.current : [])
                        }
                        className={"rounded-lg shadow-lg overflow-hidden"}
                        pagination
                        rowStyle={rowStyle}
                        rowHeight={rowHeight ? rowHeight : 40}
                        filterTypes={filterTypes}
                        scrollProps={scrollProps}
                        showColumnMenuTool={false}
                        enableColumnAutosize={false}
                        showColumnMenuLockOptions={false}
                        showColumnMenuGroupOptions={false}
                        selected={selectedRows}
                        style={gridStyle}
                        onFilterValueChange={onFilterValueChange}
                        defaultFilterValue={filters}
                        columns={columns}
                        groups={groups}
                        dataSource={tableData}
                    />
                ) : (
                    <div className="h-64 flex items-center justify-center mt-10">
                        <div className="text-center flex justify-center flex-col">
                            <h1 className="text-3xl font-bold text-gray-900">
                                <br /> Nothing To Show
                            </h1>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}