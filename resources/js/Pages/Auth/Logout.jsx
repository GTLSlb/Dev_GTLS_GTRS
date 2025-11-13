import { pca } from "@/CommonFunctions";
import { LogoutPage } from "gtls-npm-libraries";
import React from "react";
import PropTypes from "prop-types";

export default function Logout({ user, setToken, setUserPermissions }) {
    return (
        <LogoutPage
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

Logout.propTypes = {
    user: PropTypes.object,
    setToken: PropTypes.func,
    setUserPermissions: PropTypes.func,
};
