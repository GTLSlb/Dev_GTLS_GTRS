import React from "react";

function AnimatedLoading() {
    return (
        <div className=" min-h-screen md:pl-20 pt-16 h-full">
            <div className="fixed inset-0 flex items-center justify-center">
                <div
                    className={`h-5 w-5 bg-goldd   rounded-full mr-5 animate-bounce`}
                ></div>
                <div
                    className={`h-5 w-5 bg-goldd   rounded-full mr-5 animate-bounce200`}
                ></div>
                <div
                    className={`h-5 w-5 bg-goldd   rounded-full animate-bounce400`}
                ></div>
            </div>
        </div>
    );
}

export default AnimatedLoading;