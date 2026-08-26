import { createBrowserStore } from "./browserStore";

/**
 * Questions and answers for a single course.
 *
 * The shape here is deliberately the shape a backend would store, so moving
 * from "local" to "endpoint" is a change of transport rather than a rewrite of
 * every component. See FORUM_MODE below.
 *
 * The intended full round trip, once a backend exists:
 *
 *   1. A signed in junior posts a question here.
 *   2. The server writes it, then calls the Telegram Bot API to post it into
 *      the volunteer group, tagging the seniors who listed this course.
 *   3. A volunteer replies in Telegram.
 *   4. Telegram calls the webhook, the server matches the reply to the question
 *      and writes it back as a ForumAnswer.
 *   5. This page shows the answer.
 *
 * Steps 2 to 4 need a server, a database and a bot token. None of that can run
 * on a static export, which is why "local" exists: the UI is complete and
 * usable now, questions simply stay in the asker's own browser until there is
 * somewhere real to put them.
 */

export interface ForumAnswer {
  id: string;
  body: string;
  /** Volunteer's name, or a generic label when they answered anonymously. */
  author: string;
  /** True when the answer arrived through the Telegram bridge. */
  viaTelegram: boolean;
  /** ISO date, YYYY-MM-DD. */
  date: string;
}

export interface ForumQuestion {
  id: string;
  courseCode: string;
  title: string;
  body: string;
  /** `null` means the asker chose to post anonymously. */
  author: string | null;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  answers: ForumAnswer[];
  /**
   * True for questions this browser asked that have not reached a server. Only
   * ever set on locally stored questions, never on anything from a backend.
   */
  pending?: boolean;
}

export type ForumMode = "local" | "endpoint";

/**
 * Where questions go when someone asks one.
 *
 * "local"    Kept in this browser only, shown to their author as pending.
 *            Nothing reaches other visitors and nothing reaches Telegram. This
 *            is the only mode a static export can support, and it is the
 *            default so the site builds and runs with no configuration.
 *
 * "endpoint" POST the question as JSON to NEXT_PUBLIC_FORUM_ENDPOINT, and read
 *            threads back from the same path. That endpoint is what owns the
 *            Telegram bridge and the database.
 */
export const FORUM_MODE: ForumMode =
  (process.env.NEXT_PUBLIC_FORUM_ENDPOINT ?? "") !== "" ? "endpoint" : "local";

const FORUM_ENDPOINT = process.env.NEXT_PUBLIC_FORUM_ENDPOINT ?? "";

const STORAGE_KEY = "descholars.forumQuestions.v1";

type QuestionsByCourse = Record<string, ForumQuestion[]>;

function readLocal(): QuestionsByCourse {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }
    return parsed as QuestionsByCourse;
  } catch {
    // Private browsing, a full quota, or hand-edited storage. An empty forum is
    // a better outcome than a page that will not render.
    return {};
  }
}

function writeLocal(value: QuestionsByCourse): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Nothing useful to do. The question stays in memory for this page view.
  }
}

/**
 * Locally asked questions as an external store, so components subscribe with
 * useSyncExternalStore rather than loading them via setState in an effect.
 */
export const forumStore = createBrowserStore<QuestionsByCourse>(readLocal, {});

/** Stable empty array, so a course with no questions keeps one reference. */
export const NO_QUESTIONS: ForumQuestion[] = [];

export function getLocalQuestions(courseCode: string): ForumQuestion[] {
  return readLocal()[courseCode] ?? NO_QUESTIONS;
}

export interface QuestionDraft {
  courseCode: string;
  title: string;
  body: string;
  /** Empty string posts anonymously. */
  author: string;
}

export interface AskResult {
  ok: boolean;
  /** Message to show the asker. */
  message: string;
  question?: ForumQuestion;
}

export function draftToQuestion(
  draft: QuestionDraft,
  now: Date,
): ForumQuestion {
  const author = draft.author.trim();
  return {
    id: `${draft.courseCode.toLowerCase()}-q-${now.getTime()}`,
    courseCode: draft.courseCode,
    title: draft.title.trim(),
    body: draft.body.trim(),
    author: author === "" ? null : author,
    date: now.toISOString().slice(0, 10),
    answers: [],
    pending: true,
  };
}

export function validateDraft(draft: QuestionDraft): string | null {
  if (draft.title.trim().length < 8) {
    return "Give the question a title of at least 8 characters, so a senior can tell at a glance whether they can help.";
  }
  if (draft.body.trim().length < 20) {
    return "Add a bit more detail. What have you tried, and where exactly does it stop making sense?";
  }
  return null;
}

export async function askQuestion(draft: QuestionDraft): Promise<AskResult> {
  const problem = validateDraft(draft);
  if (problem !== null) {
    return { ok: false, message: problem };
  }

  const question = draftToQuestion(draft, new Date());

  if (FORUM_MODE === "endpoint") {
    try {
      const response = await fetch(FORUM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!response.ok) {
        return {
          ok: false,
          message: `The question did not send (${response.status}). Try again in a moment.`,
        };
      }
      return {
        ok: true,
        message:
          "Question posted. The volunteers for this course have been notified on Telegram, and the answer will appear here.",
        question: { ...question, pending: false },
      };
    } catch {
      return {
        ok: false,
        message:
          "The question did not send. Check your connection and try again.",
      };
    }
  }

  const all = readLocal();
  writeLocal({
    ...all,
    [draft.courseCode]: [question, ...(all[draft.courseCode] ?? [])],
  });
  forumStore.invalidate();

  return {
    ok: true,
    message:
      "Saved to this browser. The forum is not connected to Telegram yet, so no senior has been notified.",
    question,
  };
}
