import { NextResponse } from "next/server";
import volunteers from "../../../data/volunteers.json";

/**
 * Receives a Study Hub question and pings the volunteers for that course on
 * Telegram.
 *
 * This is the half of the loop that can exist without a database: the question
 * goes out, a senior answers in Telegram, and for now the answer is carried
 * back by hand. Returning answers to the site automatically needs somewhere to
 * store threads plus a Telegram webhook, which is a separate piece of work.
 *
 * TELEGRAM_BOT_TOKEN is a real secret, unlike the Entra client ID. It must live
 * in the environment and never in the repo, because anyone holding it can post
 * as the bot and read everything it receives.
 *
 * This route makes the site need a server, so it only runs on Vercel. A static
 * export has nowhere to execute it.
 */

const TELEGRAM_API = "https://api.telegram.org";

const MAX_TITLE = 200;
const MAX_BODY = 4000;

interface Volunteer {
  name: string;
  telegram: string;
  chatId: number | string | null;
}

/** Telegram parses this as MarkdownV2, so the reserved punctuation must go. */
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, (c) => "\\" + c);
}

function volunteersFor(courseCode: string): Volunteer[] {
  const courses = (volunteers as { courses: Record<string, Volunteer[]> })
    .courses;
  return courses[courseCode.toUpperCase()] ?? [];
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    // Deliberately vague to the caller, specific in the log. A misconfigured
    // deploy should not advertise which secret is missing.
    console.error("TELEGRAM_BOT_TOKEN is not set; question not delivered");
    return NextResponse.json(
      { ok: false, message: "Questions are not being delivered right now." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Malformed request." },
      { status: 400 },
    );
  }

  const { courseCode, title, body, author } = (payload ?? {}) as Record<
    string,
    unknown
  >;

  // Validate server side. The client checks too, but the client is not trusted.
  if (
    typeof courseCode !== "string" ||
    typeof title !== "string" ||
    typeof body !== "string" ||
    courseCode.trim() === "" ||
    title.trim().length < 8 ||
    body.trim().length < 20 ||
    title.length > MAX_TITLE ||
    body.length > MAX_BODY
  ) {
    return NextResponse.json(
      { ok: false, message: "That question did not look complete." },
      { status: 400 },
    );
  }

  const recipients = volunteersFor(courseCode).filter(
    (v) => v.chatId !== null && v.chatId !== "",
  );

  if (recipients.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        message: `No senior has signed up for ${courseCode.toUpperCase()} yet, so there is nobody to notify.`,
      },
      { status: 404 },
    );
  }

  const who =
    typeof author === "string" && author.trim() !== ""
      ? author.trim()
      : "Someone (anonymous)";

  const text = [
    `*New ${escapeMarkdown(courseCode.toUpperCase())} question*`,
    "",
    `*${escapeMarkdown(title.trim())}*`,
    "",
    escapeMarkdown(body.trim()),
    "",
    `_asked by ${escapeMarkdown(who)}_`,
    "",
    "Reply here and it can be carried back to the Study Hub\\.",
  ].join("\n");

  const results = await Promise.allSettled(
    recipients.map((v) =>
      fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: v.chatId,
          text,
          parse_mode: "MarkdownV2",
        }),
      }).then(async (r) => {
        if (!r.ok) {
          // Telegram puts the real reason in the body, and it is usually
          // "chat not found", meaning that person never messaged the bot.
          throw new Error(`${r.status} ${await r.text()}`);
        }
        return r;
      }),
    ),
  );

  const delivered = results.filter((r) => r.status === "fulfilled").length;
  results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .forEach((r) => console.error("telegram send failed:", r.reason));

  if (delivered === 0) {
    return NextResponse.json(
      { ok: false, message: "Could not reach any senior. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: `Question sent. ${delivered} ${delivered === 1 ? "senior has" : "seniors have"} been notified on Telegram.`,
  });
}
