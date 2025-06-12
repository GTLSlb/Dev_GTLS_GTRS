import { useEffect, useState } from "react";
import Logo from "../../assets/pictures/Logo-upscaled.png";
import { PublicClientApplication } from "@azure/msal-browser";
import "../../../css/scroll.css";
import { LoginPage } from "gtls-npm-libraries";
import MicrosoftLogo from "@/assets/icons/microsoft-logo.png";
import { clearMSALLocalStorage } from "@/CommonFunctions";

const msalConfig = {
    auth: {
        clientId: "05f70999-6ca7-4ee8-ac70-f2d136c50288",
        authority:
            "https://login.microsoftonline.com/647bf8f1-fc82-468e-b769-65fd9dacd442",
        redirectUri: window.Laravel.azureCallback,
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true, // Set this to true if dealing with IE11 or issues with sessionStorage
    },
};

const pca = new PublicClientApplication(msalConfig);

export default function Login({ }) {
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
            redirectURL="/gtrs"
            loginURL="/loginComp"
            microsoftURL="/microsoftToken"
            googlekey={googleKey}
            gtamURl={gtamURl}
            pca={pca}
            canResetPassword={true}
            handleForgotPassword={() =>
                (window.location.href = "/forgot-password")
            }
            backToHomeURL={backToHomeURL}
            gtlsLogo={Logo}
            microsoftLogo={MicrosoftLogo}
        />
    </div>
    );
}
