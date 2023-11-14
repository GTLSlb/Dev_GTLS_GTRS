export default function TruckDriver(){
    return(
        <div className="mt-4">
            {/* <h1 className="mt-2 text-3xl pb-2 mt-5 font-bold tracking-tight text-goldt sm:text-3xl">
                                    Truck driver requirements
                                </h1> */}
                                <p className="font-bold text-smooth">
                                    All our drivers are employees and drive
                                    modern Volvo trucks owned by us. To become
                                    one of our line haul or state/local delivery
                                    drivers you must have:
                                </p>
                                <ul
                                    role="list"
                                    className="mt-8 max-w-xl space-y-2 text-gray-300"
                                >
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>a clean driving record.</span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            relevant driving experience.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            the relevant truck licence/s.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 m-0 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            a work ethic strong on reliability
                                            and customer service.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3 items-center">
                                        <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                        <span>
                                            good grooming (a company uniform is
                                            supplied).
                                        </span>
                                    </li>
                                </ul>
        </div>
    )
}