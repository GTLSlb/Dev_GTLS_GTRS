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
const { getApiRequest } = useApiRequests();

export default function Sidebar() {
    const {
        Token,
        setUser,
        setToken,
        canAccess,
        currentUser,
        allowedApplications,
        setCanAccess,
        setCurrentUser,
        setAllowedApplications,
    } = useContext(CustomContext);

    const Gtamurl = window.Laravel.gtamUrl;
    const appId = window.Laravel?.appId;
    const appDomain = window.Laravel.appDomain;

    const getAppPermisions = () => {
        //user permissions
        axios
            .get(`${Gtamurl}User/AppPermissions`, {
                headers: {
                    UserId: currentUser?.UserId,
                    AppId: window.Laravel.appId,
                },
            })
            .then((res) => {
                if (typeof res.data == "object") {
                    setUser(res.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        axios
            .get("/users")
            .then((res) => {
                if (typeof res.data == "object") {
                    setCurrentUser(res.data.user);
                }
            })
            .catch((error) => {
                if(error.status == 401) {
                    //Session not found
                    handleSessionExpiration();
                }
                if(error.status == 404) {
                    //Session not found
                    handleSessionExpiration();
                }

                console.error(error)
            }
        );
    }, []);

    useEffect(() => {
        if (currentUser) {
            getAppPermisions();
        }
    }, [currentUser]);

    const getUserPermissions = () => {
        //apps user is allowed to access
        axios
            .get(`${Gtamurl}User/Permissions`, {
                headers: {
                    UserId: currentUser?.UserId,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    try {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData || []); // Use an empty array if parsedData is null
                    } catch (error) {
                        reject(error);
                    }
                });
                parsedDataPromise.then((parsedData) => {
                    setAllowedApplications(parsedData);

            const isAllowed = allowedApplications?.find(
                (item) => item.AppId == window.Laravel.appId
            );
            if (
                currentUser?.Features?.length == 0 &&
                !isAllowed &&
                window.location.pathname != "/logout"
            ) {
                setCanAccess(false);
            } else {
                setCanAccess(true);
            }

            const userAccessHeaders = {
                UserId: user.UserId,
                GTISUserId: null,
                Authorization: `Bearer ${access_token}`,
            };
            const userAccessResponse = await getApiRequest(
                `${url}User/Access`,
                userAccessHeaders
            );
            const access = userAccessResponse?.find(
                (u) => u?.UserId === user.UserId
            );
            setUserAccess(access);

            setLoading(false);
        } catch (err) {
            console.error("Error during initial data fetch:", err);
            setLoading(false);
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
    }, [Gtamurl, appId]);

   useEffect(() => {
        if (currentUser && !Token) {
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
            };
            const data = {
                UserId: currentUser.UserId,
                OwnerId: currentUser.OwnerId,
            };
            axios
                .post(`${Gtamurl}/Token`, data, {
                    headers: headers,
                })
                .then((res) => {
                    const x = JSON.stringify(res.data);
                    const parsedDataPromise = new Promise((resolve, reject) => {
                        try {
                            const parsedData = JSON.parse(x);
                            resolve(parsedData || []); // Use an empty array if parsedData is null
                        } catch (error) {
                            reject(error);
                        }
                    });
                    parsedDataPromise.then((parsedData) => {
                        setToken(parsedData.access_token);
                    });
                })
                .catch(async (err) => {
                    console.error(err);
                    await handleSessionExpiration();
                });
        }
    }, [currentUser]);

    if (!currentUser) {
        return null; // Render nothing
    } else {
        if (canAccess === false) {
            return <NoAccess />;
        } else {
            return (
                <div className="h-screen">
                    {canAccess && currentUser && Token ? (
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
                                            setCurrentUser={setCurrentUser}
                                            setToken={setToken}
                                            currentUser={currentUser}
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
