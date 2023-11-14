import whycircle from "../../../assets/pictures/whycircle.webp";
import login from "../../../assets/backgrounds/loginBackground.webp";

import { useState } from "react";
import AccordionView from "../accordionView";
const faqs = [
    {
        id: 1,
        question: "Our drivers are employees, not contractors.",
        answer: "All our drivers are employees, not contractors, which means they are exclusively dedicated to the needs of our customers.",
    },
    {
        id: 2,
        question: "We own all our trucks.",
        answer: "Our Volvo truck fleet is ready to go wherever and whenever our customers need us. Our present fleet meets the Euro 5 or Euro 6 standard, with Euro 6 trucks regulary joining our fleet.",
    },
    {
        id: 3,
        question: "Our trucks stay on the road and deliver to schedule.",
        answer: "We have a gold partnership with Volvo, which provides regular maintenance to the highest manufacturer standards, 24-hour breakdown repair around Australia, and replacement vehicles if trucks need to be off the road more than 24 hours. This is backed up by weekly checks and servicing by qualified mechanics in our own on-site workshops.",
    },
    {
        id: 4,
        question: "We are excellent communicators.",
        answer: "Lack of communication with the customer is perhaps our industry’s biggest failing. We strive to make communication a core strength, with dedicated customer service teams in Sydney, Melbourne and Brisbane. We regularly communicate through site visits, telephone, email and formal reports, and by providing easy access to information through our customer service team and JAIX logistics software.",
    },
    {
        id: 5,
        question: "We have outstanding stock visibility.",
        answer: "No matter where your goods are in our supply chain, we can find them instantly – and so can our customers through access to JAIX via our web portal or a direct interface with our system. We keep up with the latest technologies in our industry to ensure we can provide the best possible service to you.",
    },
    {
        id: 6,
        question: "Our managers are expert problem solvers.",
        answer: "Our management team comprises leaders with extensive industry experience. When problems interrupt the smooth flow of operations, they know how to fix them to keep disruptions to the bare minimum.",
    },
    {
        id: 7,
        question: "We work safely.",
        answer: "Our drivers are professionals with excellent driving skills and accident-free driving records. They are well trained in topics such as fatigue management, mass management and how to use required equipment. We also have an exceptional OHS record in our warehousing operations.",
    },
    // More questions...
];

export default function WhyGoldTiger() {
    const [isOpen, setOpen] = useState(false);
    const [openAccordionId, setOpenAccordionId] = useState(null);
    return (
        <div className="relative isolate bg-dark">
            <div className="absolute right-0 -z-10">
                <img src={whycircle} alt="circle" />
            </div>
            <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 ">
                <div className="">
                    <div className="mx-auto max-w-xl lg:ml-10 ">
                        <div className="mx-auto max-w-7xl px-6 py-6 sm:py-32 lg:py-32 lg:px-8">
                            <div className="mx-auto max-w-4xl ">
                                <h2 className="text-4xl font-bold leading-10 tracking-tight text-goldt">
                                    Why choose Gold Tiger?
                                </h2>

                                <div className="mt-10 space-y-4">
                                    {faqs.map((item) => (
                                        <AccordionView
                                            key={item.id}
                                            id={item.id}
                                            title={item.question}
                                            openAccordionId={openAccordionId}
                                            setOpenAccordionId={
                                                setOpenAccordionId
                                            }
                                        >
                                            <p>{item.answer}</p>
                                        </AccordionView>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:py-32 lg:px-8">
                    <div className="w-full h-auto md:mt-24">
                        <img
                            src={login}
                            alt="Truck"
                            className="w-full h-full rounded-xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
