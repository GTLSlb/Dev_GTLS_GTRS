import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import { useState } from "react";
import TableStructure from "@/Components/TableStructure";
import { useEffect, useRef } from "react";
import moment from "moment";
import AddHoliday from "./Components/AddHoliday";
import { PencilIcon } from "@heroicons/react/20/solid";
import { canAddHolidays, canEditHolidays } from "@/permissions";
import { getApiRequest } from "@/CommonFunctions";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import AnimatedLoading from "@/Components/AnimatedLoading";
import GtrsButton from "../GtrsButton";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import {ToastContainer} from 'react-toastify';

window.moment = moment;
export default function Holidays({
    holidays,
    setHolidays,
    url,
    AToken,
    filterValue,
    setFilterValue,
    userPermission,
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
    }, []);

    const gridRef = useRef(null);
    async function fetchData() {
        const data = await getApiRequest(`${url}Holidays`, {
            UserId: currentUser?.UserId,
        });

        if (data) {
            const sortedHolidays = data.sort((a, b) => b.HolidayDate.localeCompare(a.HolidayDate));
            setHolidays(sortedHolidays);
            setIsFetching(false);
        }
    }

    const [selected, setSelected] = useState([]);
    const holidayOptions = createNewLabelObjects(holidays, "HolidayName");
    const stateOptions = createNewLabelObjects(holidays, "HolidayState");

    const [columns, setColumns] = useState([
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
                return moment(value).format("DD-MM-YYYY") === "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY");
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
    ]);
    const scrollIntoView = ()=>{
        const button = document.getElementById('addSection');
        if(button){
            button.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    }

    useEffect(() => {
        if (holidayOptions && stateOptions) {
            if (userPermission && canEditHolidays(userPermission)) {
                setColumns([
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
                            return moment(value).format("DD-MM-YYYY") ==
                                "Invalid date"
                                ? ""
                                : moment(value).format("DD-MM-YYYY");
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
                        header: "Edit",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 100,
                        render: ({ value, data }) => {
                            return (
                                <div>
                                    {canEditHolidays(userPermission) ? (
                                        <button
                                            className={
                                                "rounded text-blue-500 justify-center items-center  "
                                            }
                                            onClick={() => {
                                                handleEditClick(data);
                                                scrollIntoView();
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
                ]);
            } else {
                setColumns([
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
                            return moment(value).format("DD-MM-YYYY") ==
                                "Invalid date"
                                ? ""
                                : moment(value).format("DD-MM-YYYY");
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
                ]);
            }
        }
    }, [userPermission, holidayOptions, stateOptions]);

    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, holidays);

        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        const customCellHandlers = {
            HolidayStatus: (value) => (value === 1 ? true : false),
        };

        exportToExcel(
            jsonData,
            columnMapping,
            "Holidays.xlsx",
            customCellHandlers
        );
    };
    const additionalButtons = (
        <div>
            {canAddHolidays(userPermission) ? (
                <div>
                    {!showAdd && (
                        <GtrsButton
                            name={"Add holiday"}
                            onClick={ToggleShow}
                            className="w-[5.5rem] h-[36px]"
                        />
                    )}
                </div>
            ) : null}
        </div>
    );
    return (
        <div>
            {/* Added this for toast container to show */}
            <ToastContainer />
            {isFetching ? (
                <AnimatedLoading />
            ) : (
                <div className="pt-4 px-4 sm:pt-6 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    {showAdd ? (
                        <div id="addSection">
                        <AddHoliday
                            states={stateOptions}
                            holiday={holiday}
                            url={url}
                            AToken={AToken}
                            currentUser={currentUser}
                            userPermission={userPermission}
                            setHoliday={setHoliday}
                            setShowAdd={setShowAdd}
                            fetchData={fetchData}
                            closeModal={ToggleShow}
                        />
                        </div>
                    ) : null}

                    <TableStructure
                        id={"HolidayId"}
                        title={"Holidays"}
                        setSelected={setSelected}
                        gridRef={gridRef}
                        additionalButtons={additionalButtons}
                        handleDownloadExcel={handleDownloadExcel}
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
