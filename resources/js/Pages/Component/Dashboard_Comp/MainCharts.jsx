import DashboardCard07 from "@/Components/dashboard/DashboardCard07";
import BasicPieCharts from "@/Components/dashboard/DashboardCard13";
import "../../../../css/dashboard.css";
import BasicColumnCharts from "./Dashboard_Charts/BasicColumnChart";
import { ArrowsPointingOutIcon } from "@heroicons/react/20/solid";
import Select from "react-select";
// import ReactGridLayout from 'react-grid-layout';
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useState } from "react";
import notFound from "../../../assets/pictures/NotFound.png";
import { useEffect } from "react";
import MultiChartLine from "./Dashboard_Charts/MultiLineChart";
import DoubleBarChart from "./Dashboard_Charts/DoublBarChart";
import {
    getLatestDespatchDate,
    getOldestDespatchDate,
} from "@/Components/utils/dateUtils";
import {
    calculateStatistics,
    getConsStatusCounter,
    getKPIStatusCounter,
    getMonthlyData,
    getMonthlyRecordCounts,
    getPODCounts,
    getPODCountsByState,
    getStateRecordCounts,
    getStateTotalWeights,
} from "@/Components/utils/chartFunc";
import AnimatedLoading from "@/Components/AnimatedLoading";
const ReactGridLayout = WidthProvider(RGL);

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
        display: "flex",
        justifyContent: "space-between",
    }),
    valueContainer: (provided) => ({
        ...provided,
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
    safetyData,
    chartsData,
    sideBarToggle,
}) {
    const [filteredSafety, setFilteredSafety] = useState(safetyData);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [cols, setCols] = useState(2);
    const [SDate, setSDate] = useState(getOldestDespatchDate(chartsData));
    const [EDate, setEDate] = useState(getLatestDespatchDate(chartsData));
    const [filteredData, setFilteredData] = useState([chartsData]);
    const [selectedReceiver, setselectedReceiver] = useState([]);
    const [dataWithoutReceiver, setDataWithoutReceiver] = useState([]);
    const [gridKey, setGridKey] = useState("sidebar-open");

    const [hasData, setHasData] = useState(true);
    useEffect(() => {
        setFilteredData(chartsData);
    }, []);
    const [layout, setLayout] = useState([
        { i: "card02", x: 0, y: 0, w: 1, h: 5 }, //Information
        { i: "card06", x: 2, y: 0, w: 1, h: 5 }, // Spend By month
        { i: "card04", x: 0, y: 2, w: 1, h: 3 }, //Consignment Status
        { i: "card12", x: 2, y: 0, w: 1, h: 3 }, // Consignment By Month
        { i: "card08", x: 0, y: 2, w: 1, h: 3 }, // Pod True Vs False
        { i: "card03", x: 2, y: 2, w: 1, h: 3 }, // Pod Status
        { i: "card03_2", x: 0, y: 4, w: 1, h: 3 },
        { i: "card13", x: 2, y: 4, w: 1, h: 3 },
        { i: "card14", x: 0, y: 4, w: 1, h: 3 },
    ]);
    const ResetLayout = () => {
        // Filter the options based on the selected receivers
        setLayout([
            { i: "card02", x: 0, y: 0, w: 1, h: 5 }, //Information
            { i: "card06", x: 2, y: 0, w: 1, h: 5 }, // Spend By month
            { i: "card04", x: 0, y: 2, w: 1, h: 3 }, //Consignment Status
            { i: "card12", x: 2, y: 0, w: 1, h: 3 }, // Consignment By Month
            { i: "card08", x: 0, y: 2, w: 1, h: 3 }, // Pod True Vs False
            { i: "card03", x: 2, y: 2, w: 1, h: 3 }, // Pod Status
            { i: "card03_2", x: 0, y: 4, w: 1, h: 3 },
            { i: "card13", x: 2, y: 4, w: 1, h: 3 },
            { i: "card14", x: 0, y: 4, w: 1, h: 3 },
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
    const uniqueReceiverNames = Array.from(
        new Set(dataWithoutReceiver.map((item) => item.ReceiverName))
    );
    const handleReceiverSelectChange = (selectedOptions) => {
        setselectedReceiver(selectedOptions);
        // filterData(SDate, EDate, selectedReceiver);
    };
    const receiverOptions = uniqueReceiverNames.map((name) => ({
        value: name,
        label: name,
    }));
    function filterReportsByDebtorId(safetyData, debtorIds) {
        return safetyData.filter((data) => debtorIds.includes(data.DebtorId));
    }
    const getFilteredOptions = () => {
        // Filter the options based on the selected receivers
        return receiverOptions.filter(
            (option) =>
                !selectedReceiver.find(
                    (receiver) => receiver.value === option.value
                )
        );
    };

    const filterData = (startDate, endDate) => {
        const selectedReceiverNames = selectedReceiver.map(
            (receiver) => receiver.value
        );
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        if (intArray) {
            if (intArray && intArray?.length === 0) {
                setFilteredSafety(safetyData);
            } else {
                setFilteredSafety(
                    filterReportsByDebtorId(safetyData, intArray)
                );
            }
        } else {
            setFilteredSafety(safetyData);
        }
        const filteredDataWithoutReceiver = chartsData.filter((item) => {
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
                chargeToMatch
            );
        });
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
        setDataWithoutReceiver(filteredDataWithoutReceiver);
        setFilteredData(filtered);
        setHasData(hasData);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCols(1);
            } else if (window.innerWidth < 1300) {
                setCols(1);
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

    useEffect(() => {
        filterData(SDate, EDate);
    }, [accData, selectedReceiver]);

    useEffect(() => {
        // Update the layout when cols change
        setLayout((prevLayout) =>
            prevLayout.map((item, index) => {
                return {
                    ...item,
                    x: index % cols, // Distribute the divs evenly between x=0 and x=1
                    w: sideBarToggle ? item.w : Math.min(item.w, 1), // Set the width to cols for the first div, and 1 for others
                };
            })
        );
    }, [cols, sideBarToggle]);

    useEffect(() => {
        // Introduce a delay before changing the key
        const timeout = setTimeout(() => {
            setGridKey(sideBarToggle ? "sidebar-open" : "sidebar-closed");
        }, 300); // Delay in milliseconds (e.g., 300ms)

        // Cleanup timeout on unmount or when sideBarToggle changes
        return () => clearTimeout(timeout);
    }, [sideBarToggle]);

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
                        <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
                            <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                <label
                                    htmlFor="last-name"
                                    className="inline-block text-sm font-medium leading-6 flex-item items-center"
                                >
                                    Date From
                                </label>
                                <div className="">
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
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                <label
                                    htmlFor="last-name"
                                    className="inline-block text-sm font-medium leading-6 flex-item"
                                >
                                    To
                                </label>

                                <div className="">
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
                            <div className="flex flex-col md:flex-row gap-4 md:items-center xl:col-span-2 2xl:col-span-3">
                                <label
                                    htmlFor="last-name"
                                    className=" text-sm font-medium text-gray-400"
                                >
                                    Receiver Name
                                </label>

                                <div className=" flex items-center w-full">
                                    <div className="w-full">
                                        <Select
                                            styles={customStyles}
                                            isMulti
                                            name="colors"
                                            value={selectedReceiver}
                                            options={getFilteredOptions()}
                                            onChange={
                                                handleReceiverSelectChange
                                            }
                                            className="basic-multi-select w-full"
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="xl:ml-auto flex items-center">
                                <button
                                    className={`  items-center w-auto h-[36px] rounded-md border bg-gray-800 px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                    onClick={ResetLayout}
                                >
                                    Reset layout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {hasData ? (
                    <div className="layout-container">
                        {" "}
                        <ReactGridLayout
                            key={gridKey} // Change key to force re-render
                            className="layout custom-grid"
                            layout={layout}
                            cols={cols}
                            rowHeight={110}
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
                                    InfoData={calculateStatistics(
                                        filteredData,
                                        filteredSafety
                                    )}
                                />{" "}
                            </div>
                            <div key="card06" className="relative">
                                {" "}
                                <ArrowsPointingOutIcon className=" absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                                <MultiChartLine
                                    chartData={getMonthlyData(filteredData)}
                                    chartTitle={"Spend By State"}
                                />{" "}
                            </div>
                            <div key="card12" className="relative">
                                {" "}
                                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                                <BasicColumnCharts
                                    chartData={getMonthlyRecordCounts(
                                        filteredData
                                    )}
                                    chartTitle={" Consignment By Month"}
                                />{" "}
                            </div>
                            <div key="card04" className="relative">
                                {" "}
                                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                                <BasicPieCharts
                                    chartData={getConsStatusCounter(
                                        filteredData
                                    )}
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
                                    chartData={getPODCountsByState(
                                        filteredData
                                    )}
                                    chartTitle={"POD Status By State"}
                                />{" "}
                            </div>
                            <div key="card03_2">
                                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                                <BasicColumnCharts
                                    chartData={getStateRecordCounts(
                                        filteredData
                                    )}
                                    chartTitle={" Consignments By state"}
                                />{" "}
                            </div>
                            <div key="card13" className="relative">
                                {" "}
                                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                                <BasicColumnCharts
                                    chartData={getStateTotalWeights(
                                        filteredData
                                    )}
                                    chartTitle={" Weight By state"}
                                />{" "}
                            </div>
                            <div key="card14" className="relative">
                                {" "}
                                <ArrowsPointingOutIcon className="absolute text-gray-500 right-3 w-3 top-3 hover:cursor-move" />
                                <BasicPieCharts
                                    chartData={getKPIStatusCounter(
                                        filteredData
                                    )}
                                    chartTitle={"KPI Status"}
                                />{" "}
                            </div>
                        </ReactGridLayout>
                    </div>
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
