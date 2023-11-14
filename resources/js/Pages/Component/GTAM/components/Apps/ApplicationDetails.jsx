import { useState } from "react";
import {
    HomeIcon,
    GlobeAltIcon,
    DocumentMagnifyingGlassIcon,
    PencilIcon,
    UsersIcon,
} from "@heroicons/react/24/solid";
import AppsPage from "../Apps/AppsPage";
import Features from "../Apps/Features";
import AppRoles from "../Apps/AppRoles";
import { useEffect } from "react";

export default function ApplicationDetails({
    application,
    AlertToast,
    setActiveIndex,
    url,
    currentUser,
}) {
    const [pages, setPages] = useState();
    const [roles, setRoles] = useState();
    const [Pagearray, setPagearray] = useState([]);

useEffect(() => {
        setPagearray([
            {
                id: 0,
                name: "Pages",
                icon: UsersIcon,
                description:
                    "Solid walnut base with rare earth magnets and polycarbonate add-ons.",
                html: (
                    <Features
                        AlertToast={AlertToast}
                        pages={pages}
                        application={application}
                        currentUser={currentUser}
                        getRoles={getRoles}
                        getFeatures={getFeatures}
                        url={url}
                    />
                ),
                current: true,
            },
            {
                id: 1,
                name: "Roles",
                icon: UsersIcon,
                description:
                    "Gold Tiger Maintenance is Australian owned family business offering Freight Distribution and Warehousing Solutions.",
                html: (
                    <AppRoles
                        AlertToast={AlertToast}
                        roles={roles}
                        pages={pages}
                        application={application}
                        currentUser={currentUser}
                        getRoles={getRoles}
                        url={url}
                    />
                ),
                current: false,
            },
        ]);
    }, [ roles]);

    useEffect(() => {
        setPagearray([
            {
                id: 0,
                name: "Pages",
                icon: UsersIcon,
                description:
                    "Solid walnut base with rare earth magnets and polycarbonate add-ons.",
                html: (
                    <Features
                        AlertToast={AlertToast}
                        pages={pages}
                        application={application}
                        currentUser={currentUser}
                        getRoles={getRoles}
                        getFeatures={getFeatures}
                        url={url}
                    />
                ),
                current: true,
            },
            {
                id: 1,
                name: "Roles",
                icon: UsersIcon,
                description:
                    "Gold Tiger Maintenance is Australian owned family business offering Freight Distribution and Warehousing Solutions.",
                html: (
                    <AppRoles
                        AlertToast={AlertToast}
                        roles={roles}
                        pages={pages}
                        application={application}
                        currentUser={currentUser}
                        getRoles={getRoles}
                        url={url}
                    />
                ),
                current: false,
            },
        ]);
    }, [pages]);

    

    function getFeatures() {
        axios
            .get(`${url}api/GTAM/AppPageFeatures`, {
                headers: {
                    UserId: currentUser.user_id,
                    AppId: application.AppId,
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
                    setPages(parsedData);
                    // setAppsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getRoles() {
        axios
            .get(`${url}api/GTAM/AppRolePermissions`, {
                headers: {
                    UserId: currentUser.user_id,
                    AppId: application.AppId,
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
                    // setAppsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        getRoles();
        getFeatures();
    }, []);

    function handleEditClick() {
        // setApplication(object)
        setActiveIndex(8);
    }
    const [activePage, setActivePage] = useState(0);
    function changeActivePage(index) {
        setActivePage(index);
        const updatedElements = Pagearray.map((element) => {
            if (element.id === index) {
                return { ...element, current: true };
            } else {
                return { ...element, current: false };
            }
        });
        setPagearray(updatedElements);
    }
    return (
        <div className="p-8">
             <div
                className="bg-gray-100 bg-gray-200 bg-gray-300 bg-gray-400 bg-gray-500 bg-gray-600 bg-gray-700 bg-gray-800 bg-gray-900
                                bg-red-100 bg-red-200 bg-red-300 bg-red-400 bg-red-500 bg-red-600 bg-red-700 bg-red-800 bg-red-900
                                bg-yellow-100 bg-yellow-200 bg-yellow-300 bg-yellow-400 bg-yellow-500 bg-yellow-600 bg-yellow-700 bg-yellow-800 bg-yellow-900
                                bg-green-100 bg-green-200 bg-green-300 bg-green-400 bg-green-500 bg-green-600 bg-green-700 bg-green-800 bg-green-900
                                bg-teal-100 bg-teal-200 bg-teal-300 bg-teal-400 bg-teal-500 bg-teal-600 bg-teal-700 bg-teal-800 bg-teal-900
                                bg-sky-100 bg-sky-200 bg-sky-300 bg-sky-400 bg-sky-500 bg-sky-600 bg-sky-700 bg-sky-800 bg-sky-900
                                bg-amber-100 bg-amber-200 bg-amber-300 bg-amber-400 bg-amber-500 bg-amber-600 bg-amber-700 bg-amber-800 bg-amber-900
                                bg-blue-100 bg-blue-200 bg-blue-300 bg-blue-400 bg-blue-500 bg-blue-600 bg-blue-700 bg-blue-800 bg-blue-900
                                bg-indigo-100 bg-indigo-200 bg-indigo-300 bg-indigo-400 bg-indigo-500 bg-indigo-600 bg-indigo-700 bg-indigo-800 bg-indigo-900
                                bg-purple-100 bg-purple-200 bg-purple-300 bg-purple-400 bg-purple-500 bg-purple-600 bg-purple-700 bg-purple-800 bg-purple-900
                                bg-pink-100 bg-pink-200 bg-pink-300 bg-pink-400 bg-pink-500 bg-pink-600 bg-pink-700 bg-pink-800 bg-pink-900 hidden"
            ></div>
            <div
                 className="from-gray-100 from-gray-200 from-gray-300 from-gray-400 from-gray-500 from-gray-600 from-gray-700 from-gray-800 from-gray-900
                            from-red-100 from-red-200 from-red-300 from-red-400 from-red-500 from-red-600 from-red-700 from-red-800 from-red-900
                            from-yellow-100 from-yellow-200 from-yellow-300 from-yellow-400 from-yellow-500 from-yellow-600 from-yellow-700 from-yellow-800 from-yellow-900
                            from-green-100 from-green-200 from-green-300 from-green-400 from-green-500 from-green-600 from-green-700 from-green-800 from-green-900
                            from-teal-100 from-teal-200 from-teal-300 from-teal-400 from-teal-500 from-teal-600 from-teal-700 from-teal-800 from-teal-900
                            from-sky-100 from-sky-200 from-sky-300 from-sky-400 from-sky-500 from-sky-600 from-sky-700 from-sky-800 from-sky-900
                            from-amber-100 from-amber-200 from-amber-300 from-amber-400 from-amber-500 from-amber-600 from-amber-700 from-amber-800 from-amber-900
                            from-blue-100 from-blue-200 from-blue-300 from-blue-400 from-blue-500 from-blue-600 from-blue-700 from-blue-800 from-blue-900
                            from-indigo-100 from-indigo-200 from-indigo-300 from-indigo-400 from-indigo-500 from-indigo-600 from-indigo-700 from-indigo-800 from-indigo-900
                            from-purple-100 from-purple-200 from-purple-300 from-purple-400 from-purple-500 from-purple-600 from-purple-700 from-purple-800 from-purple-900
                            from-pink-100 from-pink-200 from-pink-300 from-pink-400 from-pink-500 from-pink-600 from-pink-700 from-pink-800 from-pink-900 hidden"
            ></div>
            <div
                 className="to-gray-100 to-gray-200 to-gray-300 to-gray-400 to-gray-500 to-gray-600 to-gray-700 to-gray-800 to-gray-900
                            to-red-100 to-red-200 to-red-300 to-red-400 to-red-500 to-red-600 to-red-700 to-red-800 to-red-900
                            to-yellow-100 to-yellow-200 to-yellow-300 to-yellow-400 to-yellow-500 to-yellow-600 to-yellow-700 to-yellow-800 to-yellow-900
                            to-green-100 to-green-200 to-green-300 to-green-400 to-green-500 to-green-600 to-green-700 to-green-800 to-green-900
                            to-teal-100 to-teal-200 to-teal-300 to-teal-400 to-teal-500 to-teal-600 to-teal-700 to-teal-800 to-teal-900
                            to-sky-100 to-sky-200 to-sky-300 to-sky-400 to-sky-500 to-sky-600 to-sky-700 to-sky-800 to-sky-900
                            to-amber-100 to-amber-200 to-amber-300 to-amber-400 to-amber-500 to-amber-600 to-amber-700 to-amber-800 to-amber-900
                            to-blue-100 to-blue-200 to-blue-300 to-blue-400 to-blue-500 to-blue-600 to-blue-700 to-blue-800 to-blue-900
                            to-indigo-100 to-indigo-200 to-indigo-300 to-indigo-400 to-indigo-500 to-indigo-600 to-indigo-700 to-indigo-800 to-indigo-900
                            to-purple-100 to-purple-200 to-purple-300 to-purple-400 to-purple-500 to-purple-600 to-purple-700 to-purple-800 to-purple-900
                            to-pink-100 to-pink-200 to-pink-300 to-pink-400 to-pink-500 to-pink-600 to-pink-700 to-pink-800 to-pink-900 hidden"
            ></div>
            <div className="shadow-md rounded-xl p-5 bg-white flex justify-between gap-x-3">
                <div className="flex gap-x-3">
                    <div className={`bg-gradient-to-b from-${application.Colors[0].ColorName} to-${application.Colors[1].ColorName} h-14 w-14 rounded-2xl items-center min-w-[3.3rem] flex justify-center`}>
                    <img src={`AppLogo/${application.AppPic}`} alt="" className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col  gap-y-1">
                        <div className="flex flex-col sm:flex-row gap-x-2 ">
                            <h1 className="font-bold text-xl ">
                                {application.AppAbv}
                            </h1>
                            <p className="font-semibold mt-auto">
                                {application.AppName}
                            </p>
                            <span className="text-gray-400 text-xs mt-auto">
                                {application.AppVersion}
                            </span>
                            <div className="flex items-center gap-x-2 mt-auto">
                                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                                <p className="text-gray-400 text-xs">
                                    {application.DevPhaseName}
                                </p>
                            </div>
                        </div>
                        <div className="text-gray-500 text-sm">
                            {application.AppDesc}
                        </div>
                    </div>
                </div>
                <a
                    href="#"
                    className="flex items-center gap-x-2 z-10"
                    onClick={(e) => {
                        // e.preventDefault(); // Prevent default behavior of the link
                        handleEditClick();
                    }}
                >
                    <PencilIcon className="h-3" />{" "}
                    <span className="text-gray-500">Edit</span>
                </a>
            </div>
            <div className="">
                <ul className="flex space-x-5 mt-5 border-b-2">
                    {Pagearray.map((Page, index) => (
                        <li
                            id={Page.name}
                            key={index}
                            className={`cursor-pointer text-xs sm:text-base py-2 ${
                                Page.current === true
                                    ? "text-dark border-b-4  border-goldd font-bold "
                                    : "text-gray-500  "
                            }`}
                            onClick={() => changeActivePage(Page.id)}
                        >
                            <div className="px-3 flex gap-x-2 items-center">
                                <Page.icon className="w-4" />
                                <span>{Page.name}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="">{Pagearray[activePage]?.html}</div>
            </div>
        </div>
    );
}
