import { canAddKpiReasons } from "@/permissions";
import React from "react";
import { useEffect, useState, useRef } from "react";
import TableStructure from "@/Components/TableStructure";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { PencilIcon, PlusIcon } from "@heroicons/react/20/solid";
import GtrsButton from "@/Pages/Component/GtrsButton";
import { canAddNewTransitDays } from "@/permissions";
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
    const handleComment = (data) => {
        setShowAdd(!showAdd);
        setSelectedComment(data);
    };
    const createNewLabelObjects = (data, fieldName) => {
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];

        // Map through the data and create new objects
        data?.forEach((item) => {
            const fieldValue = item[fieldName];

            // Check if the label is not already included and is not null or empty
            if (
                fieldValue &&
                !uniqueLabels.has(fieldValue) &&
                fieldValue?.trim() !== ""
            ) {
                if (typeof fieldValue === "string") {
                    uniqueLabels.add(fieldValue);
                    const newObject = {
                        id: fieldValue,
                        label: fieldValue,
                    };
                    newData.push(newObject);
                }
            }
        });

        return newData;
    };
    const [statusOptions, setStatusOptions] = useState(
        createNewLabelObjects(data, "StatusName")
    );
    const [filterValue, setFilterValue] = useState([
        {
            name: "Comment",
            operator: "eq",
            type: "string",
            value: "",
        },
        {
            name: "StatusName",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "Actions",
            operator: "contains",
            type: "string",
            value: "",
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
            name: "StatusName",
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
                        <span
                            className="underline text-blue-400 hover:cursor-pointer"
                            onClick={() => handleComment(data)}
                        >
                            <PencilIcon className="h-5 w-5 text-blue-500" />
                        </span>
                    </div>
                );
            },
        },
    ];

    const additionalButtons = canAddNewTransitDays(userPermission) ? (
        showAdd ? (
            <GtrsButton
                name={"Cancel"}
                onClick={() => {
                    handleComment(null);
                }}
                className="w-[5.2rem] h-[35px]"
            />
        ) : (
            <GtrsButton
                name={"Add +"}
                onClick={() => {
                    handleComment(null);
                }}
                className="w-[5.2rem] h-[35px]"
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
            <div className="sm:flex-auto mt-6">
                <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                    Delivery Report Comments List
                </h1>
            </div>
            {showAdd && (
                <AddCommentToList
                    selectedComment={selectedComment}
                    setSelectedComment={setSelectedComment}
                    url={url}
                    AToken={AToken}
                    currentUser={currentUser}
                    fetchData={fetchDeliveryReportCommentsData}
                    setShowAdd={setShowAdd}
                />
            )}
            <div className="">
                <TableStructure
                    rowHeight={50}
                    id={"CommentId"}
                    handleDownloadExcel={handleDownloadExcel}
                    setSelected={setSelected}
                    gridRef={gridRef}
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
