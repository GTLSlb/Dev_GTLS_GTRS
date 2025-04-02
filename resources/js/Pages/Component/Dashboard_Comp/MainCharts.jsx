import "../../../../css/dashboard.css";
import Select from "react-select";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React, { useState, useMemo, useCallback } from "react";
import notFound from "../../../assets/pictures/NotFound.png";
import Charts from "./Charts";
import ChartsTable from "./ChartsTable";
import AnimatedLoading from "@/Components/AnimatedLoading";
import {
    getLatestDespatchDate,
    getOldestDespatchDate,
} from "@/Components/utils/dateUtils";

// Styles for react-select
const customStyles = {
    control: (provided) => ({
        ...provided,
        minHeight: "unset",
        height: "auto",
    }),
    option: (provided) => ({
        ...provided,
        color: "black",
    }),
    multiValue: (provided) => ({
        ...provided,
        width: "30%",
        overflow: "hidden",
        height: "20px",
        justifyContent: "space-between",
    }),
    valueContainer: (provided) => ({
        ...provided,
        width: "400px",
        maxHeight: "37px",
        overflow: "auto",
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "10px",
    }),
};

const DEFAULT_LAYOUT = [
    { i: "card01", x: 0, y: 0, w: 1, h: 4.2 },
    { i: "card02", x: 2, y: 0, w: 1, h: 4.2 },
    { i: "card03", x: 0, y: 2, w: 1, h: 3 },
    { i: "card04", x: 0, y: 2, w: 1, h: 3 },
    { i: "card05", x: 2, y: 0, w: 1, h: 3 },
    { i: "card06", x: 0, y: 2, w: 1, h: 3 },
    { i: "card07", x: 2, y: 2, w: 1, h: 3 },
    { i: "card08", x: 0, y: 4, w: 1, h: 3 },
    { i: "card09", x: 2, y: 4, w: 1, h: 3 },
    { i: "card10", x: 2, y: 4, w: 1, h: 3 },
];
function MainCharts({
    accData,
    chartsData,
    chartName,
    setChartName,
    userPermission,
    setActiveIndexGTRS,
    setactiveCon,
    setLastIndex,
}) {
    // ---------------------------
    // Basic States
    // ---------------------------
    const [SDate, setSDate] = useState(getOldestDespatchDate(chartsData));
    const [EDate, setEDate] = useState(getLatestDespatchDate(chartsData));

    // The user’s chosen states and receivers:
    const [selectedStates, setSelectedStates] = useState([]);
    const [selectedReceivers, setSelectedReceivers] = useState([]);

    // Layout for the charts
    const [layout, setLayout] = useState(DEFAULT_LAYOUT);

    // Whether to show table or charts
    const [showTable, setShowTable] = useState(false);

    // We keep a small state for chartFilter if needed
    const [chartFilter, setChartFilter] = useState({
        consStatus: "",
        ReceiverState: "",
        dateStart: "",
        dateEnd: "",
        MatchDel: "",
        PODValue: [],
    });

    // ---------------------------
    // Memo: unique states + state options
    // ---------------------------
    const uniqueStates = useMemo(
        () => Array.from(new Set(chartsData.map((item) => item.ReceiverState))),
        [chartsData]
    );

    const statesOptions = useMemo(
        () =>
            uniqueStates.map((name) => ({
                value: name,
                label: name,
            })),
        [uniqueStates]
    );

    // ---------------------------
    // Filter Logic in a Memo
    // ---------------------------
    const { filteredData, filteredReceivers } = useMemo(() => {
        // 1) Convert user’s accData into an array of integers for ChargeToId filtering
        const intArray = accData?.map((str) => {
            const val = parseInt(str, 10);
            return isNaN(val) ? 0 : val;
        });

        // 2) Convert SDate, EDate to date objects
        const filterStartDate = new Date(SDate);
        const filterEndDate = new Date(EDate);
        filterStartDate.setHours(0, 0, 0, 0);
        filterEndDate.setHours(23, 59, 59, 999);

        // 3) Prepare sets
        const filtered = [];
        const receiversSet = new Set();

        // 4) Convert selected states/receivers into arrays of string
        const selectedReceiverNames = selectedReceivers.map((r) => r.value);
        const selectedReceiverStates = selectedStates.map((s) => s.value);

        chartsData.forEach((item) => {
            const itemDate = new Date(item.DespatchDate);
            const inDateRange =
                itemDate >= filterStartDate && itemDate <= filterEndDate;
            const inChargeTo =
                !intArray?.length || intArray.includes(item.ChargeToId);
            const inState =
                !selectedReceiverStates.length ||
                selectedReceiverStates.includes(item.ReceiverState);
            const inReceiver =
                !selectedReceiverNames.length ||
                selectedReceiverNames.includes(item.ReceiverName);

            // If item passes all filters, push to filtered array
            if (inDateRange && inChargeTo && inState && inReceiver) {
                filtered.push(item);
            }

            // For building the "Receiver" dropdown, we ignore the "selectedReceiver" filter
            // but respect the date range, chargeTo, and state
            if (inDateRange && inChargeTo && inState) {
                receiversSet.add(item.ReceiverName);
            }
        });

        // Ensure the currently selected receivers remain in the dropdown
        selectedReceiverNames.forEach((name) => receiversSet.add(name));

        // Convert set to array for the Select
        const updatedReceiverOptions = Array.from(receiversSet).map((name) => ({
            value: name,
            label: name,
        }));

        return {
            filteredData: filtered,
            filteredReceivers: updatedReceiverOptions,
        };
    }, [SDate, EDate, selectedStates, selectedReceivers, accData, chartsData]);

    // Derived boolean
    const hasData = filteredData.length > 0;

    // ---------------------------
    // Event Handlers (useCallback)
    // ---------------------------
    const handleStartDateChange = useCallback((e) => {
        setSDate(e.target.value);
    }, []);

    const handleEndDateChange = useCallback((e) => {
        setEDate(e.target.value);
    }, []);

    const handleReceiverStateChange = useCallback((selectedOptions) => {
        // If user changes the state, reset the receivers so we don’t keep old invalid ones
        setSelectedReceivers([]);
        setSelectedStates(selectedOptions);
    }, []);

    const handleReceiverSelectChange = useCallback((selectedOptions) => {
        setSelectedReceivers(selectedOptions);
    }, []);

    const ResetLayout = useCallback(() => {
        setLayout(DEFAULT_LAYOUT);
    }, []);

    // ---------------------------
    // Render Logic
    // ---------------------------
    // 1) If still loading or no chartsData
    if (!chartsData) {
        return <AnimatedLoading />;
    }

    // 2) If chartsData is empty
    if (chartsData.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>No Data Found</p>
            </div>
        );
    }

    // 3) If we have data
    return (
        <div className="px-4 sm:px-6 pb-4 bg-smooth">
            {hasData ? (
                showTable ? (
                    <ChartsTable
                        chartsData={filteredData}
                        setShowTable={setShowTable}
                        chartFilter={chartFilter}
                        setChartFilter={setChartFilter}
                        chartName={chartName}
                        setChartName={setChartName}
                        userPermission={userPermission}
                        setActiveIndexGTRS={setActiveIndexGTRS}
                        setactiveCon={setactiveCon}
                        setLastIndex={setLastIndex}
                    />
                ) : (
                    <>
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto md:mt-6">
                                <h1 className="text-2xl py-2 px-2 font-extrabold text-gray-600">
                                    Dashboard
                                </h1>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="mt-3 w-full">
                            <div className="w-full relative px-2">
                                <div className="sm:border-gray-200 text-gray-400 gap-y-4 gap-x-2 w-full">
                                    {/* Date Range */}
                                    <div className="lg:flex items-center">
                                        <label
                                            htmlFor="from-date"
                                            className="inline-block text-sm font-medium leading-6 flex-item items-center"
                                        >
                                            Date From
                                        </label>
                                        <div className="sm:mt-0 md:px-4">
                                            <input
                                                onKeyDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                type="date"
                                                name="from-date"
                                                value={SDate}
                                                min={getOldestDespatchDate(
                                                    chartsData
                                                )}
                                                max={EDate}
                                                onChange={handleStartDateChange}
                                                id="from-date"
                                                className="flex-item block w-full h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 lg:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>

                                        <label
                                            htmlFor="to-date"
                                            className="inline-block text-sm font-medium leading-6 flex-item"
                                        >
                                            To
                                        </label>

                                        <div className="mt-2 flex-item sm:mt-0 md:px-4">
                                            <input
                                                onKeyDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                type="date"
                                                name="to-date"
                                                min={SDate}
                                                max={getLatestDespatchDate(
                                                    chartsData
                                                )}
                                                value={EDate}
                                                onChange={handleEndDateChange}
                                                id="to-date"
                                                className="block w-full h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 lg:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* State & Receiver */}
                                    <div className="lg:flex items-center gap-5 mt-2">
                                        {/* State */}
                                        <div className="lg:flex lg:w-full items-center">
                                            <label
                                                htmlFor="last-name"
                                                className="text-sm font-medium leading-6 text-gray-400 sm:pt-1.5 2xl:mr-5"
                                            >
                                                State
                                            </label>
                                            <div className="w-full">
                                                <div className="mt-2 w-full sm:mt-0">
                                                    <Select
                                                        styles={customStyles}
                                                        isMulti
                                                        name="receiverState"
                                                        value={selectedStates}
                                                        options={statesOptions}
                                                        onChange={
                                                            handleReceiverStateChange
                                                        }
                                                        className="basic-multi-select w-full"
                                                        classNamePrefix="select"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Receiver */}
                                        <div className="lg:flex lg:w-full items-center">
                                            <label
                                                htmlFor="last-name"
                                                className="text-sm font-medium leading-6 text-gray-400 sm:pt-1.5 2xl:mr-5"
                                            >
                                                Receiver
                                            </label>
                                            <div className="w-full">
                                                <div className="mt-2 w-full sm:mt-0">
                                                    <Select
                                                        styles={customStyles}
                                                        isMulti
                                                        name="receivers"
                                                        value={
                                                            selectedReceivers
                                                        }
                                                        options={
                                                            filteredReceivers
                                                        }
                                                        onChange={
                                                            handleReceiverSelectChange
                                                        }
                                                        className="basic-multi-select w-full"
                                                        classNamePrefix="select"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reset Layout Button */}
                                        <div className="xl:ml-auto w-1/4 flex justify-end">
                                            <button
                                                className="hidden items-center w-auto h-[36px] rounded-md border bg-gray-800 px-4 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={ResetLayout}
                                            >
                                                Reset layout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="layout-container">
                            <Charts
                                layout={layout}
                                filteredData={filteredData}
                                setLayout={setLayout}
                                setShowTable={setShowTable}
                                setChartFilter={setChartFilter}
                                setChartName={setChartName}
                            />
                        </div>
                    </>
                )
            ) : (
                // If we have no filtered data
                <div className="h-72 flex items-center justify-center mt-5">
                    <div className="text-center flex justify-center flex-col">
                        <img src={notFound} alt="" className="w-52 h-auto" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            No Data Found
                        </h1>
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(MainCharts);
