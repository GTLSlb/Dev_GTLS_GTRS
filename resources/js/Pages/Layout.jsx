import { useState } from "react";
import { useEffect } from "react";
import MainSidebar from "../Components/Main-sidebar";
import MainNavbar from "../Components/Main-navbar";
import Gtrs from "@/Pages/GTRS";
import axios from "axios";
import hubConnection from "./SignalR";
import Cookies from "js-cookie";
import { Routes, Route } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import Login from "./Auth/Login";

export default function Sidebar(Boolean) {
    const [currentUser, setcurrentUser] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [user, setUser] = useState(null);
    const [allowedApplications, setAllowedApplications] = useState([]);
    const [Token, setToken] = useState(Cookies.get("access_token"));
    const [RToken, setRToken] = useState(Cookies.get("refresh_token"));

    const Invoicesurl = window.Laravel.invoiceUrl;
    const Gtamurl = window.Laravel.gtamUrl;
    const gtrsUrl = window.Laravel.gtrsUrl;
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
                if(typeof res.data == "object"){
                    setcurrentUser(res.data);
                }
            })
            .catch((error) => console.log(error));
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
    const [activeCon, setactiveCon] = useState(0);
    const [loadingGtrs, setLoadingGtrs] = useState(false);
    const [activeHeader, setactiveHeader] = useState("null");
    const [invoiceDetails, setInvoiceDetails] = useState();
    const [PODetails, setPODetails] = useState();

    const components = [
        <Gtrs
            setToken={setToken}
            sessionData={sessionData}
            user={user}
            setUser={setUser}
            setactiveCon={setactiveCon}
            setMobileMenuOpen={setMobileMenuOpen}
            mobileMenuOpen={mobileMenuOpen}
            activeHeader={activeHeader}
            loadingGtrs={loadingGtrs}
            setLoadingGtrs={setLoadingGtrs}
            currentUser={currentUser}
            AToken={Token}
            setCurrentUser={setcurrentUser}
        />,
    ];

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
                        Cookies.set(
                            "access_token",
                            parsedData.access_token,
                            {
                                domain: appDomain,
                                path: "/",
                                secure: true, // Use this if your site is served over HTTPS
                                sameSite: "Lax", // Optional, depending on your needs
                            }
                        );
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [currentUser]);

    if (!currentUser) {
        return null; // Render nothing
    } else {
        return (
            <div className="h-screen">
                {Token ? (
                    <div className="bg-smooth h-full ">
                        <Routes>
                        <Route
                            path="/gtrs/*"
                            element={
                                <Gtrs
                                setToken={setToken}
                                sessionData={sessionData}
                                user={user}
                                setUser={setUser}
                                setactiveCon={setactiveCon}
                                setMobileMenuOpen={setMobileMenuOpen}
                                mobileMenuOpen={mobileMenuOpen}
                                activeHeader={activeHeader}
                                loadingGtrs={loadingGtrs}
                                setLoadingGtrs={setLoadingGtrs}
                                currentUser={currentUser}
                                AToken={Token}
                                setCurrentUser={setcurrentUser}
                                allowedApplications = {allowedApplications}
                                setcurrentUser={setcurrentUser}
                                PODetails={PODetails}
                                setPODetails={setPODetails}
                                invoiceDetails={invoiceDetails}
                                setInvoiceDetails={setInvoiceDetails}
                                hubConnection={hubConnection}
                            />}
                        />
                            <Route
                                path="/login"
                                element={<Login />}
                            />
                            <Route
                                path="/notFound"
                                element={<NotFoundPage />}
                            />
                            <Route path="/*" element={<NotFoundPage />} />
                        </Routes>
                    </div>
                ) : (
                    <div className="min-h-screen md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center">
                            <div
                                className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce`}
                            ></div>
                            <div
                                className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce200`}
                            ></div>
                            <div
                                className={`h-5 w-5 bg-goldd rounded-full animate-bounce400`}
                            ></div>
                        </div>
                        <div className="text-dark mt-4 font-bold">
                            Please wait while we get the data for you.
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
