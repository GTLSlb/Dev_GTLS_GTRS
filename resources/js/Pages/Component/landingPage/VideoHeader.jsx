import headerImage from "../../../assets/pictures/header-image.webp";
import aus from "../../../assets/pictures/aus.webp";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { Link as ScrollLink } from "react-scroll";
const socials = [
    // {
    //     name: "Facebook",
    //     href: "https://www.facebook.com/GoldTiger.au?mibextid=LQQJ4d",
    //     target: "blank",
    //     icon: (props) => (
    //         <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    //             <path
    //                 fillRule="evenodd"
    //                 d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
    //                 clipRule="evenodd"
    //             />
    //         </svg>
    //     ),
    // },
    // {
    //     name: "Instagram",
    //     href: "https://instagram.com/gold.tiger.au?igshid=MzRlODBiNWFlZA",
    //     target: "blank",
    //     icon: (props) => (
    //         <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    //             <path
    //                 fillRule="evenodd"
    //                 d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
    //                 clipRule="evenodd"
    //             />
    //         </svg>
    //     ),
    // },
    // {
    //   name: 'Twitter',
    //   href: '#',
    //   icon: (props) => (
    //     <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    //       <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    //     </svg>
    //   ),
    // },
    // {
    //   name: 'GitHub',
    //   href: '#',
    //   icon: (props) => (
    //     <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    //       <path
    //         fillRule="evenodd"
    //         d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    //         clipRule="evenodd"
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //     name: "YouTube",
    //     href: "https://www.youtube.com/@goldtiger-ol3em",
    //     target: "blank",
    //     icon: (props) => (
    //         <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    //             <path
    //                 fillRule="evenodd"
    //                 d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
    //                 clipRule="evenodd"
    //             />
    //         </svg>
    //     ),
    // },
    {
        name: "phone",
        href: "tel:+1800040306",
        target: "blank",
        icon: PhoneIcon,
    },
];

export default function VideoHeader() {
    return (
        <div>
            <div className="bg-dark relative">
                <div className="relative flex py-24 sm:py-36 items-center justify-center  bg-header bg-cover overflow-hidden bg-opacity-10">
                    <div className="relative isolate mx-auto max-w-7xl px-6 lg:px-8     ">
                        <div className=" lg:flex items-center lg:gap-x-10  ">
                            <div className="absolute">
                                <img src={aus} alt="australia" />
                            </div>
                            <div className=" lg:flex items-center lg:gap-x-10  ">
                                <table className="table-auto w-full">
                                    <tbody>
                                        <tr className="lg:hidden  ">
                                            <td>
                                                <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
                                                    <img
                                                        className="mx-auto  max-w-full drop-shadow-xl w-full"
                                                        src={headerImage}
                                                        alt="Truck"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className=" px-4 py-10 w-7/12">
                                                <div className="relative lg:flex-auto w-full  ">
                                                    <div className="flex justify-between  mt-5 sm:mt-0 space-x-6">
                                                        {/* {socials.map(
                                                                (item) => (
                                                                    <div
                                                                        className="border border-goldd rounded-full p-1"
                                                                        key={
                                                                            item.name
                                                                        }
                                                                    >
                                                                        <a
                                                                            target={
                                                                                item.target
                                                                            }
                                                                            href={
                                                                                item.href
                                                                            }
                                                                            className="text-goldt hover:text-goldt flex items-center gap-x-1 px-1"
                                                                        >
                                                                            <span className="sr-only">
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </span>
                                                                            <item.icon
                                                                                className="h-6 w-auto p-0.5"
                                                                                aria-hidden="true"
                                                                            />
                                                                            <span>{item.href.split("tel:")}</span>
                                                                        </a>
                                                                    </div>
                                                                )
                                                            )} */}
                                                        {/* <div className="border border-goldd rounded-full p-1">
                                                            <a
                                                                target={"blank"}
                                                                href={
                                                                    "tel:+1800040306"
                                                                }
                                                                className="text-goldt hover:text-goldt flex items-center gap-x-1 px-1"
                                                            >
                                                                <span className="sr-only">
                                                                    {"phone"}
                                                                </span>
                                                                <PhoneIcon
                                                                    className="h-6 w-auto p-0.5"
                                                                    aria-hidden="true"
                                                                />
                                                                <span>
                                                                    Call:
                                                                    1800-040-306
                                                                </span>
                                                            </a>
                                                        </div> */}
                                                    </div>
                                                    <h1 className=" mt-10  text-3xl font-bold tracking-tight text-white sm:text-6xl sm:leading-tight">
                                                        SMARTER SUPPLY CHAIN
                                                        MANAGEMENT 
                                                    </h1>
                                                    <p className="mt-4 mb-2 text-2xl leading-8 text-goldt font-bold border-b border-opacity-30 border-goldt py-6">
                                                        THIRD PARTY LOGISTICS
                                                        SPECIALISTS
                                                    </p>
                                                    <p className="text-white py-2">
                                                        TRANSPORT, INTERSTATE
                                                        LINE HAUL, WAREHOUSING,
                                                        DISTRIBUTION OR A FULL
                                                        3PL OR 4PL SOLUTION -
                                                        TAKE YOUR PICK
                                                    </p>
                                                    {/* <div className="flex  sm:items-center flex-col sm:flex-row gap-x-5 mt-5">
                                                        <div className=" flex items-center gap-x-6 ">
                                                            <ScrollLink
                                                                to="contact"
                                                                smooth={true}
                                                                className="hover:cursor-pointer block w-full  rounded-3xl bg-gradient-to-r from-goldl to-goldd hover:from-goldd hover:to-goldl px-8 py-2.5 text-center text-md font-bold text-dark shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt"
                                                            >
                                                                Contact Us
                                                            </ScrollLink>
                                                        </div>
                                                    </div> */}
                                                    {/* <div className="w-full sm:w-auto mt-5 inline-block ring-1 ring-goldt py-1 px-2 relative items-center gap-x-2 rounded-3xl md:rounded-full justify-center flex-col sm:flex-row text-lft text-sm leading-6 text-gray-600 ">
                                                        <table>
                                                            <tbody>
                                                                <tr className="flex flex-col p-2 sm:p-0 flex gap-x-2 sm:flex-row ">
                                                                    <td>
                                                                        <div>
                                                                            <span className="font-semibold  text-md text-white">
                                                                                In
                                                                                case
                                                                                of
                                                                                emergency
                                                                                or
                                                                                breakdown
                                                                                contact
                                                                            </span>
                                                                            <span
                                                                                className="h-4 w-px bg-white"
                                                                                aria-hidden="true"
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div>
                                                                            <a
                                                                                href="tel:+0450033222"
                                                                                className="flex items-center justify-start font-bold gap-x-1"
                                                                            >
                                                                                <span
                                                                                    className="absolute inset-0"
                                                                                    aria-hidden="true"
                                                                                />
                                                                                <PhoneIcon
                                                                                    className="mr-2 h-5 w-5 text-goldt"
                                                                                    aria-hidden="true"
                                                                                />
                                                                                <span className="text-white text-md">
                                                                                    {" "}
                                                                                    0450
                                                                                    033
                                                                                    222
                                                                                </span>
                                                                            </a>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div> */}
                                                </div>
                                            </td>
                                            <td className="hidden lg:table-cell  px-4 py-2 ">
                                                <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
                                                    <img
                                                        className="mx-auto w-[30.875rem] max-w-full drop-shadow-xl w-6/12"
                                                        src={headerImage}
                                                        alt="Truck"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div
                        id="services"
                        className="h-20 absolute top-auto bottom-0"
                    ></div>
                </div>
            </div>
        </div>
    );
}
