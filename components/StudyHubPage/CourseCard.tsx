"use client";

import React from "react";
import Link from "next/link";
import { getModuleStats, type ModuleEntry } from "../../src/lib/moduleReviews";

/**
 * One course in the grid. Deliberately thin: enough to pick a course out of a
 * list, and everything else lives on the course's own page.
 */
const CourseCard: React.FC<{ entry: ModuleEntry }> = ({ entry }) => {
  const stats = getModuleStats(entry);
  const sharedNotes = entry.notes.filter((n) => n.url !== "").length;

  return (
    <Link
      href={`/study-hub/${entry.code.toLowerCase()}`}
      className="group flex h-full flex-col rounded-2xl border-2 border-nus-orange-100 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-nus-orange-400 hover:shadow-[0_18px_40px_-24px_rgba(172,89,0,0.6)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xl font-bold tracking-[-0.02em] text-nus-blue-700">
          {entry.code}
        </p>
        {stats.reviewCount > 0 && (
          <span className="tabular shrink-0 rounded-lg bg-nus-orange-100 px-2.5 py-1 text-sm font-bold text-nus-orange-800">
            {stats.averageRating.toFixed(1)}
          </span>
        )}
      </div>

      <p className="mt-2 text-base font-semibold leading-6 text-nus-blue-800 transition-colors group-hover:text-nus-orange-700">
        {entry.title}
      </p>

      <p className="tabular mt-auto pt-5 text-sm font-semibold text-slate-500">
        {stats.reviewCount} {stats.reviewCount === 1 ? "review" : "reviews"} ·{" "}
        {sharedNotes} {sharedNotes === 1 ? "note" : "notes"}
      </p>
    </Link>
  );
};

export default CourseCard;
