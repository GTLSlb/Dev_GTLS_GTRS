import Increase from "../../../assets/pictures/Increase.webp";
import { PresentationChartLineIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function Process() {
    const animatedRef = useRef();
    const animatedRef2 = useRef();
    const animatedRef3 = useRef();
    const animatedRef4 = useRef();
    const animatedRef5 = useRef();
    const animatedRef6 = useRef();
    const [inViewRef, inView] = useInView({ threshold: 0.5 });
    const [inViewRef2, inView2] = useInView({ threshold: 0.5 });
    const [inViewRef3, inView3] = useInView({ threshold: 0.5 });
    const [inViewRef4, inView4] = useInView({ threshold: 0.5 });
    const [inViewRef5, inView5] = useInView({ threshold: 0.5 });
    const [inViewRef6, inView6] = useInView({ threshold: 0.5 });

    useEffect(() => {
        if (inView) {
            animatedRef.current.classList.remove("hidden"); // Remove the 'hidden' class to reveal the element
            animatedRef.current.classList.add(
                "animate-fade-up",
                "animate-once",
                "animate-duration-[1000ms]",
                "animate-ease-linear"
            );
        } 
        if (inView2) {
            animatedRef2.current.classList.remove("hidden"); // Remove the 'hidden' class to reveal the element
            animatedRef2.current.classList.add(
                "animate-fade-up",
                "animate-once",
                "animate-duration-[1000ms]",
                "animate-ease-linear"
            );
        } 
        if (inView3) {
            animatedRef3.current.classList.remove("hidden"); // Remove the 'hidden' class to reveal the element
            animatedRef3.current.classList.add(
                "animate-fade-up",
                "animate-once",
                "animate-duration-[1000ms]",
                "animate-ease-linear"
            );
        }
        if (inView4) {
            animatedRef4.current.classList.remove("hidden"); // Remove the 'hidden' class to reveal the element
            animatedRef4.current.classList.add(
                "animate-fade-up",
                "animate-once",
                "animate-duration-[1000ms]",
                "animate-ease-linear"
            );
        } 
        if (inView5) {
            animatedRef5.current.classList.remove("hidden"); // Remove the 'hidden' class to reveal the element
            animatedRef5.current.classList.add(
                "animate-fade-up",
                "animate-once",
                "animate-duration-[1000ms]",
                "animate-ease-linear"
            );
        } 
        if (inView6) {
            animatedRef6.current.classList.remove("hidden"); // Remove the 'hidden' class to reveal the element
            animatedRef6.current.classList.add(
                "animate-fade-up",
                "animate-once",
                "animate-duration-[1000ms]",
                "animate-ease-linear"
            );
        }
    }, [inView, inView2, inView3, inView4, inView5, inView6]);

    return (
        <div className="bg-dark mt-10 pb-12 ">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto pt-10 w-full">
                    <p className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                        The process
                    </p>
                </div>
                <div
                    className="mt-10 flex flex-col relative gap-y-10 min-h-[1400px] md:min-h-[704px]"
                >
                    {/* <div
                        className="absolute h-full border  border-dashed border-goldt border-dashed-2 left-5 lg:left-[11.2rem]"
                    ></div> */}
                    <div ref={inViewRef}>
                        <div ref={animatedRef} className="flex gap-x-20 hidden">
                            <div className="text-goldt hidden lg:inline-block">
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    height="5em"
                                    width="5em"
                                >
                                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 017 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 01-.014.002H7.022zM11 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0zM6.936 9.28a5.88 5.88 0 00-1.23-.247A7.35 7.35 0 005 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 015 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 004 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 116 0 3 3 0 01-6 0zm3-2a2 2 0 100 4 2 2 0 000-4z" />
                                </svg>
                            </div>
                            <div className="relative">
                                <div className="z-10 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd rounded-full px-5 h-10 w-10 text-dark flex justify-center items-center font-bold text-xl">
                                    1
                                </div>
                                <div className="absolute h-full border  border-dashed border-goldt border-dashed-2 left-5 "></div>
                            </div>
                            <div>
                                <h1 className=" text-xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Consultation
                                </h1>
                                <p className="text-gray-300">
                                    Our team listens attentively to your
                                    requirements and understands your business
                                    objectives. We start it all with a
                                    consultation to gather all the necessary
                                    information.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div ref={inViewRef2}>
                        <div
                            ref={animatedRef2}
                            className="flex gap-x-20 hidden "
                        >
                            <div className="text-goldt font-bold hidden lg:inline-block">
                                <svg
                                    viewBox="0 0 64 64"
                                    fill="currentColor"
                                    height="5em"
                                    width="5em"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeMiterlimit={10}
                                        strokeWidth={3}
                                        d="M21 40v5h22l.001-5.107C49 36.195 53 29.564 53 22c0-11.598-9.402-21-21-21s-21 9.402-21 21c0 7.565 3.998 14.304 10 18zM28 45l-3-20M36 45l3-20"
                                    />
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeMiterlimit={10}
                                        strokeWidth={3}
                                        d="M25 26l4 3 3-3 3 3 4-3M21 45h22v6H21zM23 51h18v6H23zM25 57h14v6H25z"
                                    />
                                </svg>
                            </div>
                            <div className="relative">
                                <div className="z-10 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd rounded-full px-5 h-10 w-10 text-dark flex justify-center items-center font-bold text-xl">
                                    2
                                </div>
                                <div className="absolute h-full border  border-dashed border-goldt border-dashed-2 left-5  "></div>
                            </div>
                            <div>
                                <h1 className=" text-xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Customised solution
                                </h1>
                                <p className="text-gray-300">
                                    Based on the consultation, we devise a
                                    tailored logistics solution that meets your
                                    specific needs. Our experienced team
                                    combines its expertise with your input to
                                    create the ideal plan.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div ref={inViewRef3}>
                        <div
                            ref={animatedRef3}
                            className="flex gap-x-20 hidden"
                        >
                            <div className="text-goldt hidden lg:inline-block">
                                <svg
                                    viewBox="0 0 512 512"
                                    fill="currentColor"
                                    height="5em"
                                    width="5em"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={32}
                                        d="M403.29 32H280.36a14.46 14.46 0 00-10.2 4.2L24.4 281.9a28.85 28.85 0 000 40.7l117 117a28.86 28.86 0 0040.71 0L427.8 194a14.46 14.46 0 004.2-10.2v-123A28.66 28.66 0 00403.29 32z"
                                    />
                                    <path d="M352 144a32 32 0 1132-32 32 32 0 01-32 32z" />
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={32}
                                        d="M230 480l262-262a13.81 13.81 0 004-10V80"
                                    />
                                </svg>
                            </div>
                            <div className="relative">
                                <div className="z-10 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd rounded-full px-5 h-10 w-10 text-dark flex justify-center items-center font-bold text-xl">
                                    3
                                </div>
                                <div className="absolute h-full border  border-dashed border-goldt border-dashed-2 left-5 "></div>
                            </div>
                            <div>
                                <h1 className=" text-xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Competitive pricing
                                </h1>
                                <p className="text-gray-300">
                                    We offer competitive pricing for our
                                    top-quality services. Our goal is to provide
                                    value while maintaining cost-effectiveness,
                                    ensuring you receive the best return on your
                                    investment.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div ref={inViewRef4}>
                        <div
                            ref={animatedRef4}
                            className="flex gap-x-20 hidden"
                        >
                            <div className="text-goldt hidden lg:inline-block">
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    height="5em"
                                    width="5em"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M2 5h10v3l4-4-4-4v3H0v6h2zm12 6H4V8l-4 4 4 4v-3h12V7h-2z"
                                    />
                                </svg>
                            </div>
                            <div className="relative">
                                <div className="z-10 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd rounded-full px-5 h-10 w-10 text-dark flex justify-center items-center font-bold text-xl">
                                    4
                                </div>
                                <div className="absolute h-full border  border-dashed border-goldt border-dashed-2 left-5"></div>
                            </div>
                            <div>
                                <h1 className=" text-xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Seamless transition
                                </h1>
                                <p className="text-gray-300">
                                    With our expertise in transition management,
                                    we ensure a smooth shift of your logistics
                                    operations to Gold Tiger. Minimising
                                    disruption to your customers is our
                                    priority.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div ref={inViewRef5}>
                        <div
                            ref={animatedRef5}
                            className="flex gap-x-20 hidden"
                        >
                            <div className="text-goldt hidden lg:inline-block">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    height="5em"
                                    width="5em"
                                >
                                    <path d="M18 15a3 3 0 013 3 3 3 0 01-3 3 2.99 2.99 0 01-2.83-2H14v-2h1.17c.41-1.17 1.52-2 2.83-2m0 2a1 1 0 00-1 1 1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1m0-9a1.43 1.43 0 001.43-1.43 1.43 1.43 0 10-2.86 0A1.43 1.43 0 0018 8m0-5.43a4 4 0 014 4C22 9.56 18 14 18 14s-4-4.44-4-7.43a4 4 0 014-4M8.83 17H10v2H8.83A2.99 2.99 0 016 21a3 3 0 01-3-3c0-1.31.83-2.42 2-2.83V14h2v1.17c.85.3 1.53.98 1.83 1.83M6 17a1 1 0 00-1 1 1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1M6 3a3 3 0 013 3c0 1.31-.83 2.42-2 2.83V10H5V8.83A2.99 2.99 0 013 6a3 3 0 013-3m0 2a1 1 0 00-1 1 1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1m5 14v-2h2v2h-2m-4-6H5v-2h2v2z" />
                                </svg>
                            </div>
                            <div className="relative">
                                <div className="z-10 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd rounded-full px-5 h-10 w-10 text-dark flex justify-center items-center font-bold text-xl">
                                    5
                                </div>
                                <div className="absolute h-full border  border-dashed border-goldt border-dashed-2 left-5 "></div>
                            </div>
                            <div>
                                <h1 className=" text-xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Efficient execution
                                </h1>
                                <p className="text-gray-300">
                                    Once your logistics plan is in place, our
                                    dedicated team puts it into action. We
                                    use advanced technologies, reliable
                                    transportation and efficient warehousing to
                                    execute operations seamlessly.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div ref={inViewRef6}>
                        <div
                            ref={animatedRef6}
                            className="flex gap-x-20 hidden"
                        >
                            <div className="text-goldt hidden lg:inline-block">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    height="5em"
                                    width="5em"
                                >
                                    <path d="M12 2C6.486 2 2 6.486 2 12v4.143C2 17.167 2.897 18 4 18h1a1 1 0 001-1v-5.143a1 1 0 00-1-1h-.908C4.648 6.987 7.978 4 12 4s7.352 2.987 7.908 6.857H19a1 1 0 00-1 1V18c0 1.103-.897 2-2 2h-2v-1h-4v3h6c2.206 0 4-1.794 4-4 1.103 0 2-.833 2-1.857V12c0-5.514-4.486-10-10-10z" />
                                </svg>
                            </div>
                            <div className="relative">
                                <div className="z-10 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd rounded-full px-5 h-10 w-10 text-dark flex justify-center items-center font-bold text-xl">
                                    6
                                </div>
                            </div>
                            <div>
                                <h1 className=" text-xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Continuous support
                                </h1>
                                <p className="text-gray-300">
                                    We provide ongoing support to address any
                                    queries or concerns you may have. Our team
                                    remains committed to ensuring your logistics
                                    operations run smoothly and efficiently.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
