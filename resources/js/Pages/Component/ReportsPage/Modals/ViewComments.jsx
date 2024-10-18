import ReactModal from "react-modal";
import React, { useState, useEffect } from "react";
import "../../../../../css/scroll.css";
import moment from "moment";
import { PencilIcon } from "@heroicons/react/20/solid";
import swal from "sweetalert";
import axios from "axios";
import {
    Spinner,
} from "@nextui-org/react";
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
}) {

    const [ data, setData] = useState([]);
    const [ comment, setComment] = useState(null);
    const [ commentId, setCommentId] = useState(null);
    const [ isEditing, setIsEditing] = useState(false);
    const [ editIndx, setEditIndx] = useState(null);
    const [ isLoading, setIsLoading] = useState(false);

    useEffect(() => {
       setData(commentsData);
    },[commentsData])

    const handleSubmit = async () => {
        let formValues = {
            "CommentId": commentId,
            "ConsId": consId,
            "Comment": comment
        };
        console.log(formValues);

        try {
            setIsLoading(true);

            const response = await axios.post(`${url}Add/Delivery/Comment`, formValues, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            }).then((response) => {
                fetchData();
                setTimeout(() => {
                    setIsLoading(false);
                    setCommentId(null);
                    setComment(null);
                    setIsEditing(false);
                    setEditIndx(null);
                }, 1000);
            })
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
                <div className="flex justify-between pb-4 border-b-1 border-[#D5D5D5]">
                    <h2 className="text-2xl font-bold text-gray-500">Comments</h2>
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
                                <div className="flex flex-col gap-4 border-b-1 border-[#D5D5D5] py-3">
                                    {canEditDeliveryReportComment(currentUser) && <div className="flex pr-2">
                                        <div className="w-[95%]">
                                        {isEditing && editIndx === index
                                            ? <textarea type="text" className="border-[#D5D5D5] rounded-lg w-full" defaultValue={c?.Comment} value={comment} onChange={(e)=>{setComment(e.target.value)}} />
                                            :<p>{c?.Comment}</p>
                                        }
                                        </div>
                                        {isEditing && editIndx === index
                                            ? <div className="flex mt-auto gap-4 ml-3 text-sm h-[1.6rem]">
                                                <button onClick={()=>{setIsEditing(false); setCommentId(null); setEditIndx(null)}} disabled={isLoading} className="text-gray-500">Cancel</button>
                                                {
                                                    isLoading
                                                    ? <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                                        <Spinner color="secondary" size="sm" />
                                                      </div>
                                                    : <button className="bg-gray-800 w-16 text-white font-bold rounded" onClick={()=>handleSubmit()}>Save</button>
                                                }
                                            </div>
                                            : <PencilIcon onClick={()=>{setIsEditing(true); setCommentId(c?.CommentId);setComment(c?.Comment); setEditIndx(index)}} className="w-5 h-5 text-sky-500 ml-auto hover:cursor-pointer hover:text-sky-500/70"/>
                                        }
                                    </div>}
                                    <p className="text-gray-400 text-sm font-light">{moment(c?.AddedAt).format("DD-MM-YYYY hh:mm A")}</p>
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
