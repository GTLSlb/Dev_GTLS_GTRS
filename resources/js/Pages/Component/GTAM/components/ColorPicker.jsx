import React, { useState } from "react";
import { useEffect } from "react";

function ColorPicker({setColor,color}) {
    const [currentColor, setCurrentColor] = useState(color);
    const [iconColor, setIconColor] = useState("text-white");
    const [isOpen, setIsOpen] = useState(false);
    useEffect(()=>{
        setCurrentColor(color)
    },[color])

    const colors = [
        "gray",
        "red",
        "teal",
        "sky",
        "amber",
        "yellow",
        "green",
        "blue",
        "indigo",
        "purple",
        "pink",
    ];
    const variants = [100, 200, 300, 400, 500, 600, 700, 800, 900];

    const initColor = () => {
        setCurrentColor("red-800");
        setIconWhite();
    };

    const setIconWhite = () => {
        setIconColor("text-white");
    };

    const setIconBlack = () => {
        setIconColor("text-black");
    };

    const selectColor = (color, variant) => {
        setColor(`${color}-${variant}`)
        setCurrentColor(`${color}-${variant}`);
        if (variant < 500) {
            setIconBlack();
        } else {
            setIconWhite();
        }
        setIsOpen(false);
    };

    return (
        <div className="  ">
            <div className="flex flex-col md:flex-row md:items-center gap-x-10 gap-y-5">
                <label
                    htmlFor="color-picker"
                    className="block mb-1 font-semibold w-28"
                >
                    Pr-Color:
                </label>
                <div className="flex flex-row relative">
                    <div>
                        <div
                            className="bg-gray-100 bg-gray-200 bg-gray-300 bg-gray-400 bg-gray-500 bg-gray-600 bg-gray-700 bg-gray-800 bg-gray-900
                                bg-red-100 bg-red-200 bg-red-300 bg-red-400 bg-red-500 bg-red-600 bg-red-700 bg-red-800 bg-red-900
                                bg-yellow-100 bg-yellow-200 bg-yellow-300 bg-yellow-400 bg-yellow-500 bg-yellow-600 bg-yellow-700 bg-yellow-800 bg-yellow-900
                                bg-green-100 bg-green-200 bg-green-300 bg-green-400 bg-green-500 bg-green-600 bg-green-700 bg-green-800 bg-green-900
                                bg-teal-100 bg-teal-200 bg-teal-300 bg-teal-400 bg-teal-500 bg-teal-600 bg-teal-700 bg-teal-800 bg-teal-900
                                bg-sky-100 bg-sky-200 bg-sky-300 bg-sky-400 bg-sky-500 bg-sky-600 bg-sky-700 bg-sky-800 bg-sky-900
                                bg-amber-100 bg-amber-200 bg-amber-300 bg-amber-400 bg-amber-500 bg-amber-600 bg-amber-700 bg-amber-800 bg-amber-900
                                bg-blue-100 bg-blue-200 bg-blue-300 bg-blue-400 bg-blue-500 bg-blue-600 bg-blue-700 bg-blue-800 bg-blue-900
                                bg-indigo-100 bg-indigo-200 bg-indigo-300 bg-indigo-400 bg-indigo-500 bg-indigo-600 bg-indigo-700 bg-indigo-800 bg-indigo-900
                                bg-purple-100 bg-purple-200 bg-purple-300 bg-purple-400 bg-purple-500 bg-purple-600 bg-purple-700 bg-purple-800 bg-purple-900
                                bg-pink-100 bg-pink-200 bg-pink-300 bg-pink-400 bg-pink-500 bg-pink-600 bg-pink-700 bg-pink-800 bg-pink-900 hidden"
                        ></div>
                    </div>

                    <input
                        id="color-picker"
                        className="border border-gray-400 p-2 rounded-lg"
                        value={currentColor}
                        readOnly
                    />
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className={`cursor-pointer rounded-full ml-3 my-auto h-10 w-10 flex bg-${currentColor}`}
                    >
                        {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 mx-auto my-auto ${iconColor}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokelinecap="round"
                                strokelinejoin="round"
                                strokeWidth="2"
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                            />
                        </svg> */}
                        <svg
                            // xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 mx-auto my-auto ${iconColor}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                fill="currentColor"
                                d="M20.385 2.879a3 3 0 00-4.243 0L14.02 5l-.707-.708a1 1 0 10-1.414 1.415l5.657 5.656A1 1 0 0018.97 9.95l-.707-.707 2.122-2.122a3 3 0 000-4.242z"
                            />
                            <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M11.93 7.091L4.152 14.87a3.001 3.001 0 00-.587 3.415L2 19.85l1.414 1.415 1.565-1.566a3.001 3.001 0 003.415-.586l7.778-7.778L11.93 7.09zm1.414 4.243L11.93 9.92l-6.364 6.364a1 1 0 001.414 1.414l6.364-6.364z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    {/* {isOpen && (
            <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-10" style={{ zIndex: 50 }}></div>
          )} */}
                    {isOpen && (
                        <div className="border border-gray-300 origin-top-right absolute left-0 top-full mt-2 rounded-md shadow-lg">
                            <div className="rounded-md bg-white shadow-xs p-2">
                                <div className="flex">
                                    {colors.map((color) => (
                                        <div key={color}>
                                            {variants.map((variant) => (
                                                <div
                                                    key={`${color}-${variant}`}
                                                    onClick={() =>{
                                                        selectColor(
                                                            color,
                                                            variant
                                                        )}
                                                    }
                                                    className={`cursor-pointer w-6 h-6 rounded-full mx-1 my-1 bg-${color}-${variant}`}
                                                ></div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ColorPicker;
