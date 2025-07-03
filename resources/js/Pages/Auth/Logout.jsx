import { useEffect } from "react";
import Cookies from "js-cookie";
import { clearMSALLocalStorage, pca } from "@/CommonFunctions";
import { LogoutSVG } from "@/assets/svgs/LogoutSVG";
import axios from "axios";
import { LogoutPage } from "gtls-npm-libraries";
export default function Logout({ currentUser, setToken, setCurrentUser }) {
    return (
        <LogoutPage
            clearMSALLocalStorage={clearMSALLocalStorage}
            pca={pca}
            appUrl={window.Laravel.appUrl}
            appDomain={window.Laravel.appDomain}
            currentUser={currentUser}
            gtamUrl={window.Laravel.gtamUrl}
            setCurrentUser={setCurrentUser}
            setToken={setToken}
        />
    )
}
