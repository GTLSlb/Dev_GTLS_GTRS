import LogoWhite from "../assets/pictures/LogoWhite.webp";
import notFound from "../assets/pictures/404.webp";
import React from "react";

export default function NotFoundPage() {
    return (
        <main className="relative isolate h-full items-center  bg-dark bg-header">
            <div className="bg-tiremark bg-cover min-h-screen  flex flex-col ">
                <div className="flex flex-col   items-center gap-y-24 mt-32">
                    <div className="w-full flex justify-center">
                        <img src={LogoWhite} alt="" className="items-center" />
                    </div>
                    <div className="w-full flex justify-center">
                        <img src={notFound} alt="" />
                    </div>
                    <div className="w-full">

                        <div className="text-3xl sm:text-6xl text-smooth  font-bold flex justify-center">
                            Page Not Found
                        </div>
                        <div className="text-sm sm:text-xl text-smooth  flex justify-center sm:pt-8">
                            Sorry, we couldn't find the page you're looking for.
                        </div>
                        <div className="mt-2 flex text-goldd justify-center">
                            <a
                                href="/"
                                className="text-sm font-semibold text-goldd leading-7 text-white"
                            >
                                <span aria-hidden="true" className="text-goldd ">&larr;</span> <span className="text-goldd hover:text-smooth">Back to
                                home</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
