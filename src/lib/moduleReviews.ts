import rawData from "../data/module-reviews.json";

/**
 * Data layer for the module reviews and notes section.
 *
 * Reads come from `src/data/module-reviews.json`, which is committed to the repo
 * and baked into the static build exactly like `database.json`. No backend needed.
 *
 * Writes are a different story. The site is deployed as a Next.js static export
 * (see .github/workflows/nextjs.yml, which uploads ./out), so there is no server
 * to accept a POST and a browser cannot write into the repo. Everything a signed
 * in student submits therefore goes through `submitReview` below, which is the
 * single place to swap in a real backend later. See SUBMISSION_MODE.
 */

export type NoteKind =
  | "notes"
  | "cheatsheet"
  | "past-papers"
  | "template"
  | "other";

export interface ModuleNote {
  title: string;
  url: string;
  contributor: string;
  kind: NoteKind;
}

export interface ModuleReview {
  id: string;
  /** Overall rating, 1 to 5. */
  rating: number;
  /** Perceived workload, 1 (light) to 5 (heavy). */
  workload: number;
  /** Perceived difficulty, 1 (easy) to 5 (hard). */
  difficulty: number;
  semester: string;
  body: string;
  /** `null` means the author chose to post anonymously. */
  author: string | null;
  batch: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /**
   * True for reviews the current browser submitted that are not yet published
   * to the repo. Only ever set on locally stored drafts, never in the JSON.
   */
  pending?: boolean;
}

export interface ModuleEntry {
  code: string;
  title: string;
  department: string;
  units: number;
  notes: ModuleNote[];
  reviews: ModuleReview[];
}

export interface ModuleStats {
  reviewCount: number;
  averageRating: number;
  averageWorkload: number;
  averageDifficulty: number;
}

const PENDING_STORAGE_KEY = "descholars.pendingModuleReviews.v1";

/** Every module in the committed dataset, sorted by module code. */
export function getModules(): ModuleEntry[] {
  const modules = (rawData as { modules: ModuleEntry[] }).modules;
  return [...modules].sort((a, b) => a.code.localeCompare(b.code));
}

export function getDepartments(modules: ModuleEntry[]): string[] {
  const seen = new Set(modules.map((m) => m.department));
  return [...seen].sort((a, b) => a.localeCompare(b));
}

function mean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function getModuleStats(entry: ModuleEntry): ModuleStats {
  return {
    reviewCount: entry.reviews.length,
    averageRating: mean(entry.reviews.map((r) => r.rating)),
    averageWorkload: mean(entry.reviews.map((r) => r.workload)),
    averageDifficulty: mean(entry.reviews.map((r) => r.difficulty)),
  };
}

/** Case insensitive match across module code, title, and department. */
export function matchesQuery(entry: ModuleEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") {
    return true;
  }
  return (
    entry.code.toLowerCase().includes(q) ||
    entry.title.toLowerCase().includes(q) ||
    entry.department.toLowerCase().includes(q)
  );
}

export type SortKey = "code" | "rating" | "reviews" | "easiest";

export function sortModules(
  modules: ModuleEntry[],
  key: SortKey,
): ModuleEntry[] {
  const sorted = [...modules];
  switch (key) {
    case "rating":
      return sorted.sort(
        (a, b) =>
          getModuleStats(b).averageRating - getModuleStats(a).averageRating,
      );
    case "reviews":
      return sorted.sort(
        (a, b) => getModuleStats(b).reviewCount - getModuleStats(a).reviewCount,
      );
    case "easiest":
      return sorted.sort(
        (a, b) =>
          getModuleStats(a).averageDifficulty -
          getModuleStats(b).averageDifficulty,
      );
    default:
      return sorted.sort((a, b) => a.code.localeCompare(b.code));
  }
}

/* -------------------------------------------------------------------------- */
/* Submission                                                                  */
/* -------------------------------------------------------------------------- */

export interface ReviewDraft {
  moduleCode: string;
  rating: number;
  workload: number;
  difficulty: number;
  semester: string;
  body: string;
  /** `null` when the author ticked "post anonymously". */
  author: string | null;
  batch: string;
}

export type SubmissionMode = "local" | "endpoint";

/**
 * How submitted reviews are persisted.
 *
 * "local"    Reviews are kept in this browser only and shown to their author as
 *            pending. Nothing reaches other visitors. This is the only mode that
 *            works on a pure static export with no backend, and it is the
 *            default so the site builds and runs with no configuration.
 *
 * "endpoint" POST the review as JSON to NEXT_PUBLIC_REVIEW_ENDPOINT. Point this
 *            at whatever you stand up later (a Supabase edge function, a Vercel
 *            route handler, a Google Apps Script web app). The request shape is
 *            a plain ReviewDraft, so the receiver stays simple.
 */
export const SUBMISSION_MODE: SubmissionMode =
  (process.env.NEXT_PUBLIC_REVIEW_ENDPOINT ?? "") !== "" ? "endpoint" : "local";

export interface SubmitResult {
  ok: boolean;
  /** Message to show the author. */
  message: string;
  /** The stored review, when submission produced one. */
  review?: ModuleReview;
}

function readPending(): Record<string, ModuleReview[]> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(PENDING_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ModuleReview[]>) : {};
  } catch {
    return {};
  }
}

function writePending(pending: Record<string, ModuleReview[]>): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pending));
  } catch {
    // Storage can be full or blocked in private mode. The review is still shown
    // for this page view, it just will not survive a reload.
  }
}

/** Locally stored, not yet published reviews for a module. */
export function getPendingReviews(moduleCode: string): ModuleReview[] {
  return readPending()[moduleCode] ?? [];
}

export function draftToReview(draft: ReviewDraft, now: Date): ModuleReview {
  return {
    id: `${draft.moduleCode.toLowerCase()}-local-${now.getTime()}`,
    rating: draft.rating,
    workload: draft.workload,
    difficulty: draft.difficulty,
    semester: draft.semester,
    body: draft.body.trim(),
    author: draft.author,
    batch: draft.batch,
    date: now.toISOString().slice(0, 10),
    pending: true,
  };
}

/**
 * The single write path for the section. Everything else in the UI calls this.
 */
export async function submitReview(draft: ReviewDraft): Promise<SubmitResult> {
  const review = draftToReview(draft, new Date());

  if (SUBMISSION_MODE === "endpoint") {
    const endpoint = process.env.NEXT_PUBLIC_REVIEW_ENDPOINT as string;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        return {
          ok: false,
          message: `The server rejected the review (${res.status}). Please try again later.`,
        };
      }
      return {
        ok: true,
        message: "Thanks! Your review has been submitted for publishing.",
        review,
      };
    } catch {
      return {
        ok: false,
        message:
          "Could not reach the review server. Check your connection and try again.",
      };
    }
  }

  const pending = readPending();
  pending[draft.moduleCode] = [...(pending[draft.moduleCode] ?? []), review];
  writePending(pending);

  return {
    ok: true,
    message:
      "Saved on this device. Reviews are published by the committee, so copy the entry below and send it over to get it onto the live site.",
    review,
  };
}

/** The JSON a student can hand to the committee to get a pending review published. */
export function reviewAsJson(review: ModuleReview, moduleCode: string): string {
  const { pending: _pending, ...publishable } = review;
  return JSON.stringify({ module: moduleCode, review: publishable }, null, 2);
}
