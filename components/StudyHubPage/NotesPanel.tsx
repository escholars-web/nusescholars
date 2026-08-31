"use client";

import React, { useState } from "react";
import MarkdownNote from "./MarkdownNote";
import { NOTE_CONTENT } from "../../src/data/notes";
import type { ModuleNote } from "../../src/lib/moduleReviews";

const NOTE_KIND_LABELS: Record<ModuleNote["kind"], string> = {
  notes: "Notes",
  cheatsheet: "Cheatsheet",
  "past-papers": "Past papers",
  template: "Template",
  other: "Resource",
};

/**
 * Notes are shown in an embedded viewer rather than handed over as a download
 * link, because contributors asked for them to be readable on the site only.
 *
 * Worth being straight about what that does and does not do. It removes the
 * obvious download button and keeps people on the page, which is enough to stop
 * casual redistribution. It is not protection: the file still has a URL, the
 * browser still has to fetch the bytes to draw them, and anyone who opens the
 * network tab can save it. Tell contributors that before they share anything
 * they would mind seeing passed around, rather than after.
 */
const NoteViewer: React.FC<{ note: ModuleNote; onClose: () => void }> = ({
  note,
  onClose,
}) => (
  <div className="mt-3 overflow-hidden rounded-xl border border-[--border] bg-white">
    <div className="flex items-center justify-between gap-3 border-b border-[--border] px-4 py-2.5">
      <p className="text-sm font-semibold text-nus-blue-700">{note.title}</p>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-[--border] px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:border-nus-orange-400 hover:text-nus-orange-700"
      >
        Close
      </button>
    </div>
    <iframe
      src={`${note.url}#toolbar=0&navpanes=0`}
      title={note.title}
      className="h-[70vh] w-full"
    />
    <p className="border-t border-[--border] px-4 py-2 text-xs text-slate-500">
      Shared by {note.contributor}. Please keep it within D&amp;E-Scholars
      rather than reposting it elsewhere.
    </p>
  </div>
);

const NoteRow: React.FC<{ note: ModuleNote }> = ({ note }) => {
  const [open, setOpen] = useState(false);

  const bundled =
    note.content !== undefined ? NOTE_CONTENT[note.content] : undefined;

  const label = (
    <>
      <span className="rounded-full bg-nus-orange-100 px-2.5 py-0.5 text-xs font-bold text-nus-orange-800">
        {NOTE_KIND_LABELS[note.kind]}
      </span>
      <span className="font-semibold text-nus-blue-700">{note.title}</span>
    </>
  );

  // Bundled text: rendered inline, so there is no file URL to pass around.
  if (bundled !== undefined) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full flex-wrap items-center gap-2 rounded-xl border-2 border-nus-orange-100 bg-white px-4 py-3.5 text-left text-sm transition-colors hover:border-nus-orange-400"
        >
          {label}
          <span className="text-xs text-slate-500">
            shared by {note.contributor}
          </span>
          <span className="ml-auto text-xs font-bold text-nus-orange-800">
            {open ? "Hide" : "Read"}
          </span>
        </button>
        {open && (
          <div className="mt-3 rounded-xl border-2 border-nus-orange-100 bg-white px-6 py-7 sm:px-9">
            <MarkdownNote markdown={bundled} />
            <p className="mt-9 border-t border-[--border] pt-4 text-xs leading-6 text-slate-500">
              Shared by {note.contributor}. Please keep it within
              D&amp;E-Scholars rather than reposting it elsewhere.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (note.url === "") {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-[--border] bg-white px-4 py-3 text-sm opacity-70">
        {label}
        <span className="text-xs italic text-slate-500">
          nobody has shared this one yet
        </span>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-wrap items-center gap-2 rounded-lg border border-[--border] bg-white px-4 py-3 text-left text-sm transition-colors hover:border-nus-orange-400"
      >
        {label}
        <span className="text-xs text-slate-500">
          shared by {note.contributor}
        </span>
        <span className="ml-auto text-xs font-semibold text-nus-blue-600">
          {open ? "Hide" : "Read"}
        </span>
      </button>
      {open && <NoteViewer note={note} onClose={() => setOpen(false)} />}
    </div>
  );
};

const NotesPanel: React.FC<{ notes: ModuleNote[]; courseCode: string }> = ({
  notes,
  courseCode,
}) => {
  if (notes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[--border] bg-white p-10 text-center">
        <p className="text-sm text-slate-500">
          Nobody has shared notes for {courseCode} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteRow key={note.title} note={note} />
      ))}
    </div>
  );
};

export default NotesPanel;
