/**
 * Every off-site link the site hands out, in one place.
 *
 * These outlive the components that use them and get swapped more often than
 * the components do, usually because a form was rebuilt. Keeping them here
 * makes replacing one a single line rather than a hunt through JSX.
 *
 * Senior Teach Junior keeps its own sign up links in
 * src/data/senior-mentors.json, because those sit next to the roster they
 * belong to.
 */

export const INSTAGRAM_URL = "https://www.instagram.com/nusdescholars";

/**
 * Where people report a broken page.
 *
 * When this needs replacing: build the new Microsoft Form, take its link from
 * the Copy link button under Collect responses rather than the address bar of
 * the editor, and change this constant. The archive footer hardcodes its own
 * copy of the URL, so change components/archive/Footer.tsx as well.
 *
 * Do not delete the form being replaced. Its responses are the only record of
 * what has already been reported. Turn Accept responses off instead, and point
 * its closing message at the new form. Share editing of any new form with the
 * whole committee so it does not become one person's form again and go quiet
 * when they graduate.
 */
export const BUG_REPORT_URL =
  "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=Xu-lWwkxd06Fvc_rDTR-ghecPE4DPyNPqqMbtiR9ghNUMVE0RjFVV1dQMTVLSU83WkQwWURMMUFUSS4u";

/**
 * Sign up form for Study Hub access. Students fill this in with their NUS email
 * first, then sign in with the same account.
 */
export const STUDY_HUB_SIGNUP_URL =
  "https://forms.cloud.microsoft/r/dmHQVGBR0y";
