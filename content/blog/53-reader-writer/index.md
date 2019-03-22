---
date: "2019-03-21T00:00:00Z"
title: "Shared data with Async Await - Part II"
description: "Reader-Writer problem in Javascript with async await"
tags:
- javascript
- async-await
sidebar:
- title: attribution
  content: Photo by Aaron Burden on [Unsplash](https://unsplash.com/photos/Pxm-TUd61vY). Image from [Despicable Me](https://www.imdb.com/title/tt1323594/)
categories:
- javascript
series: ["Async Await"]
---

In the [previous post]({{< ref "/blog/52-shared-data" >}}) we discussed the shared data problem and the needs for locks in JS code if we are dealing with APIs that have state in them and we do not have the ability to get general purpose high-level stateless APIs.

## Reader-Writer Problem

One extension to this problem with is more complicated and also requires a more complicated solution is the reader writer problem. To understand it, lets look at the scene from the movie [Despicable Me](https://www.imdb.com/title/tt1323594/).

{{<fig caption="Despicable Me - Resume Scene" width="531" height="400" src="despicable-me.jpg" class="float-3" >}}

In this scene, the protagonist Gru is applying to adopt three girls and shows up to this lady who is inspecting his profile to figure out if he is a worthwhile candidate for that responsibility. While she reads his resume, two minions are writing it in parallel. They end up in a fight and garbage gets thrown out. We know the solution to this would be to have a shared lock that would allow only one minion to write at a time. Should we share the lock with the reader?
There could be a case where the minion has a typo and then the reader would get to see that. That presents a major problem. Maybe we should share the lock with the reader as well, so that when the reader is reading no one can write. This solution works but is extremely inefficient. What about instead of adopting 3 girls via one lady, Gru decided to spam every adoption agency on the plant. Should they all be in contention for the lock? Since the readers are not modifying data, the readers should be allowed to access in parallel.

## Preferred solution
The preferred solution to the reader writer problem is to have a concept of a separate read and a separate write lock. The reader should not be allowed to write but in return we could have parallel access to the data.

{{<fig caption="Reader-Writer Problem" width="743" height="379" src="problem.png" class="full" >}}

If there are readers already attached to the data store, other readers should be allowed but writers will need to wait for all other readers and writers to finish and will get exclusive access. Users of the reader writer would expect the following APIs for these locks:

```js
const x = await lock.read(async ()=> {
  // Do reading
  return "Something";
});

const y = await lock.write(async () => {
  // Do writing
  return "Something else"
});
```

All the logic behind the reader-writer problem should be hidden from the end user. We cannot achieve such a system with just living in the world of `async-await`. By definition, when the last read lock is released, we need to acquire the write lock as well as release the `lock.read` from being waiting on the function. Therefore we need to go down into the world of callbacks that make up the promises which are wrapped into `async-await`.

## The library

Here is the implementation of the boilerplate code to prepare the library:

```js
class Lock {
  pendingReads = []
  pendingWrites = []
  async read(func) {   // Cannot use await here
    return new Promise(resolve => {
      pendingReads.push({func, cb:resolve});
      this.perform();
    });
  }
  async write(func) { // Cannot use await here
    return new Promise(resolve => {
      pendingWrites.push({func, cb: resolve});
      this.perform();
    }
  }
  perform() {
    ...
  }
}
```

All the magic is performed by the perform method. In the code above, we create a list of pending reads and pending writes converting the async functions into callbacks. The perform method does all the locking using callback based code. Here is the perform method described above:

```js
class Lock{
  ...
  perform() {
    // Perform the writes at a higher priority
    if (this.state === 'None' && this.pendingWrites.length > 0) {
      this.state = 'Write';
      const {func, cb} = this.pendingWrites.shift();
      func().finally(() => {
        cb(); this.state = 'None'; this.perform();
      }
    }
    // Reads are lower priority.
    if (this.state !== 'Write' && this.pendingReads.length > 0) {
      this.pendingReads.forEach(({func, cb})=> {
        this.state = 'Read';
        this.readInProgess++;
        func().finally(() => {
          cb();
          this.readInProgess--;
          if (this.readInProgess === 0) {
            this.state === 'None';
            this.perform();
          }
        })
      });
    }
  }
  // Declare the private variables within the class
  readInProgess = 0
  state = 'None'
}

```

The method above is all that it takes to enable the `perform` method. All the magic is in those 25 lines of code that too repeated twice. The `state` variables contains the current state of the Lock. It can have three values, `None`, `Read` and `Write`. Note that this object should be read-only for anything outside of this class. At line 5, we check if there is no lock acquired and we have writes pending. If so, thew write lock is acquired and the `write` task is given an opportunity. The `shift` method on `pendingWrites` ensures the First In First Out(FIFO) queuing of the locks. We use the `finally` from promises so that we don't have to care about the return or rejected values and they can be passed on to the caller transparently. As soon as the write is complete, the lock si freed and we call perform again.
If there is nothing to write and there is either a read lock or no lock in progress, then reads can continue. Since all reads can be run in parallel, we need to track the number of reads in progress. Once all reads are done, we can call the perform again to run pending writes.
Note that it is a good idea to have the reads below the writes. If there is no lock and both read and writes are pending (happens after a write is complete), it is preferable to get through a write because a write lock is more likely to be starved because of new readers joining than a read one.

We could extend this further with features like like maximum read locks as well as timouts. These can be implemented easily by extending this method with [racing for timeouts]({{< ref "/blog/47-async-snippets" >}}) and basic bound checking.

Read-Write locks are extremely powerful. We could use them for locking access to anything. The shared data and the reader-writer problems are everyday problems in back-end code which deals with a huge number of users accessing resources in parallel. We have been saved by database transactions doing this internally but as soon as we reach a complex codebase like multi-region configuration, locking will be involved. Javascript with async await is a first class citizen in programming languages and it is ready to take on complicated programming tasks normally reserved for the lower level brethren.
