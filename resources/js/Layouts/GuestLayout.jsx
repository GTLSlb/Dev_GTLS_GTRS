import React from "react";
import PropTypes from "prop-types";
import Logo from "../assets/pictures/Logo.png";

export default function Guest({ children }) {
    return (
        <div className=" bg-loginbackground bg-cover  ">
            <div className="bg-black w-full h-full bg-opacity-80 min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0  flex min-h-full flex-col justify-center">
                <div className=" sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-32 w-auto"
                        src={Logo}
                        alt="Your Company"
                    />
                    <h1 className="mt-9 text-center text-3xl font-bold tracking-tight text-white">
                        Sign in{" "}
                    </h1>
                </div>

                <div className="w-full sm:max-w-md mt-6 px-6 py-4  shadow-md overflow-hidden sm:rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    );
}

Guest.propTypes = {
    children: PropTypes.node.isRequired,
};
