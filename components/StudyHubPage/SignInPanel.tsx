"use client";

import React, { useCallback } from "react";
import { NUS_EMAIL_DOMAINS, useNusAuth } from "../../src/lib/nusAuth";

/**
 * Renders whatever the current auth state calls for: the Google button, a
 * rejection notice for non NUS accounts, or the signed in summary.
 */
const SignInPanel: React.FC = () => {
  const { status, user, rejectedEmail, signOut, renderSignInButton } =
    useNusAuth();

  const buttonRef = useCallback(
    (el: HTMLDivElement | null) => renderSignInButton(el),
    [renderSignInButton],
  );

  const domains = NUS_EMAIL_DOMAINS.map((d) => "@" + d).join(" or ");

  if (status === "unconfigured") {
    return (
      <div className="rounded-xl border border-dashed border-nus-blue-300 bg-white p-5">
        <h3 className="text-sm font-bold text-nus-blue-700">
          Sign in is not configured yet
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Reviews are readable by everyone, but writing one needs a Google sign
          in restricted to NUS accounts. To switch it on, create an OAuth client
          ID in Google Cloud Console, authorise this site as a JavaScript
          origin, and set NEXT_PUBLIC_GOOGLE_CLIENT_ID in the environment.
        </p>
      </div>
    );
  }

  if (status === "signed-in" && user) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[--border] bg-white p-5">
        <div className="flex items-center gap-3">
          {user.picture ? (
            // Plain img keeps this working under `output: export`, where the
            // Next image optimiser is disabled anyway.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.picture}
              alt=""
              className="h-10 w-10 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-nus-blue-100 text-sm font-bold text-nus-blue-700">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
          )}
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
      <h3 className="text-sm font-bold text-nus-blue-700">
        Sign in to write a review
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Anyone can read reviews. Writing one needs an NUS Google account, so use
        your {domains} address.
      </p>

      {status === "rejected-domain" && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {rejectedEmail} is not an NUS account. Sign in with your {domains}{" "}
          address instead.
        </p>
      )}

      <div ref={buttonRef} className="mt-4" />
    </div>
  );
};

export default SignInPanel;
