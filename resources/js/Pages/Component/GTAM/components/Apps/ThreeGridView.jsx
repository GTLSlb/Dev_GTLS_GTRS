import { useState } from "react";
import GtamButton from "../Buttons/GtamButton";
import FeaturesList from "./AppRoles/FeaturesList";
import PagesList from "./AppRoles/PagesList";
import RolesList from "./AppRoles/RolesList";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { CSSTransition, TransitionGroup } from "react-transition-group";

// const Roles = [
//     {
//         id:0,
//         name: "Super Admin",
//         imageUrl:
//             "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         active:true,
//         pages: [
//             {
//                 id: 0,
//                 name: "test1",
//                 imageUrl: DocumentIcon,
//                 active: true,
//                 features:[
//                     {
//                         id:0,
//                         name:"Test Feature12",
//                         imageUrl: StarIcon,
//                     },{
//                         id:1,
//                         name:"Test Feature26",
//                         imageUrl: StarIcon,
//                     }
//                 ],
//             },
//             {
//                 id: 1,
//                 name: "SEO",
//                 imageUrl: DocumentIcon,
//                 active: false,
//                 features:[
//                     {
//                         id:0,
//                         name:"Test Feature1",
//                         imageUrl: StarIcon,
//                     },{
//                         id:1,
//                         name:"Test Feature2",
//                         imageUrl: StarIcon,
//                     }
//                 ],

//             },
//             {
//                 id: 2,
//                 name: "Blog",
//                 imageUrl: DocumentIcon,
//                 active: false,
//                 features:[
//                     {
//                         id:0,
//                         name:"Test Feature1",
//                         imageUrl: StarIcon,
//                     },{
//                         id:1,
//                         name:"Test Feature2",
//                         imageUrl: StarIcon,
//                     }
//                 ],
//             },
//         ],
//     },
//     {
//         id:1,
//         name: "Admin",
//         imageUrl:
//             "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//        active:false,
//         pages: [
//             {
//                 id: 0,
//                 name: "test2",
//                 imageUrl: DocumentIcon,
//                 active: true,
//                 features:[
//                     {
//                         id:0,
//                         name:"Test Feature1",
//                         imageUrl: StarIcon,
//                     },{
//                         id:1,
//                         name:"Test Feature2",
//                         imageUrl: StarIcon,
//                     }
//                 ],
//             },
//             {
//                 id: 1,
//                 name: "SEO",
//                 imageUrl: DocumentIcon,
//                 active: false,
//                 features:[
//                     {
//                         id:0,
//                         name:"Test Feature1",
//                         imageUrl: StarIcon,
//                     },{
//                         id:1,
//                         name:"Test Feature2",
//                         imageUrl: StarIcon,
//                     }
//                 ],
//             },
//             {
//                 id: 2,
//                 name: "Blog",
//                 imageUrl: DocumentIcon,
//                 active: false,
//                 features:[
//                     {
//                         id:0,
//                         name:"Test Feature1",
//                         imageUrl: StarIcon,
//                     },{
//                         id:1,
//                         name:"Test Feature2",
//                         imageUrl: StarIcon,
//                     }
//                 ],
//             },
//         ],
//     },
//     {
//         id:2,
//         name: "Editor ",
//         imageUrl:
//             "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         href: "#",
//         active:false,
//         pages: [
//             {
//                 id: 0,
//                 name: "test3",
//                 imageUrl: DocumentIcon,
//                 active: true,
//                 features:[
//                     {
//                         id:0,
//                         name:"Test Feature1",
//                         imageUrl: StarIcon,
//                     },{
//                         id:1,
//                         name:"Test Feature2",
//                         imageUrl: StarIcon,
//                     }
//                 ],
//             },
//             {
//                 id: 1,
//                 name: "SEO",
//                 imageUrl: DocumentIcon,
//                 active: false,
//                 features:[
//                     {
//                         id:0,
//                         name:"Test Feature1",
//                         imageUrl: StarIcon,
//                     },{
//                         id:1,
//                         name:"Test Feature2",
//                         imageUrl: StarIcon,
//                     }
//                 ],
//             },
//             {
//                 id: 2,
//                 name: "Blog",
//                 imageUrl: DocumentIcon,
//                 active: false,
//                 features:[
//                     {
//                         id:0,
//                         name:"Test Feature1",
//                         imageUrl: StarIcon,
//                     },{
//                         id:1,
//                         name:"Test Feature2",
//                         imageUrl: StarIcon,
//                     }
//                 ],
//             },
//         ],
//     },
// ];

export default function ThreeGridView({
    url,
    getRoles,
    AlertToast,
    currentUser,
    pages,
    application,
    setActiveRole,
    data,
    activeRole,
    setActivePage,
    activePage,
}) {
    // const [activeRole, setActiveRole] = useState(0);
    const [step, setStep] = useState(1);
    // const [activePage, setActivePage] = useState(0);

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
                            <RolesList
                            AlertToast={AlertToast}
                                url={url}
                                getRoles={getRoles}
                                currentUser={currentUser}
                                application={application}
                                setActiveRole={setActiveRole}
                                Roles={data}
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
                            <PagesList
                                url={url}
                                AlertToast={AlertToast}
                                currentUser={currentUser}
                                activeRole={activeRole}
                                setActivePage={setActivePage}
                                Pages={data[activeRole]?.Pages}
                                nextStep={nextStep}
                                previousStep={previousStep}
                            />
                        </div>
                    </CSSTransition>
                );
            case 3:
                return (
                    <CSSTransition
                        key={3}
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
                            <FeaturesList
                                url={url}
                                AlertToast={AlertToast}
                                getRoles={getRoles}
                                currentUser={currentUser}
                                application={application}
                                allData={pages[activePage]?.Features}
                                activePage={activePage}
                                features={
                                    data[activeRole]?.Pages[activePage]
                                        ?.Features
                                }
                                activeRole={data[activeRole]?.AppRoleId}
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
                    <RolesList
                        url={url}
                        AlertToast={AlertToast}
                        getRoles={getRoles}
                        currentUser={currentUser}
                        application={application}
                        setActiveRole={setActiveRole}
                        Roles={data}
                        nextStep={nextStep}
                        previousStep={previousStep}
                    />
                </div>
                <div>
                    <PagesList
                        url={url}
                        AlertToast={AlertToast}
                        currentUser={currentUser}
                        activeRole={activeRole}
                        setActivePage={setActivePage}
                        Pages={data[activeRole]?.Pages}
                        nextStep={nextStep}
                        previousStep={previousStep}
                    />
                </div>
                <div>
                    <FeaturesList
                        url={url}
                        AlertToast={AlertToast}
                        activeRole={data[activeRole]?.AppRoleId}
                        getRoles={getRoles}
                        currentUser={currentUser}
                        application={application}
                        allData={pages[activePage]?.Features}
                        activePage={activePage}
                        features={data[activeRole]?.Pages[activePage]?.Features}
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
