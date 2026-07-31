import React from "react";

interface HeroSectionProps {
  title: string;
  description?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, description }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-nus-blue-900 via-nus-blue-700 to-nus-blue-600 py-16 text-center text-white">
      {/* Decorative orange glow */}
      <div
        aria-hidden
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-nus-orange-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-nus-blue-400/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-balance text-3xl font-bold sm:text-4xl">{title}</h1>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-nus-orange-500" />
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-base text-nus-blue-100 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
