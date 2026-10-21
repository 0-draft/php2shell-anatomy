# php2shell-anatomy

[![CI](https://github.com/0-draft/php2shell-anatomy/actions/workflows/ci.yml/badge.svg)](https://github.com/0-draft/php2shell-anatomy/actions/workflows/ci.yml)
[![Deploy](https://github.com/0-draft/php2shell-anatomy/actions/workflows/deploy.yml/badge.svg)](https://github.com/0-draft/php2shell-anatomy/actions/workflows/deploy.yml)
![CVSS 9.2](https://img.shields.io/badge/CVSS-9.2_critical-ff6b3d)
![Astro](https://img.shields.io/badge/built_with-Astro-bc52ee)

A defensive awareness page that dissects the **php2shell** PHP zero-day (**CVE-2026-109618** / **CVE-2026-109619**): why it is critical, who is affected, and how to patch in time.

**Live:** <https://0-draft.github.io/php2shell-anatomy/>

It is built for defenders. There is **no exploit code, no payloads, and no reproduction steps**, by design. The mechanism is explained only at a high level, enough to inform defence without handing anyone a weapon.

## What it covers

- A live countdown to the 2026-10-21 14:00 UTC security release.
- Why a core PHP flaw is different from an ordinary web shell.
- How it works, in plain terms (no recipe).
- An interactive exposure check (PHP branch × edge filtering).
- The disclosure timeline and the affected-version blast radius.
- Patch / filter / upgrade guidance, and the common myths that do not help.

Bilingual (English default, Japanese toggle).

## Tech stack

- [Astro](https://astro.build/) static site + TypeScript (strict).
- Hand-written CSS, a deliberate forensic-console visual identity.
- [Vitest](https://vitest.dev/) unit tests + [Playwright](https://playwright.dev/) end-to-end tests.
- ESLint + Prettier, GitHub Actions CI, Dependabot.
- Sitemap, robots.txt, and an Open Graph share image.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # static build to dist/
npm run preview    # serve the build
```

## Quality gates

```bash
npm run lint       # ESLint + Prettier
npm run check      # astro check (TypeScript)
npm run test:unit  # Vitest
npm run test:e2e   # Playwright (builds + previews first)
```

## Sources

Technical claims are drawn from public reporting and may change once PHP publishes its official advisory. Verify against [php.net](https://www.php.net/) before acting.

- The Hacker News: php2shell: what actually protects you
- SecurityWeek: mass exploitation looms for leaked PHP flaws
- CERT-EU: Security Advisory 2026-018
- CISA: Known Exploited Vulnerabilities catalog

## License

[MIT](LICENSE)

---

kt (<https://github.com/kanywst>)
