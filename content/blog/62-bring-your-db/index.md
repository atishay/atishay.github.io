---
date: "2024-04-15T10:00:00-07:00"
type: post
title: "Bring your own database"
description: "An alternate universe where web was built around customers bringing their own database instead of being held hostage to every service provider's ownership of their own data."
tags:
- database
- wishlist
categories:
- general
sidebar:
- title: attribution
  content: Image by [ALEX](https://pixabay.com/users/alexnewworld-13981350/) from [Pixabay](https://pixabay.com/)
---

What if the web had been built around customers bringing their own database instead of being held hostage to every service provider's ownership of their data? We ended up in a world where your photos live in Google's house, your documents in Microsoft's filing cabinet, and your social graph in Meta's address book. But it didn't have to be this way.

Think of it like traveling. Right now, we check into different hotels (Gmail, Dropbox, Notion) and adapt to their rooms, their rules, their amenities. What if instead we could bring our own RV—a portable home with everything we need, our data, our preferences, our history—and just park it wherever we want to surf online?

## How we got here: the server-side escape

Multiprocess storage used to be genuinely hard. ACID across shared memory meant coordinating atomicity (what if a process crashes mid-update?), consistency (who enforces the rules?), isolation (lock mazes and priority inversion), and durability (power loss, torn writes, lying controllers). The industry's answer was simple: move the complexity to a single database server. One process, clear boundaries, centralized rules.

This worked so well that we forgot it was a workaround, not a law of nature. Local databases like SQLite prove durable local storage was always possible—it just took time to get the engineering right. But by then, the server-centric web was already built.


## The alternate timeline: bring your own data

Imagine if the default had been "bring your own data store" instead of "rent space in ours." Every service would expect you to arrive with your personal database—whether that's SQLite, a structured folder, or even a Git repository. They'd provide the interface, the algorithms, the social features—but your data stays yours.

- Your data travels with you between services
- Backup is "copy the files" or use standard sync tools
- Switching providers means pointing your data at a new interface
- Privacy becomes "don't share the files" instead of "trust our policy"

Working from home is usually a VPN anyway—still a LAN abstraction. Most personal computing could have been local-first with optional sync, not cloud-mandatory.

## Do we need a .docx? A thought experiment

What if a "document" were just a structured data format you own? Maybe a SQLite database with tables for blocks, styles, and media. Or a Git repository with markdown and assets. Or even a well-organized folder with JSON metadata. The point isn't the format—it's that you can open, query, version, and collaborate using standard tools instead of being locked into proprietary formats.

## Email without the server-first mindset

Could a personal mail client store everything locally—in a database, structured files, or even a Git repository—with IMAP/SMTP as thin sync edges? Your mail archive becomes a portable asset you control. Offline becomes normal, backup becomes straightforward, and switching email providers doesn't mean losing your history.

## Photos: structured storage makes backup boring (in a good way)

Your photo library could be a structured data store you control. Maybe a database with metadata tables, maybe a folder hierarchy with sidecar JSON files, maybe a Git LFS repository. The key insight: when your photos, metadata, albums, and edits live together in a format you understand, backup becomes "copy the files" and migration becomes "point the new app at your data."

## Sync, but simpler

Local-first doesn't mean offline-only. Your personal data store can sync when needed—rsync for files, database replication for structured data, Git for versioned content. Conflict resolution is still a product choice (last-writer-wins, field-wise merge, CRDTs), but you make that choice on top of formats you control instead of across a thicket of proprietary services.

## Web3's promise, simpler path

Web3 pitched self-sovereign data, portability, and composability. Most of that doesn't require a global, public ledger. It requires a private, portable store you control, plus optional, permissioned replication.

- Private-by-default: your data lives in encrypted local storage you control
- Portable: copy the files; your digital life comes with you
- Verifiable sharing: sign sync manifests; peers verify, you can revoke
- Interop: publish schemas; others can build against them without reading your data

A "wallet" becomes a keyring that encrypts your personal data store and signs replication events. No global consensus, no broadcast to the world—just integrity, ownership, and selective sharing. Wasn't that the better version of the idea?

## The business model that could have been

In this world, you pay for storage and backup—think Google Drive, but it's just encrypted blob storage, nothing more. Your data lives in open, clearly defined formats for interoperability. Storage providers compete on price, speed, and reliability, not lock-in.

Services compete differently: you pay them to manipulate, analyze, or present your data, but they never own it. A photo editor charges for AI enhancement features. A document service charges for collaboration tools. A social platform charges for matching algorithms and moderation. But your photos, documents, and social graph stay with you when you leave.

Everything is forced to be open—data formats, APIs, sync protocols. Open to all apps for interoperability, not to all advertisers for exploitation. Services become utilities that operate on your data, not landlords who hoard it. The money flows to innovation and features, not to building moats around your information.

## What could have been

In this alternate timeline, switching from Gmail to Proton means pointing your mail database at a new interface, not begging for an export and hoping nothing breaks. Leaving Facebook means taking your social graph with you, not losing a decade of connections. Photo services compete on features and performance, not lock-in.

Before reaching for servers, we'd ask: could this be a personal data store on the user's machine, with sync as an option? Whether that's a database, structured files, or version-controlled content—the key is ownership and portability.

Maybe it's time to pack our own RV instead of bouncing between hotels. Your personal data store travels with you—your photos, your documents, your preferences, your history. Services become campsites where you can park and connect, not landlords who own your stuff. Alas, most digital destinations don't have RV hookups, so we rent an Uber wherever we go, leaving our stuff behind each time.

