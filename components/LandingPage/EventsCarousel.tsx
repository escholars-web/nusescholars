"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { INSTAGRAM_URL } from "../../src/lib/siteLinks";

interface Event {
  title: string;
  description: string;
  image: string;
}

/**
 * Past events, newest first.
 *
 * To add one, drop the photo into public/images/LandingCarousel/ and add an
 * entry here. Keep the descriptions in the past tense, this section is a
 * record of what we have run rather than an announcement board.
 */
const events: Event[] = [
  {
    title: "Orientation 2025",
    description:
      "Two days of games, dinner and far too much sun welcoming the AY25/26 batch, on 6 and 7 August 2025.",
    image: "/images/orientation2024.jpg",
  },
  {
    title: "Boeing Visit",
    description:
      "A look behind the scenes at Boeing, one of the company visits we organise for scholars.",
    image: "/images/LandingCarousel/boeing.jpg",
  },
];

const EventsCarousel: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-nus-blue-600 sm:text-4xl">
            Past Events
          </h2>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-nus-orange-500" />
          <p className="mt-4 text-base text-slate-600">
            A look at what we have been up to. We post most of our photos as
            they happen on Instagram.
          </p>
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

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-lg border border-[--border] bg-white px-5 py-2.5 text-sm font-bold text-nus-blue-600 transition-colors hover:border-nus-orange-400 hover:text-nus-orange-700"
          >
            What we get up to
            <span aria-hidden>&rarr;</span>
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-lg border border-[--border] bg-white px-5 py-2.5 text-sm font-bold text-nus-blue-600 transition-colors hover:border-nus-orange-400 hover:text-nus-orange-700"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            See more on @nusdescholars
          </a>
        </div>
      </div>
    </section>
  );
};

export default EventsCarousel;
