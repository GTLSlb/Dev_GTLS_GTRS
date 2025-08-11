import PropTypes from "prop-types";
import React, { forwardRef, useEffect, useRef, useState } from "react";

const TextInput = forwardRef(function TextInput(
  { className = "", isFocused = false, ...props },
  ref
) {
  const input = ref ? ref : useRef();
  const [passwordType, setPasswordType] = useState("password");

  const togglePassword = () => {
    setPasswordType(prev =>
      prev === "password" ? "text" : "password"
    );
  };

  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col items-start">
      <div className="relative">
        <input
          {...props}
          type={passwordType}
          placeholder="Password"
          className={
            "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm pr-10 " +
            className
          }
          ref={input}
        />
        <div
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          onClick={togglePassword}
        >
          {passwordType === "password" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2 8s3-4 10-4 10 4 10 4" />
              <line x1="2" y1="15" x2="22" y2="15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6l2 2-2 2M12 18l-2-2 2-2M12 12l2-2h4" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
});

// ✅ Add PropTypes
TextInput.propTypes = {
  className: PropTypes.string,
  isFocused: PropTypes.bool,
  // Spread props (like `name`, `onChange`, etc.) will be handled by the input,
  // but if you want to explicitly type any expected props, add them here:
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

TextInput.defaultProps = {
  className: "",
  isFocused: false,
};

export default TextInput;
