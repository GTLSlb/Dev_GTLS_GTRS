import { useEffect } from "react";
import Cookies from "js-cookie";
import { clearMSALLocalStorage } from "@/CommonFunctions";
import { LogoutSVG } from "@/assets/svgs/LogoutSVG";
export default function Logout({ currentUser, setToken, setCurrentUser }) {
    const appUrl = window.Laravel.appUrl;

    const handleLogout = async () => {
        try {
            const credentials = {
                URL: window.Laravel.gtamUrl,
                CurrentUser: currentUser,
                SessionDomain: window.Laravel.appDomain,
            };
            const response = await axios.post("/composerLogout", credentials);
            if (response.status === 200 && response.data.status === 200) {
                localStorage.removeItem("current");
                localStorage.removeItem("user");
                const isMicrosoftLogin = Cookies.get("msal.isMicrosoftLogin");

                clearMSALLocalStorage();
                Cookies.remove("access_token");

                // Remove all items
                sessionStorage.clear();
                if (isMicrosoftLogin === "true") {
                    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${appUrl}/login`;
                    setToken(null);
                    setCurrentUser(null);
                } else {
                    window.location.href = `${appUrl}/login`;
                    setToken(null);
                    setCurrentUser(null);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (currentUser) {
            handleLogout();
        }
    }, [currentUser]);

    return (
        <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-500 to-goldd">
            <div className="py-10 px-4 bg-white flex flex-col items-center justify-center rounded-md border border-white w-[85%] sm:w-[45%] lg:w-[28%]">
                <div className="pt-10 pb-14">
                    <LogoutSVG className="fill-goldd h-8 w-8" />
                </div>
                <div className="flex items-center justify-center">
                    <div
                        className={`h-4 w-4 bg-goldd rounded-full mr-5 animate-bounce`}
                    ></div>
                    <div
                        className={`h-4 w-4 bg-goldd rounded-full mr-5 animate-bounce200`}
                    ></div>
                    <div
                        className={`h-4 w-4 bg-goldd rounded-full animate-bounce400`}
                    ></div>
                </div>
                <div className="text-dark mt-4 font-bold">
                    Please wait while we log you out.
                </div>
                <span className="text-gray-400 text-sm">
                    Thank you for using our services !
                </span>
            </div>
        </div>
    );
}
