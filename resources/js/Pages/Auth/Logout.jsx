import React, { useEffect } from "react";
import PropTypes from "prop-types";
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
    );
}

Logout.propTypes = {
    currentUser: PropTypes.object.isRequired,
    setToken: PropTypes.func.isRequired,
    setCurrentUser: PropTypes.func.isRequired,
};
