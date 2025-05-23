import { useEffect, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { PublicClientApplication } from "@azure/msal-browser";
import ReCAPTCHA from "react-google-recaptcha";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "../../../css/scroll.css";
import axios from "axios";
import CryptoJS from "crypto-js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const msalConfig = {
    auth: {
        clientId: "05f70999-6ca7-4ee8-ac70-f2d136c50288",
        authority:
            "https://login.microsoftonline.com/647bf8f1-fc82-468e-b769-65fd9dacd442",
        redirectUri: "http://localhost:8000/Main", // replace with your own redirect URI
    },
};

const scopes = ["user.read"]; // replace with the scopes you need

const pca = new PublicClientApplication(msalConfig);

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptchaValue, setRecaptchaValue] = useState(false);
    const [passwordType, setPasswordType] = useState("password");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text");
            return;
        }
        setPasswordType("password");
    };

    const handleRecaptchaChange = (value) => {
        setRecaptchaValue(true);
    };

    const handleRecaptchaExpired = () => {
        setRecaptchaValue(false);
    };

    const handleNextClick = async (e) => {
        // e.preventDefault();
        setShowPassword(true);
    };
    const handleBackClick = async (e) => {
        // e.preventDefault();
        setShowPassword(false);
    };
    useEffect(() => {
        pca.handleRedirectPromise().then(() => {
            // handle redirect response if any
        });
    }, []);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const handleOnChange = (event) => {
        setEmail(event.target.value);
        setData(
            event.target.name,
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value
        );
    };

    const handleOnChangePassword = (event) => {
        setData(
            event.target.name,
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value
        );
        setPassword(event.target.value);
    };
    const gtamURl = window.Laravel.gtamUrl;
    const submit = (e) => {
        setLoading(true);
        e.preventDefault();
        setErrorMessage("");
        const hashedPassword = CryptoJS.SHA256(password).toString();
        axios
            .get(`${gtamURl}Login`, {
                headers: {
                    Email: email,
                    Password: hashedPassword,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });

                const credentials = {
                    Email: email,
                    Password: hashedPassword,
                };
                axios
                    .post("/loginapi", credentials)
                    .then((response) => {
                        if (response.status == 200) {
                            window.location.href = "/main";
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        setErrorMessage(error.response.data.Message);
                    });
            })
            .catch((err) => {
                setLoading(false);
                setErrorMessage(err.response.data.Message);
            });
    };
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent the default form submission behavior
            handleNextClick();
        }
    };

    return (
        <div className="bg-black">
            <GuestLayout>
                <Head title="Sign in" />
                <div className="flex  flex-col justify-center items-center ">
                    <div className=" w-full shadow-md rounded px-8 pt-6 pb-8 mb-4 relative">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="mt-1">
                                <a
                                    href="/"
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
                                    Back to home
                                </a>
                            </div>
                            <div className="relative">
                                <InputLabel
                                    htmlFor="email"
                                    value="Email"
                                    className={`  top-0 left-0  duration-500 text-sm font-medium text-white`}
                                >
                                    Email
                                </InputLabel>

                                <div className=" ">
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onKeyDown={handleKeyPress}
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={handleOnChange}
                                        className={`  appearance-none mb-2 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-all duration-500`}
                                        placeholder="Email"
                                    />

                                    <div className="relative">
                                        <InputLabel
                                            htmlFor="password"
                                            value="Password"
                                            className={`   duration-500 text-sm font-medium text-white`}
                                        ></InputLabel>
                                        <input
                                            type={passwordType}
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            value={data.password}
                                            autoComplete="current-password"
                                            onChange={handleOnChangePassword}
                                            className={`appearance-none w-full border mb-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-all duration-500`}
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 top-3 flex items-center pr-3 cursor-pointer"
                                            onClick={togglePassword}
                                        >
                                            {passwordType === "password" ? (
                                                <EyeSlashIcon
                                                    className={` w-4 h-4`}
                                                />
                                            ) : (
                                                <EyeIcon
                                                    className={` w-4 h-4`}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end mt-0">
                                        {canResetPassword && (
                                            <Link
                                                onClick={() =>
                                                    (window.location.href =
                                                        "/forgot-password")
                                                }
                                                className="underline text-sm text-goldd dark:text-smooth hover:text-gray-900 dark:hover:text-goldd rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                            >
                                                Forgot your password?
                                            </Link>
                                        )}
                                    </div>
                                    {errorMessage && (
                                        <div className="py-2 text-red-600">
                                            {errorMessage}
                                        </div>
                                    )}
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>
                                {/* <a className="text-white" href="/auth/azure">
                                    Login with Microsoft Azure
                                </a> */}
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className={`flex w-full justify-center ${
                                        loading || !recaptchaValue
                                            ? "bg-gray-600 cursor-not-allowed text-white"
                                            : "bg-goldd hover:bg-goldt text-dark"
                                    } font-bold rounded-md border border-transparent bg-goldd py-2 px-4 text-sm font-medium  shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                    disabled={loading || !recaptchaValue}
                                    type="submit"
                                >
                                    {loading ? (
                                        <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </div>
                        </form>
                        <ReCAPTCHA
                            sitekey="6LexGKoqAAAAAAGChsMvFBOScJ71oRS88RkGgVm3"
                            onChange={handleRecaptchaChange}
                            onExpired={handleRecaptchaExpired}
                            className="mt-4 flex justify-center "
                            size="normal" // Set the desired size here: "compact", "normal", or "invisible"
                            render="explicit" // Use "explicit" rendering
                            theme="dark" // Set the desired theme: "light" or "dark"
                            style={{ transform: "scale(0.8)" }} // Use CSS transform to adjust the size
                        />
                    </div>
                </div>
            </GuestLayout>
        </div>
    );
}
