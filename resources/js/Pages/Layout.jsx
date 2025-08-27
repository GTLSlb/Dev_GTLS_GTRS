import React, { useContext, useState } from "react";
import { useEffect } from "react";
import Gtrs from "@/Pages/GTRS";
import { Routes, Route } from "react-router-dom";
import NotFound from "./NotFoundPage";
import Login from "./Auth/Login";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { useApiRequests } from "@/CommonFunctions";
import NoAccess from "@/Components/NoAccess";
import Logout from "@/Pages/Auth/Logout";
import { CustomContext } from "@/CommonContext";
import swal from "sweetalert";

export default function Sidebar() {
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
    } = useContext(CustomContext);
    const { getApiRequest, postApiRequest } = useApiRequests();
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
            const { user } = userResponse;

            setUser(user);

            const token_headers = {
                "Content-Type": "application/x-www-form-urlencoded",
            };
            const token_data = {
                UserId: user.UserId,
                OwnerId: user.OwnerId,
            };

            const tokenResponse = await postApiRequest(
                `${gtamUrl}/Token`,
                token_headers,
                token_data
            );

            const { access_token } = tokenResponse;
            setToken(access_token);

            const appPermissionsHeaders = {
                UserId: user.UserId,
                AppId: appId,
                Authorization: `Bearer ${access_token}`,
            };
            const appPermissionsResponse = await getApiRequest(
                `${gtamUrl}User/AppPermissions`,
                appPermissionsHeaders
            );

            setUserPermissions(appPermissionsResponse.Features);

            const userPermissionsHeaders = {
                UserId: user.UserId,
                Authorization: `Bearer ${access_token}`,
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
                }).then(() => {});
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
