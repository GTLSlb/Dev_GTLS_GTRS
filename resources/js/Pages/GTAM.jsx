// export default function Gtam () {
//     return <h1>Contact Me</h1>;
//   };

// import Sidebar from "./Layout"
import GtamSidebar from "./Component/GTAM/gtam-sidebar";
import GtamUsers from "./Component/GTAM/gtam-employees";
import GtamDrivers from "./Component/GTAM/gtam-drivers";
import GtamCustomers from "./Component/GTAM/gtam-customers";
import React, { useState } from "react";
import GtamProfile from "./Component/GTAM/gtam-Profile";
import Sidebar from "./Layout";
import CreateUser from "./Component/GTAM/CreateUser";
import Dashboard from "./Component/GTAM/Pages/Dashboard";
import Roles from "./Component/GTAM/Pages/Roles";
import Apps from "./Component/GTAM/Pages/Apps";
import Groups from "./Component/GTAM/Pages/Groups";
import Branches from "./Component/GTAM/Pages/Branches";
import CreateBranch from "./Component/GTAM/components/Branches/CreateBranch";
import CreateApp from "./Component/GTAM/Pages/CreateApp";
import ApplicationDetails from "./Component/GTAM/components/Apps/ApplicationDetails";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import * as signalR from "@aspnet/signalr";
import * as signalRCore from "@microsoft/signalr";
import Department from "./Component/GTAM/Pages/Departments";
import CreateDepartment from "./Component/GTAM/components/Departments/CreateDepartment";
import EditEmployee from "./Component/GTAM/Pages/EditEmployee";
// import Layout from "./Layout";

export default function Gtam({
    currentUser,
    activeIndexGtam,
    setActiveIndexGtam,
}) {
    const [userProfile, setUserProfile] = useState({});
    const url = "https://gtlslebs06-vm.gtls.com.au:5432/";
    const [groups, setGroups] = useState([]);

    // useEffect(() => {
    //     const hubConnection = new signalRCore.HubConnectionBuilder()

    //         .withUrl("https://gtlslebs06-vm.gtls.com.au:8088/notificationHub", {
    //             skipNegotiation: true,
    //             transport: signalR.HttpTransportType.WebSockets,
    //         }) // Replace with your SignalR hub URL

    //         .configureLogging(signalRCore.LogLevel.Debug)

    //         .build();

    //     hubConnection.on("ReceiveNotification", (message) => {
    //         console.log(`Received Notification: ${message}`);
    //         const x = JSON.stringify(message);
    //                     const parsedData = JSON.parse(x);
    //                     console.log(parsedData)
    //     });

    //     hubConnection
    //         .start()
    //         .then(() => {
    //             console.log("Connected to SignalR Hub.");
    //         })
    //         .catch((error) => {
    //             console.error("Error connecting to SignalR Hub:", error);
    //         });

    //     return () => {
    //         hubConnection.stop();
    //     };
    // }, []);

    function AlertToast(msg, status) {
        if (status == 1) {
            toast.success(msg, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else if (status == 2) {
            toast.error(msg, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else if (status == 3) {
            toast.warning(msg, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }
    const [states, setStates] = useState();
    const [branches, setBranches] = useState();
    function getBranches() {
        axios
            .get(`${url}api/GTAM/Branches`, {
                headers: {
                    UserId: currentUser.user_id,
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
                    setBranches(parsedData);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        axios
            .get(`${url}api/GTAM/States`, {
                headers: {
                    UserId: currentUser.user_id,
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
                    setStates(parsedData);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const [application, setApplication] = useState(null);
    const [activeIndex, setActiveIndex] = useState(activeIndexGtam);

    useEffect(() => {
        setActiveIndex(activeIndexGtam);
        setActiveIndexGtam(activeIndexGtam);
    }, [activeIndexGtam]);

    const [branch, setBranch] = useState(null);
    const [departments, setDepartments] = useState();

    function getDepartments() {
        axios
            .get(`${url}api/GTAM/Departments`, {
                headers: {
                    UserId: currentUser.user_id,
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
                    setDepartments(parsedData);
                    // setAppsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getGroups() {
        axios
            .get(`${url}api/GTAM/GroupRoles`, {
                headers: {
                    UserId: currentUser.user_id,
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
                    setGroups(parsedData);
                    // setAppsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const [employees, setEmployees] = useState();
    function GetEmployees() {
        axios
            .get(`${url}api/GTAM/Employees`, {
                headers: {
                    UserId: currentUser.user_id,
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
                    setEmployees(parsedData);
                    // setAppsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const [roles, setRoles] = useState();

    function getRoles() {
        axios
            .get(`${url}api/GTAM/UserRoles`, {
                headers: {
                    UserId: currentUser.user_id,
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
                    setRoles(parsedData);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const [apps, setApps] = useState();
    function getApps() {
        axios
            .get(`${url}api/GTAM/Applications`, {
                headers: {
                    UserId: currentUser.user_id,
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
                    setApps(parsedData);
                    //setAppsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const [employeesAD, setEmployeesAD] = useState([]);
    function getEmployeesAD() {
        const user = {
            Username: "mirac@gtls.com.au",
            Password: "GoldTiger@647",
        };
        axios
            .post(`${url}api/GTAM/GetUsers`, user, {})
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
                    setEmployeesAD(parsedData);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const [useTypesDb, setUseTypesDb] = useState([]);
    function getEmployeesAD() {
        axios
        .get(`${url}api/GTAM/UserTypes`, {
            headers: {
                UserId: currentUser.user_id,
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
                    console.log(parsedData)
                    setUseTypesDb(parsedData);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const [userTypeFromPage, setUserTypeFromPage] = useState(null);
    useEffect(() => {
        getGroups();
        GetEmployees();
        getRoles();
        getApps();
        getBranches();
        getDepartments();
        getEmployeesAD();
    }, []);
    const components = [
        <Dashboard />,
        <GtamUsers
            setUserProfile={setUserProfile}
            roles={roles}
            branches={branches}
            groups={groups}
            departments={departments}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            currentUser={currentUser}
            employees={employees}
            url={url}
            useTypesDb = {useTypesDb}
            setUserTypeFromPage={setUserTypeFromPage}
        />,
        <Roles
            currentUser={currentUser}
            getRoles={getRoles}
            roles={roles}
            url={url}
            AlertToast={AlertToast}
        />,
        <Apps
            setActiveIndexGtam={setActiveIndexGtam}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            currentUser={currentUser}
            url={url}
            apps={apps}
            AlertToast={AlertToast}
            setApplication={setApplication}
        />,
        <Groups
            apps={apps}
            roles={roles}
            activeIndex={activeIndex}
            AlertToast={AlertToast}
            setActiveIndex={setActiveIndex}
            currentUser={currentUser}
            groups={groups}
            getGroups={getGroups}
            url={url}
        />,
        <Branches
            setBranch={setBranch}
            getBranches={getBranches}
            branches={branches}
            activeIndex={activeIndex}
            states={states}
            AlertToast={AlertToast}
            setActiveIndex={setActiveIndex}
            currentUser={currentUser}
            url={url}
        />,
        <CreateUser
            getEmployeesAD={getEmployeesAD}
            url={url}
            currentUser={currentUser}
            roles={roles}
            branches={branches}
            groups={groups}
            departments={departments}
            activeIndex={activeIndex}
            AlertToast={AlertToast}
            employeesAD={employeesAD}
            employees={employees}
            userTypeFromPage={userTypeFromPage}
            GetEmployees={GetEmployees}
            setActiveIndex={setActiveIndex}
        />,
        <CreateBranch
            setBranch={setBranch}
            getBranches={getBranches}
            branch={branch}
            currentUser={currentUser}
            AlertToast={AlertToast}
            url={url}
            states={states}
            setActiveIndex={setActiveIndex}
        />,
        <CreateApp
            AlertToast={AlertToast}
            url={url}
            setActiveIndex={setActiveIndex}
            currentUser={currentUser}
            application={application}
        />,
        <ApplicationDetails
            AlertToast={AlertToast}
            application={application}
            setActiveIndex={setActiveIndex}
            url={url}
            currentUser={currentUser}
        />,
        <Department
            setDepartment={setDepartments}
            departments={departments}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            currentUser={currentUser}
            url={url}
        />,
        <CreateDepartment
            setDepartment={setDepartments}
            getDepartments={getDepartments}
            department={departments}
            branches={branches}
            currentUser={currentUser}
            AlertToast={AlertToast}
            url={url}
            states={states}
            setActiveIndex={setActiveIndex}
        />,
        <EditEmployee
            roles={roles}
            branches={branches}
            groups={groups}
            employees={employees}
            currentUser={currentUser}
            GetEmployees={GetEmployees}
            departments={departments}
            setActiveIndex={setActiveIndex}
            url={url}
            userProfile={userProfile}
        />,
        <GtamCustomers
            setUserTypeFromPage={setUserTypeFromPage}
            setUserProfile={setUserProfile}
            roles={roles}
            branches={branches}
            groups={groups}
            departments={departments}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            currentUser={currentUser}
            employees={employees}
            url={url}
            useTypesDb = {useTypesDb}
        />,
        <GtamDrivers
            setUserTypeFromPage={setUserTypeFromPage}
            setUserProfile={setUserProfile}
            roles={roles}
            branches={branches}
            groups={groups}
            departments={departments}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            currentUser={currentUser}
            employees={employees}
            url={url}
            useTypesDb = {useTypesDb}
        />,
    ];

    return (
        <div className="">
            {/* <Sidebar /> */}
            <div className=" min-h-screen flex md:pl-20 pt-16 ">
                {/* Left sidebar & main wrapper */}
                <div className="min-w-0 flex-1 bg-gray-100 md:flex">
                    <div className="bg-gray-300 hidden md:block md:w-64 flex-shrink-0 w-full">
                        <div className="h-full">
                            {/* Start left column area */}
                            <div
                                className="relative h-full"
                                style={{ minHeight: "12rem" }}
                            >
                                <div className="absolute inset-0 rounded-lg bg-gray-300 border-dashed border-gray-200">
                                    <GtamSidebar
                                        setActiveIndex={setActiveIndex}
                                    />
                                </div>
                            </div>
                            {/* End left column area */}
                        </div>
                    </div>

                    <div className="bg-gray-100 lg:min-w-0 lg:flex-1">
                        <div className="h-full">
                            {/* Start main area*/}
                            <div
                                className="relative h-full"
                                style={{ minHeight: "36rem" }}
                            >
                                <div className=" inset-0 rounded-lg  ">
                                    {components[activeIndex]}
                                </div>
                            </div>
                            {/* End main area */}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}
