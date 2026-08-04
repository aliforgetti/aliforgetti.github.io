---
title: "harness engineering"
date: 2026-07-28
status: in-progress
publish: true
tags:
  - learning
  - ai
  - software-engineering
  - harness-engineering
aliases:
  - writing/keeping-the-robots-honest/harness-engineering
---

> [!note] Learning in progress
> Part of [[notes/keeping-the-robots-honest/index|keeping the robots honest]]. The spine of the cluster: every philosophy plugs into one of its components. Bullet structure intentional.

*Engineer the environment, not the prompt.* A **harness** is the controlled environment an agent runs in: **guides** (feed-forward), **sensors** (feedback), and a **loop** (orchestration) that ties them together. Everything else in this cluster is a bet on one of those three.

## why we need it

- Models are capable but unreliable: they hallucinate, drift, forget across sessions, and produce plausible-but-wrong code with full confidence.
- Prompting alone has diminishing returns. In professional work the bottleneck is not phrasing; it's preventing and catching errors.
- The environment is the real lever: good context up front plus fast automatic checks raise the quality floor far more than a cleverer prompt.
- It converts "hope it works" into "the system catches it when it doesn't": determinism where you can, human judgment where you must.
- It is what lets you delegate more without losing control: you supervise the system, not every keystroke.
- Evidence: OpenAI built ~1M lines leaning on the harness; Fowler & Böckeler argue harness quality beats prompting skill for professional work ([Fowler](https://martinfowler.com/articles/harness-engineering.html), [OpenAI](https://openai.com/index/harness-engineering/)).

## the three components

Vibe coding bets on none of these (just eyeball the output). Formal spec bets on two at once (its spec is a guide, its verifier is a sensor). Most philosophies pick one.

### Guides · feed-forward

**Purpose: prevention.** Give the agent intent, conventions, architecture, examples, and memory so it does not have to guess. Lowers the error rate before it writes a line.

- **Plugs in here:** pseudocode, light spec, SPDD, spec-driven, rules files, and the *spec* half of formal spec
- **Deep dive:** [[notes/keeping-the-robots-honest/agent-memory-architecture|context & memory architecture]] is the persistent-state slice of guides (CLAUDE.md, specs, ADRs, worklogs)
- The discipline of choosing *what* to feed and *when* is [context engineering](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html); the failure mode is a bloated guide that rots and crowds out the task

### Sensors · feedback

**Purpose: detection and self-correction.** Catch errors after the agent acts, automatically and fast, and feed failures back so it repairs itself.

- **Plugs in here:** tests and contracts, lint and types, evals, and the *proof* half of formal spec
- **Two kinds** ([sensors for coding agents](https://martinfowler.com/articles/sensors-for-coding-agents.html)):
  - **Computational** - tests, lint, types: cheap, deterministic, run on every change
  - **Inferential** - LLM-as-judge: costly and flaky, run selectively
- Self-repair in practice: the agent reads sensor output and fixes itself in a loop ([Aider auto lint/test](https://aider.chat/docs/usage/lint-test.html))

### Loop · orchestration

**Purpose: control and division of labor.** Decide who does what, when work passes between human and agent(s), and how state survives across context windows.

- **Plugs in here:** human-on-the-loop, multi-agent orchestration
- **Patterns:** self-repair loops; an initializer + coding-agent split that bridges many context windows for long-running work ([Anthropic: long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents))

## supporting components

Less philosophical, but a real harness needs them:

- **Agent-computer interface (ACI)** - purpose: make the agent's actions legible and guard-railed. Purpose-built view/search/edit commands beat raw shell ([SWE-agent](https://arxiv.org/abs/2405.15793))
- **Execution sandbox** - purpose: run and test safely, with no blast radius ([OpenAI sandbox](https://openai.com/index/building-codex-windows-sandbox/))
- **Observability / logging** - purpose: let the agent reproduce and verify its own work (logs, metrics, traces, DevTools)
- **Evals / benchmarks** - purpose: grade whole-task performance, not just single checks ([SWE-bench](https://www.swebench.com/))

## how the loop runs

1. Intent plus guides go in (context, rules, spec, examples, memory)
2. The agent acts (writes or edits code)
3. Sensors check automatically (tests, lint, types, review gates)
4. Failures feed back; the agent revises
5. Repeat until sensors pass; the human on the loop sets direction and reviews the result

The whole point is that steps 3 and 4 happen without you watching every keystroke.

## other approaches & variants

- **Fowler / Böckeler - guides + sensors** - the cybernetic framing; computational vs inferential; "keep quality left" ([harness engineering](https://martinfowler.com/articles/harness-engineering.html))
- **OpenAI Codex - engineer the environment** - architecture enforced by custom linters, `docs/` as system-of-record, "garbage-collection" agents ([harness engineering](https://openai.com/index/harness-engineering/))
- **SWE-agent / SWE-bench - ACI + eval harness** - interface as the lever, paired with a standard benchmark ([paper](https://arxiv.org/abs/2405.15793), [benchmark](https://www.swebench.com/))
- **Aider - deterministic test/lint loop** - auto-lint and auto-test after every edit, retry with structured error feedback ([docs](https://aider.chat/docs/usage/lint-test.html))
- **Anthropic - long-running-agent harness** - initializer + incremental coding agent bridging many context windows ([write-up](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents))

## open problems

- **Reward / eval hacking** - agents pass tests by cheating (special-casing, editing or deleting tests). CoT monitoring helps but is fragile ([OpenAI, CoT monitoring](https://openai.com/index/chain-of-thought-monitoring/))
- **Benchmark overfitting & contamination** - public benchmarks leak into training and get scaffold-tuned, inflating scores ([SWE-bench Pro](https://arxiv.org/abs/2509.16941))
- **Verification gap** - tests pass but code is wrong; correctness is outside any sensor's remit if intent was under-specified. Fowler calls the "behaviour harness" the elephant in the room
- **Flaky / slow / costly feedback** - inferential sensors can't run on every commit; forces quality-left tradeoffs and re-runs instead of hard blocks
- **Context limits vs. memory** - "context rot"; each session starts amnesiac; a monolithic rules file rots and crowds out the task
- **Security of autonomous tool use** - sandbox escape and unsafe actions motivate dedicated sandboxing ([OpenAI sandbox](https://openai.com/index/building-codex-windows-sandbox/))
- **Non-determinism & reproducibility** - model stochasticity plus non-deterministic sensors make outcomes hard to reproduce
- **Harness coherence at scale** - keeping guides and sensors in sync, non-contradictory, and measurable ("code coverage, but for harnesses")
- **Where human judgment stays** - taste, accountability, organizational memory, which conventions are load-bearing vs. habitual; the goal is to *direct* human input, not remove it

## sources

- Fowler & Böckeler: [Harness engineering](https://martinfowler.com/articles/harness-engineering.html) · [Sensors for coding agents](https://martinfowler.com/articles/sensors-for-coding-agents.html) · [Context engineering for coding agents](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html)
- OpenAI: [Harness engineering](https://openai.com/index/harness-engineering/) · [Codex sandbox](https://openai.com/index/building-codex-windows-sandbox/) · [Chain-of-thought monitoring](https://openai.com/index/chain-of-thought-monitoring/)
- Anthropic: [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) · [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [SWE-agent (arXiv 2405.15793)](https://arxiv.org/abs/2405.15793) · [SWE-bench](https://www.swebench.com/) · [SWE-bench Pro (arXiv 2509.16941)](https://arxiv.org/abs/2509.16941)
- [Aider - linting & testing](https://aider.chat/docs/usage/lint-test.html) · [AGENTS.md](https://agents.md/) · [LangChain: anatomy of an agent harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)
