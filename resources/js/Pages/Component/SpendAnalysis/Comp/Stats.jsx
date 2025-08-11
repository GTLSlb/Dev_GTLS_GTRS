import React, { useRef } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import PropTypes from "prop-types";

function CustomSwiperCard({ slides }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <Card className="col-span-1">
            <div className="relative flex justify-center items-center">
                <button ref={prevRef} className="absolute top-1/3 left-2 z-10">
                    <ChevronLeft />
                </button>
                <button ref={nextRef} className="absolute top-1/3 right-2 z-10">
                    <ChevronRight />
                </button>

                <Swiper
                    modules={[Navigation, A11y]}
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}
                    
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    className="mySwiper"
                >
                    {slides.map(([label, value], idx) => (
                        <SwiperSlide
                            key={idx}
                            className="flex flex-col !m-0 px-10"
                        >
                            <CardHeader className="truncate text-sm font-medium">
                                {label}
                            </CardHeader>
                            <CardBody className="p-0 pl-3 h-10 text-base">
                                {value}
                            </CardBody>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </Card>
    );
}


export default function Stats() {
    const statGroups = [
        {
            id: "deliveryStats",
            title: "Delivery Stats",
            data: [
                ["No of Consignments", "941"],
                ["No of Suppliers", "540"],
                ["In-Full Delivery (%)", "97.1%"],
                ["Avg Delivery Time", "1.3 days"],
                ["Late Deliveries (%)", "5.8%"],
                ["Return & Redelivery Rate", "8.5%"],
            ],
        },
        {
            id: "weightStats",
            title: "Weight Stats",
            data: [
                ["Total Weight", "1,000 T"],
                ["Total Pallets", "500 Pallet"],
            ],
        },
        {
            id: "financialStats",
            title: "Financial Stats",
            data: [
                ["Total Net Amount", "1,000 T"],
                ["Total Additional Charges", "500"],
                ["Total Fuel Levy", "1,000 T"],
                ["Total GST", "500"],
            ],
        },
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statGroups.map((group) => (
                <CustomSwiperCard
                    key={group.id}
                    title={group.title}
                    slides={group.data}
                />
            ))}
        </div>
    );
}

CustomSwiperCard.propTypes = {
    slides: PropTypes.arrayOf(PropTypes.array),
};
