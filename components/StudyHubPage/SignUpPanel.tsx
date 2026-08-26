"use client";

import React from "react";
import { useNusAuth } from "../../src/lib/nusAuth";
import { STUDY_HUB_SIGNUP_URL } from "../../src/lib/siteLinks";

/**
 * Step one of getting into the Study Hub: the sign up form.
 *
 * Deliberately sits above the sign in panel. Signing in only proves someone has
 * an NUS account, the form is where the committee finds out who is actually
 * using the hub and what they want out of it. Once a person is signed in this
 * disappears, because by then they are past it.
 */
const SignUpPanel: React.FC = () => {
  const { status } = useNusAuth();

  if (status === "signed-in") {
    return null;
  }

  return (
    <div className="rounded-xl border border-nus-orange-200 bg-nus-orange-50/60 p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-nus-orange-700">
        Step 1
      </p>
      <h3 className="mt-1 text-base font-bold text-nus-blue-700">
        Sign up for the Study Hub
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Anyone can read what is here. Before you write a review or share notes,
        fill in the sign up form with your NUS email so the committee knows who
        is contributing, then sign in below with that same account.
      </p>
      <a
        href={STUDY_HUB_SIGNUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-nus-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-nus-orange-600"
      >
        Open the sign up form
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      </a>
    </div>
  );
};

export default SignUpPanel;
