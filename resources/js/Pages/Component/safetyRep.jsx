import { useState } from "react";
import { useEffect } from "react";
import SafetyRepTable from "./safetyComp/safetyRepTable";
import SafetyRepChart from "./safetyComp/safetyRepChart";
import AddSafetyType from "./safetyComp/AddSafety/safetyTypes/AddSafetyType";
import { canViewSafetyType } from "@/permissions";
import { getApiRequest } from "@/CommonFunctions";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { ToastContainer } from 'react-toastify';

export default function SafetyRep({
    accData,
    currentUser,
    url,
    AToken,
    safetyDataState,
    filterValue,
    setFilterValue,
    setsafetyDataState,
    setSafetyTypes,
    safetyTypes,
    customerAccounts,
    safetyCauses,
    setSafetyCauses,
    oldestDate,
    latestDate,
    DefaultSDate,
    DefaultEDate,
    userPermission,
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
    const [currentPage, setCurrentPage] = useState(0);
    const [isDataEdited, setDataEdited] = useState(false);
    const [isFetching, setIsFetching] = useState();
    const [isFetchingTypes, setIsFetchingTypes] = useState();
    const [isFetchingCauses, setIsFetchingCauses] = useState();

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

    async function fetchData() {
        setIsFetching(true);
        const data = await getApiRequest(`${url}SafetyReport`, {
            UserId: currentUser?.UserId,
        });

        if (data) {
            getEarliestDate(data);
            getLatestDate(data);
            setsafetyDataState(data || []);
            setFilteredData(data || []);
            setIsFetching(false);
        }
    }

    async function fetchDataTypes() {
        const data = await getApiRequest(`${url}SafetyTypes`, {
            UserId: currentUser?.UserId,
        });

        if (data) {
            setSafetyTypes(data);
            setIsFetchingTypes(false);
        }
    }

    async function fetchDataCauses() {
        const data = await getApiRequest(`${url}SafetyCauses`, {
            UserId: currentUser?.UserId,
        });

        if (data) {
            setSafetyCauses(data);
            setIsFetchingCauses(false);
        }
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

    const filterData = (startDate, endDate) => {
        // Filter the data based on the start and end date filters
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });

        const filtered = safetyDataState?.filter((item) => {
            const itemDate = new Date(item.OccuredAt); // Convert item's date string to Date object
            const filterStartDate = new Date(startDate); // Convert start date string to Date object
            const filterEndDate = new Date(endDate); // Convert end date string to Date object
            filterStartDate.setHours(0);
            filterEndDate.setSeconds(59);
            filterEndDate.setMinutes(59);
            filterEndDate.setHours(23);
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.DebtorId);
            const typeMatch =
                selectedTypes.length === 0 ||
                selectedTypes.some(
                    (selectedType) => selectedType.value === item.SafetyType
                );
            return (
                itemDate >= filterStartDate &&
                itemDate <= filterEndDate &&
                typeMatch &&
                chargeToMatch
            ); // Compare the item date to the filter dates
        });
        setFilteredData(filtered);
        setCurrentPage(0);
    };

    let components = [
        <SafetyRepTable
            url={url}
            fetchData={fetchData}
            AToken={AToken}
            customerAccounts={customerAccounts}
            safetyCauses={safetyCauses}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            setsafetyData={setsafetyDataState}
            safetyTypes={safetyTypes}
            safetyData={filteredData}
            currentPageRep={currentPage}
            currentUser={currentUser}
            userPermission={userPermission}
            setFilteredData={setFilteredData}
            setDataEdited={setDataEdited}
        />,
        <SafetyRepChart
            AToken={AToken}
            filteredData={filteredData}
            safetyCauses={safetyCauses}
            safetyTypes={safetyTypes}
        />,
        <AddSafetyType
            url={url}
            AToken={AToken}
            currentUser={currentUser}
            userPermission={userPermission}
            safetyTypes={safetyTypes}
            setSafetyTypes={setSafetyTypes}
        />,
    ];

    const handleItemClick = (index) => {
        setActiveComponentIndex(index);
    };
    const [canView, setCanView] = useState(true);
    useEffect(() => {
        if (userPermission) {
            setCanView(!canViewSafetyType(userPermission));
        }
    }, [userPermission]);
    return (
        <div>
            {/* Added toast container since it wasn't showing */}
            <ToastContainer />
            {isFetching || isFetchingCauses || isFetchingTypes ? (
                <AnimatedLoading />
            ) : (
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto mt-6">
                            <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                Safety Report
                            </h1>
                        </div>
                    </div>
                    {canView ? (
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
                                    <div className="flex flex-col sm:flex-row sm:gap-3 lg:gap-0 pb-4">
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
                                            className="inline-block text-sm font-medium leading-6 mt-2 sm:mt-0 flex-item"
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
