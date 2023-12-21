import DashboardCard07 from "@/Components/dashboard/DashboardCard07";
import BasicPieCharts from "@/Components/dashboard/DashboardCard13";
import "../../../../css/dashboard.css";
import { Fragment } from "react";
import BasicColumnCharts from "./Dashboard_Charts/BasicColumnChart";
import {
    ChevronDownIcon,
    ArrowsPointingOutIcon,
} from "@heroicons/react/20/solid";
import { Popover, Transition } from "@headlessui/react";
import Select from "react-select";
// import ReactGridLayout from 'react-grid-layout';
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
const ReactGridLayout = WidthProvider(RGL);
import "react-resizable/css/styles.css";
import { useState } from "react";
import notFound from "../../../assets/pictures/NotFound.png";
import { useEffect } from "react";
import MultiChartLine from "./Dashboard_Charts/MultiLineChart";
import DoubleBarChart from "./Dashboard_Charts/DoublBarChart";
export default function MainCharts({ accData, safetyData, chartsData }) {

    const [SDate, setSDate] = useState(getOldestDespatchDate(chartsData));
    const [EDate, setEDate] = useState(getLatestDespatchDate(chartsData));
    function getOldestDespatchDate(data) {
        // Filter out elements with invalid 'CreatedDate' values
        const validData = data?.filter((item) => isValidDate(item?.DespatchDate));
        // Sort the validData array based on the 'CreatedDate' property
        const sortedData = validData.sort(
            (a, b) => new Date(a.DespatchDate) - new Date(b.DespatchDate)
        );
        // Check if the sortedData array is empty
        if (sortedData.length === 0) {
            return null; // No valid dates found
        }
        // Extract only the date part from the 'CreatedDate' of the first element (oldest date)
        const oldestDate = new Date(
            sortedData[0]?.DespatchDate
        ).toLocaleDateString("en-CA");
        // Return the oldest date in the 'YYYY-MM-DD' format
        return oldestDate;
    }
    function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date);
    }
    function getLatestDespatchDate(data) {
        const validData = data.filter((item) => isValidDate(item.DespatchDate));

        // Sort the data array based on the 'DespatchDate' property in descending order
        const sortedData = validData.sort(
            (a, b) => new Date(b.DespatchDate) - new Date(a.DespatchDate)
        );
        if (sortedData.length === 0) {
            return null; // No valid dates found
        }
        const latestDate = new Date(
            sortedData[0]?.DespatchDate
        ).toLocaleDateString("en-CA");

        // Return the 'DespatchDate' of the first element (latest date)
        return latestDate;
    }
    const [filteredData, setFilteredData] = useState([chartsData]);
    useEffect(() => {
        setFilteredData(chartsData);
    }, []);
    const [layout, setLayout] = useState([
        { i: "card02", x: 0, y: 0, w: 1, h: 4.5 }, //Information
        { i: "card06", x: 2, y: 0, w: 1, h: 4.5 }, // Spend By month
        { i: "card04", x: 0, y: 2, w: 1, h: 3 }, //Consignment Status
        { i: "card12", x: 2, y: 0, w: 1, h: 3 }, // Consignment By Month
        { i: "card08", x: 0, y: 2, w: 1, h: 3 }, // Pod True Vs False
        { i: "card03", x: 2, y: 2, w: 1, h: 3 }, // Pod Status
        { i: "card03_2", x: 0, y: 4, w: 1, h: 3 },
        { i: "card13", x: 2, y: 4, w: 1, h: 3 },
        { i: "card14", x: 0, y: 4, w: 1, h: 3 },
    ]);
    const [cols, setCols] = useState(2);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCols(1);
            } else if (window.innerWidth < 1200) {
                setCols(2);
            } else {
                setCols(2);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const [selectedReceiver, setselectedReceiver] = useState([]);
    const calculateStatistics = (data) => {
        let safetyCounter = 0;
        const uniqueReceivers = new Set();
        let totalWeight = 0;
        let totalPalletSpace = 0;
        let totalLoscam = 0;
        let totalCustomerOwn = 0;
        let totalCost = 0;
        let totalNoConsPassed = 0;
        let totalConsFailed = 0;
        let totalConsPending = 0;
        let podCounter = 0;
        let totalChep = 0;
        if (safetyData) {
            safetyCounter = Object.keys(safetyData).length;
        } else {
            safetyCounter = 0;
        }
        for (const {
            ReceiverName,
            TottalWeight,
            TotalPalletSpace,
            TotalLoscam,
            TotalCustomerOwn,
            TotalChep,
            NetAmount,
            ConsStatus,
            POD,
        } of data) {
            uniqueReceivers.add(ReceiverName);
            totalWeight += TottalWeight;
            totalPalletSpace += TotalPalletSpace;
            totalLoscam += TotalLoscam;
            totalCustomerOwn += TotalCustomerOwn;
            totalChep += TotalChep;
            totalCost += NetAmount;

            // Calculate other statistics
            if (ConsStatus === "PASS") {
                totalNoConsPassed++;
            } else if (ConsStatus === "FAIL") {
                totalConsFailed++;
            } else if (ConsStatus === "PENDING") {
                totalConsPending++;
            }
            if (POD) {
                podCounter++;
            }
        }

        const totalNoConsShipped =
            totalConsPending + totalConsFailed + totalNoConsPassed;
        const numUniqueReceivers = uniqueReceivers.size;
        const podPercentage = (podCounter / data.length) * 100;

        return {
            numUniqueReceivers,
            totalWeight,
            totalPalletSpace,
            totalLoscam,
            totalCustomerOwn,
            totalCost,
            totalNoConsShipped,
            totalNoConsPassed,
            totalConsFailed,
            podCounter,
            podPercentage,
            totalChep,
            safetyCounter,
        };
    };
    const getConsStatusCounter = (data) => {
        const counter = [];

        for (const item of data) {
            const consStatus = item.ConsStatus;

            const existingStatus = counter.find(
                (obj) => obj.label === consStatus
            );

            if (existingStatus) {
                existingStatus.value++;
            } else {
                counter.push({ label: consStatus, value: 1 });
            }
        }

        return counter;
    };
    const getKPIStatusCounter = (data) => {
        const counter = [];
    
        for (const item of data) {
            // Convert the boolean KPIStatus to 'pass' or 'fail'
            const KPIStatus = item.KPI ? 'Pass' : 'Fail';
    
            const existingStatus = counter.find(
                (obj) => obj.label === KPIStatus
            );
    
            if (existingStatus) {
                existingStatus.value++;
            } else {
                counter.push({ label: KPIStatus, value: 1 });
            }
        }
    
        return counter;
    };
    // Information for the first charts
    const getStateRecordCounts = (data) => {
        const stateCounts = {};

        for (const item of data) {
            const state = item.ReceiverState;
            if (!stateCounts[state]) {
                stateCounts[state] = 0;
            }

            stateCounts[state]++;
        }
        const stateRecordCounts = Object.entries(stateCounts).map(
            ([state, value]) => ({
                data: state,
                value,
            })
        );

        return stateRecordCounts;
    };
    const getStateTotalWeights = (data) => {
        const stateWeights = {};

        for (const item of data) {
            const state = item.ReceiverState;
            const weight = item.TottalWeight;

            if (!stateWeights[state]) {
                stateWeights[state] = 0;
            }

            stateWeights[state] += weight;
        }

        const stateTotalWeights = Object.entries(stateWeights).map(
            ([state, value]) => ({
                data: state,
                value: parseFloat(value.toFixed(2)),
            })
        );

        return stateTotalWeights;
    };
    const getMonthlyData = (data) => {
        const firstDayData = {};

        for (const item of data) {
            const state = item.ReceiverState;
            const amount = Math.round(Number(item.NetAmount) * 100);
            const despatchDate = new Date(item.DespatchDate);
            const year = despatchDate.getFullYear();
            const day = despatchDate.getDate();
            const month = (despatchDate.getMonth() + 1)
                .toString()
                .padStart(2, "0");
            const formattedDate = `${year}-${month}`;
            const key = `${formattedDate}-${state}`;

            if (firstDayData.hasOwnProperty(key)) {
                firstDayData[key].amount += amount;
            } else {
                firstDayData[key] = {
                    month: formattedDate,
                    amount,
                    state,
                };
            }
        }

        const sortedData = Object.values(firstDayData).sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA - dateB;
        });
        return sortedData;
    };
    const getMonthlyRecordCounts = (data) => {
        const monthlyCounts = {};

        for (const item of data) {
            const despatchDate = new Date(item.DespatchDate);
            const month = despatchDate.getMonth() + 1;
            const year = despatchDate.getFullYear();
            const monthYear = `${year}-${month.toString().padStart(2, "0")}`;

            if (monthlyCounts.hasOwnProperty(monthYear)) {
                monthlyCounts[monthYear]++;
            } else {
                monthlyCounts[monthYear] = 1;
            }
        }

        const sortedCounts = Object.entries(monthlyCounts).sort(([a], [b]) => {
            const [monthA, yearA] = a.split("-");
            const [monthB, yearB] = b.split("-");
            return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
        });

        const monthlyRecordCounts = sortedCounts.map(([monthYear, value]) => ({
            data: monthYear,
            value,
        }));

        return monthlyRecordCounts;
    };
    const getPODCounts = (data) => {
        const podCounts = {};
        const today = new Date(); // Get today's date

        for (const item of data) {
            const despatchDate = new Date(item.DespatchDate);
            if (despatchDate > today) {
                continue; // Skip data with a future despatch date
            }

            const month = despatchDate.getMonth() + 1;
            const year = despatchDate.getFullYear();
            const monthYear = `${year}-${month.toString().padStart(2, "0")}`;
            const pod = item.POD;

            if (podCounts.hasOwnProperty(monthYear)) {
                if (pod) {
                    podCounts[monthYear].true++;
                } else {
                    podCounts[monthYear].false++;
                }
            } else {
                podCounts[monthYear] = {
                    monthYear,
                    true: pod ? 1 : 0,
                    false: pod ? 0 : 1,
                };
            }
        }

        const formattedCounts = Object.entries(podCounts).flatMap(
            ([monthYear, counts]) => [
                { pod: "true", monthYear, value: counts.true },
                { pod: "false", monthYear, value: counts.false },
            ]
        );

        formattedCounts.sort((a, b) => {
            const [monthA, yearA] = a.monthYear.split("-");
            const [monthB, yearB] = b.monthYear.split("-");
            return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
        });

        return formattedCounts;
    };
    function getPODCountsByState(data) {
        const podCountsByState = [];

        data.forEach((item) => {
            const state = item.ReceiverState;
            const pod = item.POD;

            const existingState = podCountsByState.find(
                (obj) => obj.label === state
            );

            if (existingState) {
                existingState.value += pod ? 1 : 0;
            } else {
                podCountsByState.push({ label: state, value: pod ? 1 : 0 });
            }
        });

        return podCountsByState;
    }
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
    const [hasData, setHasData] = useState(true);
    const uniqueReceiverNames = Array.from(
        new Set(chartsData.map((item) => item.ReceiverName))
    );
    const handleReceiverSelectChange = (selectedOptions) => {
        setselectedReceiver(selectedOptions);
        // filterData(SDate, EDate, selectedReceiver);
    };
    const receiverOptions = uniqueReceiverNames.map((name) => ({
        value: name,
        label: name,
    }));
    const getFilteredOptions = () => {
        // Filter the options based on the selected receivers
        return receiverOptions.filter(
            (option) =>
                !selectedReceiver.find(
                    (receiver) => receiver.value === option.value
                )
        );
    };
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
    const filterData = (startDate, endDate) => {
        const selectedReceiverNames = selectedReceiver.map(
            (receiver) => receiver.value
        );
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = chartsData.filter((item) => {
            const isIncluded =
                selectedReceiverNames.length === 0 ||
                selectedReceiverNames?.includes(item.ReceiverName);

            const itemDate = new Date(item.DespatchDate);
            const filterStartDate = new Date(startDate);
            const filterEndDate = new Date(endDate);
            filterStartDate.setHours(0);
            filterEndDate.setSeconds(59);
            filterEndDate.setMinutes(59);
            filterEndDate.setHours(23);

            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeToId);

            return (
                itemDate >= filterStartDate &&
                itemDate <= filterEndDate &&
                isIncluded &&
                chargeToMatch
            );
        });
        const hasData = filtered?.length > 0;
        setFilteredData(filtered);
        setHasData(hasData);
    }; 
    useEffect(() => {
        filterData(SDate, EDate);
    }, [accData, selectedReceiver]);
    // const isMobile = useMediaQuery({ query: "(max-width: 1080px)" });
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const ResetLayout = () => {
        // Filter the options based on the selected receivers
        setLayout([
            { i: "card02", x: 0, y: 0, w: 1, h: 4.5 }, //Information
            { i: "card06", x: 2, y: 0, w: 1, h: 4.5 }, // Spend By month
            { i: "card04", x: 0, y: 2, w: 1, h: 3 }, //Consignment Status
            { i: "card12", x: 2, y: 0, w: 1, h: 3 }, // Consignment By Month
            { i: "card08", x: 0, y: 2, w: 1, h: 3 }, // Pod True Vs False
            { i: "card03", x: 2, y: 2, w: 1, h: 3 }, // Pod Status
            { i: "card03_2", x: 0, y: 4, w: 1, h: 3 },
            { i: "card13", x: 2, y: 4, w: 1, h: 3 },
        ]);
    };
    const PODFirst = () => {
        // Filter the options based on the selected receivers
        setLayout([
            { i: "card02", x: 0, y: 0, w: 1, h: 4.5 }, //Information
            { i: "card06", x: 2, y: 0, w: 1, h: 4.5 }, // Spend By month
            { i: "card04", x: 0, y: 2, w: 1, h: 3 }, //Consignment Status
            { i: "card12", x: 2, y: 0, w: 1, h: 3 }, // Consignment By Month
            { i: "card08", x: 0, y: -2, w: 1, h: 3 }, // Pod True Vs False
            { i: "card03", x: 2, y: -2, w: 1, h: 3 }, // Pod Status
            { i: "card03_2", x: 0, y: 4, w: 1, h: 3 },
            { i: "card13", x: 2, y: 4, w: 1, h: 3 },
        ]);
    };
    const ConsignmentsFirst = () => {
        // Filter the options based on the selected receivers
        setLayout([
            { i: "card02", x: 0, y: 2, w: 1, h: 4.5 }, //Information
            { i: "card06", x: 2, y: 0, w: 1, h: 4.5 }, // Spend By month
            { i: "card04", x: 0, y: 0, w: 1, h: 4.5 }, //Consignment Status
            { i: "card12", x: 2, y: -2, w: 1, h: 4.5 }, // Consignment By Month
            { i: "card08", x: 0, y: 2, w: 1, h: 3 }, // Pod True Vs False
            { i: "card03", x: 2, y: 2, w: 1, h: 3 }, // Pod Status
            { i: "card03_2", x: 0, y: 4, w: 1, h: 3 },
            { i: "card13", x: 2, y: 4, w: 1, h: 3 },
        ]);
    };
    useEffect(() => {
        // Update the layout when cols change
        setLayout((prevLayout) =>
            prevLayout.map((item, index) => {
                return {
                    ...item,
                    x: index % cols, // Distribute the divs evenly between x=0 and x=1
                    w: item.w, // Set the width to cols for the first div, and 1 for others
                };
            })
        );
    }, [cols]);
    if (chartsData.length > 0) {
        return (
            <div className=" px-4 sm:px-6 lg:px-8 pb-6 bg-smooth">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto mt-6">
                        <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                            Dashboard
                        </h1>
                    </div>
                </div>
                <div className="mt-3">
                    <div className="w-full relative">
                        <div className=" sm:border-gray-200 text-gray-400 flex flex-col  2xl:flex-row gap-y-4 gap-x-2 2xl:items-center">
                            <label
                                htmlFor="last-name"
                                className="inline-block text-sm font-medium leading-6  flex-item items-center"
                            >
                                Date From
                            </label>
                            <div className="sm:mt-0 md:px-4 ">
                                <input
                                    onKeyDown={(e) => e.preventDefault()}
                                    type="date"
                                    name="from-date"
                                    value={SDate}
                                    min={getOldestDespatchDate(chartsData)}
                                    max={EDate}
                                    onChange={handleStartDateChange}
                                    id="from-date"
                                    className="flex-item block w-full max-w-lg h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
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
                                    className="block w-full max-w-lg h-[36px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                />
                            </div>

                            <label
                                htmlFor="last-name"
                                className="block text-sm font-medium leading-6  text-gray-400 sm:pt-1.5 mr-5"
                            >
                                Receiver Name
                            </label>

                            <div className="inline-block ">
                                <div className=" flex items-center">
                                    <div className="mt-2 w-full sm:mt-0 ">
                                        <Select
                                            styles={customStyles}
                                            isMulti
                                            name="colors"
                                            value={selectedReceiver}
                                            options={getFilteredOptions()}
                                            onChange={
                                                handleReceiverSelectChange
                                            }
                                            className="basic-multi-select text-red "
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Popover className="relative object-right flex-item md:ml-auto mr-5">
                                <Popover.Button
                                    className={` inline-flex items-center w-[5.5rem] h-[36px] rounded-md border bg-gray-800 px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                >
                                    Presets
                                    <ChevronDownIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </Popover.Button>

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
                                        <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-gray-200 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                            <div className="p-4">
                                                <div className="mt-2 flex flex-col gap-y-2">
                                                    <button
                                                        onClick={ResetLayout}
                                                        className="bg-dark h-full w-full px-5 py-1 rounded hover:bg-gray-400 text-smooth hover:text-dark"
                                                    >
                                                        Reset Default
                                                    </button>
                                                    <button
                                                        onClick={
                                                            ConsignmentsFirst
                                                        }
                                                        className="bg-dark h-full w-full px-5 py-1 rounded hover:bg-gray-400 text-smooth hover:text-dark"
                                                    >
                                                        Consignments First
                                                    </button>
                                                    <button
                                                        onClick={PODFirst}
                                                        className="bg-dark h-full w-full px-5 py-1 rounded hover:bg-gray-400 text-smooth hover:text-dark"
                                                    >
                                                        POD First
                                                    </button>
                                                </div>
                                            </div>
                                            {/* <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                                <button
                                                    // onClick={handleDownloadExcel}
                                                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                                >
                                                    Export XLS
                                                </button>
                                            </div> */}
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </Popover>
                        </div>
                    </div>
                </div>
                {hasData ? (
                    <ReactGridLayout
                        className="layout custom-grid"
                        layout={layout}
                        cols={cols}
                        rowHeight={100}
                        width={1200}
                        isResizable={false}
                        isDraggable={!isMobile}
                        autoSize={true}
                        onLayoutChange={(layout) => setLayout(layout)}
                        dragEnterChild="drag-over"
                        dragLeaveChild="drag-out"
                        // onLayoutChange={(layout) => setLayout(layout)}
                    >
                        {/* Place your components with drag-and-drop functionality */}
                        <div key="card02" className="relative drag-over">
                            {" "}
                            <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                            <DashboardCard07
                                InfoData={calculateStatistics(filteredData)}
                            />{" "}
                        </div>
                        <div key="card06" className="relative">
                            {" "}
                            <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                            <MultiChartLine
                                chartData={getMonthlyData(filteredData)}
                                chartTitle={"Spend By State"}
                            />{" "}
                        </div>
                        <div key="card12" className="relative">
                            {" "}
                            <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                            <BasicColumnCharts
                                chartData={getMonthlyRecordCounts(filteredData)}
                                chartTitle={" Consignment By Month"}
                            />{" "}
                        </div>
                        <div key="card04" className="relative">
                            {" "}
                            <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                            <BasicPieCharts
                                chartData={getConsStatusCounter(filteredData)}
                                chartTitle={"Consignment Status"}
                            />{" "}
                        </div>
                        <div key="card08" className="relative">
                            {" "}
                            <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                            <DoubleBarChart
                                chartData={getPODCounts(filteredData)}
                                chartTitle={"POD True vs False"}
                            />{" "}
                        </div>
                        <div key="card03" className="relative">
                            {" "}
                            <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                            <BasicPieCharts
                                chartData={getPODCountsByState(filteredData)}
                                chartTitle={"POD Status By State"}
                            />{" "}
                        </div>
                        <div key="card03_2">
                            <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                            <BasicColumnCharts
                                chartData={getStateRecordCounts(filteredData)}
                                chartTitle={" Consignments By state"}
                            />{" "}
                        </div>
                        <div key="card13" className="relative">
                            {" "}
                            <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                            <BasicColumnCharts
                                chartData={getStateTotalWeights(filteredData)}
                                chartTitle={" Weight By state"}
                            />{" "}
                        </div>
                        <div key="card14" className="relative">
                            {" "}
                            <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                            <BasicPieCharts
                                chartData={getKPIStatusCounter(filteredData)}
                                chartTitle={"KPI Status"}
                            />{" "}
                        </div>
                    </ReactGridLayout>
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

                {/* <DashboardCard11 /> */}
            </div>
        );
    } else {
        return (
            <div className=" min-h-screen md:pl-20 pt-16 h-full">
                <div className="fixed inset-0 flex items-center justify-center">
                    <div
                        className={`h-5 w-5 bg-goldd   rounded-full mr-5 animate-bounce`}
                    ></div>
                    <div
                        className={`h-5 w-5 bg-goldd   rounded-full mr-5 animate-bounce200`}
                    ></div>
                    <div
                        className={`h-5 w-5 bg-goldd   rounded-full animate-bounce400`}
                    ></div>
                </div>
            </div>
        );
    }
}
