import React, { useState, useEffect } from "react";
import AddRDDReason from "./AddRDDReason";
import RDDreason from "./RDD";
import "../../../css/radio.css";
import { canViewRDDReasons } from "@/permissions";
import swal from "sweetalert";
import axios from "axios";
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
    AToken,
    setSDate,
    currentUser,
    rddReasons,
    setrddReasons,
    userBody,
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
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "UTC",
        };

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

    const fetchData = async () => {
        try {
            axios
                .get(`${url}RDD`, {
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
                        const updatedOldRddData = updateFieldWithData(
                            parsedData,
                            "OldRdd"
                        );
                        const updatedNewRddData = updateFieldWithData(
                            updatedOldRddData,
                            "NewRdd"
                        );
                        setrddData(updatedNewRddData || []);
                        setIsFetching(false);
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
                        }).then(function () {
                            axios
                                .post("/logoutAPI")
                                .then((response) => {
                                    if (response.status == 200) {
                                        window.location.href = "/";
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
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
    const fetchReasonData = async () => {
        try {
            axios
                .get(`${url}RddChangeReason`, {
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
                        }).then(function () {
                            axios
                                .post("/logoutAPI")
                                .then((response) => {
                                    if (response.status == 200) {
                                        window.location.href = "/";
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
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
    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    const [roleId, setRoleId] = useState(null);
    const [shouldShowList, setShouldShowList] = useState(false);

    const Roles = ["1", "3", "4", "5"];

    useEffect(() => {
        if (currentUser && currentUser.role_id) {
            setRoleId(currentUser.role_id);
        }
        setShouldShowList(
            currentUser?.role_id === 1 || currentUser?.role_id === 3
        );
    }, [currentUser]);
    const components = [
        <RDDreason
            url={url}
            accData={accData}
            rddData={rddData}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            setrddData={setrddData}
            debtorsData={debtorsData}
            currentUser={currentUser}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            AToken={AToken}
            setSDate={setSDate}
            rddReasons={rddReasons}
            oldestDate={oldestDate}
            latestDate={latestDate}
        />,
        <AddRDDReason
            rddReasons={rddReasons}
            setrddReasons={setrddReasons}
            currentUser={currentUser}
            url={url}
            AToken={AToken}
        />,
    ];

    const handleItemClick = (index) => {
        setActiveComponentIndex(index);
    };

    // Determine whether to show the list or only the first component based on the role ID
    //   const shouldShowList = currentUser?.role_id === 1 || currentUser?.role_id === 3;
    return (
        <div>
            {isFetching || isFetchingReasons ? (
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
                                RDD Report
                            </h1>
                        </div>
                    </div>
                    {/* {canViewRDDReasons(currentUser) ? (
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
                                   <div className="px-2"> {index === 0 ? "RDD Report" : "RDD Reasons"}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div></div>
                    )} */}
                    <div className="mt-0">
                        <RDDreason
                            url={url}
                            accData={accData}
                            rddData={rddData}
                            filterValue={filterValue}
                            setFilterValue={setFilterValue}
                            setrddData={setrddData}
                            debtorsData={debtorsData}
                            currentUser={currentUser}
                            setActiveIndexGTRS={setActiveIndexGTRS}
                            setactiveCon={setactiveCon}
                            setLastIndex={setLastIndex}
                            EDate={EDate}
                            setIncidentId={setIncidentId}
                            setEDate={setEDate}
                            SDate={SDate}
                            AToken={AToken}
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
