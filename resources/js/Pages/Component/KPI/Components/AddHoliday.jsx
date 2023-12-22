import { useState } from "react";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronDoubleDownIcon,
    ChevronDownIcon,
} from "@heroicons/react/20/solid";
import GtamButton from "../../GTAM/components/Buttons/GtamButton";
import { useEffect } from "react";
import swal from "sweetalert";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function AddHoliday({
    states,
    holiday,
    url,
    currentUser,
    AToken,
    setHoliday,
    setShowAdd,
    fetchData,
}) {
    const [selected, setSelected] = useState(states[0]);
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [object, setObject] = useState();

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    useEffect(() => {
        if (holiday) {
            setObject(holiday);
            setSelected(
                states.find((item) => item.label == holiday?.HolidayState)
            );
        }
    }, [holiday]);

    useEffect(() => {
        if (holiday) {
            setSelected(
                states.find((item) => item.label == holiday.HolidayState)
            );
            setIsChecked(holiday.HolidayStatus == 1 ? true : false);
        }
    }, []);

    function AddHoliday(e) {
        e.preventDefault();
        setIsLoading(true);
        const inputValues = {
            HolidayId: object ? object.HolidayId : null,
            HolidayName: document.getElementById("HolidayName").value,
            HolidayDate: document.getElementById("HolidayDate").value,
            HolidayState: selected.label,
            HolidayDesc: document.getElementById("HolidayDesc").value,
            HolidayStatus: isChecked ? 1 : 2,
        };
        axios
            .post(`${url}Add/Holiday`, inputValues, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
                setHoliday(null);
                fetchData();
                setShowAdd(false);
                setIsLoading(false);
                // AlertToast("Saved successfully", 1);
            })
            .catch((err) => {
                // AlertToast("Something went wrong", 2);
                
                if (err.response && err.response.status === 401) {
                    // Handle 401 error using SweetAlert
                    swal({
                      title: 'Session Expired!',
                      text: "Please login again",
                      type: 'success',
                      icon: "info",
                      confirmButtonText: 'OK'
                    }).then(function() {
                      axios
                          .post("/logoutAPI")
                          .then((response) => {
                            if (response.status == 200) {
                              window.location.href = "/";
                            }
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                    });
                  } else {
                    // Handle other errors
                    console.log(err);
                    setIsLoading(false);
                  }
            });
    }

    return (
        <div className="shadow bg-white p-6 rounded-lg ">
            <form onSubmit={AddHoliday}>
                <p className="font-bold text-lg">Add Holiday</p>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-5 gap-y-5 items-center py-4">
                    <div className="col-span-2 flex items-center gap-x-2">
                        <label htmlFor="name" className="block w-32 ">
                            Holiday name:{" "}
                        </label>
                        <input
                            type="text"
                            required
                            name="name"
                            id="HolidayName"
                            defaultValue={object ? object.HolidayName : ""}
                            className="rounded w-96 bg-gray-50 border border-gray-300 h-7"
                        />
                    </div>
                    <div className=" flex items-center gap-x-2">
                        <label htmlFor="name" className="block ">
                            Date:{" "}
                        </label>
                        <input
                            type="date"
                            required
                            defaultValue={object ? object.HolidayDate : ""}
                            name="to-date"
                            id="HolidayDate"
                            className="block w-full max-w-lg h-7 rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className=" flex items-center gap-x-2">
                        <label htmlFor="name" className="block ">
                            State:{" "}
                        </label>
                        <div className="w-full">
                            <div>
                                <Listbox
                                    value={selected}
                                    onChange={(e) => {
                                        setSelected(e);
                                    }}
                                >
                                    {({ open }) => (
                                        <>
                                            <div className="relative ">
                                                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                    <span className="block truncate">
                                                        {selected
                                                            ? selected?.label
                                                            : " -- No States -- "}
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
                                                        {states.map((state) => (
                                                            <Listbox.Option
                                                                key={state.id}
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
                                                                value={state}
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
                                                        ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                    </div>
                    <div className=" flex items-center gap-x-2">
                        <label htmlFor="name" className="block  ">
                            Status:{" "}
                        </label>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            id="HolidayStatus"
                            className="rounded text-green-500 focus:ring-green-300"
                        />
                    </div>
                    <div className=" flex col-span-2 lg:col-span-5 gap-x-2">
                        <label htmlFor="name" className="block w-32 mr-3 ">
                            Description:{" "}
                        </label>
                        <textarea
                            type="text"
                            defaultValue={object ? object.HolidayDesc : ""}
                            name="name"
                            className="rounded w-full bg-gray-50 border border-gray-300 "
                            id="HolidayDesc"
                        />
                    </div>
                </div>
                <div className="flex w-full justify-end">
                    <GtamButton
                        disabled={isLoading}
                        name={object ? "Edit" : "Create"}
                        type={"submit"}
                    />
                </div>
            </form>
        </div>
    );
}
