import React, { useEffect, useCallback } from "react";
import Logo from "../../assets/pictures/Logo-upscaled.png";
import "../../../css/scroll.css";
import { LoginPage } from "gtls-npm-libraries";
import { clearMSALLocalStorage, pca } from "@/CommonFunctions";
import {
    GoogleReCaptchaProvider,
    useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

export default function Login() {
    const gtamURl = window.Laravel.gtamUrl;
    const appDomain = window.Laravel.appDomain;
    const backToHomeURL = window.Laravel.backToHomeURL;
    const googleKey = window.Laravel.googleKey;

    useEffect(() => {
        clearMSALLocalStorage();
    }, []);

    const LoginContent = () => {
        const { executeRecaptcha } = useGoogleReCaptcha();
        const [recaptchaValue, setRecaptchaValue] = React.useState("");

        // Get the recaptcha token - ONLY when needed
        const handleReCaptchaVerify = useCallback(async () => {
            if (!executeRecaptcha) return;

            const token = await executeRecaptcha("login_page");
            setRecaptchaValue(token);
        }, [executeRecaptcha]);

        // Refresh token on mount
        useEffect(() => {
            handleReCaptchaVerify();
        }, [handleReCaptchaVerify]);

        return (
            <LoginPage
                appDomain={appDomain}
                googlekey={googleKey}
                redirectURL="/gtrs/"
                loginURL="/loginComp"
                gtamURl={gtamURl}
                pca={pca}
                recaptchaValue={recaptchaValue}
                canResetPassword={true}
                handleForgotPassword={() =>
                    (window.location.href = "/forgot-password")
                }
                microsoftURL="/microsoftToken"
                backToHomeURL={backToHomeURL}
                gtlsLogo={Logo}
                redirectUrl={window.Laravel.azureCallback}
                isTest={window.Laravel.isTest || false}
            />
        );
    };
    return (
        <div className="h-screen w-full">
            <GoogleReCaptchaProvider reCaptchaKey={googleKey}>
                <LoginContent />
            </GoogleReCaptchaProvider>
        </div>
    );
}
