---
title: "ai-assisted development frameworks: the ladder"
date: 2026-07-28
status: in-progress
publish: true
tags:
  - learning
  - ai
  - software-engineering
  - harness-engineering
---

> [!note] Learning in progress
> Part of [[writing/keeping-the-robots-honest/index|keeping the robots honest]]. Working notes, bullet structure intentional.
>
> The cleaner frame: this reads as a ladder, but each philosophy is really a bet on one [[writing/keeping-the-robots-honest/harness-engineering|harness]] component - guides, sensors, or loop. See the [[writing/keeping-the-robots-honest/index|map]]. The rung-by-rung detail below is the same set, laid out as a spectrum.

*Research digest, July 2026. No single standard exists yet. Frameworks below are ordered by increasing structure and decreasing human implementation control.*

## The core spectrum (one line each)

- **Vibe coding**: "make something like this", inspect the product, not the code
- **Prompt-driven**: "build this feature with these instructions"
- **Pseudocode-driven**: "here is my algorithm, implement it"
- **Spec-driven (SDD)**: "here are requirements, design, acceptance criteria"
- **Test/contract-driven**: "here are the properties that must hold"
- **Harness engineering**: "here is the controlled environment the agent runs in"
- **Formal specification**: "here is a mathematically verifiable correctness definition"

## grouped by harness component

Each philosophy mainly feeds one part of the [[writing/keeping-the-robots-honest/harness-engineering|harness]]:

- **Guides (feed-forward):** pseudocode, SPDD, spec-driven, memory / rules, and the spec half of formal
- **Sensors (feedback):** test/contract-driven, evals, the proof half of formal
- **Loop (orchestration):** human-on-the-loop, multi-agent
- **No harness:** vibe coding, prompt-driven (judge by output)

The hybrid this digest lands on spans two components: pseudocode + light spec (guides) and tests (sensors). The rung-by-rung detail below is that same set as a spectrum.

## 1. Software 3.0 (Karpathy)

- SW 1.0: humans write code
- SW 2.0: humans train networks
- SW 3.0: humans prompt general models in natural language
- Conceptual umbrella, not a process
- Source: [Karpathy, Software Is Changing (Again)](https://www.youtube.com/watch?v=LCEmiRjPEtQ)
- **See it in practice:**
  - [llmwiki](https://github.com/lucasastorian/llmwiki) - an AI autonomously writes and maintains a personal wiki over MCP
  - [Karpathy's LLM Wiki concept (gist)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) - the source sketch llmwiki implements

## 2. Vibe coding

- Surrender implementation control, judge by "does it seem to work"
- Good: prototypes, throwaway tools, UI experiments, learning
- Bad: production, sensitive data, pipelines, anything maintained
- Original definition (Willison): NOT all AI-assisted coding
- Source: [Willison, Not all AI-assisted programming is vibe coding](https://simonwillison.net/2025/Mar/19/vibe-coding/)
- **See it in practice:**
  - [Karpathy, "Vibe coding MenuGen"](https://karpathy.bearblog.dev/vibe-coding-menugen/) - blow-by-blow of vibe-coding a real app end to end
  - [Cursor](https://cursor.com/) - the canonical "autonomy slider" AI editor
  - [Lovable](https://lovable.dev/) - describe an app in chat, watch it build and deploy
  - [v0 by Vercel](https://v0.app/) - prompt-to-full-stack-app with templates you can open and inspect

## 3. Pseudocode-driven

- Human owns the algorithm, AI translates to Spark/SQL/Python
- No settled name: intent-driven, algorithm-first, implementation delegation
- Weakness: pseudocode omits edge cases, architecture, correctness criteria
- **See it in practice** (thin tooling - this rung has no serious canonical tool yet):
  - [pseudoc](https://github.com/vytskalt/pseudoc) - proof-of-concept: an LLM compiles pseudocode to a native binary
  - [From Pseudocode to Production](https://www.gocodeo.com/post/from-pseudocode-to-production-leveraging-ai-for-end-to-end-code-generation) - worked walkthrough of pseudocode → production prompts

## 4. Structured prompt-driven (SPDD, Thoughtworks)

- Prompts become version-controlled artifacts, not chat messages
- Contains: business intent, context, constraints, review checkpoints
- Flow: requirements → clarification → context → prompt → code → tests
- Fits teams that want AI without restructuring their process
- Source: [Fowler/Thoughtworks, SPDD](https://martinfowler.com/articles/structured-prompt-driven/)
- **See it in practice:**
  - [open-spdd](https://github.com/gszhangwei/open-spdd) - CLI that manages SPDD prompt/command templates across Cursor, Claude Code, Copilot
  - [token-billing](https://github.com/gszhangwei/token-billing) - the article's companion repo: SPDD applied to a real Spring Boot feature

## 5. Spec-driven development (SDD)

- Spec is source of truth; code is one generated realization
- Spec contains: purpose, scenarios, requirements, I/O, rules, architecture, acceptance criteria
- **Spec Kit (GitHub)**: Spec → Plan → Tasks → Implement, markdown artifacts
- **Kiro (AWS)**: project files (structure/tech/product) + feature files (requirements/design/tasks)
- **OpenSpec**: lighter, incremental, existing-codebase friendly
- vs pseudocode: "what the system must do" vs "how I would solve it"
- Sources: [Fowler, Understanding SDD tools](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) | [Spec Kit](https://github.github.com/spec-kit/) | [Kiro deep dive](https://kiro.dev/blog/from-chat-to-specs-deep-dive/) | [OpenSpec](https://github.com/Fission-AI/openspec)
- **See it in practice** (each ships runnable example specs):
  - [GitHub Spec Kit](https://github.com/github/spec-kit) - open-source SDD toolkit/CLI; works with Claude Code, Copilot, Gemini, Cursor
  - [AWS Kiro](https://kiro.dev/) - spec-first agentic IDE: prompts → requirements, design, sequenced tasks
  - [OpenSpec](https://github.com/Fission-AI/OpenSpec) - lightweight delta-spec framework; agree on the spec before code

## 6. Test/contract-driven agentic

- Human specifies observable correctness, not implementation
- Agent loop: write tests → implement → run → inspect failures → revise
- Builds on TDD, BDD, design-by-contract, property-based testing
- Key line: pseudocode = how you imagine solving it; tests = what must remain true
- **See it in practice:**
  - [Aider - linting & testing](https://aider.chat/docs/usage/lint-test.html) - `--auto-test`: agent runs tests, reads failures, fixes in a loop
  - [TDD with GitHub Copilot](https://martinfowler.com/articles/exploring-gen-ai/06-tdd-with-coding-assistance.html) - concrete red-green-refactor walkthrough with an assistant
  - [Aider (repo)](https://github.com/Aider-AI/aider) - the terminal pair-programmer behind that feedback loop

## 7. Harness engineering

- Design the environment, not just the instructions
- Feed-forward: specs, context, architecture rules, examples
- Feedback: tests, linting, type checks, security scans, review gates
- Goal: fast automatic error detection, not model infallibility
- Likely more important than prompting skill for professional work
- Source: [Fowler, Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- **See it in practice:**
  - [OpenAI, "Harness engineering" with Codex](https://openai.com/index/harness-engineering/) - real harness: custom linters, structural tests, observability, cleanup agents
  - [SWE-bench](https://github.com/SWE-bench/SWE-bench) - containerized eval harness that runs agents against real GitHub issues
  - [OpenAI Codex CLI (repo)](https://github.com/openai/codex) - open-source terminal coding agent the article builds on
- **Deep dive:** [[writing/keeping-the-robots-honest/harness-engineering|harness engineering]] - components, other approaches, and open problems. Its context/state layer has its own note: [[writing/keeping-the-robots-honest/agent-memory-architecture|context & memory architecture]]

## 8. Human on the loop

- Human owns the WHY loop: outcome, problem selection, tradeoffs
- Agent owns the HOW loop: code, tests, files, PRs
- Human supervises the system, not every keystroke
- Source: [Fowler, Humans and Agents in SE Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html)
- **See it in practice:**
  - [OpenAI, "Harness engineering"](https://openai.com/index/harness-engineering/) - team account of "humans steer, agents execute," pushing review agent-to-agent
  - [Exploring Generative AI - series hub](https://martinfowler.com/articles/exploring-gen-ai.html) - index linking the loops / harness / spec-driven write-ups

## 9. Multi-agent orchestration

- Separate agents: planning, architecture, implementation, testing, review, security
- Example: OpenAI Symphony (project board as control plane, task-per-agent)
- Human role shifts to: product owner + architect + eng manager + reviewer
- Source: [OpenAI Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/)
- **See it in practice:**
  - [OpenAI Symphony (repo)](https://github.com/openai/symphony) - reference: autonomous agents driven from an issue tracker through to PR
  - [CrewAI](https://github.com/crewAIInc/crewAI) - framework for role-based agents (planner / implementer / reviewer)
  - [Microsoft AutoGen](https://github.com/microsoft/autogen) - multi-agent framework (now maintenance mode; successor: [Agent Framework](https://github.com/microsoft/agent-framework))

## 10. NL → formal specification

- Natural language → formal spec (e.g. Dafny) → verified implementation
- Can prove invariants, forbidden states, spec conformance
- Unsolved: ambiguous prose → correct formal requirements
- Source: [arXiv 2506.11874, Formalising requirements with LLMs](https://arxiv.org/html/2506.11874v1)
- **See it in practice:**
  - [Dafny](https://dafny.org/) - verification-aware language: write pre/post-conditions and invariants, the verifier proves them
  - [Dafny (repo)](https://github.com/dafny-lang/dafny) - source, reference manual, and tutorials

## Where this is heading

- Not toward casual pseudocode for everyone
- Toward authoring higher-level artifacts:
  - intent + specs + examples + constraints + tests + architecture decisions + feedback loops
- AI compiles those artifacts into code

## Practical working loop (lightweight hybrid: 3 + 5 + 6)

1. Write the objective
2. Define inputs and outputs
3. Pseudocode the core logic
4. List edge cases and leakage risks
5. Define acceptance tests
6. Ask AI for an implementation plan
7. Review plan BEFORE code generation
8. Generate code in small pieces
9. Run tests, inspect key decisions

## Synthesis notes

- Central axis: WHO owns the reasoning at each rung
- Pseudocode and tests are complements:
  - pseudocode protects algorithm ownership (skill retention)
  - tests protect correctness (safety net when AI implements)
- SDD tooling war is unresolved; artifacts matter more than the tool
- Harness engineering is the highest-leverage rung for production DS/ML work:
  - pipeline debugging history (silent poison caches, case-mismatch bugs) is exactly what harness feedback controls catch
- The hypothesis-first / bounded-scope AI protocol already implements rungs 3 to 5
- Plan-before-code discipline = step 7 of the working loop, already in practice
- Gap to close: acceptance tests (step 5) rarely defined before implementation in current workflow
- Formal specification is a research horizon, not actionable yet

## Two-dimensional scoring

The three views below are interactive. In the radar, toggle any framework on or off to compare shapes. The **proposed hybrid** (violet, dashed) - pseudocode + acceptance tests + light spec - is plotted on all three as the target.

<iframe src="/ai-dev-frameworks-plots.html" title="Interactive framework plots: radar and two scatter views" width="100%" height="1620" style="border:0; border-radius:14px; overflow:hidden;" loading="lazy"></iframe>

### Framing A: process axes

- X = human reasoning ownership (who designs the logic)
- Y = verification rigor (how failures get caught automatically)

| Framework | Ownership | Verification | Cluster |
|---|---|---|---|
| Vibe | 2 | 1 | Faith |
| Prompt-driven | 3 | 2 | Faith |
| Pseudocode | 8 | 3 | Craft |
| SPDD | 7 | 5 | Artifact |
| Spec-driven | 6 | 6 | Artifact |
| On the loop | 4 | 6 | Systems |
| Multi-agent | 3 | 7 | Systems |
| Test-driven | 5 | 8 | Systems |
| Harness | 5 | 9 | Systems |
| Formal spec | 7 | 10 | Rigor outlier |
| **Proposed hybrid** | **8** | **8** | **Target** |

- Faith cluster (low, low): fine for throwaways only
- Craft cluster (high ownership, low verification): fragile-expert risk zone
- Artifact cluster (balanced, paperwork-heavy)
- Systems cluster (high verification, ownership drifts down)
- Empty top-right quadrant (8+, 8+) is the real target; no existing framework occupies it
- Cheapest approximation: pseudocode + acceptance tests → lands the hybrid at (8, 8)

### Framing B: outcome axes (good-software attributes, ISO 25010 style)

- X = correctness assurance (reliability, defect prevention)
- Y = maintainability and comprehension (the cognitive-debt axis)

| Framework | Correctness | Maintainability | Zone |
|---|---|---|---|
| Vibe | 2 | 1 | Poor software |
| Prompt-driven | 3 | 3 | Poor software |
| Multi-agent | 6 | 3 | Fragile-correct |
| On the loop | 6 | 4 | Fragile-correct |
| Formal spec | 10 | 5 | Fragile-correct |
| Test-driven | 8 | 5 | Balanced |
| SPDD | 6 | 6 | Balanced |
| Harness | 8 | 6 | Balanced |
| Spec-driven | 7 | 7 | Balanced |
| Pseudocode | 5 | 8 | Comprehension-first |
| **Proposed hybrid (target)** | **8** | **8** | **Target** |

- Key reversal from Framing A: multi-agent drops hard on maintainability (nobody comprehends the whole system)
- Pseudocode rises: human owns the mental model, matching the scaffolded-group advantage in cognitive-debt research (39% vs 77% maintenance failure)
- Formal spec is correct but hard to read: high X, mid Y
- SDD scores best of the existing frameworks (7, 7): spec doubles as living documentation
- Same conclusion from both framings: hybrid pseudocode + tests + light spec dominates any single philosophy
- Personal position estimate: near (6, 8) today; adding pre-implementation acceptance tests moves toward (8, 8)

### Framing C: six good-software dimensions (radar)

- Axes: correctness, maintainability, velocity, skill retention, team scalability, ease of adoption
- Vibe is a spike (velocity + ease), collapses on everything else
- Pseudocode alone peaks on skill retention; weak on team scalability
- Harness is the widest single framework but ease of adoption is its Achilles heel
- No single framework fills the hexagon
- The proposed hybrid (pseudocode + test-driven + light spec) covers nearly the full shape - that union *is* the practical working loop above

> Radar values in Framing C are estimates (no source numbers exist for that view). The scatter coordinates in A and B are from the tables above.

## Full source list

- [Karpathy: Software Is Changing (Again)](https://www.youtube.com/watch?v=LCEmiRjPEtQ)
- [Willison: Not all AI-assisted programming is vibe coding](https://simonwillison.net/2025/Mar/19/vibe-coding/)
- [Fowler/Thoughtworks: Structured Prompt-Driven Development](https://martinfowler.com/articles/structured-prompt-driven/)
- [Fowler: Understanding Spec-Driven Development (Kiro, spec-kit, OpenSpec)](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [GitHub Spec Kit docs](https://github.github.com/spec-kit/)
- [Kiro: From chat to specs](https://kiro.dev/blog/from-chat-to-specs-deep-dive/)
- [OpenSpec repo](https://github.com/Fission-AI/openspec)
- [Fowler: Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- [Fowler: Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html)
- [OpenAI: Symphony, open-source Codex orchestration](https://openai.com/index/open-source-codex-orchestration-symphony/)
- [arXiv 2506.11874: Formalising software requirements with LLMs](https://arxiv.org/html/2506.11874v1)
