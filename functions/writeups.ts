/**
 * Cleaning up the write-ups on their way to a profile page.
 *
 * Write-ups are collected once at census time and then sit in database.json
 * untouched, so anything time sensitive a person wrote about themselves goes
 * quietly stale. The year of study is the worst offender: "I am a Y1 Computer
 * Engineering student" is wrong by the following August and wrong by two years
 * the August after that.
 *
 * We used to bump the number to keep it current. Stripping it is better,
 * because the profile already says "Batch AY25/26" right above the write-up and
 * a batch never goes stale, so the year of study was only ever a second, more
 * fragile way of saying the same thing.
 *
 * This runs at build time, in the server component that renders a profile.
 * database.json keeps what the person actually wrote, we simply do not show the
 * part that expires.
 */

/** "Y1", "y 2", "Year 3", optionally with the article in front of it. */
const YEAR_PHRASE = /(\ban?\s+)?\b(?:y|year)\s?[1-6]\b(\s*)/gi;

/** A year that follows one of these is history, not a self description. */
const PAST_CONTEXT = /\b(in|during|since|from|after|before|by)\s+$/i;

/** The first word after the phrase we removed, punctuation stripped. */
const NEXT_WORD = /^[^A-Za-z0-9]*([A-Za-z0-9][\w&-]*)/;

/** Letter names that open with a vowel sound, for acronyms read out letter by letter. */
const VOWEL_SOUND_LETTERS = /^[AEFHILMNORSX]$/;

/** Vowel on paper, "y" sound out loud, so they take "a" rather than "an". */
const CONSONANT_SOUND_PREFIX = /^(uni|use|usu|usa|util|utili|euro|eu[a-z])/i;

/** An initialism such as BME or MSE, which is read one letter at a time. */
const INITIALISM = /^[A-Z]{2,}[0-9]*$/;

/**
 * "a" or "an" for `word`.
 *
 * Sound rather than spelling, which is why BME takes "a" (bee) and MSE takes
 * "an" (em), and why "undergraduate" takes "an" while "university" would not.
 */
export function indefiniteArticle(word: string): "a" | "an" {
  if (INITIALISM.test(word)) {
    return VOWEL_SOUND_LETTERS.test(word.charAt(0)) ? "an" : "a";
  }
  if (CONSONANT_SOUND_PREFIX.test(word)) {
    return "a";
  }
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

/** Give `article` the capitalisation `original` had. */
function matchCase(article: string, original: string): string {
  return /^[A-Z]/.test(original)
    ? article.charAt(0).toUpperCase() + article.slice(1)
    : article;
}

/**
 * Remove every year of study a person wrote about themselves, fixing up the
 * article left behind so "a Year 3 Electrical Engineering student" becomes
 * "an Electrical Engineering student" rather than "a Electrical".
 *
 * Deliberately conservative. A mention is left exactly as written when it reads
 * as a past event ("I took SUSEP in year 2 sem 2"), and when whatever follows
 * it cannot be identified, because leaving a stale number beats leaving a
 * sentence with a hole in it.
 */
export function stripYearMentions(text: string): string {
  if (!text) {
    return text;
  }
  return text.replace(
    YEAR_PHRASE,
    (
      match: string,
      article: string | undefined,
      _gap: string,
      offset: number,
    ) => {
      const before = text.slice(Math.max(0, offset - 16), offset);
      const after = text.slice(offset + match.length);
      if (PAST_CONTEXT.test(before) || /^\s*sem\b/i.test(after)) {
        return match;
      }

      const next = NEXT_WORD.exec(after);
      if (next === null) {
        return match;
      }
      if (article === undefined) {
        return "";
      }
      return `${matchCase(indefiniteArticle(next[1]), article.trim())} `;
    },
  );
}
