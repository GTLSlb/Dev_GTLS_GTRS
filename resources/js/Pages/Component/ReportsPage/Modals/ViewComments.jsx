import ReactModal from "react-modal";
import React, { useState, useEffect } from "react";
import "../../../../../css/scroll.css";
import moment from "moment";
import { PencilIcon } from "@heroicons/react/20/solid";
import swal from "sweetalert";
import axios from "axios";
import { handleSessionExpiration } from '@/CommonFunctions';
import {
    Spinner,
} from "@nextui-org/react";

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
    const [ isLoading, setIsLoading] = useState(false);

    useEffect(() => {
       setData(commentsData);
    },[commentsData])


    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={isOpen}
            className="fixed inset-0 flex items-center justify-center"
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
                                    <div className="flex pr-2">
                                        <div className="w-[95%]">
                                        <p>{c?.Comment}</p>
                                        </div>
                                    </div>
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
