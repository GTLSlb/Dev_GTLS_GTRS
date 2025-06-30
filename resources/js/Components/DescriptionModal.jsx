import React from "react";
import PropTypes from "prop-types";
import ReactModal from "react-modal";
import moment from "moment";

export default function DescriptionModal({
    isOpen,
    handleClose,
    setSafetyDesc,
    safetyDesc,
    safetyTypes,
}) {
    const handlePopUpClose = () => {
        setSafetyDesc(null);
        handleClose(); // Clear the input value
    };
    return (
        <ReactModal
            isOpen={isOpen}
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60"
        >
            <div className="bg-white h- sm:w-[35rem] rounded-lg shadow-lg relative p-6 ">
                <div className="flex justify-end absolute top-5 right-5">
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={handlePopUpClose}
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
                <h2 className="text-2xl font-bold mb-4">
                    Description
                    {/* <span>{id}</span> */}
                </h2>
                <div className="grid grid-cols-2 overflow-y-scroll h-[15rem] md:h-[25rem] containerscroll text-xs  gap-y-">
                    <label htmlFor="" className="font-bold pt-1">
                        Safety Type:
                    </label>
                    <p className="  pt-1">
                        {safetyTypes?.find(
                            (type) =>
                                type.SafetyTypeId === safetyDesc?.SafetyType
                        )?.SafetyTypeName || "Unknown Type"}
                    </p>
                    <label className="font-bold " htmlFor="">
                        Con No.:
                    </label>
                    <p className="  pt-1">{safetyDesc?.ConsNo}</p>
                    <label className="font-bold  pt-1" htmlFor="">
                        Main Cause:
                    </label>
                    <p className="  pt-1">{safetyDesc?.CAUSE}</p>
                    <label className="font-bold  pt-1" htmlFor="">
                        State:
                    </label>
                    <p className="  pt-1">{safetyDesc?.State}</p>
                    <label className="font-bold  pt-1" htmlFor="">
                        Explanation:
                    </label>
                    <p className="  pt-1">{safetyDesc?.Explanation}</p>
                    <label className="font-bold  pt-1" htmlFor="">
                        Resolution:
                    </label>
                    <p className="  pt-1">{safetyDesc?.Resolution}</p>
                    <label className="font-bold  pt-1" htmlFor="">
                        Reference:
                    </label>
                    <p className="  pt-1">
                        {safetyDesc?.Reference === 1
                            ? "Internal"
                            : safetyDesc?.Reference === 2
                            ? "External"
                            : ""}
                    </p>
                    <label className="font-bold pt-1" htmlFor="">
                        Occured At:
                    </label>
                    <p className="  pt-1">
                        {safetyDesc?.OccuredAt
                            ? moment(
                                  safetyDesc?.OccuredAt.replace("T", " "),
                                  "YYYY-MM-DD HH:mm:ss"
                              ).format("DD-MM-YYYY h:mm A")
                            : null}
                    </p>

                    <label className="font-bold  pt-1" htmlFor="">
                        Added By:
                    </label>
                    <p className="  pt-1">{safetyDesc?.AddedBy}</p>
                </div>
            </div>
        </ReactModal>
    );
}

DescriptionModal.propTypes = {
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
    setSafetyDesc: PropTypes.func,
    safetyDesc: PropTypes.object,
    safetyTypes: PropTypes.array,
};
