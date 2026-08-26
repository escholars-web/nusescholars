"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageTemplate from "../PageTemplate";
import Forum from "./Forum";
import NotesPanel from "./NotesPanel";
import ReviewCard from "./ReviewCard";
import SubmitReviewForm from "./SubmitReviewForm";
import StudyHubGate from "./StudyHubGate";
import { NusAuthProvider, useNusAuth } from "../../src/lib/nusAuth";
import {
  getModule,
  getModuleStats,
  isSampleData,
} from "../../src/lib/moduleReviews";

type Section = "forum" | "notes" | "reviews";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "forum", label: "Ask a senior" },
  { key: "notes", label: "Notes" },
  { key: "reviews", label: "Reviews" },
];

const BackArrow: React.FC = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const CourseBody: React.FC<{ code: string }> = ({ code }) => {
  const { status } = useNusAuth();
  const [section, setSection] = useState<Section>("forum");

  const entry = getModule(code);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <p className="text-sm text-slate-500">Checking your sign in...</p>
      </div>
    );
  }

  if (status !== "signed-in") {
    return <StudyHubGate />;
  }

  if (entry === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-nus-blue-700">
          No page for {code.toUpperCase()} yet.
        </h1>
        <Link
          href="/study-hub"
          className="mt-6 inline-flex items-center gap-2 text-base font-bold text-nus-orange-700 transition-colors hover:text-nus-blue-700"
        >
          <BackArrow />
          All courses
        </Link>
      </div>
    );
  }

  const stats = getModuleStats(entry);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/study-hub"
        className="inline-flex items-center gap-2 text-sm font-bold text-nus-orange-700 transition-colors hover:text-nus-blue-700"
      >
        <BackArrow />
        All courses
      </Link>

      <section className="rise mt-5 rounded-[2rem] border-2 border-nus-orange-200 bg-nus-orange-50 px-7 py-10 sm:px-12">
        <h1 className="text-[2.4rem] font-bold leading-none tracking-[-0.03em] text-nus-blue-700 sm:text-5xl">
          {entry.code}
        </h1>
        <p className="mt-3 max-w-[36ch] text-xl font-semibold leading-snug text-nus-blue-800 sm:text-2xl">
          {entry.title}
        </p>
        <p className="tabular mt-5 text-sm font-semibold text-nus-orange-800">
          {entry.department} · {entry.units} units ·{" "}
          {stats.reviewCount > 0
            ? `${stats.averageRating.toFixed(1)} out of 5`
            : "not reviewed yet"}
        </p>
      </section>

      {isSampleData() && (
        <p className="mt-4 text-sm font-semibold text-nus-orange-800">
          Placeholder content for now, not real reviews.
        </p>
      )}

      <div
        className="mt-10 flex gap-1 border-b-2 border-nus-orange-100"
        role="tablist"
        aria-label={`${entry.code} sections`}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={section === s.key}
            onClick={() => setSection(s.key)}
            className={`-mb-0.5 border-b-[3px] px-5 py-3 text-base font-bold transition-colors ${
              section === s.key
                ? "border-nus-orange-500 text-nus-orange-800"
                : "border-transparent text-slate-500 hover:text-nus-blue-700"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {section === "forum" && <Forum courseCode={entry.code} />}
        {section === "notes" && (
          <NotesPanel notes={entry.notes} courseCode={entry.code} />
        )}
        {section === "reviews" && (
          <div className="space-y-4">
            {entry.reviews.length > 0 ? (
              entry.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <p className="py-12 text-center text-xl font-bold text-nus-blue-700">
                No reviews yet. Yours would be the first.
              </p>
            )}
            <SubmitReviewForm moduleCode={entry.code} />
          </div>
        )}
      </div>
    </div>
  );
};

const CourseDetail: React.FC<{ code: string }> = ({ code }) => (
  <NusAuthProvider>
    <PageTemplate>
      <CourseBody code={code} />
    </PageTemplate>
  </NusAuthProvider>
);

export default CourseDetail;
