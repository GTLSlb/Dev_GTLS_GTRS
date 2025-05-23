import React, { Fragment, useState } from "react";
import {
    ChartPieIcon,
    TruckIcon,
    ClipboardDocumentCheckIcon,
    PresentationChartLineIcon,
    ExclamationTriangleIcon,
    NoSymbolIcon,
    CurrencyDollarIcon,
    UserIcon,
    CircleStackIcon,
    ClockIcon,
    ChevronDownIcon,
    ShieldCheckIcon,
    CameraIcon,
    DocumentTextIcon,
    DocumentDuplicateIcon,
    RectangleStackIcon,
} from "@heroicons/react/24/solid";
import "../../../../css/scroll.css";
import TaskIcon from "@mui/icons-material/Task";
import ContactsIcon from '@mui/icons-material/Contacts';
import { useEffect } from "react";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "react-headless-accordion";
import { isDummyAccountWithDummyData } from "@/CommonFunctions";

const navigation = [
    {
        id: 0,
        name: "Dashboard",
        href: "#",
        icon: ChartPieIcon,
        current: true,
        feature: "Dashboard_view",
    },
    {
        id: 1,
        name: "Consignments",
        href: "#",
        icon: TruckIcon,
        current: false,
        feature: "ConsignmetsReport_view",
    },
    {
        id: 2,
        name: "KPI Report",
        href: "#",
        icon: ClipboardDocumentCheckIcon,
        current: false,
        options: [
            {
                id: 17,
                name: "KPI",
                href: "#",
                current: false,
                icon: ClipboardDocumentCheckIcon,
                feature: "KPI_view",
            },
            {
                id: 18,
                name: "Transit Days",
                href: "#",
                current: false,
                icon: ClipboardDocumentCheckIcon,
                feature: "View_TransitDays",
            },
            {
                id: 13,
                name: "Holidays",
                href: "#",
                current: false,
                icon: ClipboardDocumentCheckIcon,
                feature: "View_Holidays",
            },
            {
                id: 14,
                name: "KPI Reasons",
                href: "#",
                current: false,
                icon: ClipboardDocumentCheckIcon,
                feature: "View_kpiReasons",
            },
        ],
        feature: "KPI",
    },
    {
        id: 4,
        name: "Performance Report",
        href: "#",
        icon: PresentationChartLineIcon,
        current: false,
        feature: "Performance_view",
    },
    {
        id: 5,
        name: "Failed Consignments",
        href: "#",
        icon: ExclamationTriangleIcon,
        current: false,
        feature: "View_failedConsignment",
    },
    {
        id: 16,
        name: "Transport Report",
        href: "#",
        icon: TaskIcon,
        current: false,
        feature: "View_Transport",
    },
    {
        id: 9,
        name: "RDD",
        href: "#",
        icon: ClockIcon,
        current: false,
        feature: "View_RDD",
    },
    {
        id: 11,
        name: "Missing POD",
        href: "#",
        icon: CameraIcon,
        current: false,
        feature: "MissingPOD_view",
    },
    {
        id: 10,
        name: "Safety",
        href: "#",
        icon: ShieldCheckIcon,
        current: false,
        feature: "View_safety",
    },
    {
        id: 6,
        name: "No Delivery info.",
        href: "#",
        icon: NoSymbolIcon,
        current: false,
        feature: "NoDeliveryInfo_view",
    },
    {
        id: 7,
        name: "Additional Charges",
        href: "#",
        icon: CurrencyDollarIcon,
        current: false,
        feature: "AdditionalCharges_view",
    },
    {
        id: 8,
        name: "Driver Login",
        href: "#",
        icon: UserIcon,
        current: false,
        feature: "DriverLogin_view",
    },
    {
        id: 20,
        name: "Unilever KPI Pack",
        href: "#",
        icon: DocumentTextIcon,
        current: false,
        feature: "UnileverReport_View",
    },
    {
        id: 22,
        name: "Real Food KPI Pack",
        href: "#",
        icon: DocumentTextIcon,
        current: false,
        feature: "RealFoodReport_View",
    },
    {
        id: 21,
        name: "Delivery Report",
        href: "#",
        options: [
            {
                id: 24,
                name: "Delivery Report",
                href: "#",
                current: false,
                icon: DocumentDuplicateIcon,
                feature: "DeliveryReport_View",
            },
            // {
            //     id: 25,
            //     name: "Excel Delivery Report",
            //     href: "#",
            //     current: false,
            //     icon: DocumentDuplicateIcon,
            //     feature: "ExcelTable_View",
            // },
            {
                id: 26,
                name: "Comments",
                href: "#",
                current: false,
                icon: DocumentDuplicateIcon,
                feature: "CommentsTable_View",
            },
        ],
        icon: DocumentDuplicateIcon,
        current: false,
        feature: "DeliveryReport_View",
    },
    {
        id: 23,
        name: "SOH Report",
        href: "#",
        icon: RectangleStackIcon,
        current: false,
        feature: "StockReport_View",
    },
    {
        id: 27,
        name: "Contacts Report",
        href: "#",
        icon: ContactsIcon,
        current: false,
        feature: "ContactsRep_View",
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function ChartsSidebar({
    setCusomterAccounts,
    customerAccounts,
    setActiveIndexGTRS,
    currentUser,
    user,
    onData,
}) {
    const [customerOptions, setCustomerOptions] = useState([]);
    const [showList, setShowList] = useState(false);
    const showSelect = customerOptions?.length > 0;

    const handleDivClick = () => {
        setShowList(!showList);
    };
    const [optionSelected, setoptionSelected] = useState([]);

    const handleCheckboxClick = (option1, event) => {
        const value = customerOptions.map((option) =>
            option.DebtorId === option1.DebtorId
                ? { ...option, checked: !option.checked }
                : option
        );
        setCustomerOptions(value);
        setCusomterAccounts(value);
        handleSelectedCValue(event);
    };
    const handleSelectedCValue = (event) => {
        const optionValue = event.target.value;
        if (event.target.checked && !optionSelected.includes(optionValue)) {
            setoptionSelected([...optionSelected, optionValue]);
        } else {
            setoptionSelected(
                optionSelected.filter((value) => value !== optionValue)
            );
        }
    };
    useEffect(() => {
        setCustomerOptions(customerAccounts);
    }, []);
    useEffect(() => {
        onData(optionSelected);
    }, [optionSelected]);
    const [sidebarElements, setSidebarElements] = useState(navigation);

    const handleClick = (index) => {
        setActiveIndexGTRS(index);
        const updatedElements = sidebarElements.map((element) => {
            if (
                element.id === index ||
                index == 12 ||
                index == 13 ||
                index == 14 ||
                index == 17 ||
                index == 18
            ) {
                if (element.options) {
                    return {
                        ...element,
                        current: true,
                        options: element.options.map((option) => {
                            if (option.id == index) {
                                return { ...option, current: true };
                            } else {
                                return { ...option, current: false };
                            }
                        }),
                    };
                } else {
                    if (element.id === index) {
                        return { ...element, current: true };
                    } else {
                        return {
                            ...element,
                            current: false,
                            ...(element.options
                                ? element.options.map((option) => {
                                      return { ...option, current: false };
                                  })
                                : {}),
                        };
                    }
                }
            } else {
                return {
                    ...element,
                    current: false,
                    ...(element.options
                        ? {
                              options: element.options.map((option) => {
                                  return { ...option, current: false };
                              }),
                          }
                        : {}),
                };
            }
        });
        setSidebarElements(updatedElements);
    };
    const filterNavigation = (navigationitems, user) => {
        return navigationitems.filter((navItem) => {
            
            // Check if the navigation item has sub-options
            if (navItem.options) {
                // Filter options based on user permissions
                navItem.options = navItem.options.filter((option) =>
                    user?.Pages?.some(
                        (userPage) =>
                            userPage?.PageName === option.name &&
                            userPage?.Features?.some(
                                (feature) =>
                                    feature.FunctionName === option.feature
                            )
                    )
                );
                // Include the navigation item only if it has any permitted options
                return navItem.options.length > 0;
            } else {
                // For navigation items without options, check the feature directly
                return user?.Pages?.some(
                    (userPage) =>
                        userPage?.PageName === navItem.name &&
                        userPage?.Features?.some(
                            (feature) =>
                                feature?.FunctionName === navItem?.feature
                        )
                );
            }
        });
    };

    const filteredNavigation = filterNavigation(sidebarElements, currentUser);
    useEffect(() => {
        setSidebarElements(filteredNavigation);
        setActiveIndexGTRS(filteredNavigation[0]?.id);
    }, []);
    return (
        <div className="h-full xl:fixed xl:w-64 lg:h-full bg-gray-200 w-full ">
            {/* Static sidebar for desktop */}
            <div className=" h-[90%] md:inset-y-0 flex w-full md:flex-row ">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className=" h-full w-full overflow-y-scroll containerscroll">
                    <div className="flex flex-col">
                        <div className="flex flex-shrink-0  p-4 ">
                            <div className="group block w-full flex-shrink-0">
                                <div className="flex items-center">
                                    <div className="hidden">
                                        {!user.Picture ||
                                        user.Picture.length == 0 ? (
                                            <img
                                                className="inline-block h-14 w-14"
                                                src={`/app/icons/blank-profile.jpg`}
                                                alt=""
                                            />
                                        ) : (
                                            <img
                                                className="inline-block h-14 w-14 object-contain"
                                                src={`https://gtam-test.gtls.com.lb/${user.Picture}`}
                                                alt=""
                                            />
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-800">
                                            {user.TypeId == 1 ? (
                                                <p>{user.CustomerName}</p>
                                            ) : (
                                                <p>
                                                    {user.FirstName}{" "}
                                                    {user.LastName}
                                                </p>
                                            )}
                                        </p>
                                        <p className=" text-[0.7rem] text-gray-500 ">
                                            {user.Email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 flex-1 xl:flex-col space-y-1 px-2 w-full md:flex-row md:flex md:mt-0 hover:cursor-pointer containerscroll">
                            {showSelect && (
                                <div className="group flex flex-col items-center px-2 py-2 text-gray-700 text-sm font-medium rounded-md w-full hover:bg-gray-100">
                                    <div
                                        onClick={handleDivClick}
                                        className="flex flex-row w-full justify-between items-center"
                                    >
                                        <div className="flex flex-row items-center">
                                            <CircleStackIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                                            <div className="pt-1">Accounts</div>
                                        </div>
                                        <div className="flex-shrink-0 ">
                                            <ChevronDownIcon className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div className="text-left w-full">
                                        {showList && (
                                            <div className="text-left max-h-64 overflow-y-scroll mt-3 pt-1 pl-1 containerscroll">
                                                {customerAccounts?.map(
                                                    (option,index) => (
                                                        <div
                                                            className="flex items-start"
                                                            key={
                                                                option.DebtorId
                                                            }
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id={
                                                                    option.DebtorId
                                                                }
                                                                value={
                                                                    option.DebtorId
                                                                }
                                                                checked={
                                                                    option.checked
                                                                }
                                                                onChange={(e) =>
                                                                    handleCheckboxClick(
                                                                        option,
                                                                        e
                                                                    )
                                                                }
                                                            />
                                                            <label
                                                                htmlFor={
                                                                    option.DebtorId
                                                                }
                                                                className="ml-2"
                                                            >
                                                                {isDummyAccountWithDummyData(
                                                                    `Account No.${index + 1} `,
                                                                    option.AccountNo
                                                                )}
                                                            </label>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="pt-5 w-full">
                        <nav className="mt-5 flex-1 hidden xl:flex-col space-y-1 px-2 w-full md:flex-row md:flex md:mt-0 ">
                            {sidebarElements?.map((item) => (
                                <div key={item.id}>
                                    {item.options ? (
                                        <Accordion
                                            key={item.id}
                                            transition={{
                                                duration: "300ms",
                                                timingFunction:
                                                    "cubic-bezier(0, 0, 0.2, 1)",
                                            }}
                                        >
                                            <AccordionItem>
                                                {({ open }) => (
                                                    <>
                                                        <AccordionHeader
                                                            // className=" "
                                                            className={classNames(
                                                                item.current
                                                                    ? "bg-gray-300 text-gray-900"
                                                                    : "text-gray-700 hover:bg-gray-500 hover:text-white",
                                                                "group flex flex-row justify-between items-center px-2 py-2 text-sm font-medium rounded-md w-full"
                                                            )}
                                                        >
                                                            <div className="flex items-center">
                                                                {item.icon ? (
                                                                    <item.icon
                                                                        className={classNames(
                                                                            item.current
                                                                                ? "text-gray-800"
                                                                                : "text-gray-700 group-hover:text-gray-300",
                                                                            "mr-3 flex-shrink-0 h-6 w-6"
                                                                        )}
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={
                                                                            item.img
                                                                        }
                                                                        className={classNames(
                                                                            item.current
                                                                                ? "text-yellow-400"
                                                                                : "text-gray-400 group-hover:text-white",
                                                                            "h-6 w-6"
                                                                        )}
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                                <span>
                                                                    {item.name}
                                                                </span>
                                                            </div>
                                                            <ChevronDownIcon className="h-3" />
                                                        </AccordionHeader>

                                                        <AccordionBody className="pl-10 flex gap-y-1 mt-1 flex-col">
                                                            {item.options.map(
                                                                (option) => (
                                                                    <button
                                                                        id={
                                                                            option.name
                                                                        }
                                                                        key={
                                                                            option.id
                                                                        }
                                                                        onClick={() =>
                                                                            handleClick(
                                                                                option.id
                                                                            )
                                                                        }
                                                                        className={classNames(
                                                                            option.current
                                                                                ? "bg-gray-300"
                                                                                : "",
                                                                            "p-2 font-semibold hover:bg-gray-300 rounded text-left text-dark text-xs"
                                                                        )}
                                                                    >
                                                                        {
                                                                            option.name
                                                                        }
                                                                    </button>
                                                                )
                                                            )}
                                                        </AccordionBody>
                                                    </>
                                                )}
                                            </AccordionItem>
                                        </Accordion>
                                    ) : (
                                        <a
                                            onClick={() => handleClick(item.id)}
                                            key={item.name}
                                            href={item.href}
                                            className={classNames(
                                                item.current
                                                    ? "bg-gray-300 text-gray-900"
                                                    : "text-gray-700 hover:bg-gray-500 hover:text-white",
                                                "group flex flex-row items-center px-2 py-2 text-sm font-medium rounded-md w-full"
                                            )}
                                        >
                                            <item.icon
                                                className={classNames(
                                                    item.current
                                                        ? "text-gray-800"
                                                        : "text-gray-700 group-hover:text-gray-300",
                                                    "mr-3 flex-shrink-0 h-6 w-6"
                                                )}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
