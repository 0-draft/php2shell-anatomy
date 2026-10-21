# Contributing

Thanks for helping keep this awareness page accurate and useful.

## Ground rule

This is a **defensive** resource. Do not add exploit code, working payloads, or step-by-step reproduction for php2shell or anything else. The mechanism is explained at a high level on purpose. Pull requests that add offensive tooling will be declined.

## Develop

```bash
npm install
npm run dev
```

## Before you open a PR

Run the full gate and make sure it is green:

```bash
npm run lint       # ESLint + Prettier
npm run check      # astro check (TypeScript)
npm run test:unit  # Vitest
npm run build      # static build
npm run test:e2e   # Playwright (builds + previews first)
```

## Content accuracy

Technical claims are sourced from public reporting and may change once PHP publishes its official advisory. If you update a fact (affected versions, patch numbers, root cause), cite the source in the PR description and prefer [php.net](https://www.php.net/) over secondary coverage.

## Style

- Bilingual copy lives in `src/i18n.ts` (English + Japanese). Keep both in sync.
- No em dashes in copy.
- Match the existing dark, forensic-console visual language; do not introduce a second accent color.
