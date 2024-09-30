import React, { useState, useEffect } from "react";
import FailedCons from "./FailedCons";
import swal from "sweetalert";
import axios from "axios";
import { handleSessionExpiration } from '@/CommonFunctions';

export default function FailedConsMain({
    url,
    PerfData,
    setPerfData,
    setActiveIndexGTRS,
    gtccrUrl,
    setLastIndex,
    setactiveCon,
    filterValue,
    setFilterValue,
    IDfilter,
    setIncidentId,
    currentUser,
    userPermission,
    accData,
    EDate,
    setEDate,
    AToken,
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
                .get(`${url}FailureReasons`, {
                    headers: {
                        UserId: currentUser.UserId,
                        Authorization: `Bearer ${AToken}`,
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
                    if (err.response && err.response.status === 401) {
                        // Handle 401 error using SweetAlert
                        swal({
                            title: "Session Expired!",
                            text: "Please login again",
                            type: "success",
                            icon: "info",
                            confirmButtonText: "OK",
                        }).then(async function () {
                            await handleSessionExpiration();
                        });
                    } else {
                        // Handle other errors
                        console.log(err);
                    }
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
                        <FailedCons
                            url={url}
                            failedReasons={failedReasons}
                            currentUser={currentUser}
                            userPermission={userPermission}
                            accData={accData}
                            gtccrUrl={gtccrUrl}
                            setIncidentId={setIncidentId}
                            setActiveIndexGTRS={setActiveIndexGTRS}
                            PerfData={PerfData}
                            setactiveCon={setactiveCon}
                            setLastIndex={setLastIndex}
                            IDfilter={IDfilter}
                            filterValue={filterValue}
                            setFilterValue={setFilterValue}
                            EDate={EDate}
                            AToken={AToken}
                            setEDate={setEDate}
                            SDate={SDate}
                            setSDate={setSDate}
                            setPerfData={setPerfData}
                            oldestDate={oldestDate}
                            latestDate={latestDate}
                        />
                    </div>
            )}
        </div>
    );
}
