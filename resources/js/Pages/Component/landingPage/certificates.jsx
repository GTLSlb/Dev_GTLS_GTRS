import React, { useState } from "react";
import cert1 from "../../../assets/certification/cert1.webp";
import cert2 from "../../../assets/certification/cert2.webp";

const certificates = [
    {
        id: 0,

        icon: cert1,
    },
    {
        id: 1,

        icon: cert2,
    },
];

export default function Certificates() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (index) => {
        setSelectedImage(index);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const renderModal = () => {
        if (selectedImage !== null) {
            return (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
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
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <img
                        src={selectedImage}
                        alt={`Image ${selectedImage + 1}`}
                        className="max-w-full max-h-full"
                    />
                </div>
            );
        }
    };

    return (
        <div className="pt-20 bg-gray-200">
            <h2 className="text-3xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl  ">
                Certificates
            </h2>
            <div className="flex flex-wrap justify-center items-center   py-8 px-4">
                <div className="flex justify-center items-center">
                    <div className="w-full flex justify-center">
                        {certificates.map((certificate) => (
                            <img
                                key={certificate.id}
                                src={certificate.icon}
                                alt={certificate.id}
                                className="w-72 cursor-pointer p-2"
                                onClick={() =>
                                    handleImageClick(certificate.icon)
                                }
                            />
                        ))}
                    </div>
                </div>

                {renderModal()}
            </div>
        </div>
    );
}
