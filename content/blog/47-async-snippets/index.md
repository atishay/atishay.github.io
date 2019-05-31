---
date: "2019-03-14T00:00:00Z"
type: post
title: "Snippets for success with Async Await"
description: "A set of code snippets showing various design patterns to be successful in the world of async await"
tags:
 - javascript
 - async-await
sidebar:
  - title: attribution
    content: Cover created using [Word Clouds](https://www.wordclouds.com/)
categories:
  - javascript
series: ["Async Await"]
---

The `async-await` feature in modern JavaScript is very powerful and can provide a lot of functionality with very little code. The more we get into using async-await, the more we realize that it is not just syntactic sugar, it is a way of thinking. The more we use async await, the more we feel liberated and empowered. Here are some of the snippets in the order of increasing develop power and productivity and not necessarily the increase in code size.

## 1. Waterfall execution
Waterfall execution of `async-await` involves just adding await anywhere in the code.

```JavaScript
async function foo() {
  ...
  // Always wait - like calling a callback.
  x = await foo1();
  ...
  // Same as above. The success value is used as a condition
  if(await foo2()) {
  ...
  // Wait only if the condition is true.
  // In callbacks, the code after the `if` statement needs to be called twice
  await foo3()
  ...
  }
  for(...) {
    // Run `foo4` one after another waiting for it to complete in the for loop.
    await foo4(...);
  }
  ...
}
```
In cases like loops and callbacks, tracking function calls in callbacks is difficult and there are significant benefits of going to async.

*Caveat* `array.forEach` cannot have `await`. Since it returns nothing, we cannot wait for anything. In modern JS, there is little reason to use `array.forEach`. A `for..of` loop is better in almost all cases where foreach has been used earlier.

## 2. Fire and forget
Is is not necesary to use `await` with async. We can just call and async method and not use `await`. This way the method would complete when it wants.
```JavaScript
  fetch("analytics/activity?userId=100");
```

Note that this will also ignore all errors. A better implementation would be to write.
```JavaScript
  fetch("analytics/activity?userId=100").catch(e => console.log("Error sending analytics", e));
```

## 3. Catching one of errors
You can use `.catch` to catch one of errors in the asynchronous code.
```JavaScript
await foo1();
await foo2().catch((e) => console.log(`Got error ${e} but not throwing`));
await foo3();
```
You can also rethrow errors.
```JavaScript
await foo1();
await foo2().catch((e) => {
    console.log(`Got error ${e} and rethrowing`);
    e.additionalData = "data from scope";
    throw e;
  });
await foo3();
```

You can do cleanup using `.finally`

```JavaScript

await x.finally(() => "Cleanup resources. will be called even in case of errors. No need to worry about the return value or the exception.");

```

## 4. Delayed await
The objective here is to do something in parallel to the synchronous call. This is a very common pattern in network requests. Since they take a lot of time, it is a good idea to trigger them as soon as possible and then do additional tasks like rendering the UI after the network request has been sent. If the response comes early, it can wait but in most cases, it won't be ready early. But we will be able to save some extra time that was taken by additional code (like crunching the UI together) by sending over the requests early.

```JavaScript
async foo() {
  ...
  await fetch()
  ...
}
const promise = foo();
// Do some parallel tasks
...
await p;
```

## 5. Parallel functions
Waiting for multiple asynchronous functions running in parallel can be achieved by waiting on `Promise.all`. Very useful if we have multiple requests on the server that are independent but we need to wait for all of them. We can combine this with method #4 above.
```JavaScript
const tasks = [
  fetch(p1),
  fetch(p2),
  fetch(p3)
];
responses = await Promise.all(tasks);

```
Note that this will not wait for all requests in case some request gives an error. For that we need `Promise.allSettled` currently on track for standardization in JavaScript.

## 6. Async function for each array value
Another common pattern is to have asynchronous processing of some data coming from an array. If we need to perform that one by one a `for..of` look is the solution. But if we want to run that in parallel the following code can be used.

```JavaScript
await Promise.all([...].map(async x => {
  ...
  await foo(x);
  ...
}));
```

## 7. Racing asynchronous functions
It is difficult to appreciate exiting when the first of the two asynchronous methods completes. It feels wasteful to run two competing calls. But there are valid use cases for racing asynchronous functions. One of the best use cases is to have a timeout. We could race a method against set timeout and it will provide a one time timeout.

```JavaScript
// setTimeout async version
const timeout = async (time) => new Promise(resolve => setTimeout(resolve, time));

// Adding a timeout to fetch
await Promise.race([fetch(...), timeout(2000)]);
```
The first line is wrapper over setTimeout to make this async-await compatible. In the next line we race `fetch` and `timeout`. The one that completes first returns. If fetch returns first we get the response object. If fetch fails, it would reject immediately and we can catch the error in a `try...catch` or a `.catch(() => ...)` block. If fetch succeeds under 2 seconds, its return value is present, otherwise timeout would win the race which would resolve to `undefined`. We could change this to an error or reject it in case of the timeout.

## 8. Memoization and solving parallel calls
In most cases when we call the server, we would like to use the value at multiple places but would not want to call the server multiple times. Traditionally this ahs been solved by keeping this output value in a variable (most likely in a store like mobx or redux) and calling a method once to fetch it. Such an approach is needlessly verbose and it prevents us from making the components independent as they depend on someone else to do server fetch. One solution to this is to use memoization - caching the return value from the function if it is called with the same parameterd. The challenge here is that the async functions can take a long time while the download is in progress, there is no data to cache. This problem is not there in `async` methods as we can cache and reuse promises easily.

```JavaScript
// Convert to ES6 Decorator
function Memoize() {
	return function (target, functionName, descriptor) {
		descriptor.value = _.memoize(descriptor.value);
	};
}
@Memoize
async get() {
	...
	return data;
}

```

This method will only call the server once for any get call and all callers will get the response as quickly as possible. We are using an off the shelf memoize from lodash in this case and ECMA decorators making the code fun to read.

We can also create decorator wrappers for method like `console.time`, the scope of which discussion is beyond this post.

Hope you find these useful and are able to use these in everyday life.
