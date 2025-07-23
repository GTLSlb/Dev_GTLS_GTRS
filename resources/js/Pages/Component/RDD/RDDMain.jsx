import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import axios from "axios";
import { getApiRequest, handleSessionExpiration } from '@/CommonFunctions';
import AnimatedLoading from "@/Components/AnimatedLoading";
import RDDTable from "./RDDTable";
import PropTypes from "prop-types";

export default function RDDMain({
    setActiveIndexGTRS,
    setactiveCon,
    debtorsData,
    rddData,
    filterValue,
    setFilterValue,
    setrddData,
    setIncidentId,
    setLastIndex,
    accData,
    EDate,
    setEDate,
    SDate,
    url,
    Token,
    userPermission,
    setSDate,
    currentUser,
    rddReasons,
    setrddReasons,
    oldestDate,
    latestDate,
}) {
    const [isFetching, setIsFetching] = useState();
    const [isFetchingReasons, setIsFetchingReasons] = useState();
    const parseDateString = (dateString) => {
        // Check if dateString is undefined, null, or empty
        if (!dateString || !dateString.trim()) {
            return null; // or return any other default value as needed
        }
        const parts = dateString.split(/[\s/:]/);
        let dateObject;
        if (parts.length === 7) {
            // If there is a time component
            dateObject = new Date(
                Date.UTC(
                    parts[2],
                    parts[1] - 1,
                    parts[0],
                    parts[3],
                    parts[4],
                    parts[5]
                )
            );
        } else {
            // If there is no time component
            dateObject = new Date(Date.UTC(parts[2], parts[1] - 1, parts[0]));
        }
        return dateObject;
    };

    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return ""; // or return any other default value as needed
        }

        return date.toISOString().slice(0, 19); // UTC time
    };
    const updateFieldWithData = (data, fieldName) => {
        if (!data || data.length === 0) {
            return []; // or return any other default value as needed
        }

        const updatedData = data.map((item) => {
            const fieldValue = item[fieldName];
            const parsedDate = parseDateString(fieldValue);
            const formattedDate = formatDate(parsedDate);
            // Return a new object with the updated field
            return { ...item, [fieldName]: formattedDate };
        });
        setrddData(updatedData);
        return updatedData;
    };
    useEffect(() => {
        if (!rddData) {
            setIsFetching(true);
            setIsFetchingReasons(true);
            fetchData();
            fetchReasonData();
        }
    }, []); // Empty dependency array ensures the effect runs only once

    async function fetchData() {
        const data = await getApiRequest(`${url}RDD`, {
            UserId: currentUser?.UserId,
        });

        if (data) {
            const updatedOldRddData = updateFieldWithData(
                data,
                "OldRdd"
            );
            const updatedNewRddData = updateFieldWithData(
                updatedOldRddData,
                "NewRdd"
            );
            setrddData(updatedNewRddData || []);
            setIsFetching(false);
        }
    }
    const fetchReasonData = async () => {
        try {
            axios
                .get(`${url}RddChangeReason`, {
                    headers: {
                        UserId: currentUser.UserId,
                        Authorization: `Bearer ${Token}`,
                    },
                })
                .then((res) => {
                    const x = JSON.stringify(res.data);
                    const parsedDataPromise = new Promise((resolve) => {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData);
                    });
                    parsedDataPromise.then((parsedData) => {
                        setrddReasons(parsedData || []);
                        setIsFetchingReasons(false);
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
                        console.error(err);
                    }
                });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div>
            {isFetching || isFetchingReasons ? (
                <AnimatedLoading />
            ) : (
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <div className="mt-0">
                        <RDDTable
                            url={url}
                            accData={accData}
                            rddData={rddData}
                            filterValue={filterValue}
                            setFilterValue={setFilterValue}
                            setrddData={setrddData}
                            debtorsData={debtorsData}
                            currentUser={currentUser}
                            userPermission={userPermission}
                            setActiveIndexGTRS={setActiveIndexGTRS}
                            setactiveCon={setactiveCon}
                            setLastIndex={setLastIndex}
                            EDate={EDate}
                            setIncidentId={setIncidentId}
                            setEDate={setEDate}
                            SDate={SDate}
                            Token={Token}
                            setSDate={setSDate}
                            rddReasons={rddReasons}
                            oldestDate={oldestDate}
                            latestDate={latestDate}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

RDDMain.propTypes = {
    setActiveIndexGTRS: PropTypes.func.isRequired,
    setactiveCon: PropTypes.func.isRequired,
    debtorsData: PropTypes.array.isRequired,
    rddData: PropTypes.array.isRequired,
    filterValue: PropTypes.object.isRequired,
    setFilterValue: PropTypes.func.isRequired,
    setrddData: PropTypes.func.isRequired,
    setIncidentId: PropTypes.func.isRequired,
    setLastIndex: PropTypes.func.isRequired,
    accData: PropTypes.array.isRequired,
    EDate: PropTypes.string.isRequired,
    setEDate: PropTypes.func.isRequired,
    SDate: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    AToken: PropTypes.string.isRequired,
    userPermission: PropTypes.object.isRequired,
    setSDate: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    rddReasons: PropTypes.array.isRequired,
    setrddReasons: PropTypes.func.isRequired,
    oldestDate: PropTypes.string.isRequired,
    latestDate: PropTypes.string.isRequired,
};  
