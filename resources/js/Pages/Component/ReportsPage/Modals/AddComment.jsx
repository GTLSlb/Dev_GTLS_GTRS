import ReactModal from "react-modal";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../../../../css/scroll.css";
import swal from "sweetalert";
import { Spinner } from "@nextui-org/react";

export default function AddComment({
    isOpen,
    url,
    handleClose,
    consId,
    AToken,
    fetchData,
    currentUser,
    commentsData,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        CommentId: null,
        ConsId: consId,
        Comment: "",
    });

    const handlePopUpClose = () => {
        setError(null);
        // Clear the error message
        setFormValues({
            CommentId: null,
            ConsId: null,
            Comment: "",
        });
        handleClose(); // Clear the input value
    };
    useEffect(() => {
        if (consId) {
            setFormValues({
                CommentId: null,
                ConsId: consId,
                Comment: "",
            });
        }
    }, [consId]);

    const [error, setError] = useState(null);
    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            Comment: e.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        if (formValues?.Comment === "" || formValues?.Comment === null) {
            setError("Comment cannot be empty");
            return;
        } else {
            try {
                setIsLoading(true);
                await axios
                    .post(`${url}Add/Delivery/Comment`, formValues, {
                        headers: {
                            UserId: currentUser.UserId,
                            Authorization: `Bearer ${AToken}`,
                        },
                    })
                    .then((response) => {
                        console.log(response);

                        fetchData();
                        setTimeout(() => {
                            handleClose();
                            setIsLoading(false);
                        }, 1000);
                    })
                    .catch((error) => {
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
                        setError(
                            "Error occurred while saving the data. Please try again."
                        ); // Set the error message
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
                setError(
                    "Error occurred while saving the data. Please try again."
                ); // Set the error message
            }
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
                <div className="flex justify-between border-b-1 border-[#D5D5D5]">
                    <h2 className="text-2xl font-bold mb-4">Add New Comment</h2>
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
                <form onSubmit={handleSubmit}>
                    <div className="pr-2">
                        {/* Error message */}
                        {error && (
                            <div className="text-red-500 my-2">{error}</div>
                        )}
                        <div className="w-full border border-black/30 rounded my-4">
                            <textarea
                                id="NewComment"
                                name="Name"
                                className="w-full h-full border-none containerscroll"
                                placeholder="Enter your comment"
                                defaultValue={formValues.Comment?.Name}
                                value={formValues.Comment?.Name}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-10 text-sm">
                            <button
                                type="button"
                                disabled={isLoading}
                                className="w-20 text-gray-400 p-2"
                                onClick={() => handlePopUpClose()}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gray-800 w-[6.5rem] text-white font-bold p-2 rounded hover:bg-gray-800/80"
                            >
                                {isLoading ? (
                                    <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                        <Spinner color="default" size="sm" />
                                    </div>
                                ) : (
                                    "Add"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
}
