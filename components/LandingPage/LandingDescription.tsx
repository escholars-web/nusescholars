import React from "react";

interface LandingDescriptionProps {
  text: string; // Text to display in the description
}

const LandingDescription: React.FC<LandingDescriptionProps> = ({ text }) => {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-nus-orange-700">
        Welcome
      </p>
      <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-nus-orange-500" />
      <p className="mt-6 text-lg leading-8 text-slate-600">{text}</p>
    </section>
  );
};

export default LandingDescription;
