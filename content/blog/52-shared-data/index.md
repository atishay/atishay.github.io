---
date: "2019-03-20T10:00:00Z"
title: "Shared data with Async Await - Part I"
description: "Handling stateful APIs with shared data in async await based node.js with locks"
tags:
- javascript
- async-await
sidebar:
- title: attribution
  content: Photo by Oleg Magni from [Pexels](https://www.pexels.com/photo/person-holding-clear-drinking-glass-with-two-black-straws-890503/)
categories:
- javascript
series: ["Async Await"]
---

While JavaScript has strong support for asynchronous code, we rarely encounter issues related to asynchronous code as frontend developers. As soon we move to doing some back-end, we realize the inherent complexities of asynchronous programming.

## The shared data problem

One of the most important problems in asynchronous programming is the shared data or the critical region problem. To understand this problem have a look at the following figure:
{{<fig caption="Shared Data Problem" width="887" height="329" src="problem.png" class="full" >}}
In this figure we have stateful APIs from the data store with the basic access to read and write but no in-built transaction support. This type of thing does not happen with modern databases because they have transactions but we could be using raw filesystem for storage where such a thing can take place. In this example the data store has a 100 dollars in the account with two functions one that pays $20 to the account and the other than takes $20 from it.
The basic structure of both the functions is the same:

```js
async function pay(amt) {
  const currentAmount = await readData();
  await writeData(currentAmount + amt);
}

async function take(amt) {
  const currentAmount = await readData();
  await writeData(currentAmount - amt);
}
```
If both the functions are called in parallel there could be problem. Both can read and write at the same time thereby overwriting the value written by the other. In this example the readData returned $100 for both the function but the write of $80 was overwritten and the actions of the `take` method are lost.

## Using locks as a solution

The shared data problem is very similar to the problem of having two people trying to drink coffee from the same tumbler with one straw. If there is not understanding between them, it would be chaos. A solution to this problem is to protect the tumbler or the data store in case of the banking example with a lock. Only one method is allowed to use the data store at a time. This way the functions `pay` and `take` will be executed sequentially rather than concurrently and we will not face the shared data problem. In languages that are multi-threaded, locks are complicated as they need to be atomic CPU operations. Not so much in JavaScript. The single threaded task based approach of Javascript over the event driven model ensures that we can just have a regular JS variable in the main thread that instructs the disk pooler or the network card is good enough. Here is the implementation of a basic mutex lock in Javascript.

```js
let mutex = false;

async function lock() {
  // Timeout is a wrapper over set timeout that makes it async.
  while(mutex) { await timeout(100);}
  mutex = true;
}

function unlock() {
  mutex = false;
}
```

The usage of this is very simple as well:

```js
async function pay(amt) {
  await lock();
  const currentAmount = await readData();
  await writeData(currentAmount + amt);
  unlock()
}

async function take(amt) {
  await lock()
  const currentAmount = await readData();
  await writeData(currentAmount - amt);
  unlock();
}
```

This solves the shared data problem by ensuring that only instance even of `take` or `pay` could access the data at a time. While logically this solution has no issues, there is a subtle problem that this introduces which is not in the code but in the structure. In case of an exception or rejection, the unlock would never happen. While we are writing this code as a single function, no one prevents a programmer from refactoring it and making mistakes. The big rule of programming is to be safe by default and allow going to the unsafe versio only if it is essential for a certain use case. Here is a mistake that could happen:

```js
async function work() {
  await lock();
  doSomething();
}
```

The lock call could be anywhere. The problem with allowing separate `lock` and `unlock` is that, it introduces the possibility of being called individually. A forgotten `unlock` would cause a leak. The lock would not be available any more and the program will come to a halt waiting. The forgotten `lock` is more dangerous as something would happen without a `lock` and some method could `unlock` a lock acquired by someone else. These issues are extremely difficult to debug. a better solution is to disallow this two step process and provide a one step method:


```js
async function transaction(cb) {
  await lock();
  return await cb().finally(unlock);
}
```

The transaction manages the lock and unlock both for resolve and reject cases. This ensures there is no leaks or accidental unlocks sprayed around in code. This solution is saner and less error prone than the individual lock and unlock call.

## Deadlock
Deadlock is a concept when there is cyclic waits. Method `A` acquires a `lock` and then waits for method `B` while method `B` needs the same lock to continue execution and is waiting on `A` to release the lock. There is no standard way in code to prevent a deadlock. While writing code, we need to be careful to not have such a situation, by putting the minimal amount of code in a transaction and making sure we acquire all locks needed in the same order everywhere.

In the [next post]({{< ref "/blog/53-reader-writer" >}}), we will go an advanced version of the shared data problem - the reader writer problem.
