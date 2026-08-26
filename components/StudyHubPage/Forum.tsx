"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useNusAuth } from "../../src/lib/nusAuth";
import {
  askQuestion,
  forumStore,
  FORUM_MODE,
  NO_QUESTIONS,
  type ForumQuestion,
} from "../../src/lib/forum";

const controlClass =
  "w-full rounded-lg border border-[--border] bg-white px-3 py-2 text-sm text-slate-700 focus:border-nus-blue-500 focus:outline-none focus:ring-1 focus:ring-nus-blue-500";

const AnswerRow: React.FC<{ answer: ForumQuestion["answers"][number] }> = ({
  answer,
}) => (
  <div className="border-l-2 border-nus-orange-300 pl-4">
    <p className="text-sm leading-6 text-slate-700">{answer.body}</p>
    <p className="mt-1 text-xs text-slate-500">
      {answer.author}
      {answer.viaTelegram ? ", answered on Telegram" : ""} · {answer.date}
    </p>
  </div>
);

const QuestionCard: React.FC<{ question: ForumQuestion }> = ({ question }) => (
  <article className="rounded-2xl border border-[--border] bg-white p-5">
    <header className="flex flex-wrap items-start justify-between gap-2">
      <h4 className="font-bold text-nus-blue-700">{question.title}</h4>
      {question.pending === true && (
        <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-600">
          Only in your browser
        </span>
      )}
    </header>

    <p className="mt-2 text-sm leading-6 text-slate-700">{question.body}</p>
    <p className="mt-2 text-xs text-slate-500">
      {question.author ?? "Anonymous"} · {question.date}
    </p>

    {question.answers.length > 0 ? (
      <div className="mt-4 space-y-4">
        {question.answers.map((a) => (
          <AnswerRow key={a.id} answer={a} />
        ))}
      </div>
    ) : (
      <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
        No answer yet.
      </p>
    )}
  </article>
);

const Forum: React.FC<{ courseCode: string }> = ({ courseCode }) => {
  const { user } = useNusAuth();

  const byCourse = useSyncExternalStore(
    forumStore.subscribe,
    forumStore.getSnapshot,
    forumStore.getServerSnapshot,
  );
  const questions = byCourse[courseCode] ?? NO_QUESTIONS;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [sending, setSending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    const outcome = await askQuestion({
      courseCode,
      title,
      body,
      author: anonymous ? "" : (user?.name ?? ""),
    });
    setSending(false);
    setNotice({ ok: outcome.ok, text: outcome.message });
    if (outcome.ok) {
      setTitle("");
      setBody("");
      // The local path already invalidated the store. This covers the endpoint
      // path, where the new question came back from the server.
      forumStore.invalidate();
    }
  };

  return (
    <div className="space-y-8">
      {FORUM_MODE === "local" && (
        <div className="rounded-xl border border-dashed border-nus-blue-300 bg-white p-4">
          <p className="text-sm leading-6 text-slate-600">
            Not connected to Telegram yet. Questions stay in your browser.
          </p>
        </div>
      )}

      <form onSubmit={submit} className="rounded-2xl bg-slate-50 p-5">
        <h3 className="text-base font-bold text-nus-blue-700">
          Ask about {courseCode}
        </h3>

        <label
          htmlFor="q-title"
          className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          Question
        </label>
        <input
          id="q-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Why does my recursion overflow on the last test case?"
          className={`mt-1 ${controlClass}`}
        />

        <label
          htmlFor="q-body"
          className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          Details
        </label>
        <textarea
          id="q-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          placeholder="What have you tried, and where does it stop making sense?"
          className={`mt-1 ${controlClass}`}
        />

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          Ask anonymously
        </label>

        {notice !== null && (
          <p
            className={`mt-4 rounded-lg px-3 py-2 text-sm ${
              notice.ok
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {notice.text}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="mt-4 rounded-lg bg-nus-orange-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-nus-orange-800 disabled:opacity-60"
        >
          {sending ? "Posting..." : "Post question"}
        </button>
      </form>

      <div>
        <h3 className="mb-4 text-base font-bold text-nus-blue-700">
          Questions ({questions.length})
        </h3>
        {questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[--border] bg-white p-10 text-center">
            <p className="text-sm text-slate-500">
              Nobody has asked about {courseCode} yet. Be the first.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
