import { useState } from "react";
import TwoGridView from "../components/Groups/TwoGridView";
import { useEffect } from "react";

export default function Groups({
    activeIndex,
    setActiveIndex,
    AlertToast,
    currentUser,
    getGroups,
    groups,
    roles,
    url,
    apps
}) {

    const [appRoles, setappRoles] = useState(roles);
    const [activeGroup, setActiveGroup] = useState(0);

    return (
        <div className="p-8">
            <div className="pb-5">
                <h1 className="text-xl text-dark font-bold ">Groups</h1>
                
            </div>
            <div className="bg-white rounded-xl">
                <TwoGridView
                    url={url}
                    appRoles={appRoles}
                    AlertToast={AlertToast}
                    allApps={apps}
                    activeGroup={activeGroup}
                    setActiveGroup={setActiveGroup}
                    groups={groups}
                    getGroups={getGroups}
                    currentUser={currentUser}
                />
            </div>
        </div>
    );
}
