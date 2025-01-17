import { useState, useCallback } from "react";
import "../../../css/reactdatagrid.css";
import TableStructure from "@/Components/TableStructure";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { useEffect, useRef } from "react";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { renderConsDetailsLink } from "@/CommonFunctions";
import { useNavigate } from "react-router-dom";
export default function GtrsCons({
    consData,
    minDate,
    maxDate,
    filterValue,
    setFilterValue,
    accData,
    userPermission,
}) {
    window.moment = moment;
    const navigate = useNavigate();
    const [filteredData, setFilteredData] = useState(consData);
    const [selected, setSelected] = useState({});

    const gridRef = useRef(null);
    function handleDownloadExcel() {
        const jsonData = handleFilterTable(gridRef, filteredData);

        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        const customCellHandlers = {
            DespatchDate: (value) => {
                const date = new Date(value);
                return !isNaN(date)
                    ? (date.getTime() - date.getTimezoneOffset() * 60000) /
                          86400000 +
                          25569 // Excel date serial number
                    : "";
            },
            ConsReferences: (value) => {
                if (value && value.length > 0) {
                    // Join all reference values into a single string for filtering
                    return value.map((ref) => ref.Value).join(", ");
                }
                return "";
            },
        };
        // Call the exportToExcel function
        exportToExcel(
            jsonData,
            columnMapping,
            "Consignments.xlsx",
            customCellHandlers,
            ["DespatchDate"]
        );
    }

    const senderStateOptions = createNewLabelObjects(consData, "SenderState");
    const senderZoneOptions = createNewLabelObjects(consData, "SenderZone");
    const receiverStateOptions = createNewLabelObjects(
        consData,
        "ReceiverState"
    );
    const receiverZoneOptions = createNewLabelObjects(consData, "ReceiverZone");
    const serviceOptions = createNewLabelObjects(consData, "Service");
    const statusOptions = createNewLabelObjects(consData, "Status");

    const groups = [
        {
            name: "senderDetails",
            header: "Sender Details",
            headerAlign: "center",
        },
        {
            name: "receiverDetails",
            header: "Receiver Details",
            headerAlign: "center",
        },
    ];
    const [columns, setColumns] = useState([
        {
            name: "ConsignmentNo",
            header: "Cons No",
            group: "personalInfo",
            filterEditor: StringFilter,
            headerAlign: "center",
            textAlign: "center",
            render: ({ value, data }) => {
                return renderConsDetailsLink(
                    userPermission,
                    value,
                    data.ConsignmentId
                );
            },
        },
        {
            name: "AccountName",
            header: "Account Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Service",
            header: "Service",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: serviceOptions,
            },
        },
        {
            name: "DespatchDate",
            header: "Despatch date",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterable: true,
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "Status",
            header: "Status",
            type: "string",
            defaultWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: statusOptions,
            },
        },
        {
            name: "SenderName",
            header: "Sender Name",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "SenderState",
            header: "Sender State",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStateOptions,
            },
        },
        {
            name: "SenderSuburb",
            header: "Sender Suburb",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "SenderZone",
            header: "Sender Zone",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderZoneOptions,
            },
        },
        {
            name: "SenderReference",
            header: "Sender Reference",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverName",
            header: "Receiver Name",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverState",
            header: "Receiver State",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStateOptions,
            },
        },
        {
            name: "ReceiverSuburb",
            header: "Receiver Suburb",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverZone",
            header: "Receiver Zone",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverZoneOptions,
            },
        },
        {
            name: "POD",
            header: "POD",
            headerAlign: "center",
            textAlign: "center",
            render: ({ value }) => {
                return value ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        True
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        false
                    </span>
                );
            },
        },
        {
            name: "ConsReferences",
            header: "Consignment References",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
            getFilterValue: ({ data }) => {
                if (data.ConsReferences && data.ConsReferences.length > 0) {
                    // Join all reference values into a single string for filtering
                    return data.ConsReferences.map(ref => ref.Value).join(", ");
                }
                return "";
            },
            render: ({ value }) => {
                const result =
                    Array.isArray(value) && value.length > 0
                        ? `${value[0].Value || ""}${
                              value.length > 1 ? "..." : ""
                          }` // Extract the first Value and add "..." if there's more
                        : ""; // Return an empty string if `x` is not an array or empty
                return result;
            },
        },
    ]);

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            const menu = document.querySelector(
                ".inovua-react-toolkit-menu__table"
            );
            if (menu) {
                const handleClick = (event) => {
                    if (event.target.textContent === "Clear all") {
                        gridRef.current.allColumns.forEach((column) => {
                            if (column.name === "DespatchDate") {
                                // Clear filter for DespatchDate column using DataGrid API if available
                                column.computedFilterValue.value = {
                                    start: "",
                                    end: "",
                                };
                                column.computedFilterValue.emptyValue = "";
                            }
                        });
                        // Re-render columns state to reflect the cleared filter
                        setColumns((cols) => [...cols]);
                    }
                };
                menu.addEventListener("click", handleClick);

                // Cleanup to prevent multiple listeners
                return () => {
                    menu.removeEventListener("click", handleClick);
                };
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Cleanup observer on component unmount
        return () => {
            observer.disconnect();
        };
    }, [columns]);

    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = consData.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeToID);

            return chargeToMatch;
        });
        return filtered;
    };
    useEffect(() => {
        setFilteredData(filterData());
    }, [accData]);

    const renderTable = useCallback(() => {
        return (
            <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth">
                <TableStructure
                    handleDownloadExcel={handleDownloadExcel}
                    title={"Consignments"}
                    id={"ConsignmentId"}
                    setSelected={setSelected}
                    gridRef={gridRef}
                    selected={selected}
                    tableDataElements={filteredData}
                    filterValueElements={filterValue}
                    setFilterValueElements={setFilterValue}
                    groupsElements={groups}
                    columnsElements={columns}
                />
            </div>
        );
    }, [columns, filteredData]);

    return renderTable();
}
