# Upstream candidates found in the official site fork

Observations here follow the flow in `docs/FORK_AND_UPSTREAM.md`:

```
LP fork observation → generalization → upstream candidate
→ canonical implementation → clean validation → release → this fork pulls
```

Nothing in this file is fixed here. It is fixed upstream and consumed back.

---

## UC-001 — the distribution could not name its own repository (sent, merged)

**Observed** 2026-09-12, while setting up this fork. `npm run verify` failed the
check `no tracked file carries private-upstream or operator identifiers`, naming
`config/site-profile.json` — the file that holds the canonical repository URL the
official site links to.

**Cause:** the check forbade the upstream owner's handle in any tracked file. That
rule was written while the upstream repository was private, where the handle was
itself the thing being protected. Once the repository went public the rule was
conflating two different things: the private upstream's identity, which must not
leak, and the public project's canonical URL, which every installation is expected
to reference.

**Sent upstream:** zen1975/sitewright#23. The handle is now permitted only inside
the canonical repository URL. A bare mention, a local path, or a link to another
repository owned by the same account still fails. Verified by four cases, including
the two that must still fail.

**Follow-up:** the first fix permitted the handle only inside the full https URL,
which still rejected `owner/repo#123` — the form these very records use to cite an
upstream pull request. Narrowed to the repository slug in zen1975/sitewright#24.

**Confirmed here:** `config/site-profile.json` and these records all pass after
pulling both fixes. This fork is now down to **one** verify failure, the structural
one below.

**Aftermath:** it also turned out that main had gone red on this rule the moment an
issue-template config carried the security-advisories URL — the same defect, reached
from the canonical side instead of the fork side, two hours later.

---

## UC-002 — pages built from page sections had nowhere to render

**Observed** 2026-09-12, while trying to make the landing page editable through the
operator path.

The page-composition commands wrote to `pages` and `page_sections`, and
`loadPageCompositionBySlug()` read them back, but nothing rendered the result.
`create_page` succeeded and every URL an operator would report was a 404.

**Status**: fixed upstream in #16 and consumed here. Same shape as Section 12.0 —
a write path shipped without a matching read path.

---

## Known verify failures in this fork

`npm run verify` is **66/68** here. Both failures are structural, not defects, and both
are recorded rather than silenced. Do not weaken these tests in the fork.

### `no tracked file carries private-upstream or operator identifiers`

UC-001 above. The official site has to link to the canonical repository.

### `production identifiers are not committed as configuration`

`wrangler.jsonc` carries the real D1 database id, KV namespace id and R2 bucket name
for the official site. Canonical requires placeholders so that a clean clone cannot
accidentally point at someone else's infrastructure.

**This fork is an installation, not a distribution.** Its `wrangler.jsonc` is the
deployment configuration of one running site, which is exactly one of the four files
a fork is expected to override. The test is right about the canonical repository and
does not apply to a deployed fork.

This is *not* an upstream candidate: canonical should keep the check as it is.

---

## UC-004 — a composed page could not have in-page links (sent, merged)

**Found:** the landing page's own navigation. `/#how`, `/#proof` and `/#roadmap`
were all dead. Nothing caught it: the anchors are valid HTML and the targets
simply did not exist.

**Cause:** `TrustedPageModule.astro` emitted no `id` on its section elements.
Two module types carried one for `aria-labelledby`; the other ten carried none.
The section id is already author-controlled — `insert_page_section` accepts an
explicit `sectionId` — so only the renderer had to change.

**Sent upstream:** zen1975/sitewright#20. A release-hygiene check now fails if
any `<section>` in the module renderer stops emitting `id={section.id}`.

---

## UC-005 — insert_page_section failed anywhere but the end of a page (sent, merged)

**Found:** immediately after UC-004, while re-creating three sections with the
ids `how`, `proof` and `roadmap`. `roadmap` (position 8, the end) succeeded.
`proof` (position 5) failed with
`D1_ERROR: UNIQUE constraint failed: page_sections.page_id, position`,
leaving the page with the section missing.

**Cause:** renumbering gave the new section and the section it displaces the
same position, then broke the tie alphabetically by id. When the new id sorted
after the displaced one the new section was renumbered past it, while the
INSERT still wrote the requested position — which the unique index rejected.

**Sent upstream:** zen1975/sitewright#21. The ordering is now a pure function
with a regression test over every insertion point and the id orderings that
triggered the failure.

**Note:** UC-004 was hiding UC-005, the same way UC-002 hid UC-003. Each fix
made the next defect reachable. This is the third time on this page.

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
