import { useState } from "react";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronDoubleDownIcon,
    ChevronDownIcon,
} from "@heroicons/react/20/solid";
import GtamButton from "../GTAM/components/Buttons/GtamButton";
import { useEffect } from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function AddTransit({
    url,
    currentUser,
    setTransitDay,
    setTransitDays,
    setActiveIndexGTRS,
    transitDay,
}) {
    const states = [
        {
            id: 1,
            label: "ACT",
        },
        {
            id: 2,
            label: "NSW",
        },
        {
            id: 3,
            label: "QLD",
        },
        {
            id: 4,
            label: "SA",
        },
        {
            id: 5,
            label: "VIC",
        },

        {
            id: 6,
            label: "TAS",
        },
        {
            id: 7,
            label: "WA",
        },
    ];

    const customers = [
        { id: 1, label: "UNILEVER" },
        { id: 2, label: "GMI" },
        { id: 3, label: "FREIGHT PEOPLE" },
    ];

    const types = [
        { id: 1, label: "FOOD" },
        { id: 2, label: "HPC" },
        { id: 3, label: "Food Solutions - QLD" },
        { id: 4, label: "METCASH" },
    ];

    const [object, setObject] = useState(transitDay);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRstate, setSelectedRstate] = useState();
    const [selectedSstate, setSelectedSstate] = useState();
    const [selectedCustomer, setSelectedCustomer] = useState();
    const [selectedType, setSelectedType] = useState();
    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const fetchData = async () => {
        try {
            axios
                .get(`${url}api/GTRS/Transits`, {
                    headers: {
                        RoleId: currentUser.role_id,
                    },
                })
                .then((res) => {
                    const x = JSON.stringify(res.data);
                    const parsedDataPromise = new Promise((resolve, reject) => {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData);
                    });
                    parsedDataPromise.then((parsedData) => {
                        setTransitDays(parsedData);
                    });
                });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (transitDay) {
            setSelectedRstate(
                states.find((item) => item.label == transitDay.ReceiverState)
            );
            setSelectedSstate(
                states.find((item) => item.label == transitDay.SenderState)
            );
            setSelectedType(
                types.find((item) => item.id == transitDay.CustomerType)
            );
            setSelectedCustomer(
                customers.find((item) => item.id == transitDay.CustomerId)
            );
        }
    }, []);
    function AddTransit(e) {
        e.preventDefault();
        setIsLoading(true);
        const inputValues = {
            TransitId: object ? object.TransitId : null,
            CustomerId:  selectedCustomer.id,
            CustomerType: object?object.CustomerId == 1 ? selectedType.id : null:null,
            SenderState: selectedSstate.label,
            SenderCity: document.getElementById("SenderCity").value,
            SenderSuburb: document.getElementById("SenderSuburb").value,
            SenderPostCode: document.getElementById("SenderPostCode").value,
            ReceiverName: document.getElementById("ReceiverName").value,
            ReceiverState: selectedRstate.label,
            ReceiverCity: document.getElementById("ReceiverCity").value,
            ReceiverSuburb: document.getElementById("ReceiverSuburb").value,
            ReceiverPostCode: document.getElementById("ReceiverPostCode").value,
            TransitTime: document.getElementById("TransitTime").value,
        };
        axios
            .post(`${url}api/GTRS/Add/Transit`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                    RoleId: currentUser.role_id,
                },
            })
            .then((res) => {
                fetchData()
                setTransitDay(null);
                setActiveIndexGTRS(12);
                setIsLoading(false);
                // AlertToast("Saved successfully", 1);
            })
            .catch((err) => {
                // AlertToast("Something went wrong", 2);
                setIsLoading(false);
                console.log(err);
            });
    }

    function CancelHandle() {
        setTransitDay(null);
        setActiveIndexGTRS(12);
    }
    return (
        <div className="p-8">
            <div className="shadow bg-white p-6 rounded-lg ">
                <form onSubmit={AddTransit}>
                    <p className="font-bold text-lg">Add Transit</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-5 items-center py-4">
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48 ">
                                Customer Name:{" "}
                            </label>
                            <div className="sm:w-96">
                                <div>
                                    <Listbox
                                        value={selectedCustomer}
                                        onChange={(e) => {
                                            setSelectedCustomer(e);
                                        }}
                                    >
                                        {({ open }) => (
                                            <>
                                                <div className="relative ">
                                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                        <span className="block truncate">
                                                            {selectedCustomer
                                                                ? selectedCustomer?.label
                                                                : " -- No Customer -- "}
                                                        </span>
                                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <ChevronDownIcon
                                                                className="h-5 w-5 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </Listbox.Button>

                                                    <Transition
                                                        show={open}
                                                        as={Fragment}
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                            {customers.map(
                                                                (customer) => (
                                                                    <Listbox.Option
                                                                        key={
                                                                            customer.id
                                                                        }
                                                                        className={({
                                                                            active,
                                                                        }) =>
                                                                            classNames(
                                                                                active
                                                                                    ? "bg-indigo-600 text-white"
                                                                                    : "text-gray-900",
                                                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                            )
                                                                        }
                                                                        value={
                                                                            customer
                                                                        }
                                                                    >
                                                                        {({
                                                                            selected,
                                                                            active,
                                                                        }) => (
                                                                            <>
                                                                                <span
                                                                                    className={classNames(
                                                                                        selected
                                                                                            ? "font-semibold"
                                                                                            : "font-normal",
                                                                                        "block truncate"
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        customer.label
                                                                                    }
                                                                                </span>

                                                                                {selected ? (
                                                                                    <span
                                                                                        className={classNames(
                                                                                            active
                                                                                                ? "text-white"
                                                                                                : "text-indigo-600",
                                                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                        )}
                                                                                    >
                                                                                        <CheckIcon
                                                                                            className="h-5 w-5"
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                    </span>
                                                                                ) : null}
                                                                            </>
                                                                        )}
                                                                    </Listbox.Option>
                                                                )
                                                            )}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </div>
                                            </>
                                        )}
                                    </Listbox>
                                </div>
                            </div>
                        </div>

                        {
                            object?.CustomerId == 1 || selectedCustomer?.id ==1 ? (
                                <div className="col-span-2 flex items-center gap-x-2">
                                    <label
                                        htmlFor="name"
                                        className="block w-48 "
                                    >
                                        Customer Type:{" "}
                                    </label>
                                    <div className="sm:w-96">
                                        <div>
                                            <Listbox
                                                value={selectedType}
                                                onChange={(e) => {
                                                    setSelectedType(e);
                                                }}
                                            >
                                                {({ open }) => (
                                                    <>
                                                        <div className="relative ">
                                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                                <span className="block truncate">
                                                                    {selectedType
                                                                        ? selectedType?.label
                                                                        : " -- No Types -- "}
                                                                </span>
                                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                    <ChevronDownIcon
                                                                        className="h-5 w-5 text-gray-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                            </Listbox.Button>

                                                            <Transition
                                                                show={open}
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                    {types.map(
                                                                        (
                                                                            type
                                                                        ) => (
                                                                            <Listbox.Option
                                                                                key={
                                                                                    type.id
                                                                                }
                                                                                className={({
                                                                                    active,
                                                                                }) =>
                                                                                    classNames(
                                                                                        active
                                                                                            ? "bg-indigo-600 text-white"
                                                                                            : "text-gray-900",
                                                                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                    )
                                                                                }
                                                                                value={
                                                                                    type
                                                                                }
                                                                            >
                                                                                {({
                                                                                    selected,
                                                                                    active,
                                                                                }) => (
                                                                                    <>
                                                                                        <span
                                                                                            className={classNames(
                                                                                                selected
                                                                                                    ? "font-semibold"
                                                                                                    : "font-normal",
                                                                                                "block truncate"
                                                                                            )}
                                                                                        >
                                                                                            {
                                                                                                type.label
                                                                                            }
                                                                                        </span>

                                                                                        {selected ? (
                                                                                            <span
                                                                                                className={classNames(
                                                                                                    active
                                                                                                        ? "text-white"
                                                                                                        : "text-indigo-600",
                                                                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                                )}
                                                                                            >
                                                                                                <CheckIcon
                                                                                                    className="h-5 w-5"
                                                                                                    aria-hidden="true"
                                                                                                />
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        )
                                                                    )}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </div>
                                                    </>
                                                )}
                                            </Listbox>
                                        </div>
                                    </div>
                                </div>
                            ) : <div></div>
                        }

                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48 ">
                                Sender State:{" "}
                            </label>
                            <div className="sm:w-96">
                                <div>
                                    <Listbox
                                        value={selectedSstate}
                                        onChange={(e) => {
                                            setSelectedSstate(e);
                                        }}
                                    >
                                        {({ open }) => (
                                            <>
                                                <div className="relative ">
                                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                        <span className="block truncate">
                                                            {selectedSstate
                                                                ? selectedSstate?.label
                                                                : " -- No State -- "}
                                                        </span>
                                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <ChevronDownIcon
                                                                className="h-5 w-5 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </Listbox.Button>

                                                    <Transition
                                                        show={open}
                                                        as={Fragment}
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                            {states.map(
                                                                (state) => (
                                                                    <Listbox.Option
                                                                        key={
                                                                            state.id
                                                                        }
                                                                        className={({
                                                                            active,
                                                                        }) =>
                                                                            classNames(
                                                                                active
                                                                                    ? "bg-indigo-600 text-white"
                                                                                    : "text-gray-900",
                                                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                            )
                                                                        }
                                                                        value={
                                                                            state
                                                                        }
                                                                    >
                                                                        {({
                                                                            selected,
                                                                            active,
                                                                        }) => (
                                                                            <>
                                                                                <span
                                                                                    className={classNames(
                                                                                        selected
                                                                                            ? "font-semibold"
                                                                                            : "font-normal",
                                                                                        "block truncate"
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        state.label
                                                                                    }
                                                                                </span>

                                                                                {selected ? (
                                                                                    <span
                                                                                        className={classNames(
                                                                                            active
                                                                                                ? "text-white"
                                                                                                : "text-indigo-600",
                                                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                        )}
                                                                                    >
                                                                                        <CheckIcon
                                                                                            className="h-5 w-5"
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                    </span>
                                                                                ) : null}
                                                                            </>
                                                                        )}
                                                                    </Listbox.Option>
                                                                )
                                                            )}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </div>
                                            </>
                                        )}
                                    </Listbox>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48 ">
                                Sender City:{" "}
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="SenderCity"
                                defaultValue={object ? object.SenderCity : ""}
                                className="rounded sm:w-96 bg-gray-50 border border-gray-300 h-7"
                            />
                        </div>
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48 ">
                                Sender Suburb:{" "}
                            </label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={object ? object.SenderSuburb : ""}
                                id="SenderSuburb"
                                className="rounded sm:w-96 bg-gray-50 border border-gray-300 h-7"
                            />
                        </div>
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48 ">
                                Sender PostCode:{" "}
                            </label>
                            <input
                                type="number"
                                name="name"
                                id="SenderPostCode"
                                defaultValue={
                                    object ? object.SenderPostCode : ""
                                }
                                className="rounded sm:w-96 bg-gray-50 border border-gray-300 h-7"
                            />
                        </div>
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48 ">
                                Receiver Name:{" "}
                            </label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={object ? object.ReceiverName : ""}
                                id="ReceiverName"
                                className="rounded sm:w-96 bg-gray-50 border border-gray-300 h-7"
                            />
                        </div>
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48 ">
                                Receiver State:{" "}
                            </label>
                            <div className="sm:w-96">
                                <div>
                                    <Listbox
                                        value={selectedRstate}
                                        onChange={(e) => {
                                            setSelectedRstate(e);
                                        }}
                                    >
                                        {({ open }) => (
                                            <>
                                                <div className="relative ">
                                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                        <span className="block truncate">
                                                            {selectedRstate
                                                                ? selectedRstate?.label
                                                                : " -- No State -- "}
                                                        </span>
                                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <ChevronDownIcon
                                                                className="h-5 w-5 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </Listbox.Button>

                                                    <Transition
                                                        show={open}
                                                        as={Fragment}
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                            {states.map(
                                                                (state) => (
                                                                    <Listbox.Option
                                                                        key={
                                                                            state.id
                                                                        }
                                                                        className={({
                                                                            active,
                                                                        }) =>
                                                                            classNames(
                                                                                active
                                                                                    ? "bg-indigo-600 text-white"
                                                                                    : "text-gray-900",
                                                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                            )
                                                                        }
                                                                        value={
                                                                            state
                                                                        }
                                                                    >
                                                                        {({
                                                                            selected,
                                                                            active,
                                                                        }) => (
                                                                            <>
                                                                                <span
                                                                                    className={classNames(
                                                                                        selected
                                                                                            ? "font-semibold"
                                                                                            : "font-normal",
                                                                                        "block truncate"
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        state.label
                                                                                    }
                                                                                </span>

                                                                                {selected ? (
                                                                                    <span
                                                                                        className={classNames(
                                                                                            active
                                                                                                ? "text-white"
                                                                                                : "text-indigo-600",
                                                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                        )}
                                                                                    >
                                                                                        <CheckIcon
                                                                                            className="h-5 w-5"
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                    </span>
                                                                                ) : null}
                                                                            </>
                                                                        )}
                                                                    </Listbox.Option>
                                                                )
                                                            )}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </div>
                                            </>
                                        )}
                                    </Listbox>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48 ">
                                Receiver City:{" "}
                            </label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={object ? object.ReceiverCity : ""}
                                id="ReceiverCity"
                                className="rounded sm:w-96 bg-gray-50 border border-gray-300 h-7"
                            />
                        </div>
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48">
                                Receiver Suburb:{" "}
                            </label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={
                                    object ? object.ReceiverSuburb : ""
                                }
                                id="ReceiverSuburb"
                                className="rounded sm:w-96 bg-gray-50 border border-gray-300 h-7"
                            />
                        </div>
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48">
                                Receiver PostCode:{" "}
                            </label>
                            <input
                                type="number"
                                name="name"
                                defaultValue={
                                    object ? object.ReceiverPostCode : ""
                                }
                                id="ReceiverPostCode"
                                className="rounded sm:w-96 bg-gray-50 border border-gray-300 h-7"
                            />
                        </div>
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block  w-48">
                                Transit Time:{" "}
                            </label>
                            <input
                                type="number"
                                defaultValue={object ? object.TransitTime : ""}
                                name="TransitTime"
                                id="TransitTime"
                                required
                                className="block sm:w-96 max-w-lg h-7 rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="flex w-full gap-x-2 justify-end">
                        <GtamButton
                            // disabled={isLoading}
                            name={"Cancel"}
                            onClick={CancelHandle}
                            type={"submit"}
                        />{" "}
                        <GtamButton
                            // disabled={isLoading}
                            name={object ? "Edit" : "Create"}
                            type={"submit"}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
