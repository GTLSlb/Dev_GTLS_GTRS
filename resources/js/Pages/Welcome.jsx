import { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import LogoWhite from "../assets/pictures/LogoWhite.webp";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/inertia-react";
import { Link as ScrollLink } from "react-scroll";
import ContatcUs from "./Component/landingPage/ContactUs";
import Footer from "./Component/landingPage/Footer";
import PrimaryServices from "./Component/landingPage/Primaryservices";
import Video from "./Component/landingPage/video";
import AboutUs from "./Component/landingPage/AboutUs";
import Branches from "./Component/landingPage/branches";
import News from "./Component/landingPage/News";
import Certifiactesw from "./Component/landingPage/certificatesw";
import VideoHeader from "./Component/landingPage/VideoHeader";
import OpportuniotiesSection from "./Component/landingPage/OpportunitiesSection";
import Technologies from "./Component/landingPage/Technologies";
import WhyGoldTiger from "./Component/landingPage/whyGoldTiger";
import ScrollNav from "./Component/scrollnavmain";
import { Softwares } from "./Component/landingPage/Softwares";
import ScrollToTopButton from "@/Components/ScrollUpButton";
import Benefits from "./Component/landingPage/Benefits";
import Process from "./Component/landingPage/Process";
import Features from "./Component/landingPage/Features";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
    ChevronDownIcon,
    PhoneIcon,
    BellAlertIcon,
} from "@heroicons/react/20/solid";
import CookiePopup from "./Component/CookiePopup";
import GoingGreenSection from "./Component/landingPage/GoingGreenSection";

const navigation = [
    { id:1, name: "About Us", href: "aboutus", link: false },
    { id:2, name: "Services", href: "services", link: false },
    { id:3, name: "Technologies", href: "technologies", link: false },
    { id:4, name: "Media & News", href: "news", link: false },
    { id:5, name: "Careers", href: "/opportunities", link: true },
    { id:6, name: "Contact Us", href: "contact", link: false },
    { id:7, name: "Going Green", href: "/goinggreen",link: true },
];

// function scrollToDiv (myDivRef)  {
//     myDivRef.current.scrollIntoView({ behavior: 'smooth' });
//   };

export default function Welcome(props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);
    const [nextPage, setNextPage] = useState(false);
    const toggleElement = () => {
        setNextPage(!nextPage);
    };

    const prevScrollPositionRef = useRef(0);

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

    const [showMoreLinks, setShowMoreLinks] = useState(false);
    return (
        <>
            <Head title="Welcome" />
            <div className="relative isolate bg-dark">
                <div className="w-full h-6 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd ">
                <div className="mx-auto sm:max-w-7xl sm:px-6 lg:px-8 flex items-center h-full justify-end lg:justify-between">
                        <div className="hidden lg:flex gap-x-7">
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
                <div className="absolute z-30 w-full">
                    <nav
                        className=" mx-auto lg:max-w-7xl max-w-7xl px-6  py-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8   flex items-center justify-between"
                        aria-label="Global"
                    >
                        <div className="flex lg:flex-1">
                            <a href="/" className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <img
                                    className="h-20"
                                    src={LogoWhite}
                                    alt="GoldTiger"
                                />
                            </a>
                        </div>
                        <div className="flex lg:hidden">
                            <Popover className="relative object-right flex-item md:ml-auto">
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
                                    <Popover.Panel className="absolute left-12 top-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
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
                                    className="h-6 w-6 text-goldt"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        <div className="hidden lg:flex lg:gap-x-8">
                            {navigation.map((item) => (
                                 item.id == 5||item.id==6?null:
                                <div key={item.name}>
                                    {item.link ? (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            // data={item.ref}
                                            // smooth={true}
                                            className="hover:cursor-pointer hover:border-b hover:border-goldt p-1   text-[1rem] font-semibold leading-6 text-goldt hover:text-white"
                                        >
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <ScrollLink
                                            key={item.name}
                                            to={item.href}
                                            smooth={true}
                                            className="hover:cursor-pointer h-8 hover:border-b hover:border-goldt p-1 hover:text-white text-md font-semibold leading-6 text-goldt"
                                        >
                                            {item.name}
                                        </ScrollLink>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="hidden  lg:flex lg:flex-1 lg:justify-end">
                            {/* <a
                                href="/login"
                                className="rounded-3xl mr-6 hover:bg-black hover:text-goldt text-white"
                            >
                                <div className="rounded-3xl border-2 border-goldt px-5 py-2 ">
                                    <button className="font-bold  ">
                                        Log In
                                    </button>
                                </div>
                            </a>
                            <a
                                target={"_blank"}
                                href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                                className="mr-6 bg-dark hover:bg-black rounded-3xl text-white hover:text-goldt "
                            >
                                <div className="rounded-3xl border-2 border-goldt px-5 py-2 ">
                                    <button className=" rounded-3xl  font-bold  ">
                                        Client Login
                                    </button>
                                </div>
                            </a> */}
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
                                    <Popover.Panel className="absolute left-12 top-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
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
                    </nav>
                    <Dialog
                        as="div"
                        open={mobileMenuOpen}
                        onClose={setMobileMenuOpen}
                    >
                        <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-dark px-6 py-6 lg:hidden">
                            <div className="flex items-center justify-between">
                                <a href="#" className="-m-1.5 p-1.5">
                                    <span className="sr-only">
                                        Your Company
                                    </span>
                                    <img
                                        className="h-8"
                                        src={LogoWhite}
                                        alt="GoldTiger"
                                    />
                                </a>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-goldd"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="space-y-2 py-6">
                                        {navigation.map((item) => (
                                            // <ScrollLink
                                            //     key={item.name}
                                            //     to={item.href}
                                            //     smooth={true}
                                            //     onClick={() =>
                                            //         setMobileMenuOpen(false)
                                            //     }
                                            //     className="hover:cursor-pointer  -mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-goldt hover:bg-gray-400/10"
                                            // >
                                            //     {item.name}
                                            // </ScrollLink>
                                             <div key={item.name}>
                                             {item.link ? (
                                                 <Link
                                                     key={item.name}
                                                     href={item.href}
                                                     // data={item.ref}
                                                     // smooth={true}
                                                     className="hover:cursor-pointer  -mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-goldt hover:bg-gray-400/10"
                                                     >
                                                     {item.name}
                                                 </Link>
                                             ) : (
                                                 <ScrollLink
                                                     key={item.name}
                                                     to={item.href}
                                                     smooth={true}
                                                     className="hover:cursor-pointer  -mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-goldt hover:bg-gray-400/10"
                                                     >
                                                     {item.name}
                                                 </ScrollLink>
                                             )}
                                         </div>
                                        ))}
                                    </div>
                                    {/* <div className="py-6">
                                        <a
                                            href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                                            className="border-2 w-10 bg-goldt text-gray-600 hover:text-gray-900 dark:text-gray-900 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                        >
                                            <button className=" rounded bg-goldt text-white h-10 w-20 hover:bg-black">
                                                Log In
                                            </button>
                                        </a>
                                    </div> */}
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Dialog>
                    <ScrollNav />
                </div>

                <VideoHeader />
                <PrimaryServices />
                <GoingGreenSection/>
                {/* <Benefits /> */}
                <Process />
                <Features />
                <Video />

                <AboutUs />
                <Technologies />
                <Softwares />
                {/* <WhyGoldTiger /> */}
                <Certifiactesw />

                <News />
                {/* <OpportuniotiesSection /> */}
                <ContatcUs />
                <Branches />

                {/* <Partners/> */}
                <Footer />
                {/* <CookiePopup/> */}
                <ScrollToTopButton />
                <style>{`
            .max-w-8xl{
                max-width: 85rem;
            }
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
                }
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-dots-lighter {
                        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
                    }
                }
            `}</style>
            </div>
        </>
    );
}
