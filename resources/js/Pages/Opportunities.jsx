import { Link, usePage, Inertia } from "@inertiajs/inertia-react";
import { Head } from "@inertiajs/react";
import goldTigerLogo from "../assets/pictures/goldTigerLogo.webp";
import submitform from "../assets/pictures/submitform.webp";
import jobs from "../assets/pictures/jobs.webp";
import pallet from "../assets/pictures/pallet.webp";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

import {
    Bars3Icon,
    XMarkIcon,
    PhoneIcon,
    ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import {
    CloudArrowUpIcon,
    LockClosedIcon,
    ServerIcon,
} from "@heroicons/react/20/solid";
import { Link as ScrollLink } from "react-scroll";
import Footer from "./Component/landingPage/Footer";
import ContactForm from "./Component/landingPage/ContactForm";
import SecondaryFooter from "./Component/landingPage/SecondaryFooter";
import Chatbot from "./Component/chatBot";
import Navbars from "./Component/navbars";
import TruckDriver from "./Component/opportunities/TruckDriver";
import Mechanic from "./Component/opportunities/Mechanic";
import HaulDriver from "./Component/opportunities/HaulDriver";
const navigation = [
    { name: "Services", href: "/#services", ref: "services" },
    { name: "About", href: "/#about", ref: "about" },
    { name: "News", href: "/#news", ref: "news" },
    { name: "Contact Us", href: "/#contact", ref: "contact" },
];
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const handleClick = () => {
    history.push("/", { scrollToElement: "news" });
};

export default function Opportunities(props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumePreview, setResumePreview] = useState(null);
    const [jobsarray, setJobsarray] = useState([
        {
            id: 0,
            name: "Truck driver",
            description:
                "Solid walnut base with rare earth magnets and polycarbonate add-ons.",
            html: <TruckDriver />,
            current: true,
        },
        {
            id: 1,
            name: "Diesel Mechanic",
            description:
                "Gold Tiger Maintenance is Australian owned family business offering Freight Distribution and Warehousing Solutions.",
            html: <Mechanic />,
            current: false,
        },
        {
            id: 2,
            name: "MC Linehaul Drivers",
            description: "Hand sanded and finished with natural oil",
            html: <HaulDriver />,
            current: false,
        },
    ]);
    const [activeJob, setActiveJob] = useState(0);

    function changeActiveJob(index) {
        setActiveJob(index);
        const updatedElements = jobsarray.map((element) => {
            if (element.id === index) {
                return { ...element, current: true };
            } else {
                return { ...element, current: false };
            }
        });
        setJobsarray(updatedElements);
    }

    const handleFileUpload = (file) => {
        setResumeFile(file);
        setResumePreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        let prevScrollPosition = window.pageYOffset;

        function handleScroll() {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            setShowNavbar(scrollTop > 0);
        }

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <Head title="Opportunities" />
            <div className="relative isolate bg-dark">
                <Chatbot />
                <Navbars />
                {/* <HeroSection/> */}

                <div aria-hidden="true" className="relative">
                    <img
                        src={jobs}
                        alt="jobs"
                        className="h-96 w-full object-cover object-center "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                </div>

                <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                        <h2 className="text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                            CAREERS AT GOLD TIGER
                        </h2>
                        <p className="mt-4 text-gray-300">
                            Gold Tiger Logistic Solutions is a dynamic,
                            fast-growing national company that is constantly
                            seeking new employees across the areas of transport
                            (truck drivers), customer service, administration,
                            operations and warehousing. We have large operations
                            in Sydney (head office), Melbourne and Brisbane and
                            smaller operations in Adelaide and Perth. During
                            2020-21 our operations and customer base doubled in
                            size, creating many opportunities for advancement
                            and for university and TAFE graduates to get their
                            first full-time job.
                        </p>
                    </div>
                </div>
                <div className="relative isolate overflow-hidden  py-16 sm:py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto mt-16    lg:mx-0 lg:mt-10 ">
                            <div className="relative ">
                                <figure className="mb-10">
                                    <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                        Attractive package of conditions
                                    </h1>
                                    <p className="text-gray-200">
                                        Gold Tiger offers an attractive package
                                        of work conditions:
                                    </p>

                                    <ul
                                        role="list"
                                        className="mt-8 max-w-xl space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3 items-center">
                                            <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                            <span>
                                                Flexible working hours to help
                                                accommodate family or other
                                                responsibilities.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3 items-center">
                                            <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                            <span>
                                                An all-employee workforce, with
                                                no short-term contracts.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3 items-center">
                                            <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                            <span>
                                                Permanent full-time and
                                                part-time positions.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3 items-center">
                                            <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                            <span>
                                                Pay rates/salaries that are
                                                above the award/market rates.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3 items-center">
                                            <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                            <span>
                                                Strong internal culture and
                                                policies.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3 items-center">
                                            <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                            <span>
                                                A very diverse and welcoming
                                                workforce.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3 items-center">
                                            <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                            <span>
                                                Training suited to your initial
                                                role and further training to
                                                help you advance.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3 items-center">
                                            <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                            <span>
                                                Opportunities to stay with the
                                                company if you move interstate.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3 items-center">
                                            <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                            <span>
                                                Strong work ethic and focus on
                                                the customer.
                                            </span>
                                        </li>
                                    </ul>
                                </figure>
                            </div>
                            <div className=" text-base leading-7 text-gray-700 ">
                                <h1 className="mt-2 text-3xl pb-2 font-bold tracking-tight text-goldt sm:text-3xl">
                                    Opportunities for graduates and workers with
                                    relevant skills
                                </h1>
                                <p className="text-gray-300">
                                    As an employer, we are keen to give new
                                    graduates without industry experience the
                                    opportunity to begin and build their career
                                    in transport and logistics with us. We will
                                    provide training for your new role. For all
                                    interested applicants in general, if you
                                    have relevant skills, enjoy providing
                                    excellent customer service, and are ready to
                                    work and advance in your career, then Gold
                                    Tiger wants to hear from you. We hire new
                                    employees directly rather than using
                                    recruitment agencies, with opportunities for
                                    specific positions advertised on this page
                                    and on Seek. Note that to apply for a
                                    position you must have the right to work in
                                    Australia as a citizen, permanent resident,
                                    or holder of a visa with full-time work
                                    rights. To make a proactive approach to us,
                                    email your cover letter and CV to Mr Al
                                    Nehmani, National Business Manager, at{" "}
                                    <a
                                        className="text-goldt font-bold"
                                        href="mailto:Al.Nehmani@gtls.com.au"
                                    >
                                        Al.Nehmani@gtls.com.au
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="">
                        <div className="relative isolate overflow-hidden  pb-16 sm:pb-16">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                <ul className="flex space-x-2 mt-5 border-b">
                                    {jobsarray.map((job, index) => (
                                        <li
                                            key={index}
                                            className={`cursor-pointer text-xs sm:text-xl py-2 ${
                                                job.current === true
                                                    ? "text-goldt border-b-4  border-goldd font-bold "
                                                    : "text-smooth  "
                                            }`}
                                            onClick={() =>
                                                changeActiveJob(job.id)
                                            }
                                        >
                                            <div className="px-2">
                                                {" "}
                                                {job.name}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="">
                                    {jobsarray[activeJob].html}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative isolate py-24 px-6 sm:py-24 lg:px-8">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
                        <div className="mt-16 flex flex-col gap-16 sm:gap-y-20 lg:flex-row items-center">
                            <div className="w-full lg:w-6/12">
                                <ContactForm />
                            </div>
                            <div className="lg:mt-6 w-full lg:w-6/12 flex flex-col gap-y-10 text-center items-center">
                                <div className=" flex flex-col items-center">
                                    <p className="text-6xl sm:text-[100px] font-bold  text-white">
                                        We Are
                                    </p>
                                    <p className="text-goldt text-7xl sm:text-[120px] leading-none font-bold mt-2">
                                        Hiring
                                    </p>
                                </div>
                                <div className="">
                                    <p className=" flex  text-white text-3xl sm:text-5xl">
                                        Join Our Team
                                    </p>
                                </div>
                                <img
                                    src={pallet}
                                    alt="pallet"
                                    className="w-full h-auto rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
