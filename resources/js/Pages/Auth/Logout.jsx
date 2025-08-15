import React from "react";
import PropTypes from "prop-types";
import { clearMSALLocalStorage, pca } from "@/CommonFunctions";
import { LogoutPage } from "gtls-npm-libraries";
export default function Logout({ user, setToken, setUser }) {
    return (
        <LogoutPage
            clearMSALLocalStorage={clearMSALLocalStorage}
            pca={pca}
            appUrl={window.Laravel.appUrl}
            appDomain={window.Laravel.appDomain}
            currentUser={user}
            gtamUrl={window.Laravel.gtamUrl}
            setCurrentUser={setUser}
            setToken={setToken}
        />
    );
}

Logout.propTypes = {
    user: PropTypes.object,
    setToken: PropTypes.func,
    setUser: PropTypes.func,
};
