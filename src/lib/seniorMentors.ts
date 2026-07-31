import rawData from "../data/senior-mentors.json";

/**
 * Senior Teach Junior: seniors who volunteer to coach juniors through modules
 * they have already cleared.
 *
 * Same storage story as the module reviews (see src/lib/moduleReviews.ts). The
 * roster is committed JSON, and sign ups go out to a form rather than into a
 * database, because a static export has no server to receive them.
 */

export interface SeniorMentor {
  id: string;
  name: string;
  batch: string;
  major: string;
  /** Module codes this senior is offering to help with. */
  modules: string[];
  blurb: string;
  /** How they prefer to run sessions, e.g. "Small group, weekly". */
  format: string;
  /** False when they are full or on a break, so the UI can grey them out. */
  available: boolean;
}

export interface ProgrammeLinks {
  signUpUrl: string;
  mentorSignUpUrl: string;
  coordinatorEmail: string;
}

interface MentorData {
  programme: ProgrammeLinks;
  mentors: SeniorMentor[];
}

export function getProgrammeLinks(): ProgrammeLinks {
  return (rawData as MentorData).programme;
}

/** Available mentors first, then alphabetical by major. */
export function getMentors(): SeniorMentor[] {
  const mentors = (rawData as MentorData).mentors;
  return [...mentors].sort((a, b) => {
    if (a.available !== b.available) {
      return a.available ? -1 : 1;
    }
    return a.major.localeCompare(b.major);
  });
}

/** Every module code a senior has offered to cover, deduplicated and sorted. */
export function getCoveredModules(mentors: SeniorMentor[]): string[] {
  const seen = new Set(mentors.flatMap((m) => m.modules));
  return [...seen].sort((a, b) => a.localeCompare(b));
}

export function mentorsForModule(
  mentors: SeniorMentor[],
  moduleCode: string,
): SeniorMentor[] {
  if (moduleCode === "all") {
    return mentors;
  }
  return mentors.filter((m) => m.modules.includes(moduleCode));
}
