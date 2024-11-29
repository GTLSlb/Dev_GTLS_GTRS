import React, { useState, useEffect } from "react";
import FailedCons from "./FailedCons";
import swal from "sweetalert";
import axios from "axios";
import { handleSessionExpiration } from "@/CommonFunctions";
import AnimatedLoading from "@/Components/AnimatedLoading";

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
    const [isFetching, setIsfetching] = useState();

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

    return (
        <div>
            {isFetching ? (
                <AnimatedLoading />
            ) : (
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <FailedCons
                        url={url}
                        failedReasons={failedReasons}
                        currentUser={currentUser}
                        userPermission={userPermission}
                        accData={accData}
                        PerfData={PerfData}
                        filterValue={filterValue}
                        setFilterValue={setFilterValue}
                        AToken={AToken}
                    />
                </div>
            )}
        </div>
    );

}
