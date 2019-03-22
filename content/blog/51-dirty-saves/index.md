---
date: "2019-03-20T00:00:00Z"
title: "Method wrappers in Async Await - Part III"
description: "Extending memoize for async wrappers to solve the multiple save problem"
tags:
- javascript
- async-await
sidebar:
- title: attribution
  content: Cover by Chris Yang on [Unsplash](https://unsplash.com/photos/zpG3x9pXS_8)
categories:
- javascript
series: ["Async Await"]
---

In the [previous post ]({{< ref "/blog/50-parallel-calls" >}}) we used memoize to prevent the parallel calls to a function. In this post we will be extending the memoize implementation to handle more of the situations that may arise with asynchronous functions and extending memoize to handle those additional cases.

Here is the memoize function from [lodash](https://www.npmjs.com/package/lodash.memoize).

```js
function memoize(func, resolver) {
  const memoized = function(...args) {
    const key = resolver ? resolver.apply(this, args) : args[0];
    const cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  }
  memoized.cache = new Map();
  return memoized
}
```

# Adding State

The first extension an asynchronous function needs to be able to determine the state of the promise. A promise can be resolved, rejected or pending. In Javascript the promise state is not available on the promise object. We need to extend it to provide the state information.

```js
function appendState(promise) {
  if (promise instanceof Promise) {
    promise.state = 'pending';
    promise.then(x => {
      promise.state = 'resolved';
    });
    promise.catch(e => {
      promise.state = 'rejected';
    });
  }
  return promise;
}
```
Note that we are attaching the state to the original promise object and not returning a new promise object. This makes it unnecessary to have the rejection re-thrown or the resolution returned. This method should be called before line 9, in case the return value is a promise. We are not checking that the function called is async and therefore would not want to crash the function by adding a `.then` to a non-promise.

# Generic rejection method
The second extension we would like to do to the memoize method is to have a rejection method on the return value. We could do it via adding code to memoize like I mentioned in my [byteconf](https://www.byteconf.com/js-2019) talk, it is easier to add a selection method so as to make it generic. After adding the rejection method this is what memoize looks like:

```js
function memoize(func, resolver, rejector) {
  const memoized = function(...args) {
    const key = resolver ? resolver.apply(this, args) : args[0]
    const cache = memoized.cache
    if (cache.has(key) && (!rejector || !rejector(args, cache.get(key)))) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    appendState(result); // Append state from above
    memoized.cache = cache.set(key, result) || cache;
    return result;
  }
  memoized.cache = new Map();
  return memoized;
}
```

Memoize takes an optional parameter `rejector` which can reject a cached value. This way we could reject certain cached data based on conditions.

Here is a sample rejector:

```js
function dontCacheRejections(args, promise) {
  return (promise instanceof Promise) && (promise.state === 'rejected');
}
```

This way of the original server request fails, we do not cache and continue using the failure results.

# The save problem
One very common problem in programming is the save problem. Say you have some document being edited and you want to trigger a save on it. If a save is in progress, you should not start saving in parallel but should wait for the save to complete. Saving should happen if the save is not in progress.
Extending memoize to perform this task is relatively simple. Here is the rejection method to implement the solution to the save problem.

```js
function dontCallInParallel(args, promise) {
  return (promise instanceof Promise) && (promise.state !== 'pending');
}
```

In this case only if the promise is pending execution, save will not be executed. Otherwise save will go through. You might want to extend it further to delay the save call (something similar to [debounce](https://www.npmjs.com/package/lodash.debounce) in concept). Here if the save is in progress, you want to call save again after the save is complete but if it is not running, you can call it right now.

```js
let saveWaiting = false;
function delaySaveIfRunning(args, promise) {
  if ((promise instanceof Promise) ) {
    if (promise.state === 'pending') {
      if (!saveWaiting) {
        saveWaiting = true;
        promise.then(() => {
          saveWaiting = false;
          object.save.apply(object, args);
        });
      }
      return true;
    }
    return false;
  }
  return false;
}
```

The above rejector also has a side-effect of delaying the save call to be applied if the save is in progress.

In these posts, we saw how powerful it can be to share functionality across `async` methods via creating wrappers that can solve many of our day to day problems in a generic way that could be abstracted out into a library.
