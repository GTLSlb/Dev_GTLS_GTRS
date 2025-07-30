import "../../../../css/dashboard.css";
import Select from "react-select";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useState, useCallback, useMemo, useRef } from "react";
import notFound from "../../../assets/pictures/NotFound.png";
import { useEffect } from "react";
import {
    getLatestDespatchDate,
    getOldestDespatchDate,
} from "@/Components/utils/dateUtils";
import Charts from "./Charts";
import ChartsTable from "./ChartsTable";
import AnimatedLoading from "@/Components/AnimatedLoading";

const customStyles = {
    control: (provided) => ({
        ...provided,
        minHeight: "unset",
        height: "auto",
    }),
    option: (provided, state) => ({
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
    inputContainer: (provided) => ({
        ...provided,
        height: "100px",
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "10px",
    }),
};

// Move layout outside component to prevent recreation
const STATIC_LAYOUT = [
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

export default function MainCharts({
    accData,
    chartsData,
    chartName,
    setChartName,
    userPermission,
    setActiveIndexGTRS,
    setactiveCon,
    setLastIndex,
}) {
    // Memoize initial dates to prevent recalculation
    const initialSDate = useMemo(() => getOldestDespatchDate(chartsData), [chartsData]);
    const initialEDate = useMemo(() => getLatestDespatchDate(chartsData), [chartsData]);
    
    const [SDate, setSDate] = useState(initialSDate);
    const [EDate, setEDate] = useState(initialEDate);
    const [filteredData, setFilteredData] = useState(chartsData);
    const [selectedReceiver, setselectedReceiver] = useState([]);
    const [selectedStates, setSelectedStates] = useState([]);
    const [filteredReceivers, setFilteredReceivers] = useState([]);
    const [hasData, setHasData] = useState(true);
    const [showTable, setShowTable] = useState(false);

    // Use refs to track previous values and prevent unnecessary re-renders
    const prevAccDataRef = useRef();
    const prevChartsDataRef = useRef();

    // Memoize accData conversion to prevent recreation on every render
    const intArray = useMemo(() => {
        if (!accData) return [];
        return accData.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
    }, [accData]);

    // Memoize unique states to prevent recalculation
    const statesOptions = useMemo(() => {
        if (!chartsData?.length) return [];
        const uniqueStates = Array.from(
            new Set(chartsData.map((item) => item.ReceiverState).filter(Boolean))
        );
        return uniqueStates.map((name) => ({
            value: name,
            label: name,
        }));
    }, [chartsData]);

    // Stable filter function that doesn't change unless dependencies actually change
    const filterData = useCallback(() => {
        if (!chartsData?.length || !SDate || !EDate) {
            setFilteredData([]);
            setFilteredReceivers([]);
            setHasData(false);
            return;
        }

        const selectedReceiverNames = selectedReceiver.map((r) => r.value);
        const selectedReceiverStates = selectedStates.map((s) => s.value);

        // Convert date inputs into comparable Date objects
        const filterStartDate = new Date(SDate);
        const filterEndDate = new Date(EDate);
        filterStartDate.setHours(0, 0, 0, 0);
        filterEndDate.setHours(23, 59, 59, 999);

        // Single pass through chartsData to filter both data and receivers
        const filtered = [];
        const receiversSet = new Set();

        chartsData.forEach((item) => {
            if (!item.DespatchDate) return;
            
            const itemDate = new Date(item.DespatchDate);
            const isInState =
                selectedReceiverStates.length === 0 ||
                selectedReceiverStates.includes(item.ReceiverState);
            const chargeToMatch =
                intArray.length === 0 || intArray.includes(item.ChargeToId);

            // Apply filters for main dataset
            if (
                itemDate >= filterStartDate &&
                itemDate <= filterEndDate &&
                chargeToMatch &&
                isInState &&
                (selectedReceiverNames.length === 0 ||
                    selectedReceiverNames.includes(item.ReceiverName))
            ) {
                filtered.push(item);
            }

            // Collect possible receivers for the dropdown (ignore receiver filter here)
            if (
                itemDate >= filterStartDate &&
                itemDate <= filterEndDate &&
                chargeToMatch &&
                isInState &&
                item.ReceiverName
            ) {
                receiversSet.add(item.ReceiverName);
            }
        });

        // Ensure the selected receivers are always included in the dropdown
        selectedReceiverNames.forEach((name) => {
            if (name) receiversSet.add(name);
        });

        // Convert Set to an array for dropdown options
        const updatedReceiverOptions = Array.from(receiversSet).map(
            (name) => ({
                value: name,
                label: name,
            })
        );

        setFilteredData(filtered);
        setHasData(filtered.length > 0);
        setFilteredReceivers(updatedReceiverOptions);
    }, [chartsData, SDate, EDate, intArray, selectedReceiver, selectedStates]);

    // Stable event handlers
    const handleStartDateChange = useCallback((event) => {
        const value = event.target.value;
        setSDate(value);
    }, []);

    const handleEndDateChange = useCallback((event) => {
        const value = event.target.value;
        setEDate(value);
    }, []);

    const handleReceiverStateChange = useCallback((selectedOptions) => {
        setselectedReceiver([]);
        setSelectedStates(selectedOptions || []);
    }, []);

    const handleReceiverSelectChange = useCallback((selectedOptions) => {
        setselectedReceiver(selectedOptions || []);
    }, []);

    // Update dates when chartsData changes (only once)
    useEffect(() => {
        if (chartsData !== prevChartsDataRef.current && chartsData?.length > 0) {
            const newSDate = getOldestDespatchDate(chartsData);
            const newEDate = getLatestDespatchDate(chartsData);
            setSDate(newSDate);
            setEDate(newEDate);
            prevChartsDataRef.current = chartsData;
        }
    }, [chartsData]);

    // Filter data when dependencies change
    useEffect(() => {
        filterData();
    }, [filterData]);

    const [chartFilter, setChartFilter] = useState({
        consStatus: "",
        ReceiverState: "",
        dateStart: "",
        dateEnd: "",
        MatchDel: "",
        PODValue: [],
    });

    // Memoize the reset layout function
    const ResetLayout = useCallback(() => {
        console.log("Reset layout called");
    }, []);

    // Early returns to prevent unnecessary renders
    if (!chartsData) {
        return <AnimatedLoading />;
    }

    if (chartsData.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center h-full">
                <p>No Data Found</p>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 pb-4 bg-smooth">
            {hasData ? (
                showTable ? (
                    <div>
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
                    </div>
                ) : (
                    <>
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto md:mt-6">
                                <h1 className="text-2xl py-2 px-2 font-extrabold text-gray-600">
                                    Dashboard
                                </h1>
                            </div>
                        </div>
                        <div className="mt-3 w-full">
                            <div className="w-full relative px-2">
                                <div className="sm:border-gray-200 text-gray-400 gap-y-4 gap-x-2 w-full">
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
                                                value={SDate || ''}
                                                min={initialSDate}
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
                                                max={initialEDate}
                                                value={EDate || ''}
                                                onChange={handleEndDateChange}
                                                id="to-date"
                                                className="block w-full h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 lg:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="lg:flex items-center gap-5 mt-2">
                                        <div className="lg:flex lg:w-full items-center">
                                            <label
                                                htmlFor="state-select"
                                                className="text-sm font-medium leading-6 text-gray-400 sm:pt-1.5 2xl:mr-5"
                                            >
                                                State
                                            </label>

                                            <div className="w-full">
                                                <div className="flex items-center">
                                                    <div className="mt-2 w-full sm:mt-0">
                                                        <Select
                                                            styles={customStyles}
                                                            isMulti
                                                            name="states"
                                                            value={selectedStates}
                                                            options={statesOptions}
                                                            onChange={handleReceiverStateChange}
                                                            className="basic-multi-select w-full"
                                                            classNamePrefix="select"
                                                            placeholder="Select states..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lg:flex lg:w-full items-center">
                                            <label
                                                htmlFor="receiver-select"
                                                className="text-sm font-medium leading-6 text-gray-400 sm:pt-1.5 2xl:mr-5"
                                            >
                                                Receiver
                                            </label>

                                            <div className="w-full">
                                                <div className="flex items-center">
                                                    <div className="mt-2 w-full sm:mt-0">
                                                        <Select
                                                            styles={customStyles}
                                                            isMulti
                                                            name="receivers"
                                                            value={selectedReceiver}
                                                            options={filteredReceivers}
                                                            onChange={handleReceiverSelectChange}
                                                            className="basic-multi-select w-full"
                                                            classNamePrefix="select"
                                                            placeholder="Select receivers..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                        <div className="layout-container">
                            <Charts
                                layout={STATIC_LAYOUT}
                                filteredData={filteredData}
                                setShowTable={setShowTable}
                                setChartFilter={setChartFilter}
                                setChartName={setChartName}
                            />
                        </div>
                    </>
                )
            ) : (
                <div className="h-72 flex items-center justify-center mt-5">
                    <div className="text-center flex justify-center flex-col">
                        <img
                            src={notFound}
                            alt="No data found"
                            className="w-52 h-auto"
                        />
                        <h1 className="text-3xl font-bold text-gray-900">
                            No Data Found
                        </h1>
                    </div>
                </div>
            )}
        </div>
    );
}