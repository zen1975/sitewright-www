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
fell one check short in this fork, because the hygiene rules would not let a
distributed file name the canonical repository the official site links to.
Recorded as `ops/dogfooding/UPSTREAM_CANDIDATES.md` UC-001, and fixed upstream
in zen1975/sitewright#23 on the same day.

## Upstream candidates

- **UC-001** — a distributed file could not name the project's own canonical
  repository. The rule predates publication. Sent and merged the same day.
  See `UPSTREAM_CANDIDATES.md`.

Nothing else. The runtime, schemas and migrations were not touched by this fork.
