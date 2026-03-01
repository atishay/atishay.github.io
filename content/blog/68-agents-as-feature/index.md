---
date: "2026-03-01T10:23:56-08:00"
type: post
title: "Agents are features not products"
description: "The pitch is that AI-first companies don't need traditional tooling, that known approaches are dead. The nuance: models can only one-shot without an intermediate piece to iterate on, and that piece is what traditional approaches produce. The model multiplies the operator; it doesn't replace the workflow. Just like GPS software vanished into car consoles, agents will vanish into products."
tags:
- ai
- agents
categories:
- ai
sidebar:
- title: attribution
  content: Image generated using ChatGPT
---

There's a story going around that models are a rewrite. AI-first companies don't need traditional tooling; the old ways are obsolete. Build for the model, ship from the model, and leave the formats and tooling of the past behind. The nuance is that this is only half true. A model can one-shot (you prompt once, get an answer, done) but only when there's nothing in between to iterate on. As soon as you need to change one thing without throwing the rest away, you need an intermediate piece: something the operator and the model can both read and edit. That intermediate piece is exactly what traditional approaches produce. File formats, structure, tooling. So the model doesn't replace the known approaches. It adds a multiplier for the operator. The traditional stack gives you the thing you can iterate on; the model makes the operator faster on top of it.

In software this is obvious. Source code (HTML, Python, Java) is the intermediate piece. Editors, linters, version control are the tooling. You can ask the model to rewrite a function or fix a bug; it edits a slice of the file. You can also edit that slice yourself. The format is open, the tooling is open. The model doesn't replace the workflow. It multiplies what the developer can do in the same workflow.

Outside of code we're not always there. With many AI imaging tools, each "tweak" is a full regeneration. You want to move one object or change a color; the whole image gets rewritten. Maybe it does what you wanted; maybe it doesn't. There's no intermediate piece: no layers, no structured representation, just prompt and seed and "ask again." You can't iterate the way you could with traditional tools. The same pattern shows up in forms and tax returns. Do you want the system to regenerate the entire return every time you change a line item, or to loop with the model until it's "right" and then re-review everything? If not, you need a format that lets you edit only the part that changed and tooling that supports both human and model edits. That format and tooling are the traditional approach. The model then multiplies the operator on top of that. It doesn't replace it.

So the rewrite narrative is off. Traditional tooling and formats aren't dead. They produce the intermediate artifact that makes iteration possible. Without it, the model is stuck in one-shot or full regeneration. With it, the model becomes a multiplier. The known approaches stay; the operator gets a boost.

That's why agents are turning into a feature rather than a product. The underlying tech is democratized: the APIs are available to everyone, and open source models are maybe six months behind state of the art. The kings are fighting for pennies. So the owners of existing tooling and formats can add agents faster than agent-first companies can add the intermediate layers and tooling. The incumbents already have the artifact people iterate on; they just plug in the model. The agent-only players have to build or acquire the whole stack. So the agent ends up as a feature inside the product, not the product itself.

*Disclaimer: I'm employed at a SaaS imaging company. These are my own views, not my employer's.*
