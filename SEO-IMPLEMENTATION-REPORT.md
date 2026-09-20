# Technical SEO Implementation Report — BOTech (botech-live.com)

Date: 2026-09-20
Domain: https://botech-live.com/
Stack: React 18 (Vite) + react-router-dom v6 SPA, hosted on GitHub Pages (custom domain, Cloudflare-proxied), deployed automatically from the `main` branch.

---

## 1. Summary

A full technical-SEO pass was implemented and deployed, covering titles/descriptions,
canonical integrity, structured data (JSON-LD), social sharing, indexability of every
public route (including fixing GitHub Pages soft-404s), robots.txt/sitemap correctness,
heading structure, favicon/PWA metadata, and optional Google Analytics 4 readiness.

Deployments verified successfully in CI (GitHub Actions "Deploy to GitHub Pages") and all
results below were re-tested against the live site.

---

## 2. Files Created

| File | Purpose |
| --- | --- |
| `public/og-image.png` (1200×630) | Branded social share image (gradient + logo + site name), generated from `public/Logo.png` |
| `public/icons/icon-192.png`, `public/icons/icon-512.png` | PWA manifest icons |
| `public/apple-touch-icon.png` (180×180) | iOS home-screen icon |
| `public/site.webmanifest` | Web App Manifest (name BOTech, theme #375378, start_url `/`) |
| `src/config/structured-data.ts` | JSON-LD builders: Organization, WebSite, BreadcrumbList, SoftwareApplication, FAQPage |
| `src/components/ui/JsonLd.tsx` | `<JsonLd data>` component that injects `application/ld+json` via Helmet |
| `src/hooks/usePageTracking.ts` | Sends a GA4 `config` (page_view) on client-side route changes so SPA navigations are tracked without adding a second tag (the Google tag itself lives statically in `index.html`) |
| `.github/workflows/deploy.yml` | Mirrored exactly from upstream (deploy to GitHub Pages on push to main/master) |

## 3. Files Modified

| File | Change |
| --- | --- |
| `index.html` | New title/description ("BOTech | Blue Orbit Technologies – حلول تقنية عملية"), og-image 1200×630 + alt, removed fake `/en` hreflang links, added manifest/apple-touch/application-name metadata, added the Google tag (gtag.js) for GA4 `G-E5FC17M9RR` (AdSense script + `google-adsense-account` kept) |
| `public/robots.txt` | Removed `Disallow: /*.xml$` (blocked `/sitemap.xml`), `/*.json$`, `Crawl-delay`; kept only `Allow: /` + `Disallow: /admin/` + Sitemap line |
| `public/sitemap.xml` | Rewritten: 9 public routes only (no `/en/*`), `lastmod` 2026-09-20, sane priorities/changefreqs |
| `src/config/site.ts` | `ogImage: '/Logo.png'` → `'/og-image.png'` |
| `src/config/seo.ts` | Rewritten titles/descriptions (BOTech branding, bilingual); **fixed all English canonicals** from `/en/*` (which 301-redirect) to the actual clean paths (e.g. `/en/about` → `/about`) |
| `src/components/layout/Layout.tsx` | Fixed og-image double-domain bug (absolute URLs like `https://botech-live.com/assets/…` were being prefixed with the site URL a second time); removed fake `/en` hreflang alternates (English is served at the same clean URLs, so alternates were false); added `og:image:alt`, `og:locale:alternate`, global Organization + WebSite JSON-LD, and `usePageTracking()` |
| `src/pages/*.tsx` (11 public pages) | Removed duplicate per-page `<Helmet>` og/twitter tags (Layout is now the single source of truth); added breadcrumb JSON-LD; added structured data per page (below) |
| `vite.config.ts` | Build now emits a real `index.html` shell under each public route (`/<route>/index.html`) so GitHub Pages responds **HTTP 200** instead of a 404-status soft-404; `404.html` fallback retained for genuinely unknown paths |

## 4. Indexable Routes (all return 200 after redirect)

`/`, `/about`, `/services`, `/products`, `/work`, `/contact`, `/privacy`, `/terms`, `/raseed`, `/clover`.
Non-indexable by design: `/delete-account` (noindex), `/admin/*` (auth + 404), 404 page (noindex).

## 5. Sitemap & Robots

- Sitemap: `https://botech-live.com/sitemap.xml`
- robots.txt: `https://botech-live.com/robots.txt`

## 6. Structured Data (JSON-LD)

- **Global (every page, via Layout):** `Organization` (`@id https://botech-live.com/#organization`, founder, contact) + `WebSite` (publisher ref).
- **BreadcrumbList:** `/about`, `/services`, `/products`, `/work`, `/contact`, `/privacy`, `/terms`, `/raseed`, `/clover`.
- **SoftwareApplication** (Raseed — BusinessApplication, Android, offers 1200 SYP) and (Clover Flow — coming soon, no offers).
- **FAQPage** (Raseed) — built from the app's real FAQ translations (8 Q&A, auto-switches language).

## 7. Canonical Strategy / hreflang

- One canonical per page, always the clean URL (`https://botech-live.com/<path>`), **no language-prefixed URLs** because `/en/*` redirects and English is served at the same paths.
- Removed fictional `hreflang` alternate links; kept dynamic `lang`/`dir` + `og:locale`/`og:locale:alternate`.

## 8. Social / Head

- OG + Twitter tags on every page with `og:image` defaulting to `/og-image.png`; Raseed/Clover keep their product logos.
- Unique title/description per page; correct single `<h1>` now exists on every public page (added `sr-only` `<h1>` to Services, Work, Products, Contact, Privacy, Terms).

## 9. Local Verification (pre-deploy)

`npm run typecheck` ✓ · `npm run lint` (0 warnings) ✓ · `npm run build` ✓

## 10. Live Verification (post-deploy)

| Check | Result |
| --- | --- |
| GH Actions deploy for `48019fb` | `success` |
| Public routes (raw / followed) | `/` 200 · all others 301 → `/…/` → **200** · `/admin`, `/nonexistent-page` 404 |
| `/robots.txt` | 200 · `/sitemap.xml` 200 · `/site.webmanifest` 200 |
| `/og-image.png`, `/apple-touch-icon.png`, `/icons/icon-192.png`, `/icons/icon-512.png` | 200 |
| Served head (`/`) | new title, og:image 1200×630 + alt, no `/en` hreflang |
| Google tag (GA4) in served head | `G-E5FC17M9RR` present once on `/` and `/about` (all page shells share it) |
| JSON-LD / og tags present in built bundle | confirmed (BreadcrumbList, FAQPage, SoftwareApplication, og:image:alt in `index-*.js`) |

## 11. Remaining Manual Steps (outside repo control — require your action)

1. **Google Search Console (Search Console)** — verify `https://botech-live.com/` (HTML tag or DNS method), submit `/sitemap.xml`, and check "Page indexing" for the URL set above. *No GSC/Search-console submission or indexing happened automatically — that remains manual.*
2. **Google Analytics 4** — ✅ **Done**: the Google tag (`G-E5FC17M9RR`) is hard-coded in `index.html` (one tag per page) and SPA route changes are tracked via `usePageTracking`. Confirm in GA4 → Realtime that visits appear; no further code changes needed.
3. **AdSense** — script/meta `ca-pub-9476426554530100` and `ads.txt` are live; site approval remains with Google's review.

## 12. Known Limitations / Notes

- GitHub Pages 301-redirects clean paths to a trailing slash (`/about` → `/about/`); JavaScript routing still works and CSS/JS are unaffected. Canonicals are intentionally canonical (they resolve via the redirect).
- `og:image` / JSON-LD are injected client-side by React (client-side-rendered SPA); crawlers that execute JavaScript will see them. For the homepage the static `index.html` head already carries the full metadata.
- The previous deployment returned HTTP **404 status** for all deep routes (GitHub Pages soft-404); this was pre-existing infrastructure behavior and has now been fixed with the per-route shells.
- `vite preview`/local dev are unaffected by the route-shell build step.