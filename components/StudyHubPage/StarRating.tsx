"use client";

import React from "react";

interface StarRatingProps {
  /** Current value, 1 to 5. Fractional values are fine in display mode. */
  value: number;
  /** Supplying this turns the control into an interactive input. */
  onChange?: (value: number) => void;
  label: string;
  size?: "sm" | "md";
}

const Star: React.FC<{ fill: number; size: "sm" | "md" }> = ({
  fill,
  size,
}) => {
  const dimension = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  // `fill` is 0 to 1. Clip the coloured star to that fraction so half marks read
  // correctly in the averages.
  const percent = Math.round(Math.max(0, Math.min(1, fill)) * 100);
  return (
    <span className={`relative inline-block ${dimension}`} aria-hidden>
      <svg
        viewBox="0 0 20 20"
        className={`absolute inset-0 ${dimension} text-nus-blue-100`}
        fill="currentColor"
      >
        <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78-4.21-4.1 5.82-.85L10 1.5z" />
      </svg>
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${percent}%` }}
      >
        <svg
          viewBox="0 0 20 20"
          className={`${dimension} text-nus-orange-500`}
          fill="currentColor"
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      </span>
    </span>
  );
};

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  label,
  size = "sm",
}) => {
  const stars = [1, 2, 3, 4, 5];

  if (!onChange) {
    return (
      <span
        className="inline-flex items-center gap-0.5"
        role="img"
        aria-label={`${label}: ${value.toFixed(1)} out of 5`}
      >
        {stars.map((star) => (
          <Star key={star} fill={value - star + 1} size={size} />
        ))}
      </span>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1"
      role="radiogroup"
      aria-label={label}
    >
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} out of 5`}
          onClick={() => onChange(star)}
          className="rounded-full p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-nus-orange-500"
        >
          <Star fill={value >= star ? 1 : 0} size="md" />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
