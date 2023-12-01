import React from "react";
import LottieComponent from "./LottieComponent/LottieComponent";
import Lock from "@/Components/LottieComponent/lock.json";

function NoAccess() {
    return (
        <div className="h-screen w-screen flex justify-center text-center items-start pt-32">
            <div>
                <LottieComponent
                    animationData={Lock}
                    loop={false}
                    autoplay={true}
                    height={400}
                    width={400}
                />
                <span className="text-5xl">403</span>
                <div className="text-3xl pt-2">Permission Denied</div>
                <div className="text-3xl ">You have no access to this page</div>
            </div>
        </div>
    );
}

export default NoAccess;
