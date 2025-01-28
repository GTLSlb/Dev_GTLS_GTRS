import { handleDownloadExcel } from "@/Components/utils/TrafficRepTableUtils";
import { createNewLabelObjects, createNewLabelObjectsUsingIds } from "@/Components/utils/dataUtils";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import "@inovua/reactdatagrid-community/index.css";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import EventModal from "./EventModal";

const gtrsWebUrl = window.Laravel.gtrsWeb;

const columnMapping = {
    api_source: "State",
    suburb: "Suburb",
    event_type: "Event Type",
    description: "Event Description",
    start_date: "Start Date",
    end_date: "End Date",
    impact: "Event Impact",
    hours_difference: "Duration Impact",
    road_name: "Road Name",
    advice: "Advice",
    information: "More information",
};
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
    { name: "api_source", type: "select", operator: "inlist", value: "" },
    { name: "event_category_id", type: "select", operator: "inlist", value: "" },
    { name: "description", type: "string", operator: "contains", value: "" },
    {
        name: "hours_difference",
        type: "string",
        operator: "contains",
        value: "",
    },
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
    { name: "advice", type: "string", operator: "contains", value: "" },
    { name: "information", type: "string", operator: "contains", value: "" },
];

const states = [
    {
        id: "NSW",
        label: "NSW",
    },
    {
        id: "VIC",
        label: "VIC",
    },
    {
        id: "QLD",
        label: "QLD",
    },
    {
        id: "SA",
        label: "SA",
    },
];

function TraffiComp() {
    const gridRef = useRef(null);
    const gridStyle = { minHeight: 550, marginTop: 10 };
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [eventDetails, setEventDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [datatoexport, setDatatoexport] = useState([]);
    const [exportLoading, setExportLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesOptions, setCategoriesOptions] = useState([]);
    function getAllEvents() {
        axios
            .get(`${gtrsWebUrl}get-eventsCategories`)
            .then((res) => {
                console.log(createNewLabelObjectsUsingIds(res.data,"id", "event_category"))
                setCategoriesOptions(
                    createNewLabelObjectsUsingIds(res.data,"id", "event_category")
                    
                );
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

    const columns = [
        // {
        //     name: "event_id",
        //     header: "event_id",
        //     headerAlign: "center",
        //     textAlign: "center",
        //     defaultWidth: 170,
        // },
        {
            name: "api_source",
            header: "State",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: states,
            },
        },
        {
            name: "suburb",
            header: "Suburb",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "event_category_id",
            header: "Event Type",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: categoriesOptions,
            },
            render: ({value, data }) => {
                return getEventCategoryById(value);
            },
        },
        {
            name: "description",
            header: "Event Description",
            headerAlign: "center",
            textAlign: "left",
            defaultWidth: 170,
        },
        {
            name: "start_date",
            header: "Start Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
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
            dateFormat: "DD-MM-YYYY",
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
            textAlign: "left",
            defaultWidth: 170,
        },
        {
            name: "hours_difference",
            header: "Duration Impact",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            render: ({ value }) => {
                return value;
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
            textAlign: "left",
            defaultWidth: 170,
        },
        {
            name: "information",
            header: "More information",
            headerAlign: "center",
            textAlign: "left",
            defaultWidth: 170,
        },
    ];

    const getexceldata = (filterValue) => {
        setExportLoading(true);
        const url =
            `${gtrsWebUrl}get-positions` +
            "?filterBy=" +
            JSON.stringify(filterValue);

        return fetch(url).then((response) => {
            // const totalCount = response.headers.get("X-Total-Count");
            return response.json().then((data) => {
                // const totalCount = data.pagination.total;
                setDatatoexport(data);
                handleDownloadExcel(data);
            });
        });
    };

    
    const [filterValue, setFilterValue] = useState(defaultFilterValue);

    const dataSource = useCallback(loadData, []);
    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);

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
    console.log(filterValue)
    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Traffic Report
                    </h1>
                </div>
                <Popover className="relative ">
                    <button>
                        <Popover.Button
                            className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                // datatoexport?.length === 0
                                exportLoading
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-gray-800"
                            } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                            disabled={exportLoading}
                        >
                            {exportLoading ? "Exporting..." : "Export"}
                            <ChevronDownIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </Popover.Button>
                    </button>
                    {isMessageVisible && (
                        <div className="absolute top-9.5 text-center left-0 md:-left-14 w-[9rem] right-0 bg-red-200 text-dark z-10 text-xs py-2 px-4 rounded-md opacity-100 transition-opacity duration-300">
                            {hoverMessage}
                        </div>
                    )}

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute left-20 lg:left-0 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                            <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                <div className="p-4">
                                    <div className="mt-2 flex flex-col">
                                        {Object.entries(columnMapping).map(
                                            ([key, value]) => (
                                                <label key={key} className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value={key}
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    {value}
                                                </label>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                    <button
                                        // onClick={getexceldata(filterValue)}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            getexceldata(filterValue);
                                        }}
                                        disabled={exportLoading}
                                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                    >
                                        Export XLS
                                    </button>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </Popover>
            </div>
            <ReactDataGrid
                idProperty="id"
                handle={(ref) => (gridRef.current = ref ? ref.current : [])}
                style={gridStyle}
                columns={columns}
                className={"rounded-lg shadow-lg overflow-hidden"}
                showColumnMenuTool={false}
                enableColumnAutosize={false}
                filterValue={filterValue}
                loadingText=" " // to make sure that no text is showing when loading
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
