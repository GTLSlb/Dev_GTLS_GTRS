import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, menuClasses } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { CircleStackIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "react-headless-accordion";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const themes = {
    light: {
        sidebar: {
            backgroundColor: "#ffffff",
            color: "#607489",
        },
        menu: {
            menuContent: "#fbfcfd",
            icon: "#e2b540",
            hover: {
                backgroundColor: "#f3f4f6d9",
                color: "#44596e",
            },
            disabled: {
                color: "#9fb6cf",
            },
        },
    },
    dark: {
        sidebar: {
            backgroundColor: "#0b2948",
            color: "#8ba1b7",
        },
        menu: {
            menuContent: "#082440",
            icon: "#59d0ff",
            hover: {
                backgroundColor: "#00458b",
                color: "#b6c8d9",
            },
            disabled: {
                color: "#3e5e7e",
            },
        },
    },
};
const themescollapse = {
    light: {
        sidebar: {
            backgroundColor: "#ffffff",
            color: "#607489",
        },
        menu: {
            menuContent: "#fbfcfd",
            icon: "#e2b540",
            hover: {
                backgroundColor: "",
                color: "#44596e",
            },
            disabled: {
                color: "#9fb6cf",
            },
        },
    },
    dark: {
        sidebar: {
            backgroundColor: "#0b2948",
            color: "#8ba1b7",
        },
        menu: {
            menuContent: "#082440",
            icon: "#59d0ff",
            hover: {
                backgroundColor: "#00458b",
                color: "#b6c8d9",
            },
            disabled: {
                color: "#3e5e7e",
            },
        },
    },
};
// hex to rgba converter
const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function CollapseSidebar({
    setBroken,
    rtl,
    toggled,
    setToggled,
    currentUser,
    setCusomterAccounts,
    customerAccounts,
    onData,
    collapsed,
    setCollapsed,
    sidebarElements,
    setSidebarElements,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasImage, setHasImage] = useState(false);
    const [theme, setTheme] = useState("light");
    const [customerOptions, setCustomerOptions] = useState([]);
    const [showList, setShowList] = useState(false);
    const showSelect = customerOptions?.length > 0;
    const [optionSelected, setoptionSelected] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setCustomerOptions(customerAccounts);
    }, []);
    const handleDivClick = () => {
        setShowList(!showList);
    };
    useEffect(() => {
        onData(optionSelected);
    }, [optionSelected]);
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

    const menuItemStyles = {
        root: {
            fontSize: "13px",
            // paddingLeft: "10px",
            fontWeight: 400,
        },
        icon: {
            color: collapsed
                ? themescollapse[theme].menu.icon
                : themes[theme].menu.icon,
            [`&.${menuClasses.disabled}`]: {
                color: themes[theme].menu.disabled.color,
            },
        },
        SubMenuExpandIcon: {
            color: "#b6b7b9",
        },
        subMenuContent: ({ level }) => ({
            backgroundColor:
                level === 0
                    ? hexToRgba(
                          themes[theme].menu.menuContent,
                          hasImage && !collapsed ? 0.4 : 1
                      )
                    : "transparent",
        }),
        button: {
            [`&.${menuClasses.disabled}`]: {
                color: themes[theme].menu.disabled.color,
            },
            "&:hover": {
                backgroundColor: hexToRgba(
                    themes[theme].menu.hover.backgroundColor,
                    hasImage ? 0.8 : 1
                ),
                color: themes[theme].menu.hover.color,
            },
            "&:hover .label-class": { // Assuming the label has a class named 'label-class'
                color: themes[theme].menu.hover.labelColor,
            },
        },
        label: ({ open }) => ({
            fontWeight: open ? 600 : undefined,
            transition: "color 0.3s ease", // Smooth transition for color changes
        }),
    };


    const handleClick = (id, item) => {
        const updatedElements = sidebarElements?.map((element) => {
            if (id == 12 || id == 13 || id == 14 || id == 17 || id == 18) {
                if (element.options) {
                    return {
                        ...element,
                        current: true,
                        options: element.options.map((option) => {
                            if (option.id == id) {
                                return { ...option, current: true };
                            } else {
                                return { ...option, current: false };
                            }
                        }),
                    };
                } else {
                    if (element.id === id) {
                        return { ...element, current: true };
                    } else {
                        return { ...element, current: false };
                    }
                }
            } else {
                if (element.options) {
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
                } else {
                    if (element.id === id) {
                        return { ...element, current: true };
                    } else {
                        return { ...element, current: false };
                    }
                }
            }
        });
        handleSelectOnClick();
        setSidebarElements(updatedElements);
        localStorage.setItem("current", JSON.stringify(id));
        navigate(item.url);
    };

    function handleSelectOnClick() {
        if (collapsed) {
            setCollapsed(false);
            if (collapsed === false) {
                setIsOpen(true);
            }
        } else {
            setIsOpen(!isOpen);
        }
    }
    function isItemActive(menuItemLabel) {
        let active = false;

        // Helper function to recursively check if any item or its sub-options are active
        const checkActive = (items) => {
            for (const item of items) {
                if (item.current) {
                    return true;
                }
                // Recursively check sub-options if they exist
                if (item.options && checkActive(item.options)) {
                    return true;
                }
            }
            return false;
        };

        // Find the item by name and check if it or its sub-options are active
        const menuItem = sidebarElements.find(
            (item) => item.name.toLowerCase() === menuItemLabel.toLowerCase()
        );

        if (menuItem) {
            // Check if the current item or any of its sub-options is active
            active = checkActive([menuItem]);
        }

        return active;
    }

    return (
        sidebarElements?.length > 0 && (
            <div className="h-full relative z-30">
                <Sidebar
                    collapsed={collapsed} // collapsed the menu
                    toggled={toggled}
                    width="240px"
                    onBackdropClick={() => setToggled(false)}
                    onBreakPoint={setBroken}
                    rtl={rtl}
                    breakPoint="md"
                    backgroundColor={hexToRgba(
                        collapsed
                            ? themescollapse[theme].sidebar.backgroundColor
                            : themes[theme].sidebar.backgroundColor,
                        hasImage ? 0.9 : 1
                    )}
                    rootStyles={{
                        color: collapsed
                            ? themescollapse[theme].sidebar.color
                            : themes[theme].sidebar.color,
                        height: "100%",
                        position: "relative",
                        backgroundColor: "#f6f6f6",
                    }}
                >
                    {/* Sidebar content */}
                    <div className=" h-full ">
                        {/* Arrow to close and open it  */}
                        <div className="p-5 flex items-center justify-between">
                            <div
                                className={
                                    collapsed
                                        ? " hidden transform transition"
                                        : " block transform  transition"
                                }
                            >
                                <p className="text-sm truncate w-24">
                                    {currentUser.FirstName}{" "}
                                    {currentUser.LastName}
                                </p>
                                <p className="text-xs truncate w-36">
                                    {currentUser.Email}
                                </p>
                            </div>
                            <Button
                                isIconOnly
                                className="bg-zinc-300 hover:bg-zinc-200"
                                aria-label="Like"
                                size="sm"
                                onClick={() => {
                                    setIsOpen(false);
                                    setCollapsed(!collapsed);
                                }}
                            >
                                <div
                                    className={
                                        collapsed
                                            ? "rotate-0 transform transition"
                                            : "rotate-180 transform  transition"
                                    }
                                >
                                    <KeyboardDoubleArrowRightIcon
                                        className={
                                            collapsed ? "p-[2px] w-2 h-2" : "p-[2px] w-2 h-2"
                                        }
                                    />
                                </div>
                            </Button>
                        </div>
                        {!collapsed && (
                            <div className="mt-5 mb-5 flex-1 xl:flex-col space-y-1 px-2 w-full md:flex-row md:flex md:mt-0 hover:cursor-pointer containerscroll">
                                {showSelect && (
                                    <div className="group flex flex-col items-center px-2 py-2 text-gray-700 text-sm font-medium rounded-md w-full hover:bg-gray-100">
                                        <div
                                            onClick={handleDivClick}
                                            className="flex flex-row w-full justify-between items-center"
                                        >
                                            <div className="flex flex-row items-center">
                                                <CircleStackIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                                                <div className="pt-1">
                                                    Accounts
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 ">
                                                <ChevronDownIcon className="h-4 w-4" />
                                            </div>
                                        </div>
                                        <div className="text-left w-full">
                                            {showList && (
                                                <div className="text-left max-h-64 overflow-y-scroll mt-3 pt-1 pl-1 containerscroll">
                                                    {customerAccounts?.map(
                                                        (option) => (
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
                                                                    onChange={(
                                                                        e
                                                                    ) =>
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
                                                                    {
                                                                        option.AccountNo
                                                                    }
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
                        )}

                        {/* The menu it self */}
                        <div className="flex w-full max-w-xs items-center gap-2"></div>
                        <div
                            style={{
                                flex: 1,
                                marginBottom: "32px",
                            }}
                            className=""
                        >
                            <Menu
                                rootStyles="w-1/2 overflow-auto bg-gray-100 mx-10"
                                menuItemStyles={menuItemStyles}
                            >
                                {sidebarElements?.map((menuItem, itemIndex) => (
                                    <>
                                        {menuItem?.options && !collapsed ? (
                                            <div className="px-5 py-2">
                                                <Accordion
                                                    key={menuItem.id}
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
                                                                    className={classNames(
                                                                        menuItem.current
                                                                            ? "bg-gray-300 text-gray-900"
                                                                            : "text-gray-600 hover:bg-gray-500 hover:text-white",
                                                                        "group flex flex-row justify-between items-center px-2 py-2 text-sm rounded-md w-full"
                                                                    )}
                                                                >
                                                                    <div className="flex items-center">
                                                                        {menuItem.icon ? (
                                                                            <menuItem.icon
                                                                                className={classNames(
                                                                                    menuItem.current
                                                                                        ? "text-gray-800"
                                                                                        : "text-gray-700 group-hover:text-gray-300",
                                                                                    "mr-3 flex-shrink-0 h-6 w-6"
                                                                                )}
                                                                                aria-hidden="true"
                                                                            />
                                                                        ) : (
                                                                            <img
                                                                                src={
                                                                                    menuItem.img
                                                                                }
                                                                                className={classNames(
                                                                                    menuItem.current
                                                                                        ? "text-yellow-400"
                                                                                        : "text-gray-400 group-hover:text-white",
                                                                                    "h-6 w-6"
                                                                                )}
                                                                                aria-hidden="true"
                                                                            />
                                                                        )}
                                                                        <span>
                                                                            {
                                                                                menuItem.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <ChevronDownIcon className="h-3" />
                                                                </AccordionHeader>

                                                                <AccordionBody className="pl-10 flex gap-y-1 mt-1 flex-col">
                                                                    {menuItem.options.map(
                                                                        (
                                                                            option
                                                                        ) => (
                                                                            <button
                                                                                id={
                                                                                    option.name
                                                                                }
                                                                                key={
                                                                                    option.id
                                                                                }
                                                                                onClick={() =>
                                                                                    handleClick(
                                                                                        option.id,
                                                                                        option
                                                                                    )
                                                                                }
                                                                                className={classNames(
                                                                                    option.current
                                                                                        ? "bg-gray-300"
                                                                                        : "",
                                                                                    "p-2 font-semibold hover:bg-gray-300 rounded text-left text-gray-600 text-xs"
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
                                            </div>
                                        ) : (
                                            <MenuItem
                                                className=""
                                                key={itemIndex}
                                                active={isItemActive(
                                                    menuItem.name
                                                )}
                                                component={
                                                    <div
                                                        className="item"
                                                        onClick={() => {
                                                            setCollapsed(false);
                                                            handleClick(
                                                                menuItem.id,
                                                                menuItem
                                                            );
                                                        }}
                                                    ></div>
                                                }
                                            >
                                                <div
                                                    className={`flex items-center px-2 gap-2 ${
                                                        isItemActive(
                                                            menuItem.name
                                                        )
                                                            ? "bg-gray-300 text-gray-900 py-2 rounded-lg"
                                                            : "bg-transparent text-gray-600 py-2 rounded-lg focus:ring-2 outline-0"
                                                    }
                                                                ${
                                                                    collapsed
                                                                        ? "px-0 w-full justify-center pl-4"
                                                                        : ""
                                                                }`}
                                                >
                                                    <div>
                                                        {menuItem.icon && (
                                                            <div className="w-7 flex items-center justify-center">
                                                                <menuItem.icon className="" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="">
                                                        {!collapsed &&
                                                            menuItem.name}
                                                    </div>
                                                </div>
                                            </MenuItem>
                                        )}
                                    </>
                                ))}
                            </Menu>
                        </div>
                    </div>
                </Sidebar>
            </div>
        )
    );
}
