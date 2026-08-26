import React from "react";
import {
  WEEKDAY_LABELS,
  formatEventDate,
  type CalendarMonth,
  type CommitteeEvent,
} from "../../src/lib/events";

interface EventCalendarProps {
  events: CommitteeEvent[];
  months: CalendarMonth[];
}

/**
 * The upcoming events calendar: a month grid with the busy days marked, next to
 * the list of what those days actually are.
 *
 * The grid is decoration for the list rather than the other way round, which is
 * why the days are not clickable. On a phone the calendar is the part worth
 * losing, so it sits above the list and the list carries every detail on its
 * own.
 */
const EventCalendar: React.FC<EventCalendarProps> = ({ events, months }) => {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      {/* Month grids */}
      <div className="space-y-6">
        {months.map((month) => (
          <div
            key={month.key}
            className="rounded-2xl border border-[--border] bg-white p-5 shadow-sm"
          >
            <h3 className="text-center text-sm font-bold uppercase tracking-widest text-nus-blue-700">
              {month.label}
            </h3>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center">
              {WEEKDAY_LABELS.map((label) => (
                <span
                  key={label}
                  className="pb-1 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400"
                >
                  {label.slice(0, 1)}
                </span>
              ))}
              {month.weeks.flat().map((day) => {
                const hasEvent = day.eventIds.length > 0;
                return (
                  <span
                    key={day.date}
                    className={`flex aspect-square items-center justify-center rounded-lg text-sm ${
                      hasEvent
                        ? "bg-nus-orange-500 font-bold text-white"
                        : day.inMonth
                          ? "text-slate-600"
                          : "text-slate-300"
                    }`}
                  >
                    {day.dayOfMonth}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* The list the grid is pointing at */}
      <ol className="space-y-4">
        {events.map((event) => (
          <li
            key={event.id}
            className="rounded-2xl border border-[--border] bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-nus-orange-700">
              {formatEventDate(event)}
              {event.time && (
                <span className="text-slate-400"> · {event.time}</span>
              )}
            </p>
            <h3 className="mt-2 text-lg font-bold text-nus-blue-700">
              {event.title}
            </h3>
            {event.location && (
              <p className="mt-1 text-sm text-slate-500">{event.location}</p>
            )}
            {event.description && (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {event.description}
              </p>
            )}
            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-nus-blue-600 underline-offset-4 hover:text-nus-orange-700 hover:underline"
              >
                More details
                <span aria-hidden>&rarr;</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default EventCalendar;
