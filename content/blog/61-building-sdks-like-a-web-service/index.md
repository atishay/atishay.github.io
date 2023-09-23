---
date: "2023-09-23T10:00:00-07:00"
type: post
title: "Building SDKs like a web service"
description: "Designing SDKs using web-service principles: communication, contracts and dependencies"
tags:
- sdk
- api-design
- developer-experience
categories:
- web-development
sidebar:
- title: attribution
  content: Image by [JK_Studio](https://pixabay.com/users/jk_studio-2828480/) from [Pixabay](https://pixabay.com/)
---

SDKs tend to feel nicer when they behave like web services. You can use a single contract (JSON) across boundaries within the core, between threads or processes, across language wrappers, and even when talking to external services. You might keep the C interface tiny, push language specifics to wrappers generated from a JSON Schema, and run everything in a neat simple package.

This is a pattern and not doctrine. Take the pieces that fit your constraints. You can start at the edges and keep the core as is, or go all in if you want strict contracts across teams. The tradeoffs are easy to reason about. JSON adds a bit of overhead and you can keep it at the edges and use binary inside. Async callbacks and middleware can improve composition and isolation but add a touch of indirection. With the hardware we have today, the performance benefits of skipping layers are negligible. And the simplicity and cross-platform compatibility of JSON are worth the extra indirection.

## JSON as the ABI

One friendly approach is to treat every call as a request and response envelope. This keeps contracts explicit, versionable, and testable.

```json
{"version":"1.0","op":"create","payload":{}}
```

Wrappers (Swift/Kotlin/.NET/C++) validate with the same schema, serialize native types to JSON, and parse JSON responses back to native types. Inside the core you can still use faster binary forms; JSON is the stable edge.

## Async callbacks provide memory safety

A pragmatic C ABI can use an async callback with a context handle. The caller owns the memory for the duration of the call. Everything is transfered and can be copied and processed asynchronously if needed. No need for allocate and free APIs.

```c
typedef void (*sdk_callback_t)(void* context, const char* response_json);
void sdk_invoke_async(const char* request_json, void* context, sdk_callback_t cb);
```

For further safety from an oop paradigm, you can pass an integer handle (std::uintptr_t) as `void*` and avoid passing a raw pointer. Keep a static registry map that associates a handle with a weak_ptr to a lambda on the wrapper side. Resolve the handle, lock the weak_ptr, and invoke. This helps avoid dangling pointers and keeps lifetime in the wrapper.

If you need persistent callbacks, you might expose simple register and unregister APIs that store a function pointer with a `void*` context, or reuse the same handle based wrapper, to keep lifetimes explicit.

## Middlewares inspired by Rails and Express

A composable pipeline for authentication, content filtering and redaction, quotas and policy, logging and metrics, retries, and caching can work like Rails middleware or Express request response next. This is great even in a SDK.

```js
const chain = (next) => (req) => next(redact(auth(req)));
```

The same idea applies whether you are in process, cross thread, or crossing a process boundary.

## Errors use one shape and surface idiomatically

You can prefer structured JSON errors and map them to language idioms. Use Promise rejection in JavaScript, async throws or Result in Swift, and std::expected in C++.

```json
{"ok":false,"error":{"code":"UNAUTH","message":"token expired"}}
```

## Handling images and other large data

Prefer references over embedding when it helps. You can pass a file path on the local file system or a URL to a blob store and let the core stream the bytes. This keeps JSON small and avoids unnecessary copies.

```json
{"image_path":"/var/data/uploads/photo.jpg"}
```

If a reference is not possible, you can embed base64 in JSON as a last resort. Document limits and reject oversized payloads. Consider chunked streaming when you must move large data across process boundaries. Give them separate threads to process and avoid blocking the main thread.

## Single process or multiple processes

Pick the scheduling model for each plugin based on your constraints. You can use a dedicated thread, a dispatch queue, or the same thread with a JavaScript style event loop. For isolation, you can run plugins as separate processes that speak JSON over standard input and output or sockets.

## JSON Schema and code generation

Consider publishing a JSON Schema as the source of truth. Generate thin language wrappers that validate, serialize, and deserialize. JSON Schema also enables input validation and safe, backward compatible expansion through optional fields and explicit versioning. High quality JSON libraries exist in every major language, which keeps this approach practical and consistent across platforms.

## Wrap up

Adopting JSON as the universal ABI with async callbacks and middleware can yield a stable contract, strong memory hygiene, and predictable behavior across languages. You can adopt this incrementally. Keep the public C surface minimal, and let wrappers expand JSON in and out.
