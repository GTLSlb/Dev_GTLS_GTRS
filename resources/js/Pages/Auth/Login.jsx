import React, { useEffect } from "react";
import Logo from "../../assets/pictures/Logo-upscaled.png";
import "../../../css/scroll.css";
import { LoginPage } from "gtls-npm-libraries";
import { clearMSALLocalStorage, pca } from "@/CommonFunctions";
import {
    GoogleReCaptchaProvider,
    useGoogleReCaptcha,
    GoogleReCaptcha,
} from "react-google-recaptcha-v3";

export default function Login() {
    const gtamURl = window.Laravel.gtamUrl;
    const appDomain = window.Laravel.appDomain;
    const backToHomeURL = window.Laravel.backToHomeURL;
    const googleKey = window.Laravel.googleKey;

    useEffect(() => {
        clearMSALLocalStorage();
    }, []);

    const [recaptchaValue, setRecaptchaValue] = React.useState("");
    return (
        <div className="h-screen w-full">
            <GoogleReCaptchaProvider reCaptchaKey={googleKey}>
                <LoginPage
                    appDomain={appDomain}
                    googlekey={googleKey}
                    redirectURL="/gtrs/"
                    loginURL="/loginComp"
                    gtamURl={gtamURl}
                    pca={pca}
                    canResetPassword={true}
                    handleForgotPassword={() =>
                        (window.location.href = "/forgot-password")
                    }
                    microsoftURL="/microsoftToken"
                    backToHomeURL={backToHomeURL}
                    gtlsLogo={Logo}
                    redirectUrl={window.Laravel.azureCallback}
                    isTest={window.Laravel.isTest || false}
                    recaptchaValue={recaptchaValue}
                />
                <GoogleReCaptcha
                    onVerify={(token) => {
                        setRecaptchaValue(token);
                    }}
                />
            </GoogleReCaptchaProvider>
        </div>
    );
}
