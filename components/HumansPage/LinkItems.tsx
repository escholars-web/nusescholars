import React from "react";
import Link from "next/link";

interface LinkItem {
  title: string;
  image: string;
  link: string;
}

interface LinksProps {
  linkItems: LinkItem[]; // Array of gallery items
}

const LinkItems: React.FC<LinksProps> = ({ linkItems }) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {linkItems.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="group relative block aspect-[3/2] overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-nus-blue-900/85 via-nus-blue-900/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {item.title}
              </h2>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-nus-orange-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                View batch
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LinkItems;
