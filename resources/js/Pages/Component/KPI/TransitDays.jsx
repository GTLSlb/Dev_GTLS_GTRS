import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import BoolFilter from "@inovua/reactdatagrid-community/BoolFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import Button from "@inovua/reactdatagrid-community/packages/Button";
import { useState, useEffect } from "react";
import TableStructure from "@/Components/TableStructure";
import GtamButton from "../GTAM/components/Buttons/GtamButton";
import { PencilIcon } from "@heroicons/react/20/solid";

const temp = [
    {
        HolidayId: 1,
        HolidayName: "holiday1",
        HolidayDate: "2023-06-06",
        HolidayState: "1",
        HolidayDesc: "test",
    },
];

export default function TransitDays({
    transitDays,
    currentUser,
    setTransitDays,
    url,
    filterValue,
    setFilterValue,
    setActiveIndexGTRS,
    setTransitDay,
}) {
    const [isFetching, setIsFetching] = useState();
    useEffect(() => {
        if (!transitDays) {
            setIsFetching(true);
            fetchData();
        }
    }, []); // Empty dependency array ensures the effect runs only once
    const fetchData = async () => {
        try {
            axios
                .get(`${url}api/GTRS/Transits`, {
                    headers: {
                        RoleId: currentUser.role_id,
                    },
                })
                .then((res) => {
                    const x = JSON.stringify(res.data);
                    const parsedDataPromise = new Promise((resolve, reject) => {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData);
                    });
                    parsedDataPromise.then((parsedData) => {
                        setTransitDays(parsedData);
                        setIsFetching(false);
                    });
                });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
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
    const createNewLabelObjects = (data, fieldName) => {
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];
        // Map through the data and create new objects
        data?.forEach((item) => {
            const fieldValue = item[fieldName];
            if (
                fieldValue &&
                fieldValue.trim() !== "" &&
                !uniqueLabels.has(fieldValue)
            ) {
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
    const senderStateOptions = createNewLabelObjects(
        transitDays,
        "SenderState"
    );
    const senderCityOptions = createNewLabelObjects(transitDays, "SenderCity");
    const senderSuburbsOptions = createNewLabelObjects(
        transitDays,
        "SenderSuburb"
    );
    const receiverStateOptions = createNewLabelObjects(
        transitDays,
        "ReceiverState"
    );
    const receiverCityOptions = createNewLabelObjects(
        transitDays,
        "ReceiverCity"
    );
    const receiverSuburbsOptions = createNewLabelObjects(
        transitDays,
        "ReceiverSuburb"
    );
    const [selected, setSelected] = useState([]);
    const customers = [
        { id: "UNILEVER", label: "UNILEVER" },
        { id: "GMI", label: "GMI" },
        { id: "FREIGHT PEOPLE", label: "FREIGHT PEOPLE" },
    ];
    const types = [
        { id: "FOOD" , label: "FOOD" },
        { id: "HPC", label: "HPC" },
        { id: "Food Solutions - QLD" , label: "Food Solutions - QLD" },
        { id: "METCASH" , label: "METCASH" },
    ];
    
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
            name: "CustomerName",
            header: "Customer Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: customers,
            },
        },
        {
            name: "CustomerType",
            header: "Customer Type",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: types,
            },
        },
        {
            name: "SenderState",
            header: "Sender State",
            type: "string",
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
            name: "SenderCity",
            header: "Sender City",
            type: "string",
            headerAlign: "center",
            group: "senderDetails",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderCityOptions,
            },
        },
        {
            name: "SenderSuburb",
            header: "Sender Suburb",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            group: "senderDetails",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderSuburbsOptions,
            },
        },
        {
            name: "SenderPostCode",
            header: "Sender PostCode",
            type: "number",
            headerAlign: "center",
            group: "senderDetails",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "ReceiverName",
            header: "Receiver Name",
            type: "string",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverState",
            header: "Receiver State",
            group: "receiverDetails",
            type: "string",
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
            name: "ReceiverCity",
            header: "Receiver City",
            group: "receiverDetails",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverCityOptions,
            },
        },
        {
            name: "ReceiverSuburb",
            header: "Receiver Suburb",
            group: "receiverDetails",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverSuburbsOptions,
            },
        },
        {
            name: "ReceiverPostCode",
            header: "Receiver PostCode",
            type: "number",
            headerAlign: "center",
            group: "receiverDetails",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "TransitTime",
            header: "Transit Time",
            type: "number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "edit",
            header: "edit",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 100,
            render: ({ value, data }) => {
                return (
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
                );
            },
        },
    ];

    function handleEditClick(object) {
        setTransitDay(object);
        setActiveIndexGTRS(15);
    }

    function AddTransit() {
        setTransitDay(null);
        setActiveIndexGTRS(15);
    }

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
                <div>
                    <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex w-full items-center justify-between mt-6">
                                <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                    Transit Days
                                </h1>
                                <GtamButton
                                    name={"Add +"}
                                    onClick={AddTransit}
                                />
                            </div>
                        </div>
                        <TableStructure
                            id={"TransitId"}
                            setSelected={setSelected}
                            selected={selected}
                            groupsElements={groups}
                            tableDataElements={transitDays}
                            filterValueElements={filterValue}
                            setFilterValueElements={setFilterValue}
                            columnsElements={columns}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}