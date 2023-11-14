import { useEffect, useState, useCallback } from "react";
import Department from "./Departments";
import { useDropzone } from "react-dropzone";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function EditEmployee({
    userProfile,
    roles,
    groups,
    branches,
    employees,
    departments,
    url,
    GetEmployees,
    currentUser,
    setActiveIndex,
}) {
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }
    const userTypes = [
        { TypeId: 1, TypeName: "Customer", StatusId: 1 },
        { TypeId: 2, TypeName: "Employee", StatusId: 1 },
        { TypeId: 3, TypeName: "Driver", StatusId: 1 },
    ];
    const [selectedGroup, setGroup] = useState(
        groups?.find((g) => userProfile?.GroupID == g.GroupId)
        ? groups?.find((g) => userProfile?.GroupID == g.GroupId)
        : groups[0]
    );
    const [selectedBranch, setBranch] = useState(
        branches?.find((b) => userProfile?.BranchId === b.BranchId)
            ? branches?.find((b) => userProfile?.BranchId === b.BranchId)
            : branches[0]
    );
    const [selectedType, setType] = useState(
        userTypes.find((type) => type.TypeId == userProfile?.TypeId)
    );
    const [selectedRole, setRole] = useState(
        roles?.find((b) => userProfile?.RoleId === b.RoleId)
            ? roles?.find((b) => userProfile?.RoleId === b.RoleId)
            : roles[0]
    );
    const [ReportTo, setReportTo] = useState(
        employees?.find((emp) => emp.EmployeeId === userProfile.ReportToId)
            ? employees?.find(
                  (emp) => emp.EmployeeId === userProfile.ReportToId
              )
            : 5
    );
    const [selectedDep, setDep] = useState(
        departments?.find((b) => userProfile?.DepartmentId === b.DepartmentId)
            ? departments?.find(
                  (b) => userProfile?.DepartmentId === b.DepartmentId
              )
            : departments[0]
    );
    const [Email, setEmail] = useState(userProfile?.Email);
    const [HiringDate, setHiringDate] = useState(userProfile?.HiringDate);
    const [Dob, setDob] = useState(userProfile?.Dob);
    const [Address, setAddress] = useState(userProfile?.Address);
    const [PhoneNumber, setPhoneNumber] = useState(userProfile?.PhoneNumber);
    const [Username, setUsername] = useState(userProfile?.Username);
    const [pp, setPP] = useState(userProfile?.Picture);
    const [FirstName, setFirstName] = useState(userProfile?.FirstName);
    const [LastName, setLastName] = useState(userProfile?.LastName);
    const [StatusId, setStatusId] = useState(userProfile?.StatusId? userProfile?.StatusId : 1);
    const handleSelectedGroup = (selected) => {
        setGroup(groups?.find((g) => selected.GroupId == g.GroupId));
    };
    const handleSelectedRole = (selected) => {
        setRole(roles?.find((g) => selected.RoleId == g.RoleId));
    };
    const handleSelectedBranch = (selected) => {
        setBranch(branches?.find((g) => selected.BranchId == g.BranchId));
    };
    const handleSelectedDep = (selected) => {
        setDep(departments?.find((g) => selected.DepartmentId == g.DepartmentId));
    };
    const handleSelectedType = (selected) => {
        setType(userTypes?.find((g) => selected.TypeId == g.TypeId));
    };
    const handleNameChange = (e) => {
        const name = e.target.value.split(" ");
        setFirstName(name[0]);
        setLastName(name[1]);
    };
    const handleStatusChange = (e) => {
        setStatusId(e.target.value == "Active" ? 1 : 2);
    };
    const handleReportTo = (e) => {
        const minimize = e.toLowerCase();
        const supertemp = minimize.split(" ");
        const superName = supertemp.filter(function (element) {
            return element !== "";
        });
        setReportTo(
            employees?.find(
                (emp) =>
                    emp.FirstName.toLowerCase() == superName[0] &&
                    emp.LastName.toLowerCase() == superName[1]
            )
        );
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
    let editedUser = {};

    const handleSubmit = () => {
        editedUser.UserId = userProfile.UserId;
        editedUser.UniqueId = userProfile.UniqueId;
        editedUser.TypeId = selectedType?.TypeId;
        editedUser.GroupId = selectedGroup?.GroupId;
        editedUser.Username = Username;
        editedUser.StatusId = StatusId;
        editedUser.FirstName = FirstName;
        editedUser.LastName = LastName;
        editedUser.Email = Email;
        editedUser.PhoneNumber = PhoneNumber;
        editedUser.Dob = Dob;
        editedUser.Address = Address;
        if (typeof pp === "string") {
            editedUser.Picture = pp;
        } else {
            editedUser.Picture = pp.name;
        }
        editedUser.NationalityId = userProfile.NationalityId;
        editedUser.BranchId = selectedBranch?.BranchId;
        editedUser.RoleId = selectedRole?.RoleId;
        editedUser.ReportToId = ReportTo?.EmployeeId;
        editedUser.HiringDate = HiringDate;
        editedUser.DepartmentId = userProfile.DepartmentId;
        
        try {
            axios
                .post(`${url}api/GTAM/Add/Employee`, editedUser, {
                    headers: {
                        UserId: currentUser.user_id,
                    },
                })
                .then((res) => {
                    console.log(res);
                    const fileData = new FormData();
                    fileData.append("file", pp);
                    if (fileData !== null) {
                        axios
                            .post("/upload", fileData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            })
                            .then((response) => {
                                GetEmployees();
                                setActiveIndex(1);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else {
                        console.log("Encountered an Error");
                    }
                })
                .catch((err) => {
                    console.log("Encountered an Error", err.response);
                });
        } catch (err) {
            console.log("Encountered an Error ", err);
        }
    };
    return (
        <div className="px-6 lg:px-8 p-10">
            <div className=" max-h-[80rem] overflow-y-scroll border-2 border-white rounded-xl max-w-full mx-auto relative bg-white shadow-xl">
                <div className="mx-5 my-5">
                    <div className=" rounded-lg p-6 max-w-full mx-auto overflow-x-hidden">
                        <p className="font-bold text-lg my-4">Edit {userProfile?.TypeId == 1 ? 'Customer' : userProfile?.TypeId == 2 ? "Employee" : 'Driver'}</p>
                        <div className="my-4">
                            <div className="flex flex-col lg:flex-row">
                                <div
                                    {...getRootProps()}
                                    className="flex flex-col justify-center"
                                >
                                    <input {...getInputProps()} />
                                    {pp === null &&
                                    pp !==
                                        "http://example.com/path/to/picture.jpg" ? (
                                        <p className="text-gray-500">
                                            Drag 'n' drop some files here, or
                                            click to select files
                                        </p>
                                    ) : (
                                        <div className="flex items-center">
                                            {pp ? (
                                                <img
                                                    src={
                                                        typeof pp === "string"
                                                            ? `userImgs/${pp}`
                                                            : URL.createObjectURL(
                                                                  pp
                                                              )
                                                    }
                                                    alt={
                                                        userProfile?.Picture
                                                            ?.name
                                                    }
                                                    className="w-36 h-36 border-1 rounded-full"
                                                />
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={`flex flex-col w-full ${
                                        pp ? "ml-10 mt-2" : "ml-5"
                                    } lg:w-1/2`}
                                >
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <h1
                                            className="font-bold text-dark w-full lg:w-1/5"
                                            htmlFor="FullName"
                                        >
                                            Name:
                                        </h1>
                                        <input
                                            onChange={(e) =>
                                                handleNameChange(e)
                                            }
                                            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:w-7/12"
                                            defaultValue={`${FirstName} ${LastName}`}
                                        />
                                    </div>

                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            User Type:
                                        </label>
                                        <Listbox
                                            value={selectedType}
                                            onChange={handleSelectedType}
                                        >
                                            <div className="relative mt-1 w-full md:w-7/12">
                                                <Listbox.Button className="relative w-full rounded-md ring-1 ring-inset ring-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                    <span className="block truncate capitalize">
                                                        {selectedType?.TypeName}
                                                    </span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <ChevronDownIcon
                                                            className="h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                </Listbox.Button>
                                                <Listbox.Options className="my-2 ring-1 rounded-md ring-inset ring-gray-300">
                                                    {userTypes?.map((g) =>
                                                        g.StatusId == 1 ? (
                                                            <Listbox.Option
                                                                key={g.TypeId}
                                                                value={g}
                                                                className={`${
                                                                    g.TypeId ==
                                                                    1
                                                                        ? "bg-gray-100"
                                                                        : ""
                                                                } py-0.5 capitalize hover:bg-gray-50 hover:cursor-pointer`}
                                                            >
                                                                <span className="p-2 capitalize">
                                                                    {g.TypeName}
                                                                </span>
                                                            </Listbox.Option>
                                                        ) : null
                                                    )}
                                                </Listbox.Options>
                                            </div>
                                        </Listbox>
                                    </div>
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            Username:
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            placeholder="enter text here"
                                            defaultValue={Username}
                                            onChange={(e) => {
                                                setUsername(e.target.value);
                                            }}
                                            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:w-7/12"
                                        />
                                    </div>
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            Phone Number:
                                        </label>
                                        <input
                                            type="text"
                                            id="Fullname"
                                            placeholder="enter text here"
                                            defaultValue={PhoneNumber}
                                            onChange={(e) => {
                                                setPhoneNumber(e.target.value);
                                            }}
                                            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:w-7/12"
                                        />
                                    </div>
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            Date of Birth:
                                        </label>
                                        <input
                                            type="date"
                                            id="Fullname"
                                            placeholder="enter text here"
                                            defaultValue={Dob}
                                            onChange={(e) => {
                                                setDob(e.target.value);
                                            }}
                                            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:w-7/12"
                                        />
                                    </div>
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            Address:
                                        </label>
                                        <input
                                            type="text"
                                            id="Fullname"
                                            placeholder="enter text here"
                                            onChange={(e) => {
                                                setAddress(e.target.value);
                                            }}
                                            defaultValue={Address}
                                            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:w-7/12"
                                        />
                                    </div>
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            Department:
                                        </label>
                                        <Listbox
                                            value={selectedDep}
                                            onChange={handleSelectedDep}
                                        >
                                            <div className="relative mt-1 w-full md:w-7/12">
                                                <Listbox.Button className="relative w-full rounded-md ring-1 ring-inset ring-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                    <span className="block truncate capitalize">
                                                        {selectedDep?.DepartmentName}
                                                    </span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <ChevronDownIcon
                                                            className="h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                </Listbox.Button>
                                                <Listbox.Options className="my-2 ring-1 rounded-md ring-inset ring-gray-300">
                                                    {departments?.map((g) =>
                                                        g.StatusId == 1 ? (
                                                            <Listbox.Option
                                                                key={g.DepartmentId}
                                                                value={g}
                                                                className={`py-0.5 capitalize hover:bg-gray-50 hover:cursor-pointer`}
                                                            >
                                                                <span className="p-2 capitalize">
                                                                    {g.DepartmentName}
                                                                </span>
                                                            </Listbox.Option>
                                                        ) : null
                                                    )}
                                                </Listbox.Options>
                                            </div>
                                        </Listbox>
                                    </div>
                                </div>
                                <div
                                    className={`flex flex-col w-full ${
                                        userProfile.pp ? "ml-5 mt-2" : ""
                                    } lg:w-1/2`}
                                >
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            Role:
                                        </label>
                                        <Listbox
                                            value={selectedRole}
                                            onChange={handleSelectedRole}
                                        >
                                            <div className="relative mt-1 w-full md:w-7/12">
                                                <Listbox.Button className="relative w-full rounded-md ring-1 ring-inset ring-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                    <span className="block truncate capitalize">
                                                        {selectedRole?.RoleName}
                                                    </span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <ChevronDownIcon
                                                            className="h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                </Listbox.Button>
                                                <Listbox.Options className="my-2 ring-1 rounded-md ring-inset ring-gray-300">
                                                    {roles?.map((g) =>
                                                        g.StatusId == 1 ? (
                                                            <Listbox.Option
                                                                key={g.RoleId}
                                                                value={g}
                                                                className={`${
                                                                    g.RoleId ==
                                                                    1
                                                                        ? "bg-gray-100"
                                                                        : ""
                                                                } py-0.5 capitalize hover:bg-gray-50 hover:cursor-pointer`}
                                                            >
                                                                <span className="p-2 capitalize">
                                                                    {g.RoleName}
                                                                </span>
                                                            </Listbox.Option>
                                                        ) : null
                                                    )}
                                                </Listbox.Options>
                                            </div>
                                        </Listbox>
                                    </div>
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            Email:
                                        </label>
                                        <input
                                            defaultValue={Email}
                                            type="text"
                                            id="Fullname"
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                            }}
                                            placeholder="enter text here"
                                            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:w-7/12"
                                        />
                                    </div>
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            Branch:
                                        </label>
                                        <Listbox
                                            value={selectedBranch}
                                            onChange={handleSelectedBranch}
                                        >
                                            <div className="relative mt-1 w-full md:w-7/12">
                                                <Listbox.Button className="relative w-full rounded-md ring-1 ring-inset ring-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                    <span className="block truncate capitalize">
                                                        {
                                                            selectedBranch?.BranchName
                                                        }
                                                    </span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <ChevronDownIcon
                                                            className="h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                </Listbox.Button>
                                                <Listbox.Options className="my-2 ring-1 rounded-md ring-inset ring-gray-300">
                                                    {branches?.map((g) =>
                                                        g.StatusId == 1 ? (
                                                            <Listbox.Option
                                                                key={g.BranchId}
                                                                value={g}
                                                                className={`${
                                                                    g.BranchId ==
                                                                    1
                                                                        ? "bg-gray-100"
                                                                        : ""
                                                                } py-0.5 capitalize hover:bg-gray-50 hover:cursor-pointer`}
                                                            >
                                                                <span className="p-2 capitalize">
                                                                    {
                                                                        g.BranchName
                                                                    }
                                                                </span>
                                                            </Listbox.Option>
                                                        ) : null
                                                    )}
                                                </Listbox.Options>
                                            </div>
                                        </Listbox>
                                    </div>
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            Group Policy:
                                        </label>
                                        <Listbox
                                            value={selectedGroup}
                                            onChange={handleSelectedGroup}
                                        >
                                            <div className="relative mt-1 w-full md:w-7/12">
                                                <Listbox.Button className="relative w-full rounded-md ring-1 ring-inset ring-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                    <span className="block truncate capitalize">
                                                        {selectedGroup?.GroupName}
                                                    </span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <ChevronDownIcon
                                                            className="h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                </Listbox.Button>
                                                <Listbox.Options className="my-2 ring-1 ring-inset ring-gray-300">
                                                    {groups?.map((g) =>
                                                        g.StatusId == 1 ? (
                                                            <Listbox.Option
                                                                key={g.GroupId}
                                                                value={g}
                                                                className={`${
                                                                    g.GroupId ==
                                                                    1
                                                                        ? "bg-gray-100"
                                                                        : ""
                                                                } py-0.5 capitalize hover:bg-gray-50 hover:cursor-pointer`}
                                                            >
                                                                <span className="p-2 capitalize">
                                                                    {
                                                                        g.GroupName
                                                                    }
                                                                </span>
                                                            </Listbox.Option>
                                                        ) : null
                                                    )}
                                                </Listbox.Options>
                                            </div>
                                        </Listbox>
                                    </div>
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            Report To:
                                        </label>
                                        <input
                                            type="text"
                                            id="Fullname"
                                            defaultValue={`${
                                                ReportTo
                                                    ? ReportTo?.FirstName
                                                    : ""
                                            } ${
                                                ReportTo
                                                    ? ReportTo?.LastName
                                                    : ""
                                            }`}
                                            onChange={(e) => {
                                                handleReportTo(e.target.value);
                                            }}
                                            placeholder="enter text here"
                                            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:w-7/12"
                                        />
                                    </div>
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            Hiring Date:
                                        </label>
                                        <input
                                            type="date"
                                            id="Fullname"
                                            placeholder="enter text here"
                                            defaultValue={HiringDate}
                                            onChange={(e) => {
                                                setHiringDate(e.target.value);
                                            }}
                                            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:w-7/12"
                                        />
                                    </div>
                                    <div className="flex flex-col pb-3 lg:flex-row">
                                        <label
                                            htmlFor="FullName"
                                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                                        >
                                            Employee Satus:
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="radio"
                                                id={userProfile.EmployeeId}
                                                name={Username}
                                                checked={
                                                    StatusId == 1
                                                        ? true
                                                        : false
                                                }
                                                className="rounded text-green-400 mt-1 mr-2 border-gray-300 focus:ring-green-500 w-4 h-4"
                                                value={
                                               "Active"
                                                }
                                                onChange={handleStatusChange}
                                            />
                                            <label>Active</label>
                                        </div>
                                        <div className="flex">
                                            <input
                                                type="radio"
                                                id={userProfile.EmployeeId}
                                                name={Username}
                                                checked={
                                                    StatusId == 2
                                                        ? true
                                                        : false
                                                }
                                                className="rounded text-green-400 mt-1 mx-2 border-gray-300 focus:ring-green-500 w-4 h-4"
                                                value={
                                                    "Inactive"
                                                }
                                                onChange={handleStatusChange}
                                            />
                                            <label>Inactive</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom-5 left-8 absolute w-[90%]">
                    <div className="flex justify-between px-4">
                        <button
                            className={classNames(
                                "  text-white px-5 py-1 rounded bg-dark hover:opacity-60"
                            )}
                            onClick={() => setActiveIndex(1)}
                        >
                            Cancel
                        </button>
                        <button
                            className={classNames(
                                "  text-white px-5 mr-10 py-1 rounded bg-dark hover:opacity-60"
                            )}
                            onClick={() => handleSubmit()}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
