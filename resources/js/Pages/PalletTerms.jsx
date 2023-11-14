import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";
import { useState, useEffect } from "react";

import Footer from "./Component/landingPage/Footer";
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

export default function PalletTerms(props) {
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
            <Head title="GTLS Pallet T&C" />
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
                            GTLS Pallet Terms and Conditions
                        </h2>
                        <a
                            href="/downloadGTLS-Pallets"
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
                                    Gold Tiger Logistics Solutions Pty Ltd –
                                    Terms & Conditions of Pallet Service Trading
                                    Policy
                                </h1>
                                <p className=" font-bold text-smooth">
                                    Gold Tiger Logistics Solutions will require
                                    the following delay days from the date of
                                    delivery to apply all transfers onto Gold
                                    Tiger Logistics Solutions pallet accounts.
                                    No Exchange of Pallets at pickup (unless
                                    agreed by Management) + 30 Day Delay to all
                                    receivers from date of collection (excluding
                                    Metcash, IGA ,Brave, Bidfood and Lawland
                                    which require a 55 Day Delay) from date of
                                    collection. Gold Tiger Logistics hold a
                                    position as an intermediary party in regard
                                    to pallets.
                                </p>
                            </figure>
                        </div>

                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Definitions
                                </h1>
                                <ul
                                    role="list"
                                    className="my-8  space-y-5 text-gray-300"
                                >
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            If both consignee and receiver have
                                            active pallet accounts, transfers
                                            must be made between them. A copy of
                                            the pallet transfer docket must be
                                            attached to the Gold Tiger Logistic
                                            Solutions consignment note for
                                            reference.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Gold Tiger Logistic Solutions
                                            accepts the transfer of Loscam/Chep
                                            wooden pallets only. Gold Tiger
                                            Logistic Solutions only accept
                                            transfers of Chep code 1001 and
                                            Loscam code WP pallets only. All
                                            other hire equipment (e.g.: cages,
                                            bins, plastic pallets etc.) will not
                                            be accepted onto Gold Tiger Logistic
                                            Solutions account.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            The consignee is responsible to
                                            ensure the prompt forwarding or
                                            submitting of the original docket of
                                            data to Loscam/Chep for processing
                                            within 30 days.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            "For Retail customers into
                                            (Distribution Centres – DC) e.g.
                                            Amazon, Aldi, Coles, K-Mart, Office
                                            Works, Woolworths, Myer, Target.
                                            These transfers onto our account
                                            please ensure to apply the + 30 day
                                            delay, the effective date being the
                                            collection date."
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Should, for any reason, the final
                                            discharge by Chep or Loscam take
                                            place past the 30 days from the
                                            effective date, then the extra days
                                            shall be charged to the customer as
                                            per Gold Tiger Logistics Solutions
                                            Rate card. The number of extra days
                                            charged shall be based on Chep's or
                                            Loscam's calculations.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Gold Tiger Logistic Solutions will
                                            not accept responsibility or
                                            liability for pallet transactions or
                                            rejection enquiries received 30 days
                                            or more after the collection date.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Gold Tiger Logistic Solutions
                                            reserve the right to correct, amend
                                            or reject any submitted transactions
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Gold Tiger will not accept any
                                            transfers onto our account that are
                                            older than 30 days from date of
                                            collection. No exceptions to this
                                            rule.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            In cases where Chep/Loscam pallets
                                            have been transferred onto Gold
                                            Tiger Logistics Solutions account
                                            and the receiver does not have a
                                            Chep/Loscam pallet to exchange or a
                                            Chep/Loscam pallet account then Gold
                                            Tiger Logistics Solutions will hold
                                            delivery of the goods and will
                                            notify the consignee to make other
                                            arrangements. It is the Consignee's
                                            responsibility to ensure that the
                                            receiving customer has a Chep or
                                            Loscam account or to organise other
                                            arrangements before Gold Tiger
                                            Logistics Solutions is retained for
                                            the job failing which, extra costs
                                            (including but not limited to
                                            demurrage) will be incurred.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Where a receiver of Loscam/Chep
                                            pallets does not have a Loscam/Chep
                                            account, or does not have pallets to
                                            exchange at the time of delivery,
                                            Gold Tiger Logistic Solutions
                                            reserves the right to transfer the
                                            pallets back to the sender, with the
                                            same effective transfer date that we
                                            received the pallets. Direct
                                            deliveries from customers to DC's
                                            not going through a GTLS facility
                                            will require the sender to direct
                                            transfer pallets to end customer
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            The consignee accepts responsibility
                                            for raising the Loscam/Chep transfer
                                            docket at time of pick-up to affect
                                            the transfer of the pallets onto
                                            Gold Tiger Logistic Solutions
                                            account. A copy of a fully completed
                                            transfer docket must be signed by
                                            and presented to our driver at time
                                            of pick-up. In the absence of a
                                            docket provided to our driver, the
                                            consignee must email Gold Tiger the
                                            relevant docket within 48 hours from
                                            the time of pick-up. Should this not
                                            occur Gold Tiger Logistics Solutions
                                            shall not accept liability for the
                                            transfer of the pallets.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Gold Tiger Logistics has the right
                                            to reject any pallets that have been
                                            transferred onto our account if it
                                            is deemed damaged, Then the transfer
                                            will be corrected/rejected
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            In instances where a pallet exchange
                                            is to be implemented and the pallets
                                            provided for exchange are less than
                                            the pallets delivered, the
                                            subsequent recovery of the balance
                                            of the pallets shall be charged a
                                            recovery fee of $10.00 per pallet,
                                            plus an administration fee to be
                                            determined at the time of the
                                            recovery. Please note that, as the
                                            recovery of the balance of the
                                            pallets will take place at a later
                                            date, the fees and procedures noted
                                            in clauses 5, 15 and 17 of these
                                            Terms and Conditions (relating to
                                            the 30 days delay) could also apply.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            An administration fee of $3.90 shall
                                            be incurred for any pallet transfer
                                            to Gold Tiger Logistics Solutions
                                            account or from Gold Tiger Logistics
                                            Solutions account.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Chep or Loscam pallets not recovered
                                            or outstanding over 30 days will be
                                            invoiced to the customer / or
                                            trading partner at $0.25 per Chep
                                            pallet plus GST per day and $0.16
                                            per Loscam pallet plus GST per day.
                                            All fees charged by Chep or Loscam
                                            shall be forwarded to the Consignee
                                            within 7 working days from the
                                            receipt of an invoice from Chep or
                                            Loscam to that effect.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Pallet bulk transfers are not
                                            accepted at Gold Tiger Logistics
                                            Solutions. Every consignment must
                                            have its own individual pallet
                                            transfer docket. Such transfer shall
                                            quote the Transfer Date, Consignment
                                            number and the number of pallets
                                            being transferred.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            A signature by Gold Tiger Logistics
                                            Solutions drivers is made on a
                                            "Subject to check" basis and
                                            consignments will be confirmed only
                                            when Gold Tiger Logistics Solutions
                                            accepts it. Any discrepancy between
                                            the number of pallets sent in
                                            accordance with the consignment note
                                            and the number of pallets actually
                                            received shall be charged to the
                                            Consignee at the rate of $55.00 per
                                            pallet plus GST.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            In instances where the pallet
                                            dockets are retained by the
                                            receiving customer and no copy is
                                            provided to Gold Tiger Logistics
                                            Solutions drivers, Gold Tiger
                                            Logistics Solutions shall rely on
                                            the receiving customer's signature
                                            on the Proof of Delivery to infer
                                            that the pallets have been received.
                                            Should the receiving customer
                                            subsequently reject Gold Tiger
                                            Logistics Solutions transfer despite
                                            signing the Proof of Delivery, Gold
                                            Tiger Logistics Solutions reserves
                                            its right to add or forward any
                                            charge incurred to the sending
                                            Customer. in such instances, the
                                            sending customer agrees that Gold
                                            Tiger shall not be responsible for
                                            the dehire of the relevant pallets,
                                            such dehire being the sole
                                            responsibility of the sending
                                            Customer.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Customers are expected to sign these
                                            Terms and Conditions and froward the
                                            signed copy to Gold Tiger Logistics
                                            Solutions offices within 7 working
                                            days from the date of signature
                                            however, the customer acknowledges
                                            that transacting pallet movements
                                            with Gold Tiger Logistic Solutions
                                            constitutes an implicit and implied
                                            agreement to these terms and
                                            conditions and that these Terms and
                                            Conditions are recognized,
                                            acknowledged and accepted.
                                        </span>
                                    </li>
                                    {/* <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                        Consignee agrees that Pallet Services are provided subject to terms and of carriage as detailed in the Gold Tiger Logistic Solutions conditions of carriage and / or Storage. Freight is palletized for ease of delivery only. The Consignee agrees to accept transfer
of hire charges or pay the current price for pallets when the exchange of equivalent pallets can have not been affected at the point of delivery. All Pallet Documentation must be received by Gold Tiger Logistic Solutions within 30 days of the Pickup / Delivery
Date, documentation received after this date may be rejected or have an adjusted effective date applied at the discretion of Gold Tiger Logistic Solutions Pallet Control.
                                        </span>
                                    </li> */}
                                    {/* <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            A signature by Gold Tiger Logistics
                                            Solutions drivers is made on a
                                            "Subject to check" basis and
                                            consignments will be confirmed only
                                            when Gold Tiger Logistics Solutions
                                            accepts it. Any discrepancy between
                                            the number of pallets sent in
                                            accordance with the consignment note
                                            and the number of pallets actually
                                            received shall be charged to the
                                            Consignee at the rate of $55.00 per
                                            pallet plus GST.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            In instances where the pallet
                                            dockets are retained by the
                                            receiving customer and no copy is
                                            provided to Gold Tiger Logistics
                                            Solutions drivers, Gold Tiger
                                            Logistics Solutions shall rely on
                                            the receiving customer's signature
                                            on the Proof of Delivery to infer
                                            that the pallets have been received.
                                            Should the receiving customer
                                            subsequently reject Gold Tiger
                                            Logistics Solutions transfer despite
                                            signing the Proof of Delivery, Gold
                                            Tiger Logistics Solutions reserves
                                            its right to add or forward any
                                            charge incurred to the sending
                                            Customer. in such instances, the
                                            sending customer agrees that Gold
                                            Tiger shall not be responsible for
                                            the dehire of the relevant pallets,
                                            such dehire being the sole
                                            responsibility of the sending
                                            Customer.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Customers are expected to sign these
                                            Terms and Conditions and froward the
                                            signed copy to Gold Tiger Logistics
                                            Solutions offices within 7 working
                                            days from the date of signature
                                            however, the customer acknowledges
                                            that transacting pallet movements
                                            with Gold Tiger Logistic Solutions
                                            constitutes an implicit and implied
                                            agreement to these terms and
                                            conditions and that these Terms and
                                            Conditions are recognized,
                                            acknowledged and accepted.
                                        </span>
                                    </li> */}
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            All pallet queries are to be
                                            forwarded to{" "}
                                            <a
                                                href="mailto:pallets@gtls.com.au"
                                                className="text-goldt"
                                            >
                                                pallets@gtls.com.au
                                            </a>
                                            .
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            Consignee agrees that Pallet
                                            Services are provided subject to
                                            terms and of carriage as detailed in
                                            the Gold Tiger Logistic Solutions
                                            conditions of carriage and / or
                                            Storage. Freight is palletized for
                                            ease of delivery only. The Consignee
                                            agrees to accept transfer of hire
                                            charges or pay the current price for
                                            pallets when the exchange of
                                            equivalent pallets can have not been
                                            affected at the point of delivery.
                                            All Pallet Documentation must be
                                            received by Gold Tiger Logistic
                                            Solutions within 30 days of the
                                            Pickup / Delivery Date,
                                            documentation received after this
                                            date may be rejected or have an
                                            adjusted effective date applied at
                                            the discretion of Gold Tiger
                                            Logistic Solutions Pallet Control.
                                        </span>
                                    </li>
                                </ul>
                            </figure>
                        </div>

                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Privacy Policy
                                </h1>
                                <p className="text-gray-200 mb-3">
                                    “GTLS” shall mean Gold Tiger Logistics
                                    Solutions Pty Ltd T/A GTLS.com.au and its
                                    successors and assigns or any person acting
                                    on behalf of and with the authority of Gold
                                    Tiger Logistics Solutions Pty Ltd T/A
                                    GTLS.com.au.
                                </p>
                                <p className=" font-bold text-goldt">
                                    Gold Tiger Logistics Solutions Privacy
                                    Policy
                                </p>
                                <p className="text-gray-200 mb-3">
                                    Gold Tiger Logistics Solutions is committed
                                    to providing you with the best possible
                                    customer service experience. GTLS is bound
                                    by the Privacy Act 1988 (Crh), which sets
                                    out a number of principles concerning the
                                    privacy of individuals.
                                </p>
                                <p className="text-goldt font-bold">
                                    Collection of your personal information
                                </p>
                                <p className="text-gray-200 mb-3">
                                    There are many aspects of the site which can
                                    be viewed without providing personal
                                    information, however, for access to future
                                    GTLS customer support features you are
                                    required to submit personally identifiable
                                    information. This may include but not
                                    limited to a unique username and password,
                                    or provide sensitive information in the
                                    recovery of your lost password.
                                </p>
                                <p className="text-goldt font-bold">
                                    Sharing of your personal information.
                                </p>
                                <p className="text-gray-200 mb-3">
                                    We may occasionally hire other companies to
                                    provide services on our behalf, including
                                    but not limited to handling customer support
                                    enquiries, processing transactions or
                                    customer freight shipping. Those companies
                                    will be permitted to obtain only the
                                    personal information they need to deliver
                                    the service. GTLS takes reasonable steps to
                                    ensure that these organisations are bound by
                                    confidentiality and privacy obligations in
                                    relation to the protection of your personal
                                    information.
                                </p>
                                <p className="text-goldt font-bold">
                                    Use of your personal information
                                </p>
                                <p className="text-gray-200 mb-3">
                                    For each visitor to reach the site, we
                                    expressively collect the following
                                    non-personally identifiable information,
                                    including but not limited to browser type,
                                    version and language, operating system,
                                    pages viewed while browsing the Site, page
                                    access times and referring website address.
                                    This collected information is used solely
                                    internally for the purpose of gauging
                                    visitor traffic, trends and delivering
                                    personalized content to you while you are at
                                    this Site.
                                </p>
                                <p className="text-gray-200 mb-3">
                                    From time to time, we may use customer
                                    information for new, unanticipated uses not
                                    previously disclosed in our privacy notice.
                                    If our information practices change at some
                                    time in the future we will use for these new
                                    purposes only, data collected from the time
                                    of the policy change going forward will
                                    adhere to our updated practices.
                                </p>
                                <p className="text-goldt font-bold">
                                    Changes to this Privacy Policy
                                </p>
                                <p className="text-gray-200 mb-3">
                                    GTLS reserves the right to make amendments
                                    to this Privacy Policy at any time. If you
                                    have objections to the Privacy Policy, you
                                    should not access or use the Site.
                                </p>
                                <p className="text-goldt font-bold">
                                    Accessing Your Personal Information
                                </p>
                                <p className="text-gray-200 mb-3">
                                    You have a right to access your personal
                                    information, subject to exceptions allowed
                                    by law. If you would like to do so, please
                                    let us know. You may be required to put your
                                    request in writing for security reasons.
                                    GTLS reserves the right to charge a fee for
                                    searching for, and providing access to, your
                                    information on a per request basis.
                                </p>
                                <p className="text-goldt font-bold">
                                    Contacting us
                                </p>
                                <p className="text-gray-200 mb-3">
                                    Gold Tiger Logistics Solutions welcomes your
                                    comments regarding this Privacy Policy. If
                                    you have any questions about this Privacy
                                    Policy and would like further information,
                                    please contact our Managing Director by
                                    email{" "}
                                    <a
                                        href="mailto:pallets@gtls.com.au"
                                        className="text-goldt"
                                    >
                                        imad@gtls.com.au
                                    </a>
                                    .
                                </p>
                            </figure>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
