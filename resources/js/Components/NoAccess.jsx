import React from "react";
import { pca } from "@/CommonFunctions";
import { NoAccessPage } from "gtls-npm-libraries";
import Lock from "@/Components/LottieComponent/lock.json";
import LottieComponent from "@/Components/LottieComponent/LottieComponent";

function NoAccess({ user, setToken, setUser }) {
    return (
        <NoAccessPage
            Lock={Lock}
            LottieComponent={LottieComponent}
            pca={pca}
            appUrl={window.Laravel.appUrl}
            appDomain={window.Laravel.appDomain}
            user={user}
            gtamUrl={window.Laravel.gtamUrl}
            setUser={setUser}
            setToken={setToken}
        />
    );
}

export default NoAccess;
