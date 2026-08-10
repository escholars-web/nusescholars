"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // Import autoplay CSS
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // Import the Autoplay module
import { Typography } from "@mui/material";

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
    <div className="events-carousel">
      <div className="carousel-title">
        <Typography
          variant="h1"
          sx={{
            fontSize: "2.25rem", // equivalent to 36px
            fontWeight: "bold",
            fontFamily: "monospace",
            mb: 1, // margin bottom
          }}
        >
          Upcoming Events
        </Typography>
      </div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]} // Add the Autoplay module
        spaceBetween={10}
        slidesPerView={1}
        navigation
        autoplay={{
          delay: 3000, // 3 seconds delay
          disableOnInteraction: false, // Prevent pause on user interaction
        }}
        className="swiper-container"
      >
        {events.map((event, index) => (
          <SwiperSlide key={index}>
            <div className="event-slide">
              <div className="event-image-wrapper">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="event-image"
                />
              </div>
              <div className="event-details">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx>{`
        .events-carousel {
          margin: 2rem 0;
          text-align: center;
        }
        .carousel-title {
          margin-bottom: 1rem;
        }
        .event-slide {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .event-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 800px; /* Maximum width for larger screens */
          aspect-ratio: 3 / 2; /* Maintain aspect ratio of the image */
          overflow: hidden;
          border-radius: 8px;
        }
        .event-image {
          object-fit: cover; /* Ensures the image covers the container */
        }
        .event-details {
          margin-top: 1rem;
        }
        .event-title {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        .event-description {
          font-size: 1rem;
          color: #555;
        }

        @media (max-width: 768px) {
          .event-image-wrapper {
            max-width: 100%; /* Allow the image to shrink on smaller screens */
            height: auto; /* Ensure the height adjusts to maintain aspect ratio */
          }
        }
      `}</style>
    </div>
  );
};

export default EventsCarousel;
