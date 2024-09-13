import React, { useState, useEffect, useCallback } from "react";
3;
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useDisclosure } from "@nextui-org/react";
import EventModal from "./EventModal";
const gtrsWebUrl = window.Laravel.gtrsWeb;

const loadData = ({ skip, limit, sortInfo, filterValue }) => {
    const url =
        `${gtrsWebUrl}get-positions` +
        "?skip=" +
        skip +
        "&limit=" +
        limit +
        "&sortInfo=" +
        JSON.stringify(sortInfo) +
        "&filterBy=" +
        JSON.stringify(filterValue);

    return fetch(url).then((response) => {
        const totalCount = response.headers.get("X-Total-Count");
        return response.json().then((data) => {
            // const totalCount = data.pagination.total;
            return Promise.resolve({ data, count: parseInt(totalCount) });
        });
    });
};

const defaultFilterValue = [
    { name: "suburb", type: "string", operator: "contains", value: "" },
    { name: "api_source", type: "string", operator: "contains", value: "" },
    { name: "event_type", type: "string", operator: "contains", value: "" },
    {
        name: "start_date",
        type: "date",
        operator: "eq",
        value: "",
        emptyValue: "",
    },
    {
        name: "end_date",
        type: "date",
        operator: "eq",
        value: "",
        emptyValue: "",
    },
    {
        name: "road_name",
        type: "string",
        operator: "contains",
        value: "",
    },
    {
        name: "impact",
        type: "string",
        operator: "contains",
        value: "",
    },
];

function TraffiComp() {
    function formatTime(hours) {
        const years = Math.floor(hours / (24 * 30 * 12));
        const months = Math.floor((hours % (24 * 30 * 12)) / (24 * 30));
        const days = Math.floor((hours % (24 * 30)) / 24);
        const remainingHours = hours % 24;

        const parts = [];

        if (years > 0) {
            parts.push(`${years} year${years > 1 ? "s" : ""}`);
        }
        if (months > 0) {
            parts.push(`${months} month${months > 1 ? "s" : ""}`);
        }
        if (days > 0) {
            parts.push(`${days} day${days > 1 ? "s" : ""}`);
        }
        if (remainingHours > 0) {
            parts.push(
                `${remainingHours} hour${remainingHours > 1 ? "s" : ""}`
            );
        }

        if (parts.length === 0) {
            return null;
        } else if (parts.length > 1) {
            return parts[0];
        }
        // return parts.join(" and ");
    }

    const gridStyle = { minHeight: 550, marginTop: 10 };
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [eventDetails, setEventDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
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

    function handleViewDetails(id) {
        setLoading(true);
        onOpen();
        axios
            .get(`${gtrsWebUrl}get-positions/${id}`)
            .then((res) => {
                setEventDetails(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const columns = [
        {
            name: "api_source",
            header: "State",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "suburb",
            header: "Suburb",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "event_type",
            header: "Event Type",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            render: ({ data }) => {
                return getEventCategoryById(data.event_category_id);
            }, 
        },
        {
            name: "description",
            header: "Event Description",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "start_date",
            header: "Start Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "YYYY-MM-DD",
            filterEditor: DateFilter,
            filterEditorProps: (props, { index }) => {
                // for range and notinrange operators, the index is 1 for the after field
                return {
                    dateFormat: "MM-DD-YYYY",
                };
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "end_date",
            header: "End Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "YYYY-MM-DD",
            filterEditor: DateFilter,
            filterEditorProps: (props, { index }) => {
                // for range and notinrange operators, the index is 1 for the after field
                return {
                    dateFormat: "MM-DD-YYYY",
                };
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "impact",
            header: "Event Impact",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "hours_difference",
            header: "Duration Impact",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            render: ({ value }) => {
                return formatTime(value);
            },
        },
        {
            name: "road_name",
            header: "Road Name",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },

        {
            name: "advice",
            header: "Advice",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "information",
            header: "More information",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "actions",
            header: "Actions",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            render: ({ value, data }) => {
                return (
                    <div>
                        <button
                            className={
                                "rounded text-goldd justify-center items-center  "
                            }
                            onClick={() => {
                                handleViewDetails(data.id);
                            }}
                        >
                            <span className="flex gap-x-1">
                                <EyeIcon className="h-4" />
                                View
                            </span>
                        </button>
                    </div>
                );
            },
        },
    ];

    const [filterValue, setFilterValue] = useState(defaultFilterValue);

    const dataSource = useCallback(loadData, []);
    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Traffic Report
                    </h1>
                </div>
            </div>
            <ReactDataGrid
                idProperty="id"
                style={gridStyle}
                columns={columns}
                className={"rounded-lg shadow-lg overflow-hidden"}
                showColumnMenuTool={false}
                enableColumnAutosize={false}
                filterValue={filterValue}
                onFilterValueChange={setFilterValue}
                pagination
                dataSource={dataSource}
                defaultLimit={15}
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

export default TraffiComp;
