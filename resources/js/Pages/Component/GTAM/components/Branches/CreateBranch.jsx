import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    ChevronLeftIcon,
} from "@heroicons/react/20/solid";
import GtamButton from "../Buttons/GtamButton";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";



function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function CreateBranch({ currentUser,setBranch,branch,getBranches ,AlertToast, url,states, setActiveIndex }) {
    const [selectedState, setSelectedState] = useState(states[0]);
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState();
    useEffect(()=>{
        setSelectedState(states[0])
    },[states])
    useEffect(()=>{
        if(branch){
            setSelectedState(states.find((item)=>item.StateId === branch.StateId) )
            setValue(branch.PhoneNumber)
            setIsChecked(branch.StatusId==1?true:false)
        }
    },[])
    

    function AddBranch(e) {
        e.preventDefault();
        setIsLoading(true)
        const inputValues = {

            BranchId: branch?branch.BranchId:null,
            BranchName: document.getElementById("name").value,
            StateId: selectedState.StateId,
            PostalAddress: document.getElementById("PostalAddress").value,
            PostalSuburb: document.getElementById("PostalSuburb").value,
            PostalPostCode: document.getElementById("PostalPostcode").value,
            PhysicalAddress: document.getElementById("PhysicalAddress").value,
            PhysicalSuburb: document.getElementById("PhysicalSuburb").value,
            PhysicalPostCode: document.getElementById("PhysicalPostcode").value,
            RoadTrainStation: document.getElementById("RoadTrainStation").value,
            PhoneNumber: value,
            FaxNumber: document.getElementById("FaxNumber").value,
            ContactName: document.getElementById("ContactName").value,
            EmailAddress: document.getElementById("EmailAddress").value,
            NationalOpsEmail: document.getElementById("NationalOPSEmail").value,
            BranchOpsEmail: document.getElementById("BranchOPSEmail").value,
            WhOpsEmail: document.getElementById("WarehouseOPSEmail").value,
            StatusId: isChecked?1:2,
          };
        console.log(inputValues);
        axios
            .post(`${url}api/GTAM/Add/Branch`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                console.log("done");
                setBranch(null)
                getBranches()
                setActiveIndex(5)
                setIsLoading(false)
                AlertToast("Saved successfully",1)
            })
            .catch((err) => {
                AlertToast("Something went wrong",2)
                setIsLoading(false);
                console.log(err);
            });
    }

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
      }

    return (
        <div className="p-8">
            <div className="p-7 bg-white shadow-md rounded-xl">
                <h1 className="font-bold text-dark text-xl">
                    Create New Branches
                </h1>
                <div className="py-4">
                    <form  onSubmit={AddBranch}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-40 gap-y-5 py-6">
                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Name:
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        id="name"
                                        defaultValue={branch?branch.BranchName:""}
                                        className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="state"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    State:
                                </label>
                                <div className=" items-center w-full">
                                    <div>
                                        <Listbox
                                            value={selectedState}
                                            onChange={(e) => {
                                                setSelectedState(e);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <div className="relative ">
                                                        <Listbox.Button className="relative  w-full cursor-default rounded-md bg-white py-[0.39rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">
                                                                {
                                                                    selectedState?.StateCode
                                                                }
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                <ChevronUpDownIcon
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
                                                                {states?.map(
                                                                    (state) => (
                                                                        <Listbox.Option
                                                                            key={
                                                                                state.StateId
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
                                                                                            state.StateName

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
                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="PostalAddress"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Postal Address:
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        name="PostalAddress"
                                        id="PostalAddress"
                                        defaultValue={branch?branch.PostalAddress:""}
                                        className="block  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="PostalSuburb"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Postal Suburb:
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        name="PostalSuburb"
                                        id="PostalSuburb"
                                        defaultValue={branch?branch.PostalSuburb:""}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="PostalPostcode"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Postal Postcode :
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        name="PostalPostcode"
                                        defaultValue={branch?branch.PostalPostcode:""}
                                        id="PostalPostcode"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="hidden md:block"></div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="PhysicalAddress"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Physical Address :
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        defaultValue={branch?branch.PhysicalAddress:""}
                                        name="PhysicalAddress"
                                        id="PhysicalAddress"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="PhysicalSuburb"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Physical Suburb :
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        defaultValue={branch?branch.PhysicalSuburb:""}
                                        name="PhysicalSuburb"
                                        id="PhysicalSuburb"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="PhysicalPostcode"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Physical Postcode :
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        defaultValue={branch?branch.PhysicalPostcode:""}
                                        name="PhysicalPostcode"
                                        id="PhysicalPostcode"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="hidden md:block"></div>
                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="PhysicalPostcode"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Road Train Station :
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        name="RoadTrainStation"
                                        defaultValue={branch?branch.RoadTrainStation:""}
                                        id="RoadTrainStation"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            {/* <div className="hidden md:block"></div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="TimeZone"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Time Zone :
                                </label>
                                <div className="items-center w-full">
                                    <div>
                                        <Listbox
                                            value={selectedState}
                                            onChange={(e) => {
                                                setSelectedState(e);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <div className="relative ">
                                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.39rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">
                                                                {
                                                                    selectedState?.stateName
                                                                }
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                <ChevronUpDownIcon
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
                                                                {states?.map(
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
                                                                                            state.stateName
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
                            </div> */}
                            <div className="hidden md:block"></div>
                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="PhoneNumber"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Phone Number :
                                </label>
                                <div className="items-center w-full">
                                    <PhoneInput
                                        international
                                        countryCallingCodeEditable={false}
                                        defaultCountry="AU"
                                        value={value}
                                        onChange={setValue}
                                        className=" w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="FaxNumber"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Fax Number :
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        defaultValue={branch?branch.FaxNumber:""}
                                        name="FaxNumber"
                                        id="FaxNumber"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="ContactName"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Contact Name :
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        name="ContactName"
                                        id="ContactName"
                                        defaultValue={branch?branch.ContactName:""}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="EmailAddress:"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Email :
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        defaultValue={branch?branch.EmailAddress:""}
                                        name="EmailAddress"
                                        id="EmailAddress"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="NationalOPSEmail:"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    National OPS Email :
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        defaultValue={branch?branch.NationalOpsEmail:""}
                                        name="NationalOPSEmail"
                                        id="NationalOPSEmail"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="BranchOPSEmail"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Branch OPS Email :
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        defaultValue={branch?branch.BranchOpsEmail:""}
                                        name="BranchOPSEmail"
                                        id="BranchOPSEmail"
                                        className="block  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="WarehouseOPSEmail"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Warehouse OPS Email:
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        defaultValue={branch?branch.WhOpsEmail:""}
                                        name="WarehouseOPSEmail"
                                        id="WarehouseOPSEmail"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center md:col-span-2 md:w-[39.5rem]">
                                <label
                                    htmlFor="Status"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-44"
                                >
                                    Status:
                                </label>
                                <div className="items-center w-72 md:w-full">
                                    <div className="pb-1 ">
                                        <input
                                            type="checkbox"
                                            checked={isChecked} 
                                            onChange={handleCheckboxChange} 
                                            id="Status"
                                            className="rounded text-green-500 focus:ring-green-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <GtamButton
                            disabled={isLoading}
                                className={"px-8"}
                                name={branch?"Edit":"Create"}
                                type={"submit"}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
