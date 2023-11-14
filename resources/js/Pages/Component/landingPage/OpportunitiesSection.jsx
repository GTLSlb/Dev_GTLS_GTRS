import fronttruck from "../../../assets/pictures/fronttruck.webp";


import ReactGA from 'react-ga';

export default function OpportuniotiesSection() {
    const handleClick = () => {
    ReactGA.event({
      category: 'ooportunities',
      action: 'Click',
      label: 'apply now',
    });
  };
    return (
        <div>
            <div className="h-24" id="opportunities"></div>
            <div>
                <div className="relative isolate overflow-hidden bg-dark bg-career bg-cover  sm:py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center">
                        <div className="w-full md:w-5/12">
                            <img src={fronttruck} alt="truck" />
                        </div>
                        <div className="w-full md:w-7/12 ">
                            <div className="mx-auto mb-5 ">
                                <h2 className="text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                                    CAREERS AT GOLD TIGER
                                </h2>
                                <p className="mt-6 text-lg leading-8 text-gray-300">
                                    Gold Tiger Logistic Solutions is a dynamic,
                                    fast-growing national company that is
                                    constantly seeking new employees across the
                                    areas of transport (truck drivers), customer
                                    service, administration, operations and
                                    warehousing.
                                </p>
                            </div>
                            <div>
                                <a href="/opportunities">
                                    <button onClick={handleClick} className="  rounded-3xl bg-gradient-to-r from-goldl to-goldd hover:from-goldd hover:to-goldl px-10 py-2.5 text-center text-md font-bold text-dark shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt">
                                        Apply now
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
