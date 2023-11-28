import React, { useState, useEffect, useRef } from "react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import truck from "../../Components/lottie/Data/Truck.json";
import success from "../../Components/lottie/Data/Success.json";
import LottieComponent from "@/Components/lottie/LottieComponent";

const NewPassword = ({
    password,
    setPassword,
    submitPassword,
    resetLoading,
    back,
}) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        setPassword(newPassword);

        setErrorMessage("");
    }, [newPassword, confirmPassword]);

    const submit = (e) => {
        e.preventDefault();
        if (newPassword && newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        } else {
            submitPassword();
        }

        // Clear any previous error messages

        // Continue with form submission if passwords match
        // post(route('password.email'));
    };
    return (
        <div>
            {back ? (
                <div className="rounded-md flex justify-center overflow-hidden ">
                    <LottieComponent
                        animationData={success}
                        loop={false}
                        autoplay={true}
                        height={100}
                        width={100}
                    />
                </div>
            ) : (
                <form onSubmit={submit}>
                    <InputLabel
                        htmlFor="newpassword"
                        value="New password"
                        className={`   duration-500 text-sm font-medium text-white`}
                    ></InputLabel>
                    <TextInput
                        id="newpassword"
                        type="password"
                        name="newpassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputLabel
                        htmlFor="confirm-password"
                        value="Confirm password"
                        className={` mt-2  duration-500 text-sm font-medium text-white`}
                    ></InputLabel>
                    <TextInput
                        id="confirm-password"
                        type="password"
                        name="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full"
                    />

                    {errorMessage && (
                        <label className="h-10 text-red-500 font-bold">
                            {errorMessage}
                        </label>
                    )}
                    {resetLoading && (
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

                    <div className="flex items-center justify-end mt-4">
                        <PrimaryButton
                            disabled={resetLoading}
                            className="flex w-full justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Save
                        </PrimaryButton>
                    </div>
                </form>
            )}
        </div>
    );
};

export default NewPassword;
