import LottieComponent from "@/Components/lottie/LottieComponent";
import React, { useState, useEffect, useRef } from "react";
import truck from "../../Components/lottie/Data/Truck.json";

const OTPForm = ({ inputs, setInputs, submitOTP, OTPLoading }) => {
    const [currentInput, setCurrentInput] = useState(0);
    const inputRefs = Array(6)
        .fill(0)
        .map(() => useRef(null));

    useEffect(() => {
        if (currentInput === 6) {
            handleSubmit();
        }
    }, [currentInput]);

    const handleSubmit = () => {
        submitOTP();
    };

    const handleChange = (index, value) => {
        // Allow only one digit in each input
        const digit = value.slice(-1); // Take the last entered character
        const newInputs = [...inputs];
        newInputs[index] = digit;
        setInputs(newInputs);

        // Move focus to the next input
        if (index <= 5 && digit !== "") {
            setCurrentInput(index + 1);

            // Use the ref to focus on the next input
            if (inputRefs[index + 1] && inputRefs[index + 1].current) {
                inputRefs[index + 1].current.focus();
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-2 justify-center  w-full items-center">
            <div className="flex flex-row gap-x-5 p-5 rounded-md bg-gray-100 bg-opacity-30">
                {inputs.map((value, index) => (
                    <input
                        key={index}
                        type="number"
                        label=""
                        required
                        value={value}
                        onFocus={() => setCurrentInput(index)}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className="hideNumberInputArrows rounded-md text-zinc-700 placeholder:text-zinc-700 w-10 text-center text-2xl font-bold h-14"
                        ref={inputRefs[index]} // Attach the ref to the input
                    />
                ))}
            </div>
            {OTPLoading && (
                <div className="rounded-md overflow-hidden ">
                    <LottieComponent
                        animationData={truck}
                        loop={true}
                        autoplay={true}
                        height={45}
                        width={45}
                    />
                </div>
            )}
        </div>
    );
};

export default OTPForm;
