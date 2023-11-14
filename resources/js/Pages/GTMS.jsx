import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import { useCallback } from "react";
import { useRef } from "react";
import { useState } from "react";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import BoolFilter from "@inovua/reactdatagrid-community/BoolFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import Button from "@inovua/reactdatagrid-community/packages/Button";
import CheckBox from "@inovua/reactdatagrid-community/packages/CheckBox";
import moment from "moment";
import { TroubleshootSharp } from "@mui/icons-material";

export default function Gtms(props) {
    window.moment = moment;
    const [selected, setSelected] = useState({});
    const gridRef = useRef(null);
    const toArray = (selected, dataMap) => {
        const keysObj = selected === true ? dataMap : selected;
        return Object.keys(keysObj).map((key) => Number(key));
    };
    const rowStyle = ({ data }) => {
        const colorMap = {
            ca: "#7986cb",
            uk: "#ef9a9a",
        };
        return {
            color: colorMap[data.country],
        };
    };
    const [autoHide, setAutoHide] = useState(false);
    const [alwaysShowTrack, setAlwaysShowTrack] = useState(false);
    const [redBackground, setRedBackground] = useState(false);
    const [customSize, setCustomSize] = useState(false);
    const [nativeScroll, setNativeScroll] = useState(false);

    const DateFilterEditor = ({ value, onChange }) => {
        return (
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        );
    };
    const dateOnlyFilter = {
        type: "dateOnly",
        operators: [
            {
                name: "eq",
                fn: ({ value, filterValue }) => {
                    const dateValue = new Date(value);
                    const filterDateValue = new Date(filterValue);
                    const isSameDate =
                        dateValue.getDate() === filterDateValue.getDate() &&
                        dateValue.getMonth() === filterDateValue.getMonth() &&
                        dateValue.getFullYear() ===
                            filterDateValue.getFullYear();
                    if (!filterValue) {
                        return true;
                    }
                    return isSameDate;
                },
            },
            {
                name: "neq",
                fn: ({ value, filterValue }) => {
                    const dateValue = new Date(value);
                    const filterDateValue = new Date(filterValue);
                    return !(
                        dateValue.getDate() === filterDateValue.getDate() &&
                        dateValue.getMonth() === filterDateValue.getMonth() &&
                        dateValue.getFullYear() ===
                            filterDateValue.getFullYear()
                    );
                },
            },
            {
                name: "gt",
                fn: ({ value, filterValue }) => {
                    const dateValue = new Date(value).setHours(0, 0, 0, 0);
                    const filterDateValue = new Date(filterValue).setHours(
                        0,
                        0,
                        0,
                        0
                    );
                    return dateValue > filterDateValue;
                },
            },
            {
                name: "lt",
                fn: ({ value, filterValue }) => {
                    const dateValue = new Date(value).setHours(0, 0, 0, 0);
                    const filterDateValue = new Date(filterValue).setHours(
                        0,
                        0,
                        0,
                        0
                    );
                    return dateValue < filterDateValue;
                },
            },
            {
                name: "inrange",
                fn: ({ value, filterValue }) => {
                    // if (
                    //     !Array.isArray(filterValue) ||
                    //     filterValue.length !== 2
                    // ) {
                    //     console.log("123")
                    //     return false; // Invalid filter value format
                    // }


                    const dateValue = new Date(value).setHours(0, 0, 0, 0);
                    console.log("dateValue", dateValue);
                    const startDate = new Date(filterValue.start).setHours(
                        0,
                        0,
                        0,
                        0
                    );
                    console.log("startDate", filterValue.start);
                    const endDate = new Date(filterValue.end).setHours(
                        0,
                        0,
                        0,
                        0
                    );
                    console.log("endDate", endDate);

                    return dateValue >= startDate && dateValue <= endDate;
                },
            },
            {
                name: "notinrange",
                fn: ({ value, filterValue }) => {
                    if (
                        !Array.isArray(filterValue) ||
                        filterValue.length !== 2
                    ) {
                        return false; // Invalid filter value format
                    }

                    const dateValue = new Date(value).setHours(0, 0, 0, 0);
                    const startDate = new Date(filterValue[0]).setHours(
                        0,
                        0,
                        0,
                        0
                    );
                    const endDate = new Date(filterValue[1]).setHours(
                        0,
                        0,
                        0,
                        0
                    );

                    return dateValue < startDate || dateValue > endDate;
                },
            },
            // Add other operators if needed
        ],
    };

    const scrollProps = Object.assign(
        {},
        ReactDataGrid.defaultProps.scrollProps,
        {
            autoHide: autoHide,
            alwaysShowTrack: alwaysShowTrack,
        }
    );
    if (customSize) {
        scrollProps.scrollThumbWidth = 15;
        scrollProps.scrollThumbOverWidth = 20;
    }
    if (redBackground) {
        scrollProps.scrollThumbStyle = {
            background: "#ff7474",
        };
    }
    const gridStyle = { minHeight: 600 };
    const people = [
        {
            id: 0,
            firstName: "Bill",
            name: "Bill",
            student: true,
            age: 20,
            city: "Manchester",
            country: "uk",
            email: "bill@manchester.uk",
            birthDate: "2023-10-19T16:30:00",
        },
        {
            id: 1,
            firstName: "Mary",
            name: "Mary",
            age: 22,
            student: true,
            city: "New York",
            country: "usa",
            email: "mary.mary@gmail.com",
            birthDate: "2023-10-19T16:30:26.440",
        },
        {
            id: 2,
            firstName: "John",
            name: "John",
            age: 32,
            student: false,
            city: "London",
            country: "uk",
            email: "john@London.com",
            birthDate: "2023-10-19T16:30:30.717",
        },
        {
            id: 3,
            firstName: "Boby",
            name: "Boby",
            age: 32,
            student: false,
            city: "Vancouver",
            country: "ca",
            email: "boby@vancouver.com",
            birthDate: "2023-10-19T14:30:41.477",
        },
        {
            id: 4,
            firstName: "Billy",
            name: "Billy",
            age: 32,
            student: false,
            city: "Edmonton",
            email: "billy@edmonton.ca",
            country: "ca",
            birthDate: "2023-10-19T12:30:42.707",
        },
        {
            id: 5,
            firstName: "Johny",
            name: "Johny",
            age: 32,
            student: true,
            city: "San Jose",
            country: "usa",
            email: "johny@yahoo.com",
            birthDate: "2023-10-19T08:30:46.647",
        },
        {
            id: 6,
            firstName: "Hilly",
            name: "Hilly",
            age: 32,
            student: true,
            city: "London",
            country: "uk",
            email: "hilly@london.co.uk",
            birthDate: "2010-12-05T00:00:00",
        },
        {
            id: 7,
            firstName: "Hillaay",
            name: "Hillaay",
            age: 47,
            student: false,
            city: "Bristol",
            country: "uk",
            email: "hillaay@britain.com",
            birthDate: "2023-10-19T06:30:57.723",
        },
        {
            id: 8,
            firstName: "Matthew",
            name: "Matthew",
            age: 47,
            student: false,
            city: "Leeds",
            country: "uk",
            email: "matthew@leeds.co.uk",
            birthDate: "2023-10-19T09:30:58.897",
        },
        {
            id: 9,
            firstName: "David",
            name: "David",
            age: 48,
            student: false,
            city: "Toronto",
            country: "ca",
            email: "david@toronto.com",
            birthDate: "2023-09-19T00:00:00",
        },
        {
            id: 10,
            firstName: "Richard",
            name: "Richard",
            age: 9,
            student: false,
            city: "Ottawa",
            country: "ca",
            email: "richard@ottawa.ca",
            birthDate: "2023-10-05T00:00:00",
        },
        {
            id: 11,
            firstName: "Hillary",
            name: "Hillary",
            age: 34,
            student: true,
            city: "Los Angeles",
            email: "hillary@gmail.com",
            country: "usa",
            birthDate: "2023-10-05T00:00:00",
        },
        {
            id: 12,
            firstName: "Maria",
            name: "Williams",
            age: 32,
            student: true,
            city: "New York",
            email: "maria@gmail.com",
            country: "usa",
            birthDate: "2023-10-18T16:30:31.667",
        },
    ];
    const fieldsToNormalize = ["birthDate"];
    function normalizeDateFieldsForMultipleObjects(dataArray, fields) {
        return dataArray?.map((data) => {
            const normalizedData = { ...data };
            fields.forEach((field) => {
                if (
                    normalizedData[field] &&
                    typeof normalizedData[field] === "string"
                ) {
                    normalizedData[field] = moment(
                        normalizedData[field]
                    ).toISOString();
                }
            });
            return normalizedData;
        });
    }
    const normalData = normalizeDateFieldsForMultipleObjects(
        people,
        fieldsToNormalize
    );
    const COUNTRIES = {
        ca: "Canada",
        uk: "United Kingdom",
        usa: "United States of America",
    };
    const countries = people.reduce((countries, p) => {
        if (countries.filter((c) => c.id == p.country).length) {
            return countries;
        }
        countries.push({
            id: p.country,
            label: COUNTRIES[p.country] || p.country,
        });

        return countries;
    }, []);
    const flags = [
        {
            ca: {
                type: "div",
                key: null,
                ref: null,
                props: {
                    style: {
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    },
                    children: {
                        type: "svg",
                        key: null,
                        ref: null,
                        props: {
                            viewBox: "0 0 48 48",
                            width: "32px",
                            height: "32px",
                            children: [
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#ECEFF1",
                                        d: "M2 9H46V39H2z",
                                    },
                                    _owner: null,
                                },
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#FF3D00",
                                        d: "M36 9H46V39H36zM2 9H12V39H2zM23 30H25V33H23z",
                                    },
                                    _owner: null,
                                },
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#FF3D00",
                                        d: "M33,27l-2-1l2-3h-3l-0.041-1.986l-2.311,1.159L28,17l-2,1l-1.993-3L22,18l-2-1l0.352,5.144l-2.312-1.128c0,0-0.045,1.974-0.04,1.984h-3l2,3l-2,1l4,2v2c0,0,4.722-0.259,5-0.259S29,31,29,31v-2L33,27z",
                                    },
                                    _owner: null,
                                },
                            ],
                        },
                        _owner: null,
                    },
                },
                _owner: null,
            },
            uk: {
                type: "div",
                key: null,
                ref: null,
                props: {
                    style: {
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    },
                    children: {
                        type: "svg",
                        key: null,
                        ref: null,
                        props: {
                            viewBox: "0 0 48 48",
                            width: "32px",
                            height: "32px",
                            children: [
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#3F51B5",
                                        d: "M2 10H46V38H2z",
                                    },
                                    _owner: null,
                                },
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#FFF",
                                        d: "M2 14.216L22.81 26.935 25.939 21.815 6.608 10 2 10z",
                                    },
                                    _owner: null,
                                },
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#FFF",
                                        d: "M46 10L42.391 10 23.061 21.814 26.189 26.935 46 14.826z",
                                    },
                                    _owner: null,
                                },
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#FFF",
                                        d: "M26.189 20.271L23.061 25.391 43.691 38 46 38 46 32.379z",
                                    },
                                    _owner: null,
                                },
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#FFF",
                                        d: "M2 32.991L2 38 5.31 38 25.939 25.392 22.811 20.271z",
                                    },
                                    _owner: null,
                                },
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#FFF",
                                        d: "M2 20H46V28H2z",
                                    },
                                    _owner: null,
                                },
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#FFF",
                                        d: "M20 10H28V38H20z",
                                    },
                                    _owner: null,
                                },
                                {
                                    type: "g",
                                    key: null,
                                    ref: null,
                                    props: {
                                        children: [
                                            {
                                                type: "path",
                                                key: null,
                                                ref: null,
                                                props: {
                                                    fill: "#E53935",
                                                    d: "M17.218 20L2 10.699 2 13.043 13.382 20zM44.309 10L27.947 20 31.782 20 46 11.311 46 10zM33.082 28L46 35.895 46 33.551 36.917 28zM15.918 28L2 36.506 2 38 3.392 38 19.753 28zM2 22H46V26H2z",
                                                },
                                                _owner: null,
                                            },
                                            {
                                                type: "path",
                                                key: null,
                                                ref: null,
                                                props: {
                                                    fill: "#E53935",
                                                    d: "M22 10H26V38H22z",
                                                },
                                                _owner: null,
                                            },
                                        ],
                                    },
                                    _owner: null,
                                },
                            ],
                        },
                        _owner: null,
                    },
                },
                _owner: null,
            },
            usa: {
                type: "div",
                key: null,
                ref: null,
                props: {
                    style: {
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    },
                    children: {
                        type: "svg",
                        key: null,
                        ref: null,
                        props: {
                            viewBox: "0 0 48 48",
                            width: "32px",
                            height: "32px",
                            children: [
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#ECEFF1",
                                        d: "M1.998 10H45.998V37H1.998z",
                                    },
                                    _owner: null,
                                },
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#F44336",
                                        d: "M2 10H46V13H2zM2 16H46V19H2zM2 22H46V25H2zM2 28H46V31H2zM2 34H46V37H2z",
                                    },
                                    _owner: null,
                                },
                                {
                                    type: "path",
                                    key: null,
                                    ref: null,
                                    props: {
                                        fill: "#3F51B5",
                                        d: "M2 10H23V25H2z",
                                    },
                                    _owner: null,
                                },
                                {
                                    type: "g",
                                    key: null,
                                    ref: null,
                                    props: {
                                        children: {
                                            type: "path",
                                            key: null,
                                            ref: null,
                                            props: {
                                                fill: "#FFF",
                                                d: "M4.25 12L4.713 12.988 5.75 13.146 5 13.916 5.178 15 4.25 14.488 3.322 15 3.5 13.916 2.75 13.146 3.787 12.988zM8.25 12L8.713 12.988 9.75 13.146 9 13.916 9.178 15 8.25 14.488 7.322 15 7.5 13.916 6.75 13.146 7.787 12.988zM12.25 12L12.713 12.988 13.75 13.146 13 13.916 13.178 15 12.25 14.488 11.322 15 11.5 13.916 10.75 13.146 11.787 12.988zM16.25 12L16.713 12.988 17.75 13.146 17 13.916 17.178 15 16.25 14.488 15.322 15 15.5 13.916 14.75 13.146 15.787 12.988zM20 12L20.463 12.988 21.5 13.146 20.75 13.916 20.928 15 20 14.488 19.072 15 19.25 13.916 18.5 13.146 19.537 12.988zM4.25 20L4.713 20.988 5.75 21.146 5 21.916 5.178 23 4.25 22.488 3.322 23 3.5 21.916 2.75 21.146 3.787 20.988zM8.25 20L8.713 20.988 9.75 21.146 9 21.916 9.178 23 8.25 22.488 7.322 23 7.5 21.916 6.75 21.146 7.787 20.988zM12.25 20L12.713 20.988 13.75 21.146 13 21.916 13.178 23 12.25 22.488 11.322 23 11.5 21.916 10.75 21.146 11.787 20.988zM16.25 20L16.713 20.988 17.75 21.146 17 21.916 17.178 23 16.25 22.488 15.322 23 15.5 21.916 14.75 21.146 15.787 20.988zM20 20L20.463 20.988 21.5 21.146 20.75 21.916 20.928 23 20 22.488 19.072 23 19.25 21.916 18.5 21.146 19.537 20.988zM5.25 16L5.713 16.988 6.75 17.146 6 17.916 6.178 19 5.25 18.488 4.322 19 4.5 17.916 3.75 17.146 4.787 16.988zM9.25 16L9.713 16.988 10.75 17.146 10 17.916 10.178 19 9.25 18.488 8.322 19 8.5 17.916 7.75 17.146 8.787 16.988zM13.25 16L13.713 16.988 14.75 17.146 14 17.916 14.178 19 13.25 18.488 12.322 19 12.5 17.916 11.75 17.146 12.787 16.988zM17.25 16L17.713 16.988 18.75 17.146 18 17.916 18.178 19 17.25 18.488 16.322 19 16.5 17.916 15.75 17.146 16.787 16.988zM21 16L21.463 16.988 22.5 17.146 21.75 17.916 21.928 19 21 18.488 20.072 19 20.25 17.916 19.5 17.146 20.537 16.988z",
                                            },
                                            _owner: null,
                                        },
                                    },
                                    _owner: null,
                                },
                            ],
                        },
                        _owner: null,
                    },
                },
                _owner: null,
            },
        },
    ];
    const filterValue = [
        { name: "name", operator: "startsWith", type: "string", value: "" },
        { name: "age", operator: "gte", type: "number", value: null },
        { name: "city", operator: "startsWith", type: "string", value: "" },
        {
            name: "birthDate",
            operator: "eq",
            type: "dateOnly",
            value: null,
        },
        { name: "student", operator: "eq", type: "boolean", value: null },
        { name: "country", operator: "eq", type: "select", value: null },
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
    const groups = [{ name: "personalInfo", header: "Personal info" }];
    function testButton(object) {
        console.log(object);
    }
    const columns = [
        {
            name: "id",
            header: "Id",
            defaultVisible: TroubleshootSharp,
            defaultWidth: 80,
            type: "number",
        },
        {
            name: "name",
            header: "Name",
            defaultFlex: 1,
            group: "personalInfo",
            filterEditorProps: {
                placeholder: "Name",
                renderSettings: ({ className }) => filterIcon(className),
            },
        },
        {
            name: "age",
            group: "personalInfo",
            header: "Age",
            defaultFlex: 1,
            type: "number",
            headerAlign: "center",
            textAlign: "end",
            render: ({ value }) => {
                return <span> $ {value}</span>;
            },
            filterEditor: NumberFilter,
        },
        {
            name: "country",
            header: "Country",
            defaultFlex: 1,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: countries,
                renderSettings: ({ className }) => filterIcon(className),
            },
            render: ({ value }) => (flags[value] ? flags[value] : value),
        },
        {
            name: "birthDate",
            header: "Birth date",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: DateFilter,
            filterable: true,
            filterType: "dateOnly",
            filterEditorProps: (props, { index }) => {
                // for range and notinrange operators, the index is 1 for the after field
                return {
                    dateFormat: "YYYY-MM-DD",
                };
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("YYYY-MM-DD hh:mm A");
            },
        },
        {
            name: "student",
            header: "Student",
            type: "boolean",
            defaultFlex: 1,
            minwidth: 100,
            filterEditor: BoolFilter,
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
        { name: "city", header: "City", defaultFlex: 1 },
        {
            header: "Edit",
            defaultFlex: 1,
            headerAlign: "center",
            textAlign: "center",
            render: ({ value, data }) => {
                return (
                    <div style={{ display: "inline-block" }}>
                        <Button
                            onClick={() => {
                                testButton(data);
                            }}
                        >
                            Show Data
                        </Button>
                    </div>
                );
            },
        },
    ];
    const onSelectionChange = useCallback(({ selected }) => {
        setSelected(selected);
    }, []);
    const dataMap =
        gridRef && gridRef.current && gridRef.current.dataMap
            ? gridRef.current.dataMap
            : null;
    const downloadBlob = (blob, fileName = "grid-data.csv") => {
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.position = "absolute";
        link.style.visibility = "hidden";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };

    const exportCSV = () => {
        const SEPARATOR = ",";

        const columns = gridRef.current.visibleColumns;
        const header = columns.map((c) => c.name).join(SEPARATOR);
        const rows = gridRef.current.data.map((data) =>
            columns.map((c) => data[c.id]).join(SEPARATOR)
        );
        const contents = [header].concat(selected).join("\n");
        const blob = new Blob([contents], { type: "text/csv;charset=utf-8;" });
        // downloadBlob(blob);
    };

    return (
        <div className="container mx-auto mt-32">
            {/* <Sidebar /> */}
            <div className=" h-screen lg:pl-20 pt-16 ">
                <h3>Customized scrollbars</h3>
                <div style={{ marginBottom: 16 }}>
                    <CheckBox
                        disabled={nativeScroll}
                        checked={!nativeScroll && autoHide}
                        onChange={setAutoHide}
                    >
                        Auto-hide scrollbars
                    </CheckBox>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <CheckBox
                        disabled={nativeScroll}
                        checked={!nativeScroll && alwaysShowTrack}
                        onChange={setAlwaysShowTrack}
                    >
                        Always show track
                    </CheckBox>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <CheckBox
                        disabled={nativeScroll}
                        checked={!nativeScroll && redBackground}
                        onChange={setRedBackground}
                    >
                        Red background for scroll thumbs
                    </CheckBox>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <CheckBox
                        disabled={nativeScroll}
                        checked={!nativeScroll && customSize}
                        onChange={setCustomSize}
                    >
                        Custom scrollbar size
                    </CheckBox>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <CheckBox checked={nativeScroll} onChange={setNativeScroll}>
                        Use native scroll
                    </CheckBox>
                </div>
                <ReactDataGrid
                    idProperty="id"
                    handle={(ref) =>
                        (gridRef.current = ref ? ref.current : null)
                    }
                    pagination
                    rowStyle={rowStyle}
                    showColumnMenuTool={false}
                    selected={selected}
                    style={gridStyle}
                    filterTypes={{
                        ...ReactDataGrid.defaultProps.filterTypes,
                        dateOnly: dateOnlyFilter,
                    }}
                    checkboxColumn
                    onSelectionChange={onSelectionChange}
                    scrollProps={scrollProps}
                    nativeScroll={nativeScroll}
                    defaultFilterValue={filterValue}
                    columns={columns}
                    groups={groups}
                    dataSource={normalData}
                />
                <Button
                    style={{ marginTop: 20, marginBottom: 20 }}
                    onClick={exportCSV}
                >
                    Export CSV
                </Button>
            </div>
        </div>
    );
}
