import { EG1311_NOTES } from "./eg1311";

/**
 * Notes that live in the bundle rather than as files under public/.
 *
 * A file in public/ has its own URL and is fetchable by anyone who guesses it,
 * signed in or not. Keeping a note here means the only way to read it is to
 * load the page, which is what contributors asked for. It is still not
 * protection: the text reaches the browser either way, and anyone determined
 * can read it out of the bundle. Say so to contributors before they share.
 */
export const NOTE_CONTENT: Record<string, string> = {
  eg1311: EG1311_NOTES,
};
