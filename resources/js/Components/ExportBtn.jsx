import React from "react";
import PropTypes from "prop-types";

function ExportBtn({ handleDownloadExcel }) {
    return (
        <button
            onClick={handleDownloadExcel}
            className="text-white bg-dark hover:bg-dark  font-medium rounded-lg text-sm px-5 py-2 text-center mr-2 dark:bg-gray-800 dark:hover:bg-gray-600 dark:focus:ring-blue-800"
        >
            Export
        </button>
    );
}
ExportBtn.propTypes = {
    handleDownloadExcel: PropTypes.func.isRequired,
};

export default ExportBtn;
