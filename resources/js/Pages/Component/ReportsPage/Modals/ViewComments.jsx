import ReactModal from "react-modal";
import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback } from "react";
import "../../../../../css/scroll.css";
import moment from "moment";
import { PencilIcon } from "@heroicons/react/20/solid";
import swal from "sweetalert";
import axios from "axios";
import { handleSessionExpiration } from "@/CommonFunctions";
import { Spinner } from "@nextui-org/react";
import ComboBox from "@/Components/ComboBox";

export default function ViewComments({
    isOpen,
    url,
    handleClose,
    AToken,
    currentUser,
    commentsData,
    deliveryCommentsOptions,
    fetchDeliveryReportCommentsData,
}) {
    const [data, setData] = useState([]);
    const [comment, setComment] = useState(null);
    const [commentId, setCommentId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndx, setEditIndx] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [newCommentValue, setNewCommentValue] = useState("");
    useEffect(() => {
        setData(commentsData);
    }, [commentsData]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    // Add Comment to list not to delivery table
    function AddComment(value) {
        const inputValues = {
            CommentId: null,
            Comment: value,
            StatusId: 1,
        };
        setIsLoading(true);
        axios
            .post(`${url}Add/Comment`, inputValues, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then(() => {
                fetchDeliveryReportCommentsData();
                setShouldAddComment(false);
            })
            .catch((err) => {
                setIsLoading(false);
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
    }
    const [shouldAddComment, setShouldAddComment] = useState(false);
    const [addedComment, setAddedComment] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const onSelectComment = (e, newValue) => {
        if (
            typeof newValue?.CommentId == "string" &&
            newValue?.CommentId !== ""
        ) {
            if (e.target.textContent === `Add "${newValue?.CommentId}"`) {
                // Adding a new comment to the list not to the consignment
                setIsDisabled(true);
                setIsEditing(false);
                setNewCommentValue(newValue?.CommentId?.trim());
                setShouldAddComment(true);
                AddComment(newValue?.CommentId?.trim());
            }
        } else {
            // Adding a new comment to the consignment
            setCommentId(newValue.CommentId);
        }
    };

    const AddCommentToConsignment = async () => {
        try {
            setIsLoading(true);
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
                    await handleSessionExpiration();
                });
            } else {
                // Handle other errors
                console.error(error);
            }
            console.error(error);
        }
    };

    const addCommentToConsignmentCallback = useCallback(
        (newValue) => {
            if (!addedComment) {
                AddCommentToConsignment(newValue);
            }
        },
        [commentId, addedComment]
    );

    useEffect(() => {
        if (deliveryCommentsOptions?.length > 0 && newCommentValue !== "") {
            const newValue = deliveryCommentsOptions?.find(
                (item) => item.Comment === newCommentValue
            );
            if (newValue && newValue?.Comment === newCommentValue) {
                setCommentId(newValue?.CommentId);
                addCommentToConsignmentCallback(newValue?.CommentId);
            }
        }
    }, [deliveryCommentsOptions, newCommentValue]);

    const handleSubmit = async () => {
        if (shouldAddComment) {
            setAddedComment(false);
            AddComment(newCommentValue);
        } else {
            AddCommentToConsignment();
        }
    };

    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={isOpen}
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50"
        >
            <div className="bg-white w-[40%] rounded-lg shadow-lg py-6 px-8">
                <div className="flex justify-between pb-4 border-b-1 border-[#D5D5D5]">
                    <h2 className="text-2xl font-bold text-gray-500">
                        Comments
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={handleClose}
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
                            {data?.map((c, index) => (
                                <div key={index} className="flex flex-col gap-4 border-b-1 border-[#D5D5D5] py-3">
                                    <div className="flex pr-2">
                                        <div className="w-[95%]">
                                            {isEditing && editIndx === index ? (
                                                <ComboBox
                                                    idField={"CommentId"}
                                                    valueField={"Comment"}
                                                    onChange={onSelectComment}
                                                    inputValue={comment}
                                                    options={deliveryCommentsOptions?.filter(
                                                        (item) =>
                                                            item.CommentStatus ==
                                                            1
                                                    )}
                                                    isDisabled={false}
                                                    isMulti={false}
                                                    onKeyDown={handleKeyDown}
                                                    setInputValue={setComment}
                                                />
                                            ) : (
                                                //<textarea type="text" className="border-[#D5D5D5] rounded-lg w-full" defaultValue={c?.Comment} value={comment} onChange={(e)=>{setComment(e.target.value)}} />
                                                <p>
                                                    {editIndx === index &&
                                                    comment != null &&
                                                    isDisabled
                                                        ? comment
                                                        : c?.Comment}
                                                </p>
                                            )}
                                        </div>
                                        {isEditing && editIndx === index ? (
                                            <div className="flex mt-auto gap-4 ml-3 text-sm h-[1.6rem]">
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setIsDisabled(false);
                                                        setEditIndx(null);
                                                    }}
                                                    disabled={isLoading}
                                                    className="text-gray-500"
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
                                                        className="bg-gray-800 w-16 text-white font-bold rounded"
                                                        onClick={() =>
                                                            handleSubmit()
                                                        }
                                                    >
                                                        Save
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <PencilIcon
                                                onClick={() => {
                                                    setIsEditing(true);
                                                    setComment(c);
                                                    setCommentId(c?.CommentId);
                                                    setEditIndx(index);
                                                }}
                                                className="w-5 h-5 text-sky-500 ml-auto hover:cursor-pointer hover:text-sky-500/70"
                                            />
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm font-light">
                                        {moment(c?.AddedAt).format(
                                            "DD-MM-YYYY hh:mm A"
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 text-lg py-4">
                            <p>No comments found</p>
                        </div>
                    )}
                </div>
            </div>
        </ReactModal>
    );
}

ViewComments.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    url: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired,
    AToken: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    commentsData: PropTypes.array.isRequired,
    deliveryCommentsOptions: PropTypes.array.isRequired,
    fetchDeliveryReportCommentsData: PropTypes.func.isRequired,
};
