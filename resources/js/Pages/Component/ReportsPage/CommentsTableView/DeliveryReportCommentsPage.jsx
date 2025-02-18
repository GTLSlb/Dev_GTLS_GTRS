import { canAddDeliveryReportCommentTableView, canEditDeliveryReportCommentTableView } from "@/permissions";
import React from "react";
import { useEffect, useState, useRef } from "react";
import TableStructure from "@/Components/TableStructure";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { PencilIcon, PlusIcon } from "@heroicons/react/20/solid";
import GtrsButton from "../../GtrsButton";
import AddCommentToList from "./AddCommentToList";

export default function DeliveryReportCommentsPage({
    url,
    AToken,
    currentUser,
    userPermission,
    data,
    fetchDeliveryReportCommentsData,
}) {
    const gridRef = useRef(null);
    const [selected, setSelected] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const handleComment = (data, show) => {
        setShowAdd(show);
        setSelectedComment(data);
    };

    const scrollIntoView = ()=>{
        const button = document.getElementById('addSection');
        if(button){
            button.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    }
    const statusOptions =
        [
            {
                id: 1,
                label: 'Active',
            },
            {
                id: 0,
                label: 'Inactive',
            }
        ];
    const [filterValue, setFilterValue] = useState([
        {
            name: "Comment",
            operator: "eq",
            type: "string",
            value: "",
        },
        {
            name: "CommentStatus",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
    ]);

    const columns = [
        {
            name: "Comment",
            header: "Comment",
            headerAlign: "center",
            textAlign: "center",
            flex: 1,
            filterEditor: StringFilter,
            defaultWidth: 200,
            render: ({ value }) => {
                return <div>{value}</div>;
            },
        },
        {
            name: "CommentStatus",
            header: "Status",
            headerAlign: "center",
            textAlign: "center",
            flex: 1,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: statusOptions,
            },
            render: ({ value }) => {
                return value == 1 ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        Inactive
                    </span>
                );
            },
        },
        {
            name: "Actions",
            header: "Actions",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            render: ({ value, data }) => {
                return (
                    <div className="flex gap-4 items-center justify-center px-2">
                        {canEditDeliveryReportCommentTableView(userPermission) ? <span
                            className="underline text-blue-400 hover:cursor-pointer"
                            onClick={() => {handleComment(data, true); scrollIntoView();}}
                        >
                            <PencilIcon className="h-5 w-5 text-blue-500" />
                        </span> : null}
                    </div>
                );
            },
        },
    ];

    const additionalButtons = canAddDeliveryReportCommentTableView(userPermission) ? (
        showAdd ? (
            <GtrsButton
                name={"Cancel"}
                onClick={() => {
                    handleComment(null, false);
                }}
                className="w-[5rem] h-[35px]"
            />
        ) : (
            <GtrsButton
                name={"Add +"}
                onClick={() => {
                    handleComment(null, true);
                }}
                className="w-[5rem] h-[35px]"
            />
        )
    ) : null;

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
        };

        // Call the `exportToExcel` function
        exportToExcel(
            jsonData, // Filtered data
            columnMapping, // Dynamic column mapping from columns
            "Delivery-Report-Comments.xlsx", // Export file name
            customCellHandlers, // Custom handlers for formatting cells
            [
                "DespatchDateTime",
                "DeliveryRequiredDateTime",
                "DeliveredDateTime",
            ]
        );
    }
    return (
        <div className="min-h-full px-8">
            {showAdd && (
                <div id="addSection">
                    <AddCommentToList
                        selectedComment={selectedComment}
                        setSelectedComment={setSelectedComment}
                        url={url}
                        AToken={AToken}
                        currentUser={currentUser}
                        fetchData={fetchDeliveryReportCommentsData}
                        setShowAdd={setShowAdd}
                    />
                </div>
            )}
            <div className="">
                <TableStructure
                    rowHeight={50}
                    id={"CommentId"}
                    handleDownloadExcel={handleDownloadExcel}
                    setSelected={setSelected}
                    gridRef={gridRef}
                    title={"Delivery Report Comments List"}
                    selected={selected}
                    setFilterValueElements={setFilterValue}
                    tableDataElements={data}
                    filterValueElements={filterValue}
                    groupsElements={[]}
                    additionalButtons={additionalButtons}
                    columnsElements={columns}
                />
            </div>
        </div>
    );
}
