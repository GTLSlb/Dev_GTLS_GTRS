import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { StarIcon } from "@heroicons/react/24/solid";
import GtamButton from "../../Buttons/GtamButton";
import { Switch, Listbox, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";



export default function FeaturesList({ features, allData, activePage,getRoles,
    activeRole,
    AlertToast,
    currentUser,
    application,url }) {
    const [selected, setSelected] = useState();
    const [isLoading, setIsLoading] = useState(false);
    // console.log(allData)

    // const [status, setStatus] = useState(true);
    const [permissions, setPermissions] = useState();
    const [featuresElements, setFeaturesElements] = useState(features);

    function ToggleStatus() {
        setStatus(!status);
    }

    // useEffect(() => {
    //     setFeaturesElements(features);
    // }, [features]);

    useEffect(() => {
        setFeaturesElements(() =>
            features?.map((item) => ({
                ...item,
                StatusId: item.StatusId == 1 ? true : false,
            }))
        );
        // setSelected(allData[0])
        setPermissions(
            allData?.filter(
                (item) =>
                    !features?.some(
                        (feature) => feature.FeatureId === item.FeatureId
                    )
            )
        );
    }, [features,activeRole,activePage]);
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    function ToggleStatus(item){
        setIsLoading(true)
        let status=0
        if(item.StatusId==1){
            const updatedArray = featuresElements.map(feature => {
                if (feature.PermissionId === item.PermissionId) {
                  return { ...feature, StatusId: 2 }; // Change StatusId to 2
                }
                return feature; // Leave other items unchanged
              });
              status=2
              setFeaturesElements(updatedArray)
        }
        else{
            const updatedArray = featuresElements.map(feature => {
                if (feature.PermissionId === item.PermissionId) {
                  return { ...feature, StatusId: 1 }; // Change StatusId to 2
                }
                return feature; // Leave other items unchanged
              });
              status=1
              setFeaturesElements(updatedArray)
        }

        const inputValues = {
            PermissionId:  item.PermissionId,
            AppId: application ? application.AppId : null,
            RoleId:  activeRole,
            FeatureId:  item.FeatureId,
            StatusId: status,
        };
        axios
            .post(`${url}api/GTAM/Add/AppRolePermission`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {

                AlertToast("Saved successfully",1)
                getRoles();

                // AlertToast("Saved Successfully", 1);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                AlertToast("Something went wrong",2)
                // AlertToast("Error please try again.", 2);
                console.log(err);
            });

    }



    function AddPermission(){
        setIsLoading(true)
        const inputValues = {
            PermissionId:  null,
            AppId: application ? application.AppId : null,
            RoleId:  activeRole,
            FeatureId:  selected?.FeatureId,
            StatusId: 1,
        };
        axios
            .post(`${url}api/GTAM/Add/AppRolePermission`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                AlertToast("Saved successfully",1)
                getRoles();

                setSelected(null)
                // AlertToast("Saved Successfully", 1);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                AlertToast("Something went wrong",2)
                // AlertToast("Error please try again.", 2);
                console.log(err);
            });
    }


    return (
        <div>
            <div className="flex gap-x-2 border p-1">
                <p className="px-6 text-gray-500 font-bold">Features</p>
                <Listbox value={selected} onChange={setSelected}>
                    {({ open }) => (
                        <>
                            <div className="relative w-full">
                                <Listbox.Button className="relative w-full h-full cursor-default rounded-md bg-white py-[0.1rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    <span className="block truncate h-full">
                                        {selected?.FeatureName}
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
                                    <Listbox.Options className="absolute z-10 mt-0 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {permissions?.map((feature) => (
                                            <Listbox.Option
                                                key={feature.FeatureId}
                                                className={({ active }) =>
                                                    classNames(
                                                        active
                                                            ? "bg-indigo-600 text-white"
                                                            : "text-gray-900",
                                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                                    )
                                                }
                                                value={feature}
                                            >
                                                {({ selected, active }) => (
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
                                                                feature.FeatureName
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

                <GtamButton name={"+"} disabled={isLoading} className={"text-[15px] w-[1rem]"} onClick={AddPermission}/>
            </div>
            <ul role="list" className="divide-y divide-gray-100">
                {featuresElements?.map((feature) => (
                    <li
                        key={feature.PermissionId}
                        className="relative py-4 hover:bg-gray-50"
                    >
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto flex  justify-between gap-x-6 items-center">
                                <div className="flex min-w-0 gap-x-4 items-center">
                                    <StarIcon className="h-8 w-8 flex-none rounded-full text-yellow-500" />
                                    <div className="items-center">
                                        <p className="text-sm  leading-6 text-gray-900">
                                            {feature.FeatureName}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-full items-center flex ">
                                    <Switch
                                        checked={feature.StatusId}
                                        disabled={isLoading}
                                        onChange={() => {
                                            ToggleStatus(feature);
                                        }}
                                        className={classNames(
                                            feature.StatusId == 1
                                                ? "bg-green-600"
                                                : "bg-gray-200",
                                            "relative inline-flex h-4 w-10 items-center flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                                        )}
                                    >
                                        <span className="sr-only">
                                            Use setting
                                        </span>
                                        <span
                                            className={classNames(
                                                feature.StatusId == 1
                                                    ? "translate-x-5"
                                                    : "translate-x-0",
                                                "pointer-events-none relative inline-block h-5 w-5 transform rounded-full shadow-xl bg-gray-100 shadow ring-0 transition duration-200 ease-in-out"
                                            )}
                                        >
                                            <span
                                                className={classNames(
                                                    feature.StatusId == 1
                                                        ? "opacity-0 duration-100 ease-out"
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
                                                    feature.StatusId == 1
                                                        ? "opacity-100 duration-200 ease-in"
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
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
