---
title: "keeping the robots honest"
publish: true
tags:
  - ai
  - software-engineering
  - harness-engineering
aliases:
  - writing/keeping-the-robots-honest
---

Notes on building software with AI without going soft: how to delegate the work while keeping the thinking.

## the frame

Harness engineering is the spine. Every philosophy is really a bet on one of its components:

- **Guides (feed-forward):** pseudocode, spec-driven, SPDD, memory and rules
- **Sensors (feedback):** tests and contracts, evals, formal proof
- **Loop (orchestration):** human-on-the-loop, multi-agent
- **Vibe = no harness** (eyeball the output). **Formal spec = two at once** (its spec is a guide, its verifier is a sensor).

Under all of it, one question keeps you honest: are you keeping the thinking (intent, algorithm, verification) and delegating only the work?

## the map

<svg viewBox="0 0 760 430" xmlns="http://www.w3.org/2000/svg" role="img" style="width:100%;height:auto;color:var(--secondary,#4a7c74)">
  <title>Harness engineering as the spine, with each philosophy plugging into a component</title>
  <desc>A top bar labeled harness engineering feeds three columns: guides (feed-forward), sensors (feedback), and loop (orchestration). Guides holds pseudocode, light spec, SPDD, spec-driven, memory and rules. Sensors holds tests and contracts, evals, formal proof. Loop holds human-on-the-loop and multi-agent. Vibe is no harness; the hybrid uses guides plus sensors.</desc>
  <defs>
    <marker id="hsp" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M0,0 L7,3 L0,6 Z" fill="currentColor" fill-opacity="0.55"/>
    </marker>
  </defs>
  <rect x="40" y="22" width="680" height="44" rx="10" fill="none" stroke="currentColor" stroke-width="1.8"/>
  <text x="380" y="42" text-anchor="middle" font-size="13.5" font-weight="700" fill="currentColor">Harness engineering</text>
  <text x="380" y="59" text-anchor="middle" font-size="9.5" fill="currentColor" fill-opacity="0.6">the spine every philosophy plugs into</text>
  <line x1="145" y1="66" x2="145" y2="98" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.3" marker-end="url(#hsp)"/>
  <line x1="380" y1="66" x2="380" y2="98" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.3" marker-end="url(#hsp)"/>
  <line x1="615" y1="66" x2="615" y2="98" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.3" marker-end="url(#hsp)"/>
  <rect x="40"  y="100" width="210" height="30" rx="7" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-opacity="0.35"/>
  <text x="145" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Guides · feed-forward</text>
  <rect x="275" y="100" width="210" height="30" rx="7" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-opacity="0.35"/>
  <text x="380" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Sensors · feedback</text>
  <rect x="510" y="100" width="210" height="30" rx="7" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-opacity="0.35"/>
  <text x="615" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Loop · orchestration</text>
  <g font-size="10" text-anchor="middle" fill="currentColor">
    <rect x="55" y="144" width="180" height="26" rx="6" fill="none" stroke="currentColor" stroke-width="1.4"/><text x="145" y="161" font-weight="600">pseudocode</text>
    <rect x="55" y="176" width="180" height="26" rx="6" fill="none" stroke="currentColor" stroke-width="1.4"/><text x="145" y="193" font-weight="600">light spec</text>
    <rect x="55" y="208" width="180" height="26" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.3"/><text x="145" y="225" fill-opacity="0.85">SPDD</text>
    <rect x="55" y="240" width="180" height="26" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.3"/><text x="145" y="257" fill-opacity="0.85">spec-driven</text>
    <rect x="55" y="272" width="180" height="26" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.3"/><text x="145" y="289" fill-opacity="0.85">memory / rules</text>
  </g>
  <g font-size="10" text-anchor="middle" fill="currentColor">
    <rect x="290" y="144" width="180" height="26" rx="6" fill="none" stroke="currentColor" stroke-width="1.4"/><text x="380" y="161" font-weight="600">tests / contracts</text>
    <rect x="290" y="176" width="180" height="26" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.3"/><text x="380" y="193" fill-opacity="0.85">evals</text>
    <rect x="290" y="208" width="180" height="26" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.3"/><text x="380" y="225" fill-opacity="0.85">formal proof</text>
  </g>
  <g font-size="10" text-anchor="middle" fill="currentColor">
    <rect x="525" y="144" width="180" height="26" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.3"/><text x="615" y="161" fill-opacity="0.85">human-on-the-loop</text>
    <rect x="525" y="176" width="180" height="26" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.3"/><text x="615" y="193" fill-opacity="0.85">multi-agent</text>
  </g>
  <text x="40" y="344" font-size="10" fill="currentColor" fill-opacity="0.6">Vibe coding = no harness: skip the guides and sensors, just eyeball the output.</text>
  <text x="40" y="366" font-size="10" fill="currentColor" font-weight="600">Hybrid = pseudocode + light spec (guides) + tests (sensors): the smallest balanced harness.</text>
  <text x="40" y="388" font-size="9" fill="currentColor" fill-opacity="0.6">Formal spec plugs into two slots at once: its spec is a guide, its verifier is a sensor.</text>
</svg>

## start here

1. [[notes/keeping-the-robots-honest/harness-engineering|Harness engineering]] - the spine. Why we need it, and what each component (guides, sensors, loop) is for. Start here.
2. [[notes/keeping-the-robots-honest/the-ladder|The ladder]] - the philosophies grouped by the component they plug into, the two scoring framings, and the hybrid. With interactive plots.
3. [[notes/keeping-the-robots-honest/agent-memory-architecture|Context & memory architecture]] - a deep dive on the guides / feed-forward component.

## the through-line

The hybrid you land on (pseudocode + tests + light spec) is not separate from the harness. Its tests are the harness's sensors and its spec is a guide. Choosing how you specify is partly building the environment that checks the work.
