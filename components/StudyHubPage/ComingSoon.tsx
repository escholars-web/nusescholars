"use client";

import React from "react";
import Link from "next/link";
import { getProgrammeLinks } from "../../src/lib/seniorMentors";

interface Pillar {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const iconClass = "h-6 w-6";

const PILLARS: Pillar[] = [
  {
    title: "Module reviews",
    description:
      "Honest write ups from DE-Scholars who actually sat the module, with ratings for workload and difficulty so you can plan a survivable semester.",
    icon: (
      <svg
        className={iconClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.5a.56.56 0 011.04 0l2.13 4.32 4.77.69a.56.56 0 01.31.96l-3.45 3.36.82 4.75a.56.56 0 01-.82.59L12 15.92l-4.27 2.25a.56.56 0 01-.81-.59l.81-4.75-3.45-3.36a.56.56 0 01.31-.96l4.77-.69L11.48 3.5z"
        />
      </svg>
    ),
  },
  {
    title: "Shared notes",
    description:
      "Cheatsheets, summary sheets, and past year walkthroughs, contributed by seniors and kept in one place instead of scattered across a dozen chat groups.",
    icon: (
      <svg
        className={iconClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
  {
    title: "Senior Teach Junior",
    description:
      "Stuck on a module? Get matched with a senior who cleared it last year and can walk you through it. Free, run by students, no judgement.",
    icon: (
      <svg
        className={iconClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      </svg>
    ),
  },
];

const ComingSoon: React.FC = () => {
  const links = getProgrammeLinks();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      {/* Status banner */}
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-nus-orange-100 px-4 py-1.5 text-sm font-bold text-nus-orange-800">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nus-orange-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-nus-orange-500" />
          </span>
          In progress
        </span>
        <h2 className="mt-5 text-balance text-2xl font-bold text-nus-blue-700 sm:text-3xl">
          We are still building this one
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          The Study Hub is where academic help for DE-Scholars will live. It is
          not open yet, but here is what is coming, and you can already put your
          hand up for the parts that need people.
        </p>
      </div>

      {/* The three pillars */}
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-2xl border border-[--border] bg-white p-6 shadow-sm"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-nus-blue-50 text-nus-blue-600">
              {pillar.icon}
            </span>
            <h3 className="mt-4 font-bold text-nus-blue-700">{pillar.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>

      {/* Early calls to action */}
      <div className="mt-12 rounded-2xl bg-gradient-to-br from-nus-blue-700 to-nus-blue-600 p-6 text-white sm:p-8">
        <h3 className="text-lg font-bold">Want to help it launch sooner?</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-nus-blue-100">
          The hub is only as good as what people put into it. Two things make
          the biggest difference right now: seniors volunteering to teach, and
          anyone willing to write up a module they have taken.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={links.mentorSignUpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-nus-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-nus-orange-600"
          >
            Volunteer to teach juniors
          </a>
          <a
            href={links.signUpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:border-nus-orange-300 hover:text-nus-orange-200"
          >
            Register for help with a module
          </a>
        </div>
      </div>

      <p className="mt-10 text-center text-sm">
        <Link
          href="/"
          className="font-semibold text-nus-blue-600 underline-offset-4 hover:underline"
        >
          Go back to home
        </Link>
      </p>
    </div>
  );
};

export default ComingSoon;
