import {
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "react-headless-accordion";
import { useEffect } from "react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import tiger from "../assets/pictures/tiger.png";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import SupportModal from "@/Pages/Component/modals/SupportModal";
import { PublicClientApplication } from "@azure/msal-browser";
import { clearMSALLocalStorage } from "@/CommonFunctions";
import Cookies from "js-cookie";

export default function MainSidebar({
    allowedApplications,
    setMobileMenuOpen,
    mobileMenuOpen,
    setToken,
    setCurrentUser,
    currentUser,
    user,
}) {
    const appUrl = window.Laravel.appUrl;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sidebarNavigation, setSidebarNavigation] = useState([]);
    useEffect(() => {
        if (user && Object.keys(user).length !== 0) {
            let gtrsElements = sidebarNavigation;
            setSidebarNavigation(gtrsElements);
        }
    }, [user]);

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    const handleEditClick = () => {
        const isModalCurrentlyOpen = !isModalOpen;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpen(isModalCurrentlyOpen);
        setMobileMenuOpen(false);
    };
    const msalConfig = {
        auth: {
            clientId: "05f70999-6ca7-4ee8-ac70-f2d136c50288",
            authority:
                "https://login.microsoftonline.com/647bf8f1-fc82-468e-b769-65fd9dacd442",
            redirectUri: window.Laravel.azureCallback,
        },
        cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: true, // Set this to true if dealing with IE11 or issues with sessionStorage
        },
    };
    const pca = new PublicClientApplication(msalConfig);
    const handleLogout = async () => {
        const credentials = {
            URL: window.Laravel.gtamUrl,
            CurrentUser: currentUser,
            SessionDomain: window.Laravel.appDomain,
        };
        await pca.initialize();
        axios
            .post("/composerLogout", credentials)
            .then((response) => {
                if (response.status === 200 && response.data.status === 200) {
                    const isMicrosoftLogin = Cookies.get(
                        "msal.isMicrosoftLogin"
                    );

                    clearMSALLocalStorage();
                    Cookies.remove('access_token');

                    if (isMicrosoftLogin === "true") {
                        window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${window.Laravel.appUrl}/login`;
                        setToken(null);
                        setCurrentUser(null);
                    } else {
                        window.location.href = `${window.Laravel.appUrl}/login`;
                        setToken(null);
                        setCurrentUser(null);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const currentAppId = window.Laravel.appId;
    function moveToHead(array, id) {
        // Find the index of the object with the matching AppId
        const index = array.findIndex((item) => item.AppId == id);
        // If the item is found and it's not already the first item
        if (index > 0) {
            // Remove the item from the array
            const [item] = array.splice(index, 1);
            // Add the item to the beginning of the array
            array.unshift(item);
        }
        return array;
    }

    moveToHead(allowedApplications, 3);

    const [appsImgs, setAppsImgs] = useState([]);
    const fetchAppsLogo = async (picName, app) => {
        try {
            const response = await axios({
                method: "post",
                url: "/getAppLogo",
                responseType: "blob", // Set the expected response type as 'blob'
                data: {
                    filename: picName,
                },
            });

            const blobUrl = URL.createObjectURL(response.data); // Create a URL for the Blob
            setAppsImgs((prev) => ({
                ...prev,
                [app.AppId]: blobUrl,
            }));
        } catch (error) {
            console.log(error);
            setAppsImgs((prev) => ({
                ...prev,
                [app.AppId]: "/icons/NoPhoto.jpg",
            }));
        }
    };
    useEffect(() => {
        if (allowedApplications?.length > 0) {
            allowedApplications?.forEach((app) => {
                if (!appsImgs[app.AppId]) {
                    // Check if the image URL is not already loaded
                    fetchAppsLogo(app?.AppIcon, app);
                }
            });
        }
    }, [allowedApplications]);

    return (
        <div>
            {/* Desktop SideBar */}
            <div className="hidden md:flex md:flex-shrink-0 h-full fixed top-0 left-0 z-50 w-auto">
                <div className="flex w-20 flex-col">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-800 containerscroll">
                        <div className="flex-1">
                            <div className="flex items-center justify-center bg-gray-800 py-4">
                                <a href="/">
                                    <img src={tiger} alt="Image" />
                                </a>
                            </div>
                            <nav
                                aria-label="Sidebar"
                                className="flex flex-col items-center space-y-3 pt-6"
                            >
                                {allowedApplications?.map((item) => (
                                    <a
                                        href={item.AppURL}
                                        key={item.AppId}
                                        target={
                                            item.id === 0 ? undefined : "_blank"
                                        }
                                    >
                                        {" "}
                                        <button
                                            key={item.AppAbv}
                                            className={classNames(
                                                item.AppId == currentAppId
                                                    ? "bg-gray-700 text-white"
                                                    : "text-gray-400 hover:bg-gray-900 hover:text-white",
                                                "group w-auto p-3 rounded-md flex flex-col items-center text-xs font-medium"
                                            )}
                                        >
                                            {item.icon ? (
                                                <item.icon
                                                    className={classNames(
                                                        item.current
                                                            ? "text-yellow-400"
                                                            : "text-gray-400 group-hover:text-white",
                                                        "h-6 w-6"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <img
                                                    src={appsImgs[item?.AppId]}
                                                    className={classNames(
                                                        item.AppId ==
                                                            currentAppId
                                                            ? "text-yellow-400"
                                                            : "text-gray-400 group-hover:text-white",
                                                        "h-8 w-8"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            <span>{item.AppAbv}</span>
                                        </button>
                                    </a>
                                ))}
                            </nav>
                        </div>
                        <div className="flex flex-col flex-shrink-0 pb-5">
                            <a
                                href="https://support.gtls.com.au/help/2703577665"
                                target="_blank"
                                className="flex justify-center"
                            >
                                {" "}
                                <button
                                    className={classNames(
                                        "text-gray-400 hover:bg-gray-700 hover:text-white",
                                        "group w-auto p-3 rounded-md flex flex-col items-center text-xs font-medium"
                                    )}
                                >
                                    <QuestionMarkCircleIcon
                                        className={classNames(
                                            "text-gray-400 group-hover:text-white",
                                            "h-6 w-6"
                                        )}
                                        aria-hidden="true"
                                    />

                                    <span className="mt-2">Support</span>
                                </button>
                            </a>
                            <button onClick={handleLogout}>
                                <ResponsiveNavLink
                                    as="button"
                                    className="flex flex-col hover:bg-gray-900 hover:text-white"
                                >
                                    <ArrowRightOnRectangleIcon className="w-7 ml-2 text-gray-400" />
                                    <span className="text-xs text-gray-400">
                                        LOGOUT
                                    </span>
                                </ResponsiveNavLink>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile SideBar */}
            <Transition.Root show={mobileMenuOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-20 lg:hidden"
                    onClose={setMobileMenuOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pt-5 pb-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-1 right-0 -mr-14 p-1">
                                        <button
                                            type="button"
                                            className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none "
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            <XMarkIcon
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                            <span className="sr-only">
                                                Close sidebar
                                            </span>
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex flex-shrink-0 items-center px-4">
                                    <img
                                        className="h-8 w-auto"
                                        src={tiger}
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
                                    <nav className="flex h-full flex-col">
                                        <div className="space-y-1 ">
                                            {allowedApplications.map((item) => (
                                                <Accordion
                                                    name={item.AppName}
                                                    key={item.AppId}
                                                    transition={{
                                                        duration: "300ms",
                                                        timingFunction:
                                                            "cubic-bezier(0, 0, 0.2, 1)",
                                                    }}
                                                >
                                                    <a
                                                        href={item.AppURL}
                                                        onClick={() =>
                                                            handleClick(
                                                                item.AppId
                                                            )
                                                        }
                                                    >
                                                        <AccordionItem
                                                            id={item.name}
                                                        >
                                                            {({ open }) => (
                                                                <>
                                                                    <AccordionHeader
                                                                        className={classNames(
                                                                            item.AppId ==
                                                                                currentAppId
                                                                                ? "bg-gray-700 text-white"
                                                                                : "text-gray-400 hover:bg-gray-900 hover:text-white",
                                                                            "group py-2 px-3 rounded-md flex gap-x-2 items-center text-sm font-medium w-full text-gray-600  p-4"
                                                                        )}
                                                                    >
                                                                        <img
                                                                            target="_blank"
                                                                            src={
                                                                                appsImgs[
                                                                                    item
                                                                                        ?.AppId
                                                                                ]
                                                                            }
                                                                            className={classNames(
                                                                                item.AppId ==
                                                                                    currentAppId
                                                                                    ? "text-yellow-400"
                                                                                    : "text-gray-400 group-hover:text-white",
                                                                                "h-8 w-8"
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />

                                                                        <span>
                                                                            {
                                                                                item.AppName
                                                                            }
                                                                        </span>
                                                                    </AccordionHeader>
                                                                    {item.options ? (
                                                                        <AccordionBody className="pl-8 flex flex-col">
                                                                            {item.options.map(
                                                                                (
                                                                                    option
                                                                                ) => (
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            handleClickSide(
                                                                                                item.id,
                                                                                                option.id
                                                                                            )
                                                                                        }
                                                                                        className="p-5 font-light text-left text-white"
                                                                                    >
                                                                                        {
                                                                                            option.name
                                                                                        }
                                                                                    </button>
                                                                                )
                                                                            )}
                                                                        </AccordionBody>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </>
                                                            )}
                                                        </AccordionItem>
                                                    </a>
                                                </Accordion>
                                            ))}
                                        </div>
                                    </nav>
                                </div>
                                <div className="flex flex-col flex-shrink-0 pb-5">
                                    <a
                                        href="https://support.gtls.com.au/help/2703577665"
                                        target="_blank"
                                        className="flex"
                                    >
                                        {" "}
                                        <button
                                            className={classNames(
                                                "text-gray-400 hover:bg-gray-700 hover:text-white",
                                                "group w-auto p-3 rounded-md flex flex-col items-center text-xs font-medium"
                                            )}
                                        >
                                            <QuestionMarkCircleIcon
                                                className={classNames(
                                                    "text-gray-400 group-hover:text-white",
                                                    "h-6 w-6"
                                                )}
                                                aria-hidden="true"
                                            />

                                            <span className="mt-2">
                                                Support
                                            </span>
                                        </button>
                                    </a>
                                    <button onClick={() => handleLogout()}>
                                        <ResponsiveNavLink
                                            as="button"
                                            className="flex flex-col hover:bg-gray-900 hover:text-white w-8 h-14"
                                        >
                                            <ArrowRightOnRectangleIcon className="w-7 ml-2 text-gray-400" />
                                            <span className="text-xs text-gray-400">
                                                LOGOUT
                                            </span>
                                        </ResponsiveNavLink>
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="w-14 flex-shrink-0" aria-hidden="true">
                            {/* Dummy element to force sidebar to shrink to fit close icon */}
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            <SupportModal isOpen={isModalOpen} handleClose={handleEditClick} />
        </div>
    );
}
