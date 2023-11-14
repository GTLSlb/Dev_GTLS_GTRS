import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { DocumentIcon } from "@heroicons/react/24/outline";
import GtamButton from "../../Buttons/GtamButton";
import { useState } from "react";
import { useEffect } from "react";

// const Pages = [
//     {
//         id: 0,
//         pages: [
//             {
//                 id: 0,
//                 name: "test1",
//                 imageUrl: DocumentIcon,
//                 active: true,
//             },
//             {
//                 id: 1,
//                 name: "SEO",
//                 imageUrl: DocumentIcon,
//                 active: false,

//             },
//             {
//                 id: 2,
//                 name: "Blog",
//                 imageUrl: DocumentIcon,
//                 active: false,
//             },
//         ],
//     },
//     {
//         id: 1,
//         pages: [
//             {
//                 id: 0,
//                 name: "test2",
//                 imageUrl: DocumentIcon,
//                 active: true,
//             },
//             {
//                 id: 1,
//                 name: "SEO",
//                 imageUrl: DocumentIcon,
//                 active: false,
//             },
//             {
//                 id: 2,
//                 name: "Blog",
//                 imageUrl: DocumentIcon,
//                 active: false,
//             },
//         ],
//     },
//     {
//         id: 2,
//         pages: [
//             {
//                 id: 0,
//                 name: "test3",
//                 imageUrl: DocumentIcon,
//                 active: true,
//             },
//             {
//                 id: 1,
//                 name: "SEO",
//                 imageUrl: DocumentIcon,
//                 active: false,
//             },
//             {
//                 id: 2,
//                 name: "Blog",
//                 imageUrl: DocumentIcon,
//                 active: false,
//             },
//         ],
//     },
// ];

export default function PagesList({ activeRole, setActivePage ,Pages,nextStep}) {

    const [PagesElements, setPagesElements] = useState(Pages);

    useEffect(() => {
        setPagesElements(Pages);
        setActivePage(0)
    }, [activeRole,Pages]);

    useEffect(() => {
        setPagesElements((prevData) =>
            prevData?.map((item,index) => ({
                ...item,
                active: index === 0,
            }))
        );
    }, [Pages]);

    const handleClick = (id) => {
        nextStep(3)
        setActivePage(id);
        setPagesElements((prevData) =>
            prevData.map((item,index) => ({
                ...item,
                active: index === id ? true : false,
            }))
        );
    };
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }
    return (
        <div>
            <div className="flex gap-x-2 border p-1">
                <p className="px-6 h-[27px] text-gray-500 font-bold">Pages</p>
            </div>
            <ul role="list" className="">
                {PagesElements?.map((page,index) => (
                    <li
                        key={page.PageId}
                        className={classNames(
                            page.active
                                ? "bg-gray-100 border-l-2 border-green-500"
                                : "text-indigo-600",
                            "relative py-4 hover:bg-gray-50"
                        )}
                        onClick={() => {
                            handleClick(index);
                        }}
                    >
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto flex  justify-between gap-x-6">
                                <div className="flex min-w-0 gap-x-4 items-center">
                                    <DocumentIcon className="h-7 w-7 flex-none rounded-full text-teal-500" />
                                    <div className="items-center">
                                        <p className="text-sm  leading-6 text-gray-900">
                                            {page.PageName}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-x-4">
                                    <ChevronRightIcon
                                        className="h-8 w-8 flex-none text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
