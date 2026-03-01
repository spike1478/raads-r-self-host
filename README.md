# RAADS-R Self-Host

A self-hosted, offline-first web version of the RAADS-R (Ritvo Autism Asperger Diagnostic Scale, Revised) screening questionnaire. All 80 items with exact clinical wording, proper reverse scoring for normative items, and domain-level breakdowns with clinical thresholds.

## What It Does

80 questions across four subscales, scored using the published RAADS-R methodology:

- **Social Relatedness** (39 items, threshold >30)
- **Circumscribed Interests** (14 items, threshold >14)
- **Language** (7 items, threshold >3)
- **Sensory Motor** (20 items, threshold >15)
- **Total** (threshold >65, max 240)

Response options use the exact RAADS-R wording: "True now and when I was young", "True only now", "True only when I was younger than 16", "Never true". Normative items (17 of 80) are reverse-scored.

## Features

- Dark/light mode with system preference detection
- Fully offline, no backend, no tracking
- Optional localStorage persistence (opt-in only)
- Export results as JSON, CSV, or PDF
- Print-friendly results view with full response table
- Clinical interpretation text with threshold indicators
- Expandable scoring methodology explanation
- Keyboard accessible throughout
- Reduced motion support

## Disclaimer

This is not a diagnostic tool. Results should be discussed with a qualified healthcare professional who can provide a comprehensive assessment.

## Tech Stack

- Vite + React 18 + TypeScript
- Tailwind CSS v4
- Vitest (62 tests)

## Development

```bash
npm install
npm run dev       # Dev server on localhost:5173
npm run build     # Production build to dist/
npm run test      # Run all tests
```

## Privacy

All data stays in your browser. No cookies, no analytics, no external requests beyond serving the static files. The "Save Progress" feature uses localStorage and can be cleared at any time via the "Delete My Data" button.

## Scoring Validation

Two independent scoring engines (primary formula and lookup table) are cross-validated against each other in the test suite. Golden test vectors verify correct totals for all uniform response patterns (189, 51, 143, 97). Dataset structural tests confirm all 80 items are accounted for with no overlaps across domains.

## Licence

MIT
