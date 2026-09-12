# Upstream candidates found in the official site fork

Observations here follow the flow in `docs/FORK_AND_UPSTREAM.md`:

```
LP fork observation → generalization → upstream candidate
→ canonical implementation → clean validation → release → this fork pulls
```

Nothing in this file is fixed here. It is fixed upstream and consumed back.

---

## UC-001 — `release-hygiene` still treats the upstream owner as private

**Observed** 2026-09-12, while setting up this fork.

`npm run verify` fails one check:

```
no tracked file carries private-upstream or operator identifiers
  config/site-profile.json: /\bzen1975\b/
```

`tests/release-hygiene.test.mjs` forbids the marker `zen1975` in any tracked file.
That rule was written while the upstream repository was **private**, where leaking the
owner's handle into a distributed artifact was a real concern.

The repository is public as of 2026-09-12. The canonical repository URL is now
something every installation is expected to reference — the README links to it, and any
fork that points back at upstream has to name it somewhere.

**Why this fork trips it**: the official site links to the canonical repository. The URL
lives in `config/site-profile.json` under `officialSite.repositoryUrl`, which is one of
the four files a fork is expected to override.

**Generalized statement of the problem**: the hygiene test conflates two different
things — *the private upstream's identity* (must not leak) and *the public project's
canonical URL* (must be referenceable).

**Proposed upstream change**: drop `zen1975` from the marker list, or narrow it to
patterns that indicate a private path rather than a public URL (`/Users/`,
`hack-sub`, private repository names). The other markers stay.

**Status**: not yet proposed upstream. Until it is, this fork carries one known
verify failure, and that is recorded rather than silenced. Do not weaken the test
in this fork.

---

## Known divergences that are *not* upstream candidates

These are site-specific and correctly live only here (`docs/FORK_AND_UPSTREAM.md` §13.1).

| File | Why |
|---|---|
| `src/pages/index.astro` | the official landing page |
| `src/components/SiteHeader.astro`, `SiteFooter.astro` | official navigation and footer |
| `src/styles/global.css` (`.lp-*` rules) | layout only, appended; no runtime behaviour |
| `config/site-profile.json` | site identity and the canonical repository URL |
| removed `src/pages/{about,services,contact}.astro` | reference-site mock pages, not part of the official site |

`site.id` is deliberately left as `example-site`: the shipped example commands target it,
and changing it breaks them (recorded upstream as F-002).
