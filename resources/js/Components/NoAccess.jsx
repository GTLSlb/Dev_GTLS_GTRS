import React from "react";
import LottieComponent from "@/Components/LottieComponent/LottieComponent";
import Lock from "@/Components/LottieComponent/lock.json";
import { NoAccessPage } from "gtls-npm-libraries";
import { pca } from "@/CommonFunctions";

function NoAccess({ user, setToken, setUserPermissions }) {
    return (
        <NoAccessPage
            Lock={Lock}
            LottieComponent={LottieComponent}
            pca={pca}
            appUrl={window.Laravel.appUrl}
            appDomain={window.Laravel.appDomain}
            user={user}
            gtamUrl={window.Laravel.gtamUrl}
            setUser={setUserPermissions}
            setToken={setToken}
        />
    );
}

export default NoAccess;