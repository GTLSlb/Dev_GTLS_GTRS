import PropTypes from "prop-types";
import React from "react";
export default function GtrsButton({
    name,
    icon,
    className,
    onClick,
    disabled,
    type,
}) {
    const defaultClasses =
        "inline-flex items-center justify-center w-[5.9rem] h-[27px] rounded-md border border-transparent bg-gray-800 px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-goldt focus:ring-offset-2";

    const mergedClasses = `${defaultClasses} ${className}`;

    return (
        <button
            type={type}
            className={mergedClasses}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className="mr-0">{icon}</span>}{" "}
            {/* Render the icon if available */}
            {name}
        </button>
    );
}

GtrsButton.propTypes = {
    name: PropTypes.string,
    icon: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(["button", "submit", "reset"]),
};