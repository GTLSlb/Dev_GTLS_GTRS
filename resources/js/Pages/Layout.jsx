import React, { useContext, useState } from "react";
import { useEffect } from "react";
import Gtrs from "@/Pages/GTRS";
import { Routes, Route } from "react-router-dom";
import NotFound from "./NotFoundPage";
import Login from "./Auth/Login";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { useApiRequests, handleSessionExpiration } from "@/CommonFunctions";
import NoAccess from "@/Components/NoAccess";
import Logout from "@/Pages/Auth/Logout";
import { CustomContext } from "@/CommonContext";
import swal from "sweetalert";
import InactiveApp from "@/Pages/Auth/InactiveApp";
import { useNavigate } from "react-router-dom";
export default function Sidebar() {
    const navigate = useNavigate();
    const {
        Token,
        user,
        setUser,
        setToken,
        canAccess,
        userPermissions,
        allowedApplications,
        setCanAccess,
        setUserPermissions,
        setAllowedApplications,
        setIsAppInactive,
    } = useContext(CustomContext);
    const { getApiRequest } = useApiRequests();
    const gtamUrl = window.Laravel.gtamUrl;
    const appId = window.Laravel?.appId;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loadingGtrs, setLoadingGtrs] = useState(false);

    const fetchUserData = async () => {
        if (!gtamUrl || !appId) {
            console.error(
                "Error: window.Laravel.gtamUrl or window.Laravel.appId is undefined. Environment not properly configured."
            );
            setCanAccess(false);
            return;
        }

        try {
            const userResponse = await getApiRequest(`/users`, {});
            const { user, token, jwt_token } = userResponse;

            setToken(token);
            setUser(user);

            // If jwt_token is not set, set it
            const jwt_cookie = Cookies.get("jwt_token");
            if(!jwt_cookie){
                Cookies.set("jwt_token", jwt_token, {
                secure: true,
                sameSite: "Lax",
                domain: window.Laravel.appDomain,
            });
            }

            let isAppInactive = false;
            const appPermissionsHeaders = {
                UserId: user.UserId,
                AppId: appId,
                Authorization: `Bearer ${token}`,
            };
            try {
                const appPermissionsResponse = await getApiRequest(
                    `${gtamUrl}User/AppPermissions`,
                    appPermissionsHeaders
                );

                setUserPermissions(appPermissionsResponse.Features);
            } catch (err) {
                if (err.status == 403) {
                    // Inactive application
                    isAppInactive = true;
                    navigate("/inactive-app");
                }
            }

            if (!isAppInactive) {
                const userPermissionsHeaders = {
                    UserId: user.UserId,
                    Authorization: `Bearer ${token}`,
                };
                const userPermissionsResponse = await getApiRequest(
                    `${gtamUrl}User/Permissions`,
                    userPermissionsHeaders
                );
                setAllowedApplications(userPermissionsResponse);

                const isAllowed = allowedApplications?.find(
                    (item) => item.AppId == window.Laravel.appId
                );
                if (
                    userPermissions?.length == 0 &&
                    !isAllowed &&
                    window.location.pathname != "/logout"
                ) {
                    setCanAccess(false);
                } else {
                    setCanAccess(true);
                }
            }
        } catch (err) {
            console.error("Error during initial data fetch:", err);
            setCanAccess(false);
            if (err.response && err.response.status === 401) {
                swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    type: "info",
                    icon: "info",
                    confirmButtonText: "OK",
                }).then(async function () {
                    await handleSessionExpiration();
                });
            }
            if (err.response && err.response.status === 403) {
                // App is inactive
                setIsAppInactive(true);
                window.location.href = "/inactive-app";
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [gtamUrl, appId]);

    if (canAccess === false) {
        return <NoAccess setToken={setToken} setUser={setUser} user={user} />;
    } else {
        return (
            <div className="h-screen">
                {Token ? (
                    <div className="bg-smooth h-full ">
                        <Routes>
                            <Route
                                path="/*"
                                element={
                                    <Gtrs
                                        setMobileMenuOpen={setMobileMenuOpen}
                                        mobileMenuOpen={mobileMenuOpen}
                                        loadingGtrs={loadingGtrs}
                                        setLoadingGtrs={setLoadingGtrs}
                                    />
                                }
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/notFound" element={<NotFound />} />
                            <Route
                                path="/logout"
                                element={
                                    <Logout
                                        user={user}
                                        setToken={setToken}
                                        setUser={setUser}
                                    />
                                }
                            />
                            <Route
                                path="/no-access"
                                element={
                                    <NoAccess
                                        setToken={setToken}
                                        setUser={setUser}
                                        user={user}
                                    />
                                }
                            />
                            <Route
                                path="/inactive-app"
                                element={
                                    <InactiveApp
                                        user={user}
                                        setToken={setToken}
                                        setUser={setUser}
                                    />
                                }
                            />
                            <Route path="/*" element={<NotFound />} />
                        </Routes>
                    </div>
                ) : (
                    <AnimatedLoading />
                )}
            </div>
        );
    }
}
