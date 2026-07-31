import React from "react";
import Image from "next/image";

interface SectionProps {
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title,
  description,
  image,
  reverse = false,
}) => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div
        className={`flex flex-col items-center gap-8 md:gap-14 ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        <div className="flex-1">
          <div className="h-1 w-12 rounded-full bg-nus-orange-500" />
          <h2 className="mt-4 text-2xl font-bold text-nus-blue-600 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {description}
          </p>
        </div>
        <div className="flex-1">
          <Image
            src={image}
            alt={title}
            width={800}
            height={500}
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Section;
