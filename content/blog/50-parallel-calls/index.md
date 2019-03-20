---
date: "2019-03-19T00:00:00Z"
title: "Method wrappers in Async Await - Part II"
description: "Making cases for creating wrappers around asynchronous methods to perform additional tasks"
tags:
- javascript
- async-await
sidebar:
- title: attribution
  content: Cover by Hans on [Pixabay](https://pixabay.com/photos/skiing-departure-wag-trace-curves-16260/)
categories:
- javascript
---

In the [previous post]({{< ref "/blog/49-async-wrappers" >}}) we discussed about creating wrappers over asynchronous methods to provide some extra functionality. In this post we will be discussing creating a more complicated wrapper that uses the promises that the `async` function returns to solve a very common parallel calls problem.

# Parallel calls problem
The parallel calls problem is a very common problem in software development. Suppose you have an asynchronous method get that gets the data from the server. This data is not always needed and therefore one would want to delay the call for this data until the need arises. The data can be used at multiple places and they do not have a common ancestor or flow that you could call from. The desired behavior that we would like to achieve is that this method is called from multiple places but should only fetch from the server once. If a fetch is pending the new call should also wait for the same fetch and if the fetch is complete, the data should be returned as is. Unless new parameters are required to be sent to the server in which case this should be refreshed. Here is an attempt at creating the code with a simplified problem where there are no arguments:

```Javascript
let data = null;
function get(cb) {
    if (data) {
      cb(data);
    } else {
      callbacks.push(cb);
    }
    if (callbacks.length === 1) {
      ...
      data = response;
      callbacks.forEach(cb => cb(data));
    }
  }
```

Implementing such a system in callbacks is so complicated that the JavaScript developers gave up on using this behavior at all. We got into the worlds of state stores in frontend development which are not really storing the program state but the data that we get from the server. Here we have support for updating all the watchers/user interface when the data changes. Then we have one call that calls the server and populates the data. That call is where we check if a call is needed.

# Solution with async await
With the async guarantees, the parallel calls problem becomes a lot simpler to solve and we can build a wrapper that can work in all cases. That wrapper will perform all the tracking and will be a lot less code than we need to write to get a basic version up and running. The code to perform this task is not something we need to write from scratch. We have been using this for years. The code that we need is the `memoize` function. Here is the implementation of memoize from Lodash.

```Javascript
function memoize(func, resolver) {
  const memoized = function(...args) {
    const key = resolver ? resolver.apply(this, args) : args[0]
    const cache = memoized.cache
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = func.apply(this, args)
    memoized.cache = cache.set(key, result) || cache
    return result
  }
  memoized.cache = new Map();
  return memoized
}


// Usage
let get = memoize(async (...args) => {
  ...
  return data;
});

const A = async () => await get('x');
const B = async () => await get('x');
const C = async () => await get('y');
const D = async () => await get('x');
// A and B in parallel
await Promise.all([A(), B(), C()]);
// Get is finished already.
await D();
```

Lets see how this works for an asynchronous function. When we get a method call, we resolve the parameters to ensure we can re-use the server data only if we are passing the same parameters to the server. In line 5 we check if this code has been called before and return the previous synchronous return value in case it has been called before. With the async guarantees, we know that the passed function returns a promise. Whether the method has completed execution or it is still in progress, the promise object does not change. Multiple functions can `await` on the same promise.

When `A` calls `await get()` and it is first call with these parameters, the code reaches line 9, where the original method is called and A begins to wait on the returned promise which is also cached by the memoize cache. Next, when `B` calls `await get()`, the memoize returns the cached promise but the underlying method is not called again. `B` waits on the same promise. When the promise gets resolved or rejected, both `A` and `B` can continue from the `await` statement. Meanwhile when `C` calls the same method, it passes different arguments and therefore the if check at line 5 fails and we get a fresh call to the internal function.
After the promises are resolved, when `D` calls the get method, the resolved promise is returned. This resolved promise is ready to be used and `D` can continue after the next tick. Async-await guarantees the methods are executed as asynchronous.

# Wrap Up
With the help of the async guarantees the regular memoize method that we have been using for so many years becomes very powerful and for asynchronous code, it can do proper memoization for them. There is no code change needed between synchronous and asynchronous code to achieve memoization.

In the next post, we will extend the memoize method to do a better job with rejections and also solve a little more complicated save problem in our wrapper.
