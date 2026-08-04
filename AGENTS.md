# AGENTS.md

Read **[VAULT.md](./VAULT.md)** — what this system is, and the three
rules any change must pass.

Read **[DECISIONS.md](./DECISIONS.md)** before proposing structural
changes. It records what was already tried and rejected, and why. The
room layout in particular took four attempts; don't restart it.

Three things that matter most:

- **Never** let a published note reference anything in `content/private/`.
  Run `./check` before suggesting a publish — it's the privacy gate.
- **Never** edit `docs/` or `quartz/` — those are upstream Quartz, not his.
- **Never** `git commit`. `scripts/autopublish.sh` does that every 30
  minutes, with `./check` as a gate.

Ali has ADHD. Short bullets, no long paragraphs. Plan before building.
