"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

interface Event {
  title: string;
  description: string;
  image: string;
}

const events: Event[] = [
  {
    title: "Orientation 2025",
    description:
      "Kickstart your journey with us at Orientation 2025! Happening from 6-7 Aug 2025.",
    image: "/images/orientation2024.jpg",
  },
  {
    title: "Boeing Visit!",
    description: "Join us for exciting company visits!",
    image: "/images/LandingCarousel/boeing.jpg",
  },
];

const EventsCarousel: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-nus-blue-600 sm:text-4xl">
            Upcoming Events
          </h2>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-nus-orange-500" />
        </div>

        <div className="mt-10">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            style={
              {
                "--swiper-navigation-color": "#EF7C00",
                "--swiper-pagination-color": "#EF7C00",
              } as React.CSSProperties
            }
            className="overflow-hidden rounded-2xl"
          >
            {events.map((event, index) => (
              <SwiperSlide key={index}>
                <div className="group relative aspect-[3/2] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 896px) 100vw, 896px"
                    className="object-cover"
                  />
                  {/* Caption overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-nus-blue-900/90 via-nus-blue-900/50 to-transparent px-6 pb-12 pt-16 text-left text-white">
                    <h3 className="text-xl font-bold sm:text-2xl">
                      {event.title}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-sm text-white/85 sm:text-base">
                      {event.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default EventsCarousel;
