---
date: "2026-05-12T19:25:15Z"
type: post
title: "From RAG to the Library: History Rhymes"
description: "RAG and skills aren't new ideas — they mirror how humans have always retrieved knowledge. History suggests the destination: the library, with its hierarchical organization built for navigation at scale."
tags:
- ai
- genai
- agents
categories:
- ai
sidebar:
- title: attribution
  content: Image by [Michal Jarmoluk](https://pixabay.com/users/jarmoluk-143740/) from [Pixabay](https://pixabay.com/)
---

This has always been the case. Long before anyone wrote a vector database or coined the term Retrieval-Augmented Generation, humans were solving the same problem: how do you answer a question when the answer isn't already in your head? The techniques we are building into AI systems today are just formalized versions of what smart people have been doing for centuries. The progression from RAG to skills to tree summarization maps almost perfectly onto the progression from a child reading a passage to a researcher navigating a library.

# The Comprehension: Classic RAG

Think back to school. The teacher hands you a passage — a few paragraphs about volcanoes, or the water cycle, or a history lesson. Then come the questions. You are not expected to already know the answers. The passage is right there. You read it, you find the relevant sentence, you write the answer.

That is RAG. A question arrives. Relevant text is retrieved and placed in front of the model. The model reads it and responds. The entire knowledge base doesn't need to be memorized. Just find the right chunk and reason over it.

This works brilliantly for short, well-scoped questions where the answer lives in a single passage. It breaks down as the scope grows.

# The Open-Book Exam: Skills and Tool Use

A few years on, the exam gets harder. You are allowed to bring your textbook, your notes, maybe a formula sheet. But the question is no longer "find the sentence that says X." The question requires combining information from multiple sources, applying a method, constructing an argument.

You don't read the whole book during the exam. You remember enough structure — which chapter covers what, which appendix has the tables — to navigate quickly. You know where to look. You go to the right page, pull the relevant piece, combine it with what's in your head, and build your answer.

This is the skills model. The AI doesn't get a pre-loaded context dump. Instead, it has access to tools: APIs, databases, documents it can call on demand. It knows enough about what each tool contains to decide which one is worth invoking for this particular question. It fetches only what it needs. Context stays lean.

The open-book exam rewards students who understand structure, not just students who memorized the most. Same principle applies here.

# The Library: Hierarchical Organization of Knowledge

A library is not a pile of books. It is a tree.

At the top level: fiction and non-fiction. You already know, from the question alone, which branch to enter. Non-fiction splits into history, science, geography, law, and so on. History splits by region, then by era. European history. Medieval Europe. The twelfth century. The Crusades. Science splits by discipline, then by subdiscipline, then by topic. You drill down, level by level, until you reach the shelf where the answer lives.

This is tree summarization applied at civilizational scale. Each node in the hierarchy summarizes what's beneath it. You don't need to read every book to know that your question about plate tectonics belongs in science, not history. You navigate the structure. You only read when you've arrived.

And sometimes you make a mistake. The question sits at the boundary — say, the history of a scientific discovery, or the geography of a conflict. You drill down the history branch, come up empty, and realize the librarian may have filed it under science instead. So you backtrack and try the other path. That is not a failure of the system. That is the system working. Humans have been doing this for thousands of years.

This is exactly what agents need to do to scale to an infinite world of context. Right now we have a travel booking agent, a catalog search agent, an IT support agent — a flat list of skills, one per task. That is the open-book exam phase. It works, but it does not scale. As the scope of what agents need to know grows, the flat list becomes unnavigable.

The library phase looks different. A single agent navigates a hierarchy: Support → Travel → Booking, or Support → IT → Hardware, following the structure of the domain rather than scanning a flat list of tools. The agent doesn't need to know every skill upfront. It needs to know enough about the structure to find the right branch, drill down, and arrive at the right capability. The same way a researcher doesn't memorize every book — they understand how knowledge is organized.

# Scaling the Solution

Each step in this progression scales the solution to a larger problem. A library is harder to build than a passage to hand a student — but it serves a researcher, not just a child. Hierarchical agent navigation is harder to build than a flat list of skills — but it handles an unbounded knowledge space, not just a curated toolkit. You don't throw out RAG for every use case — plenty of problems are scoped tightly enough that retrieving a relevant chunk and answering from it is exactly right. RAG will continue to serve those cases well.

And the cost of scaling has a way of getting solved. Cloud vendors didn't kill cPanel overnight — many still use it today and it works fine for what it does. But cloud solved the problems cPanel couldn't: scale, reliability, cost at volume, and things cPanel never attempted. The tooling got better, the economics shifted, and the ceiling moved up.

The same will happen here. Right now, hierarchical knowledge organization sounds expensive and operationally heavy. And it is. But tooling will catch up. Libraries will become cheaper to build, faster to navigate, and easier to maintain. When they do, they will solve the scale problem that flat retrieval and flat skill lists cannot — and open up capabilities neither approach could reach.

Smart people figured out the library before computers existed. They built them, organized them, and trained librarians to navigate them. We are encoding that same insight into software. The technology is new. The insight is not.
