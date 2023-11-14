import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { PhoneIcon } from "@heroicons/react/20/solid";
import goldTigerLogo from "../../assets/pictures/goldTigerLogo.webp";
import LogoWhite from "../../assets/pictures/LogoWhite.webp";
import { Link } from "@inertiajs/inertia-react";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon, BellAlertIcon } from "@heroicons/react/20/solid";
const navigation = [
    { id:1, name: "Services", href: "/#services" },
    { id:2, name: "About Us", href: "/#aboutus" },
    { id:3, name: "Technologies", href: "/#technologies" },
    { id:4, name: "Media & News", href: "/#news" },
    { id:5, name: "Careers", href: "/opportunities" },
    { id:6, name: "Contact Us", href: "/#contact" },
    { id:7, name: "Going Green", href: "/goinggreen" },
];
export default function Navbars() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);
    const [nextPage, setNextPage] = useState(false);
    const toggleElement = () => {
        setNextPage(!nextPage);
    };
    useEffect(() => {
        function handleScroll() {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            setShowNavbar(scrollTop > 0);

            const hash = window.location.hash;
            if (hash && document.querySelector(hash)) {
                const element = document.querySelector(hash);
                const elementTop =
                    element.getBoundingClientRect().top + scrollTop;
                const navbarHeight = document.querySelector("nav").offsetHeight;
                if (elementTop <= navbarHeight) {
                    window.scrollTo(0, elementTop - navbarHeight);
                }
            }
        }

        function handleHashChange() {
            setTimeout(() => handleScroll(), 0);
        }

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("hashchange", handleHashChange);
        handleScroll(); // Call the function on initial page load

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, []);
    return (
        <div className="absolute  pb-2 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd shadow-xl shadow-bottom z-30  w-full">
            <div className="bg-dark">
                <div className="w-full h-6 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd ">
                    <div className="mx-auto sm:max-w-7xl sm:px-6 lg:px-8 flex items-center h-full justify-between">
                        <div className="flex gap-x-7">
                            <a
                                href="#contact"
                                className="text-xs sm:text-sm font-bold flex h-full items-center"
                            >
                                Contact Us
                            </a>
                            <a
                                href="/opportunities"
                                className="text-xs sm:text-sm font-bold flex h-full items-center"
                            >
                                Careers
                            </a>
                        </div>
                        <a
                            href="tel:+180040306"
                            className="text-xs sm:text-sm font-bold flex h-full items-center"
                        >
                            {" "}
                            <PhoneIcon
                                className="h-5 sm:h-6 w-auto p-0.5"
                                aria-hidden="true"
                            />
                            Call: 1800-040-306
                        </a>
                    </div>
                </div>
                <nav
                    className="mx-auto lg:max-w-7xl max-w-7xl px-6 pb-2 pt-2 lg:flex lg:items-center lg:gap-x-10 lg:px-10   flex items-center justify-between"
                    aria-label="Global"
                >
                    <div className="flex lg:flex-1">
                        <a href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-14"
                                src={LogoWhite}
                                alt="GoldTiger"
                            />
                        </a>
                    </div>
                    <div className="flex lg:hidden">
                        <Popover className="relative object-right flex-item md:ml-auto ">
                            <Popover.Button
                                className={` inline-flex items-center  px-4 py-2 border-2 border-goldt rounded-3xl mr-6 hover:bg-black hover:text-goldt text-white`}
                            >
                                Login
                                <ChevronDownIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </Popover.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute left-12 top-8 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                    <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-gradient-to-r from-goldl to-goldd text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                        <div className="w-full">
                                            <div className=" flex flex-col gap-y-0">
                                                <a
                                                    href="/login"
                                                    className=" mr-6 w-full hover:bg-dark hover:text-goldt text-dark"
                                                >
                                                    <div className=" w-full flex justify-center">
                                                        <button className="font-bold p-2 px-4">
                                                            Log In
                                                        </button>
                                                    </div>
                                                </a>
                                                <div className="bg-gray-600 h-[0.05rem]"></div>
                                                <a
                                                    target={"_blank"}
                                                    href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                                                    className=" hover:bg-dark text-dark hover:text-goldt "
                                                >
                                                    <div className="w-full flex justify-center">
                                                        <button className=" font-bold p-2 px-4">
                                                            Client Login
                                                        </button>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        {/* <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                                <button
                                                    // onClick={handleDownloadExcel}
                                                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                                >
                                                    Export XLS
                                                </button>
                                            </div> */}
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </Popover>
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-goldt"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12 h-8">
                        {navigation.map((item) => (
                            item.id == 5||item.id==6?null:
                            <Link
                                key={item.name}
                                href={item.href}
                                // data={item.ref}
                                // smooth={true}
                                className="hover:cursor-pointer hover:border-b hover:border-goldt p-1   text-[1rem] font-semibold leading-6 text-goldt hover:text-white"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="hidden  lg:flex lg:flex-1 lg:justify-end">
                        {/* {props.auth.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <> */}
                        <div className="hidden  lg:flex lg:flex-1 lg:justify-end">
                            <Popover className="relative object-right flex-item md:ml-auto ">
                                <Popover.Button
                                    className={` inline-flex items-center  px-4 py-2 border-2 border-goldt rounded-3xl mr-6 hover:bg-black hover:text-goldt text-white`}
                                >
                                    Login
                                    <ChevronDownIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </Popover.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <Popover.Panel className="absolute left-12 top-8 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                        <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-gradient-to-r from-goldl to-goldd text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                            <div className="w-full">
                                                <div className=" flex flex-col gap-y-0">
                                                    <a
                                                        href="/login"
                                                        className=" mr-6 w-full hover:bg-dark hover:text-goldt text-dark"
                                                    >
                                                        <div className=" w-full flex justify-center">
                                                            <button className="font-bold p-2 px-4">
                                                                Log In
                                                            </button>
                                                        </div>
                                                    </a>
                                                    <div className="bg-gray-600 h-[0.05rem]"></div>
                                                    <a
                                                        target={"_blank"}
                                                        href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                                                        className=" hover:bg-dark text-dark hover:text-goldt "
                                                    >
                                                        <div className="w-full flex justify-center">
                                                            <button className=" font-bold p-2 px-4">
                                                                Client Login
                                                            </button>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                            {/* <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                                <button
                                                    // onClick={handleDownloadExcel}
                                                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                                >
                                                    Export XLS
                                                </button>
                                            </div> */}
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </Popover>
                        </div>

                        {/* <Link
                                                href={route("register")}
                                                className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )} */}
                        {/* <a
                        href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                        className=" bg-dark hover:bg-black rounded-3xl text-white hover:text-goldt"
                    >
                        <div className="rounded-3xl border-2 border-goldt px-5 py-2 ">
                            <button className=" rounded-3xl  font-bold  ">
                                Log In
                            </button>
                        </div>
                    </a> */}
                    </div>
                </nav>
            </div>
            <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-dark  px-6 py-6 lg:hidden">
                    <div className="flex flex-row-reverse items-center justify-between">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-goldd"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-8"
                                src={LogoWhite}
                                alt="Goldtiger"
                            />
                        </a>
                    </div>
                    <div className="mt-6 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="hover:cursor-pointer -mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-goldt hover:bg-gray-400/10"
                            >
                                {item.name}
                            </Link>
                        ))}
                        {/* {props.auth.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route("login")}
                                                // className="border-2 w-10 bg-goldt text-gray-600 hover:text-gray-900 dark:text-gray-900 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                            >
                                                <button className="border rounded bg-goldt text-white h-10 w-20 hover:bg-black"> Log in</button>
                                                
                                            </Link>

                                            <Link
                                                href={route("register")}
                                                className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )} */}
                        {/* <a
                                            href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                                            className="border-2 w-10 bg-goldt text-gray-600 hover:text-gray-900 dark:text-gray-900 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                        >
                                            <button className="border  rounded bg-goldt text-white font-bold h-10 w-20 hover:bg-black">
                                                Log In
                                            </button>
                                        </a> */}
                    </div>
                </Dialog.Panel>
            </Dialog>
            <div
                className={`shadow-md shadow-bottom z-50 h-auto   pb-2  bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd lg:pr-0 fixed bg-white top-0 left-0 w-full transition duration-500 ease-in-out ${
                    showNavbar ? "opacity-100" : "opacity-0 -translate-y-full"
                }`}
            >
                <div className="w-full bg-dark">
                    <div className="w-full h-6 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd ">
                    <div className="mx-auto sm:max-w-7xl sm:px-6 lg:px-8 flex items-center h-full justify-end lg:justify-between">
                        <div className="hidden lg:flex gap-x-7">
                            <a
                                href="/#contact"
                                className="text-xs sm:text-sm font-bold flex h-full items-center"
                            >
                                Contact Us
                            </a>
                            <a
                                href="/opportunities"
                                className="text-xs sm:text-sm font-bold flex h-full items-center"
                            >
                                Careers
                            </a>
                        </div>
                            <a
                                href="tel:+180040306"
                                className="text-xs sm:text-sm font-bold flex h-full items-center"
                            >
                                {" "}
                                <PhoneIcon
                                    className="h-5 sm:h-6 w-auto p-0.5"
                                    aria-hidden="true"
                                />
                                Call: 1800-040-306
                            </a>
                        </div>
                    </div>
                    <nav
                        className="mx-auto lg:max-w-7xl max-w-7xl px-6 pt-2 pb-2 lg:flex lg:items-center lg:gap-x-10 lg:px-10   flex items-center justify-between"
                        aria-label="Global"
                    >
                        <div className="flex lg:flex-1">
                            <a href="/" className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <img
                                    className="h-14"
                                    src={LogoWhite}
                                    alt="Goldtiger"
                                />
                            </a>
                        </div>
                        <div className="flex lg:hidden">
                            <Popover className="relative object-right flex-item md:ml-auto ">
                                <Popover.Button
                                    className={` inline-flex items-center  px-4 py-2 border-2 border-goldt rounded-3xl mr-6 hover:bg-black hover:text-goldt text-white`}
                                >
                                    Login
                                    <ChevronDownIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </Popover.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <Popover.Panel className="absolute left-12 top-8 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                        <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-gradient-to-r from-goldl to-goldd text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                            <div className="w-full">
                                                <div className=" flex flex-col gap-y-0">
                                                    <a
                                                        href="/login"
                                                        className=" mr-6 w-full hover:bg-dark hover:text-goldt text-dark"
                                                    >
                                                        <div className=" w-full flex justify-center">
                                                            <button className="font-bold p-2 px-4">
                                                                Log In
                                                            </button>
                                                        </div>
                                                    </a>
                                                    <div className="bg-gray-600 h-[0.05rem]"></div>
                                                    <a
                                                        target={"_blank"}
                                                        href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                                                        className=" hover:bg-dark text-dark hover:text-goldt "
                                                    >
                                                        <div className="w-full flex justify-center">
                                                            <button className=" font-bold p-2 px-4">
                                                                Client Login
                                                            </button>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                            {/* <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                                <button
                                                    // onClick={handleDownloadExcel}
                                                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                                >
                                                    Export XLS
                                                </button>
                                            </div> */}
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </Popover>
                            <button
                                type="button"
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-goldt"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        <div className="hidden lg:flex lg:gap-x-12 h-8">
                            {navigation.map((item) => (
                                 item.id == 5||item.id==6?null:
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    // smooth={true}
                                    className="hover:cursor-pointer hover:border-b hover:border-goldt p-1   text-md font-semibold leading-6 text-goldt hover:text-white"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="hidden  lg:flex lg:flex-1 lg:justify-end">
                            {/* {props.auth.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : ( */}
                            <>
                                {/* <Link
                                                href={route("login")}
                                                className="bg-dark hover:bg-black rounded-3xl text-white hover:text-goldt py-2 px-5  border-2 border-goldt"
                                            >
                                                <button className="font-bold"> Log in</button>
                                                
                                            </Link> */}
                                <Popover className="relative object-right flex-item md:ml-auto ">
                                    <Popover.Button
                                        className={` inline-flex items-center  px-4 py-2 border-2 border-goldt rounded-3xl mr-6 hover:bg-black hover:text-goldt text-white`}
                                    >
                                        Login
                                        <ChevronDownIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute left-12 top-8 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                            <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-gradient-to-r from-goldl to-goldd text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                <div className="w-full">
                                                    <div className=" flex flex-col gap-y-0">
                                                        <a
                                                            href="/login"
                                                            className=" mr-6 w-full hover:bg-dark hover:text-goldt text-dark"
                                                        >
                                                            <div className=" w-full flex justify-center">
                                                                <button className="font-bold p-2 px-4">
                                                                    Log In
                                                                </button>
                                                            </div>
                                                        </a>
                                                        <div className="bg-gray-600 h-[0.05rem]"></div>
                                                        <a
                                                            target={"_blank"}
                                                            href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                                                            className=" hover:bg-dark text-dark hover:text-goldt "
                                                        >
                                                            <div className="w-full flex justify-center">
                                                                <button className=" font-bold p-2 px-4">
                                                                    Client Login
                                                                </button>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                                {/* <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                                <button
                                                    // onClick={handleDownloadExcel}
                                                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                                >
                                                    Export XLS
                                                </button>
                                            </div> */}
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </Popover>

                                {/* <Link
                                                href={route("register")}
                                                className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                            >
                                                Register
                                            </Link> */}
                            </>
                            {/* )} */}
                            {/* <a
                            href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                            className="  bg-dark hover:bg-black rounded-3xl text-white hover:text-goldt"
                        >
                            <div className="rounded-3xl border-2 border-goldt px-5 py-2 ">
                                <button className=" rounded-3xl  font-bold  ">
                                    Log In
                                </button>
                            </div>
                        </a> */}
                        </div>
                    </nav>
                </div>
                <Dialog
                    as="div"
                    open={mobileMenuOpen}
                    onClose={setMobileMenuOpen}
                >
                    <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-dark  px-6 py-6 lg:hidden">
                        <div className="flex flex-row-reverse items-center justify-between">
                            <button
                                type="button"
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-goldd"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </button>
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <img
                                    className="h-8"
                                    src={LogoWhite}
                                    alt="Goldtiger"
                                />
                            </a>
                        </div>
                        <div className="mt-6 space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    // smooth={true}
                                    className="hover:cursor-pointer -mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-goldt hover:bg-gray-400/10"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {/* {props.auth.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route("login")}
                                                // className="border-2 w-10 bg-goldt text-gray-600 hover:text-gray-900 dark:text-gray-900 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                            >
                                                <button className="border rounded bg-goldt text-white h-10 w-20 hover:bg-black"> Log in</button>
                                                
                                            </Link>

                                            <Link
                                                href={route("register")}
                                                className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )} */}
                            {/* <a
                                            href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                                            className="border-2 w-10 bg-goldt text-gray-600 hover:text-gray-900 dark:text-gray-900 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                        >
                                            <button className="border  rounded bg-goldt text-white font-bold h-10 w-20 hover:bg-black">
                                                Log In
                                            </button>
                                        </a> */}
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </div>
        </div>
    );
}
