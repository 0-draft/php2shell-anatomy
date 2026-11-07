# php2shell-anatomy

[![CI](https://github.com/0-draft/php2shell-anatomy/actions/workflows/ci.yml/badge.svg)](https://github.com/0-draft/php2shell-anatomy/actions/workflows/ci.yml)
[![Deploy](https://github.com/0-draft/php2shell-anatomy/actions/workflows/deploy.yml/badge.svg)](https://github.com/0-draft/php2shell-anatomy/actions/workflows/deploy.yml)
![CVSS 9.2](https://img.shields.io/badge/CVSS-9.2_critical-ff6b3d)
![Astro](https://img.shields.io/badge/built_with-Astro-bc52ee)

A defensive awareness page that dissects the **php2shell** PHP zero-day (**CVE-2026-109618** / **CVE-2026-109619**): why it is critical, who is affected, and how to patch in time.

**Live:** <https://0-draft.github.io/php2shell-anatomy/>

It is built for defenders. There is **no exploit code, no payloads, and no reproduction steps**, by design. The mechanism is explained only at a high level, enough to inform defence without handing anyone a weapon.

## What it covers

- Patch status: fixed versions per branch, CISA KEV listing, and distro package versions.
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

Last checked 2026-11-07. Technical claims follow PHP's own advisories where they exist; verify against [php.net](https://www.php.net/) and your OS vendor before acting.

- PHP: [2026 release announcements](https://www.php.net/archive/2026.php), [GHSA-w8hw-w9fx-j79w](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w) (CVE-2026-109618), [GHSA-6wmf-4rv5-p3rp](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp) (CVE-2026-109619)
- CISA: [Known Exploited Vulnerabilities catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) (both CVEs added 2026-10-26)
- CERT-EU: [Security Advisory 2026-018](https://cert.europa.eu/publications/security-advisories/2026-018/)
- Distro trackers: [Debian](https://security-tracker.debian.org/tracker/CVE-2026-109618), [Ubuntu](https://ubuntu.com/security/CVE-2026-109618), [Red Hat RHSB-2026-013](https://access.redhat.com/security/vulnerabilities/RHSB-2026-013), [AlmaLinux](https://almalinux.org/blog/2026-10-21-php2shell-cve-2026-109618-cve-2026-109619/), [Alpine](https://security.alpinelinux.org/vuln/CVE-2026-109618)
- Vendor research: [Cloudflare](https://blog.cloudflare.com/php-vulnerabilities-waf-protection), [Sansec](https://sansec.io/research/php2shell)

## License

[MIT](LICENSE)

---

kt (<https://github.com/kanywst>)
