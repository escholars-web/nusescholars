import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LandingImageProps {
  imageUrl: string; // URL for the background image
  title?: string; // Optional overlay title
  subtitle?: string; // Optional supporting line under the title
}

const LandingImage: React.FC<LandingImageProps> = ({
  imageUrl,
  title,
  subtitle,
}) => {
  return (
    <section className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden">
      <Image
        src={imageUrl}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* NUS blue gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-nus-blue-900/90 via-nus-blue-900/40 to-nus-blue-900/30" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-nus-orange-300 sm:text-sm">
          National University of Singapore
        </p>
        {title && (
          <h1 className="text-balance mt-4 text-4xl font-bold leading-tight drop-shadow-lg sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
            {subtitle}
          </p>
        )}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/humans-of-descholars"
            className="rounded-lg bg-nus-orange-500 px-7 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-nus-orange-600 hover:shadow-xl"
          >
            Meet the Scholars
          </Link>
          <Link
            href="/about-us"
            className="rounded-lg border-2 border-white/70 px-7 py-3.5 text-base font-bold text-white transition-colors duration-200 hover:border-white hover:bg-white/10"
          >
            About the Programme
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/70">
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </section>
  );
};

export default LandingImage;
