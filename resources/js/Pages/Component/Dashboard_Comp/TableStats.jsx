import React from "react";
import AmountCard from "./StatsCards.jsx/AmountCard";
import ConsCard from "./StatsCards.jsx/ConsCard";
import PODCard from "./StatsCards.jsx/PODCard";

import StateCard from "./StatsCards.jsx/StateCard";
import WeightCard from "./StatsCards.jsx/WeightCard";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

import "../../../../css/swiper.css";

function TableStats({ consSummary }) {
    return (
        <>
            <div className="mt-2 max-md:hidden grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">
                <StateCard states={consSummary?.receiverState} />
                <WeightCard totalWeight={consSummary?.totalWeight} />
                <AmountCard totalCost={consSummary?.totalCost} />
                <ConsCard totalCount={consSummary?.totalConsignments} />
                <PODCard
                    totalPODTrue={consSummary?.totalPODTrue}
                    totalCount={consSummary?.totalConsignments}
                />
            </div>
            <div className="md:hidden container">
                <Swiper
                    className="mySwiper"
                    slidesPerView={1}
                    loop={true}
                    breakpoints={{
                        530: {
                            slidesPerView: 2,
                        },
                    }}
                >
                    <SwiperSlide>
                        <StateCard states={consSummary?.receiverState} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <WeightCard totalWeight={consSummary?.totalWeight} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <AmountCard totalCost={consSummary?.totalCost} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <ConsCard totalCount={consSummary?.totalConsignments} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <PODCard totalPODTrue={consSummary?.totalPODTrue} />
                    </SwiperSlide>
                </Swiper>
            </div>
        </>
    );
}

export default TableStats;
