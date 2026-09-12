# Dogfooding record — the landing page became editable

Date: 2026-09-12
Site: https://sitewright.data-range.com

## Why

The official site claimed that clients can update a website by asking, while its own
landing page could only be changed by editing `src/pages/index.astro` and pushing.
The Updates list was operable; the eight sections a visitor actually reads were not.

That is the gap this record closes.

## What blocked it

Pages built from page sections had nowhere to render. The commands wrote to `pages`
and `page_sections`, `loadPageCompositionBySlug()` read them back, and no route used
either. Recorded as UC-002 and fixed upstream in #16, then consumed here.

## What was done

| Step | Result |
|---|---|
| `create_page` with 9 section seeds | `pageId 14eed45e…`, version 1 |
| `src/pages/index.astro` now fetches and renders that composition | 8 sections plus the Updates list |
| `update_page_section` on the hero | version 1 → 2, section version 1 → 2 |

Three payload corrections were needed on the way, each a registry constraint rather
than a defect:

- `templateProfile` must be one of the registered page templates (`landing-default`),
  not a content template profile
- `cardGrid` and `cta` accept their own variant sets (`feature`, `primary`), not
  `standard`
- `cta` props are `title` / `body` / `primaryCta`, not `heading` / `cta`

## Live result

```
h1        "Websites your clients update by asking."   (edited through a command)
sections  9 rendered, data-page-version="2"
faq       5 entries, including the non-affiliation answer
stats     4 / 35 / 68 / 30
```

## Completion triplet

| Condition | Result |
|---|---|
| dispatch is correct | `success:true`, returned pageId, sectionId, version 2, sectionVersion 2 |
| live state is correct | the new headline renders; the other eight sections are untouched |
| the report is correct | the version the dispatch reported matches `data-page-version` in the page and `state/page-index.json` |

## What this means

Every sentence on the official landing page can now be changed by the same path a
client uses. The claim the site makes is true of the site.

## Upstream candidates

None new. UC-002 was the only one and it is already upstream.
