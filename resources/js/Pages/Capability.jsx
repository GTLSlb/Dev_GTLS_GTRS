import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";
import pallet from "../assets/pictures/pallet.webp";
import { useState, useEffect } from "react";

import Navbars from "./Component/navbars";


export default function Capability(props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumePreview, setResumePreview] = useState(null);

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
            <Head title="Capability Statement" />
            <div className="relative isolate bg-dark">
                {/* <Chatbot /> */}
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
                            Capability Statement
                        </h2>
                        <a
                            href="/downloadGTLS-docx"
                            className="w-auto inline-block "
                        >
                            <button className=" flex items-center gap-x-2 mt-5 rounded-3xl   px-10 py-2.5 text-center text-md font-bold text-white hover:text-goldt shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="text-goldt w-8 h-auto"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                                    />
                                </svg>
                                <span>Download as PDF</span>
                            </button>
                        </a>
                    </div>
                </div>
                <div className="relative isolate overflow-hidden  py-16 sm:py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Gold Tiger Logistics Solutions Pty Ltd
                                </h1>
                                <p className=" font-bold text-smooth">
                                    Gold Tiger Logistics Solutions (Gold Tiger)
                                    was established in 2006 by a young man with
                                    a passion for trucks who was determined to
                                    develop a successful business. That young
                                    man, Imad El Masri, has built his one-man,
                                    one-truck business into a powerhouse – an
                                    integrated transport, warehousing and
                                    distribution company that partners with
                                    national FMCG, food and packaging giants to
                                    move, store and deliver their goods all over
                                    Australia. Using its top-quality Volvo
                                    fleet, leading-edge technology and an
                                    all-employee driver workforce, Gold Tiger
                                    customises unique solutions to each client’s
                                    needs at a competitive price.
                                </p>
                            </figure>
                        </div>

                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Core competencies
                                </h1>
                                <p className=" font-bold text-goldt">
                                    Transport
                                </p>
                                <p className="text-gray-200 mb-3">
                                    Interstate linehaul, intrastate, regional,
                                    metropolitan and last-mile delivery, express
                                    or general, all around Australia.
                                </p>
                                <p className="text-goldt font-bold">
                                    Warehousing
                                </p>
                                <p className="text-gray-200 mb-3">
                                    Short or long-term storage solutions,
                                    container handling and cross-docking, in
                                    warehouses around Australia. Check and
                                    manage your inventory in our warehouses
                                    through your computer system’s interface
                                    with our JAIX warehouse management system.
                                </p>
                                <p className="text-goldt font-bold">
                                    Distribution
                                </p>
                                <p className="text-gray-200 mb-3">
                                    Distribute from our warehouses to your
                                    distribution hubs or let us deliver that
                                    last mile to your individual stores.
                                </p>
                                <p className="text-goldt font-bold">
                                    Technology/documentation
                                </p>
                                <p className="text-gray-200 mb-3">
                                    We use leading technologies throughout our
                                    operations, from track and trace through to
                                    radio frequency identification, sign on
                                    glass and inventory management software. We
                                    can also integrate our systems with our
                                    clients’ systems, enabling you to see the
                                    same data that we do.
                                </p>
                                <p className="text-goldt font-bold">
                                    3PL/4PL solutions
                                </p>
                                <p className="text-gray-200 mb-3">
                                    Gold Tiger offers solutions based on the
                                    third party and fourth party logistics
                                    models, with Gold Tiger supplying and
                                    managing all parts of the logistics chain.
                                </p>
                            </figure>
                        </div>

                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10 ">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Key capabilities and strengths
                                </h1>

                                <ul
                                    role="list"
                                    className="my-8  space-y-2 text-gray-300"
                                >
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Integrated 3PL and 4PL solutions all
                                            over the Australia for palletised
                                            freight.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            No two clients are the same, so we
                                            customise solutions to our clients’
                                            unique needs.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Proactive problem solving – we
                                            monitor problems as they arise and
                                            provide solutions before, they cost
                                            our clients time and money.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Strong focus on customer service and
                                            keeping our promises to clients.{" "}
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Head office/warehouse in Sydney
                                            (Ingleburn) NSW as well large
                                            Melbourne office/warehouse
                                            (Dandenong South) and Brisbane
                                            (Parkinson site).
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Management team members with
                                            extensive experience in the
                                            transport industry at all levels.
                                            Our workforce numbers more than 120
                                            and growing.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Top-quality Volvo vehicle fleet that
                                            encompasses more than 80 prime
                                            movers, 100 trailers and 30 delivery
                                            trucks. Includes B-doubles with
                                            mezzanine decks.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Accreditations for NHVAS, HACCP,
                                            BFM.
                                        </span>
                                    </li>
                                </ul>
                            </figure>
                        </div>

                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10 ">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Comparative advantages and differentiators
                                </h1>

                                <ul
                                    role="list"
                                    className="my-8  space-y-2 text-gray-300"
                                >
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Gold Tiger’s drivers are all
                                            employees, not contractors, which
                                            means they are exclusively dedicated
                                            to the needs of our clients.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            For new clients, Gold Tiger conducts
                                            a transition-in program over several
                                            weeks covering areas such as service
                                            levels, technology, communication,
                                            relationships, expectations,
                                            reporting, KPIs and documentation to
                                            ensure we become an integrated part
                                            of your business.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Gold Tiger owns its Sydney office
                                            and warehouse and its vehicle fleet.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Driver and truck performance and
                                            location are monitored through
                                            Volvo’s Dynafleet on-board software
                                            package. The data produced is
                                            accessible to clients in real time.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Our gold partnership with Volvo
                                            provides a regular maintenance
                                            schedule to the highest manufacturer
                                            standards (OEM replacement parts),
                                            24-hour breakdown repair around
                                            Australia, and replacement vehicles
                                            if trucks need to be off the road
                                            more than 24 hours.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Excellent use of technology for
                                            track and trace, RFID and inventory
                                            management. We can integrate with
                                            client systems to provide access to
                                            extensive data and reports.
                                        </span>
                                    </li>
                                </ul>
                            </figure>
                        </div>

                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10 ">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Experience and track record
                                </h1>

                                <ul
                                    role="list"
                                    className="my-8  space-y-2 text-gray-300"
                                >
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            More than 2.7 million tonnes of
                                            freight transported around Australia
                                            annually, with more than 500,000
                                            tonnes moved for our largest client.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            We have more than 40 clients from
                                            industries including Food,
                                            packaging, manufacturing, retail,
                                            industrial and FMCG. Prominent
                                            clients include Unilever, Freedom
                                            Food, Sigma Healthcare, CIA
                                            Logistics, Triangle Logistics, TMA
                                            Group and Austral Bricks.
                                        </span>
                                    </li>
                                </ul>
                            </figure>
                        </div>

                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10 ">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Health and safety
                                </h1>

                                <ul
                                    role="list"
                                    className="my-8  space-y-2 text-gray-300"
                                >
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            All drivers have the relevant
                                            driving licences and tickets they
                                            need to complete their work safely
                                            and use any required equipment. Our
                                            drivers are professionals with
                                            excellent driving skills and are
                                            trained in topics such as fatigue
                                            management, mass management and
                                            dangerous goods.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            We have an outstanding health and
                                            safety record (no injuries) and our
                                            drivers have accident-free driving
                                            records.
                                        </span>
                                    </li>

                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Our trucks are equipped with Volvo’s
                                            Dynafleet software package, which
                                            monitors driver and truck
                                            performance, and the Volvo safety
                                            pack.
                                        </span>
                                    </li>
                                </ul>
                            </figure>
                            <div className="border border-goldd rounded sm:border-0">
                                <div className="flex flex-col justify-center gap-y-2 p-5">
                                    <p className="text-smooth w-auto flex sm:justify-left">
                                        <span className="text-goldt font-bold">
                                            Head Office:{" "}
                                        </span>
                                        3B Inglis Road, Ingleburn NSW 2565{" "}
                                    </p>
                                    <p className="text-smooth flex sm:justify-left">
                                        <span className="text-goldt font-bold">
                                            Melbourne branch:{" "}
                                        </span>{" "}
                                        60 – 70 Monash Dr, Dandenong South VIC
                                        3175
                                    </p>
                                    <p className="text-smooth flex sm:justify-left">
                                        <span className="text-goldt font-bold">
                                            Brisbane branch:{" "}
                                        </span>
                                        Unit 2/58 Precinct St, Parkinson QLD
                                        4115{" "}
                                    </p>
                                    <p className="text-smooth flex sm:justify-left">
                                        <span className="text-goldt font-bold">
                                            Phone:{" "}
                                        </span>{" "}
                                        1800- 040-306 {" "}
                                        
                                    </p> 
                                    <p className="text-smooth flex sm:justify-left">
                                    <span className="text-goldt font-bold">
                                            Email:{" "}
                                        </span>{" "}
                                        enquiries@gtls.com.au
                                    </p>
                                    <p className="text-smooth flex sm:justify-left">
                                        <span className="text-goldt font-bold">
                                            Director:{" "}
                                        </span>
                                        Imad El Masri, 0420 227 222
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
