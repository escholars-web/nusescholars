"use client";

import React, { useMemo, useState } from "react";
import PageTemplate from "../PageTemplate";
import HeroSection from "../HeroSection";
import ModuleCard from "./ModuleCard";
import SignInPanel from "./SignInPanel";
import ComingSoon from "./ComingSoon";
import SeniorTeachJunior from "./SeniorTeachJunior";
import { NusAuthProvider } from "../../src/lib/nusAuth";
import {
  getDepartments,
  getModules,
  matchesQuery,
  sortModules,
  type SortKey,
} from "../../src/lib/moduleReviews";

/**
 * Flip this to false to launch the Study Hub.
 *
 * While true the page renders the In Progress placeholder instead of the real
 * sections. Everything underneath is already built and typechecked, so going
 * live is this one line plus real content in src/data/module-reviews.json and
 * src/data/senior-mentors.json. Before flipping it, also replace the
 * placeholder form URLs in senior-mentors.json and set
 * NEXT_PUBLIC_GOOGLE_CLIENT_ID so sign in works.
 */
const IN_PROGRESS = true;

const HERO_TITLE = "Study Hub";
const HERO_DESCRIPTION =
  "Module reviews, shared notes, and seniors who will teach you the thing you are stuck on. Built by DE-Scholars, for DE-Scholars.";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "code", label: "Module code" },
  { key: "rating", label: "Highest rated" },
  { key: "reviews", label: "Most reviewed" },
  { key: "easiest", label: "Least difficult" },
];

const controlClass =
  "rounded-lg border border-[--border] bg-white px-3 py-2 text-sm text-slate-700 focus:border-nus-blue-500 focus:outline-none focus:ring-1 focus:ring-nus-blue-500";

type Tab = "modules" | "mentors";

const TABS: { key: Tab; label: string }[] = [
  { key: "modules", label: "Reviews and notes" },
  { key: "mentors", label: "Senior Teach Junior" },
];

const ModulesTab: React.FC = () => {
  const modules = useMemo(() => getModules(), []);
  const departments = useMemo(() => getDepartments(modules), [modules]);

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

  return (
    <>
      <div className="mb-8">
        <SignInPanel />
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="module-search"
            className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Search
          </label>
          <input
            id="module-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Module code, title, or department"
            className={`mt-1 w-full ${controlClass}`}
          />
        </div>

        <div>
          <label
            htmlFor="module-department"
            className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Department
          </label>
          <select
            id="module-department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className={`mt-1 ${controlClass}`}
          >
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="module-sort"
            className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Sort by
          </label>
          <select
            id="module-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className={`mt-1 ${controlClass}`}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-500">
        Showing {visible.length} of {modules.length} modules
      </p>

      {visible.length > 0 ? (
        <div className="space-y-4">
          {visible.map((entry) => (
            <ModuleCard key={entry.code} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[--border] bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            No modules match that search. Try a different code or clear the
            department filter.
          </p>
        </div>
      )}

      <p className="mt-10 text-center text-xs text-slate-500">
        Reviews are opinions of individual students, not official CDE or NUS
        guidance. Check the official module listing for the syllabus and
        prerequisites before planning your semester.
      </p>
    </>
  );
};

const StudyHubBody: React.FC = () => {
  const [tab, setTab] = useState<Tab>("modules");

  return (
    <PageTemplate>
      <HeroSection title={HERO_TITLE} description={HERO_DESCRIPTION} />

      {IN_PROGRESS ? (
        <ComingSoon />
      ) : (
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div
            className="mb-8 flex gap-2 border-b border-[--border]"
            role="tablist"
            aria-label="Study Hub sections"
          >
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-bold transition-colors ${
                  tab === t.key
                    ? "border-nus-orange-500 text-nus-orange-700"
                    : "border-transparent text-slate-500 hover:text-nus-blue-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "modules" ? <ModulesTab /> : <SeniorTeachJunior />}
        </div>
      )}
    </PageTemplate>
  );
};

const StudyHubPage: React.FC = () => (
  <NusAuthProvider>
    <StudyHubBody />
  </NusAuthProvider>
);

export default StudyHubPage;
