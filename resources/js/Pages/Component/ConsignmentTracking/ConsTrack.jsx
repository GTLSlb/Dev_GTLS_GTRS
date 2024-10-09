import React, { useState, useEffect } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import axios from "axios";
import { useDisclosure } from "@nextui-org/react";
import { useRef } from "react";
import EventModal from "../TrafficPage/EventModal";
import TableStructure from "@/Components/TableStructure";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import { MapPinIcon } from "@heroicons/react/20/solid";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { formatDateToExcel, getApiRequest } from "@/CommonFunctions";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { useNavigate } from "react-router-dom";

const gtrsWebUrl = window.Laravel.gtrsWeb;

function ConsTrack({
    setFilterValue,
    filterValue,
}) {
    const [selected, setSelected] = useState([]);

    // Todo: Replace this with the actual request
    const [filteredData, setFilteredData] = useState();

    async function fetchtData() {
        const data = await getApiRequest(`https://map.gtls.store/conswithevents`);

        if (data) {
            console.log(data)
            setFilteredData(data || []);
        }
    }

    useEffect(() => {
        fetchtData();
    }, []);
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
    const gridRef = useRef(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [eventDetails, setEventDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const createNewLabelObjects = (data, fieldName) => {
        let id = 1; // Initialize the ID
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];

        // Map through the data and create new objects
        data?.forEach((item) => {
            const fieldValue = item[fieldName];
            // Check if the label is not already included
            if (!uniqueLabels.has(fieldValue)) {
                uniqueLabels.add(fieldValue);
                const newObject = {
                    id: fieldValue,
                    label: fieldValue,
                };
                newData.push(newObject);
            }
        });
        return newData;
    };
    const [receiverStateOptions, setReceiverStateOptions] = useState(
        createNewLabelObjects(filteredData, "SenderState") || []
    );
    const [senderStateOptions, setSenderStateOptions] = useState(
        createNewLabelObjects(filteredData, "ReceiverState") || []
    );
    const minDispatchDate = getMinMaxValue(filteredData, "DispatchDate", 1);
    const maxDispatchDate = getMinMaxValue(filteredData, "DispatchDate", 2);
    const minRDDDate = getMinMaxValue(filteredData, "RDD", 1);
    const maxRDDDate = getMinMaxValue(filteredData, "RDD", 2);

    function getAllEvents() {
        axios
            .get(`${gtrsWebUrl}get-eventsCategories`)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        getAllEvents();
    }, []);

    function getEventCategoryById(id) {
        const category = categories.find((event) => event.id === id);
        return category ? category.event_category : "";
    }

    const handleClick = (coindex) => {
        navigate("/gtrs/consignment-details", { state: { activeCons: coindex } });
    }
    const columns = [
        {
            name: "ConsignmentNo",
            headerAlign: "center",
            textAlign: "center",
            header: "Cons No",
            group: "personalInfo",
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 hover:cursor-pointer"
                        onClick={() => handleClick(data.ConsignmentId)}
                    >
                        {" "}
                        {value}
                    </span>
                );
            },
        },
        {
            name: "DebtorName",
            headerAlign: "center",
            textAlign: "center",
            header: "Account Name",
            group: "personalInfo",
            filterEditor: StringFilter,
        },
        {
            name: "SenderName",
            header: "Name",
            group: "senderDetails",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "SenderState",
            header: "Sender State",
            group: "senderDetails",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStateOptions,
            },
            defaultWidth: 200,
        },
        {
            name: "SenderSuburb",
            header: "Sender Suburb ",
            group: "senderDetails",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "SenderPostcode",
            group: "senderDetails",
            header: "Sender Postcode ",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverName",
            group: "receiverDetails",
            header: "Receiver Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverState",
            group: "receiverDetails",
            header: "Receiver State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStateOptions,
            },
            defaultWidth: 200,
        },
        {
            name: "ReceiverSuburb",
            group: "receiverDetails",
            header: "Suburb",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverPostcode",
            group: "receiverDetails",
            header: "Post Code",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "DespatchDate",
            header: "Despatch Date",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDispatchDate,
                maxDate: maxDispatchDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
            defaultWidth: 200,
        },
        {
            name: "RDD",
            header: "RDD",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minRDDDate,
                maxDate: maxRDDDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
            defaultWidth: 200,
        },
        {
            name: "EventCount",
            header: "Events Count",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
            render: ({ value, data }) => {
                return (
                    <>
                        {value > 0 && (
                            <span
                                className="underline text-blue-500 hover:cursor-pointer"
                                onClick={() => {
                                    onOpen();
                                    setEventDetails(data.events);
                                }}
                            >
                                {" "}
                                {value}
                            </span>
                        )}
                    </>
                );
            },
            defaultWidth: 200,
        },
        {
            name: "Map",
            header: "Map",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 flex justify-center hover:cursor-pointer"
                        onClick={() => {
                            navigate("/gtrs/consignment-map", { state: { consignmentToTrack: data } });
                        }}
                    >
                        <MapPinIcon className="h-5 w-5" />
                    </span>
                );
            },
            defaultWidth: 200,
        },
    ];

    function handleDownloadExcel() {
        const jsonData = handleFilterTable(gridRef, filteredData);

        // Dynamically create column mapping from the `columns` array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers
        const customCellHandlers = {
            DispatchDate: (value) => formatDateToExcel(value),
            DeliveryDate: (value) => formatDateToExcel(value),
            RDD: (value) => formatDateToExcel(value),
            CalculatedDelDate: (value) => formatDateToExcel(value),
            MatchRdd: (value) => {
                if (value === 3) return "Pending";
                if (value === 1) return "True";
                if (value === 2) return "False";
                return "";
            },
            MatchDel: (value) => {
                if (value == 0) return "";
                if (value == 1) return "PASS";
                if (value == 2) return "FAIL";
                return "";
            },
            ReasonId: (value, item) => {
                const Reason = kpireasonsData?.find(
                    (reason) => reason.ReasonId === item.ReasonId
                );
                return Reason?.ReasonName || "";
            },
        };

        // Call the `exportToExcel` function
        exportToExcel(
            jsonData, // Filtered data
            columnMapping, // Dynamic column mapping from columns
            "Traffic-report.xlsx", // Export file name
            customCellHandlers, // Custom handlers for formatting cells
            ["DispatchDate", "DeliveryDate", "RDD", "CalculatedDelDate"]
        );
    }

    const customFilterTypes = Object.assign(
        {},
        ReactDataGrid.defaultProps.filterTypes,
        {
            number: {
                name: "number",
                operators: [
                    {
                        name: "empty",
                        fn: ({ value }) => value == null || value === "",
                    },
                    {
                        name: "notEmpty",
                        fn: ({ value }) => value != null && value !== "",
                    },
                    {
                        name: "eq",
                        fn: ({ value, filterValue }) =>
                            value == null || filterValue == null
                                ? true
                                : // Check if both values are NaN
                                Number.isNaN(value) && Number.isNaN(filterValue)
                                ? true
                                : // Check if both values are numbers and are equal
                                typeof value === "number" &&
                                  typeof filterValue === "number" &&
                                  value === filterValue
                                ? true
                                : // Return false for all other cases
                                  false,
                    },
                    {
                        name: "neq",
                        fn: ({ value, filterValue }) =>
                            value == null || filterValue == null
                                ? true
                                : value != filterValue,
                    },
                    {
                        name: "gt",
                        fn: ({ value, filterValue }) => value > filterValue,
                    },
                    {
                        name: "gte",
                        fn: ({ value, filterValue }) => value >= filterValue,
                    },
                    {
                        name: "lt",
                        fn: ({ value, filterValue }) => value < filterValue,
                    },
                    {
                        name: "lte",
                        fn: ({ value, filterValue }) => value <= filterValue,
                    },
                    {
                        name: "inRange",
                        fn: ({ value, filterValue }) => {
                            const [min, max] = filterValue
                                .split(":")
                                .map(Number);
                            return value >= min && value <= max;
                        },
                    },
                ],
            },
        }
    );

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth">
            <TableStructure
                gridRef={gridRef}
                title={"Consignment Tracking"}
                id={"ConsignmentId"}
                setSelected={setSelected}
                handleDownloadExcel={handleDownloadExcel}
                selected={selected}
                filterTypesElements={customFilterTypes}
                groupsElements={groups}
                tableDataElements={filteredData}
                filterValueElements={filterValue}
                setFilterValueElements={setFilterValue}
                columnsElements={columns}
            />
            <EventModal
                getEventCategoryById={getEventCategoryById}
                eventDetails={eventDetails}
                loading={loading}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
        </div>
    );
}

export default ConsTrack;
