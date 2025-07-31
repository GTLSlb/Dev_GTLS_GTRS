import React from "react";
import PropTypes from "prop-types";
import LottieComponent from "./LottieComponent/LottieComponent";
import Lock from "@/Components/LottieComponent/lock.json";
import {NoAccessPage} from 'gtls-npm-libraries';

function NoAccess() {
    return (
       <NoAccessPage LottieComponent={LottieComponent} Lock={Lock}/>
    );
}

NoAccess.propTypes = {
    currentUser: PropTypes.object,
    setToken: PropTypes.func,
    setCurrentUser: PropTypes.func,
};

export default NoAccess;
