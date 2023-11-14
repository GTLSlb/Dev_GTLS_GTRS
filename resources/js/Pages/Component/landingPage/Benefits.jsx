import forklift from "../../../assets/pictures/forklift.webp";
import { PresentationChartLineIcon } from "@heroicons/react/24/outline";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import React, { useState } from "react";

defineElement(lottie.loadAnimation);

export default function Benefits() {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleHover = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const divData = [
        {
            id: 1,
            text: "We'll streamline your logistics operations, improving efficiency and ensuring timely deliveries for your business.",
            color: "bg-blue-500",
        },
        {
            id: 2,
            text: "Your customers will be delighted with on-time delivery, which will drive growth and success for your business.",
            color: "bg-green-500",
        },
        {
            id: 3,
            text: "Our services are designed to adapt to your variable needs, providing scalability and flexibility as your shipment volumes fluctuate.",
            color: "bg-red-500",
        },
        {
            id: 4,
            text: "By optimising costs through efficient route planning and streamlined processes, we'll help you reduce expenses and enhance profitability.",
            color: "bg-red-500",
        },
        {
            id: 5,
            text: "Outsourcing your transport services to us allows you to focus on what you do best.",
            color: "bg-red-500",
        },
        {
            id: 6,
            text: "With our team of experts, you'll have access to industry knowledge, insights and effective risk management strategies.",
            color: "bg-red-500",
        },
        {
            id: 7,
            text: "Gain a competitive advantage in the market through timely deliveries, cost optimisation and superior customer satisfaction, attracting and retaining customers who value your reliability and efficiency.",
            color: "bg-red-500",
        },
        // Add more div data as needed
    ];

    return (
        <div className="bg-dark mt-2 pb-12 ">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto pt-10 w-full">
                    <p className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                        Benefits of our services
                    </p>
                </div>
                <div className=" relative flex flex-col lg:flex-row mx-auto mt-16 items-center sm:mt-20 flex gap-x-16">
                    <div className="relative w-full h-full flex flex-col gap-y-2">
                        <table className="border-collapse">
                        <tbody>
                            {divData.map((data, index) => (
                                <tr className="py-5">
                                    <td className="py-6">
                                        <div
                                            key={index}
                                            className={`text-white `}
                                        >
                                            <div className="h-3 w-3 bg-goldd rounded-full align-top"></div>
                                            {/* <div className={`ml-5`}>{data.text}</div> */}
                                        </div>
                                    </td>
                                    <td className="py-1">
                                        <div
                                            key={index}
                                            className={`text-white `}
                                        >
                                            <div className={`ml-5`}>
                                                {data.text}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-full  h-auto ">
                        <img src={forklift} />
                    </div>
                </div>
            </div>
        </div>
    );
}
