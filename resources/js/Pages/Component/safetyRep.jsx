import { useLayoutEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { useEffect } from "react";
import SafetyRepTable from "./safetyComp/safetyRepTable";
import SafetyRepChart from "./safetyComp/safetyRepChart";
import Select from "react-select";
import AddSafetyType from "./safetyComp/AddSafety/safetyTypes/AddSafetyType";
import AddSafetyCauses from "./safetyComp/AddSafety/safetyCauses/AddSafetyCauses";
export default function SafetyRep({
    accData,
    currentUser,
    url,
    safetyDataState,
    filterValue,
    setFilterValue,
    setsafetyDataState,
    setSafetyTypes,
    safetyTypes,
    safetyCauses,
    setSafetyCauses,
    oldestDate,
    latestDate,
    DefaultSDate,
    DefaultEDate,
}) {
    const [SDate, setSDate] = useState(DefaultSDate);
    const [EDate, setEDate] = useState(DefaultEDate);
    useEffect(() => {
        getEarliestDate(safetyDataState);
        getLatestDate(safetyDataState);
    }, []);
    function getEarliestDate(reports) {
        if (!reports || reports.length === 0) {
            return null;
        }

        let earliestDate = null;
        for (let i = 0; i < reports.length; i++) {
            const occurredAt = reports[i].OccuredAt;
            if (occurredAt) {
                if (!earliestDate || occurredAt < earliestDate) {
                    earliestDate = occurredAt;
                }
            }
        }
        setSDate(earliestDate.split("T")[0]);
        // setSDate(formattedDate);
    }
    function getLatestDate(reports) {
        if (!reports || reports.length === 0) {
            return null;
        }

        let latestDate = null;
        for (let i = 0; i < reports.length; i++) {
            const occurredAt = reports[i].OccuredAt;
            if (occurredAt) {
                if (!latestDate || occurredAt > latestDate) {
                    latestDate = occurredAt;
                }
            }
        }
        setEDate(latestDate.split("T")[0]);
    }
    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    const [filteredData, setFilteredData] = useState(null);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [activeTab, setActiveTab] = useState("first");
    const [currentPage, setCurrentPage] = useState(0);
    const [isDataEdited, setDataEdited] = useState(false);
    const [isFetching, setIsFetching] = useState();
    const [isFetchingTypes, setIsFetchingTypes] = useState();
    const [isFetchingCauses, setIsFetchingCauses] = useState();

    const getUniqueTypes = () => {
        const filteredTypes = safetyTypes?.reduce((acc, data) => {
            if (!acc.find((item) => item.value === data.SafetyTypeId)) {
                acc.push({
                    value: data.SafetyTypeId,
                    label: data.SafetyTypeName,
                });
            }

            return acc;
        }, []);
        return filteredTypes;
    };
    const uniqueTypes = getUniqueTypes();
    useEffect(() => {
        if (safetyDataState.length === 0) {
            setIsFetching(true);
            setIsFetchingTypes(true);
            setIsFetchingCauses(true);
            fetchData();
            fetchDataTypes();
            fetchDataCauses();
        }
    }, []);
    function fetchData() {
        setIsFetching(true);
        return axios
            .get(`${url}api/SafetyReport`, {
                headers: {
                    RoleId: currentUser.role_id,
                },
            })
            .then((res) => {
                getEarliestDate(res.data);
                getLatestDate(res.data);
                setsafetyDataState(res.data || []);
                setFilteredData(res.data || []);
                setIsFetching(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function fetchDataTypes() {
        axios
            .get(`${url}api/SafetyTypes`, {
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
                    setSafetyTypes(parsedData);
                    setIsFetchingTypes(false);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function fetchDataCauses() {
        axios
            .get(`${url}api/SafetyCauses`, {
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
                    setSafetyCauses(parsedData);
                    setIsFetchingCauses(false);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    useEffect(() => {
        filterData(SDate, EDate);
    }, [SDate, EDate]);
    useEffect(() => {
        filterData(SDate, EDate);
    }, [accData, selectedTypes]);
    useEffect(() => {
        if (isDataEdited) {
            fetchData();
            setDataEdited(false); // Reset the edit status after fetching data
        }
    }, [isDataEdited]);

    const handleTypeChange = (selectedOptions) => {
        // const types = selectedOptions.map((option) => option.value);
        setSelectedTypes(selectedOptions);
        filterData(SDate, EDate);
    };
    const filterData = (startDate, endDate) => {
        // Filter the data based on the start and end date filters
        const filtered = safetyDataState?.filter((item) => {
            const itemDate = new Date(item.OccuredAt); // Convert item's date string to Date object
            const filterStartDate = new Date(startDate); // Convert start date string to Date object
            const filterEndDate = new Date(endDate); // Convert end date string to Date object
            filterStartDate.setHours(0);
            filterEndDate.setSeconds(59);
            filterEndDate.setMinutes(59);
            filterEndDate.setHours(23);
            const typeMatch =
                selectedTypes.length === 0 ||
                selectedTypes.some(
                    (selectedType) => selectedType.value === item.SafetyType
                );
            return (
                itemDate >= filterStartDate &&
                itemDate <= filterEndDate &&
                typeMatch
            ); // Compare the item date to the filter dates
        });
        setFilteredData(filtered);
        setCurrentPage(0);
    };
    const customStyles = {
        control: (provided) => ({
            ...provided,

            // Add more styles here as needed
        }),
        option: (provided, state) => ({
            ...provided,
            color: "black",
            // Add more styles here as needed
        }),
        multiValue: (provided) => ({
            ...provided,
            width: "auto",
            overflow: "hidden",
        }),
        valueContainer: (provided) => ({
            ...provided,
            width: "400px",
            maxHeight: "75px", // Set the maximum height for the value container
            overflow: "auto", // Enable scrolling if the content exceeds the maximum height
            // fontSize: '10px',
        }),
        inputContainer: (provided) => ({
            ...provided,
        }),
        // Add more style functions here as needed
    };

    let components = [
        <SafetyRepTable
            url={url}
            safetyCauses={safetyCauses}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            safetyTypes={safetyTypes}
            safetyData={safetyDataState}
            currentPageRep={currentPage}
            currentUser={currentUser}
            setFilteredData={setFilteredData}
            setDataEdited={setDataEdited}
        />,
        <SafetyRepChart
            filteredData={filteredData}
            safetyCauses={safetyCauses}
            safetyTypes={safetyTypes}
        />,
        <AddSafetyType
            url={url}
            currentUser={currentUser}
            safetyTypes={safetyTypes}
            setSafetyTypes={setSafetyTypes}
        />,
    ];

    const handleItemClick = (index) => {
        setActiveComponentIndex(index);
    };
    return (
        <div>
            {isFetching || isFetchingCauses || isFetchingTypes ? (
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
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto mt-6">
                            <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                Safety Report
                            </h1>
                        </div>
                    </div>
                    {currentUser.role_id == 2 ? (
                        <ul className="flex space-x-0 mt-5">
                            <li
                                className={`cursor-pointer ${
                                    activeComponentIndex === 0
                                        ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                        : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                                }`}
                                onClick={() => handleItemClick(0)}
                            >
                                <div className="px-2">Report</div>
                            </li>
                            <li
                                className={`cursor-pointer ${
                                    activeComponentIndex === 1
                                        ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                        : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                                }`}
                                onClick={() => handleItemClick(1)}
                            >
                                <div className="px-2"> Charts</div>
                            </li>
                        </ul>
                    ) : (
                        <ul className="flex space-x-0 mt-5 ">
                            {components.map((component, index) => (
                                <li
                                    key={index}
                                    className={`cursor-pointer ${
                                        activeComponentIndex === index
                                            ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                            : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                                    }`}
                                    onClick={() => handleItemClick(index)}
                                >
                                    <div className="px-2">
                                        {index === 0
                                            ? "Report"
                                            : index === 1
                                            ? "Charts"
                                            : index === 2
                                            ? "Safety Types"
                                            : "Safety Causes"}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-8">
                        <div className="w-full relative">
                            <div className=" sm:border-gray-200 text-gray-400 flex flex-col md:flex-row gap-y-4 gap-x-2 md:items-center">
                                {activeComponentIndex === 1 && (
                                    <div className="flex">
                                        {" "}
                                        <label
                                            htmlFor="last-name"
                                            className="inline-block text-sm font-medium leading-6  flex-item items-center"
                                        >
                                            Date From
                                        </label>
                                        <div className="sm:mt-0 md:px-4 ">
                                            <input
                                                type="date"
                                                name="from-date"
                                                onKeyDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                value={SDate}
                                                min={oldestDate}
                                                max={EDate}
                                                onChange={(e) =>
                                                    setSDate(e.target.value)
                                                }
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
                                                type="date"
                                                name="to-date"
                                                onKeyDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                value={EDate}
                                                min={SDate}
                                                max={latestDate}
                                                onChange={(e) =>
                                                    setEDate(e.target.value)
                                                }
                                                id="to-date"
                                                className="block w-full max-w-lg h-[36px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>{" "}
                    {components[activeComponentIndex]}
                </div>
            )}
        </div>
    );
}