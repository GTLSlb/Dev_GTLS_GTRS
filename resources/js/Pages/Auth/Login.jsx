import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Logo from "../../assets/pictures/Logo-upscaled.png";
import "../../../css/scroll.css";
import { LoginPage } from "gtls-npm-libraries";
import { clearMSALLocalStorage, pca } from "@/CommonFunctions";

export default function Login() {
    const gtamURl = window.Laravel.gtamUrl;
    const appDomain = window.Laravel.appDomain;
    const backToHomeURL = window.Laravel.backToHomeURL;
    const googleKey = window.Laravel.googleKey;

    useEffect(() => {
        clearMSALLocalStorage();
    }, []);

    return (
        <div className="h-screen w-full">
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
        />
    </div>
    );
}
