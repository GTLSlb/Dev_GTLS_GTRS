import "../../../../css/dashboard.css";
import Select from "react-select";
// import ReactGridLayout from 'react-grid-layout';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useState } from "react";
import notFound from "../../../assets/pictures/NotFound.png";
import { useEffect } from "react";
import {
    getLatestDespatchDate,
    getOldestDespatchDate,
} from "@/Components/utils/dateUtils";
import AnimatedLoading from "@/Components/AnimatedLoading";
import Charts from "./Charts";
import ChartsTable from "./ChartsTable";

const customStyles = {
    control: (provided) => ({
        ...provided,
        minHeight: "unset",
        height: "auto",
        // Add more styles here as needed
    }),
    option: (provided, state) => ({
        ...provided,
        color: "black",
        // Add more styles here as needed
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
        maxHeight: "37px", // Set the maximum height for the value container
        overflow: "auto", // Enable scrolling if the content exceeds the maximum height
        // fontSize: '10px',
    }),
    inputContainer: (provided) => ({
        ...provided,
        height: "100px",
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        whiteSpace: "nowrap", // Prevent text wrapping
        overflow: "hidden",
        textOverflow: "ellipsis", // Display ellipsis when text overflows
        fontSize: "10px",
        // Add more styles here as needed
    }),
    // Add more style functions here as needed
};

export default function MainCharts({
    accData,
    chartsData,
    sideBarToggle,
    showTable,
    setShowTable,
}) {
    const [SDate, setSDate] = useState(getOldestDespatchDate(chartsData));
    const [EDate, setEDate] = useState(getLatestDespatchDate(chartsData));
    const [filteredData, setFilteredData] = useState([chartsData]);
    const [selectedReceiver, setselectedReceiver] = useState([]);
    const [selectedStates, setSelectedStates] = useState([]);
    const [filteredReceivers, setFilteredReceivers] = useState([]);

    const [gridKey, setGridKey] = useState("sidebar-open");
    const [hasData, setHasData] = useState(true);

    useEffect(() => {
        setFilteredData(chartsData);
    }, []);
    const [layout, setLayout] = useState([
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
    ]);
    const ResetLayout = () => {
        // Filter the options based on the selected receivers
        setLayout([
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
        ]);
    };
    const handleStartDateChange = (event) => {
        const value = event.target.value;
        setSDate(value);
        filterData(value, EDate, selectedReceiver);
    };
    const handleEndDateChange = (event) => {
        const value = event.target.value;
        setEDate(value);
        filterData(SDate, value, selectedReceiver);
    };
    const uniqueStates = Array.from(
        new Set(chartsData.map((item) => item.ReceiverState))
    );
    const statesOptions = uniqueStates.map((name, index) => ({
        value: name,
        label: name,
    }));
    const handleReceiverStateChange = (selectedOptions) => {
        setselectedReceiver([]);
        setSelectedStates(selectedOptions);
    };
    const handleReceiverSelectChange = (selectedOptions) => {
        setselectedReceiver(selectedOptions);
    };

    const filterData = (startDate, endDate) => {
        const selectedReceiverNames = selectedReceiver.map((r) => r.value);
        const selectedReceiverStates = selectedStates.map((s) => s.value);

        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });

        // Convert date inputs into comparable Date objects
        const filterStartDate = new Date(startDate);
        const filterEndDate = new Date(endDate);
        filterStartDate.setHours(0, 0, 0, 0);
        filterEndDate.setHours(23, 59, 59, 999);

        // **Single pass through chartsData to filter both data and receivers**
        const filtered = [];
        const receiversSet = new Set();

        chartsData.forEach((item) => {
            const itemDate = new Date(item.DespatchDate);
            const isInState =
                selectedReceiverStates.length === 0 ||
                selectedReceiverStates.includes(item.ReceiverState);
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeToId);

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
                isInState
            ) {
                receiversSet.add(item.ReceiverName);
            }
        });

        setFilteredData(filtered);
        setHasData(filtered.length > 0);

        // Ensure the selected receivers are always included in the dropdown
        selectedReceiverNames.forEach((name) => receiversSet.add(name));

        // Convert Set to an array for dropdown options
        const updatedReceiverOptions = Array.from(receiversSet).map(
            (name, index) => ({
                value: name,
                label: name,
            })
        );

        setFilteredReceivers(updatedReceiverOptions);
    };

    useEffect(() => {
        filterData(SDate, EDate);
    }, [accData, selectedReceiver, selectedStates]);

    useEffect(() => {
        // Introduce a delay before changing the key
        const timeout = setTimeout(() => {
            setGridKey(sideBarToggle ? "sidebar-open" : "sidebar-closed");
        }, 300); // Delay in milliseconds (e.g., 300ms)

        // Cleanup timeout on unmount or when sideBarToggle changes
        return () => clearTimeout(timeout);
    }, [sideBarToggle]);

    const [chartFilter, setChartFilter] = useState({
        consStatus: "",
        ReceiverState: "",
        dateStart: "",
        dateEnd: "",
        MatchDel: "",
        PODValue: [],
    });

    if (chartsData.length > 0) {
        return (
            <div className=" px-4 sm:px-6 pb-4 bg-smooth">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto md:mt-6">
                        <h1 className="text-2xl py-2 px-2 font-extrabold text-gray-600">
                            Dashboard
                        </h1>
                    </div>
                </div>
                <div className="mt-3 w-full">
                    <div className="w-full relative px-2">
                        <div className=" sm:border-gray-200 text-gray-400 gap-y-4 gap-x-2 w-full">
                            <div className="lg:flex items-center">
                                <label
                                    htmlFor="last-name"
                                    className="inline-block text-sm font-medium leading-6 flex-item items-center"
                                >
                                    Date From
                                </label>
                                <div className="sm:mt-0 md:px-4">
                                    <input
                                        onKeyDown={(e) => e.preventDefault()}
                                        type="date"
                                        name="from-date"
                                        value={SDate}
                                        min={getOldestDespatchDate(chartsData)}
                                        max={EDate}
                                        onChange={handleStartDateChange}
                                        id="from-date"
                                        className="flex-item block w-full h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 lg:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>

                                <label
                                    htmlFor="last-name"
                                    className="inline-block text-sm font-medium leading-6 flex-item"
                                >
                                    To
                                </label>

                                <div className="mt-2 flex-item  sm:mt-0 md:px-4">
                                    <input
                                        onKeyDown={(e) => e.preventDefault()}
                                        type="date"
                                        name="to-date"
                                        min={SDate}
                                        max={getLatestDespatchDate(chartsData)}
                                        value={EDate}
                                        onChange={handleEndDateChange}
                                        id="to-date"
                                        className="block w-full h-[36px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 lg:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="lg:flex items-center gap-5 mt-2">
                                <div className="lg:flex lg:w-full items-center">
                                    <label
                                        htmlFor="last-name"
                                        className=" text-sm font-medium leading-6 text-gray-400 sm:pt-1.5 2xl:mr-5"
                                    >
                                        State
                                    </label>

                                    <div className="w-full">
                                        <div className=" flex items-center">
                                            <div className="mt-2 w-full sm:mt-0 ">
                                                <Select
                                                    styles={customStyles}
                                                    isMulti
                                                    name="colors"
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
                                </div>
                                <div className="lg:flex lg:w-full items-center">
                                    <label
                                        htmlFor="last-name"
                                        className=" text-sm font-medium leading-6 text-gray-400 sm:pt-1.5 2xl:mr-5"
                                    >
                                        Receiver
                                    </label>

                                    <div className="w-full">
                                        <div className=" flex items-center">
                                            <div className="mt-2 w-full sm:mt-0 ">
                                                <Select
                                                    styles={customStyles}
                                                    isMulti
                                                    name="colors"
                                                    value={selectedReceiver}
                                                    options={filteredReceivers}
                                                    onChange={
                                                        handleReceiverSelectChange
                                                    }
                                                    className="basic-multi-select w-full"
                                                    classNamePrefix="select"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="xl:ml-auto w-1/4 flex justify-end">
                                    <button
                                        className={`items-center w-auto h-[36px] rounded-md border bg-gray-800 px-4 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                        onClick={ResetLayout}
                                    >
                                        Reset layout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {hasData ? (
                    showTable ? (
                        <div>
                            <ChartsTable
                                chartsData={chartsData}
                                setShowTable={setShowTable}
                                chartFilter={chartFilter}
                                setChartFilter={setChartFilter}
                            />
                        </div>
                    ) : (
                        <div className="layout-container">
                            <Charts
                                layout={layout}
                                filteredData={filteredData}
                                gridKey={gridKey}
                                setLayout={setLayout}
                                setShowTable={setShowTable}
                                setChartFilter={setChartFilter}
                            />
                        </div>
                    )
                ) : (
                    <div className=" h-72 flex items-center justify-center mt-5">
                        <div className="text-center flex justify-center flex-col">
                            <img
                                src={notFound}
                                alt=""
                                className="w-52 h-auto "
                            />
                            <h1 className="text-3xl font-bold text-gray-900">
                                No Data Found
                            </h1>
                        </div>
                    </div>
                )}
            </div>
        );
    } else if (chartsData.length === 0) {
        return (
            <div className=" min-h-screen flex items-center justify-center h-full">
                <p>No Data Found</p>
            </div>
        );
    } else {
        return <AnimatedLoading />;
    }
}
