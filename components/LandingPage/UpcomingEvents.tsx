import React from "react";
import Link from "next/link";
import EventCalendar from "../EventsPage/EventCalendar";
import { buildCalendarMonths, getUpcomingEvents } from "../../src/lib/events";

/** How many events the home page shows before sending people to /events. */
const MAX_ON_HOME = 3;

/**
 * The next few scheduled events, on the home page.
 *
 * Renders nothing at all when the calendar is empty, which it will be for
 * stretches over the vacation. A section that says "no events" is worse than no
 * section, and the Past Events carousel above already carries a link to the
 * events page for anyone looking.
 */
const UpcomingEvents: React.FC = () => {
  /* Build time, same as the events page. See src/lib/events.ts. */
  const upcoming = getUpcomingEvents(new Date()).slice(0, MAX_ON_HOME);
  if (upcoming.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[--border] bg-nus-blue-50/40 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-nus-blue-600 sm:text-4xl">
            Coming Up
          </h2>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-nus-orange-500" />
          <p className="mt-4 text-base text-slate-600">
            What is on the calendar next. Everything is open to every scholar.
          </p>
        </div>

        <div className="mt-10">
          <EventCalendar
            events={upcoming}
            months={buildCalendarMonths(upcoming, 2)}
          />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-lg border border-[--border] bg-white px-5 py-2.5 text-sm font-bold text-nus-blue-600 transition-colors hover:border-nus-orange-400 hover:text-nus-orange-700"
          >
            See the full calendar
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
