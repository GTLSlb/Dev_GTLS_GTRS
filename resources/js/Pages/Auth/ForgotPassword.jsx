import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import OTPForm from "./OTPForm";
import NewPassword from "./NewPassword";
import CryptoJS from "crypto-js";
import truck from "../../Components/lottie/Data/Truck.json";
import LottieComponent from "@/Components/lottie/LottieComponent";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
        setResetEmail(event.target.value);
    };
    const [resetEmail, setResetEmail] = useState();
    const [userId, setUserId] = useState();
    const [OTP, setOTP] = useState();
    const [emailLoading, setEmailLoading] = useState(false);
    const [OTPLoading, setOTPLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [password, setPassword] = useState();
    const [checkEmail, setCheckEmail] = useState(false);
    const [checkOTP, setCheckOTP] = useState(false);
    const [back, setBack] = useState(false);
    const [inputs, setInputs] = useState(Array(6).fill(""));
    const gtamUrl = window.Laravel.gtamUrl;
    const submit = (e) => {
        e.preventDefault();
        setEmailLoading(true);
        axios
            .get(`${gtamUrl}ResetPwd`, {
                headers: {
                    Email: resetEmail,
                },
            })
            .then((res) => {
                setEmailLoading(false);
                setCheckEmail(true);
                setUserId(res.data[0].UserID);
            })
            .catch((err) => {
                setEmailLoading(false);
                console.log(err);
            });

        // post(route('password.email'));
    };

    const submitOTP = () => {
        setOTPLoading(true);
        let concatenatedNumber = parseInt(inputs.join(""), 10);
        axios
            .get(
                `https://gtlslebs06-vm.gtls.com.au:5432/api/OTP/Verification`,
                {
                    headers: {
                        UserId: userId,
                        OTP: concatenatedNumber,
                    },
                }
            )
            .then((res) => {
                setOTPLoading(false);
                setCheckEmail(false);
                setCheckOTP(true);
                setOTP(res.data[0].OtpId);
            })
            .catch((err) => {
                setOTPLoading(false);
                console.log(err);
            });
    };

    const submitPassword = () => {
        setResetLoading(true);
        const hashedPassword = CryptoJS.SHA256(password).toString();
        axios
            .get(`https://gtlslebs06-vm.gtls.com.au:5432/api/New/Password`, {
                headers: {
                    UserId: userId,
                    OTP_Id: OTP,
                    NewPassword: hashedPassword,
                },
            })
            .then((res) => {
                setResetLoading(false);
                setBack(true);
            })
            .catch((err) => {
                setResetLoading(false);
                //setBack(true);
                console.log(err);
            });
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />
            <div className="mt-1 mb-2">
                <a
                    href="/login"
                    className="text-white hover:text-goldd flex items-center"
                >
                    <svg
                        viewBox="0 0 64 64"
                        fill="currentColor"
                        height="1.3em"
                        width="1.3em"
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinejoin="bevel"
                            strokeMiterlimit={10}
                            strokeWidth={2}
                            d="M32.936 48.936l-17-17 17-17"
                        />
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinejoin="bevel"
                            strokeMiterlimit={10}
                            strokeWidth={2}
                            d="M47.936 48.936l-17-17 17-17"
                        />
                    </svg>{" "}
                    Back to login
                </a>
            </div>
            {checkEmail == false && checkOTP == false && (
                <div className="mb-4 text-sm text-white">
                    Forgot your password? No problem. Just let us know your
                    email address and we will email you a password reset link
                    that will allow you to choose a new one.
                </div>
            )}

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}
            {checkEmail ? (
                <OTPForm
                    inputs={inputs}
                    setInputs={setInputs}
                    submitOTP={submitOTP}
                    OTPLoading={OTPLoading}
                />
            ) : checkOTP ? (
                <NewPassword
                    back={back}
                    password={password}
                    setPassword={setPassword}
                    submitPassword={submitPassword}
                    resetLoading={resetLoading}
                />
            ) : (
                <form onSubmit={submit}>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={onHandleChange}
                    />

                    <InputError message={errors.email} className="mt-2" />

                    {emailLoading ? (
                        <div className="flex justify-center rounded-md mt-4 overflow-hidden ">
                            <div className="rounded overflow-hidden">
                                <LottieComponent
                                    animationData={truck}
                                    loop={true}
                                    autoplay={true}
                                    height={45}
                                    width={45}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton
                                className="flex w-full justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                // disabled={emailLoading}
                            >
                                Email Password Reset Link
                            </PrimaryButton>
                        </div>
                    )}
                </form>
            )}

            {checkEmail && (
                <div className="p-10">
                    <button
                        className="text-goldd p-3 font-bold text-md w-full text-center rounded border-2 hover:border-goldl border-goldd"
                        onClick={submit}
                        // disabled={emailLoading}
                    >
                        Send Again
                    </button>
                </div>
            )}
        </GuestLayout>
    );
}
