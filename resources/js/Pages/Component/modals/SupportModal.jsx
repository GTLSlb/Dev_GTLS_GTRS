import ReactModal from "react-modal";
import React from "react";
import PropTypes from "prop-types";
import SupportForm from "../SupportComp/SupportForm";
import "../../../../css/scroll.css";

export default function SupportModal({ isOpen, handleClose }) {
    const handlePopUpClose = () => {
        handleClose(); // Clear the input value
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={handlePopUpClose}
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50"
        >
            <div className="bg-white w-96 rounded-lg shadow-lg p-6  h-[30rem]">
                <div className="flex justify-end">
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
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Support application form
                </h2>
                <div className="h-[24rem] overflow-y-scroll containerscroll">
                    <SupportForm />
                </div>
            </div>
        </ReactModal>
    );
}

SupportModal.propTypes = {
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
};
