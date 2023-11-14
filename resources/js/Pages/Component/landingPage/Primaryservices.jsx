import {
    RectangleGroupIcon,
    BoltIcon,
    MapIcon,
    ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/outline";
import bolt from "../../../assets/json/bolt.json";
import lottie from "lottie-web";
import mix from "../../../assets/json/mix.json"
import { defineElement } from "lord-icon-element";

defineElement(lottie.loadAnimation);
const features = [
    {
        name: "Domestic transport services around Australia",
        description:
            "Gold Tiger transports palletised and odd shaped freight by full truck load (FTL) or less than full truck load (LTL) business-to-business around Australia. We can do regularly scheduled pallet pickups from multinational manufacturing plants operating 24/7 through to smaller companies. ",
        icon: "https://cdn.lordicon.com/wxhtpnnk.json",
        state: "morph",
    },
    {
        name: "Fast and flexible warehousing and distribution",
        description:
            "The Australian-built JAIX logistics software comprehensively records the movement and location of every customer product going in and out of our warehouses and trucks through RF inventory management. Customers can access live data in JAIX through our online client portal.",
        icon: "https://cdn.lordicon.com/mxzuvjjs.json",
        state: "",
    },
    {
        name: "Interstate line haul, point to point",
        description:
            "Line haul is the lifeblood of the transport system that takes consumer goods around Australia. Gold Tiger’s biggest trucks  are continually picking up hundreds of tonnes of freight, much of it ambient food products, and delivering it to warehouses and distribution centres around Australia.",
        icon: "https://cdn.lordicon.com/akuwjdzh.json",
        state: "",
    },
    {
        name: "	Mix and match an integrated logistics solution",
        description:
            "In an integrated logistics solution, which could reach the level of third-party logistics (3PL) or fourth-party logistics (4PL) provider, Gold Tiger will supply and manage all activities related to the movement of your goods across the supply chain from manufacturer to customers.",
        icon: "https://cdn.lordicon.com/ynwbvguu.json",
        state: "",
    },
];

export default function PrimaryServices() {
    return (
        <div className="bg-dark mt-2 pb-12 ">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto pt-10 w-full">
                    <p className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                        Services
                    </p>
                    <p className="mt-6 text-base  text-gray-300">
                        Whether you need us for a single service – transport,
                        line haul, warehousing, distribution – or an end-to-end
                        3PL or 4PL solution, Gold Tiger can customise its
                        service offering to meet your business’s requirements.
                        We will listen to what you want, offer our suggestions
                        and devise competitive pricing for a top-quality
                        service. Our team has expertise and experience in
                        transition management, which means bringing your
                        business to us can be done with the least possible
                        disruption to your customers.
                    </p>
                </div>
                <div className="mx-auto mt-16  sm:mt-20 ">
                    <div className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <div
                                key={feature.name}
                                className="relative  flex flex-col lg:flex-row "
                            >
                                <div className="top-0 left-0 flex mr-5 h-auto w-auto items-center mb-1 md:mb-0  rounded-lg ">
                                    <lord-icon
                                        trigger="hover"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                        }}
                                        colors="primary:#e2b540,secondary:#e2b540"
                                        src={feature.icon}
                                        state={feature.state}
                                    ></lord-icon>
                                </div>
                                <div className="border-l border-goldt border-opacity-30 pl-5">
                                    <div className="text-2xl font-semibold leading-7 text-goldt">
                                        {feature.name}
                                    </div>
                                    <div className="mt-1 text-base text-gray-300">
                                        {feature.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
