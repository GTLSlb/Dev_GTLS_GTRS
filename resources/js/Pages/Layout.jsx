import { useState, useEffect, useContext } from "react";
import Gtrs from "@/Pages/GTRS";
import axios from "axios";
import Cookies from "js-cookie";
import { Routes, Route } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import Login from "./Auth/Login";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { handleSessionExpiration } from "@/CommonFunctions";
import NoAccess from "@/Components/NoAccess";
import Logout from "@/Pages/Auth/Logout";
import { CustomContext } from "@/CommonContext";

export default function Sidebar() {
    const {
        user,
        Token,
        setUser,
        setToken,
        canAccess,
        currentUser,
        setCanAccess,
        setCurrentUser,
        allowedApplications,
        setAllowedApplications
    } = useContext(CustomContext);

    const [sidebarElements, setSidebarElements] = useState();
    const Gtamurl = window.Laravel.gtamUrl;
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
                console.log(err);
            });
    };

    useEffect(() => {
        axios
            .get("/users")
            .then((res) => {
                if (typeof res.data == "object") {
                    setCurrentUser(res.data);
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

                console.log(error)
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

                    let hasAccessToApp = parsedData?.find((app) => app.AppId == window.Laravel.appId);
                    if (!hasAccessToApp) {
                        setCanAccess(false);
                    }else{
                        setCanAccess(true);
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (currentUser) {
            getUserPermissions();
        }
    }, [currentUser]);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loadingGtrs, setLoadingGtrs] = useState(false);

    useEffect(() => {
        if (currentUser && !Token) {
            const headers = {
                UserId: currentUser.UserId,
                OwnerId: currentUser.OwnerId,
                "Content-Type": "application/x-www-form-urlencoded",
            };
            const data = {
                grant_type: "password",
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
                        Cookies.set("access_token", parsedData.access_token, {
                            domain: appDomain,
                            path: "/",
                            secure: true, // Use this if your site is served over HTTPS
                            sameSite: "Lax", // Optional, depending on your needs
                        });
                    });
                })
                .catch((err) => {
                    console.log(err);
                    if(err.response.status === 401) {
                        handleSessionExpiration();
                    }
                });
        }
    }, [currentUser]);

    if (!currentUser) {
        return null; // Render nothing
    } else {
        if(canAccess === false) {
            return <NoAccess />
        }else{
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
                                <Route
                                    path="/notFound"
                                    element={<NotFoundPage />}
                                />
                                <Route path="/logout" element={<Logout setCurrentUser={setCurrentUser} setToken={setToken} currentUser={currentUser}/>} />
                                <Route path="/no-access" element ={<NoAccess />} />
                                <Route path="/*" element={<NotFoundPage />} />
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
