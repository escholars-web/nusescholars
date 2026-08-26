import React from "react";
import LandingImage from "./LandingPage/LandingImage";
import LandingDescription from "./LandingPage/LandingDescription";
import EventsCarousel from "./LandingPage/EventsCarousel";
import UpcomingEvents from "./LandingPage/UpcomingEvents";
import LandingGalleryLinks from "./LandingPage/LandingGalleryLinks";

const galleryItems = [
  {
    title: "About Us",
    image: "/images/batch-pics/AY2223-EScholars.jpg",
    link: "/about-us",
  },
  {
    title: "Humans of D&E-Scholars",
    image: "/images/landing-page/humans.jpg",
    link: "/humans-of-descholars",
  },
];

const LandingPage: React.FC = () => {
  return (
    <>
      <LandingImage
        imageUrl="/images/orientation2024.jpg"
        title="Welcome to the D&E-Scholars webpage!"
        subtitle="Run by students, for students. A look inside the NUS Design & Engineering Scholars Programme."
      />
      <LandingDescription text="Welcome to nusdescholars.com! This is an informal website run by the D&E-Scholars Student Committee. Through this website, we hope to showcase what goes on in the life of a D&E-Scholar. Beyond that, we want this to be a place you actually come back to, whether you are figuring out if the programme is for you, digging through module reviews and notes in the Study Hub, or looking for a senior who can help you through a rough semester." />
      <EventsCarousel />
      <UpcomingEvents />
      <LandingGalleryLinks galleryItems={galleryItems} />
    </>
  );
};

export default LandingPage;
