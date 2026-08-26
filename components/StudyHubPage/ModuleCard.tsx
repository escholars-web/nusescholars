"use client";

import React, { useState, useSyncExternalStore } from "react";
import StarRating from "./StarRating";
import ReviewCard from "./ReviewCard";
import SubmitReviewForm from "./SubmitReviewForm";
import { useNusAuth } from "../../src/lib/nusAuth";
import {
  getModuleStats,
  pendingStore,
  NO_PENDING_REVIEWS,
  type ModuleEntry,
  type ModuleNote,
} from "../../src/lib/moduleReviews";

const NOTE_KIND_LABELS: Record<ModuleNote["kind"], string> = {
  notes: "Notes",
  cheatsheet: "Cheatsheet",
  "past-papers": "Past papers",
  template: "Template",
  other: "Resource",
};

const StatPill: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="rounded-lg bg-nus-blue-50 px-3 py-2 text-center">
    <p className="text-xs font-semibold uppercase tracking-wide text-nus-blue-600">
      {label}
    </p>
    <p className="text-sm font-bold text-nus-blue-800">{value}</p>
  </div>
);

/**
 * One note or resource. A note with no URL is one the committee has lined up
 * but nobody has shared the file for yet, so it reads as a placeholder rather
 * than sending anyone to a dead link.
 */
const NoteRow: React.FC<{ note: ModuleNote }> = ({ note }) => {
  const label = (
    <>
      <span className="rounded-full bg-nus-orange-100 px-2.5 py-0.5 text-xs font-bold text-nus-orange-800">
        {NOTE_KIND_LABELS[note.kind]}
      </span>
      <span className="font-semibold text-nus-blue-700">{note.title}</span>
    </>
  );

  if (note.url === "") {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-[--border] bg-white px-4 py-3 text-sm opacity-70">
        {label}
        <span className="text-xs italic text-slate-500">
          nobody has shared this one yet
        </span>
      </div>
    );
  }

  return (
    <a
      href={note.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-wrap items-center gap-2 rounded-lg border border-[--border] bg-white px-4 py-3 text-sm transition-colors hover:border-nus-orange-400"
    >
      {label}
      <span className="text-xs text-slate-500">
        shared by {note.contributor}
      </span>
    </a>
  );
};

const ModuleCard: React.FC<{ entry: ModuleEntry }> = ({ entry }) => {
  const { status } = useNusAuth();
  const [open, setOpen] = useState(false);

  // Pending reviews live in localStorage, so they only exist once the browser
  // takes over. Subscribing keeps this in sync when a review is submitted.
  const pendingByModule = useSyncExternalStore(
    pendingStore.subscribe,
    pendingStore.getSnapshot,
    pendingStore.getServerSnapshot,
  );
  const pending = pendingByModule[entry.code] ?? NO_PENDING_REVIEWS;

  const stats = getModuleStats(entry);
  const allReviews = [...entry.reviews, ...pending];
  const hasReviews = allReviews.length > 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-[--border] bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-nus-blue-50/50"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-lg font-bold text-nus-blue-700">
              {entry.code}
            </h3>
            <span className="text-sm text-slate-600">{entry.title}</span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {entry.department}, {entry.units} units
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            {stats.reviewCount > 0 ? (
              <>
                <StarRating
                  value={stats.averageRating}
                  label={`Average rating for ${entry.code}`}
                />
                <p className="mt-0.5 text-xs text-slate-500">
                  {stats.averageRating.toFixed(1)} from {stats.reviewCount}{" "}
                  {stats.reviewCount === 1 ? "review" : "reviews"}
                </p>
              </>
            ) : (
              <p className="text-xs italic text-slate-400">No reviews yet</p>
            )}
          </div>
          <svg
            className={`h-5 w-5 shrink-0 text-nus-blue-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-[--border] bg-[--background] px-5 py-6">
          {stats.reviewCount > 0 && (
            <div className="mb-6 grid grid-cols-3 gap-3 sm:max-w-md">
              <StatPill
                label="Rating"
                value={`${stats.averageRating.toFixed(1)} / 5`}
              />
              <StatPill
                label="Workload"
                value={`${stats.averageWorkload.toFixed(1)} / 5`}
              />
              <StatPill
                label="Difficulty"
                value={`${stats.averageDifficulty.toFixed(1)} / 5`}
              />
            </div>
          )}

          {/* Notes */}
          <section className="mb-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-nus-orange-700">
              Notes and resources
            </h4>
            {entry.notes.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {entry.notes.map((note) => (
                  <li key={note.title}>
                    <NoteRow note={note} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm italic text-slate-500">
                Nobody has shared notes for this course yet.
              </p>
            )}
          </section>

          {/* Reviews */}
          <section>
            <h4 className="text-sm font-bold uppercase tracking-widest text-nus-orange-700">
              Reviews
            </h4>
            {hasReviews ? (
              <div className="mt-3 space-y-4">
                {allReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm italic text-slate-500">
                Be the first to review this course.
              </p>
            )}
          </section>

          {status === "signed-in" && (
            <div className="mt-6">
              {/* Submitting invalidates pendingStore, so the list above
                  refreshes on its own. No callback needed. */}
              <SubmitReviewForm moduleCode={entry.code} />
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default ModuleCard;
