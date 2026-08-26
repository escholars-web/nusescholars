import React from "react";
import Link from "next/link";
import { BUG_REPORT_URL, INSTAGRAM_URL } from "../src/lib/siteLinks";

const navLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Humans of D&E-Scholars", href: "/humans-of-descholars" },
  { label: "Study Hub", href: "/study-hub" },
  { label: "Events", href: "/events" },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-nus-blue-800 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {/* Column 1: Brand and navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight hover:text-nus-orange-300"
          >
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded-full bg-nus-orange-500"
            />
            NUS D&E-SCHOLARS
          </Link>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-nus-blue-100 transition-colors hover:text-nus-orange-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Social */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-nus-orange-300">
            Connect with Us
          </h3>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2.5 text-sm text-nus-blue-100 transition-colors hover:text-nus-orange-300"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            @nusdescholars
          </a>
        </div>

        {/* Column 3: Support */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-nus-orange-300">
            Having an Issue?
          </h3>
          <a
            href={BUG_REPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2.5 text-sm text-nus-blue-100 transition-colors hover:text-nus-orange-300"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m7.215 2.749c.421-.292.81-.628 1.155-1.002a4.485 4.485 0 00-.574-1.747"
              />
            </svg>
            Bug Reporting Form
          </a>
        </div>
      </div>

      {/* Bottom bar with archive link */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
          <div className="text-center sm:text-left">
            <p className="text-xs text-nus-blue-100">
              © {new Date().getFullYear()} NUS D&E-Scholars Student Committee.
              Made with love.
            </p>
            <p className="mt-1 text-xs text-nus-blue-200/70">
              Coded by Jordan Low Jun Yi
            </p>
          </div>
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-nus-orange-400 hover:text-nus-orange-300"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
            View Archived Site
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
