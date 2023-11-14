import { useState } from "react";
import GtamButton from "../Buttons/GtamButton";
import FeaturesList from "./AppRoles/FeaturesList";
import PagesList from "./AppRoles/PagesList";
import RolesList from "./AppRoles/RolesList";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ThreeGridView from "./ThreeGridView";

const Roles = [
    {
        id: 0,
        name: "Super Admin",
        imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        active: true,
        pages: [
            {
                id: 0,
                name: "test1",
                imageUrl: DocumentIcon,
                active: true,
                features: [
                    {
                        id: 0,
                        name: "Test Feature12",
                        imageUrl: StarIcon,
                    },
                    {
                        id: 1,
                        name: "Test Feature26",
                        imageUrl: StarIcon,
                    },
                ],
            },
            {
                id: 1,
                name: "SEO",
                imageUrl: DocumentIcon,
                active: false,
                features: [
                    {
                        id: 0,
                        name: "Test Feature1",
                        imageUrl: StarIcon,
                    },
                    {
                        id: 1,
                        name: "Test Feature2",
                        imageUrl: StarIcon,
                    },
                ],
            },
            {
                id: 2,
                name: "Blog",
                imageUrl: DocumentIcon,
                active: false,
                features: [
                    {
                        id: 0,
                        name: "Test Feature1",
                        imageUrl: StarIcon,
                    },
                    {
                        id: 1,
                        name: "Test Feature2",
                        imageUrl: StarIcon,
                    },
                ],
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
                active: true,
                features: [
                    {
                        id: 0,
                        name: "Test Feature1",
                        imageUrl: StarIcon,
                    },
                    {
                        id: 1,
                        name: "Test Feature2",
                        imageUrl: StarIcon,
                    },
                ],
            },
            {
                id: 1,
                name: "SEO",
                imageUrl: DocumentIcon,
                active: false,
                features: [
                    {
                        id: 0,
                        name: "Test Feature1",
                        imageUrl: StarIcon,
                    },
                    {
                        id: 1,
                        name: "Test Feature2",
                        imageUrl: StarIcon,
                    },
                ],
            },
            {
                id: 2,
                name: "Blog",
                imageUrl: DocumentIcon,
                active: false,
                features: [
                    {
                        id: 0,
                        name: "Test Feature1",
                        imageUrl: StarIcon,
                    },
                    {
                        id: 1,
                        name: "Test Feature2",
                        imageUrl: StarIcon,
                    },
                ],
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
                active: true,
                features: [
                    {
                        id: 0,
                        name: "Test Feature1",
                        imageUrl: StarIcon,
                    },
                    {
                        id: 1,
                        name: "Test Feature2",
                        imageUrl: StarIcon,
                    },
                ],
            },
            {
                id: 1,
                name: "SEO",
                imageUrl: DocumentIcon,
                active: false,
                features: [
                    {
                        id: 0,
                        name: "Test Feature1",
                        imageUrl: StarIcon,
                    },
                    {
                        id: 1,
                        name: "Test Feature2",
                        imageUrl: StarIcon,
                    },
                ],
            },
            {
                id: 2,
                name: "Blog",
                imageUrl: DocumentIcon,
                active: false,
                features: [
                    {
                        id: 0,
                        name: "Test Feature1",
                        imageUrl: StarIcon,
                    },
                    {
                        id: 1,
                        name: "Test Feature2",
                        imageUrl: StarIcon,
                    },
                ],
            },
        ],
    },
];


export default function AppRoles({roles,pages,AlertToast, application,currentUser, getRoles, url,} ) {
    const [activeRole, setActiveRole] = useState(0);
    const [step, setStep] = useState(1);
    const [activePage, setActivePage] = useState(0);

    

    return (
        <div className="bg-white shadow-xl rounded-xl  mt-4">
            <div className="p-5 flex justify-between">
                <div>
                    <div className="text-dark font-bold text-2xl">
                        App Roles
                    </div>
                </div>
            </div>

           
            <ThreeGridView
            url={url}
            AlertToast={AlertToast}
            getRoles={getRoles}
            currentUser={currentUser}
            pages={pages}
            application={application}
                setActiveRole={setActiveRole}
                data={roles}
                activeRole={activeRole}
                setActivePage={setActivePage}
                activePage={activePage}
            />
        </div>
    );
}
