import { useContext, useState } from "react";
import React from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import swal from "sweetalert";
import axios from "axios";
import { handleSessionExpiration } from "@/CommonFunctions";
import GtrsButton from "@/Pages/Component/GtrsButton";
import { CustomContext } from "@/CommonContext";

export default function AddCommentToList({
    selectedComment,
    setSelectedComment,
    setShowAdd,
    fetchData,
}) {
    const { Token, user, url } = useContext(CustomContext);
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [object, setObject] = useState();

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    useEffect(() => {
        if (selectedComment) {
            setObject(selectedComment);
        }
    }, [selectedComment]);

    useEffect(() => {
        if (selectedComment) {
            setIsChecked(selectedComment.CommentStatus == 1 ? true : false);
        }
    }, []);

    function AddComment(e) {
        e.preventDefault();
        setIsLoading(true);
        const inputValues = {
            CommentId: object ? object.CommentId : null,
            Comment: document.getElementById("Comment").value,
            CommentStatus: isChecked ? 1 : 2,
        };
        axios
            .post(`${url}Add/Comment`, inputValues, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then(() => {
                setSelectedComment(null);
                fetchData();
                setShowAdd(false);
                setIsLoading(false);
                // AlertToast("Saved successfully", 1);
            })
            .catch((err) => {
                // AlertToast("Something went wrong", 2);

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
                    setIsLoading(false);
                }
            });
    }

    return (
        <div className="shadow bg-white p-6 rounded-lg ">
            <form onSubmit={AddComment}>
                <p className="font-bold text-lg">
                    {object ? "Edit " : "Add "} Comment
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-5 gap-y-5 items-center py-4">
                    <div className="col-span-2 flex items-center gap-x-2">
                        <label htmlFor="name" className="block w-32 ">
                            Comment:{" "}
                        </label>
                        <input
                            type="text"
                            required
                            name="name"
                            id="Comment"
                            defaultValue={object ? object.Comment : ""}
                            className="rounded w-96 bg-gray-50 border border-gray-300 h-7"
                        />
                    </div>
                    <div className=" flex items-center gap-x-2">
                        <label htmlFor="name" className="block  ">
                            Status:{" "}
                        </label>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            id="CommentStatus"
                            className="rounded text-green-500 focus:ring-green-300"
                        />
                    </div>
                </div>
                <div className="flex w-full justify-end">
                    <GtrsButton
                        disabled={isLoading}
                        name={object ? "Edit" : "Create"}
                        type={"submit"}
                    />
                </div>
            </form>
        </div>
    );
}

AddCommentToList.propTypes = {
    selectedComment: PropTypes.object,
    url: PropTypes.string,
    currentUser: PropTypes.object,
    Token: PropTypes.string,
    setSelectedComment: PropTypes.func,
    setShowAdd: PropTypes.func,
    fetchData: PropTypes.func,
};
