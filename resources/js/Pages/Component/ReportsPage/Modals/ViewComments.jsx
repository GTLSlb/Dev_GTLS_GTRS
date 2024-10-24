import ReactModal from "react-modal";
import React, { useState, useEffect } from "react";
import "../../../../../css/scroll.css";
import moment from "moment";
import { PencilIcon } from "@heroicons/react/20/solid";
import swal from "sweetalert";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import { canEditDeliveryReportComment } from "@/permissions";

export default function ViewComments({
    isOpen,
    url,
    handleClose,
    consId,
    AToken,
    fetchData,
    currentUser,
    commentsData,
    setCellLoading,
}) {
    const [data, setData] = useState([]);
    const [comment, setComment] = useState(null);
    const [commentId, setCommentId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (commentsData) {
            setData(commentsData);
            setComment(
                commentsData[0]?.Comment?.split("\n")?.reverse()?.join("\n")
            );
            setCommentId(commentsData[0]?.CommentId)
        }
    }, [commentsData]);

    const onValueChange = (e) => {
        let newValue = e.target.value;
        setComment(newValue); // Update the local state
    };

    function convertUtcToUserTimezone(utcDateString) {
        // Create a Date object from the UTC date string
        const utcDate = new Date(utcDateString);

        // Get the current user's timezone
        const targetTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const formatter = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: targetTimezone,
        });

        const convertedDate = formatter.format(utcDate);
        return convertedDate;
    }

    const handleSubmit = async () => {
        const values = comment
            .split(/\r?\n/)
            .filter((value) => value.trim() !== "");
        const reversedValues = values.reverse().join("\n");

        let formValues = {
            CommentId: commentId,
            ConsId: consId,
            Comment: reversedValues,
        };

        try {
            setIsLoading(true);
            setCellLoading(consId);
            await axios
                .post(`${url}Add/Delivery/Comment`, formValues, {
                    headers: {
                        UserId: currentUser.UserId,
                        Authorization: `Bearer ${AToken}`,
                    },
                })
                .then((response) => {
                    fetchData(setCellLoading);
                    setTimeout(() => {
                        setIsLoading(false);
                        setCommentId(null);
                        setComment(null);
                    }, 1000);

                    handleClose();
                });
        } catch (error) {
            setIsLoading(false);
            // Handle error
            if (error.response && error.response.status === 401) {
                // Handle 401 error using SweetAlert
                swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    type: "success",
                    icon: "info",
                    confirmButtonText: "OK",
                }).then(async function () {
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
                console.log(error);
            }
            console.log(error);
            setError("Error occurred while saving the data. Please try again."); // Set the error message
        }
    };

    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={isOpen}
            className="fixed inset-0 flex items-center justify-center "
            overlayClassName="fixed inset-0 bg-black bg-opacity-60"
        >
            <div className="bg-white w-[40%] rounded-lg shadow-lg py-6 px-8">
                <div className="flex justify-between pb-2 border-b-1 border-[#D5D5D5]">
                    <h2 className="text-2xl font-bold text-gray-500">
                        Comments
                        {data?.length > 0 && (
                            <p className="mt-2 text-dark text-sm font-light">
                                Added At:{" "}
                                {moment(
                                    convertUtcToUserTimezone(
                                        data[0]?.AddedAt + "Z"
                                    ),

                                    "MM/DD/YYYY, h:mm:ss A"
                                ).format("DD-MM-YYYY hh:mm A") == "Invalid date"
                                    ? ""
                                    : moment(
                                          convertUtcToUserTimezone(
                                              data[0]?.AddedAt + "Z"
                                          ),

                                          "MM/DD/YYYY, h:mm:ss A"
                                      ).format("DD-MM-YYYY hh:mm A")}
                            </p>
                        )}
                    </h2>
                    <button
                        className="text-gray-500 -mt-8 hover:text-gray-700"
                        onClick={() => {
                            setComment(null);
                            setCommentId(null);
                            handleClose();
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div>
                    {data?.length > 0 ? (
                        <div className="max-h-[21rem] overflow-auto pr-1 containerscroll">
                            <div className="flex flex-col gap-4 py-3">
                                {canEditDeliveryReportComment(currentUser) && (
                                    <div className="flex flex-col gap-4 px-1">
                                        <textarea
                                            type="text"
                                            className="border-[#D5D5D5] rounded-lg  focus:!ring-[#D5D5D5] resize-none w-full min-h-[150px]"
                                            defaultValue={comment}
                                            value={comment}
                                            onChange={onValueChange}
                                        />
                                        <div className="flex ml-auto gap-6  text-sm h-[2.4rem]">
                                            <button
                                                onClick={() => {
                                                    setComment(null);
                                                    setCommentId(null);
                                                    handleClose();
                                                }}
                                                disabled={isLoading}
                                                className="text-gray-500 hover:text-black"
                                            >
                                                Cancel
                                            </button>
                                            {isLoading ? (
                                                <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                                    <Spinner
                                                        color="secondary"
                                                        size="sm"
                                                    />
                                                </div>
                                            ) : (
                                                <button
                                                    className="bg-gray-800 w-16 text-white font-bold rounded hover:bg-gray-800/80"
                                                    onClick={() =>
                                                        handleSubmit()
                                                    }
                                                >
                                                    Save
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 text-lg pt-8 pb-5">
                            <p>No comments found</p>
                        </div>
                    )}
                </div>
            </div>
        </ReactModal>
    );
}
