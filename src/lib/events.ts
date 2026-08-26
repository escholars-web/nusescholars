import rawData from "../data/events.json";

/**
 * The committee's scheduled events, and the calendar grid the events page
 * draws from them.
 *
 * Storage is the same story as the module reviews and the mentor roster (see
 * src/lib/moduleReviews.ts): a committed JSON file rather than a database,
 * because a static export has no server behind it. Adding an event is a pull
 * request against src/data/events.json and a deploy.
 *
 * Everything here runs at build time, in the server component that renders the
 * page, so "upcoming" means upcoming as of the last deploy. An event that has
 * already happened drops off the site the next time it is built, not the
 * morning after. Deleting the entry when you add the next one keeps the list
 * honest without waiting for a deploy.
 */

export interface CommitteeEvent {
  /** Stable key, also what the calendar cells point back at. */
  id: string;
  title: string;
  /** ISO date, YYYY-MM-DD. The day it starts. */
  date: string;
  /** ISO date of the last day, for anything running over more than one. */
  endDate?: string;
  /** Free text, e.g. "7pm to 9pm". Shown next to the date. */
  time?: string;
  location?: string;
  description?: string;
  /** Sign up form, Instagram post, or wherever the details live. */
  url?: string;
}

interface EventData {
  upcoming: CommitteeEvent[];
}

const data = rawData as EventData;

/* Dates are handled in UTC throughout, so a build running in a different
   timezone does not shift a day. */

function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    return null;
  }
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

/** The last day an event occupies, which is its start day unless it runs on. */
function lastDayOf(event: CommitteeEvent): Date | null {
  const start = parseIsoDate(event.date);
  if (!start) {
    return null;
  }
  const end = event.endDate ? parseIsoDate(event.endDate) : null;
  return end && end.getTime() > start.getTime() ? end : start;
}

/** Every day an event covers, one ISO date per day, start and end included. */
export function daysCovered(event: CommitteeEvent): string[] {
  const start = parseIsoDate(event.date);
  const end = lastDayOf(event);
  if (!start || !end) {
    return [];
  }
  const days: string[] = [];
  for (let day = start; day.getTime() <= end.getTime(); day = addDays(day, 1)) {
    days.push(toIsoDate(day));
    /* A malformed endDate far in the future should not spin forever. */
    if (days.length > 31) {
      break;
    }
  }
  return days;
}

/**
 * Scheduled events that have not finished yet, soonest first.
 *
 * An event stays listed through its final day, so a two day orientation is
 * still "upcoming" on the morning of day two rather than disappearing at
 * midnight halfway through.
 */
export function getUpcomingEvents(now: Date): CommitteeEvent[] {
  const today = startOfUtcDay(now).getTime();
  return data.upcoming
    .filter((event) => {
      const end = lastDayOf(event);
      return end !== null && end.getTime() >= today;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface CalendarDay {
  /** ISO date, the key the event list matches against. */
  date: string;
  dayOfMonth: number;
  /** False for the days borrowed from the months either side, to pad the grid. */
  inMonth: boolean;
  /** Ids of the events falling on this day, in the order they are listed. */
  eventIds: string[];
}

export interface CalendarMonth {
  /** "2026-08", stable across renders. */
  key: string;
  /** "August 2026". */
  label: string;
  /** Whole weeks, Monday first. */
  weeks: CalendarDay[][];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Monday is column 0, which is how a Singapore calendar reads. */
export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function mondayIndex(date: Date): number {
  return (date.getUTCDay() + 6) % 7;
}

function buildMonth(
  year: number,
  month: number,
  byDate: Map<string, string[]>,
): CalendarMonth {
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const gridStart = addDays(firstOfMonth, -mondayIndex(firstOfMonth));
  const lastOfMonth = new Date(Date.UTC(year, month + 1, 0));
  const gridEnd = addDays(lastOfMonth, 6 - mondayIndex(lastOfMonth));

  const weeks: CalendarDay[][] = [];
  let week: CalendarDay[] = [];
  for (
    let day = gridStart;
    day.getTime() <= gridEnd.getTime();
    day = addDays(day, 1)
  ) {
    const iso = toIsoDate(day);
    week.push({
      date: iso,
      dayOfMonth: day.getUTCDate(),
      inMonth: day.getUTCMonth() === month,
      eventIds: byDate.get(iso) ?? [],
    });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  return {
    key: `${year}-${String(month + 1).padStart(2, "0")}`,
    label: `${MONTH_NAMES[month]} ${year}`,
    weeks,
  };
}

/**
 * One grid per month that actually has something in it, soonest first.
 *
 * Months with nothing scheduled are skipped rather than drawn empty, so a
 * quiet stretch over the vacation does not become three blank grids to scroll
 * past. `maxMonths` keeps a far off event from stretching the page.
 */
export function buildCalendarMonths(
  events: CommitteeEvent[],
  maxMonths = 3,
): CalendarMonth[] {
  const byDate = new Map<string, string[]>();
  for (const event of events) {
    for (const iso of daysCovered(event)) {
      const ids = byDate.get(iso) ?? [];
      ids.push(event.id);
      byDate.set(iso, ids);
    }
  }

  const months: CalendarMonth[] = [];
  const seen = new Set<string>();
  for (const event of events) {
    for (const iso of daysCovered(event)) {
      const key = iso.slice(0, 7);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      const [year, month] = key.split("-").map(Number);
      months.push(buildMonth(year, month - 1, byDate));
      if (months.length >= maxMonths) {
        return months;
      }
    }
  }
  return months;
}

/** "Thu, 6 Aug 2026", or "6 to 7 Aug 2026" when it runs over more than a day. */
export function formatEventDate(event: CommitteeEvent): string {
  const start = parseIsoDate(event.date);
  const end = lastDayOf(event);
  if (!start || !end) {
    return event.date;
  }

  const day = (d: Date) => d.getUTCDate();
  const shortMonth = (d: Date) => MONTH_NAMES[d.getUTCMonth()].slice(0, 3);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (start.getTime() === end.getTime()) {
    return `${weekday[start.getUTCDay()]}, ${day(start)} ${shortMonth(start)} ${start.getUTCFullYear()}`;
  }
  if (start.getUTCMonth() === end.getUTCMonth()) {
    return `${day(start)} to ${day(end)} ${shortMonth(end)} ${end.getUTCFullYear()}`;
  }
  return `${day(start)} ${shortMonth(start)} to ${day(end)} ${shortMonth(end)} ${end.getUTCFullYear()}`;
}
