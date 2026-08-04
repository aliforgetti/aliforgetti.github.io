# DECISIONS.md

Why the system is the way it is. Append-only — newest at the bottom.

`VAULT.md` says **what** the system is. This file says **why**, and what
was tried and rejected. Its job is to stop me (or an agent) re-proposing
something already settled.

---

## 2026-08-03 — Vault stays inside the Quartz fork

Considered splitting `content/` into its own repo, or dropping the
upstream remote entirely.

**Decision:** keep it. Quiet the noise instead — `.prettierignore`
excludes upstream `docs/` and `quartz/`, and the `upstream` remote stays
for Quartz upgrades.

**Why:** ~90% of the tidiness for a fraction of the moving parts. A
submodule or second repo would add a step to every publish and to mobile
sync.

---

## 2026-08-03 — Privacy: `private/` is the boundary, `publish:` is not

Found a documented-but-false claim: `private/README.md` said
`publish: false` meant "local only". It doesn't.

- `content/private/` is **gitignored** — never reaches GitHub
- `publish: false` **is committed and pushed** — it only hides from the site

**Decision:** secrecy comes from `private/`. `publish:` is editorial.
`./check` enforces the boundary mechanically.

**Why it matters:** the repo is public. A `publish: false` note is
readable by anyone on GitHub.

---

## 2026-08-03 — Three rules, arrived at by subtraction

Started with eight. Collapsed to three, then one, then two, then back to
three as each was tested against real cases.

Final: **I can follow it · I can fix it · Nothing is required that I
don't control.** See `VAULT.md`.

**The correction that mattered:** rule 1 was originally "could I rewrite
this in an hour?" — an *authorship* test. Wrong. I don't want to write
the scripts; I want to be able to read them. Ownership is comprehension,
not authorship.

**The second correction:** rule 3 first read as "no LLMs in routine
operation," which would have banned skills. Wrong distinction. The real
one is **dependency vs convenience** — if it vanished tomorrow and the
vault still publishes, it's a convenience and it's welcome.

---

## 2026-08-03 — Rooms: notes · threads · projects · library

**The test: am I asking, or telling?** Asking → `threads/`.
Telling → `notes/`.

**This one took four attempts. Do not redo it.**

1. `writing/` — original. "Writing" implies polish; a publish bar I kept tripping over
2. → `notes/` — lower bar, but "note" names the *medium*, not the kind. Every file here is a note
3. → `threads/` alone — collapsed everything into one concept. **Wrong.** A poem isn't circling anything, and an essay isn't a thread — it's a thread's *output*. The design admitted this itself, in a section explaining that standalone artifacts had no home
4. → `notes/` + `threads/` — the pair defines each other. Neither word works alone; together they're unambiguous

**Rejected: PARA and Zettelkasten.** PARA is folders-as-state — notes
move P→A→R→Archive, and every move breaks wikilinks and published URLs.
Zettelkasten demands atomic notes; the harness cluster is ~3,000 words
and would shred into 50 fragments. Both are optimized for problems this
vault doesn't have.

**Kept from each:** project hubs (PARA), dense linking and emergent
structure (Zettelkasten). Quartz gives the second for free.

---

## 2026-08-03 — Threads collect by backlink, never by hand

A thread never contains a list of links. Things link **to** it, and the
backlinks panel assembles the page.

**Why:** a hand-maintained list is a chore, and chores are what this
vault refuses to accumulate. Same reason `library/books/index.md` went
from three status-tables to one — moving a row between sections every
time a book changed status was a recurring task with no payoff.

**A note never needs a parent thread.** Optional, many-to-many. That
optionality was the actual bug in the earlier design.

---

## 2026-08-03 — One `check` script, no pre-commit hooks

**Rejected: git pre-commit hooks.** They fail mysteriously, don't
survive a fresh clone, and are opaque when they block you — rule 2.

**Decision:** one readable script at repo root, run manually and by
`autopublish.sh` before every push. Privacy tests only, for now.

**Deliberately not checked yet:** frontmatter schema, link integrity.
Four failure modes on day one is how you learn to ignore the alerts.
Add them when something actually breaks.

---

## 2026-08-03 — Skills are allowed, as conveniences

The `thread` skill exists for one reason a template can't cover:
**noticing the thread already exists.**

**The test any future skill must pass:** if it vanished, does something
still work? For `thread`, the answer is `templates/thread.md`. Yes.

Currently saved to the Claude account rather than `.claude/skills/` in
the repo, so it isn't version-controlled. Worth moving if that matters.

---

## 2026-08-03 — Mobile: capture on phone, process on desktop

Obsidian Sync carries the vault to the phone. Claude on the phone has
**no vault access**.

**Rejected for now: `obsidian-web-mcp`** (Cloudflare Tunnel + OAuth 2.0,
which would give real mobile file access). It passes rule 3 — it's a
convenience — but fails rule 2: when it breaks, it breaks inside a
tunnel or an OAuth flow, not in a file I can read. It also needs the Mac
awake with Obsidian running, which is the bigger problem.

**Decision:** phone captures into `private/inbox`. Desktop processes.
Capture must never be gated on anything.

**Revisit when:** most thoughts are actually arriving on the phone and
the paste step is the thing slowing me down.
