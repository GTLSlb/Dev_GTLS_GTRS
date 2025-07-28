import PropTypes from "prop-types";
import React, { forwardRef, useEffect, useRef } from "react";

const TextInput = forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, ...props },
    ref
) {
    const input = ref ? ref : useRef();
    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div className="flex flex-col items-start">
            <input
                {...props}
                type={type}
                className={
                    "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm " +
                    className
                }
                ref={input}
            />
        </div>
    );
});

// Define PropTypes
TextInput.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    isFocused: PropTypes.bool,
};

// Optional: Define defaultProps (for clarity and documentation)
TextInput.defaultProps = {
    type: "text",
    className: "",
    isFocused: false,
};

export default TextInput;
