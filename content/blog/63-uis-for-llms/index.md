---
date: "2024-10-15T10:00:00-08:00"
type: post
title: "Better UIs for LLMs"
description: "Open challenge still remains - do we need to design UIs for chat cards manually?"
tags:
- llm
- ui
categories:
- ai
sidebar:
- title: attribution
  content: Image by [Alexandra_Koch](https://pixabay.com/users/alexandra_koch-621802/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7767694) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7767694)
---

Chat felt easy until it wasn’t. A textbox, a stream of messages, and you ship. Then you add memory, tools, retrievers, images, actions, multi‑turn tasks, and evaluation. Suddenly you need state management, refresh coordination, provenance, and a zoo of “cards.” Chat starts to look like a product operating system.

## Why chat UIs are hard

A chat transcript is linear, but real sessions are not—uploads, tool runs, partial updates, and retries collide. The UI must keep an authoritative session state, reconcile streaming/refresh/cancellations without flicker or duplication, and render diverse interactive cards (tables, forms, diffs, plots, viewers) while preserving the flow.

## Card types: the combinatorial explosion

Every capability wants a card—SQL result, notebook cell, calendar suggestion, CRUD form, evaluation summary, visualization, or file preview—and each card needs a clear schema for inputs, outputs, and metadata, well‑defined actions such as run, retry, edit, and confirm, and a lifecycle that covers pending, streaming, partial, complete, failed, and superseded states. Multiply by variants and you are suddenly designing both a design system and a runtime.


## The sandboxed subagent

What if cards were just sandboxed web apps?

Cards can simply be sandboxed web apps: the model, acting as a subagent, emits HTML+CSS (and optional JS) for a card which we render in an iframe with a minimal postMessage bridge and a declarative capability manifest. We pass our design tokens and components so it composes to spec—no graph builders or bespoke renderers. As the model improves, the cards improve without redeploying UI code, and users can reshape the interface with a single prompt instead of filing tickets. A smaller slice of intentional UI work can now cover a wider variety of outputs because raw HTML and CSS are more versatile than any fixed set of React components. HTML and CSS are also fast to render and easy to sandbox, and if a card is ephemeral or throwaway, that is fine—the only bar is that it renders well in the moment. This approach buys us velocity, isolation, and consistency.

## Why we still design cards by hand

Models aren’t reliably great UI engineers—yet. Minor layout drift or overflow erodes trust; accessibility demands correct semantics and keyboard navigation; and the pending/stream/error/refresh paths require disciplined state handling and careful security review. Teams keep shipping hand‑designed cards because they can guarantee determinism, testability, and polish, especially where cards sit next to payments, data export, and compliance.

There is also a business incentive to keep cards proprietary. Agent platforms and incumbent chat products strengthen their moats by owning the UI surface and the distribution partnerships around it. The more closed and “beautiful enough” the interface, the harder it is for alternative runtimes to emerge—even when they are cheaper or more flexible. We do not have to accept that. A small, open substrate plus a safe, portable card format can let users bring their own UI without sacrificing safety, quality, or brand integrity. But will the users take it - considering the brand names one is good enough and the bugs in there are now habits.

## Conclusion

Chat makes simple things easy and real work visible: it exposes state, refresh, and rendering problems that apps usually hide. The answer isn’t a thousand bespoke components; it’s a boring substrate for session truth and refresh, plus a safe lane for on‑the‑fly cards.

The iframe/subagent route is a pragmatic bridge: constrain capabilities, enforce tokens and components, and let the model compose within a sandbox. As models improve, shift more UI generation into that lane, keeping contracts, provenance, accessibility, and safety as non‑negotiables.

The end state looks less like hand‑drawn cards and more like schemas and capability manifests that “compile” into UI. Until then, hand‑craft the few that matter most—and let the rest be text.

If you are building in this space, help move us there: publish card schemas, ship design tokens as a public contract, and adopt sandboxed rendering with strict capability manifests and CSP. Ask vendors to expose a portable “sandboxed card” lane so users can bring their own UI safely. We can make cards open and interoperable—and finally stop rebuilding the same components again and again.

