import { ChevronRightIcon } from "@heroicons/react/20/solid";
import {
    CheckBadgeIcon,
    PencilIcon,
    ShieldCheckIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import GtamButton from "../../Buttons/GtamButton";
import { useState } from "react";
import { useEffect } from "react";
import { Switch } from "@headlessui/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function RolesList({
    getRoles,
    currentUser,
    application,
    setActiveRole,
    AlertToast,
    Roles,
    nextStep,
    url,
}) {
    const [editIndex, setEditIndex] = useState();
    const [roleName, setRoleName] = useState();
    const [status, setStatus] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [Role, setRole] = useState();
    const [RolesElements, setRolesElements] = useState(Roles);
    const handleClick = (id) => {
        nextStep(2);
        setActiveRole(id);
        setRolesElements((prevData) =>
            prevData.map((item, index) => ({
                ...item,
                active: index === id ? true : false,
            }))
        );
    };

    useEffect(() => {
        setRolesElements(() =>
            Roles?.map((item,index) => ({
                ...item,
                active: index === 0,
            }))
        );
    }, [Roles]);
    const handleCreateRole = (id) => {
      setIsLoading(true)
let role= RolesElements?.find(
    (item) =>
        item.RoleName === roleName
)
        if(role && role.RoleId == id ){ 
            AlertToast("Can't use same name",3)
            setIsLoading(false)
        }
        else if(roleName==null){
            AlertToast("insert a role name please",3)
            setIsLoading(false)
        }else{
        const inputValues = {
            AppId: application ? application.AppId : null,
            RoleId: id ? id : null,
            RoleName: roleName,
            StatusId: status,
        };
        console.log(inputValues);
        axios
            .post(`${url}api/GTAM/Add/AppRole`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                console.log("done");
                AlertToast("Saved successfully",1)
                setEditIndex(null);
                setRoleName(null)
                getRoles();
                setIsLoading(false)
            })
            .catch((err) => {
                AlertToast("Something went wrong",2)
                setIsLoading(false)
                console.log(err);
            });
    };}

    

    function ToggleStatus(){
        if(status == 1){
            setStatus(2)
        }
        else{
            setStatus(1)
        }
    }

    return (
        <div>
            <div className="flex gap-x-2 border py-1 px-1">
                <p className="px-6 text-gray-500 font-bold">Roles</p>
                <input
                    type="text"
                    name="Role"
                    defaultValue={roleName}
                    onChange={(e) => {
                        setRoleName(e.target.value);
                    }}
                    id="Role"
                    className="block w-full rounded-md border-0 py-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <GtamButton
                    name={"+"}
                    className={"text-[15px] w-[1rem]"}
                    disabled={isLoading}
                    onClick={()=>{handleCreateRole()}}
                />
            </div>
            <ul role="list" className="">
                {RolesElements?.map((role, index) => (
                    <li
                        key={role.AppRoleId}
                        className={classNames(
                            role.active
                                ? "bg-gray-100 border-l-2 border-green-500"
                                : "text-indigo-600",
                            "relative py-4 hover:bg-gray-50"
                        )}
                        onClick={() => {
                            handleClick(index);
                        }}
                    >
                        {editIndex == role.AppRoleId ? (
                            <div className="px-4 sm:px-6 lg:px-8">
                                <div className="mx-auto flex  justify-between gap-x-6">
                                    <div className="flex min-w-0 gap-x-4 items-center">
                                        <div className="">
                                            <ShieldCheckIcon className="text-dark font-bold h-7" />
                                        </div>
                                        <div className="items-center">
                                            <input
                                                type="text"
                                                name="Role"
                                                id="Role"
                                                onChange={(e) => {
                                                    setRoleName(e.target.value);
                                                }}
                                                defaultValue={roleName}
                                                className="block w-full rounded-md border-0 py-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-x-4">
                                        <div className="h-full items-center flex ">
                                            <Switch
                                                checked={status==1?true:false}
                                                onChange={() => {
                                                    ToggleStatus();
                                                }}
                                                className={classNames(
                                                    status==1?"bg-green-600": "bg-gray-200",
                                                    "relative inline-flex h-4 w-10 items-center flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                                                )}
                                            >
                                                <span className="sr-only">
                                                    Use setting
                                                </span>
                                                <span
                                                    className={classNames(
                                                        status==1? "translate-x-5"
                                                            : "translate-x-0",
                                                        "pointer-events-none relative inline-block h-5 w-5 transform rounded-full shadow-xl bg-gray-100 shadow ring-0 transition duration-200 ease-in-out"
                                                    )}
                                                >
                                                    <span
                                                        className={classNames(
                                                            status==1? "opacity-0 duration-100 ease-out"
                                                                : "opacity-100 duration-200 ease-in",
                                                            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                                                        )}
                                                        aria-hidden="true"
                                                    >
                                                        <svg
                                                            className="h-3 w-3 text-gray-400"
                                                            fill="none"
                                                            viewBox="0 0 12 12"
                                                        >
                                                            <path
                                                                d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span
                                                        className={classNames(
                                                            status==1? "opacity-100 duration-200 ease-in"
                                                                : "opacity-0 duration-100 ease-out",
                                                            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                                                        )}
                                                        aria-hidden="true"
                                                    >
                                                        <svg
                                                            className="h-3 w-3 text-green-600"
                                                            fill="currentColor"
                                                            viewBox="0 0 12 12"
                                                        >
                                                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                                        </svg>
                                                    </span>
                                                </span>
                                            </Switch>
                                        </div>
                                        <button
                                            className="text-sm text-blue-400 font-semibold flex items-center gap-x-1"
                                            disabled={isLoading}
                                            onClick={() => {
                                                handleCreateRole(
                                                    role.AppRoleId
                                                );
                                            }}
                                        >
                                            <CheckBadgeIcon className="h-6 text-green-500" />
                                            {/* <span>Edit</span> */}
                                        </button>
                                        <ChevronRightIcon
                                            className="h-8 w-8  flex-none text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="px-4 sm:px-6 lg:px-8">
                                <div className="mx-auto flex  justify-between gap-x-6">
                                    <div className="flex min-w-0 gap-x-4 items-center">
                                        <div className="">
                                            <ShieldCheckIcon className="text-dark font-bold h-7" />
                                        </div>
                                        <div className="items-center">
                                            <p className="text-sm font-semibold leading-6 text-gray-900">
                                                {role.RoleName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-x-4">
                                        <button
                                            className="text-sm text-blue-400 font-semibold flex items-center gap-x-1"
                                            onClick={() => {
                                                setEditIndex(role.AppRoleId);
                                                setRoleName(role.RoleName);
                                                setStatus(role.StatusId)
                                            }}
                                        >
                                            <PencilIcon className="h-5" />
                                            {/* <span>Edit</span> */}
                                        </button>
                                        <ChevronRightIcon
                                            className="h-8 w-8  flex-none text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
