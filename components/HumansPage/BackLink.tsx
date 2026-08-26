import React from "react";
import Link from "next/link";

interface BackLinkProps {
  href: string;
  label: string;
}

/**
 * The way back up one level of Humans of D&E-Scholars. Profiles are usually
 * reached from a shared link rather than by clicking down from the batch page,
 * so browser back is not always somewhere useful.
 *
 * Renders the link only. Callers place it in their own container so it lines up
 * with whatever content sits below it.
 */
const BackLink: React.FC<BackLinkProps> = ({ href, label }) => (
  <Link
    href={href}
    className="inline-flex items-center gap-2 rounded-lg border border-[--border] bg-white px-4 py-2 text-sm font-semibold text-nus-blue-600 transition-colors hover:border-nus-orange-400 hover:text-nus-orange-700"
  >
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
        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
      />
    </svg>
    {label}
  </Link>
);

export default BackLink;
