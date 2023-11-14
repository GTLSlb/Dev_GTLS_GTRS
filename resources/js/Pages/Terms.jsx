import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";
import pallet from "../assets/pictures/pallet.webp";
import { useState, useEffect } from "react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

import Footer from "./Component/landingPage/Footer";
import ContactForm from "./Component/landingPage/ContactForm";
import Chatbot from "./Component/chatBot";
import Navbars from "./Component/navbars";
const navigation = [
    { name: "Services", href: "/#services", ref: "services" },
    { name: "About", href: "/#about", ref: "about" },
    { name: "News", href: "/#news", ref: "news" },
    { name: "Contact Us", href: "/#contact", ref: "contact" },
];
const features = [
    { name: "Origin", description: "Designed by Good Goods, Inc." },
    {
        name: "Material",
        description:
            "Solid walnut base with rare earth magnets and polycarbonate add-ons.",
    },
    { name: "Dimensions", description: '15" x 3.75" x .75"' },
    {
        name: "Finish",
        description: "Hand sanded and finished with natural oil",
    },
    {
        name: "Includes",
        description:
            "Pen Tray, Phone Tray, Small Tray, Large Tray, Sticky Note Holder",
    },
    {
        name: "Considerations",
        description:
            "Made from natural materials. Grain and color vary with each item.",
    },
];
const handleClick = () => {
    history.push("/", { scrollToElement: "news" });
};

export default function Terms(props) {
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
            <Head title="Trading Terms and Conditions" />
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
                            Trading terms and conditions and privacy policy
                        </h2>
                        <a
                            href="/download-docx"
                            className="w-auto inline-block"
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
                                    <span className="text-goldt">1.</span>{" "}
                                    Acceptance
                                </h1>
                                <div className="ml-4">
                                    <ul class="my-8 space-y-4 text-gray-300">
                                        <li class="gap-x-3">
                                            <div className="flex gap-x-3 lg:pb-0 pb-3 lg:my-2">
                                                <span className="text-goldt">
                                                    1.1
                                                </span>
                                                <span>
                                                    GTLS provides logistics
                                                    solutions including
                                                    transport, handling and
                                                    storage of Goods ("the
                                                    Services").
                                                </span>
                                            </div>
                                        </li>
                                        <li class="lg:flex gap-x-3">
                                            <div className="flex gap-x-3 lg:pb-0 pb-3">
                                                {" "}
                                                <span className="text-goldt">
                                                    1.2
                                                </span>
                                                <span>
                                                    Any instructions received by
                                                    GTLS from the Customer for
                                                    the supply of the Services
                                                    shall constitute acceptance
                                                    of the terms of this
                                                    Agreement. Instructions may
                                                    be received in writing
                                                    (including electronically)
                                                    or orally by GTLS from the
                                                    Customer.
                                                </span>
                                            </div>
                                        </li>
                                        <li class="flex gap-x-3">
                                            <span className="text-goldt">
                                                1.3
                                            </span>
                                            <span>
                                                Upon acceptance of these terms
                                                and conditions by the Customer
                                                the terms and conditions are
                                                irrevocable and can only be
                                                rescinded in accordance with
                                                these terms and conditions or
                                                with the written consent of the
                                                Managing Director of GTLS.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </figure>
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">2.</span>{" "}
                                    Definitions
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">2.1</span>{" "}
                                        In this Agreement, the following
                                        definitions shall apply:
                                    </p>

                                    <ul class="my-8 space-y-4 text-gray-300">
                                        <li class="gap-x-3">
                                            <div className="flex gap-x-3 lg:pb-0 pb-3 lg:my-2">
                                                <span className="text-goldt">
                                                    a.
                                                </span>
                                                <span>
                                                    <strong>
                                                        "Acceptance" means:
                                                    </strong>
                                                </span>
                                            </div>

                                            <ul class="lg:ml-7 ml-2">
                                                <li class="gap-x-3 pb-2">
                                                    <div className="flex gap-x-3 pb-2">
                                                        <span className="text-goldt">
                                                            i.
                                                        </span>
                                                        <span>
                                                            Express Acceptance:
                                                        </span>
                                                    </div>
                                                    <ul class="ml-9">
                                                        <li>
                                                            When the customer
                                                            signs these Terms
                                                            &amp; Conditions or
                                                        </li>
                                                        <li>
                                                            When the customer
                                                            confirms by email,
                                                            correspondence or
                                                            words that the Terms
                                                            &amp; Conditions are
                                                            accepted
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li class="gap-x-3 pb-2">
                                                    <div className="flex gap-x-3 pb-2">
                                                        <span className="text-goldt">
                                                            ii.
                                                        </span>
                                                        <span>
                                                            Implied Acceptance:
                                                        </span>
                                                    </div>
                                                    <ul class="ml-9">
                                                        <li>
                                                            When the customer
                                                            acts in a way that
                                                            indicates an
                                                            agreement with the
                                                            Terms and Conditions
                                                            or
                                                        </li>
                                                        <li>
                                                            When the Customer
                                                            starts using the
                                                            services of GTLS or
                                                        </li>
                                                        <li>
                                                            When the customer
                                                            pays for services
                                                            requested from and
                                                            provided by GTLS
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                        <li class="lg:flex gap-x-3">
                                            <div className="flex gap-x-3 lg:pb-0 pb-3">
                                                {" "}
                                                <span className="text-goldt">
                                                    b.
                                                </span>
                                                <span>
                                                    <strong>
                                                        "Agreement" means this
                                                        agreement and any
                                                        schedule or annexure to
                                                        this agreement and
                                                        includes any variation
                                                        agreed by the parties in
                                                        writing.
                                                    </strong>
                                                </span>
                                            </div>
                                        </li>
                                        <li class="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                <strong>
                                                    "Business Day" means a day
                                                    other than a Saturday,
                                                    Sunday or gazetted public
                                                    holiday in the capital city
                                                    of the state in which the
                                                    Services are predominantly
                                                    delivered.
                                                </strong>
                                            </span>
                                        </li>
                                        <li class="flex gap-x-3">
                                            <span className="text-goldt">
                                                d.
                                            </span>
                                            <span>
                                                <strong>
                                                    "Consignee" shall mean the
                                                    person to whom the Goods are
                                                    to be delivered by way of
                                                    GTLS’s Services.
                                                </strong>
                                            </span>
                                        </li>
                                        <li class="flex gap-x-3">
                                            <span className="text-goldt">
                                                e.
                                            </span>
                                            <span>
                                                <strong>
                                                    "Customer" shall mean any
                                                    customer who engages GTLS to
                                                    provide the Services and
                                                    includes any person or
                                                    persons acting on behalf of
                                                    and with the authority of
                                                    the Customer. Where more
                                                    than one Customer has
                                                    entered into this Agreement,
                                                    the Customers shall be
                                                    jointly and severally liable
                                                    for all payments of the
                                                    Price and otherwise
                                                    complying with this
                                                    Agreement.
                                                </strong>
                                            </span>
                                        </li>
                                        <li class="flex gap-x-3">
                                            <span className="text-goldt">
                                                f.
                                            </span>
                                            <span>
                                                <strong>
                                                    "Goods" means any goods
                                                    collected, carried,
                                                    transported, delivered or
                                                    stored by GTLS for or on
                                                    behalf of the Customer, and
                                                    includes cargo together with
                                                    any container, packaging, or
                                                    pallet(s) to be moved from
                                                    one place to another by way
                                                    of GTLS’s Services, or for
                                                    storage by GTLS.
                                                </strong>
                                            </span>
                                        </li>
                                        <li class="flex gap-x-3">
                                            <span className="text-goldt">
                                                g.
                                            </span>
                                            <span>
                                                <strong>
                                                    "GST" means a tax on goods,
                                                    services and other things
                                                    including any value added
                                                    tax, broad based consumption
                                                    tax or other similar tax
                                                    introduced in any
                                                    jurisdiction in Australia,
                                                    and includes taxes levied in
                                                    accordance with the A New
                                                    Tax System (Goods and
                                                    Services Tax) Act 1999
                                                    (Cth).
                                                </strong>
                                            </span>
                                        </li>
                                        <li class="flex gap-x-3">
                                            <span className="text-goldt">
                                                h.
                                            </span>
                                            <span>
                                                <strong>
                                                    "GTLS" shall mean Gold Tiger
                                                    Logistics Solutions Pty Ltd
                                                    A.C.N. 142 447 818 and its
                                                    successors and assigns or
                                                    any person acting on behalf
                                                    of and with the authority of
                                                    GTLS.
                                                </strong>
                                            </span>
                                        </li>
                                        <li class="flex gap-x-3">
                                            <span className="text-goldt">
                                                i.
                                            </span>
                                            <span>
                                                <strong>
                                                    "Guarantor" means that
                                                    person (or persons), or
                                                    entity who agrees herein to
                                                    be liable for the debts of
                                                    the Customer on a principal
                                                    debtor basis.
                                                </strong>
                                            </span>
                                        </li>
                                        <li class="flex gap-x-3">
                                            <span className="text-goldt">
                                                j.
                                            </span>
                                            <span>
                                                <strong>
                                                    "Intellectual Property
                                                    Rights" means all
                                                    intellectual property
                                                    rights, including patents,
                                                    registered and unregistered
                                                    designs, registered and
                                                    unregistered designs
                                                    trademarks and service
                                                    marks, rights in the nature
                                                    of unfair competition
                                                    rights, copyright, database
                                                    rights, typographical
                                                    arrangements, report formats
                                                    and all similar property
                                                    rights including those
                                                    subsisting (in any part of
                                                    the world) in inventions,
                                                    designs, drawings,
                                                    performances, computer
                                                    programs, semi-conductor
                                                    topographies, trade secrets,
                                                    business names, goodwill and
                                                    the style of and
                                                    presentation of goods or
                                                    services and applications
                                                    for protection of any of the
                                                    above rights.
                                                </strong>
                                            </span>
                                        </li>
                                        <li class="flex gap-x-3">
                                            <span className="text-goldt">
                                                k.
                                            </span>
                                            <span>
                                                <strong>
                                                    "Price" means the fees and
                                                    charges set out in any
                                                    quotation on the condition
                                                    any such quotation is
                                                    accepted by the Customer
                                                    within thirty (30) days from
                                                    the date such quotation is
                                                    provided to the Customer;
                                                    otherwise, the price shall
                                                    be as indicated on invoices
                                                    provided by GTLS to the
                                                    Customer in respect of
                                                    Services supplied.
                                                </strong>
                                            </span>
                                        </li>
                                        <li class="flex gap-x-3">
                                            <span className="text-goldt">
                                                l.
                                            </span>
                                            <span>
                                                <strong>
                                                    "Services" shall mean all
                                                    services supplied by GTLS to
                                                    the Customer and are as
                                                    described on the quotations,
                                                    invoices, consignment note,
                                                    airway bills, manifests,
                                                    sales order or any other
                                                    forms as provided by GTLS to
                                                    the Customer and includes
                                                    any advice or
                                                    recommendations.
                                                </strong>
                                            </span>
                                        </li>
                                        <li class=" gap-x-3 pb-2">
                                            <div className="flex gap-x-3 pb-2">
                                                <span className="text-goldt">
                                                    m.
                                                </span>
                                                <span>
                                                    <strong>
                                                        "Sub-Contractor" shall
                                                        mean and include:
                                                    </strong>
                                                </span>
                                            </div>
                                            <ul class="lg:ml-7 ml-2">
                                                <li class="flex gap-x-3">
                                                    <span className="text-goldt">
                                                        i.
                                                    </span>
                                                    <span>
                                                        Railways or airways
                                                        operated by the
                                                        Commonwealth or any
                                                        state or any other
                                                        country or by any
                                                        corporation; or
                                                    </span>
                                                </li>
                                                <li class="flex gap-x-3">
                                                    <span className="text-goldt">
                                                        ii.
                                                    </span>
                                                    <span>
                                                        Any other person, firm
                                                        or GTLS with whom GTLS
                                                        may arrange for the
                                                        carriage or storage of
                                                        any Goods the subject of
                                                        the contract; or
                                                    </span>
                                                </li>
                                                <li class="flex gap-x-3">
                                                    <span className="text-goldt">
                                                        iii.
                                                    </span>
                                                    <span>
                                                        Any person who is now or
                                                        hereafter a servant,
                                                        agent, employee or
                                                        sub-contractor of any of
                                                        the persons referred to
                                                        in clause 2.1(l)(i) and
                                                        clause 2.1(l(ii)).
                                                    </span>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">3.</span>{" "}
                                    Interpretation
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        These terms and conditions are to be
                                        read in conjunction with GTLS’s
                                        quotation, consignment note, agreement,
                                        airway bills, manifests, or any other
                                        forms as provided by GTLS to the
                                        Customer. If there are any
                                        inconsistencies between these documents
                                        then the terms and conditions contained
                                        in this document shall prevail.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">4.</span> Term
                                    and Termination
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">4.1</span>{" "}
                                        The acceptance of these terms and
                                        conditions by the Customer means that an
                                        Agreement is created between the
                                        Customer and GTLS and, unless the
                                        Customer wishes to enter into a formal
                                        and more permanent Contract with GTLS,
                                        this agreement is per consignment basis
                                        and is automatically renewed every time
                                        the customer retains the services of
                                        GTLS. The length of the term of the
                                        agreement shall be dependent on the
                                        Customer and GTLS unless otherwise
                                        agreed in writing between GTLS and the
                                        Customer. The Customer may renew the
                                        Term by providing GTLS with further work
                                        however, either party can terminate the
                                        Agreement in accordance with the
                                        sub-clauses below
                                    </p>

                                    <p className="text-gray-200 mt-2">
                                        <span className="text-goldt">4.2</span>{" "}
                                        GTLS may terminate this Agreement and
                                        cease to provide the Services
                                        immediately if:{" "}
                                    </p>

                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                The Customer fails to pay any
                                                invoice by the due date;
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                The Customer fails to rectify a
                                                breach of this Agreement within
                                                fourteen (14) days after being
                                                given notice by GTLS requiring
                                                it to do so;
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                The Customer enters any
                                                arrangement with its creditors
                                                or becomes subject to external
                                                administration or ceases to be
                                                able to pay its debts as and
                                                when they become due;
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                d.
                                            </span>
                                            <span>
                                                The Customer ceases to carry on
                                                business; or
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                e.
                                            </span>
                                            <span>
                                                If in accordance with clause
                                                18.1 the Customer receives a
                                                credit score, which in GTLS's
                                                absolute discretion is deemed
                                                too low or is indicative that
                                                the Customer is likely to be a
                                                credit risk.
                                            </span>
                                        </li>
                                    </ul>

                                    <p className="text-gray-200 mt-2">
                                        <span className="text-goldt">4.3</span>{" "}
                                        The Customer may terminate this
                                        Agreement if:{" "}
                                    </p>

                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                GTLS fails to rectify a breach
                                                of this Agreement within
                                                fourteen (14) days after being
                                                given notice by the Customer
                                                requiring it to do so;
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                GTLS enters any arrangement with
                                                its creditors or becomes subject
                                                to external administration or
                                                ceases to be able to pay its
                                                debts as and when they become
                                                due;
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                GTLS ceases to carry on
                                                business.
                                            </span>
                                        </li>
                                    </ul>

                                    <p className="text-gray-200 mt-2">
                                        <span className="text-goldt">4.4</span>{" "}
                                        Termination does not relieve either
                                        party of its obligations pursuant to
                                        this Agreement.
                                    </p>

                                    <p className="text-gray-200 my-5">
                                        <span className="text-goldt">4.5</span>{" "}
                                        Upon the effective date of termination
                                        of this Agreement:
                                    </p>
                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                GTLS shall immediately cease
                                                providing the Services; and
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                Any and all payment obligations
                                                of the Customer pursuant to this
                                                Agreement shall become due
                                                immediately.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">5.</span> Price
                                    And Payment
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">5.1</span>{" "}
                                        In consideration for performance of the
                                        Services, the Customer shall pay to GTLS
                                        the Price for all Services in accordance
                                        with this Agreement.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">5.2</span>{" "}
                                        GTLS may by giving notice to the
                                        Customer increase the Price of the
                                        Services to reflect any increase in the
                                        cost to GTLS beyond the reasonable
                                        control of GTLS (including, without
                                        limitation, foreign exchange
                                        fluctuations, or increases in taxes or
                                        customs duties or insurance premiums or
                                        warehousing costs).
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">5.3</span>{" "}
                                        GTLS may charge freight by weight,
                                        measurement or value, and may at any
                                        time re-weigh, or revalue or remeasure
                                        or require the Goods to be re-weighed,
                                        or re-valued or re-measured and charge
                                        proportional additional freight
                                        accordingly.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">5.4</span>{" "}
                                        GTLS’s charges shall be considered
                                        earned in the case of Goods for carriage
                                        as soon as the Goods are loaded and
                                        despatched from the Customer’s premises.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">5.5</span>{" "}
                                        GTLS shall render a tax invoice to the
                                        Customer for the Services specifying the
                                        Price at the end of each consignment or
                                        alternatively at the end of each week or
                                        otherwise as agreed with the Customer.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">5.6</span>{" "}
                                        Time for payment for the Services shall
                                        be of the essence and will be stated on
                                        the invoice, consignment note, airway
                                        bills, manifests or any other forms. If
                                        no time is stated, then payment shall be
                                        due thirty (30) days following the date
                                        of the invoice. If an invoice is not
                                        paid by the due date, interest will be
                                        payable by the Customer to GTLS in
                                        accordance with clause 16.1.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">5.7</span>{" "}
                                        At GTLS’s sole discretion;
                                    </p>

                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                Payment shall be due on delivery
                                                of the Goods, or
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                Payment for approved Customers
                                                shall be made by instalments in
                                                accordance with GTLS’s payment
                                                schedule
                                            </span>
                                        </li>
                                    </ul>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">5.8</span>{" "}
                                        Payment will be made by cash, or by
                                        cheque, or by bank cheque, or by credit
                                        card (plus a CC surcharge fee), or by
                                        direct credit, or by any other method as
                                        agreed to between the Customer and GTLS.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">5.9</span>{" "}
                                        Goods and services tax and other taxes
                                        and duties that may be applicable shall
                                        be added to the Price except when they
                                        are expressly included in the Price.
                                    </p>

                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">5.10</span>{" "}
                                        The Customer must:
                                    </p>

                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                Pay reasonable surcharges as
                                                arising and in accordance with
                                                GTLS’s written or verbal
                                                communication of a requirement
                                                to do so to ensure safe,
                                                compliant, profitable, carriage
                                                of Goods.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                Pay reasonable charges arising
                                                and in accordance with GTLS’s
                                                written or verbal communication
                                                of a requirement to do so for
                                                freight services arising that
                                                have not been quoted by GTLS.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                Pay additional charges which are
                                                to be agreed by the parties
                                                whether verbally or in writing
                                                where the service requires a
                                                specialised vehicle to complete
                                                the task, such as a tailgate or
                                                tail-lift, hand unload,
                                                upper-level delivery, or other
                                                exception where additional costs
                                                arise.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                d.
                                            </span>
                                            <span>
                                                Pay demurrage charges in
                                                accordance with clause 9 where a
                                                GTLS vehicle is unduly delayed
                                                at collection or delivery.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                e.
                                            </span>
                                            <span>
                                                Pay additional charges for
                                                express freight where such
                                                service is requested by the
                                                Customer and charges are agreed.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                f.
                                            </span>
                                            <span>
                                                Pay additional charges for
                                                dangerous goods, container
                                                tailgates, Australian Quarantine
                                                and Inspection Service and
                                                customs services and
                                                inspections, futile delivery,
                                                couriers, weekend, public
                                                holiday, or out of business
                                                hours transport, and similar
                                                charges.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                g.
                                            </span>
                                            <span>
                                                Pay statutory fines arising from
                                                non-compliance, misstatements of
                                                weight, dimension, or
                                                composition of goods, or falsely
                                                declared or missing
                                                documentation.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                h.
                                            </span>
                                            <span>
                                                Pay fees without notice or prior
                                                agreement between GTLS and the
                                                Customer, where charges are
                                                reasonably levied by GTLS for
                                                unforeseen circumstances or are
                                                incurred to directly mitigate a
                                                higher consequential cost to the
                                                client (perceived or real), or
                                                if the client cannot be
                                                contacted during or after
                                                business hours and action is
                                                required to avert higher
                                                potential cost or losses.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                i.
                                            </span>
                                            <span>
                                                Pay for charges arising for the
                                                hire, recovery and or
                                                replacement of all pallets
                                                listed on consignment notes by
                                                GTLS for transportation of the
                                                Goods, where the Customer’s
                                                equipment exchange or transfer
                                                procedures fail, and
                                                consequential costs arise.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                j.
                                            </span>
                                            <span>
                                                Pay additional charges for
                                                container detention (for late
                                                off hire), container wharf
                                                storage (for late import
                                                container collection), container
                                                late lodgement (for late export
                                                container delivery), or other
                                                related costs for container
                                                cleaning, or container repair
                                                due to damages, where it is
                                                obliged to do so.
                                            </span>
                                        </li>
                                    </ul>

                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">5.11</span>{" "}
                                        This clause shall survive termination of
                                        this Agreement.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">6.</span>{" "}
                                    Carriage
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">6.1</span>{" "}
                                        If the Customer instructs GTLS to use a
                                        particular method of carriage whether by
                                        road, rail, sea or air GTLS will give
                                        priority to the method designated but if
                                        that method cannot conveniently be
                                        adopted by GTLS the Customer shall be
                                        deemed to authorise GTLS to carry or
                                        have the Goods carried by another method
                                        or methods.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">6.2</span>{" "}
                                        The Customer shall be deemed to
                                        authorise any deviation from the usual
                                        route or manner of carriage of Goods
                                        that may in the absolute discretion of
                                        GTLS be deemed reasonable or necessary
                                        in the circumstances.
                                    </p>

                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">6.3</span>{" "}
                                        If a container has not been stowed by or
                                        on behalf of GTLS, GTLS shall not be
                                        liable for loss of or damage to the
                                        Goods caused by:
                                    </p>
                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                The manner in which the
                                                container has been stowed; or
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                The unsuitability of the Goods
                                                for carriage or storage in
                                                containers; or
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                The unsuitability or defective
                                                condition of the container
                                            </span>
                                        </li>
                                    </ul>

                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">6.4</span>{" "}
                                        With respect to delivery of any Goods
                                        for the Customer:
                                    </p>
                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                GTLS is authorised to deliver
                                                the Goods at the address given
                                                to GTLS by the Customer for that
                                                purpose and it is expressly
                                                agreed that GTLS shall be taken
                                                to have delivered the Goods in
                                                accordance with this Agreement
                                                if at that address GTLS obtains
                                                from any person a receipt or a
                                                signed docket for delivery of
                                                the Goods.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                If the address given to GTLS for
                                                the purposes of delivery is
                                                unattended at the time of
                                                delivery, or if delivery cannot
                                                be effected by GTLS (other than
                                                by reason of the negligence)
                                                then GTLS may deposit the Goods
                                                at that address (which shall be
                                                deemed to be delivery under this
                                                Agreement) or store the Goods at
                                                a place where GTLS deems
                                                necessary or appropriate to
                                                store those Goods, and if the
                                                Goods are stored the Customer
                                                shall pay GTLS for all costs and
                                                expenses incurred of and
                                                incidental to that Storage and
                                                redelivery.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                The Customer agrees that the
                                                person delivering any Goods GTLS
                                                for carriage or transportation
                                                and or Storage is authorised to
                                                sign the documentation
                                                evidencing this agreement for or
                                                on behalf of the Customer.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">7.</span>{" "}
                                    Nomination Of Sub-Contractor
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        The Customer hereby authorises GTLS (if
                                        GTLS should think fit to do so) to
                                        arrange with a Sub-Contractor for the
                                        carriage of any Goods that are the
                                        subject of this Agreement. Any such
                                        arrangement shall be deemed to be
                                        ratified by the Customer upon delivery
                                        of the said Goods to such
                                        Sub-Contractor, who shall there upon be
                                        entitled to the full benefit of these
                                        terms and conditions to the same extent
                                        as GTLS. In so far as it may be
                                        necessary to ensure that such
                                        Sub-Contractor shall be so entitled GTLS
                                        shall be deemed to enter into this
                                        Agreement for its own benefit and also
                                        as agent for the Sub-Contractor.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">8.</span>{" "}
                                    Change of Control
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">8.1</span>{" "}
                                        The Customer shall give GTLS not less
                                        than fourteen (14) days prior written
                                        notice of any proposed change of
                                        ownership of the Customer, including any
                                        change in control of the Customer, or
                                        any change in the Customer’s name and/or
                                        any other change in the Customer’s
                                        details (including but not limited to,
                                        changes in the Customer’s address, email
                                        address, or business practice).
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">8.2</span>{" "}
                                        The Customer shall be liable for any
                                        loss incurred by GTLS as a result of the
                                        Customer’s failure to comply with this
                                        clause.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">9.</span>{" "}
                                    Demurrage
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        The Customer will be and shall remain
                                        responsible to GTLS for all its proper
                                        charges incurred for any reason. A
                                        charge may be made by GTLS in respect of
                                        any delay in excess of thirty (30)
                                        minutes in loading or unloading
                                        occurring other than from the default of
                                        GTLS. Such permissible delay period
                                        shall commence upon GTLS reporting for
                                        loading or unloading at the gate (as
                                        opposed to the dock), ready to load or
                                        unload. Labour to load or unload the
                                        vehicle shall be the responsibility and
                                        expense of the Customer or Consignee.
                                        Unless otherwise agreed in writing
                                        between the parties, demurrage shall be
                                        payable by the Customer to GTLS at the
                                        rate of $90 per hour.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">10.</span> Lien
                                    and Security
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">10.1</span>{" "}
                                        GTLS has a general lien on Goods the
                                        subject of this Agreement for all
                                        amounts due or which become due on any
                                        account to GTLS by the Customer or its
                                        Related Entities (as defined in the
                                        Corporations Act 2001 (Cth), whether for
                                        the Services or otherwise
                                    </p>

                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">10.2</span>{" "}
                                        If any amounts due or which become due
                                        by the Customer to GTLS are not paid, or
                                        the Customer fails to take delivery or
                                        return of any products and/or goods,
                                        GTLS may without notice (and in the case
                                        of perishable or dangerous products
                                        and/or goods immediately):
                                    </p>

                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                Store the Goods as GTLS thinks
                                                fit at the Customer’s risk and
                                                expense;
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                Open any package and sell all or
                                                any of the Goods as GTLS thinks
                                                fit and apply the proceeds to
                                                discharge the lien and costs of
                                                sale;
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                Deduct or set-off any monies
                                                (including the costs of storage
                                                of any Goods) due to GTLS by the
                                                Customer under any this
                                                Agreement or otherwise; and/or
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                d.
                                            </span>
                                            <span>
                                                Claim a storer’s lien over the
                                                Goods.
                                            </span>
                                        </li>
                                    </ul>

                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">10.3</span>{" "}
                                        This clause shall survive termination of
                                        this Agreement.
                                    </p>
                                    <span className="text-goldt">10.4</span>
                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                A term used in this clause 10.4
                                                has the same meaning as in the
                                                Personal Properties Securities
                                                Act 2009 (Cth) ('PPSA').
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                For so long as any monies owing
                                                by the Customer to GTLS under
                                                this Agreement remain unpaid,
                                                the Customer acknowledges that
                                                GTLS maintains a Security
                                                Interest in the Goods under the
                                                PPSA and this Agreement shall
                                                constitute a Security Agreement
                                                that covers the Goods for the
                                                purposes of the PPSA.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                The Customer will, at the
                                                request of GTLS, do anything
                                                (including obtaining consents,
                                                giving notices or directions to
                                                any person, making amendments to
                                                this Agreement or Security
                                                Agreement or executing a new
                                                document) for the purpose of (i)
                                                ensuring that any Security
                                                Interest granted by the Customer
                                                to GTLS attaches to the Goods or
                                                collateral intended to be
                                                covered by that Security
                                                Interest, is enforceable,
                                                perfected and otherwise
                                                effective, and has the priority
                                                required by GTLS; (ii) enabling
                                                GTLS to prepare and register a
                                                financing statement or financing
                                                change statement or (iii)
                                                enabling GTLS to exercise any of
                                                its rights or powers in
                                                connection with any such
                                                Security Interest.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                d.
                                            </span>
                                            <span>
                                                The Customer will promptly
                                                provide any information
                                                requested by GTLS in connection
                                                with any Security Interest
                                                granted by the Customer to GTLS
                                                to enable GTLS to exercise any
                                                of its rights or powers or
                                                perform any of its obligations
                                                under the PPSA.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                e.
                                            </span>
                                            <span>
                                                The Customer waives its right to
                                                receive any notices (including
                                                notice of a verification
                                                statement) required to be given
                                                under the PPSA unless that
                                                requirement cannot be excluded.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                f.
                                            </span>
                                            <span>
                                                Except if section 275(7) of the
                                                PPSA applies, each of GTLS and
                                                the Customer agree not to
                                                disclose any information of the
                                                kind referred to in section
                                                275(1) of the PPSA that is not
                                                publicly available.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                g.
                                            </span>
                                            <span>
                                                Despite anything contained in
                                                this Agreement, GTLS is not
                                                required to disclose any
                                                information of the kind referred
                                                to in section 275(1) of the
                                                PPSA.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                h.
                                            </span>
                                            <span>
                                                Anything that the Customer is
                                                required by GTLS to do under
                                                this clause 10.4 must be done by
                                                the Customer at its own expense.
                                                The Customer agrees to reimburse
                                                on demand GTLS’s costs
                                                (including all legal and other
                                                professional costs (including
                                                all legal and other professional
                                                costs on a full indemnity basis)
                                                in connection with any action
                                                taken by GTLS under or in
                                                connection with this clause
                                                10.4.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">11.</span>{" "}
                                    Dangerous Goods
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">11.1</span>{" "}
                                        Unless otherwise agreed in advance in
                                        writing with GTLS the Customer or his
                                        authorised agent shall not tender for
                                        carriage or for storage any explosive,
                                        inflammable or otherwise Dangerous
                                        Goods. The Customer shall be liable for
                                        and hereby indemnifies GTLS for all loss
                                        or damage whatsoever caused by any
                                        Dangerous Goods.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">11.2</span>{" "}
                                        If the parties agree that Dangerous
                                        Goods are to be carried or stored by
                                        GTLS, then prior to each delivery of
                                        Goods or collection for storage, the
                                        Customer shall provide to GTLS in
                                        writing the precise details of the
                                        class, volume and packaging type of
                                        dangerous or hazardous Goods by way of
                                        an appropriate Material Safety Sheet and
                                        Emergency Procedure Guide so that GTLS
                                        in its absolute discretion may accept or
                                        decline to proceed with the transaction,
                                        and should it proceed, accordingly
                                        notify all parties as required to ensure
                                        compliance in the transport storage and
                                        handling of dangerous class goods.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">11.3</span>{" "}
                                        In the event of discovery by GTLS of
                                        hazardous or dangerous Goods not being
                                        disclosed GTLS may hold the discovered
                                        dangerous Goods at a nominated depot, at
                                        the expense of the Customer, for the
                                        Customer to then arrange appropriate
                                        measures to rectify the non-compliance
                                        and allow resumption of transport
                                        services.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">11.4</span>{" "}
                                        In the event that the Customer fails or
                                        neglects to notify GTLS of dangerous
                                        goods presented for carriage, handling
                                        or Storage, then the Customer will be
                                        liable for all and any loss or losses
                                        attributable to that nondisclosure to
                                        GTLS.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">12.</span>{" "}
                                    Storage
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">12.1</span>{" "}
                                        GTLS reserves the right to refuse at its
                                        discretion the storage of any Goods.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">12.2</span>{" "}
                                        All goods are stored entirely at the
                                        risk of the Customer and GTLS accepts no
                                        liability for the Goods whatsoever.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">12.3</span>{" "}
                                        GTLS relies on the Customer to supply
                                        details of the description,
                                        pallet/space, weight, items, quantity,
                                        value and measurement and condition of
                                        the Goods as supplied by the Customer.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">12.4</span>{" "}
                                        GTLS will not be liable for loss or
                                        damage to the Goods for ullage up to and
                                        including an amount equal to two percent
                                        (2%) of the value of the Goods.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">13.</span>{" "}
                                    Pallet Services
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">13.1</span>{" "}
                                        The Customer agrees without exception,
                                        that GTLS has no obligation or right,
                                        nor liability, to manage pallet
                                        equipment hire on behalf of the
                                        Customer, the consignee, the consignor,
                                        or its Sub-contractors. GTLS will record
                                        pallet equipment details on its
                                        consignment notes if they are provided
                                        by the Customer, however GTLS cannot
                                        verify and does not admit to the
                                        accuracy of this information.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">13.2</span>{" "}
                                        The Customer shall indemnify GTLS
                                        without limitation against claims for
                                        any loss or costs arising from pallet
                                        equipment control errors and failed
                                        practise in pallet management by any
                                        party.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">14.</span>{" "}
                                    Delivery
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">14.1</span>{" "}
                                        It is agreed that the person delivering
                                        any Goods to GTLS for carriage or
                                        forwarding is authorised to sign the
                                        consignment note for the Customer.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">14.2</span>{" "}
                                        It is the Customer’s sole responsibility
                                        to address adequately each consignment
                                        and to provide written delivery
                                        instructions to enable effective
                                        delivery.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">14.3</span>{" "}
                                        GTLS is authorised to deliver the Goods
                                        at the address given to GTLS by the
                                        Customer for that purpose and it is
                                        expressly agreed that GTLS shall be
                                        taken to have delivered the Goods in
                                        accordance with this contract if at that
                                        address GTLS obtains from any person a
                                        receipt or a signed delivery docket for
                                        the Goods
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">14.4</span>{" "}
                                        The Customer expressly warrants to GTLS
                                        that the Customer is either the owner or
                                        the authorised agent of the owner of any
                                        Goods or property that is the subject
                                        matter of this contract of cartage
                                        and/or storage and by entering into this
                                        Agreement the Customer accepts these
                                        conditions of contract for the Consignee
                                        as well as for all other persons on
                                        whose behalf the Customer is acting.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">14.5</span>{" "}
                                        GTLS may deliver the Goods in separate
                                        instalments (in accordance with the
                                        agreed delivery schedule). Each separate
                                        instalment shall be invoiced and paid
                                        for in accordance with the provisions in
                                        this contract.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">14.6</span>{" "}
                                        Delivery of the Goods to a third party
                                        nominated by the Customer is deemed to
                                        be delivery for the purposes of this
                                        Agreement.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">14.7</span>{" "}
                                        The failure of GTLS to deliver shall not
                                        entitle the Customer to treat this
                                        Agreement as repudiated.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">15.</span>{" "}
                                    Claims, Liability and Insurance
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">15.1</span>{" "}
                                        GTLS is not a Common Carrier and will
                                        accept no liability as such. All
                                        articles are carried or transported and
                                        all storage and other services are
                                        performed by GTLS subject only to these
                                        conditions and GTLS reserves the right
                                        to refuse the carriage or transport of
                                        articles for any person, corporation or
                                        body, and the carriage or transport of
                                        any class of articles at its discretion.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">15.2</span>{" "}
                                        GTLS accepts no liability for, and the
                                        Customer releases and indemnifies GTLS
                                        against all loss, damage, costs and
                                        expense from any claim by the Customer
                                        in tort (including negligence),
                                        contract, bailment or otherwise for loss
                                        or damage to any property, injury to, or
                                        death of any person arising out of the
                                        acts or omissions of GTLS, or any or all
                                        of the Goods, any delay, non-delivery or
                                        other failure to supply the Goods,
                                        deterioration, damage, contamination or
                                        loss of Goods or any failure arising or
                                        delay out of the storage of the Goods.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">15.3</span>{" "}
                                        Except as expressly provided in this
                                        agreement, GTLS is not under any
                                        liability to the Customer in respect of
                                        any loss, damage, injury, claims,
                                        demands, costs or expenses, howsoever
                                        caused, which may be suffered or
                                        incurred or which may arise in respect
                                        of the provision of the Services,
                                        including any loss of, damage to or
                                        deterioration or contamination of the
                                        Goods, or any delay, non-delivery,
                                        misdirection of Goods, or other failure
                                        to supply the Goods, or supply the Goods
                                        in time, or arising out of the Goods, or
                                        this Agreement.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">15.4</span>{" "}
                                        The Customer acknowledges and accepts
                                        that:
                                    </p>
                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                The Goods and Services are
                                                provided, carried, handled, and
                                                stored solely at the Customer's
                                                risk, and GTLS is under no
                                                obligation to arrange insurance
                                                to cover Goods and Services for
                                                the Customer against any form of
                                                direct or consequential loss
                                                arising, nor shall it arrange
                                                such insurance of any kind
                                                whatsoever, unless effected in
                                                writing by special arrangement.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                By entering into this Agreement,
                                                the Customer has not relied upon
                                                any representation or warranty
                                                about its subject matter except
                                                as provided in this Agreement.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                No claim may be made against
                                                GTLS for failure to arrange
                                                insurance on behalf of the
                                                Customer or for not insuring
                                                Goods in transit, handling, and
                                                storage or for outcomes of
                                                Services provided by GTLS.
                                            </span>
                                        </li>
                                    </ul>

                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">15.5</span>{" "}
                                        Subject to any statutory provisions
                                        imposing liability in respect of the
                                        loss of or damage to the Goods
                                        (including but not limited to chilled,
                                        frozen, refrigerated or perishable
                                        Goods), GTLS shall not be under any
                                        liability for any damage to, loss,
                                        deterioration, mis-delivery, delay in
                                        delivery or non-delivery of the Goods
                                        (whether the Goods are or have been in
                                        the possession of GTLS or not) nor for
                                        any instructions, advice, information or
                                        service given or provided to any person,
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">15.6</span>{" "}
                                        In no event shall GTLS be liable for any
                                        special, incidental, indirect or
                                        consequential damages (including,
                                        without limiting generality, damages for
                                        loss of business profits, business
                                        interruption and loss of business
                                        information or computer programs) or
                                        exemplary or punitive damages or damage
                                        to personal property.
                                    </p>

                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">15.7</span>{" "}
                                        The Customer shall indemnify GTLS from,
                                        and defend and hold GTLS harmless from
                                        and against any and all damages, losses,
                                        liability and expenses (including
                                        reasonable legal fees) suffered or
                                        incurred by any GTLS or to which GTLS
                                        becomes subject, arising out of or
                                        relating to any claim:
                                    </p>

                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                GTLS shall not be liable for any
                                                claims or damages arising from
                                                the Customer's breach of its
                                                representations or warranties
                                                under this Agreement.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                GTLS shall not be liable for any
                                                claims or damages relating to
                                                personal injury or property
                                                damage to any Customer employee,
                                                contractor, representative, or
                                                other Customer designee.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                GTLS shall not be liable for any
                                                claims or damages relating to
                                                claims by the Customer's
                                                suppliers and/or third-party
                                                providers.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                d.
                                            </span>
                                            <span>
                                                GTLS shall not be liable for any
                                                other claims or damages arising
                                                from the Customer's business,
                                                resources, or services.
                                            </span>
                                        </li>
                                    </ul>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">15.8</span>{" "}
                                        The Customer's liability pursuant to
                                        this sub-clause 15.7 shall be reduced
                                        proportionally to the extent that any
                                        unlawful, wrongful, wilful or negligent
                                        act or omission of GTLS caused or
                                        contributed to the liability or loss.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">15.9</span>{" "}
                                        The Customer acknowledges that, GTLS’s
                                        liability to the Customer arising out of
                                        or in connection with this Agreement
                                        (including the performance or
                                        non-performance of the Services),
                                        whether under the law of contract, in
                                        tort, in equity, under statute or
                                        otherwise, shall be limited in the
                                        aggregate either a resupply of the
                                        Services or an amount equivalent to the
                                        supply of the Services.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">
                                            15.10
                                        </span>{" "}
                                        GTLS shall be deemed to have been
                                        discharged from all liability in respect
                                        of the Services whether under contract,
                                        in tort, in equity, under statute or
                                        otherwise, at the expiration of the
                                        Term, or if no date is specified, on the
                                        expiration of 3 years from the
                                        completion of the Services.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">
                                            15.11
                                        </span>{" "}
                                        The Customer undertakes that no claim or
                                        allegation shall be made against any
                                        servant or agent of GTLS which attempts
                                        to impose upon any of them any liability
                                        whatsoever in connection with the Goods
                                        and, if any such claim or allegation
                                        should nevertheless be made, to
                                        indemnify GTLS and any such servant or
                                        agent against all consequences thereof.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">
                                            15.12
                                        </span>{" "}
                                        Nothing in this Agreement is intended to
                                        have the effect of contracting out of
                                        any applicable provisions of the
                                        Australian Consumer Law, Sales of Goods
                                        legislation or Fair-Trading legislation
                                        in each of the States and Territories of
                                        Australia, except to the extent
                                        permitted by those Acts where
                                        applicable.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">
                                            15.13
                                        </span>{" "}
                                        Liability of GTLS arising out of any one
                                        incident whether or not there has been
                                        any declaration of value of the Goods,
                                        for breach of warranty implied into
                                        these terms and conditions by the
                                        Australian Consumer Law or howsoever
                                        arising, is limited to any of the
                                        following as determined by GTLS;
                                    </p>

                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                GTLS may, at its discretion,
                                                supply the Services again.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                GTLS may, at its discretion, pay
                                                the cost of having the Services
                                                supplied again.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                If the Customer is a consumer as
                                                defined in the Australian
                                                Consumer Law, the Customer is
                                                also entitled to a refund.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">16.</span>{" "}
                                    Default & Consequences Of Default
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">16.1</span>{" "}
                                        Interest on overdue invoices shall
                                        accrue from the date when payment
                                        becomes due daily until the date of
                                        payment at a rate of 3.5% per calendar
                                        month and such interest shall compound
                                        monthly at such a rate after as well as
                                        before any judgement.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">16.2</span>{" "}
                                        If the Customer defaults in payment of
                                        any invoice when due, the Customer shall
                                        indemnify GTLS from and against all
                                        costs and disbursements incurred by GTLS
                                        in pursuing the debt including legal
                                        costs on a solicitor and own client
                                        basis and GTLS’s collection agency
                                        costs.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">16.3</span>{" "}
                                        Without prejudice to any other remedies
                                        GTLS may have, if at any time the
                                        Customer is in breach of any obligation
                                        (including those relating to payment),
                                        GTLS may suspend or terminate the supply
                                        of Services to the Customer and any of
                                        its other obligations under the terms
                                        and conditions.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">16.4</span>{" "}
                                        GTLS will not be liable to the Customer
                                        for any loss or damage the Customer
                                        suffers because GTLS exercised its
                                        rights under this clause.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">16.5</span>{" "}
                                        If any account remains overdue after
                                        thirty (30) days, then an amount of the
                                        greater of $20.00 or 10.00% of the
                                        amount overdue (up to a maximum of $200)
                                        shall be levied for administration fees
                                        which sum shall become immediately due
                                        and payable.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">16.6</span>{" "}
                                        Without prejudice to GTLS’s other
                                        remedies at law GTLS shall be entitled
                                        to cancel all or any part of any order
                                        of the Customer which remains
                                        unperformed in addition to and without
                                        prejudice to any other remedies and all
                                        amounts owing to GTLS shall, whether or
                                        not due for payment, become immediately
                                        payable in the event that:
                                    </p>
                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                If any money payable to GTLS
                                                becomes overdue, or in GTLS’s
                                                opinion the Customer will be
                                                unable to meet its payments as
                                                they fall due.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                If the Customer becomes
                                                insolvent, convenes a meeting
                                                with its creditors or proposes
                                                or enters into an arrangement
                                                with creditors, or makes an
                                                assignment for the benefit of
                                                its creditors.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                If a receiver, manager,
                                                liquidator (provisional or
                                                otherwise) or similar person is
                                                appointed in respect of the
                                                Customer or any asset of the
                                                Customer.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">17.</span>{" "}
                                    Security And Charge
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">17.1</span>{" "}
                                        Despite anything to the contrary
                                        contained herein or any other rights
                                        which GTLS may have howsoever:
                                    </p>

                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                Where the Customer and/or the
                                                Guarantor (if any) is the owner
                                                of land, realty or any other
                                                asset capable of being charged,
                                                both the Customer and/or the
                                                Guarantor agree to mortgage
                                                and/or charge all of their joint
                                                and/or several interest in the
                                                said land, realty or any other
                                                asset to GTLS or its nominee to
                                                secure.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                All amounts and other monetary
                                                obligations payable under the
                                                terms and conditions. The
                                                Customer and/or the Guarantor
                                                acknowledge and agree that GTLS
                                                (or GTLS’s nominee) shall be
                                                entitled to lodge where
                                                appropriate a caveat, which
                                                caveat shall be released once
                                                all payments and other monetary
                                                obligations payable hereunder
                                                have been met.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                Should GTLS elect to proceed in
                                                any manner in accordance with
                                                this clause and/or its
                                                subclauses, the Customer and/or
                                                Guarantor shall indemnify GTLS
                                                from and against all GTLS’s
                                                costs and disbursements
                                                including legal costs on a
                                                solicitor and own client basis.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                d.
                                            </span>
                                            <span>
                                                The Customer and/or the
                                                Guarantor (if any) agree to
                                                irrevocably nominate constitute
                                                and appoint GTLS or GTLS’s
                                                nominee as the Customer’s and/or
                                                Guarantor’s true and lawful
                                                attorney to perform all
                                                necessary acts to give effect to
                                                the provisions of this clause
                                                17.1.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">18.</span>{" "}
                                    Privacy Act 1988
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">18.1</span>{" "}
                                        The Customer and/or the Guarantor/s
                                        agree for GTLS to obtain from a credit
                                        reporting agency a credit report
                                        containing personal credit information
                                        about the Customer and Guarantor/s in
                                        relation to credit provided by GTLS.
                                    </p>
                                    <p className="text-gray-200 mb-2">
                                        <span className="text-goldt">18.2</span>{" "}
                                        The Customer and/or the Guarantor/s
                                        agree that GTLS may exchange information
                                        about the Customer and the Guarantor/s
                                        with those credit providers either named
                                        as trade referees by the Customer or
                                        named in a consumer credit report issued
                                        by a credit reporting agency for the
                                        following purposes:
                                    </p>
                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                To assess an application by the
                                                Customer.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                To notify other credit providers
                                                of a default by the Customer.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                To exchange information with
                                                other credit providers as to the
                                                status of this credit account,
                                                where the Customer is in default
                                                with other credit providers.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                d.
                                            </span>
                                            <span>
                                                To assess the credit worthiness
                                                of the Customer and/or
                                                Guarantor/s.
                                            </span>
                                        </li>
                                    </ul>

                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">18.3</span>{" "}
                                        The Customer consents to GTLS being
                                        given a consumer credit report to
                                        collect overdue payment on commercial
                                        credit (Section 18K(1)(h) Privacy Act
                                        1988).
                                    </p>

                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">18.4</span>{" "}
                                        The Customer agrees that personal credit
                                        information provided may be used and
                                        retained by GTLS for the following
                                        purposes and for other purposes as shall
                                        be agreed between the Customer and GTLS
                                        or required by law from time to time:
                                    </p>

                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>Provision of Services.</span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                Marketing of Services by GTLS,
                                                its agents or distributors in
                                                relation to the Services.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                Analysing, verifying and/or
                                                checking the Customer’s credit,
                                                payment and/or status in
                                                relation to provision of
                                                Services.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                d.
                                            </span>
                                            <span>
                                                Processing of any payment
                                                instructions, direct debit
                                                facilities and/or credit
                                                facilities requested by
                                                Customer.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                e.
                                            </span>
                                            <span>
                                                Enabling the daily operation of
                                                Customer’s account and/or the
                                                collection of amounts
                                                outstanding in the Customer’s
                                                account in relation to the
                                                Services.
                                            </span>
                                        </li>
                                    </ul>

                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">18.5</span>{" "}
                                        GTLS may give information about the
                                        Customer to a credit reporting agency
                                        for the following purposes:
                                    </p>

                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                To obtain a consumer credit
                                                report about the Customer.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                Allow the credit reporting
                                                agency to create or maintain a
                                                credit information file
                                                containing information about the
                                                Customer.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">19.</span>{" "}
                                    Cancellation
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">19.1</span>{" "}
                                        GTLS may cancel any Services to which
                                        these terms and conditions apply or
                                        cancel delivery of Goods at any time
                                        before the Goods are delivered by giving
                                        written notice to the Customer.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">19.2</span>{" "}
                                        GTLS shall not be liable for any loss or
                                        damage whatever arising from such
                                        cancellation.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">19.3</span>{" "}
                                        In the event that the Customer cancels
                                        delivery of Goods the Customer shall be
                                        liable for any loss incurred by GTLS
                                        (including, but not limited to, any loss
                                        of profits) up to the time of
                                        cancellation. Subject to clause 10, all
                                        and any monies owing by the Customer to
                                        GTLS must be paid in full before any
                                        Goods held by GTLS at the time of
                                        cancellation are released by GTLS to the
                                        Customer.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">20.</span>{" "}
                                    Proprietary Rights
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">20.1</span>{" "}
                                        The Customer acknowledges that all
                                        rights, title and interests in and to
                                        GTLS Intellectual Property Rights,
                                        including all modifications, changes and
                                        enhancements to the Intellectual
                                        Property Rights, are and shall be the
                                        sole and exclusive property of GTLS or
                                        its licensor. The Customer hereby
                                        assigns, and shall cause its employees,
                                        agents and contractors to assign to
                                        GTLS, all rights, title and interest in
                                        and to the Intellectual Property Rights
                                        including all modifications, changes and
                                        enhancements thereto.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">20.2</span>{" "}
                                        Notwithstanding anything to the contrary
                                        in this Agreement or otherwise, GTLS
                                        shall retain all right, title and
                                        interest in and to any and all ideas,
                                        concepts, know-how, development tools,
                                        methodologies, processes, procedures,
                                        technologies or algorithms ("GTLS
                                        Know-How").
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">20.3</span>{" "}
                                        This clause shall survive termination of
                                        this Agreement.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">21.</span>{" "}
                                    Guarantee
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">21.1</span>{" "}
                                        In consideration of the Customer
                                        contracting with GTLS, the Guarantor/s,
                                        evidenced by the Guarantor's signature
                                        to this Agreement, jointly and severally
                                        guarantee the performance by the
                                        Customer of all of the Customer's
                                        obligations under this Agreement.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">21.2</span>{" "}
                                        The Guarantor indemnifies GTLS against
                                        any cost or loss whatsoever arising as a
                                        result of the default by the Customer in
                                        performing its obligations under this
                                        Agreement for whatever reason.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">21.3</span>{" "}
                                        GTLS may seek to recover any loss from
                                        the Guarantor before seeking recovery
                                        from the Customer and any settlement or
                                        compromise with the Customer will not
                                        release the Guarantor from the
                                        obligation to pay any balance that may
                                        be owing to GTLS
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">21.4</span>{" "}
                                        This guarantee is binding on the
                                        Guarantor, their executors,
                                        administrators and assigns and the
                                        benefit of the guarantee is available to
                                        any assignee of the benefit of this
                                        Agreement by GTLS.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">22.</span>{" "}
                                    Confidential Information
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">22.1</span>{" "}
                                        Each party may have access to
                                        information that is proprietary or
                                        confidential to the other party (the
                                        "Confidential Information").
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">22.2</span>{" "}
                                        Each party shall for the benefit of the
                                        other hold the Confidential Information
                                        in confidence by taking reasonable
                                        measures (and at least those measures
                                        consistent with normal industry
                                        practice) to prevent unauthorised
                                        disclosure of such Confidential
                                        Information, in any form, to any third
                                        party and use Confidential Information
                                        only for the purposes specified in this
                                        Agreement.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">22.3</span>{" "}
                                        Each party shall hold the Confidential
                                        Information in confidence by taking
                                        reasonable measures (and at least those
                                        measures consistent with normal industry
                                        practice) to prevent unauthorised
                                        disclosure of such Confidential
                                        Information, in any form, to any third
                                        party (other than as permitted in
                                        accordance with this Agreement) and use
                                        Confidential Information only for the
                                        purposes specified in this Agreement.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">22.4</span>{" "}
                                        Confidential Information shall not
                                        include information which
                                    </p>
                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                i.
                                            </span>
                                            <span>
                                                Is or becomes publicly known
                                                through no act or omission of
                                                the recipient and without breach
                                                of this Agreement.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                ii.
                                            </span>
                                            <span>
                                                Is known and on record by the
                                                receiving party prior to
                                                disclosure by the disclosing
                                                party.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                iii.
                                            </span>
                                            <span>
                                                Where the recipient can
                                                demonstrate with competent
                                                written proof what was in the
                                                recipient's possession prior to
                                                such access or disclosure (other
                                                than through an unauthorized
                                                disclosure).
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                iv.
                                            </span>
                                            <span>
                                                Is disclosed to the recipient by
                                                a third party having legitimate
                                                possession thereof without
                                                restriction on such disclosure.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                v.
                                            </span>
                                            <span>
                                                Is independently developed by
                                                the recipient without violating
                                                the proprietary rights of the
                                                disclosing party and is so
                                                documented by the recipient.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                vi.
                                            </span>
                                            <span>
                                                Is lawfully obtained by the
                                                receiving party from a third
                                                party who is free to disclose
                                                same.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                vii.
                                            </span>
                                            <span>
                                                Is ascertainable from other
                                                commercial sources in the
                                                marketplace.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                viii.
                                            </span>
                                            <span>
                                                Is disclosed on the order or
                                                reasonable request of any court
                                                of law or judicial or
                                                quasi-judicial body, provided
                                                that such disclosure is covered
                                                by a suitable protective order.
                                            </span>
                                        </li>
                                    </ul>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">22.5</span>{" "}
                                        This clause shall survive termination of
                                        this Agreement.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    <span className="text-goldt">23.</span>{" "}
                                    General
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">23.1</span>{" "}
                                        A notice, consent, approval or other
                                        communication (each a "Notice") under
                                        this Agreement must be signed by or on
                                        behalf of the person giving it,
                                        addressed to the person to whom it is to
                                        be given and
                                    </p>

                                    <ul
                                        role="list"
                                        className="my-8 ml-4 space-y-2 text-gray-300"
                                    >
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                a.
                                            </span>
                                            <span>
                                                Delivered to that person's
                                                address.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                b.
                                            </span>
                                            <span>
                                                Sent by pre-paid mail to that
                                                person's address.
                                            </span>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <span className="text-goldt">
                                                c.
                                            </span>
                                            <span>
                                                Transmitted by email to that
                                                person's address. A Notice given
                                                to a party in accordance with
                                                this clause is treated as having
                                                been given and received{" "}
                                            </span>
                                        </li>
                                        <ul
                                            role="list"
                                            className="my-8 space-y-2 text-gray-300 lg:ml-7 ml-4"
                                        >
                                            <li className="flex gap-x-3">
                                                <span className="text-goldt">
                                                    a.
                                                </span>
                                                <span>
                                                    If delivered to a person's
                                                    address, on the day of
                                                    delivery if before 5.00pm on
                                                    a Business Day, or otherwise
                                                    on the next following
                                                    Business Day.
                                                </span>
                                            </li>
                                            <li className="flex gap-x-3">
                                                <span className="text-goldt">
                                                    b.
                                                </span>
                                                <span>
                                                    If sent by pre-paid mail,
                                                    when received at the offices
                                                    of the addressee.
                                                </span>
                                            </li>
                                            <li className="flex gap-x-3">
                                                <span className="text-goldt">
                                                    c.
                                                </span>
                                                <span>
                                                    If transmitted by email, on
                                                    the day of transmission if
                                                    transmitted before 5.00pm in
                                                    the place of receipt on a
                                                    Business Day, otherwise on
                                                    the next following Business
                                                    Day.
                                                </span>
                                            </li>
                                        </ul>
                                    </ul>
                                    <p className="text-gray-200 mb-3">
                                        This clause shall survive termination of
                                        this Agreement
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">23.2</span>{" "}
                                        If any provision of these terms and
                                        conditions shall be invalid, void,
                                        illegal or unenforceable the validity,
                                        existence, legality and enforceability
                                        of the remaining provisions shall not be
                                        affected, prejudiced or impaired.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">23.3</span>{" "}
                                        These terms and conditions and any
                                        contract to which they apply shall be
                                        governed by the laws of New South Wales
                                        and are subject to the jurisdiction of
                                        the courts of New South Wales.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">23.4</span>{" "}
                                        The Customer shall not be entitled to
                                        set off against or deduct from the Price
                                        any sums owed or claimed to be owed to
                                        the Customer by GTLS.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">23.5</span>{" "}
                                        GTLS reserves the right to review these
                                        terms and conditions at any time. If,
                                        following any such review, there is to
                                        be any change to these terms and
                                        conditions, then that change will take
                                        effect from the date on which GTLS
                                        notifies the Customer of such change.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">23.6</span>{" "}
                                        Neither party shall be liable for any
                                        default due to any act of God, war,
                                        terrorism, strike, lock-out, industrial
                                        action, fire, flood, drought, storm or
                                        other event beyond the reasonable
                                        control of either party.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">23.7</span>{" "}
                                        The terms and conditions set out herein
                                        shall prevail over the terms and
                                        conditions set out in any document used
                                        by the Customer, the owner or any other
                                        person having an interest in the Goods
                                        and purporting to have a contractual
                                        effect.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">23.8</span>{" "}
                                        The failure by GTLS to enforce any
                                        provision of these terms and conditions
                                        shall not be treated as a waiver of that
                                        provision, nor shall it affect GTLS’s
                                        right to subsequently enforce that
                                        provision.
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Gold Tiger Logistics Solutions Pty Ltd –
                                    Privacy Policy
                                </h1>
                                <div className="ml-4">
                                    <p className="text-gray-200 font-bold">
                                        Gold Tiger Logistics Solutions Privacy
                                        Policy
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">1.</span>{" "}
                                        GTLS is committed to providing you with
                                        the best possible customer service
                                        experience. GTLS is bound by the Privacy
                                        Act 1988 (Cth), which sets out a number
                                        of principles concerning the privacy of
                                        individuals
                                    </p>
                                    <p className="text-gray-200 font-bold">
                                        Collection of your personal information
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">2.</span>{" "}
                                        There are many aspects of the site which
                                        can be viewed without providing personal
                                        information, however, for access to
                                        future GTLS customer support features
                                        you are required to submit personally
                                        identifiable information. This may
                                        include but not be limited to a unique
                                        username and password or provide
                                        sensitive information in the recovery of
                                        your lost password.
                                    </p>
                                    <p className="text-gray-200 font-bold">
                                        Sharing of your personal information.
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">3.</span>{" "}
                                        We may occasionally hire other companies
                                        to provide services on our behalf,
                                        including but not limited to handling
                                        customer support enquiries, processing
                                        transactions or customer freight
                                        shipping. Those companies will be
                                        permitted to obtain only the personal
                                        information they need to deliver the
                                        service. GTLS takes reasonable steps to
                                        ensure that these Organisations are
                                        bound by confidentiality and privacy
                                        obligations in relation to the
                                        protection of your personal information.
                                    </p>
                                    <p className="text-gray-200 font-bold">
                                        Use of your personal information
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span>
                                            <span className="text-goldt">
                                                4.
                                            </span>{" "}
                                            For each visitor to reach the site,
                                            we expressively collect the
                                            following non-personally
                                            identifiable information, including
                                            but not limited to browser type,
                                            version and language, operating
                                            system, pages viewed while browsing
                                            the Site, page access times and
                                            referring website address.
                                        </span>
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span>
                                            <span className="text-goldt">
                                                5.
                                            </span>{" "}
                                            This collected information is used
                                            solely internally for the purpose of
                                            gauging visitor traffic, trends and
                                            delivering personalised content to
                                            you while you are at this Site.
                                        </span>
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span>
                                            <span className="text-goldt">
                                                6.
                                            </span>{" "}
                                            From time to time, we may use
                                            customer information for new,
                                            unanticipated uses not previously
                                            disclosed in our privacy notice. If
                                            our information practices change at
                                            some time in the future we will use
                                            for these new purposes only, data
                                            collected from the time of the
                                            policy change forward will adhere to
                                            our updated practices.
                                        </span>
                                    </p>

                                    <p className="text-gray-200 font-bold">
                                        Changes to this Privacy Policy
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">7.</span>{" "}
                                        GTLS reserves the right to make
                                        amendments to this Privacy Policy at any
                                        time. If you have objections to the
                                        Privacy Policy, you should not access or
                                        use the Site.
                                    </p>
                                    <p className="text-gray-200 font-bold">
                                        Accessing Your Personal Information
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">8.</span>{" "}
                                        You have a right to access your personal
                                        information, subject to exceptions
                                        allowed by law. If you would like to do
                                        so, please let us know. You may be
                                        required to put your request in writing
                                        for security reasons. GTLS reserves the
                                        right to charge a fee for searching for,
                                        and providing access to, your
                                        information on a per request basis.
                                    </p>
                                    <p className="text-gray-200 font-bold">
                                        Contacting us
                                    </p>
                                    <p className="text-gray-200 mb-3">
                                        <span className="text-goldt">9.</span>{" "}
                                        Gold Tiger Logistics Solutions welcomes
                                        your comments regarding this Privacy
                                        Policy. If you have any questions about
                                        this Privacy Policy and would like
                                        further information, please contact our
                                        Managing Director by email
                                        imad@gtls.com.au
                                    </p>
                                </div>
                            </figure>
                        </div>
                        <div className="text-goldd w-full flex justify-center font-bold">
                            Gold Tiger Logistics Solutions, 3B Inglis Road,
                            Ingleburn, NSW, 2565
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
