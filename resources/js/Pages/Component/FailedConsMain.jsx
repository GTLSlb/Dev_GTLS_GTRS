import React, { useState, useEffect } from "react";
import FailedCons from "./FailedCons";
import AddFailedReason from "./AddFailedReason";

export default function FailedConsMain({
    url,
    PerfData,
    setPerfData,
    setActiveIndexGTRS,
    setLastIndex,
    setactiveCon,
    IDfilter,
    currentUser,
    accData,
    EDate,
    setEDate,
    SDate,
    setSDate,
    failedReasons,
    setFailedReasons,
    oldestDate,
    latestDate,
}) {
    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    const [isFetching, setIsfetching] = useState();
    const [roleId, setRoleId] = useState(null);
    const [shouldShowList, setShouldShowList] = useState(false);
    const Roles = ["1", "3", "4"];
    useEffect(() => {
        if (!failedReasons) {
            setIsfetching(true);
            fetchReasonData();
        }
    }, []);
    const fetchReasonData = async () => {
        try {
            axios
                .get(`${url}api/FailureReasons`, {
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
                        setFailedReasons(parsedData || []);
                        setIsfetching(false);
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        if (currentUser && currentUser.role_id) {
            setRoleId(currentUser.role_id);
        }
        setShouldShowList(
            currentUser?.role_id === 1 || currentUser?.role_id === 3
        );
    }, [currentUser]);
    const components = [
        <FailedCons
            url={url}
            failedReasons={failedReasons}
            currentUser={currentUser}
            accData={accData}
            setActiveIndexGTRS={setActiveIndexGTRS}
            PerfData={PerfData}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            setPerfData={setPerfData}
            oldestDate={oldestDate}
            latestDate={latestDate}
        />,
        <AddFailedReason
            url={url}
            failedReasons={failedReasons}
            setFailedReasons={setFailedReasons}
            currentUser={currentUser}
        />,
    ];

    const handleItemClick = (index) => {
        setActiveComponentIndex(index);
    };

    // Determine whether to show the list or only the first component based on the role ID
    //   const shouldShowList = currentUser?.role_id === 1 || currentUser?.role_id === 3;
    return (
        <div>
            {isFetching ? (
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
                                Failed Consignments Report
                            </h1>
                        </div>
                    </div>
                    {Roles.includes(currentUser.role_id) ? (
                        <ul className="flex space-x-0 mt-5">
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
                                        {" "}
                                        {index === 0
                                            ? "Failed Consignments"
                                            : "Failed Reasons"}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div></div>
                    )}
                    <div className="mt-4">
                        {components[activeComponentIndex]}
                    </div>
                </div>
            )}
        </div>
    );
}
