import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import FailedCons from "./FailedCons";
import swal from "sweetalert";
import axios from "axios";
import { handleSessionExpiration } from "@/CommonFunctions";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { CustomContext } from "@/CommonContext";

export default function FailedConsMain({
    PerfData,
    filterValue,
    setFilterValue,
    accData,
    failedReasons,
    setFailedReasons,
}) {
    const { url, Token, user, userPermissions } = useContext(CustomContext);
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
                        UserId: user.UserId,
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
                        console.error(err);
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
                        userPermissions={userPermissions}
                        accData={accData}
                        PerfData={PerfData}
                        filterValue={filterValue}
                        setFilterValue={setFilterValue}
                        Token={Token}
                    />
                </div>
            )}
        </div>
    );
}

FailedConsMain.propTypes = {
    PerfData: PropTypes.array,
    filterValue: PropTypes.array,
    setFilterValue: PropTypes.func,
    accData: PropTypes.array,
    failedReasons: PropTypes.array,
    setFailedReasons: PropTypes.func,
};
