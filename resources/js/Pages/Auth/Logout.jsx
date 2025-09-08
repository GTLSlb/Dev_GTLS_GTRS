import React from "react";
import PropTypes from "prop-types";
import { pca } from "@/CommonFunctions";
import { LogoutPage } from "gtls-npm-libraries";

export default function Logout({ user, setToken, setUser }) {
    return (
        <LogoutPage
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

Logout.propTypes = {
    user: PropTypes.object,
    setToken: PropTypes.func,
    setUser: PropTypes.func,
};
