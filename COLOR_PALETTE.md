# NUS DE-Scholars — Color Palette

This palette replicates the colour system used across current NUS websites
(nus.edu.sg, cde.nus.edu.sg). The primary corporate colours are taken from the
official NUS corporate identity guidelines
(https://www.nus.edu.sg/identity/guidelines/corporate-colours).

## 1. Primary brand colours (official)

| Colour         | Pantone | Hex       | RGB         | CMYK (coated)   |
| -------------- | ------- | --------- | ----------- | --------------- |
| **NUS Orange** | PMS 152 | `#EF7C00` | 239, 124, 0 | 0C 60M 100Y 0K  |
| **NUS Blue**   | PMS 294 | `#003D7C` | 0, 61, 124  | 100C 70M 0Y 30K |

## 2. Secondary brand colours (official, metallic)

Metallic Pantone inks have no exact on-screen equivalent; the hex values below
are screen approximations for web use.

| Colour     | Pantone  | Web approximation |
| ---------- | -------- | ----------------- |
| NUS Gold   | PMS 872  | `#B49A57`         |
| NUS Silver | PMS 8420 | `#A7A8AA`         |

## 3. Extended web scales

Tints and shades derived from the two primary colours for backgrounds, hovers,
borders and text. These are the values wired into `tailwind.config.ts`
(`nus-blue-*`, `nus-orange-*`) and `src/app/globals.css`.

### NUS Blue scale

| Token          | Hex       | Typical use                               |
| -------------- | --------- | ----------------------------------------- |
| `nus-blue-50`  | `#E8F0F9` | Tinted section backgrounds                |
| `nus-blue-100` | `#C5D8ED` | Card hover backgrounds                    |
| `nus-blue-200` | `#9ABCDE` | Decorative borders                        |
| `nus-blue-300` | `#6E9FCE` | Disabled / muted icons                    |
| `nus-blue-400` | `#3D7BB7` | Secondary buttons, links (hover)          |
| `nus-blue-500` | `#155A9C` | Links, secondary emphasis                 |
| `nus-blue-600` | `#003D7C` | **Brand blue** — headers, navbar, buttons |
| `nus-blue-700` | `#003368` | Button hover                              |
| `nus-blue-800` | `#002850` | Footer background                         |
| `nus-blue-900` | `#001C39` | Hero overlays, darkest surfaces           |

### NUS Orange scale

| Token            | Hex       | Typical use                                  |
| ---------------- | --------- | -------------------------------------------- |
| `nus-orange-50`  | `#FEF4E6` | Tinted callout backgrounds                   |
| `nus-orange-100` | `#FCE1C0` | Chip / badge backgrounds                     |
| `nus-orange-200` | `#FACA92` | Decorative borders                           |
| `nus-orange-300` | `#F7B164` | Gradients (light end)                        |
| `nus-orange-400` | `#F39636` | Hover accents                                |
| `nus-orange-500` | `#EF7C00` | **Brand orange** — CTAs, accents, highlights |
| `nus-orange-600` | `#D26D00` | CTA hover                                    |
| `nus-orange-700` | `#AC5900` | Orange text on white (AA-safe)               |
| `nus-orange-800` | `#854500` | Deep accents                                 |
| `nus-orange-900` | `#5E3100` | Darkest accents                              |

### Neutrals

| Token         | Hex       | Typical use                      |
| ------------- | --------- | -------------------------------- |
| `white`       | `#FFFFFF` | Base background, cards           |
| `neutral-50`  | `#F7F9FC` | Page background (cool off-white) |
| `neutral-100` | `#EDF1F6` | Alternating section background   |
| `neutral-200` | `#DCE3EB` | Borders, dividers                |
| `neutral-400` | `#94A3B2` | Placeholder text                 |
| `neutral-500` | `#5F7081` | Secondary text                   |
| `neutral-700` | `#37434F` | Body text on light               |
| `neutral-900` | `#101820` | Headings (near-black ink)        |

## 4. Semantic tokens

CSS variables exposed in `src/app/globals.css`:

| Variable         | Value     | Meaning                           |
| ---------------- | --------- | --------------------------------- |
| `--background`   | `#F7F9FC` | Page background                   |
| `--foreground`   | `#101820` | Default text                      |
| `--primary`      | `#003D7C` | Primary actions, headings, navbar |
| `--primary-dark` | `#002850` | Footer, hover on primary          |
| `--accent`       | `#EF7C00` | CTAs, highlights, active states   |
| `--accent-dark`  | `#D26D00` | CTA hover                         |
| `--muted`        | `#5F7081` | Secondary text                    |
| `--surface`      | `#FFFFFF` | Cards, panels                     |
| `--border`       | `#DCE3EB` | Borders, dividers                 |

## 5. Usage rules

- **60 / 30 / 10**: neutral surfaces ~60%, NUS Blue ~30% (structure: navbar,
  footer, headings, primary buttons), NUS Orange ~10% (accents: CTAs, active
  states, underlines, badges). Orange is the _seasoning_, not the base.
- Gradients used in heroes go blue→blue (`nus-blue-900` → `nus-blue-600`) with
  an orange accent element, never blue→orange across large areas.
- Gold/Silver are reserved for special occasions (awards, anniversaries) and
  are not part of the everyday web UI.

## 6. Accessibility (WCAG 2.1)

| Pairing                                 | Contrast   | Verdict                                                       |
| --------------------------------------- | ---------- | ------------------------------------------------------------- |
| NUS Blue `#003D7C` on white             | ≈ 10.4 : 1 | AAA — fine for any text                                       |
| White on NUS Blue `#003D7C`             | ≈ 10.4 : 1 | AAA — fine for any text                                       |
| NUS Orange `#EF7C00` on white           | ≈ 2.7 : 1  | Fails AA for text — decorative/large display only             |
| `nus-orange-700` `#AC5900` on white     | ≈ 4.9 : 1  | AA — use this for orange _text_ on light backgrounds          |
| White on NUS Orange `#EF7C00`           | ≈ 2.7 : 1  | Only for large/bold text (e.g. big CTA labels ≥ 18.66px bold) |
| `neutral-700` `#37434F` on `neutral-50` | ≈ 9.6 : 1  | AAA — default body text                                       |

Rules of thumb:

- Never set body-size orange text in `#EF7C00` on white; use `#AC5900`.
- Buttons filled with NUS Orange should use white text at large/bold sizes, or
  prefer NUS Blue fills for small buttons.
- Focus rings: 2px `#EF7C00` outline on light surfaces, 2px white on blue.
