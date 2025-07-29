import LottieComponent from "@/Components/LottieComponent/LottieComponent";
import Lock from "@/Components/LottieComponent/lock.json";
import { NoAccessPage } from "gtls-npm-libraries";
import React from "react";

function NoAccess() {
    return (
       <NoAccessPage Lock={Lock} LottieComponent={LottieComponent}/>
    );
}

export default NoAccess;
