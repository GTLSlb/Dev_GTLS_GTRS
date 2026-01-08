import { useContext, useState } from "react";
import React from "react";
import { useEffect } from "react";
import Gtrs from "@/Pages/GTRS";
import axios from "axios";
import Cookies from "js-cookie";
import { Routes, Route } from "react-router-dom";
import NotFound from "./NotFoundPage";
import Login from "./Auth/Login";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { handleSessionExpiration, useApiRequests } from "@/CommonFunctions";
import NoAccess from "@/Components/NoAccess";
import Logout from "@/Pages/Auth/Logout";
import { CustomContext } from "@/CommonContext";

export default function Sidebar() {
    const {
        url,
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
    } = useContext(CustomContext);
    const [loading, setLoading] = useState(true);
    const { getApiRequest, postApiRequest } = useApiRequests();
    const gtamUrl = window.Laravel.gtamUrl;
    const appId = window.Laravel?.appId;
    const appDomain = window.Laravel.appDomain;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loadingGtrs, setLoadingGtrs] = useState(false);

    function addUserIdToFeatures(jsonData, userId, state, group, owner) {
        return {
            Features: jsonData,
            UserId: userId,
            OwnerId: owner,
            StateId: state,
            GroupId: group,
        };
    }

    const fetchUserData = async () => {
        console.log("🚀 fetchUserData started");

        console.log("gtamUrl:", gtamUrl);
        console.log("appId:", appId);
        console.log("window.Laravel:", window.Laravel);

        if (!gtamUrl || !appId) {
            console.error("❌ Missing config:", { gtamUrl, appId });
            setLoading(false);
            setCanAccess(false);
            return;
        }

        try {
            console.log("➡️ Fetching user data...");
            const userResponse = await getApiRequest(`/users`, {});
            console.log("✅ User response:", userResponse);

            const { user, token, jwt_token } = userResponse;
            console.log("User:", user);
            console.log("Token exists:", !!token);
            console.log("JWT exists:", !!jwt_token);

            setUser(user);
            setToken(token);

            console.log(
                "🍪 Setting cookie for domain:",
                window.Laravel.appDomain
            );
            Cookies.set("jwt_token", jwt_token, {
                secure: true,
                sameSite: "Lax",
                domain: window.Laravel.appDomain,
            });

            const appPermissionsHeaders = {
                UserId: user.UserId,
                AppId: appId,
                Authorization: `Bearer ${token}`,
            };

            console.log(
                "➡️ Fetching app permissions...",
                appPermissionsHeaders
            );
            const appPermissionsResponse = await getApiRequest(
                `${gtamUrl}User/AppPermissions`,
                appPermissionsHeaders
            );
            console.log("✅ App permissions response:", appPermissionsResponse);

            setUserPermissions(appPermissionsResponse.Features);

            const userPermissionsHeaders = {
                UserId: user.UserId,
                Authorization: `Bearer ${token}`,
            };

            console.log(
                "➡️ Fetching user permissions...",
                userPermissionsHeaders
            );
            const userPermissionsResponse = await getApiRequest(
                `${gtamUrl}User/Permissions`,
                userPermissionsHeaders
            );
            console.log(
                "✅ User permissions response:",
                userPermissionsResponse
            );

            setAllowedApplications(userPermissionsResponse);

            console.log("Allowed apps:", userPermissionsResponse);

            const isAllowed = userPermissionsResponse?.find(
                (item) => item.AppId == window.Laravel.appId
            );

            console.log("Is allowed:", isAllowed);
            console.log("userPermissions:", userPermissions);

            if (
                userPermissions?.length == 0 &&
                !isAllowed &&
                window.location.pathname != "/logout"
            ) {
                console.warn("🚫 Access denied");
                setCanAccess(false);
            } else {
                console.log("✅ Access granted");
                setCanAccess(true);
            }

            setLoading(false);
            console.log("🏁 fetchUserData finished");
        } catch (err) {
            console.error("🔥 Error during initial data fetch:", err);

            if (err?.response) {
                console.error("Status:", err.response.status);
                console.error("Response data:", err.response.data);
            }

            setLoading(false);
            setCanAccess(false);

            if (err.response?.status === 401 || err.status === 401) {
                swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    icon: "info",
                    confirmButtonText: "OK",
                }).then(async () => {
                    await handleSessionExpiration();
                });
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [gtamUrl, appId]);

    if (!userPermissions) {
        return null; // Render nothing
    } else {
        if (canAccess === false) {
            return <NoAccess />;
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
                                            setMobileMenuOpen={
                                                setMobileMenuOpen
                                            }
                                            mobileMenuOpen={mobileMenuOpen}
                                            loadingGtrs={loadingGtrs}
                                            setLoadingGtrs={setLoadingGtrs}
                                        />
                                    }
                                />
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/notFound"
                                    element={<NotFound />}
                                />
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
                                    element={<NoAccess />}
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
}
