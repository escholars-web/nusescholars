"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export interface PersonCardItem {
  image: string; // Image URL
  link: string; // Link URL
  name: string; // Name of the person
}

interface PersonCardsProps {
  personCards: PersonCardItem[];
  title: string; // Title of the section
}

const PersonCards: React.FC<PersonCardsProps> = ({ personCards, title }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const imagePromises = personCards.map((card) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = card.image;
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    Promise.all(imagePromises).then(() => setLoading(false));
  }, [personCards]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-nus-blue-600 sm:text-3xl">
          {title}
        </h2>
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-nus-orange-500" />
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-nus-blue-100 border-t-nus-orange-500"
            role="status"
            aria-label="Loading profiles"
          />
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {personCards.map((card, index) => (
            <Link key={index} href={card.link} className="group block">
              <div className="overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.name}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-nus-blue-900 transition-colors group-hover:text-nus-orange-700 sm:text-base">
                {card.name}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default PersonCards;
