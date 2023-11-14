import volvo from "../../../assets/partners/volvo.webp";
import haccp from "../../../assets/partners/haccp.webp";
import JAIX from "../../../assets/partners/JAIX.webp";
import nhvr from "../../../assets/partners/nhvr.webp";
import hvac from "../../../assets/partners/hvac.webp";
import navman from "../../../assets/partners/Navman-logo.webp";
const features = [
    {
        name: "Sleek design",
        description:
            "Technology plays an important role in Gold Tiger’s commitment to continuous improvement. It enables us to deliver transparent and responsive services and keeps us accountable for the commitments we make to our customers. ",
    },
    {
        name: "Comfort handle",
        description:
            'We use leading technologies throughout our operations, from <strong class="text-goldt">track and trace</strong> through to RF scanning and <strong class="text-goldt">JAIX logistics software</strong>. We can also integrate our system with our customers’ system, enabling you to see the same data that we do.',
    },
    {
        name: "One-button control1",
        description:
            'Our fleet is fitted with <strong class="text-goldt">Volvo’s Dynafleet package</strong>, which records the driver’s activities and reports any irregular or unacceptable driving patterns. It also captures useful data on truck performance, such as fuel used and CO2 emissions.',
    },
    {
        name: "Long spout",
        description:
            "Much of the data, with automatically generated reports, is available through the customer portal accessed via our website. It contains the simple but important basics – where is my freight, when will it arrive, proof of delivery – through to more advanced information for forecasting, budgeting and reporting purposes. Anything not available in the portal can usually be provided by the customer’s account manager or one of our customer service team members.",
    },
    {
        name: "One-button control",
        description:
            "Our technology is backed by dedicated customer service teams and account managers operating out of our Sydney, Melbourne and Brisbane offices/warehouses. Many customers prefer to contact their friendly Gold Tiger customer service contact when seeking information or to make a booking. ",
    },
];

export default function Technologies() {
    return (
        <div className="bg-dark" id="technologies">
            <div className="mx-auto max-w-2xl py-24 px-4 sm:py-32 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="flex flex-col justify-center  lg:flex-row items-center gap-y-16  ">
                    <div className="h-auto w-9/12   md:w-7/12  md:pr-16">
                        <a href="https://www.volvotrucks.com.au/en-au/" target="_blank">
                            <img
                                src={volvo}
                                alt="volvo"
                                className="h-auto sm:h-auto w-full"
                            />
                        </a>
                        <div className="max-w-2xl w-auto lg:max-w-7xl ">
                            <div className="flex flex-row mt-10 gap-2 justify-between items-left ">
                                <a href="https://www.nhvr.gov.au/safety-accreditation-compliance/national-heavy-vehicle-accreditation-scheme" target="_blank">
                                    <img
                                        src={nhvr}
                                        alt="nhvr"
                                        className="h-14 sm:w-16 sm:h-16 "
                                    />
                                </a>
                                <a href="" target="_blank">
                                    <img
                                        src={hvac}
                                        alt="hvac"
                                        className="h-14 sm:w-16 sm:h-16 "
                                    />
                                </a>
                                <a href="https://www.sqfi.com" target="_blank">
                                    <img
                                        src={haccp}
                                        alt="haccp"
                                        className="h-14 sm:w-16 sm:h-16 "
                                    />
                                </a>
                                <a href="https://jaix.com.au" target="_blank">
                                    <img
                                        src={JAIX}
                                        alt="JAIX"
                                        className="h-14 sm:w-16 sm:h-16 "
                                    />
                                </a>
                                <a href="https://www.navman.com.au/" target="_blank">
                                    <img
                                        src={navman}
                                        alt="navman"
                                        className="h-14 sm:w-16 sm:h-16 "
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="w-full border-l-4 border-goldt pl-5 lg:pl-16">
                        <div className=" pb-2">
                            <p className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                                Technologies
                            </p>
                            <h2 className="text-gray-100 mt-2 font-bold">
                                Modern technologies for an accountable service
                            </h2>
                        </div>

                        <dl className="mt-5 ">
                            {features.map((feature) => (
                                <div key={feature.name}>
                                    {/* <dt className="text-sm font-medium text-gray-900">{feature.name}</dt> */}
                                    <dd
                                        className=" text-base text-gray-300"
                                        dangerouslySetInnerHTML={{
                                            __html: feature.description,
                                        }}
                                    ></dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
