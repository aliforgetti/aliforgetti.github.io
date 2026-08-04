---
title: "context & memory architecture for coding agents"
date: 2026-07-28
status: growing
publish: true
tags:
  - learning
  - ai
  - software-engineering
  - harness-engineering
---

> [!note] Learning in progress
> Part of [[notes/the-harness/index|the harness]]. A component of [[notes/the-harness/harness-engineering|harness engineering]]. Bullet structure intentional.

*The feed-forward + persistent-state component of [[notes/the-harness/harness-engineering|harness engineering]].* Where the ladder asks **how formally you specify intent** (vibe → formal spec), this asks **how the agent stays grounded and remembers** across sessions - one component group of the harness, alongside its sensors and loop design.

No unified framework yet - better described as a **context and memory architecture**. Most of it is old practice renamed:

- onboarding docs → `CLAUDE.md` / `AGENTS.md`
- standard operating procedures → `SKILL.md`
- sprint plans → `PLAN.md`
- developer journals → `WORKLOG.md`
- architecture records → ADRs (unchanged)
- CI checks → hooks and agent guardrails
- project wikis → agent memory banks

## The eight patterns

### 1. `CLAUDE.md` as constitution / index

- What Claude should get on nearly every task: key commands, unusual conventions, testing requirements, architectural constraints, repo etiquette, critical gotchas
- Keep it **short and broadly applicable** - Anthropic warns bloated files make Claude ignore the important instructions
- Advanced move: make it an **index**, not the whole knowledge base - link out to `architecture.md`, `current-plan.md`, `decisions/`, relevant skills; keep only universal rules inline

### 2. `SKILL.md` as on-demand procedure

- A reusable playbook, loaded **only when relevant** (progressive disclosure): metadata says when to use it, body says how
- Lives in `.claude/skills/<name>/SKILL.md` (filename is singular)
- Good for detailed workflows, checklists, domain knowledge - things too heavy for `CLAUDE.md`
- Common skills: close/save session state, code review, debugging, create PR, run evals, update docs, plan a feature, security check, generate tests
- Mental model: `CLAUDE.md` = facts and standing instructions · `SKILL.md` = how to perform a repeatable task

### 3. `PLAN.md` / `STATE.md` / `WORKLOG.md` as working memory

- Answers: what are we doing now? what's done? what remains? which files? what should the next session do?
- Common names: `PLAN.md`, `TODO.md`, `WORKLOG.md`, `CURRENT.md`, `activeContext.md`, `progress.md`, `HANDOFF.md`
- Pattern: a `/close` or `/wrap` skill that summarizes done work, records unfinished work, lists touched files, records verification results, and writes the next-session prompt
- Cline's Memory Bank popularized the elaborate version (`projectbrief.md`, `systemPatterns.md`, `activeContext.md`, `progress.md`)

### 4. ADRs for decisions

- Architecture Decision Record: title, status, context, decision, alternatives considered, rationale, consequences
- Predates AI (Michael Nygard, 2011); agent users rediscovering them because they stop the agent re-proposing already-rejected alternatives
- Best long-term memory: preserves **why**, not just what changed

### 5. Daily logs + curated memory

- Separate raw history from durable knowledge: dated files (`memory/2026-07-28.md`) = episodic; `MEMORY.md` = distilled long-term
- Important lessons get periodically promoted from dated logs into the curated file
- Alternative: topic files that always hold current truth (`current-state.md`, `decisions.md`, `gotchas.md`) - simpler, but loses history (Git partly compensates)

### 6. Hooks for enforcement

- `CLAUDE.md` says what Claude *should* do (advisory); a hook *makes something happen* (deterministic)
- Use for: format after edits, run tests before completion, protect folders, require doc updates, block completion until lint passes
- Rule: anything that **must happen every time** belongs in tooling/tests/hooks, not prose

### 7. Subagents for context isolation

- Send focused work to separate agents (architecture investigator, implementer, tester, reviewer); each reads many files and returns a compressed result
- Keeps the main agent's working context clean - recommended for investigation and specialized tasks

### 8. External memory (MCP / DB / retrieval)

- Connect to SQLite, vector DBs, knowledge graphs, wikis, issue trackers, an MCP memory server → semantic retrieval ("what approaches already failed for this Spark issue?")
- Useful across large or multi-repo projects, but adds failure modes: stale info, stored-but-wrong conclusions, privacy, conflicting memories, complexity, unclear authority between code/docs/memory
- **For most projects, repo-owned Markdown + Git should come before a custom memory DB**

## Six kinds of project memory

| Memory type | What it contains | Good location |
|---|---|---|
| Policy | Rules that nearly always apply | `CLAUDE.md` / `AGENTS.md` |
| Procedural | How to perform recurring work | `SKILL.md` |
| Semantic | Architecture, domain, business logic | `docs/` |
| Working | Current task, progress, blockers, next step | `STATE.md` / `WORKLOG.md` |
| Decision | Choices, rationale, rejected alternatives | `docs/decisions/` |
| Episodic | What happened in individual sessions | dated logs / Git history |

Claude Code now also has built-in **auto memory** (`/memory` to inspect/edit). Treat automatic model memory as a **convenient cache, not the authoritative record** - decisions that matter should stay visible, version-controlled, and reviewable in the repo.

## Lineages (where the conventions came from)

- **Vendor instruction files** - Claude Code's `CLAUDE.md`, Cursor's `.cursor/rules`, Copilot's `.github/copilot-instructions.md`: same problem (models don't know local conventions)
- **Vendor-neutral `AGENTS.md`** - a tool-neutral "README for agents"; nearest file wins; stewarded via the Agentic AI / Linux Foundation ecosystem
- **Agent Skills** - Anthropic, Oct 2025, later an open standard; progressive disclosure
- **Cline Memory Bank** - structured multi-file project memory
- **Traditional eng docs** - ADRs, changelogs, runbooks, design docs, CI; the AI community is mostly reorganizing them into agent-loadable formats

A practical split: `AGENTS.md` = shared vendor-neutral instructions; `CLAUDE.md` = Claude-specific adapter that *imports* shared docs rather than duplicating them.

## A practical structure

```text
project/
├── AGENTS.md
├── CLAUDE.md
├── .claude/
│   └── skills/
│       ├── validate-training-data/SKILL.md
│       ├── evaluate-model/SKILL.md
│       └── close-session/SKILL.md
├── docs/
│   ├── architecture.md
│   ├── domain-glossary.md
│   ├── decisions/
│   │   ├── 0001-use-temporal-split.md
│   │   └── 0002-primary-metric-pr-auc.md
│   ├── current/
│   │   ├── PLAN.md
│   │   └── STATE.md
│   └── worklog/
│       ├── 2026-07-27.md
│       └── 2026-07-28.md
└── src/
```

Operating rules:

- **CLAUDE.md** - updated rarely; stable instructions only
- **SKILL.md** - updated when a reusable process improves
- **STATE.md** - overwritten as the project progresses
- **PLAN.md** - for the current substantial feature
- **ADR** - created only when an important decision is made
- **Worklog** - append-only raw history; archive/summarize periodically
- **Git** - the actual record of code changes

Don't use memory files to duplicate every changed file (Git already does that). Memory should preserve what Git does poorly: *why* a decision was made, what failed and why, what's unfinished, what's unexpectedly fragile, what the next agent must understand.

## The blind spot

- The community can turn this into **process cosplay**: 15 memory files, 8 agents, hundreds of rules, a giant planning ritual before changing two lines
- Anthropic: cut anything from `CLAUDE.md` that wouldn't prevent a real mistake. (One user cut a 787-line worklog to 136 once they saw it was disproportionate.)
- **Start with four things:** `CLAUDE.md` · one `STATE.md` · a `decisions/` folder · two or three genuinely reusable skills
- Add structure only after you repeatedly hit a specific failure it would prevent

## Sources

- [Anthropic: Best practices for Claude Code](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Anthropic: Equipping agents with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Claude Code - Skills](https://docs.anthropic.com/en/docs/claude-code/skills) | [Claude Code - Memory](https://docs.anthropic.com/en/docs/claude-code/memory)
- [AGENTS.md](https://agents.md/)
- [Architectural Decision Records (adr.github.io)](https://adr.github.io/)
- [Cline Memory Bank](https://www.mintlify.com/cline/cline/features/memory-bank)
- Reddit field notes: [worklogs for memory](https://www.reddit.com/r/ClaudeAI/comments/1qtw9nf/how_i_use_worklogs_to_give_claude_memory_across/) · [stop hooks + memory files](https://www.reddit.com/r/ClaudeAI/comments/1rqxzlp/two_claude_code_features_i_slept_on_that/) · [best skills thread](https://www.reddit.com/r/ClaudeAI/comments/1sx44bc/drop_your_best_claude_skills_in_here/)
