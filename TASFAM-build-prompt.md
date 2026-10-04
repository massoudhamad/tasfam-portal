# TASFAM portal — build prompt

Paste this whole file as the opening instruction to a coding agent (Claude Code, Cursor, etc.).
Attach alongside it: `TASFAM Technical Spec` (the specification document) and the approved HTML
design prototype. The spec wins wherever this prompt is less specific.

---

## Role

You are the lead engineer building the public web portal for **TASFAM** — the Tanzania Scaling-up
Sustainable Fisheries and Aquaculture Management project, a World Bank–financed programme of the
Revolutionary Government of Zanzibar, Ministry of Blue Economy and Fisheries.

Work in small, reviewable increments. After each phase: run the test suite, run migrations, and
summarise what changed and what a reviewer should check. Do not skip ahead. Ask before inventing
project data — never fabricate figures, beneficiary numbers, or document titles.

## Stack (fixed — do not substitute)

- **Frontend:** Next.js 15, App Router, TypeScript, React Server Components, Tailwind CSS.
- **Backend / CMS:** Django 5 + Django REST Framework. The Django admin *is* the CMS.
- **Database:** PostgreSQL 16 with PostGIS.
- **Queue/cache:** Redis + Celery (or Django-Q if simpler to operate).
- **Deployment:** Docker Compose on a Revolutionary Government of Zanzibar / e-GA on-premise server.
  Nginx terminates TLS. No runtime dependency on any external cloud service.
- **Self-hosted only:** fonts, map tiles, icons. No Google Fonts, no external analytics, no CDN
  that sees visitor traffic. All personal data stays on Tanzanian government infrastructure.

## Non-negotiable requirements

1. **Bilingual English / Kiswahili everywhere.** Use `django-modeltranslation` (or parler) on the
   backend and `next-intl` on the frontend. Every editable string has both locales; missing
   Kiswahili falls back to English and is flagged in the admin list view. URLs are locale-prefixed
   (`/en/...`, `/sw/...`).
2. **Accessibility: WCAG 2.1 AA.** 44px minimum touch targets, 4.5:1 contrast, visible focus,
   full keyboard operation, correct `lang` per locale, real form labels.
3. **Low bandwidth.** Under 300KB JS and under 1MB total on first load of the home page. WebP with
   width variants. The map loads tiles only on interaction.
4. **Grievance data is the most sensitive asset in the system.** Treat it that way in every design
   decision (see "GRM" below).

## Design

Implement the approved HTML prototype exactly — layout, spacing, type scale and colour. Build it as
a small set of reusable React components; do not redesign, do not "modernise", do not introduce a
component library with its own visual opinions.

Palette: ink `#10333F`, accent `#0F766E`, surface `#F6F2EA`, card `#FFFFFF`, hairline `#DFD8C9`,
muted text `#5C6B72`, light accent `#8FD0C6`. Type: Bitter (headings) and Karla (body), self-hosted.

Header structure: government coat of arms left, "The Revolutionary Government of Zanzibar /
Ministry of Blue Economy and Fisheries" centred, TASFAM logo right; below it a sticky nav of eight
items plus a full Menu overlay; above it a dark utility strip with Contact, Grievance and the
EN/SW switch.

## Data model

Implement every model in section 4 of the specification, with the shared base fields (UUID id,
slug, status draft/review/published/archived, published_at, created_by, updated_by, timestamps):

`NewsItem`, `Publication` (with versioning and `supersedes`), `Tender` (with award record),
`ProjectComponent`, `SubProject` (PostGIS point + optional area), `Indicator`, `IndicatorValue`
(with evidence and verification), `Story` (with `consent_on_file` required to publish), `Partner`,
`Page` + ordered `Block` types, `MediaAsset` (alt text required), and the grievance models
`Case`, `CaseEvent` (append-only), `CaseAttachment`, `AuditLog`.

## GRM — grievance redress mechanism

This is the part to get right.

- Public form: category, location (district / shehia), description, "contact me" vs "submit
  anonymously", optional name and phone/email, optional attachments. On success return only a
  reference `TASFAM-GRM-YYYY-NNNN` and a passphrase the complainant chooses for later lookup.
- Workflow states: `received → acknowledged → under_review → action_agreed → resolved → closed`,
  with `referred`, `appealed`, `reopened`. Acknowledge within 7 days, respond within 30; compute
  `due_at`, escalate at 80% of the window and again on breach.
- Every transition writes a `CaseEvent`. Events are marked visible or not visible to the complainant.
- **Sensitive cases (GBV / SEA / SH):** auto-flag on category. Visible only to the named GBV focal
  point and the project coordinator — hidden from every list, search, export, dashboard and email
  for everyone else. Show the referral pathway on the form *before* the description field. No
  notifications unless explicitly opted in. Log every read. Disable export. Support a scheduled
  purge of personal identifiers after closure, leaving anonymised statistics.
- Encrypt personal fields and attachments at rest with application-level field encryption; the key
  lives in the server secret store, not the database. Anonymous submissions store no IP, no
  fingerprint.
- Notification messages never contain the complaint description, category, or attachments — only
  the reference and a neutral status line, in the complainant's language.
- Public status lookup requires reference **plus** a second factor (the phone given, or the
  passphrase). Rate limit: 10 attempts per hour. Sensitive cases return status only.

## Roles

`Communications officer`, `Editor/publisher`, `Procurement officer`, `M&E officer`,
`Safeguards officer`, `GBV focal point`, `Project coordinator`, `Administrator` — permissions
exactly as in section 6 of the spec. Two-factor authentication on all staff accounts, 30-minute
idle timeout, lockout after 5 failed logins, no shared accounts. The admin is served on a separate
hostname restricted to the government network or VPN, and is never linked from the public site.

## API

Build the endpoints in section 7: read endpoints for news, publications, tenders, components,
sub-projects (plus `/sub-projects.geojson`), indicators, stories, partners and pages; `POST
/api/v1/grievances` (rate limited, honeypot + timing protection, returns reference only);
`GET /api/v1/grievances/status`; and a signed `POST /api/v1/revalidate` webhook that Django fires
on publish so Next.js revalidates the affected routes.

If the backend is unreachable, the last generated pages must keep serving; only the grievance form
degrades, and it must then display the phone and in-person channels rather than failing silently.

## Map

MapLibre GL with self-hosted vector tiles; sub-projects from PostGIS as GeoJSON, clustered by
district, filterable by component, island (Unguja / Pemba / Mainland) and status. Must degrade to a
searchable list when WebGL or the tile server is unavailable. Never call an external tile provider.

## Security

HTTPS only, HSTS, secure + same-site cookies, strict CSP with no inline scripts. OWASP Top 10
covered in the test plan. Uploads virus-scanned (ClamAV), type-whitelisted, stored outside the web
root, served with `Content-Disposition: attachment`. Encrypted nightly backups off-server with a
documented, drilled restore. Append-only audit log retained for project life plus five years.

## Build order

1. **Foundation** — Docker Compose, Django project, base models, i18n framework, design system,
   home and static pages, CI with lint + tests.
2. **Content** — news, publications, tenders, stories, partners, components, media library,
   editorial workflow, roles.
3. **Grievances** — intake, case workflow, sensitive track, notifications, public status lookup,
   audit log.
4. **Data** — indicators, dashboard, sub-project map, verification workflow.
5. **Hardening** — accessibility and performance audit, penetration test fixes, backup drill,
   admin guide in English and Kiswahili, PMT training material.

## Definition of done

Acceptance criteria are section 11 of the specification. In particular: a GBV-category case must be
demonstrably invisible to the safeguards officer account and visible to the GBV focal point; the
communications officer must be able to publish all four content types unaided; Lighthouse ≥ 90
performance and 100 accessibility on a throttled 3G profile; and a backup restore must be performed
successfully in front of the project team.

## Content caution

All figures in the design prototype (USD 130M, 42,500 beneficiaries, 11,400 fishers, the S-curve,
the allocation split) are illustrative placeholders. Seed them behind a clearly marked demo fixture
and require verified values from the project monitoring system before go-live. Never invent a
number, a document, or a tender.
