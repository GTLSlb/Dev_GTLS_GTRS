import { useState } from "react";

export default function Accordion({ id, title, children, openAccordionId, setOpenAccordionId }) {
  const isOpen = id === openAccordionId;

  const toggleAccordion = () => {
    if (isOpen) {
      setOpenAccordionId(null);
    } else {
      setOpenAccordionId(id);
    }
  };

  return (
    <div className="pt-2 transition-all duration-300 ease-in-out transform hover:scale-105 border-b border-goldt ">
    <button
      type="button"
      className="w-full py-2  flex justify-between items-center text-left"
      onClick={toggleAccordion}
    >
      <span className="font-medium text-white font-bold">{title}</span>
      <svg
        className={`w-5 h-5 transition-transform text-goldt text-bold duration-300 transform ${
          isOpen ? "rotate-180" : ""
        }`}
        viewBox="0 0 64 64"
        fill="currentColor"
        height="2em"
        width="2em"
      >
         <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="bevel"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M48.936 31l-17 17-17-17"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="bevel"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M48.936 16l-17 17-17-17"
      />
      </svg>
    </button>
    {isOpen && (
      <div className="py-4 text-gray-200">{children}</div>
    )}
  </div>
  );
}