import React from "react";

function AnimatedLoading() {
    return (
        <div className=" md:pl-20 pt-16 h-[70vh] flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
                <div
                    className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce`}
                ></div>
                <div
                    className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce200`}
                ></div>
                <div
                    className={`h-5 w-5 bg-goldd rounded-full animate-bounce400`}
                ></div>
            </div>
            <div className="text-dark mt-4 font-bold">
                Please wait while we get the data for you.
            </div>
        </div>
    );
}

export default AnimatedLoading;
