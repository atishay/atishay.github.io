---
date: "2026-01-26T12:00:00-08:00"
type: post
title: "Smart Agents Don't Need Managers"
description: "The irony of 'PhD-level' agents needing human orchestrators is fading. Context windows and on-demand subagents make manager layers obsolete."
tags:
- ai
- agents
- orchestration
- context
sidebar:
- title: attribution
  content: Photo by [Pablo Varela](https://unsplash.com/@pablopunk) on [Unsplash](https://unsplash.com/photos/white-mug-on-brown-surface-hEw2qUhk-fw)

categories:
- ai
---

The dominant pattern for coordinating AI agents is a manager or orchestrator: a persistent conductor routing work to specialists. But here's the irony: we claim agents are "PhD-level" smart, yet we ask humans to decompose problems upfront and wire them together with orchestration logic.

If these agents are truly intelligent, why can't they figure out task decomposition at runtime when they actually see the problem? Why do we need an army of managers when the best coding agents handle complex tasks just fine on their own?

# The Orchestration Paradox

We market AI agents as expert-level reasoners, then build systems where humans pre-decide how to split work across agents before seeing the actual problem. Static orchestrators route tasks based on predetermined logic, not dynamic assessment. Fixed topologies assume task structure before the agent evaluates complexity.

Real PhDs don't work this way. You don't tell a researcher, "Use your literature-review self for 2 hours, then switch to your experiment-design self." They fluidly shift focus based on what they discover.

Yet our agent systems force premature decomposition. We're outsourcing the hardest part—understanding how to break down a novel problem—to humans or rigid orchestrators, while claiming the agents themselves are brilliant.

# What we see working today

Look at systems that work today. Coding agents like GitHub Copilot, Cursor, Claude Code, and OpenAI Codex handle complex multi-file changes without orchestration layers. They see the actual problem before deciding how to solve it. They maintain coherent understanding across the whole task and adapt strategy based on what they discover. No manager required.

# The assumptions that are changing

**1) Expanding context windows**
Models now handle megabytes of context. A single agent can keep far more working state than before, reducing the need to split work across agents.

**2) On-demand ephemeral subagents**
Instead of standing orchestration, a lead agent spawns purpose-built subagents via tool calls: "validate these facts," "summarize this document." Subagents are ephemeral, returning results to the parent without persistent infrastructure.

**3) Smarter compression and retrieval**
Agents compress long interactions into concise representations and retrieve relevant slices on demand, maintaining manageable context without external coordination.

**4) Better tool-call semantics**
Richer APIs with strong schemas and transactional semantics let agents compose services reliably without a normalization layer.

# The future pattern

A lead agent receives intent and decides decomposition dynamically after seeing the problem. It spawns subagents only when genuinely needed for specialized work, via `spawn_subagent()`-style tool calls. The agent manages context through compression and retrieval, keeping session state coherent, and logs centrally for audit without routing control through a manager.

**Benefits:**
- Latency drops as there is no orchestration hop.
- Complexity drops as there are fewer services to operate
- Intelligence increases as decomposition happens with full problem context
- Flexibility increases as strategy adapts to actual task structure

## The Real Question

If an agent can't look at a problem and intelligently decide how to decompose it, is it really "PhD-level"?

The shift from pre-orchestrated agent armies to dynamic single-agent systems with on-demand subagents isn't just about better infrastructure. It's about taking the "intelligence" in "artificial intelligence" seriously.

Managers were pragmatic responses to real constraints: tiny contexts, brittle tools, limited reasoning. Those constraints are weakening rapidly. Design for the agent-first path—where smart agents make smart decomposition decisions at runtime—and add orchestration only when hard requirements demand it.

The future isn't managing dumb agents smartly. It's letting smart agents manage themselves.
