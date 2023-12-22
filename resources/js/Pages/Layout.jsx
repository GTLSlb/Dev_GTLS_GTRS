import { useState } from "react";
import { useEffect } from "react";
import MainSidebar from "../Components/Main-sidebar";
import MainNavbar from "../Components/Main-navbar";
import Gtrs from "@/Pages/GTRS";
import axios from "axios";
import hubConnection from "./SignalR";
import NoAccess from "@/Components/NoAccess";
import Cookies from "js-cookie";
// import AllRoutes from "./RoutesPage";

export default function Sidebar(Boolean) {
    const [currentUser, setcurrentUser] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [user, setUser] = useState({});
    const [allowedApplications, setAllowedApplications] = useState([]);
    const [Token, setToken] = useState(Cookies.get("gtrs_access_token"));
    const [RToken, setRToken] = useState(Cookies.get("gtrs_refresh_token"));

    const Invoicesurl = window.Laravel.invoiceUrl;
    const Gtamurl = window.Laravel.gtamUrl;

    const getAppPermisions = () => {
        axios
            .get("/users")
            .then((res) => {
                setcurrentUser(res.data);
                axios
                    .get(`${Gtamurl}User/AppPermissions`, {
                        headers: {
                            UserId: res.data?.UserId,
                            AppId: window.Laravel.appId,
                        },
                    })
                    .then((res) => {
                        setUser(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getAppPermisions();
    }, []);

    const getUserPermissions = () => {
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
    const [activePage, setactivePage] = useState(null);
    const [activeIndexGtam, setActiveIndexGtam] = useState(1);
    const [activeCon, setactiveCon] = useState(0);
    const [loadingGtrs, setLoadingGtrs] = useState(false);
    const [activeIndexGTRS, setActiveIndexGTRS] = useState(0);
    const [activeHeader, setactiveHeader] = useState("null");
    const [currentComponent, setcurrentComponent] = useState([]);
    const [activeIndexInv, setActiveIndexInv] = useState(1);
    const [invoiceDetails, setInvoiceDetails] = useState();
    const [PODetails, setPODetails] = useState();

    const handleGTAMIndexChange = (e) => {
        setActiveIndexGtam(e);
    };

    const components = [
        <Gtrs
            setToken={setToken}
            sessionData={sessionData}
            user={user}
            setUser={setUser}
            setactivePage={setactivePage}
            setactiveCon={setactiveCon}
            setMobileMenuOpen={setMobileMenuOpen}
            mobileMenuOpen={mobileMenuOpen}
            activeHeader={activeHeader}
            activeIndexGTRS={activeIndexGTRS}
            setActiveIndexGTRS={setActiveIndexGTRS}
            loadingGtrs={loadingGtrs}
            setLoadingGtrs={setLoadingGtrs}
            currentUser={currentUser}
            AToken={Token}
            setCurrentUser={setcurrentUser}
        />,
    ];

    useEffect(() => {
        const components = [
            <Gtrs
                setToken={setToken}
                sessionData={sessionData}
                user={user}
                setUser={setUser}
                setactivePage={setactivePage}
                setactiveCon={setactiveCon}
                setMobileMenuOpen={setMobileMenuOpen}
                mobileMenuOpen={mobileMenuOpen}
                activeHeader={activeHeader}
                activeIndexGTRS={activeIndexGTRS}
                setActiveIndexGTRS={setActiveIndexGTRS}
                loadingGtrs={loadingGtrs}
                setLoadingGtrs={setLoadingGtrs}
                currentUser={currentUser}
                AToken={Token}
                setCurrentUser={setcurrentUser}
            />,
        ];

        setcurrentComponent(components[activePage]);
    }, [activePage, currentUser]);

    useEffect(() => {
        if (currentUser && !Token) {
            const headers = {
                UserId: currentUser.UserId,
                // currentUser.UserId,
                OwnerId: currentUser.OwnerId,
                "Content-Type": "application/x-www-form-urlencoded",
            };
            const data = {
                grant_type: "password",
            };
            axios
                .post(`${gtrsUrl}/Token`, data, {
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
                            "gtrs_access_token",
                            parsedData.access_token
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
            <div>
                {Token ? (
                    <div className="bg-smooth h-full ">
                        {/* <NmainSidebar/> */}
                        <MainSidebar
                            allowedApplications={allowedApplications}
                            setMobileMenuOpen={setMobileMenuOpen}
                            setActiveIndexGtam={handleGTAMIndexChange}
                            mobileMenuOpen={mobileMenuOpen}
                            activePage={activePage}
                            activeIndexGtam={activeIndexGtam}
                            setactivePage={setactivePage}
                            setActiveIndexGTRS={setActiveIndexGTRS}
                            setActiveIndexInv={setActiveIndexInv}
                            currentUser={currentUser}
                        />
                        <MainNavbar
                            url={Invoicesurl}
                            AToken={Token}
                            currentUser={currentUser}
                            PODetails={PODetails}
                            setPODetails={setPODetails}
                            invoiceDetails={invoiceDetails}
                            setInvoiceDetails={setInvoiceDetails}
                            setActiveIndexInv={setActiveIndexInv}
                            hubConnection={hubConnection}
                            activePage={activePage}
                            setMobileMenuOpen={setMobileMenuOpen}
                            activeIndexGTRS={activeIndexGTRS}
                            mobileMenuOpen={mobileMenuOpen}
                            activeHeader={activeHeader}
                            setActiveIndexGTRS={setActiveIndexGTRS}
                            loadingGtrs={loadingGtrs}
                        />
                        {components[activePage]}
                    </div>
                ) :  <div className="min-h-screen md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
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
            </div>}
            </div>
        );
    }
}
