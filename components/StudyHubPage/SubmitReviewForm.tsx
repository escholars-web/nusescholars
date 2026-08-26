"use client";

import React, { useState } from "react";
import StarRating from "./StarRating";
import { useNusAuth } from "../../src/lib/nusAuth";
import {
  SUBMISSION_MODE,
  reviewAsJson,
  submitReview,
} from "../../src/lib/moduleReviews";

const BATCHES = [
  "AY26/27",
  "AY25/26",
  "AY24/25",
  "AY23/24",
  "AY22/23",
  "AY21/22",
];

const SEMESTERS = BATCHES.flatMap((batch) => [
  `${batch} Sem 1`,
  `${batch} Sem 2`,
  `${batch} Special Term`,
]);

const MIN_BODY_LENGTH = 60;

const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div>
    <label className="block text-sm font-semibold text-nus-blue-700">
      {label}
    </label>
    {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    <div className="mt-2">{children}</div>
  </div>
);

const selectClass =
  "w-full rounded-lg border border-[--border] bg-white px-3 py-2 text-sm text-slate-700 focus:border-nus-blue-500 focus:outline-none focus:ring-1 focus:ring-nus-blue-500";

interface SubmitReviewFormProps {
  moduleCode: string;
}

const SubmitReviewForm: React.FC<SubmitReviewFormProps> = ({ moduleCode }) => {
  const { user } = useNusAuth();
  const [rating, setRating] = useState(4);
  const [workload, setWorkload] = useState(3);
  const [difficulty, setDifficulty] = useState(3);
  const [semester, setSemester] = useState(SEMESTERS[3]);
  const [batch, setBatch] = useState(BATCHES[1]);
  const [body, setBody] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    message: string;
    json?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const tooShort = body.trim().length < MIN_BODY_LENGTH;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (tooShort || busy || !user) {
      return;
    }
    setBusy(true);
    setCopied(false);

    const outcome = await submitReview({
      moduleCode,
      rating,
      workload,
      difficulty,
      semester,
      body,
      author: anonymous ? null : user.name,
      batch,
    });

    setBusy(false);
    setResult({
      ok: outcome.ok,
      message: outcome.message,
      json:
        outcome.ok && outcome.review && SUBMISSION_MODE === "local"
          ? reviewAsJson(outcome.review, moduleCode)
          : undefined,
    });

    if (outcome.ok && outcome.review) {
      setBody("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[--border] bg-nus-blue-50/40 p-5"
    >
      <h4 className="text-base font-bold text-nus-blue-700">
        Write a review for {moduleCode}
      </h4>
      <p className="mt-1 text-xs text-slate-600">
        Signed in as {user?.email}. Be honest and be specific about what future
        batches should actually do differently.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Overall rating">
          <StarRating
            value={rating}
            onChange={setRating}
            label="Overall rating"
            size="md"
          />
        </Field>

        <Field label="When did you take it?">
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className={selectClass}
          >
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Workload" hint="1 is very light, 5 is very heavy">
          <input
            type="range"
            min={1}
            max={5}
            value={workload}
            onChange={(e) => setWorkload(Number(e.target.value))}
            className="w-full accent-nus-orange-500"
            aria-label="Workload from 1 to 5"
          />
        </Field>

        <Field label="Difficulty" hint="1 is very easy, 5 is very hard">
          <input
            type="range"
            min={1}
            max={5}
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="w-full accent-nus-orange-500"
            aria-label="Difficulty from 1 to 5"
          />
        </Field>

        <Field label="Your batch">
          <select
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className={selectClass}
          >
            {BATCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Attribution">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 rounded accent-nus-orange-500"
            />
            Post anonymously
          </label>
          <p className="mt-1 text-xs text-slate-500">
            {anonymous
              ? "Shown as Anonymous D&E-Scholar."
              : `Shown as ${user?.name ?? "your name"}.`}
          </p>
        </Field>
      </div>

      <div className="mt-5">
        <Field
          label="Your review"
          hint={`At least ${MIN_BODY_LENGTH} characters. What was the assessment like, what would you tell your past self?`}
        >
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className={selectClass}
            placeholder="The lectures were, the assessment was, the thing nobody tells you is..."
          />
        </Field>
        <p className="mt-1 text-right text-xs text-slate-500">
          {body.trim().length} characters
        </p>
      </div>

      <button
        type="submit"
        disabled={tooShort || busy}
        className="mt-4 rounded-lg bg-nus-orange-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-nus-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {busy ? "Submitting..." : "Submit review"}
      </button>

      {result && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
            result.ok
              ? "bg-nus-blue-50 text-nus-blue-800"
              : "bg-red-50 text-red-800"
          }`}
          role="status"
        >
          <p>{result.message}</p>
          {result.json && (
            <>
              <pre className="mt-3 max-h-56 overflow-auto rounded-lg bg-white p-3 text-xs text-slate-700">
                {result.json}
              </pre>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard
                    .writeText(result.json as string)
                    .then(() => setCopied(true))
                    .catch(() => setCopied(false));
                }}
                className="mt-2 rounded-lg border border-nus-blue-600 px-4 py-1.5 text-xs font-bold text-nus-blue-700 transition-colors hover:bg-nus-blue-600 hover:text-white"
              >
                {copied ? "Copied" : "Copy for the committee"}
              </button>
            </>
          )}
        </div>
      )}
    </form>
  );
};

export default SubmitReviewForm;
