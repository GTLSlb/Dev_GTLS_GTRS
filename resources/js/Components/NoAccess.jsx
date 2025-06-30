import React, { useState } from "react";
import PropTypes from "prop-types";
import LottieComponent from "./LottieComponent/LottieComponent";
import Lock from "@/Components/LottieComponent/lock.json";
import GtrsButton from "@/Pages/Component/GtrsButton";
import { PublicClientApplication } from "@azure/msal-browser";
import { clearMSALLocalStorage } from "@/CommonFunctions";
import Cookies from "js-cookie";
import axios from "axios";

function NoAccess({currentUser, setToken, setCurrentUser}) {
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
    const [isLoading, setIsLoading] = useState(false);
    const handleLogout = async () => {
        setIsLoading(true);
        const credentials = {
            URL: window.Laravel.gtamUrl,
            CurrentUser: currentUser,
            SessionDomain: window.Laravel.appDomain,
        };

        await pca.initialize();

        axios
            .post("/composerLogout", credentials)
            .then((response) => {
                if (response.status === 200 && response.data.status === 200) {
                    const isMicrosoftLogin = Cookies.get(
                        "msal.isMicrosoftLogin"
                    );
                    clearMSALLocalStorage();
                    Cookies.remove('access_token');
                    localStorage.removeItem("current");

                    setIsLoading(true);
                    if (isMicrosoftLogin == "true") {
                        window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${window.Laravel.appUrl}/login`;
                        setToken(null);
                        setCurrentUser(null);
                    } else {
                        window.location.href = `${window.Laravel.appUrl}/login`;
                        setToken(null);
                        setCurrentUser(null);
                    }

                }
            })
            .catch((error) => {
                setIsLoading(true);
                console.error(error);
            });
    };

    return (
        <div className="h-full w-full flex justify-center text-center items-start pt-32">
            <div>
                <div className="flex justify-center">
                    <LottieComponent
                        animationData={Lock}
                        loop={false}
                        autoplay={true}
                        height={300}
                        width={300}
                    />
                </div>
                <span className="text-5xl">403</span>
                <div className="text-3xl pt-2">Permission Denied</div>
                <div className="text-3xl ">You have no access to this page</div>

                <GtrsButton
                    name={` ${isLoading ? "Loging Out..." : "Logout"}`}
                    onClick={() => handleLogout()}
                    className="mt-6 py-4"
                />
            </div>
        </div>
    );
}

NoAccess.propTypes = {
    currentUser: PropTypes.object.isRequired,
    setToken: PropTypes.func.isRequired,
    setCurrentUser: PropTypes.func.isRequired,
};

export default NoAccess;
