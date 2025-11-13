import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import React, { useEffect, useCallback, useState, useMemo } from "react";
import PropTypes from "prop-types";
import ExportPopover from "./ExportPopover";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";

export default function TableStructure({
    tableDataElements,
    filterValueElements,
    setFilterValueElements,
    groupsElements,
    columnsElements,
    setColumns,
    filterTypesElements,
    additionalButtons,
    title,
    handleDownloadExcel,
    gridRef,
    rowHeight,
    id,
    HeaderContent,
    minHeight,
    renderRowDetails,
    detailsDisplayMode = "modal", // "modal" or "inline"
}) {
    // Track expanded rows locally
    const [expandedRows, setExpandedRows] = useState({});
    const [selectedRowForModal, setSelectedRowForModal] = useState(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // 1) Memoize columns and data
    const memoizedColumns = useMemo(() => columnsElements, [columnsElements]);
    const filters = useMemo(() => filterValueElements, [filterValueElements]);
    const groups = useMemo(() => groupsElements, [groupsElements]);

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

    const gridStyle = { minHeight: minHeight ? minHeight : 600 };

    const onFilterValueChange = useCallback(
        (filterValue) => {
            setFilterValueElements(filterValue);
        },
        [setFilterValueElements]
    );

    const toggleRowExpand = useCallback((rowId, rowData, rowIndex) => {
        if (detailsDisplayMode === "modal") {
            setSelectedRowForModal({ data: rowData, rowIndex, rowId });
            onOpen();
        } else {
            setExpandedRows((prev) => ({
                ...prev,
                [rowId]: !prev[rowId],
            }));
        }
    }, [detailsDisplayMode, onOpen]);

    // Add expand button column at the beginning
    const enhancedColumns = useMemo(() => {
        if (!renderRowDetails) {
            return memoizedColumns;
        }

        return [
            {
                name: "expandButton",
                header: "",
                width: 50,
                textAlign: "center",
                headerAlign: "center",
                render: ({ data, rowIndex }) => {
                    const isExpanded = expandedRows[data[id]];
                    return (
                        <button
                            onClick={() => toggleRowExpand(data[id], data, rowIndex)}
                            title={
                                detailsDisplayMode === "modal"
                                    ? "View Details"
                                    : isExpanded
                                    ? "Collapse"
                                    : "Expand"
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <div>
                                {detailsDisplayMode === "modal" ? (
                                    <ChevronRightIcon className="w-4 h-4" />
                                ) : isExpanded ? (
                                    <ChevronDownIcon className="w-4 h-4" />
                                ) : (
                                    <ChevronRightIcon className="w-4 h-4" />
                                )}
                            </div>
                        </button>
                    );
                },
            },
            ...memoizedColumns,
        ];
    }, [memoizedColumns, expandedRows, id, detailsDisplayMode, renderRowDetails]);

    useEffect(() => {
        const handleClick = (event) => {
            const target = event.target;
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
                const handleMenuClick = (event) => {
                    const target = event.target;
                    const textContent = target.textContent.trim();

                    if (textContent === "Clear all") {
                        // Handle "Clear all" action
                        gridRef.current?.allColumns?.forEach((column) => {
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
                        setColumns?.((cols) => [...cols]);
                    } else if (textContent === "Clear") {
                        const column = gridRef.current?.allColumns?.find(
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
                            setColumns?.((cols) => [...cols]);
                        }
                    }
                };

                menu.addEventListener("click", handleMenuClick);

                // Cleanup to prevent multiple listeners
                return () => {
                    menu.removeEventListener("click", handleMenuClick);
                };
            }
        };

        // Attach the event listener to document body to capture all clicks
        document.body.addEventListener("click", handleClick);

        // Cleanup to prevent multiple listeners
        return () => {
            document.body.removeEventListener("click", handleClick);
        };
    }, [setColumns]);

    return (
        <div className="">
            <div className="sm:flex sm:items-center mt-3">
                <div className="sm:flex-auto">
                    <h1
                        id="modal-title"
                        className="text-2xl py-2 px-0 font-extrabold text-gray-600"
                    >
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
                {tableDataElements && tableDataElements.length > 0 ? (
                    <div>
                        <ReactDataGrid
                            virtualized
                            key={"persistend-grid" + title}
                            idProperty={id}
                            ref={gridRef}
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
                            columns={enhancedColumns}
                            dataSource={tableDataElements}
                        />

                        {/* Render expanded row details inline (below the grid) */}
                        {detailsDisplayMode === "inline" && renderRowDetails && (
                            <div className="mt-4">
                                {tableDataElements.map((row, index) => {
                                    const rowId = row[id];
                                    return expandedRows[rowId] ? (
                                        <div
                                            key={`expanded-${rowId}`}
                                            className="mb-4 border rounded-lg overflow-hidden shadow bg-white"
                                        >
                                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 font-semibold border-b border-blue-200">
                                                <span className="text-gray-700">
                                                    Details for {rowId}
                                                </span>
                                            </div>
                                            <div className="p-4">
                                                {renderRowDetails({
                                                    data: row,
                                                    rowIndex: index,
                                                })}
                                            </div>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        )}

                        {/* Modal for details (HeroUI Modal) */}
                        {detailsDisplayMode === "modal" && selectedRowForModal && (
                            <Modal
                                isOpen={isOpen}
                                onOpenChange={onOpenChange}
                                size="3xl"
                                scrollBehavior="inside"
                            >
                                <ModalContent>
                                    {(onClose) => (
                                        <>
                                            <ModalHeader className="flex flex-col gap-1">
                                                Details for{" "}
                                                <span className="text-blue-600">
                                                    {selectedRowForModal.rowId}
                                                </span>
                                            </ModalHeader>
                                            <ModalBody>
                                                {renderRowDetails({
                                                    data: selectedRowForModal.data,
                                                    rowIndex:
                                                        selectedRowForModal.rowIndex,
                                                })}
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button
                                                    color="default"
                                                    variant="light"
                                                    onPress={onClose}
                                                >
                                                    Close
                                                </Button>
                                            </ModalFooter>
                                        </>
                                    )}
                                </ModalContent>
                            </Modal>
                        )}
                    </div>
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

TableStructure.propTypes = {
    tableDataElements: PropTypes.array,
    filterValueElements: PropTypes.array,
    setFilterValueElements: PropTypes.func,
    groupsElements: PropTypes.array,
    columnsElements: PropTypes.array,
    filterTypesElements: PropTypes.object,
    additionalButtons: PropTypes.node,
    title: PropTypes.string,
    handleDownloadExcel: PropTypes.func,
    gridRef: PropTypes.object,
    rowHeight: PropTypes.number,
    id: PropTypes.string,
    HeaderContent: PropTypes.node,
    setColumns: PropTypes.func,
    minHeight: PropTypes.number,
    renderRowDetails: PropTypes.func,
    detailsDisplayMode: PropTypes.oneOf(["modal", "inline"]),
};