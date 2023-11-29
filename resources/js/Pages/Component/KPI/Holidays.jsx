import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import BoolFilter from "@inovua/reactdatagrid-community/BoolFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import Button from "@inovua/reactdatagrid-community/packages/Button";
import { useState } from "react";
import TableStructure from "@/Components/TableStructure";
import { useEffect } from "react";
import moment from "moment";
import AddHoliday from "./Components/AddHoliday";
import GtamButton from "../GTAM/components/Buttons/GtamButton";
import { PencilIcon } from "@heroicons/react/20/solid";
import { canAddHolidays, canEditHolidays } from "@/permissions";

const temp = [
    {
        HolidayId: 1,
        HolidayName: "holiday1",
        HolidayDate: "06-06-2023",
        HolidayState: "1",
        HolidayDesc: "test",
    },
];
window.moment = moment;
export default function Holidays({
    holidays,
    setHolidays,
    url,
    filterValue,
    setFilterValue,
    currentUser,
}) {
    const [isFetching, setIsFetching] = useState();
    const [showAdd, setShowAdd] = useState(false);
    const [holiday, setHoliday] = useState();

    function handleEditClick(object) {
        setHoliday(null);
        setHoliday(object);
        if (!showAdd) {
            setShowAdd(true);
        }
    }

    function ToggleShow() {
        setShowAdd(!showAdd);
        setHoliday(null);
    }

    useEffect(() => {
        if (!holidays) {
            setIsFetching(true);
            fetchData();
        }
    }, []); // Empty dependency array ensures the effect runs only once

    const fetchData = async () => {
        try {
            axios
                .get(`${url}api/GTRS/Holidays`, {
                    headers: {
                        RoleId: currentUser.UserId,
                    },
                })
                .then((res) => {
                    const x = JSON.stringify(res.data);
                    const parsedDataPromise = new Promise((resolve, reject) => {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData);
                    });
                    parsedDataPromise.then((parsedData) => {
                        setHolidays(parsedData);
                        setIsFetching(false);
                    });
                });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const [selected, setSelected] = useState([]);
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
    const holidayOptions = createNewLabelObjects(holidays, "HolidayName");
    const stateOptions = createNewLabelObjects(holidays, "HolidayState");
    function getMinMaxValue(data, fieldName, identifier) {
        // Check for null safety
        if (!data || !Array.isArray(data) || data.length === 0) {
            return null;
        }

        // Filter out entries with empty or invalid dates
        const validData = data.filter(
            (item) => item[fieldName] && !isNaN(new Date(item[fieldName]))
        );

        // If no valid dates are found, return null
        if (validData.length === 0) {
            return null;
        }

        // Sort the valid data based on the fieldName
        const sortedData = [...validData].sort((a, b) => {
            return new Date(a[fieldName]) - new Date(b[fieldName]);
        });

        // Determine the result date based on the identifier
        let resultDate;
        if (identifier === 1) {
            resultDate = new Date(sortedData[0][fieldName]);
        } else if (identifier === 2) {
            resultDate = new Date(sortedData[sortedData.length - 1][fieldName]);
        } else {
            return null;
        }

        // Convert the resultDate to the desired format "01-10-2023"
        const day = String(resultDate.getDate()).padStart(2, "0");
        const month = String(resultDate.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
        const year = resultDate.getFullYear();

        return `${day}-${month}-${year}`;
    }
    // Usage example remains the same

    const filterIcon = (className) => {
        return (
            <svg
                className={className}
                enable-background="new 0 0 24 24"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
            >
                <g>
                    <path d="M0,0h24 M24,24H0" fill="none" />
                    <path d="M7,6h10l-5.01,6.3L7,6z M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6 c0,0,3.72-4.8,5.74-7.39C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z" />
                    <path d="M0,0h24v24H0V0z" fill="none" />
                </g>
            </svg>
        );
    };
    const columns = [
        {
            name: "HolidayName",
            minWidth: 170,
            defaultFlex: 1,
            header: "Holiday Name",
            type: "string",
            headerAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: holidayOptions,
            },
        },
        {
            name: "HolidayDate",
            defaultFlex: 1,
            minWidth: 230,
            header: "Holiday Date",
            headerAlign: "center",
            textAlign: "center",
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "HolidayState",
            defaultFlex: 1,
            minWidth: 170,
            header: "Holiday State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: stateOptions,
            },
        },
        {
            name: "HolidayDesc",
            header: "Description",
            minWidth: 170,
            defaultFlex: 1,
            headerAlign: "center",
            textAlign: "start",
            filterEditor: StringFilter,
        },
        {
            name: "HolidayStatus",
            minWidth: 170,
            header: "Status",
            defaultFlex: 1,
            headerAlign: "center",
            textAlign: "center",
            render: ({ value }) => {
                return value == 1 ? (
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
            name: "edit",
            header: "edit",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 100,
            render: ({ value, data }) => {
                return (
                    <div>
                        {canEditHolidays(currentUser) ? (
                            <button
                                className={
                                    "rounded text-blue-500 justify-center items-center  "
                                }
                                onClick={() => {
                                    handleEditClick(data);
                                }}
                            >
                                <span className="flex gap-x-1">
                                    <PencilIcon className="h-4" />
                                    Edit
                                </span>
                            </button>
                        ) : null}
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            {isFetching ? (
                <div className="min-h-screen md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce200`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full animate-bounce400`}
                        ></div>
                    </div>
                    <div className="text-dark mt-4 font-bold">
                        Please wait while we get the data for you.
                    </div>
                </div>
            ) : (
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex w-full items-center justify-between mt-6">
                            <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                Holidays
                            </h1>
                            {canAddHolidays(currentUser) ? (
                                <div>
                                    {showAdd ? (
                                        <GtamButton
                                            name={"Cancel"}
                                            onClick={ToggleShow}
                                        />
                                    ) : (
                                        <GtamButton
                                            name={"Add holiday"}
                                            onClick={ToggleShow}
                                        />
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    {showAdd ? (
                        <AddHoliday
                            states={stateOptions}
                            holiday={holiday}
                            url={url}
                            currentUser={currentUser}
                            setHoliday={setHoliday}
                            setShowAdd={setShowAdd}
                            fetchData={fetchData}
                        />
                    ) : null}

                    <TableStructure
                        id={"HolidayId"}
                        setSelected={setSelected}
                        selected={selected}
                        tableDataElements={holidays}
                        filterValueElements={filterValue}
                        setFilterValueElements={setFilterValue}
                        columnsElements={columns}
                    />
                </div>
            )}
        </div>
    );
}
