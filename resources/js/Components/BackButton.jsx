import React from "react";
import PropTypes from "prop-types";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
function BackButton({ onClickFunction, buttonText }) {
    return (
        <button
            type="button"
            className="h-full  rounded-md border border-transparent bg-gray-800 px-5 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-0"
            onClick={() => onClickFunction()}
        >
            <div className="flex justify-center items-center ml-[-7px]">
                <ChevronLeftIcon className="h-5 w-5" />
                <span> {buttonText ? buttonText : "Back"}</span>{" "}
            </div>
        </button>
    );
}

BackButton.propTypes = {
    onClickFunction: PropTypes.func,
    buttonText: PropTypes.string,
};

export default BackButton;
