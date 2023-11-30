import { useState } from "react";
import { useEffect } from "react";
import MainSidebar from "../Components/Main-sidebar";
import MainNavbar from "../Components/Main-navbar";
import Gtrs from "@/Pages/GTRS";
import axios from "axios";
import hubConnection from "./SignalR";
// import AllRoutes from "./RoutesPage";

export default function Sidebar(Boolean) {
    const [currentUser, setcurrentUser] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [allowedApplications, setAllowedApplications] = useState([]);

    // const Invoicesurl = "https://gtlslebs06-vm.gtls.com.au:147/";
    const Invoicesurl = "https://gtlslebs06-vm.gtls.com.au:5678/";
    const Gtamurl = "https://gtlslebs06-vm.gtls.com.au:5432";

    useEffect(() => {
        axios
            .get("/users")
            .then((res) => {
                //console.log(res.data.hasOwnProperty('Username'));
                setcurrentUser(res.data);
            })
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        if (currentUser) {
            axios
                .get(`${Gtamurl}/api/GTAM/User/Permissions`, {
                    headers: {
                        UserId: currentUser.UserId,
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
            sessionData={sessionData}
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
            setCurrentUser={setcurrentUser}
        />,
    ];

    useEffect(() => {
        const components = [
            <Gtrs
                sessionData={sessionData}
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
                setCurrentUser={setcurrentUser}
            />,
        ];

        setcurrentComponent(components[activePage]);
    }, [activePage, currentUser]);

    if (!currentUser) {
        return null; // Render nothing
    } else {
        return (
            <div>
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
            </div>
        );
    }
}
