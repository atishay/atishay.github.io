---
date: "2019-03-16T00:00:00Z"
title: "Method wrappers in Async Await - Part I"
description: "Making cases for creating wrappers around asynchronous methods to perform additional tasks"
tags:
- javascript
- async-await
sidebar:
- title: attribution
  content: Cover by Free Photos on [Pixabay](https://pixabay.com/photos/pug-dog-pet-animal-puppy-cute-801826/)
categories:
- javascript
coverAnchor: Top
series: ["Async Await"]
---

Wrapping methods is not very common in day to day programming but it is a very useful concept. We could abstract out shared functionality over methods with a defined signature in a wrapper and not have to repeat the same tasks again and again. The semantics of methods having return values that need to be returned sometime makes regular use cases of calling methods without wrappers cumbersome. In the world of JavaScript, methods like debounce and throttle have been popular since the very beginning of the programming language. These utility methods provide code that can take an existing method and provide additional functionality without interfering with the functionality. Async-await provides more avenues where this abstraction can be used to add more functionality to methods which otherwise takes a lot more effort to add. In this post we will discuss some advantages of async that makes wrapping easier as well as some common methods that make sense wrapped.

# Async guarantees
`Async` if used in the codebase provides certain guarantees that makes writing wrapper using async await much easier. some of those guarantees are built into the JavaScript runtime, others come from the expected use of async with `await`. Since async is meant to be used with `await`, methods that are created using async provide features that makes the lives of library developers a lot easier. They can point to cases that the code does not handle as bugs in the code of the library users rather than special cases that need to handled by the wrapper methods.

1. **It always returns once** The biggest problem with wrapping callbacks is that there are valid cases where the callback can be called multiple times and also when it is not not called at all. Tracking these cases makes a wrapper very complicated. Also, we are not able to determine if the missing callback or the duplicate callback is a human mistake or as designed. This makes bugs difficult to track and wrappers have to deal with a lot more complexity than should be required in most use cases. This problem does not exist for `async`. It is meant to be used with `await` and it can assumed that it will always return once and if it implemented internally through some other mechanism that does something different, it likely a problem with the implementation than a special case that the library has to handle.
2. **There is always a single return value** Extending functions that take callback as the last parameter is complicated. Should you add a parameter after callback to maintain backwards compatibility? Similar is the case with return values. Since callbacks can take multiple return values, the complexity for handling multiples becomes a responsibility of the wrapper. Even though modern JavaScript provides easy to use object destructing syntax, `{x, y} = foo()`, most callbacks take multiple arguments (more than the `err, data` that is standard in nodejs), in many cases as the refactor to return an object is lot more work than just ading a parameter. The complexity to handle those additional return values lies on the wrapper.
3. **It is always a promise** Promises have well defined error semantics, more than that, with promises we are always sure about the nature of code is always async and the caller will get the response after some time. There are methods where the callback come back immediately in a non-blocking manner (eg `[].forEach()`). This makes wrappers hard to write as we cannot do something async with a guarantee. That can potentially break programs that assume that the function is synchronous. Some functions are asynchronous only in a certain cases and those cases are never hit by certain programs. All that complexity can be avoided in async thanks to the assumed usage with `await` and its general structure.

# Measuring time

The global `console` object comes with two methods `time` and `timeEnd`. They are meant to be used as points to mark  time to measure in the console. For each `console.time`, it is meaningful to have only one `console.timeEnd`. Without the `timeEnd` call, the `time` call is not useful. These methods were implemented before async and therefore such a situation arises. A better option would be to have a wrapper that would take a `async` function and time it.


```js
async function time(name, method) {
  console.time(name);
  return await method().finally(() => console.timeEnd(name));
}

// Usage
async function x(...args) {
  return await time('x', async () => {
    // My code using args
  })
}

```
The power of `async` is extremely clear in this case. We know the return value is a promise. The `.finally` takes care of being called both in error and return cases. the waiting and the wrapping can work perfectly.

The approach is extensible to add more features on need:

```js
async function time(name, method) {
  console.time(name);
  const start = Date.now();
  return await method().finally(() => {
    // Not waiting for fetch. Since there is no reason for performance monitoring to be waited upon,
    fetch(`/performanceMonitoring?time=${Date.now() - start}&name=${name}`);
    console.timeEnd(name)
  });
}
```

This code adds calling to the server. We can also add checkpoint support easily.

```js
class CheckpointBuilder {
  ...
}

async function time(name, method) {
  const builder = new CheckpointBuilder(name);
  await method(builder).finally(() => {
    builder.post();
  })
}

// Usage
async function x(...args) {
  await time('x', async (builder) => {
    await doSomething();
    builder.addCheckpoint('Done something');
    await doSomethingElse();
  })
}
```

Here we created a class to handle all the communication with the server with support for more advanced features like a checkpoint. A good design pattern for implementing such a request builder is the [Builder design pattern](https://en.wikipedia.org/wiki/Builder_pattern).

We could simplify some of these wrappers using decorators if you are using babel/typescript.

```js
// Convert to decorators
function Time(key) {
	return function (target, functionName, descriptor) {
    const x = target[functionName];
		descriptor.value = async (...args) =>
    await time(key, async () =>
      await x.apply(target, args)
    );
	};
}

// Usage
class {
   @Time("key")
   async function foo (...args) {
     ...
   }
}
```

This way we have common 1-line code that can perform tasks that require a lot of functionality for async code that is properly abstracted.

In the [next post]({{< ref "/blog/50-parallel-calls" >}}) we will discuss more complicated wrappers required to solve the parallel calls problem.
