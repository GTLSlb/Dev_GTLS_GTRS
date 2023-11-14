import Player from "./videoComponent";
function Video() {
    const playerStyle = {};
    const playerProps = { playing: true };
    return (
        <div className="bg-dark">
            <div className="relative isolate ">
                <div className="mx-auto  max-w-7xl flex flex-col items-center lg:flex-row">
                    <div className="relative  px-6 pt-20 pb-5 w-full sm:pt-32 lg:static lg:py-28 lg:px-8 lg:w-6/12 w-11/12">
                        <div className="relative w-full">
                            <div className="absolute p-4 bg-gradient-to-r from-goldd via-goldt -left-10 bottom-10 -top-10 right-1 hidden lg:block -z-10 rounded-3xl">
                                <div className="h-full  bg-dark rounded-2xl"></div>
                            </div>
                            <div className="relative rounded-3xl overflow-clip">
                                <Player />
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pb-24  sm:pb-32 lg:py-28 lg:px-8">
                        <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                            <div className="">
                                <div className=" w-full ">
                                    <h1 className="text-4xl pb-3 font-bold text-goldt ">
                                        Transport and logistics solutions
                                        tailored to your needs
                                    </h1>
                                    <p className="text-gray-300">
                                        Gold Tiger Logistics Solutions partners
                                        with FMCG, food, packaging,
                                        manufacturing, retail, industrial and
                                        other companies who operate statewide or
                                        nationwide and often 24/7. No two
                                        customers are the same, so we adapt
                                        solutions to our customers’ unique needs
                                        in transport, warehousing, distribution
                                        and integrated 3PL and 4PL partnerships.
                                        We operate a wholly owned fleet of
                                        top-quality Volvo trucks supported by a
                                        gold partnership with Volvo, which
                                        ensures our trucks are always on the
                                        road. Our qualified and experienced
                                        drivers are all employees, which means
                                        they are exclusively dedicated to the
                                        needs of our customers.{" "}
                                    </p>
                                    <br />
                                    <p className="font-bold text-gray-100">
                                        Interested in working with us? Call us
                                        on 1800 04 03 06 to discuss the unique
                                        solution your company needs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Video;
