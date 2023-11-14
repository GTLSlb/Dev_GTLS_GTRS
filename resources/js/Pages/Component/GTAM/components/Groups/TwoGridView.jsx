import { useState } from "react";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import GroupList from "./GroupList";
import GroupDetails from "./GroupDetails";
import GtamButton from "../Buttons/GtamButton";

const Roles = [
    {
        id: 0,
        name: "Information Technology Admin",
        imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        active: true,
        pages: [
            {
                id: 0,
                name: "test1",
                imageUrl: DocumentIcon,
                status: true,
                appRole: 2,
            },
            {
                id: 1,
                name: "SEO",
                imageUrl: DocumentIcon,
                status: false,
                appRole: 2,
            },
            {
                id: 2,
                name: "Blog",
                imageUrl: DocumentIcon,
                status: false,
                appRole: 2,
            },
        ],
    },
    {
        id: 1,
        name: "Admin",
        imageUrl:
            "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        active: false,
        pages: [
            {
                id: 0,
                name: "test2",
                imageUrl: DocumentIcon,
                status: true,
                appRole: 2,
            },
            {
                id: 1,
                name: "SEO",
                imageUrl: DocumentIcon,
                status: false,
                appRole: 2,
            },
            {
                id: 2,
                name: "Blog",
                imageUrl: DocumentIcon,
                status: false,
                appRole: 2,
            },
        ],
    },
    {
        id: 2,
        name: "Editor ",
        imageUrl:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        href: "#",
        active: false,
        pages: [
            {
                id: 0,
                name: "test3",
                imageUrl: DocumentIcon,
                status: true,
                appRole: 2,
            },
            {
                id: 1,
                name: "SEO",
                imageUrl: DocumentIcon,
                status: false,
                appRole: 2,
            },
            {
                id: 2,
                name: "Blog",
                imageUrl: DocumentIcon,
                status: false,
                appRole: 2,
            },
        ],
    },
];

export default function TwoGridView({
    url,
    groups,
    AlertToast,
    currentUser,
    getGroups,
    appRoles,
    activeGroup,
    setActiveGroup,
    allApps,
}) {
    console.log(activeGroup);
    const [step, setStep] = useState(1);
    const [activePage, setActivePage] = useState(0);

    const nextStep = (nb) => {
        setStep(nb);
    };

    const previousStep = () => {
        setStep(step - 1);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <CSSTransition
                        key={1}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div>
                            <GroupList
                                url={url}
                                AlertToast={AlertToast}
                                groups={groups}
                                getGroups={getGroups}
                                currentUser={currentUser}
                                setActiveGroup={setActiveGroup}
                                Roles={Roles}
                                nextStep={nextStep}
                                previousStep={previousStep}
                            />
                        </div>
                    </CSSTransition>
                );
            case 2:
                return (
                    <CSSTransition
                        key={2}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div>
                            <GtamButton
                                name={"Back"}
                                onClick={previousStep}
                                className={"m-2"}
                            />
                            <GroupDetails
                                allApps={allApps}
                                AlertToast={AlertToast}
                                url={url}
                                getGroups={getGroups}
                                appRoles={appRoles}
                                groups={groups}
                                currentUser={currentUser}
                                activeGroup={activeGroup}
                                Apps={
                                    groups
                                        ? groups[activeGroup]?.Applications
                                        : []
                                }
                                nextStep={nextStep}
                                previousStep={previousStep}
                            />
                        </div>
                    </CSSTransition>
                );
            default:
                return null;
        }
    };

    return (
        <div className="">
            <div className="hidden md:grid grid-cols-3 divide-x py-1">
                <div>
                    <GroupList
                        url={url}
                        groups={groups}
                        getGroups={getGroups}
                        AlertToast={AlertToast}
                        currentUser={currentUser}
                        setActiveGroup={setActiveGroup}
                        Roles={Roles}
                        nextStep={nextStep}
                        previousStep={previousStep}
                    />
                </div>
                <div className="col-span-2">
                    <GroupDetails
                        allApps={allApps}
                        appRoles={appRoles}
                        AlertToast={AlertToast}
                        getGroups={getGroups}
                        url={url}
                        groups={groups}
                        currentUser={currentUser}
                        activeGroup={activeGroup}
                        Apps={groups ? groups[activeGroup]?.Applications : []}
                        nextStep={nextStep}
                        previousStep={previousStep}
                    />
                </div>
            </div>

            <div className="md:hidden overflow-x-hidden">
                <TransitionGroup>{renderStep()}</TransitionGroup>
            </div>
        </div>
    );
}
