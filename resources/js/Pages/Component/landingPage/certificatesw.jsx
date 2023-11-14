import React, { useState } from "react";
import { MagnifyingGlassPlusIcon } from "@heroicons/react/20/solid";
import cert1 from "../../../assets/certification/cert1.webp";
import cert2 from "../../../assets/certification/cert2.webp";
const posts = [
    {
        id: 1,
        title: "Gold Tiger LS PTY LTD",
        href: "#",
        description:
            "Has been assessed and certified as meeting the requirements of HACCP Certification, based upon Codex Alimentarius General Principles of Foof Hygiene CXC 1-1969 (2020) , for the following activities: Recieval, Storage & Distribution of Spices, Almond Milk, Popcorn and Glutan Free Products.",
        imageUrl: cert1,
        date: "Sep 29, 2022",
        datetime: "2020-03-16",
        category: { title: "Marketing", href: "#" },
        author: {
            name: "Michael Foster",
            role: "Co-Founder / CTO",
            href: "#",
            imageUrl:
                "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        id: 2,
        title: "Certificate of Registration Gold Tiger LS PTY LTD",
        href: "#",
        description:
            "Is registered as meeting the requirements of the SQF Food Safety Code: Storage and Distribution Edition 9, Certified HACCP Based Food Safety Plans. Scope of Registration: Food Sector Categories 26. Storage and Distribution. With Certificate number : 55111",
        imageUrl: cert2,
        date: "Sep 29, 2022",
        datetime: "2020-03-16",
        category: { title: "Marketing", href: "#" },
        author: {
            name: "Michael Foster",
            role: "Co-Founder / CTO",
            href: "#",
            imageUrl:
                "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    // More posts...
];

export default function Certifiactesw() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (index) => {
        setSelectedImage(index);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleOverlayClick = (event) => {
        if (event.target.classList.contains('modal-overlay')) {
          handleCloseModal();
        }
      };

    const renderModal = () => {
        if (selectedImage !== null) {
            return (
                <div
        className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center modal-overlay"
        onClick={handleOverlayClick}
      >
        <button
          className="absolute top-0 right-0 m-4 text-white hover:text-gray-300 focus:outline-none"
          onClick={handleCloseModal}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img src={selectedImage} alt={`Image ${selectedImage + 1}`} className="max-w-full max-h-full" />
      </div>
            );
        }
    };
    return (
        <div className="bg-dark py-8 sm:py-32 sm:pt-48">
            <div className="bg-gradient-to-br from-goldd via-goldl to-goldd  bg-opacity-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <table className="table-auto w-full">
                        <tbody>
                            <tr>
                                <td className=" px-4 py-10 w-4/12">
                                    <div>
                                    <h2 className="text-4xl font-bold tracking-tight text-dark">
                              Certificates
                          </h2>
                                        <p className="mt-2 text-lg  text-gray-600">
                                            We make sure that we meet all of our clients' expectations.
                                        </p>
                                    </div>
                                </td>
                                <td className="hidden lg:table-cell  px-4 py-2 w-6/12">
                                    <div className="relative  ">
                                        <div className="absolute w-full flex gap-x-20 -translate-y-2/4 ">
                                            <div className="relative transition-transform hover:scale-110">
                                                <img
                                                    src={cert1}
                                                    alt="certification"
                                                    
                                                    className="rounded-xl "
                                                />
                                                <div className="absolute w-full bg-white bottom-0 rounded-br-xl rounded-bl-xl  shadow-inner ">
                                                    <div className="max-w-xl p-6">
                                                        <div className=" flex items-center gap-x-4 text-xs">
                                                            <time
                                                                dateTime={
                                                                    posts[0]
                                                                        .datetime
                                                                }
                                                                className="text-gray-500"
                                                            >
                                                                {posts[0].date}
                                                            </time>
                                                        </div>
                                                        <div className="group relative ">
                                                            <h3 className="mt-2 text-xl font-bold leading-6 text-gray-600 group-hover:text-gray-600 line-clamp-1">
                                                                <span className="absolute inset-0" />
                                                                {posts[0].title}
                                                            </h3>
                                                            <p className="mt-1 text-sm  text-gray-400 line-clamp-2">
                                                                {
                                                                    posts[0]
                                                                        .description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleImageClick(cert1)
                                                    }
                                                    aria-label="zoom"
                                                    className="h-14 w-14 absolute bottom-28 right-0 mr-5 items-center gap-x-1.5 rounded-full bg-black py-1.5 px-1.5 text-sm font-semibold text-white shadow-sm hover:bg-goldt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    <MagnifyingGlassPlusIcon
                                                        className=" h-6 w-6 mx-auto"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </div>
                                            <div className="relative transition-transform hover:scale-110">
                                                <img
                                                    src={cert2}
                                                    alt="certification"
                                                    className="rounded-xl "
                                                />
                                                <div className="absolute w-full bg-white bottom-0 rounded-br-xl rounded-bl-xl shadow-inner">
                                                    <div className="max-w-xl p-6">
                                                        <div className=" flex items-center gap-x-4 text-xs">
                                                            <time
                                                                dateTime={
                                                                    posts[1]
                                                                        .datetime
                                                                }
                                                                className="text-gray-500"
                                                            >
                                                                {posts[1].date}
                                                            </time>
                                                        </div>
                                                        <div className="group relative ">
                                                            <h3 className="mt-2 text-xl font-bold leading-6 text-gray-600 group-hover:text-gray-600 line-clamp-1">
                                                                <span className="absolute inset-0" />
                                                                {posts[1].title}
                                                            </h3>
                                                            <p className="mt-1 text-sm  text-gray-400 line-clamp-2">
                                                                {
                                                                    posts[1]
                                                                        .description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleImageClick(cert2)
                                                    }
                                                    aria-label="zoom"
                                                    className="h-14 w-14 absolute bottom-28 right-0 mr-5 items-center  rounded-full bg-black py-1.5 px-1.5 text-sm  text-white shadow-sm hover:bg-goldt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    <MagnifyingGlassPlusIcon
                                                        className=" h-6 w-6 mx-auto"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr className="lg:hidden  ">
                                <td>
                                <div className="flex gap-x-5 flex-col sm:flex-row py-5 gap-y-5 px-5 sm:px-0">
                                    <div className="relative">
                                        <img
                                            src={cert1}
                                            alt="certification"
                                            className="rounded-xl"
                                        />
                                        <div className="absolute w-full bg-white bottom-0 rounded-br-xl rounded-bl-xl shadow-inner">
                                                    <div className="max-w-xl p-6">
                                                        <div className=" flex items-center gap-x-4 text-xs">
                                                            <time
                                                                dateTime={
                                                                    posts[0]
                                                                        .datetime
                                                                }
                                                                className="text-gray-500"
                                                            >
                                                                {posts[0].date}
                                                            </time>
                                                        </div>
                                                        <div className="group relative ">
                                                            <h3 className="mt-2 text-xl font-bold leading-6 text-gray-600 group-hover:text-gray-600 line-clamp-1">
                                                                <span className="absolute inset-0" />
                                                                {posts[0].title}
                                                            </h3>
                                                            <p className="mt-1 text-sm  text-gray-400 line-clamp-2">
                                                                {
                                                                    posts[0]
                                                                        .description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleImageClick(cert1)
                                            }
                                            aria-label="zoom"
                                            className="h-14 w-14 absolute bottom-28  right-0 mr-5 items-center gap-x-1.5 rounded-full bg-black py-1.5 px-1.5 text-sm font-semibold text-white shadow-sm hover:bg-goldt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            <MagnifyingGlassPlusIcon
                                                className=" h-6 w-6 mx-auto"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <img
                                            src={cert2}
                                            alt="certification"
                                            className="rounded-xl"
                                        />
                                        <div className="absolute w-full bg-white bottom-0 rounded-br-xl rounded-bl-xl shadow-inner">
                                                    <div className="max-w-xl p-6">
                                                        <div className=" flex items-center gap-x-4 text-xs">
                                                            <time
                                                                dateTime={
                                                                    posts[1]
                                                                        .datetime
                                                                }
                                                                className="text-gray-500"
                                                            >
                                                                {posts[1].date}
                                                            </time>
                                                        </div>
                                                        <div className="group relative ">
                                                            <h3 className="mt-2 text-xl font-bold leading-6 text-gray-600 group-hover:text-gray-600 line-clamp-1">
                                                                <span className="absolute inset-0" />
                                                                {posts[1].title}
                                                            </h3>
                                                            <p className="mt-1 text-sm  text-gray-400 line-clamp-2">
                                                                {
                                                                    posts[1]
                                                                        .description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleImageClick(cert2)
                                            }
                                            aria-label="zoom"
                                            className="h-14 w-14 absolute bottom-28  right-0 mr-5 items-center gap-x-1.5 rounded-full bg-black py-1.5 px-1.5 text-sm font-semibold text-white shadow-sm hover:bg-goldt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            <MagnifyingGlassPlusIcon
                                                className=" h-6 w-6 mx-auto"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {renderModal()}
                </div>
                
            </div>
        </div>
    );
}
