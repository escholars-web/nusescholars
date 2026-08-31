import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * ESLint 9 flat config.
 *
 * Replaces the old .eslintrc.json, which ESLint 9 no longer reads. The rule set
 * is the same one that file asked for (next/core-web-vitals plus
 * next/typescript), just loaded the flat way.
 */
const config = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "public/**",
      "next-env.d.ts",
      // Vendored design-skill scripts, installed per developer by
      // `npx impeccable install`. Not ours to lint.
      ".claude/**",
      ".github/skills/**",
      ".github/agents/**",
      ".github/hooks/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {
    // The archive is a frozen copy of the previous site, kept so old links keep
    // working. It is not maintained, so image optimisation advice there is noise
    // rather than something anyone will action.
    files: ["components/archive/**", "src/app/archive/**"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
