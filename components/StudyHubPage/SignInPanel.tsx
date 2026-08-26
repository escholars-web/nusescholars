"use client";

import React from "react";
import { NUS_EMAIL_DOMAINS, useNusAuth } from "../../src/lib/nusAuth";

/**
 * Step two of getting into the Study Hub. Renders whatever the current auth
 * state calls for: the sign in button, a rejection notice for non NUS accounts,
 * or the signed in summary.
 */
const SignInPanel: React.FC = () => {
  const { status, user, rejectedEmail, error, signIn, signOut } = useNusAuth();

  const domains = NUS_EMAIL_DOMAINS.map((d) => "@" + d).join(" or ");

  if (status === "loading") {
    return (
      <div className="rounded-xl border border-[--border] bg-white p-5">
        <p className="text-sm text-slate-500">Checking your sign in...</p>
      </div>
    );
  }

  /*
   * No Entra client ID in the environment, so sign in cannot run at all.
   * Visitors get a plain notice here rather than setup instructions, because
   * this renders on the live site. The checklist for switching it on is at the
   * top of src/lib/nusAuth.tsx, where the people who need it will look.
   */
  if (status === "unconfigured") {
    return (
      <div className="rounded-xl border border-dashed border-nus-blue-300 bg-white p-5">
        <h3 className="text-sm font-bold text-nus-blue-700">
          Sign in is not open yet
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Course reviews are readable by everyone. Writing a review and opening
          shared notes will need an NUS account, and we are still setting that
          up. Check back soon.
        </p>
      </div>
    );
  }

  if (status === "signed-in" && user) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[--border] bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-nus-blue-100 text-sm font-bold text-nus-blue-700">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-semibold text-nus-blue-700">
              {user.name}
            </p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="rounded-lg border border-[--border] px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-nus-orange-400 hover:text-nus-orange-700"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[--border] bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-nus-blue-600">
        Step 2
      </p>
      <h3 className="mt-1 text-base font-bold text-nus-blue-700">
        Sign in to write a review
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Anyone can read reviews. Writing one needs an NUS Microsoft account, so
        use your {domains} address.
      </p>

      {status === "rejected-domain" && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {rejectedEmail} is not an NUS account. Sign in with your {domains}{" "}
          address instead.
        </p>
      )}

      {status === "error" && error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={signIn}
        className="mt-4 inline-flex items-center gap-2.5 rounded-lg border border-[--border] bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-nus-blue-400 hover:text-nus-blue-700"
      >
        <svg className="h-4 w-4" viewBox="0 0 23 23" aria-hidden>
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
        Sign in with your NUS account
      </button>
    </div>
  );
};

export default SignInPanel;
