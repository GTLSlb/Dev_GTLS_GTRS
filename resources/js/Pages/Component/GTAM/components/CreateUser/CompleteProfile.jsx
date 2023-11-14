import { Fragment, useState, useEffect, useCallback } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useDropzone } from "react-dropzone";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function CompleteProfile({
    setCheckStep1,
    setUserProfile,
    userType,
    branches,
    roles,
    departments,
    employees,
    depId,
    userProfile,
}) {
    const [FirstName, setFirstName] = useState(userProfile?.FirstName);
    const [LastName, setLastName] = useState(userProfile?.LastName);
    const [Username, setUsername] = useState(userProfile?.Username);
    const [phoneNbr, setPhoneNbr] = useState(userProfile?.PhoneNumber);
    const [Email, setEmail] = useState(userProfile?.Email);
    const [Address, setAddress] = useState(userProfile?.Address);
    const [Dob, setDob] = useState(userProfile?.Dob);
    const [HiringDate, setHiringDate] = useState(userProfile?.HiringDate);
    const [NationalityId, setNationalityId] = useState(
        userProfile?.NationalityId
    );
    const [ReportToId, setReportToId] = useState(userProfile?.ReportToId);
    const [pp, setPP] = useState(userProfile?.Picture);
    const [selectedRole, setSelectedRole] = useState(
        roles?.find((role) => userProfile?.RoleId === role.RoleId) || roles[0]
    );
    const [selectedBranch, setSelectedBranch] = useState(
        branches?.find((branch) => userProfile?.BranchId === branch.BranchId) ||
            branches[0]
    );
    const [selectedDep, setSelectedDep] = useState(
        branches?.find((branch) => branch.BranchId === depId?.BranchId) ??
            departments[0]
    );
    const [superUser, setSuperUser] = useState();

    useEffect(() => {
        if (
            FirstName &&
            phoneNbr &&
            pp &&
            pp !== "http://example.com/path/to/picture.jpg" &&
            Username &&
            LastName &&
            document.getElementById("email").validity.valid &&
            Dob &&
            Address &&
            selectedBranch &&
            selectedDep &&
            selectedRole
        ) {
            if(userType == 2 && ReportToId) {
                setUserProfile({
                    UserId: userProfile
                        ? userProfile.UserId
                            ? userProfile.UserId
                            : null
                        : null,
                    Username: Username,
                    StatusId: 1,
                    FirstName: FirstName,
                    LastName: LastName,
                    Email: Email,
                    PhoneNumber: phoneNbr,
                    Dob: moment(Dob).format("YYYY-MM-DD"),
                    Address: Address,
                    Picture: pp,
                    NationalityId: NationalityId,
                    BranchId: selectedBranch?.BranchId,
                    DepartmentId: selectedDep?.DepartmentId,
                    RoleId: selectedRole?.RoleId,
                    ReportToId: superUser?.EmployeeId,
                    HiringDate: moment(HiringDate).format("YYYY-MM-DD"),
                });
                setCheckStep1(true);
            }else if(userType!= 2){
                setUserProfile({
                    UserId: userProfile
                        ? userProfile.UserId
                            ? userProfile.UserId
                            : null
                        : null,
                    Username: Username,
                    StatusId: 1,
                    FirstName: FirstName,
                    LastName: LastName,
                    Email: Email,
                    PhoneNumber: phoneNbr,
                    Dob: moment(Dob).format("YYYY-MM-DD"),
                    Address: Address,
                    Picture: pp,
                    NationalityId: NationalityId,
                    BranchId: selectedBranch?.BranchId,
                    DepartmentId: selectedDep?.DepartmentId,
                    RoleId: selectedRole?.RoleId,
                    ReportToId: 1,
                    HiringDate: moment(HiringDate).format("YYYY-MM-DD"),
                });
                setCheckStep1(true);
            }
        }
    }, [
        FirstName,
        phoneNbr,
        pp,
        Username,
        LastName,
        Email,
        Dob,
        Address,
        selectedBranch,
        selectedDep,
        selectedRole,
        ReportToId,
    ]);
    const [suggestionsList, setSuggestionsList] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    useEffect(() => {
        if (ReportToId) {
            if (typeof ReportToId !== "number") {
                const mini = ReportToId.toLowerCase();
                const name = mini.split(" ");
                let filteredSuggestions = employees.filter((emp) =>
                    emp.FirstName.toLowerCase().includes(name[0].toLowerCase())
                );
                if(selectedSuggestion){
                    filteredSuggestions = [];
                }
                setSuggestionsList(filteredSuggestions);
                setSuperUser(
                    employees.find(
                        (emp) =>
                            emp.FirstName.toLowerCase() == name[0] &&
                            emp.LastName.toLowerCase() == name[1]
                    )
                );
            } else {
                let id = employees.find(
                    (emp) => emp.UserId == userProfile?.ReportToId
                );
                if (id) {
                    setReportToId(id.Userid);
                } else {
                    setReportToId("Mariam Kleilat");
                }
                setSuperUser(ReportToId);
            }
        }
    }, [ReportToId]);

    const handleSuggestionClick = (suggestion) => {
        setSuggestionsList([]);
        setSelectedSuggestion(`${suggestion.FirstName.toLowerCase()} ${suggestion.LastName.toLowerCase()}`);
        setReportToId(`${suggestion.FirstName} ${suggestion.LastName}`);
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles[0] && acceptedFiles[0].type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = () => {
                const binaryStr = reader.result;
                //setPP(binaryStr);
            };
            reader.readAsDataURL(acceptedFiles[0]);
            setPP(acceptedFiles[0]);
        } else {
            toast.warn("Invalid Format !", {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
    });

    return (
        <div className="py-2">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-x-20">
                <div>
                    <h1 className="font-bold text-dark">
                        Personal Information
                    </h1>
                    <p className="text-gray-500">
                        This information will be displayed publicly so be
                        careful what you share.
                    </p>
                </div>
                <div {...getRootProps()} className="flex flex-col">
                    <label className="font-bold text-dark">
                        User profile picture
                    </label>
                    <input {...getInputProps()} />
                    {pp == null &&
                    pp !== "http://example.com/path/to/picture.jpg" ? (
                        <p className="text-gray-500">
                            Drag 'n' drop some files here, or click to select
                            files
                        </p>
                    ) : (
                        <div className="flex items-center">
                            {pp ? (
                                <img
                                    src={
                                        typeof pp === "string"
                                            ? pp
                                            : URL.createObjectURL(pp)
                                    }
                                    alt={userProfile?.Picture?.name}
                                    className="w-[3.7rem] h-[3.5rem] border-1 rounded-full"
                                />
                            ) : (
                                <div className="bg-gray-200 w-[3.7rem] h-[3.5rem] border-1 rounded-full"></div>
                            )}
                            <span
                                className="text-red-500 pl-6 hover:font-semibold hover:cursor-pointer"
                                onClick={() => setPP(null)}
                            >
                                Remove
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-x-20 gap-y-2 py-5">
                <div>
                    <label
                        htmlFor="FullName"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        First name
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="Fullname"
                            id="Fullname"
                            value={FirstName}
                            placeholder="First Name"
                            onChange={(e) => {
                                setFirstName(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="JobTitle"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Last Name
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="JobTitle"
                            id="JobTitle"
                            value={LastName}
                            placeholder="Last Name"
                            onChange={(e) => {
                                setLastName(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="Phone"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Phone Number
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="Phone"
                            id="Phone"
                            value={phoneNbr}
                            placeholder="Phone number"
                            onChange={(e) => {
                                setPhoneNbr(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="Email"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Email
                    </label>
                    <div className="mt-2">
                        <input
                            type="email"
                            pattern="^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$"
                            name="email"
                            id="email"
                            value={Email}
                            placeholder="Email"
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="Phone"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        User Role
                    </label>
                    <div className="mt-2">
                        <div>
                            <Listbox
                                value={selectedRole}
                                onChange={(e) => {
                                    setSelectedRole(e);
                                }}
                            >
                                {({ open }) => (
                                    <>
                                        <div className="relative ">
                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.39rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                <span className="block truncate capitalize">
                                                    {roles?.find(
                                                        (role) =>
                                                            selectedRole.RoleId ===
                                                            role.RoleId
                                                    ).RoleName ||
                                                        roles[0].RoleName}
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
                                                    {roles?.map((role) =>
                                                        role.StatusId == 1 ? (
                                                            <Listbox.Option
                                                                key={
                                                                    role.RoleId
                                                                }
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    classNames(
                                                                        active
                                                                            ? "bg-gray-100"
                                                                            : "text-gray-900",
                                                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                    )
                                                                }
                                                                value={role}
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
                                                                                "block truncate capitalize"
                                                                            )}
                                                                        >
                                                                            {
                                                                                role.RoleName
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
                                                        ) : null
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
                <div>
                    <label
                        htmlFor="Business phone"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Address
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="Phone"
                            id="Phone"
                            value={userProfile?.Address}
                            placeholder="Address"
                            onChange={(e) => {
                                setAddress(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="Phone"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Department
                    </label>
                    <div className="mt-2">
                        <div>
                            <Listbox
                                value={selectedDep}
                                onChange={(e) => {
                                    setSelectedDep(e);
                                }}
                            >
                                {({ open }) => (
                                    <>
                                        <div className="relative ">
                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.39rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                <span className="block truncate capitalize">
                                                    {departments?.find(
                                                        (dep) =>
                                                            selectedDep.DepartmentId ==
                                                            dep.DepartmentId
                                                    )
                                                        ? departments?.find(
                                                              (dep) =>
                                                                  selectedDep.DepartmentId ==
                                                                  dep.DepartmentId
                                                          ).DepartmentName
                                                        : departments[0]
                                                              .DepartmentName}
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
                                                    {departments?.map((dep) =>
                                                        dep.StatusId == 1 ? (
                                                            <Listbox.Option
                                                                key={
                                                                    dep.DepartmentId
                                                                }
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    classNames(
                                                                        active
                                                                            ? "bg-gray-100"
                                                                            : "text-gray-900",
                                                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                    )
                                                                }
                                                                value={dep}
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
                                                                                "block truncate capitalize"
                                                                            )}
                                                                        >
                                                                            {
                                                                                dep.DepartmentName
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
                                                        ) : null
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
                <div>
                    <label
                        htmlFor="Business phone"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Username
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="Phone"
                            id="Phone"
                            value={Username}
                            placeholder="Username"
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="Phone"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Branch
                    </label>
                    <div className="mt-2">
                        <div>
                            <Listbox
                                value={selectedBranch}
                                onChange={(e) => {
                                    setSelectedBranch(e);
                                }}
                            >
                                {({ open }) => (
                                    <>
                                        <div className="relative ">
                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.39rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                <span className="block truncate capitalize">
                                                    {selectedBranch
                                                        ? selectedBranch?.BranchName
                                                        : branches[0]
                                                              .BranchName}
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
                                                    {branches?.map((branch) =>
                                                        branch.StatusId == 1 ? (
                                                            <Listbox.Option
                                                                key={
                                                                    branch.BranchId
                                                                }
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    classNames(
                                                                        active
                                                                            ? "bg-gray-100"
                                                                            : "text-gray-900",
                                                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                    )
                                                                }
                                                                value={branch}
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
                                                                                "block truncate capitalize"
                                                                            )}
                                                                        >
                                                                            {
                                                                                branch.BranchName
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
                                                        ) : null
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
                <div>
                    <label
                        htmlFor="Business phone"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Date of Birth
                    </label>
                    <div className="mt-2">
                        <input
                            type="date"
                            name="dob"
                            id="dob"
                            value={Dob}
                            onChange={(e) => {
                                setDob(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="Business phone"
                        className="block text-sm font-bold leading-6 text-gray-900"
                    >
                        Hiring Date
                    </label>
                    <div className="mt-2">
                        <input
                            type="date"
                            name="dob"
                            id="dob"
                            value={HiringDate}
                            onChange={(e) => {
                                setHiringDate(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                {userType == 1 ? null : (
                    <div>
                        <label
                            htmlFor="Business phone"
                            className="block text-sm font-bold leading-6 text-gray-900"
                        >
                            Report To
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="ReportTo"
                                id="report"
                                value={ReportToId}
                                placeholder="Name of supervisor"
                                onChange={(e) => {
                                    setReportToId(e.target.value);
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        {suggestionsList.length > 0 && (
                            <ul className="relative w-full cursor-default rounded-md bg-white py-[0.39rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                {suggestionsList.map((suggestion, index) => (
                                    <li 
                                        className="relative cursor-default select-none capitalize py-2 px- w-full hover:bg-gray-100"
                                        key={index}
                                        onClick={() =>
                                            handleSuggestionClick(suggestion)
                                        }
                                    >
                                        {suggestion.FirstName} {suggestion.LastName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
