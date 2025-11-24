import { pca } from "@/CommonFunctions";
import { InactiveAppPage } from "gtls-npm-libraries";
import React from "react";
import PropTypes from "prop-types";

export default function InactiveApp({ user, setToken, setUserPermissions }) {
    return (
        <InactiveAppPage
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

InactiveApp.propTypes = {
    user: PropTypes.object,
    setToken: PropTypes.func,
    setUserPermissions: PropTypes.func,
};
