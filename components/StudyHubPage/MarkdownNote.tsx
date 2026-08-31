"use client";

import React from "react";

/**
 * Renders the subset of markdown the notes actually use, as React elements.
 *
 * Deliberately not a markdown library and deliberately not
 * dangerouslySetInnerHTML. The notes are trusted, checked-in text, so the job
 * is small and a parser that returns elements keeps it impossible for note
 * content to inject markup. If notes ever start coming from people rather than
 * from the repo, replace this with a real library plus sanitisation rather than
 * widening what this understands.
 *
 * Supported: # ## ### headings, - and * bullets, 1. numbered lists, --- rules,
 * **bold**, `code`, and paragraphs.
 */

/** Split a line into plain text, **bold**, and `code` runs. */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong
          key={`${keyPrefix}-b${i}`}
          className="font-bold text-nus-blue-800"
        >
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      parts.push(
        <code
          key={`${keyPrefix}-c${i}`}
          className="rounded bg-nus-blue-50 px-1.5 py-0.5 font-mono text-[0.9em] text-nus-blue-800"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }
    last = match.index + token.length;
    i += 1;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts;
}

interface Block {
  kind: "h1" | "h2" | "h3" | "p" | "ul" | "ol" | "hr";
  lines: string[];
}

function toBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let listKind: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: "p", lines: [paragraph.join(" ")] });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length > 0 && listKind !== null) {
      blocks.push({ kind: listKind, lines: list });
      list = [];
      listKind = null;
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
  };

  for (const raw of markdown.split("\n")) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (trimmed === "") {
      flushAll();
      continue;
    }
    if (/^---+$/.test(trimmed)) {
      flushAll();
      blocks.push({ kind: "hr", lines: [] });
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      blocks.push({
        kind: level === 1 ? "h1" : level === 2 ? "h2" : "h3",
        lines: [heading[2]],
      });
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(trimmed);
    if (bullet) {
      flushParagraph();
      if (listKind === "ol") flushList();
      listKind = "ul";
      list.push(bullet[1]);
      continue;
    }

    const numbered = /^\d+[.)]\s+(.*)$/.exec(trimmed);
    if (numbered) {
      flushParagraph();
      if (listKind === "ul") flushList();
      listKind = "ol";
      list.push(numbered[1]);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }
  flushAll();
  return blocks;
}

const MarkdownNote: React.FC<{ markdown: string }> = ({ markdown }) => {
  const blocks = React.useMemo(() => toBlocks(markdown), [markdown]);

  return (
    <div className="max-w-[68ch]">
      {blocks.map((block, i) => {
        const key = `b${i}`;
        switch (block.kind) {
          case "h1":
            return (
              <h3
                key={key}
                className="mt-10 text-2xl font-bold tracking-[-0.01em] text-nus-blue-700 first:mt-0"
              >
                {renderInline(block.lines[0], key)}
              </h3>
            );
          case "h2":
            return (
              <h4
                key={key}
                className="mt-9 text-xl font-bold tracking-[-0.01em] text-nus-blue-700 first:mt-0"
              >
                {renderInline(block.lines[0], key)}
              </h4>
            );
          case "h3":
            return (
              <h5
                key={key}
                className="mt-7 text-base font-bold text-nus-orange-800 first:mt-0"
              >
                {renderInline(block.lines[0], key)}
              </h5>
            );
          case "hr":
            return (
              <hr key={key} className="my-9 border-t-2 border-nus-orange-100" />
            );
          case "ul":
            return (
              <ul key={key} className="mt-3 list-disc space-y-1.5 pl-6">
                {block.lines.map((line, j) => (
                  <li key={`${key}-${j}`} className="leading-7 text-slate-700">
                    {renderInline(line, `${key}-${j}`)}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} className="mt-3 list-decimal space-y-1.5 pl-6">
                {block.lines.map((line, j) => (
                  <li key={`${key}-${j}`} className="leading-7 text-slate-700">
                    {renderInline(line, `${key}-${j}`)}
                  </li>
                ))}
              </ol>
            );
          default:
            return (
              <p key={key} className="mt-4 leading-7 text-slate-700">
                {renderInline(block.lines[0], key)}
              </p>
            );
        }
      })}
    </div>
  );
};

export default MarkdownNote;
