import { useState } from "react";
import React from "react";
import PropTypes from "prop-types";
import "../../../css/reactdatagrid.css";
import TableStructure from "@/Components/TableStructure";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { useEffect, useRef } from "react";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
function TransportRep({
    transportData,
    minDate,
    maxDate,
    filterValue,
    setFilterValue,
    accData,
}) {
    const RDDTimeFilter = forwardRef(({ filterValue, onChange }, ref) => {
        const [value, setValue] = useState(
            filterValue ? filterValue.value : ""
        );

        const handleChange = (event) => {
            const newValue = event.target.value + ":00";
            setValue(newValue);
            onChange({
                name: "RddTime",
                value: newValue,
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        const handleClear = () => {
            setValue("");
            onChange({
                name: "RddTime",
                value: "",
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        useEffect(() => {
            setValue(filterValue ? filterValue.value : "");
        }, [filterValue]);

        useImperativeHandle(ref, () => ({
            setValue: (newValue) => {
                setValue(newValue);
            },
        }));

        return (
            <div className="flex gap-2 p-[4px]">
                <input
                    type="time"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm h-[32px]"
                    value={value.slice(0, 5)}
                    onChange={handleChange}
                />
                <button onClick={handleClear}>
                    <svg
                        tabIndex="0"
                        className="InovuaReactDataGrid__column-header__filter-settings-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                    >
                        <path
                            fillRule="evenodd"
                            d="M13.222 2H.778C.348 2 0 1.552 0 1s.348-1 .778-1h12.444c.43 0 .778.448.778 1s-.348 1-.778 1zM1.556 3.111l3.888 4.667v5.444c0 .43.349.778.778.778h1.556c.43 0 .778-.348.778-.778V7.778l3.888-4.667H1.556z"
                        ></path>
                    </svg>
                </button>
            </div>
        );
    });
    RDDTimeFilter.displayName = "RDDTimeFilter";
    RDDTimeFilter.propTypes = {
        filterValue: PropTypes.object,
        onChange: PropTypes.func,
    };

    const PickTimeFilter = forwardRef(({ filterValue, onChange }, ref) => {
        const [value, setValue] = useState(
            filterValue ? filterValue.value : ""
        );

        const handleChange = (event) => {
            const newValue = event.target.value + ":00";
            setValue(newValue);
            onChange({
                name: "PickupTime",
                value: newValue,
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        const handleClear = () => {
            setValue("");
            onChange({
                name: "PickupTime",
                value: "",
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        useEffect(() => {
            setValue(filterValue ? filterValue.value : "");
        }, [filterValue]);

        // Expose the setValue method to the grid
        useImperativeHandle(ref, () => ({
            setValue: (newValue) => {
                setValue(newValue || "");
            },
        }));

        return (
            <div className="flex gap-2 p-[4px]">
                <input
                    type="time"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm h-[32px]"
                    value={value.slice(0, 5)}
                    onChange={handleChange}
                />
                <button onClick={handleClear}>
                    <svg
                        tabIndex="0"
                        className="InovuaReactDataGrid__column-header__filter-settings-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                    >
                        <path
                            fillRule="evenodd"
                            d="M13.222 2H.778C.348 2 0 1.552 0 1s.348-1 .778-1h12.444c.43 0 .778.448.778 1s-.348 1-.778 1zM1.556 3.111l3.888 4.667v5.444c0 .43.349.778.778.778h1.556c.43 0 .778-.348.778-.778V7.778l3.888-4.667H1.556z"
                        ></path>
                    </svg>
                </button>
            </div>
        );
    });
    PickTimeFilter.displayName = "PickTimeFilter";
    PickTimeFilter.propTypes = {
        filterValue: PropTypes.array,
        onChange: PropTypes.func,
    };
    const DeliveryTimeFilter = forwardRef(({ filterValue, onChange }, ref) => {
        const [value, setValue] = useState(
            filterValue ? filterValue.value : ""
        );

        const handleChange = (event) => {
            const newValue = event.target.value + ":00";
            setValue(newValue);
            onChange({
                name: "ActualDeliveryTime",
                value: newValue,
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        const handleClear = () => {
            setValue("");
            onChange({
                name: "ActualDeliveryTime",
                value: "",
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        useEffect(() => {
            setValue(filterValue ? filterValue.value : "");
        }, [filterValue]);

        // Expose the setValue method to the grid
        useImperativeHandle(ref, () => ({
            setValue: (newValue) => {
                setValue(newValue || "");
            },
        }));

        return (
            <div className="flex gap-2 p-[4px]">
                <input
                    type="time"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm h-[32px]"
                    value={value.slice(0, 5)}
                    onChange={handleChange}
                />
                <button onClick={handleClear}>
                    <svg
                        tabIndex="0"
                        className="InovuaReactDataGrid__column-header__filter-settings-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                    >
                        <path
                            fillRule="evenodd"
                            d="M13.222 2H.778C.348 2 0 1.552 0 1s.348-1 .778-1h12.444c.43 0 .778.448.778 1s-.348 1-.778 1zM1.556 3.111l3.888 4.667v5.444c0 .43.349.778.778.778h1.556c.43 0 .778-.348.778-.778V7.778l3.888-4.667H1.556z"
                        ></path>
                    </svg>
                </button>
            </div>
        );
    });
    DeliveryTimeFilter.displayName = "DeliveryTimeFilter";
    DeliveryTimeFilter.propTypes = {
        filterValue: PropTypes.array,
        onChange: PropTypes.func,
    };
    window.moment = moment;
    const [filteredData, setFilteredData] = useState(transportData);
    const [selected, setSelected] = useState({});
    const gridRef = useRef(null);

    function extractFormattedDate(datetime) {
        if (!datetime) return null;

        // Split the datetime string to get the date part
        const datePart = datetime.split(" ")[0];

        if (!datePart) return null;

        // Split the date part into year, month, and day
        const [year, month, day] = datePart.split("-");

        if (!year || !month || !day) return null;

        // Rearrange into DD-MM-YYYY format
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    }
    function extractUTCFormattedDate(datetime) {
        if (!datetime) return null;

        // Split the datetime string to get the date part
        const datePart = datetime.split("T")[0];

        if (!datePart) return null;

        // Split the date part into year, month, and day
        const [year, month, day] = datePart.split("-");

        if (!year || !month || !day) return null;

        // Rearrange into DD-MM-YYYY format
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    }
    const handleDownloadExcel = () => {
        // Fetch the filtered data
        const jsonData = handleFilterTable(gridRef, filteredData);

        // Dynamically create column mapping from the `columns` array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers (e.g., for formatting dates)
        const customCellHandlers = {
            RddDate: (value) => (value ? new Date(value) : null),
            PickupDate: (value) => (value ? new Date(value) : null),
            ActualDeliveryDate: (value) => (value ? new Date(value) : null),
        };
        const formatted = [
            {
                field: "RddDate",
                format: "dd-mm-yyyy",
            },
            {
                field: "PickupDate",
                format: "dd-mm-yyyy",
            },
            {
                field: "ActualDeliveryDate",
                format: "dd-mm-yyyy",
            },
        ];
        // Call the exportToExcel function with the column mapping and custom cell handlers
        exportToExcel(
            jsonData,
            columnMapping,
            "Transport-Report.xlsx",
            customCellHandlers,
            ["RddDate", "PickupDate", "ActualDeliveryDate"],
            formatted
        );
    };

    const minRDDDate = getMinMaxValue(transportData, "RDD", 1);
    const maxRDDDate = getMinMaxValue(transportData, "RDD", 2);
    const minArrivedDate = getMinMaxValue(
        transportData,
        "ActualDeliveryDate",
        1
    );
    const maxArrivedDate = getMinMaxValue(
        transportData,
        "ActualDeliveryDate",
        2
    );
    const statusOptions = createNewLabelObjects(transportData, "Status");
    const LTLFTLOptions = createNewLabelObjects(transportData, "LTLFTL");
    const stateOptions = createNewLabelObjects(transportData, "State");
    const SenderstateOptions = createNewLabelObjects(
        transportData,
        "SenderState"
    );
    const reasonsOptions = createNewLabelObjects(transportData, "DelayReason");
    const onTimeOptions = createNewLabelObjects(transportData, "OnTime");
    const carrierOptions = createNewLabelObjects(transportData, "Carrier");
    const columns = [
        {
            name: "SenderName",
            header: "Sender Name",
            group: "personalInfo",
            defaultWidth: 200,
            filterEditor: StringFilter,
            headerAlign: "center",
            textAlign: "center",
        },
        {
            name: "SenderState",
            header: "Sender State",
            type: "string",
            defaultWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: SenderstateOptions,
            },
        },
        {
            name: "CustomerName",
            header: "Customer Name",
            group: "personalInfo",
            defaultWidth: 200,
            filterEditor: StringFilter,
            headerAlign: "center",
            textAlign: "center",
        },
        {
            name: "CustomerPO",
            header: "Customer PO",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "DeliveryNo",
            header: "Delivery #",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "RddDate",
            header: "Required Delivery Date",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minRDDDate,
                maxDate: maxRDDDate,
            },
            render: ({ value }) => {
                return extractFormattedDate(value);
            },
        },
        {
            name: "RddTime",
            header: "Required Delivery Time",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: RDDTimeFilter,
        },
        {
            name: "LTLFTL",
            header: "LTL/FTL",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: LTLFTLOptions,
            },
        },
        {
            name: "State",
            header: "State",
            type: "string",
            defaultWidth: 200,
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
            name: "PostalCode",
            header: "Postal Code",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "Carrier",
            header: "Carrier",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: carrierOptions,
            },
        },
        {
            name: "PickupDate",
            header: "Pickup Date",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
            },
            render: ({ value }) => {
                return extractUTCFormattedDate(value);
            },
        },
        {
            name: "PickupTime",
            header: "Pickup Time",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: PickTimeFilter,
        },
        {
            name: "Status",
            header: "Status",
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
            name: "ActualDeliveryDate",
            header: "Actual Delivery Date",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minArrivedDate,
                maxDate: maxArrivedDate,
            },
            render: ({ value }) => {
                return extractFormattedDate(value);
            },
        },
        {
            name: "ActualDeliveryTime",
            header: "Actual Delivery Time",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: DeliveryTimeFilter,
        },
        {
            name: "OnTime",
            header: "ONTIME(YES/NO)",
            type: "string",
            defaultWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: onTimeOptions,
            },
            render: ({ value }) => {
                return value == "YES" ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        YES
                    </span>
                ) : value == "NO" ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        NO
                    </span>
                ) : value == "PENDING" ? (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
                        PENDING
                    </span>
                ) : null;
            },
        },
        {
            name: "DelayReason",
            header: "Delay Reason",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: reasonsOptions,
            },
        },
        {
            name: "TransportComments",
            header: "Transport Comments",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
    ];

    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = transportData.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeToID); // Exclude specified ChargeToIDs

            return chargeToMatch;
        });

        return filtered;
    };

    useEffect(() => {
        setFilteredData(filterData());
    }, [accData]);

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth">
            <TableStructure
                id={"ConsignmentId"}
                handleDownloadExcel={handleDownloadExcel}
                title={"Transport Report"}
                setSelected={setSelected}
                gridRef={gridRef}
                selected={selected}
                tableDataElements={filteredData}
                settableDataElements={setFilteredData}
                filterValueElements={filterValue}
                setFilterValueElements={setFilterValue}
                columnsElements={columns}
            />
        </div>
    );
}

TransportRep.propTypes = {
    transportData: PropTypes.array,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    filterValue: PropTypes.array,
    setFilterValue: PropTypes.func,
    accData: PropTypes.array,
};

export default TransportRep;
