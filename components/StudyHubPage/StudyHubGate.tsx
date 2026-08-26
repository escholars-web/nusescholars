"use client";

import React from "react";
import { useNusAuth } from "../../src/lib/nusAuth";
import { STUDY_HUB_SIGNUP_URL } from "../../src/lib/siteLinks";

/**
 * What everyone sees before signing in: one card, the synopsis, two ways in.
 *
 * The volunteer link sits outside the lock on purpose. A senior deciding
 * whether to help should never have to authenticate to find out what they are
 * volunteering for.
 */
const StudyHubGate: React.FC = () => {
  const { status, signIn } = useNusAuth();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-16 sm:px-6">
      <section className="rise w-full rounded-[2rem] border-2 border-nus-orange-200 bg-nus-orange-50 px-7 py-12 shadow-[0_24px_60px_-32px_rgba(172,89,0,0.55)] sm:px-14 sm:py-16">
        <h2 className="max-w-[16ch] text-[2.4rem] font-bold leading-[1.05] tracking-[-0.03em] text-nus-blue-700 sm:text-[3.25rem]">
          Someone here has already been stuck on exactly this.
        </h2>

        <p className="mt-6 max-w-[52ch] text-lg leading-8 text-nus-blue-800">
          Ask a senior who took the course. Read notes from people who sat the
          same paper. Find out what the semester was really like.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={signIn}
            className="inline-flex items-center gap-3 rounded-xl bg-nus-orange-700 px-7 py-4 text-base font-bold text-white shadow-[0_12px_28px_-14px_rgba(172,89,0,0.9)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-nus-orange-800"
          >
            <svg className="h-4 w-4" viewBox="0 0 23 23" aria-hidden>
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            Sign in with NUS
          </button>

          <a
            href={STUDY_HUB_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-bold text-nus-orange-800 underline decoration-nus-orange-300 decoration-2 underline-offset-[6px] transition-colors hover:text-nus-blue-700 hover:decoration-nus-blue-400"
          >
            Or volunteer to help juniors
          </a>
        </div>

        {status === "rejected-domain" && (
          <p className="mt-8 max-w-[52ch] border-t-2 border-nus-orange-200 pt-5 text-base leading-7 text-nus-orange-900">
            That is not an NUS account. Try your @u.nus.edu address.
          </p>
        )}
        {status === "unconfigured" && (
          <p className="mt-8 max-w-[52ch] border-t-2 border-nus-orange-200 pt-5 text-base leading-7 text-nus-orange-900">
            Sign in is being set up right now. Check back very soon.
          </p>
        )}
      </section>
    </div>
  );
};

export default StudyHubGate;
