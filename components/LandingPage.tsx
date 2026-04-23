import React from "react";
import LandingImage from "./LandingPage/LandingImage";
import LandingDescription from "./LandingPage/LandingDescription";
import EventsCarousel from "./LandingPage/EventsCarousel";
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
        title="Welcome to the D&E-Scholars' webpage!"
      />
      <LandingDescription text="Welcome to nusdescholars.com! This is an informal website run by the D&E-Scholars' Student Committee. Through this website, we hope to showcase what goes on in the life of a D&E-Scholar. We also hope to provide a wide variety of information on the programme, from the academic aspects of the programme to the administrative aspects of applying to the programme!" />
      <EventsCarousel />
      <LandingGalleryLinks galleryItems={galleryItems} />
    </>
  );
};

export default LandingPage;
