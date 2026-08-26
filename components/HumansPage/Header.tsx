import React from "react";

interface HeaderProps {
  image: string;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ image, title }) => {
  return (
    <section className="relative flex h-72 items-center justify-center overflow-hidden sm:h-96">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={`${title} batch photo`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-nus-blue-900/90 via-nus-blue-900/40 to-nus-blue-900/20" />
      <div className="relative z-10 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-nus-orange-300">
          Humans of D&E-Scholars
        </p>
        <h1 className="mt-3 text-4xl font-bold drop-shadow-lg sm:text-5xl">
          {title}
        </h1>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-nus-orange-500" />
      </div>
    </section>
  );
};

export default Header;
