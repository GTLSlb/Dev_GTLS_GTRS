import { useState } from "react";
import { useEffect } from "react";
import swal from "sweetalert";
import axios from "axios";
import { handleSessionExpiration } from '@/CommonFunctions';
import ReactModal from "react-modal";
import GtrsButton from "@/Components/GtrsButton";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function AddCommentToList({
    selectedComment,
    url,
    currentUser,
    AToken,
    setSelectedComment,
    setShowAdd,
    fetchData,
    isOpen,
}) {
    const [isChecked, setIsChecked] = useState(true);
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
            StatusId: isChecked ? 1 : 0,
        };
        axios
            .post(`${url}Add/Comment`, inputValues, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
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
                      title: 'Session Expired!',
                      text: "Please login again",
                      type: 'success',
                      icon: "info",
                      confirmButtonText: 'OK'
                    }).then(async function () {
                        await handleSessionExpiration();
                    });
                  } else {
                    // Handle other errors
                    console.log(err);
                    setIsLoading(false);
                  }
            });
    }

    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={isOpen}
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50"
        >
        <div className="mt-6 w-[90%] min-h-[20%] md:w-[75%] lg:w-[45%] bg-white p-6 rounded-lg">
            <form onSubmit={AddComment}>
                <p className="font-bold text-lg">{object ? "Edit " : "Add "} Comment</p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5 items-center py-4">
                    <div className="col-span-2 flex flex-col sm:flex-row sm:items-center gap-x-2 py-3 sm:py-7">
                        <label htmlFor="name" className="block w-full sm:w-32">
                            Comment:{" "}
                        </label>
                        <input
                            type="text"
                            required
                            name="name"
                            id="Comment"
                            defaultValue={object ? object.Comment : ""}
                            className="rounded w-full sm:w-96 bg-gray-50 border border-gray-300 h-7"
                        />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <label htmlFor="name" className="block  ">
                            Status:{" "}
                        </label>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            id="StatusId"
                            className="rounded text-green-500 focus:ring-green-300"
                        />
                    </div>
                </div>
                <div className="flex w-full justify-end gap-x-3">
                    <GtrsButton
                        disabled={isLoading}
                        name={"Cancel"}
                        type={"button"}
                        onClick={() => setShowAdd(false)}
                    />
                    <GtrsButton
                        disabled={isLoading}
                        name={object ? "Edit" : "Create"}
                        type={"submit"}
                    />
                </div>
            </form>
        </div>
        </ReactModal>
    );
}