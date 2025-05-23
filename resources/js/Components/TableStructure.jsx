import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import { useEffect, useCallback, useState, useMemo } from "react";
import ExportPopover from "./ExportPopover";

export default function TableStructure({
    tableDataElements,
    settableDataElements,
    filterValueElements,
    setFilterValueElements,
    groupsElements,
    columnsElements,
    filterTypesElements,
    setFilterTypesElements,
    additionalButtons,
    title,
    handleDownloadExcel,
    setSelected,
    gridRef,
    selected,
    rowHeight,
    id,
    HeaderContent,
}) {
    // 1) Memoize columns and data
    const columns = useMemo(() => columnsElements, [columnsElements]);
    const filters = useMemo(() => filterValueElements, [filterValueElements]);
    const groups = useMemo(() => groupsElements, [groupsElements]);

    const tableData = useMemo(() => tableDataElements, [tableDataElements]);
    const filterTypes = useMemo(
        () => filterTypesElements,
        [filterTypesElements]
    );

    // 2) State for filterValue and groups if needed
    const [selectedRows] = useState();
    const scrollProps = Object.assign(
        {},
        ReactDataGrid.defaultProps.scrollProps,
        {
            autoHide: true,
            alwaysShowTrack: true,
            scrollThumbWidth: 6,
            scrollThumbOverWidth: 6,
        }
    );

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
    }, [columns]);

    return (
        <div className="">
            <div className="sm:flex sm:items-center mt-3">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        {title}
                    </h1>
                </div>

                <div className="flex gap-2">
                    {additionalButtons}
                    {handleDownloadExcel && (
                        <ExportPopover
                            columns={columnsElements}
                            handleDownloadExcel={handleDownloadExcel}
                            filteredData={tableDataElements}
                        />
                    )}
                </div>
            </div>
            <div className="">
                <div>{HeaderContent}</div>
            </div>
            <div className="py-5">
                {tableDataElements ? (
                    <ReactDataGrid
                        virtualized
                        key={"persistend-grid"+title}
                        idProperty={id}
                        handle={(ref) =>
                            (gridRef.current = ref ? ref.current : [])
                        }
                        className="rounded-lg shadow-lg overflow-hidden"
                        pagination
                        defaultPageSize={20}
                        defaultLimit={20}
                        rowHeight={rowHeight ?? 40}
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
                        groups={groups}
                        columns={columns}
                        dataSource={tableDataElements}
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