"use client";

import React, { useMemo, useState } from "react";
import PageTemplate from "../PageTemplate";
import CourseCard from "./CourseCard";
import StudyHubGate from "./StudyHubGate";
import ComingSoon from "./ComingSoon";
import { NusAuthProvider, useNusAuth } from "../../src/lib/nusAuth";
import { STUDY_HUB_SIGNUP_URL } from "../../src/lib/siteLinks";
import { getMentors } from "../../src/lib/seniorMentors";
import {
  getDepartments,
  getModules,
  isSampleData,
  matchesQuery,
  sortModules,
  type SortKey,
} from "../../src/lib/moduleReviews";

/**
 * Flip this back to true to take the Study Hub down to the In Progress
 * placeholder, for instance if the content ever needs pulling.
 */
const IN_PROGRESS = false;

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "code", label: "Course code" },
  { key: "rating", label: "Highest rated" },
  { key: "reviews", label: "Most reviewed" },
  { key: "easiest", label: "Least difficult" },
];

const controlClass =
  "rounded-xl border-2 border-nus-orange-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-nus-blue-800 transition-colors hover:border-nus-orange-400";

/** First name only. A hub that greets you by full legal name is a form. */
function firstName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? name;
  return first.charAt(0).toUpperCase() + first.slice(1);
}

const HubBody: React.FC = () => {
  const { status, user, signOut } = useNusAuth();

  const modules = useMemo(() => getModules(), []);
  const departments = useMemo(() => getDepartments(modules), [modules]);
  const mentors = useMemo(() => getMentors(), []);

  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [sort, setSort] = useState<SortKey>("code");

  const visible = useMemo(() => {
    const filtered = modules.filter(
      (m) =>
        matchesQuery(m, query) &&
        (department === "all" || m.department === department),
    );
    return sortModules(filtered, sort);
  }, [modules, query, department, sort]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <p className="text-sm text-slate-500">Checking your sign in...</p>
      </div>
    );
  }

  // Everything past this point is members only. The volunteer sign up lives
  // inside the gate, outside the lock, on purpose.
  if (status !== "signed-in" || user === null) {
    return <StudyHubGate />;
  }

  const onCall = mentors.filter((m) => m.available).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section className="rounded-[2rem] border-2 border-nus-orange-200 bg-nus-orange-50 px-7 py-10 sm:px-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="min-w-0">
            <h1 className="rise text-[2.2rem] font-bold leading-[1.05] tracking-[-0.03em] text-nus-blue-700 sm:text-[3rem]">
              Welcome back, {firstName(user.name)}.
            </h1>
            <p className="mt-3 text-lg font-semibold text-nus-orange-800">
              {modules.length} courses, {onCall} seniors answering.
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="shrink-0 rounded-xl border-2 border-nus-orange-300 px-4 py-2 text-xs font-bold text-nus-orange-800 transition-colors hover:border-nus-orange-500 hover:text-nus-blue-700"
          >
            Sign out
          </button>
        </div>
      </section>

      {isSampleData() && (
        <p className="mt-4 text-sm font-semibold text-nus-orange-800">
          Placeholder content for now, not real reviews.
        </p>
      )}

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <input
          id="course-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a course"
          aria-label="Search a course"
          className={`min-w-0 flex-1 ${controlClass}`}
        />
        <select
          id="course-department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          aria-label="Filter by department"
          className={controlClass}
        >
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          id="course-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort courses"
          className={controlClass}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {visible.length > 0 ? (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((entry) => (
            <CourseCard key={entry.code} entry={entry} />
          ))}
        </div>
      ) : (
        <p className="mt-14 text-center text-xl font-bold text-nus-blue-700">
          Nothing matches that yet.
        </p>
      )}

      <section className="mt-20 flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-nus-blue-700 px-7 py-9 sm:px-12">
        <h2 className="max-w-[26ch] text-2xl font-bold leading-tight tracking-[-0.02em] text-white">
          Someone below you is stuck on what you already know.
        </h2>
        <a
          href={STUDY_HUB_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-xl bg-nus-orange-500 px-6 py-3.5 text-base font-bold text-nus-blue-900 transition-colors duration-200 hover:bg-nus-orange-400"
        >
          Volunteer
        </a>
      </section>

      <p className="mt-10 text-sm leading-7 text-slate-500">
        Reviews are student opinions, not official NUS guidance.
      </p>
    </div>
  );
};

const StudyHubPage: React.FC = () => (
  <NusAuthProvider>
    <PageTemplate>{IN_PROGRESS ? <ComingSoon /> : <HubBody />}</PageTemplate>
  </NusAuthProvider>
);

export default StudyHubPage;
