import React from "react";
import PropTypes from "prop-types";
import { clearMSALLocalStorage, pca } from "@/CommonFunctions";
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
    currentUser: PropTypes.object,
    setToken: PropTypes.func,
    setCurrentUser: PropTypes.func,
};
