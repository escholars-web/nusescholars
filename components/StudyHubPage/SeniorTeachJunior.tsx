"use client";

import React, { useMemo, useState } from "react";
import {
  getCoveredModules,
  getMentors,
  getProgrammeLinks,
  isPlaceholderUrl,
  isSampleRoster,
  mentorsForModule,
  type SeniorMentor,
} from "../../src/lib/seniorMentors";

/**
 * A sign up call to action. Renders as a disabled note rather than a link while
 * the form URL is still a placeholder, so nothing on the live page leads to a
 * dead form.
 */
const SignUpAction: React.FC<{
  url: string;
  label: string;
  primary?: boolean;
}> = ({ url, label, primary = false }) => {
  const style = primary
    ? "bg-nus-orange-500 text-white hover:bg-nus-orange-600"
    : "border border-white/40 text-white hover:border-nus-orange-300 hover:text-nus-orange-200";

  if (isPlaceholderUrl(url)) {
    return (
      <span className="cursor-not-allowed rounded-lg border border-white/30 px-5 py-2.5 text-sm font-bold text-white/60">
        {label} (form coming soon)
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-lg px-5 py-2.5 text-sm font-bold transition-colors ${style}`}
    >
      {label}
    </a>
  );
};

const MentorCard: React.FC<{ mentor: SeniorMentor }> = ({ mentor }) => (
  <article
    className={`rounded-2xl border p-5 ${
      mentor.available
        ? "border-[--border] bg-white"
        : "border-[--border] bg-slate-50 opacity-70"
    }`}
  >
    <header className="flex flex-wrap items-start justify-between gap-2">
      <div>
        <h4 className="font-bold text-nus-blue-700">{mentor.name}</h4>
        <p className="text-xs text-slate-500">
          {mentor.major}, {mentor.batch} batch
        </p>
      </div>
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
          mentor.available
            ? "bg-green-100 text-green-800"
            : "bg-slate-200 text-slate-600"
        }`}
      >
        {mentor.available ? "Taking juniors" : "Full for now"}
      </span>
    </header>

    <p className="mt-3 text-sm leading-6 text-slate-700">{mentor.blurb}</p>

    <div className="mt-4 flex flex-wrap gap-1.5">
      {mentor.modules.map((code) => (
        <span
          key={code}
          className="rounded-full bg-nus-blue-50 px-2.5 py-1 text-xs font-bold text-nus-blue-700"
        >
          {code}
        </span>
      ))}
    </div>

    <p className="mt-3 text-xs text-slate-500">{mentor.format}</p>
  </article>
);

const SeniorTeachJunior: React.FC = () => {
  const mentors = useMemo(() => getMentors(), []);
  const links = useMemo(() => getProgrammeLinks(), []);
  const covered = useMemo(() => getCoveredModules(mentors), [mentors]);
  const [moduleFilter, setModuleFilter] = useState("all");

  const visible = mentorsForModule(mentors, moduleFilter);

  return (
    <div>
      <div className="rounded-2xl bg-gradient-to-br from-nus-blue-700 to-nus-blue-600 p-6 text-white sm:p-8">
        <h3 className="text-xl font-bold">Senior Teach Junior</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-nus-blue-100">
          Struggling with a course is normal, and a senior who cleared it last
          year is often the fastest way out of a hole. Tell us what you need
          help with and we will match you with a D&E-Scholar who has taken it.
          Free, run by students, no judgement.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <SignUpAction
            url={links.signUpUrl}
            label="I need help with a course"
            primary
          />
          <SignUpAction
            url={links.mentorSignUpUrl}
            label="I want to teach juniors"
          />
        </div>
      </div>

      {isSampleRoster() && (
        <div className="mt-6 rounded-xl border border-nus-blue-200 bg-nus-blue-50 p-5">
          <h4 className="text-sm font-bold text-nus-blue-700">
            These seniors are examples
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Nobody has signed up to teach yet, so the cards below show what an
            entry looks like rather than real people you can be matched with.
            Register your interest anyway and the committee will work on it.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-nus-orange-700">
            Seniors currently volunteering
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            {visible.length} {visible.length === 1 ? "senior" : "seniors"}{" "}
            {moduleFilter === "all" ? "on the roster" : `for ${moduleFilter}`}
          </p>
        </div>
        <div>
          <label
            htmlFor="mentor-module"
            className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Filter by course
          </label>
          <select
            id="mentor-module"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="mt-1 rounded-lg border border-[--border] bg-white px-3 py-2 text-sm text-slate-700 focus:border-nus-blue-500 focus:outline-none focus:ring-1 focus:ring-nus-blue-500"
          >
            <option value="all">All courses</option>
            {covered.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {visible.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-[--border] bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            No senior has signed up for {moduleFilter} yet. Register your
            interest anyway and the committee will try to find someone.
          </p>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-slate-500">
        Questions about the programme? Email{" "}
        <a
          href={`mailto:${links.coordinatorEmail}`}
          className="font-semibold text-nus-blue-600 underline-offset-4 hover:underline"
        >
          {links.coordinatorEmail}
        </a>
      </p>
    </div>
  );
};

export default SeniorTeachJunior;
