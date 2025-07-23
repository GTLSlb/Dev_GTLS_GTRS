import React from "react";
import PropTypes from "prop-types";
export const MenuIcon = ({className, }) => (
    <svg
        width="18"
        height="12"
        viewBox="0 0 18 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M0 0L10 0V2L0 2L0 0ZM0 10L10 10V12L0 12L0 10ZM0 5L12 5V7L0 7L0 5ZM13 1L11.58 2.39L15.14 6L11.58 9.61L13 11L18 6L13 1Z"
            fill="black"
        />
    </svg>
);
MenuIcon.propTypes = {
    className: PropTypes.string,
};
