import React, { useState, useEffect, useCallback } from "react";
3;
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";

const gtrsWebUrl = window.Laravel.gtrsWeb;

const loadData = ({ skip, limit, sortInfo, filterValue }) => {
    console.log(skip, limit, sortInfo);
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
    const gridStyle = { minHeight: 550, marginTop: 10 };

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
            name: "road_name",
            header: "Road Name",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
        },
        {
            name: "impact",
            header: "Event Impact",
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
                // enableColumnFilterContextMenu={false}
                enableColumnAutosize={false}
                filterValue={filterValue}
                onFilterValueChange={setFilterValue}
                pagination
                dataSource={dataSource}
                defaultLimit={15}
            />
        </div>
    );
}

export default TraffiComp;
