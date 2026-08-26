"use client";

import React from "react";
import StarRating from "./StarRating";
import type { ModuleReview } from "../../src/lib/moduleReviews";

const SCALE_LABELS: Record<number, string> = {
  1: "Very light",
  2: "Light",
  3: "Moderate",
  4: "Heavy",
  5: "Very heavy",
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Very easy",
  2: "Easy",
  3: "Moderate",
  4: "Hard",
  5: "Very hard",
};

const Meter: React.FC<{ label: string; value: number; caption: string }> = ({
  label,
  value,
  caption,
}) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <div className="mt-1 flex items-center gap-2">
      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-nus-blue-50">
        <span
          className="block h-full rounded-full bg-nus-blue-500"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </span>
      <span className="text-xs text-slate-600">{caption}</span>
    </div>
  </div>
);

const ReviewCard: React.FC<{ review: ModuleReview }> = ({ review }) => {
  const author = review.author ?? "Anonymous D&E-Scholar";

  return (
    <article
      className={`rounded-xl border p-5 ${
        review.pending
          ? "border-dashed border-nus-orange-400 bg-nus-orange-50/50"
          : "border-[--border] bg-white"
      }`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-nus-blue-700">{author}</p>
          <p className="text-xs text-slate-500">
            {review.batch} batch, took it in {review.semester}
          </p>
        </div>
        <div className="text-right">
          <StarRating value={review.rating} label="Overall rating" />
          <p className="mt-0.5 text-xs text-slate-500">
            {review.rating.toFixed(0)} out of 5
          </p>
        </div>
      </header>

      {review.pending && (
        <p className="mt-3 rounded-lg bg-nus-orange-100 px-3 py-2 text-xs font-semibold text-nus-orange-800">
          Saved on this device only. Send it to the committee to get it
          published.
        </p>
      )}

      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
        {review.body}
      </p>

      <div className="mt-4 flex flex-wrap gap-6 border-t border-[--border] pt-4">
        <Meter
          label="Workload"
          value={review.workload}
          caption={SCALE_LABELS[review.workload] ?? ""}
        />
        <Meter
          label="Difficulty"
          value={review.difficulty}
          caption={DIFFICULTY_LABELS[review.difficulty] ?? ""}
        />
      </div>
    </article>
  );
};

export default ReviewCard;
