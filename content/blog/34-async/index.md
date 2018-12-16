---
date: "2018-08-25T00:00:00Z"
title: "From callbacks to async - await"
description: "A step by step guide for moving from callbacks to async await in JavaScript applications."
tags:
 - web-development
sidebar:
  - title: attribution
    content: "Image by Tomas Sobek  from [Unsplash](https://unsplash.com/photos/plwud_FPvwU)"
slug: from-callbacks-to-async-await
categories:
  - web-development
---

# From callbacks to async - await - A migration guide

I _originally wrote this article for [Morning Cup of Coding](https://www.humanreadablemag.com/morningcupofcoding). Morning Cup of Coding is a newsletter for software engineers to be up to date with and learn something new from all fields of programming. Curated by Pek and delivered every day, it is designed to be your morning reading list. [Learn more.](https://www.humanreadablemag.com/morningcupofcoding)_


[Callbacks](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) have been at the core of JavaScript and Node.js ecosystem. As much as they are needed for the performance boosts, they have proven to have [huge maintenance issues](https://www.quora.com/What-are-JavaScript-callbacks-and-why-are-they-harder-to-maintain). There have been multiple attempts at fixing these, from [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) to [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), until [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)-[await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) came in to the picture [mitigating most of the concerns](https://hackernoon.com/javascript-promises-and-why-async-await-wins-the-battle-4fc9d15d509f) that asynchronous code traditionally used to bring with it. Now that they have been standardized, most developers are stuck with old code still living in [callback hell](http://callbackhell.com/) (when you have multiple deep nested callbacks within a function) that needs to be migrated to the sane ecosystem. This blog post gives a set of step by step instructions to ease these migrations.


>If you need more than 3 levels of indentation, you're screwed anyway, and should fix your program.
 -[Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds), [Kernel Coding Style Definition](https://www.kernel.org/doc/Documentation/process/coding-style.rst)

## Why do we have callbacks?

JavaScript was built for the web where everything requires network requests to work. When the CPU executes a JavaScript statement like `XMLHttpRequest.send()` if it waits for the response to come over, the UI would hang as it takes significant time for the request to be sent over to the server, be processed and the response to come back. Therefore it made sense to take a function as an argument that would be called when the response is available, freeing the CPU for other things while we wait for the response. With Node.js, this was taken one step further as even requests to the database or to the hard disk, are also slower in comparison to the CPU, and waiting for them even in a background thread is a waste of resources. That is why in Node.js almost every call is asynchronous and after the success of Node.js, other languages also brought in asynchronous constructs int heir core.


## Problems with callbacks

Callbacks are very good for the CPU but they are not so good for the programmer for a variety of reasons. Programmers, unlike computers, think in a sequence and therefore while the CPU should not wait for the database response, the programmer needs to think about the task after the database has responded. Therefore, the logical next step for the program after the database call is handling of the response. With the presence of callback after callback, changing the code into subroutines becomes extremely difficult as the flow of the program does not remain linear. The next line may be called much earlier than the previous one in execution, forcing the programmer to constantly monitor the execution order while writing code. Here is an excerpt of the problem.


**Synchronous Code**(Slow but clear)
```javaScript
    function calculate() {
        try {
        // Sequential flow (also logical from the programmer's perspective)
        connection = db.connect(); // CPU waits for the connection
        response = db.sql(connection, sql);
        // Process response
        nextResponse = db.sql(connection, nextSQL);
        } catch (e) {
          sendToUser("Exception");
        }
    }
```


**Asynchronous Version**(Fast but difficult to follow) **
```javaScript
    function calculate(done) {
        // Using callbacks
        db.connect((err, connection) => {
          //Method is called once connection is available
          if (err) {
            sendToUser("Exception");
            return;
          }
          db.sql(connection, sql, (err, response) => {
            if (err) {
              sendToUser("Exception");
              return;
            }
            // Process response.
            db.sql(connection, nextSQL, (err, nextResponse) => {
              if (err) {
                sendToUser("Exception");
                return;
              }
              done();
            });
          });
        });
    }
```
The asynchronous code, though looks ugly, has much better performance than its synchronous counterpart. Once you have more than one independent parallel call to the `calculate` method, the synchronous code has to resort to threads and that requires creation of huge data structures in memory. While that has been the approach for the first decade of the internet, the costs of that approach have proven to be prohibitively too high and the economics has pushed for adopting the asynchronous version.

The callback-based asynchronous code is more verbose and prone to errors:

- If one of the return statements is missing, the callback can be called twice which can potentially break everything.
- Errors are easier to ignore as they have repetitions that are useless and cause more confusion.
- You are more likely to hit the width of your monitor screen because of the indentation.
- You are more likely to turn, say handling the second response into its own named function which would need to be moved somewhere above the entire method making it even more difficult to follow.
- JavaScript has both errors and exceptions. An exception in say `db.sql` could go into the previous `db.sql` and then there is no way to understand anything from the call stack.
- Once it gets beyond 3-4 levels deep, you don’t really understand what happens when. Accidental parallel code where the response is not present is a side effect.


## What is async await?

Async await is a simple solution to all of the above problems. While the code in async await works just like in the world of callbacks where the CPU is not wasted, it looks like synchronous code that we understand and love, and the extra verbosity is lost.

```javaScript
    async function calculate() {
      try {
        // Sequential flow (also logical from the programmer's perspective)
        connection = await db.connect();
        //Connection is returned once it is available.
        response = await db.sql(connection, sql);
        // Process response
        nextResponse = await db.sql(connection, nextSQL);
        } catch (e) {
          sendToUser("Exception");
        }
    }
```

Now all those calls that were giving callbacks are still asynchronous. If you put a breakpoint in line 5, it might take a while after line 4 to actually be reached. But in the meanwhile, if you have other JS code, say some timeout elsewhere, those still get hit as the CPU is free to work on other things. **Async Await** is the cleanest solution to the problem of having lots of callbacks known as callback hell where we had to live with ugly code for the performance benefits that it provides.


> Trivia
> Async Await is not the first solution to the callback hell problem. Generator Functions, Promises and even strict coding conventions have been used in many places. Node.js had to introduce a huge set of **sync** versions of its various APIs because writing asynchronous code was so much pain that [developers sometimes preferred to just use the inefficient synchronous API](https://github.com/nodejs/node/issues/1665) to get around it. Async Await provides a proper solution where the code looks like the synchronous API but works like the callback version without the loss of any expressiveness, performance or power.


## The elephant in the room - Promises

Promises are complicated and at this point an internal detail. Async await is a wrapper syntax and works based on promises. The concept of promises is therefore required to be known if you ever want to go deeper into async await. We will not be going into the nitty-gritty of promises. A great introduction on Promises can be found in the [google developer documentation](https://developers.google.com/web/fundamentals/primers/promises) and [at MDN](https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise). [This](https://developers.google.com/web/fundamentals/primers/async-functions) article explains how async await are built over promises. Promises are ways for synchronous and asynchronous functions to work together. If you ever need to convert callback based code to async outside of the pattern that we will just be learning or want to use async code in their synchronous counterparts, promises are the way to go. [Guru99](https://www.guru99.com/node-js-promise-generator-event.html) provides a good tutorial on converting to promises which could be used as an intermediatory step before going into async await.


## Steps to go async

1) Convert all callbacks to be of the `callback(err, data)` format that takes one error and one data argument. The task is not very complicated. With ES6, the wrapper may actually end up being extremely small and useful.

**Before**
```javaScript
    /**
     * Task method to performa a custom task.
     * Takes to arguments and returns two responses
     * to the callback
     */
    function task(arg1, arg2, callback) {
      // Perform task
      callback(resp1, resp2);
    }

    task('1', '2', (resp1, resp2) => {
      console.log(resp1, resp2);
    });
```


**After 1**
```javaScript
    /**
     * Task method to performa a custom task.
     * Takes to arguments and returns two responses
     * to the callback
     */
     function task(arg1, arg2, callback) {
       // Perform the task
       callback(null, {resp1, resp2});
     }

     task('1', '2', (err, {resp1, resp2}) => {
       console.log(resp1, resp2);
     });
```

2) Use node’s `util.promisify` method to convert existing method to async one by one. If you are not in the node environment you can use a [polyfill](https://www.npmjs.com/package/es6-promisify).

**After 2**
```javaScript
    const util = require('util');

    /**
     * Task method to performa a custom task.
     * Takes to arguments and returns two responses
     * to the callback
     */
     function task(arg1, arg2, callback) {
       // Perform the task
       callback(null, {resp1, resp2});
     }

     // Provide a unique name to the promisified function
     // You will be replacing this eventually with the
     // original name once the original function is not used any more
     task_p = util.promisify(task);

    {resp1, resp2} = await task_p('1', '2');
```

3) Handle one off errors or errors that can be skipped with a `.catch` call.

**Before**
```javaScript
    method1(arg, (err, data) => {
      if (err) {
        return handleError(err);
      }
      method2(arg2, (err, data2) => {
        console.log(err); // Continue after error.
        method3(arg3, (err, data3) => {
          if (err) {
            return handleError(err);
          }
          // Finish task with data3
        });
      });
    });
```


**After**
```javaScript
    try {
      const data = await method1(arg);
      const data2 = await method2(arg2).catch(err => console.log(err));
      const data3 = await method3(arg3);
    }
    catch(err) {
      handleError(err);
    }
```
Note that after performing a `.catch(cb)` based special processing, you can still throw to reach the global handler at the try catch. If you want to do different error handling in all cases which was possible with the callback based code, you can use a `.catch` clause everywhere. The await calls could still be wrapped in try..catch to handle exceptions in the catch block or otherwise.


4) Once all methods are converted, run a replace all call through the code base to replace new method `task_p` with the original method name `task` if we had used the naming convention like described in step 2 above.


## Common Patterns

1) **Wrap parallel code in Promise.all**. If some code is meant to be run in parallel, we should not make it sequential. [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) call take an array of asynchronus functions and run them in parallel. Since we can now work with array, all the array manipulation functions like `map` and `forEach` can now be used. There is also [Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) for the cases where we need to wait for any one of the methods to respond and do not need to wait for all of them to continue execution.


**Before**
```javaScript
    let done = 0;
    // Collect responses here
    let responses = [];

    // All api in parallel for each data element.
    data.forEach((x, index )=> {
      api.call(x, (err, response) {
        if (err) {
          return callback(err);
        }
        done = done + 1;
        responses[index] = response;
        if (done === data.length) {
          callback(null, responses);
        }
      });
    });
```

**After**
```javaScript
    await Promise.all(data.map(x => await api.call(x)));
```
Note that with `Promise.all` and a sequence of `await` calls all serial and parallel combinations of requests should be handled.


2) **Leave the side effects without await or use the next tick**.  Sometimes we do have side effects like leaving a call to analytics that we do not wish to wait for or logging that can happen after the response is sent from the server. For these we can ignore the await call and it works just like before.


**Before**
```javaScript
    function log(data, callback) {
      formatData(data, (err, cleanData) => {
          writeToDisk(cleanData, callback);
      });
    }

    function handleRequest(req, callback) {
      prepareResponse(req, (err, resp) => {
          callback(err, resp);
          writeToDisk(resp);
      });
    }
```

**After**
```javaScript
    async function log(data) {
      return await writeToDisk(await formatData(data));
    }

    async function handleRequest(req, callback) {
      const resp = await prepareResponse(req);
      writeToDisk(resp); // No await means we will not wait for it to complete.
      return resp;
    }
```
The above assumes that `writeToDisk` is not CPU expensive. If it is and there is no way to fix it, we could wrap it in a next tick call, like `process.nextTick(() => writeToDisk(resp))` . It might still be hit before the response is actually sent as there might be multiple async calls after `handleRequest` but that is not something the old code was doing anyways.

3) **Some code can still have callbacks**. Not all callbacks need to be converted. Methods like [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) are still callback based and are natural to remain that way. In cases like these, the callback function is called multiple times in response to external stimulus and might not be called for the lifetime of the program. If there is no sequential flow of control that the callback based code was making difficult to understand, there is no point in removing callbacks. They do have their place in modern JavaScript, just not to the extreme level that they had before async await.

## What async await is not
- Async await is not a solution to poorly structured code. Reducing the verbosity of writing JavaScript can be extremely useful in figuring out places where refactoring is needed but it alone will not solve the problem of spaghetti code. There is no shortcut to proper code organization. It still needs to be split into meaningful chunks contained within separate functions/modules/files and properly documented and handled.
- Async await does not magically make the code synchronous. Everything is still asynchronous.  The programmer still needs to understand the concept of [event driven programming](https://en.wikipedia.org/wiki/Event-driven_programming) and the [event loop](https://medium.com/the-node-js-collection/what-you-should-know-to-really-understand-the-node-js-event-loop-and-its-metrics-c4907b19da4c).
- Async await is not a performance booster and will not speed up execution of the code. It might help in the cases where accidental synchronous APIs had been used which was slowing down code but if you are looking for a massive performance boost, this is not the right place. Instead are [cases](https://twitter.com/stefanpenner/status/702654894126149632) where async await can lead to more RAM consumption and can be difficult to debug if we need to [transpile](https://scotch.io/tutorials/javascript-transpilers-what-they-are-why-we-need-them) the code and do not have [source maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

## Summary

Async await is a cleaner way to express the same ideas as callbacks and do not incur the performance overhead of synchronous code. They may be promises internally but apart from various method names like `Promise.all` or `util.promisify`, there is no need to understand promises in depth to use async await in production. All the code can be converted piece by piece to async functions with simple steps. After the completion is done, it would be discovered that not only is the newer code a lot less verbose and easier to navigate but also fixes many bugs that might have crept up over time into the callback based methods.  There is little reason to not move to async await especially as all major browsers as well as Node.js support them natively and they provide the same feature set with a much cleaner API as do callbacks.

