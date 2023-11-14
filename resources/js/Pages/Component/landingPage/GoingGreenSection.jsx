import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid"
import Green from "../../../assets/pictures/green.webp"
import "../../../../css/gradient.css"

export default function GoingGreenSection (){
return(
    <div>
        <div className=" py-28 text-smooth ">
                    <div className="bg-gg bg-cover">
                        <div className="mx-auto max-w-7xl  px-6 lg:px-8  flex flex-col md:flex-row gap-x-10 gap-y-10 py-20 items-center">
                            <div className="md:w-6/12">
                                <h1 className="gradient-text py-5 text-6xl font-bold">
                                    Going Green
                                </h1>
                                <p className="mt-2 text-smooth">
                                    Gold Tiger is working toward a more
                                    sustained future by managing the risks of
                                    climate change. Going green is our major
                                    focus and we understand how air pollution
                                    and resource depletion impact the
                                    environment. That’s why we decided to
                                    implement a positive action program. We
                                    acknowledge that the most effective efforts
                                    should be directed at the decarbonisation of
                                    the transport industry, our intention is to
                                    produce an outcome that will positively
                                    impact global society.
                                </p>
                                <div className="flex items-center gap-x-1 text-goldt mt-2 hover:text-smooth">
                                <a href="/goinggreen" className="text">Read more</a>
                                <ChevronDoubleRightIcon className="h-4"/>
                                </div>
                            </div>
                            <div className="">
                                <img src={Green} alt="" className="" />
                            </div>
                        </div>
                    </div>
                   
                </div>
    </div>
)
}