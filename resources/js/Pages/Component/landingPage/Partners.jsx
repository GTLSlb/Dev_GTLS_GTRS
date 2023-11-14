import volvo from "../../../assets/partners/volvo.webp";
import haccp from "../../../assets/partners/haccp.webp";
import JAIX from "../../../assets/partners/JAIX.webp";
import nhvr from "../../../assets/partners/nhvr.webp";
import hvac from "../../../assets/partners/hvac.webp";

export default function Partners() {
    return (
        <div className="bg-white  py-10">
            <div className="mx-auto max-w-2xl py-16 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl text-center  font-bold tracking-tight text-gray-900 sm:text-4xl mb-5">
                                    Our Partners
                                </h1>
                <div className="flex flex-col mt-14 gap-4 justify-between justify-center items-center sm:flex-row sm:justify-between">
                    <img src={nhvr} alt="1" className="h-32 sm:h-20 w-auto" />
                    <img src={hvac} alt="2" className="h-32 sm:h-20 w-auto" />
                    <img src={haccp} alt="3" className="h-32 sm:h-20 w-auto" />
                    <img src={JAIX} alt="4" className="h-32 sm:h-20 w-auto" />
                    <img src={volvo} alt="5" className="h-32 sm:h-20 w-auto" />
                </div>
            </div>
        </div>
    );
}
