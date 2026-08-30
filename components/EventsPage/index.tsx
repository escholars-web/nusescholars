import React from "react";
import PageTemplate from "../PageTemplate";
import HeroSection from "../HeroSection";
import EventCalendar from "./EventCalendar";
import { INSTAGRAM_URL } from "../../src/lib/siteLinks";
import { buildCalendarMonths, getUpcomingEvents } from "../../src/lib/events";

interface EventKind {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const iconClass = "h-6 w-6";

/**
 * What the committee actually runs over a year. This is the part of the page
 * that stays true whether or not anything is currently scheduled, which is why
 * it sits above the calendar rather than below it.
 */
const EVENT_KINDS: EventKind[] = [
  {
    title: "Orientation",
    description:
      "Two days of games, food and far too much sun to start the year, run by the batch above for the batch coming in. It is where most people meet the friends they keep.",
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
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
  },
  {
    title: "Town halls",
    description:
      "The whole programme in one room a few times a year, with food. Committee updates, questions you would rather ask a person than an email, and a chance to say what you want changed.",
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
          d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253 1.172.613 2.303 1.068 3.383.152.36-.03.775-.399.904l-.9.316a1.125 1.125 0 01-1.421-.588l-1.34-3.01m4.992-1.005c1.787.19 3.516.618 5.146 1.256v-12.5c-1.63.638-3.359 1.066-5.146 1.256m0 9.988a5.25 5.25 0 010-9.988M19.5 12a3 3 0 01-1.5 2.598v-5.196A3 3 0 0119.5 12z"
        />
      </svg>
    ),
  },
  {
    title: "Bonding events",
    description:
      "Batch dinners, games nights, sports, and the occasional trip out. Low commitment, no sign up speech required, mostly an excuse to stop looking at a screen for an evening.",
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
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
  },
  {
    title: "Welfare",
    description:
      "Snacks and small kindnesses during recess week, reading week and exams, when the semester stops being fun. Usually turns up outside a study room without warning.",
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
          d="M12 21a8.966 8.966 0 01-5.982-2.275A3 3 0 016 16.5V15a3 3 0 013-3h6a3 3 0 013 3v1.5a3 3 0 01-.018.225A8.966 8.966 0 0112 21zm0 0a9 9 0 100-18 9 9 0 000 18zM9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75z"
        />
      </svg>
    ),
  },
  {
    title: "Company and lab visits",
    description:
      "Trips out to see the work being done at places like Boeing, and to labs across the college. The clearest look you get at what your degree turns into afterwards.",
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
          d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
        />
      </svg>
    ),
  },
  {
    title: "Sharings",
    description:
      "Seniors back from exchange, NOC or an internship, telling you what it was actually like and which forms to start on now rather than in March.",
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
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    ),
  },
];

const EventsPage: React.FC = () => {
  /* Build time, like the year numbers on the profile pages. See src/lib/events.ts. */
  const upcoming = getUpcomingEvents(new Date());
  const months = buildCalendarMonths(upcoming);

  return (
    <PageTemplate>
      <HeroSection
        title="Events"
        description="What the D&E-Scholars Student Committee runs over a year, and what is coming up next."
      />

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="h-1 w-12 rounded-full bg-nus-orange-500" />
        <h2 className="mt-4 text-2xl font-bold text-nus-blue-600 sm:text-3xl">
          What we get up to
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Nothing here is compulsory and nothing costs you anything. Come to
          whichever ones sound good, that is genuinely how most people use them.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT_KINDS.map((kind) => (
            <div
              key={kind.title}
              className="rounded-2xl border border-[--border] bg-white p-6 shadow-sm"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-nus-blue-50 text-nus-blue-600">
                {kind.icon}
              </span>
              <h3 className="mt-4 font-bold text-nus-blue-700">{kind.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {kind.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[--border] bg-nus-blue-50/40">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="h-1 w-12 rounded-full bg-nus-orange-500" />
          <h2 className="mt-4 text-2xl font-bold text-nus-blue-600 sm:text-3xl">
            Coming up
          </h2>

          {upcoming.length > 0 ? (
            <div className="mt-10">
              <EventCalendar events={upcoming} months={months} />
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[--border] bg-white p-10 text-center">
              <p className="text-base leading-7 text-slate-600">
                Nothing on the calendar at the moment. Things usually go up a
                couple of weeks ahead, and they always go up on Instagram first.
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-nus-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-nus-orange-600"
              >
                Follow @nusdescholars
              </a>
            </div>
          )}
        </div>
      </section>
    </PageTemplate>
  );
};

export default EventsPage;
