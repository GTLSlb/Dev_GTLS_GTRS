import InvoicesButton from "../components/InvoicesButton";
import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import Select from "react-select";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function AddSupplier({
    setActiveIndexInv,
    url,
    getSuppliers,
    AlertToast,
    states,
    services,
    supplier,
    setSupplier,
    supplierData,
    cities,
}) {
    console.log(supplierData);
    const [isLoading, SetIsLoading] = useState(false);
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: "unset",
            height: "auto",
            // Add more styles here as needed
        }),
        option: (provided, state) => ({
            ...provided,
            color: "black",
            // Add more styles here as needed
        }),
        multiValue: (provided) => ({
            ...provided,
            // width: "30%",
            overflow: "hidden",
        }),
        valueContainer: (provided) => ({
            ...provided,
            width: "400px",
            maxHeight: "500px", // Set the maximum height for the value container
            overflow: "auto", // Enable scrolling if the content exceeds the maximum height
            // fontSize: '10px',
        }),
        inputContainer: (provided) => ({
            ...provided,
            height: "100px",
            border: "red",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            whiteSpace: "nowrap", // Prevent text wrapping
            overflow: "hidden",
            textOverflow: "ellipsis", // Display ellipsis when text overflows
            fontSize: "12px",
            // Add more styles here as needed
        }),
        // Add more style functions here as needed
    };
    function handleBack() {
        setActiveIndexInv(3);
    }
    const [newobject, setNewObject] = useState({});
    const [selected, setSelected] = useState(states[0]);
    const [selectedServices, setSelectedServices] = useState(
        services.filter((item) => item.StatusId == 1)[0]
    );
    const [citiesarray, setCitiesArray] = useState(
        cities.filter((city) => selected?.StateId === city?.StateId)
    );
    const [selectedCity, setSelectedCity] = useState();
    const [searchValue, setSearchValue] = useState("");
    const [filteredCities, setFilteredCities] = useState(
        citiesarray.filter((city) =>
            city.CityName.toLowerCase().startsWith(searchValue.toLowerCase())
        )
    );
    const [selectedCityOptions, setselectedCityOptions] = useState([]);
    const [supplierName, setSupplierName] = useState("");
    const [supplierEmail, setSupplierEmail] = useState("");
    const [supplierNumber, setSupplierNumber] = useState("");
    const [supplierLine, setSupplierLine] = useState("");
    const [supplierABN, setSupplierABN] = useState("");
    const [supplierStreet, setSupplierStreet] = useState("");
    const [supplierZipCode, setSupplierZipCode] = useState("");
    function setfilter(e) {
        setSearchValue(e);
        if (e.length > 0) {
            setFilteredCities(
                citiesarray.filter((city) =>
                    city.CityName.toLowerCase().startsWith(e.toLowerCase())
                )
            );
        } else {
            setFilteredCities([]);
        }
    }
    useEffect(() => {
        if (searchValue.length > 0) {
            setFilteredCities(
                citiesarray.filter((city) =>
                    city.CityName.toLowerCase().startsWith(
                        searchValue.toLowerCase()
                    )
                )
            );
        } else {
            setFilteredCities([]);
        }
        if (supplier) {
            setSelected(
                states?.find((state) => state.StateId === supplier.StateId)
            );
            setSelectedServices(
                services?.find(
                    (service) => service.ServiceId === supplier.ServiceId
                )
            );
            setSelectedCity(
                cities?.find((city) => city.CityId === supplier.CityId)
            );
            let city = cities?.find((city) => city.CityId === supplier.CityId);
            setselectedCityOptions({
                value: city?.CityId,
                label: city?.CityName,
            });
        }
    }, []);
    const validateForm = (e) => {
        e.preventDefault();
        if (
            supplierName === "" ||
            supplierEmail === "" ||
            supplierABN === "" ||
            supplierStreet === "" ||
            supplierZipCode === ""
        ) {
            AlertToast("Please fill in all required fields !", 2);
        } else {
            handleAddSupplier();
        }
    };
    const handleAddSupplier = () => {
        SetIsLoading(true);
        // Get the input values here and update the newobject state
        const inputValues = {
            SupplierId: supplier?.SupplierId,
            SupplierName: document.getElementById("supplierName").value,
            SupplierABN: document.getElementById("SupplierABN").value,
            SupplierNb: document.getElementById("SupplierNb").value,
            SupplierEmail: document.getElementById("SupplierEmail").value,
            SupplierLand: document.getElementById("SupplierLand").value,
            StreetNo: document.getElementById("StreetNo").value,
            ZipCode: document.getElementById("ZipCode").value,
            StateId: selected.StateId,
            CityId: selectedCityOptions.value,
            ServiceId: selectedServices.ServiceId,
            StatusId: 1,
            AddedBy: 1,
        };
        setNewObject(inputValues);

        const duplicateSupplier = supplierData.find(
            (mapppedsupplier) =>
                mapppedsupplier.SupplierName === inputValues.SupplierName &&
                mapppedsupplier.SupplierId !== inputValues.SupplierId
        );

        if (duplicateSupplier) {
            console.log(duplicateSupplier)
            SetIsLoading(false);
            AlertToast("A supplier with the same name already exist", 2);
            return;
        }
        axios
            .post(`${url}api/GTIS/Add/Supplier`, inputValues, {
                headers: {
                    UserId: 449,
                },
            })
            .then((res) => {
                getSuppliers();
                AlertToast("Saved Successfully", 1);
                setActiveIndexInv(3);
                setSupplier(null);
                SetIsLoading(false);
            })
            .catch((err) => {
                SetIsLoading(false);
                console.log(err);
                AlertToast("Error please try again.", 2);
            });
    };
    const validateEditForm = (e) => {
        e.preventDefault();
        if (
            document.getElementById("supplierName")?.value === "" ||
            document.getElementById("SupplierEmail")?.value === "" ||
            document.getElementById("SupplierABN")?.value === "" ||
            document.getElementById("StreetNo")?.value === "" ||
            document.getElementById("ZipCode")?.value === ""
        ) {
            AlertToast("Please fill in all required fields !", 2);
        } else {
            handleAddSupplier();
        }
    };
    // const handleStateSelectChange = (selectedOptions) => {
    //     setselectedStateOptions(selectedOptions);
    //     // filterData(SDate, EDate, selectedReceiver);
    // };
    const stateSelectOption = (jsonData) => {
        const transformedData = jsonData.map((item) => ({
            value: item.CityId,
            label: item.CityName,
        }));
        return transformedData;
    };
    const handleStateSelectChange = (selectedOptions) => {
        setselectedCityOptions(selectedOptions);
        // filterData(SDate, EDate, selectedReceiver);
    };
    if (supplier) {
        return (
            <div className="bg-smooth flex justify-center">
                <div className="w-full lg:w-1/2 p-5 gap-x-5 gap-y-5">
                    <form onSubmit={validateEditForm}>
                        <div className="rounded-xl shadow bg-white p-5 ">
                            <h1 className="font-bold text-dark text-3xl">
                                Edit Supplier
                            </h1>
                            <div className="grid grid-cols-2 p-2 gap-y-2  pb-20 mt-5 text-sm sm:text-base">
                                <h1 className="text-gray-400 border-b">
                                    Name:<span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 w-full border-b">
                                    <input
                                        required
                                        type="text"
                                        id="supplierName"
                                        defaultValue={supplier.SupplierName}
                                        className="rounded w-full h-7  border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Email:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        required
                                        type="text"
                                        id="SupplierEmail"
                                        defaultValue={supplier.SupplierEmail}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Mobile:
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        id="SupplierNb"
                                        defaultValue={supplier.SupplierNb}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Land Line:
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        id="SupplierLand"
                                        defaultValue={supplier.SupplierLand}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    ABN:<span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        required
                                        type="text"
                                        id="SupplierABN"
                                        defaultValue={supplier.SupplierABN}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Street Number:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        required
                                        type="text"
                                        id="StreetNo"
                                        defaultValue={supplier.StreetNb}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Service:
                                </h1>
                                <div className="pb-2 border-b">
                                    <div>
                                        <Listbox
                                            value={selectedServices}
                                            onChange={(e) => {
                                                setSelectedServices(e);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <div className="relative ">
                                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">
                                                                {selectedServices
                                                                    ? selectedServices?.ServiceName
                                                                    : " -- No Services -- "}
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
                                                                {services
                                                                    ?.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.StatusId ==
                                                                            1
                                                                    )
                                                                    .map(
                                                                        (
                                                                            service
                                                                        ) => (
                                                                            <Listbox.Option
                                                                                key={
                                                                                    service.ServiceId
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
                                                                                    service
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
                                                                                                service.ServiceName
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

                                <h1 className="text-gray-400 border-b">
                                    State:
                                </h1>
                                <div className="pb-2 border-b">
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
                                                                    ? selected?.StateName
                                                                    : " -- No States -- "}
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
                                                                {states.map(
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
                                <h1 className="text-gray-400 border-b">
                                    City:
                                </h1>
                                <div className="pb-2 border-b">
                                    <div className="flex flex-col gap-y-2">
                                        <Select
                                            placeholder={<div>City... </div>}
                                            styles={customStyles}
                                            name="colors"
                                            value={selectedCityOptions}
                                            isSearchable={true}
                                            options={stateSelectOption(
                                                citiesarray
                                            )}
                                            onChange={handleStateSelectChange}
                                            className="basic-multi-select text-red "
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Zip Code:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        required
                                        type="text"
                                        id="ZipCode"
                                        defaultValue={supplier.ZipCode}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end w-full gap-x-2">
                                <InvoicesButton
                                    name="Cancel"
                                    onClick={() => {
                                        handleBack();
                                        setSupplier(null);
                                    }}
                                    icon={
                                        <ChevronLeftIcon className="mr-1 h-5" />
                                    }
                                />
                                <InvoicesButton
                                    type={"submit"}
                                    name={
                                        isLoading ? (
                                            <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-smooth"></div>
                                            </div>
                                        ) : (
                                            "Save"
                                        )
                                    }
                                    // onClick={() => validateEditForm()}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    } else {
        return (
            <div className="bg-smooth flex justify-center">
                <div className="w-full lg:w-1/2 p-5 gap-x-5 gap-y-5">
                    <form onSubmit={validateForm}>
                        <div className="rounded-xl shadow bg-white p-5 ">
                            <h1 className="font-bold text-dark text-3xl">
                                Add Supplier
                            </h1>
                            <div className="grid grid-cols-2 p-2 gap-y-2  pb-20 mt-5 text-sm sm:text-base">
                                <h1 className="text-gray-400 border-b">
                                    Name:<span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 w-full border-b">
                                    <input
                                        required
                                        type="text"
                                        id="supplierName"
                                        onChange={(e) => {
                                            setSupplierName(e.target.value);
                                        }}
                                        className="rounded w-full h-7  border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Email:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        required
                                        type="text"
                                        id="SupplierEmail"
                                        onChange={(e) => {
                                            setSupplierEmail(e.target.value);
                                        }}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Mobile:
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        id="SupplierNb"
                                        onChange={(e) => {
                                            setSupplierNumber(e.target.value);
                                        }}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Land Line:
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        id="SupplierLand"
                                        onChange={(e) => {
                                            setSupplierLine(e.target.value);
                                        }}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    ABN:<span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        required
                                        type="text"
                                        id="SupplierABN"
                                        onChange={(e) => {
                                            setSupplierABN(e.target.value);
                                        }}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Street Number:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        required
                                        type="text"
                                        id="StreetNo"
                                        onChange={(e) => {
                                            setSupplierStreet(e.target.value);
                                        }}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Service:
                                </h1>
                                <div className="pb-2 border-b">
                                    <div>
                                        <Listbox
                                            value={selectedServices}
                                            onChange={(e) => {
                                                setSelectedServices(e);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <div className="relative ">
                                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">
                                                                {selectedServices
                                                                    ? selectedServices?.ServiceName
                                                                    : " -- No Services -- "}
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
                                                                {services
                                                                    ?.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.StatusId ==
                                                                            1
                                                                    )
                                                                    .map(
                                                                        (
                                                                            service
                                                                        ) => (
                                                                            <Listbox.Option
                                                                                key={
                                                                                    service.ServiceId
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
                                                                                    service
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
                                                                                                service.ServiceName
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
                                <h1 className="text-gray-400 border-b">
                                    State:
                                </h1>
                                <div className="pb-2 border-b">
                                    <div>
                                        <Listbox
                                            value={selected}
                                            onChange={(e) => {
                                                setSelected(e);
                                                setCitiesArray(
                                                    cities.filter(
                                                        (city) =>
                                                            e.StateId ===
                                                            city.StateId
                                                    )
                                                );
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <div className="relative ">
                                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">
                                                                {selected
                                                                    ? selected?.StateName
                                                                    : " -- No States -- "}
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
                                                                {states.map(
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
                                <h1 className="text-gray-400 border-b">
                                    City:
                                </h1>
                                <div className="pb-2 border-b">
                                    <div className="flex flex-col gap-y-2">
                                        <div className="mt-2 w-full sm:mt-0 ">
                                            <Select
                                                placeholder={
                                                    <div>City... </div>
                                                }
                                                styles={customStyles}
                                                name="colors"
                                                value={selectedCityOptions}
                                                isSearchable={true} // Set isSearchable to false to disable the search functionality
                                                options={stateSelectOption(
                                                    citiesarray
                                                )}
                                                onChange={
                                                    handleStateSelectChange
                                                }
                                                className="basic-multi-select text-red "
                                                classNamePrefix="select"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Zip Code:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        required
                                        type="text"
                                        id="ZipCode"
                                        onChange={(e) => {
                                            setSupplierZipCode(e.target.value);
                                        }}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end w-full gap-x-2">
                                <InvoicesButton
                                    name="Cancel"
                                    onClick={() => handleBack()}
                                    icon={
                                        <ChevronLeftIcon className="mr-1 h-5" />
                                    }
                                />
                                <InvoicesButton
                                    type={"submit"}
                                    name={
                                        isLoading ? (
                                            <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-smooth"></div>
                                            </div>
                                        ) : (
                                            "Add"
                                        )
                                    }
                                    // onClick={() => validateForm()}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
