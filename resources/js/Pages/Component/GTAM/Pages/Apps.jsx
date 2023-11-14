import { useState } from "react";
import GtamButton from "../components/Buttons/GtamButton";
import AppsPage from "../components/Apps/AppsPage";
import { useEffect } from "react";

export default function Apps({
    activeIndex,
    AlertToast,
    setActiveIndex,
    setActiveIndexGtam,
    currentUser,
    url,
    apps,
    setApplication,
}) {
    function CreateApp() {
        setApplication(null);
        setActiveIndex(8);
    }

    return (
        <div className="px-6 lg:px-8 p-2">
            <div className="mt-6 sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-bold text-gray-900">
                        Applications
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the Apps.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    {/* <button
                        type="button"
                        onClick={createUser}
                        className="block rounded-md bg-gray-800 py-1.5 px-5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Create Employee
                    </button> */}
                    <GtamButton
                        name={"Create App"}
                        onClick={CreateApp}
                        className={"w-[9rem]"}
                    />
                </div>
            </div>
            <div>
                <AppsPage
                    setActiveIndexGtam={setActiveIndexGtam}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    setApplication={setApplication}
                    apps={apps}
                />
            </div>
        </div>
    );
}
