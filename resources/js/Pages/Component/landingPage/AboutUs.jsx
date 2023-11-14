import truckleft from "../../../assets/pictures/truckleft.webp";
import aboutcircle from "../../../assets/pictures/aboutcircle.webp";

const faqs = [
    {
        id: 1,
        question: "Our drivers are employees, not contractors.",
        answer: "All our drivers are employees, not contractors, which means they are exclusively dedicated to the needs of our customers.",
    },
    {
        id: 2,
        question: "We own all our trucks.",
        answer: "Our Volvo truck fleet is ready to go wherever and whenever our customers need us. Our present fleet meets the Euro 5 standard, with Euro 6 trucks beginning to join our fleet from January 2022.",
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

export default function AboutUs() {
    return (
        <div className="bg-dark" id="aboutus">
            <div className="absolute right-0 ">
                <img src={aboutcircle} alt="circle" />
            </div>
            <div
                id="about"
                className="relative isolate overflow-hidden py-6 sm:py-16 "
            >
                <div className="flex flex-col md:flex-row mx-auto max-w-7xl items-center  px-6 lg:px-8 gap-x-28">
                    <div className="mx-auto  w-full">
                        <p className="mt-2 text-4xl font-bold tracking-tight text-goldt sm:text-6xl">
                            About us
                        </p>
                        <p className="mt-6  text-base  text-gray-300">
                            Whether you need us for a single service –
                            transport, line haul, warehousing, distribution – or
                            an end-to-end 3PL or 4PL solution, Gold Tiger can
                            customise its service offering to meet your
                            business’s requirements. We will listen to what you
                            want, offer our suggestions and devise competitive
                            pricing for a top-quality service. Our team has
                            expertise and experience in transition management,
                            which means bringing your business to us can be done
                            with the least possible disruption to your
                            customers.
                        </p>
                    </div>

                    <div className="mx-auto mt-10 md:mt-0 w-full">
                        <img
                            src={truckleft}
                            alt="truck"
                            className="rounded-3xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
