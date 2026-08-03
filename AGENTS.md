# AGENTS.md

Read [VAULT.md](./VAULT.md). It is the single source of truth for how
this repo works — rules, structure, privacy boundary, and what has been
deliberately left unbuilt.

Two things that matter most:

- **Never** let a published note reference anything in `content/private/`.
  Run `./check` before suggesting a publish.
- **Never** edit `docs/` or `quartz/` — those are upstream Quartz, not mine.
