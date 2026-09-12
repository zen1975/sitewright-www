# Dogfooding record — first official update

Date: 2026-09-12
Site: https://cos-site.hack-higashimae.workers.dev

## Request

> Announce that this site is now operated by the software it documents.

Written as a command file by hand for this first run. Subsequent updates go through
the ChatGPT operator path.

## Command

```
commands/2026/09/launch.json
commandId  cos-site-launch-001
command    create_news
target     example-site
```

## Dispatch

```
validate   contract check: 1/1 valid
dry-run    {"success":true,"dryRun":true}
dispatch   {"success":true,"contentId":"74a84412-478a-4c4c-ace4-2aa35d4642cc",
            "url":"/news/operated-by-itself/","status":"published"}
```

## Live URL

https://cos-site.hack-higashimae.workers.dev/news/operated-by-itself/

## Completion triplet

| Condition | Result |
|---|---|
| dispatch is correct | `success:true`, returned the URL and content id |
| live state is correct | that URL returns 200, h1 and body match what was submitted; the card appears on the home page and in `/news/` |
| the report is correct | the URL the dispatch returned is the URL that renders |

`state/` was written back: 1 item, 1 body file, committed.

## Issues found

None in the dispatch path.

One pre-existing condition was confirmed rather than discovered: `npm run verify`
reports 67/68 in this fork because `release-hygiene` forbids the marker `zen1975`
in tracked files, and the official site has to reference the canonical repository
URL. Recorded as `ops/dogfooding/UPSTREAM_CANDIDATES.md` UC-001.

## Upstream candidates

- **UC-001** — `release-hygiene` still treats the upstream owner as private. The rule
  predates publication. See `UPSTREAM_CANDIDATES.md`.

Nothing else. The runtime, schemas and migrations were not touched by this fork.
