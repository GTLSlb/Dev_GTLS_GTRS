import { useContext, useState } from "react";
import { useEffect } from "react";
import React from "react";
import propTypes from "prop-types";
import SafetyRepTable from "./safetyComp/safetyRepTable";
import SafetyRepChart from "./safetyComp/safetyRepChart";
import AddSafetyType from "./safetyComp/AddSafety/safetyTypes/AddSafetyType";
import { canViewSafetyType } from "@/permissions";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { ToastContainer } from "react-toastify";
import { useApiRequests } from "@/CommonFunctions";
import { CustomContext } from "@/CommonContext";

export default function SafetyRep({
    accData,
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
}) {
    const { user, url, Token, userPermissions } = useContext(CustomContext);
    const { getApiRequest } = useApiRequests();
    const [SDate, setSDate] = useState(DefaultSDate);
    const [EDate, setEDate] = useState(DefaultEDate);

    // Memoize the date calculation functions to prevent unnecessary re-renders
    const getEarliestDate = React.useCallback((reports) => {
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
        if (earliestDate) {
            setSDate(earliestDate.split("T")[0]);
        }
    }, []);

    const getLatestDate = React.useCallback((reports) => {
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
        if (latestDate) {
            setEDate(latestDate.split("T")[0]);
        }
    }, []);

    // Only run this once when component mounts and safetyDataState changes
    useEffect(() => {
        if (safetyDataState && safetyDataState.length > 0) {
            getEarliestDate(safetyDataState);
            getLatestDate(safetyDataState);
        }
    }, [safetyDataState, getEarliestDate, getLatestDate]);

    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    const [filteredData, setFilteredData] = useState(null);
    const selectedTypes = [];
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
    }, []); // Empty dependency array is fine here since we only want this to run once

    const fetchData = React.useCallback(async () => {
        setIsFetching(true);
        const data = await getApiRequest(`${url}SafetyReport`, {
            UserId: user?.UserId,
        });

        if (data) {
            getEarliestDate(data);
            getLatestDate(data);
            setsafetyDataState(data || []);
            setFilteredData(data || []);
            setIsFetching(false);
        }
    }, [
        url,
        user?.UserId,
        getApiRequest,
        getEarliestDate,
        getLatestDate,
        setsafetyDataState,
    ]);

    const fetchDataTypes = React.useCallback(async () => {
        const data = await getApiRequest(`${url}SafetyTypes`, {
            UserId: user?.UserId,
        });

        if (data) {
            setSafetyTypes(data);
            setIsFetchingTypes(false);
        }
    }, [url, user?.UserId, getApiRequest, setSafetyTypes]);

    const fetchDataCauses = React.useCallback(async () => {
        const data = await getApiRequest(`${url}SafetyCauses`, {
            UserId: user?.UserId,
        });

        if (data) {
            setSafetyCauses(data);
            setIsFetchingCauses(false);
        }
    }, [url, user?.UserId, getApiRequest, setSafetyCauses]);

    // Memoize filterData function
    const filterData = React.useCallback(
        (startDate, endDate) => {
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
        },
        [safetyDataState, accData]
    ); // Add proper dependencies

    useEffect(() => {
        if (SDate && EDate) {
            filterData(SDate, EDate);
        }
    }, [SDate, EDate, filterData]);

    useEffect(() => {
        if (SDate && EDate) {
            filterData(SDate, EDate);
        }
    }, []);

    useEffect(() => {
        if (isDataEdited) {
            fetchData();
            setDataEdited(false); // Reset the edit status after fetching data
        }
    }, [isDataEdited, fetchData]);

    // Memoize components array to prevent recreation on every render
    const components = React.useMemo(
        () => [
            <SafetyRepTable
                key={`table-${currentPage}`}
                url={url}
                fetchData={fetchData}
                Token={Token}
                customerAccounts={customerAccounts}
                safetyCauses={safetyCauses}
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                setsafetyData={setsafetyDataState}
                safetyTypes={safetyTypes}
                safetyData={filteredData}
                currentPageRep={currentPage}
                userPermissions={userPermissions}
                setFilteredData={setFilteredData}
                setDataEdited={setDataEdited}
            />,
            <SafetyRepChart
                key={`chart-${currentPage}`}
                Token={Token}
                filteredData={filteredData}
                safetyCauses={safetyCauses}
                safetyTypes={safetyTypes}
            />,
            <AddSafetyType
                key={`add-${currentPage}`}
                url={url}
                Token={Token}
                userPermissions={userPermissions}
                safetyTypes={safetyTypes}
                setSafetyTypes={setSafetyTypes}
            />,
        ],
        [
            currentPage,
            url,
            fetchData,
            Token,
            customerAccounts,
            safetyCauses,
            filterValue,
            setFilterValue,
            setsafetyDataState,
            safetyTypes,
            filteredData,
            userPermissions,
            setFilteredData,
            setDataEdited,
            setSafetyTypes,
        ]
    );

    const handleItemClick = (index) => {
        setActiveComponentIndex(index);
    };

    const [canView, setCanView] = useState(true);

    useEffect(() => {
        if (userPermissions) {
            setCanView(!canViewSafetyType(userPermissions));
        }
    }, [userPermissions]);

    if (isFetching || isFetchingCauses || isFetchingTypes) {
        return <AnimatedLoading />;
    }
    return (
        <div>
            {/* Added toast container since it wasn't showing */}
            <ToastContainer />
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
        </div>
    );
}

SafetyRep.propTypes = {
    accData: propTypes.array,
    url: propTypes.string,
    Token: propTypes.string,
    safetyDataState: propTypes.array,
    filterValue: propTypes.array,
    setFilterValue: propTypes.func,
    setsafetyDataState: propTypes.func,
    setSafetyTypes: propTypes.func,
    safetyTypes: propTypes.array,
    customerAccounts: propTypes.array,
    safetyCauses: propTypes.array,
    setSafetyCauses: propTypes.func,
    oldestDate: propTypes.string,
    latestDate: propTypes.string,
    DefaultSDate: propTypes.string,
    DefaultEDate: propTypes.string,
};
