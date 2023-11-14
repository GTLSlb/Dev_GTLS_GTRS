const faqs = [
    {
        id: 1,
        question: "Reliable domestic transport",
        answer: "Count on us for dependable and secure transportation services across Australia.",
    },
    {
        id: 2,
        question: "Swift deliveries",
        answer: "Experience timely and efficient deliveries, ensuring your goods reach their destination promptly.",
    },
    {
        id: 3,
        question: "Flexible warehousing and distribution",
        answer: "Benefit from our adaptable solutions that can be tailored to meet your specific warehousing and distribution needs.",
    },
    {
        id: 4,
        question: "Integrated logistics solutions",
        answer: "We offer a comprehensive approach, combining various logistics services to provide a seamless and integrated solution for your business.",
    },
    {
        id: 5,
        question: "Scalability",
        answer: "Our services are designed to accommodate your evolving requirements, allowing you to scale operations smoothly.",
    },
    {
        id: 6,
        question: "Cost-effective solutions",
        answer: "We optimise logistics processes to minimise spending and maximise cost savings for your business.",
    },
    {
        id: 7,
        question: "Expertise in interstate line haul",
        answer: "Rely on our specialised knowledge and experience in efficient interstate line haul services.",
    },
    {
        id: 8,
        question: "Point-to-point delivery",
        answer: "We provide secure and direct transportation from the pick-up location to the designated drop-off point.",
    },
    {
        id: 9,
        question: "Nationwide coverage",
        answer: "Our extensive network allows us to provide reliable transport services to destinations across Australia.",
    },
    {
        id: 10,
        question: "Dedicated customer support",
        answer: "Receive exceptional customer service and assistance from our dedicated team.",
    },
    // More questions...
];

export default function Features() {
    return (
        <div className="bg-dark">
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                <div className="mt-20">
                    <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-4 lg:gap-x-10">
                        <div className="col-span-2">
                            <div className=" text-4xl font-semibold leading-10 text-goldt">
                                What should you expect when you choose us as
                                your partner ?
                            </div>
                        </div>
                        {faqs.map((faq) => (
                            <div key={faq.id} className="transition-transform hover:scale-110 text-gray-300 hover:text-white hover:font-bold" >
                                <dt className="text-xl font-semibold leading-7 text-goldt">
                                    {faq.question}
                                </dt>
                                <dd className="mt-2 text-md leading-7 ">
                                    {faq.answer}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
