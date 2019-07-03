---
type: post
date: 2019-05-12T00:00:00Z
title: "Running node.js on customer machines."
description: "Cloud Native for the user is native performance and cloud features - Presented at Cisco DevNet create 2019."
tags:
 - cloud-native
 - performance
 - cloud
 - native
sidebar:
  - title: attribution
    content: "Image by [Gerd Altmann](https://pixabay.com/users/geralt-9301/) from [Pixabay](https://pixabay.com/)"
---

Hello everyone. My name is Atishay and I am a JavaScript developer. A few years back, if I said this, someone would have thought - what's this guy doing in a Cisco conference. Will he be going to a lawyer's conference next to preach them to convert from legalese. The web developer community has changed a lot from the cult of people copying and pasting scripts from google. We have matured to a package manager. Jokes apart, the modern JavaScript looks nothing like the one from the 90s and the programming paradigm built from ground up to be asynchronous has a lot to offer. With node.js having a serious footprint on the server, especially in the serverless world, no one needs to defend the language. I'm not here today to sell you JS. I am here to talk about a unique style of designing cloud native applications getting popular in the JavaScript world. The entire programming community needs to take a note of this.

Today I will talk about my journey into application architectures. I will talk about two definitions of cloud native and how they can be brought together. We will see how the cloud native revolutions fits historically in computing. We will then go into the role of JavaScript and node.js. I will try to justify my title by giving reasons and caveats of running node.js on customer machines and leave you with the knowledge of a new computing paradigm which may be best fit for your use case. Success it not always what it seems to be. With computing paradigms shifting fundamentally every decade, we need to be open to possibilities and inspiration from the unlikeliest of sources. The frontend community is one of them.

As a developer I have worked on most major computing platforms prevalent. I have worked on industry defining desktop applications, distributed full stack web applications both on premise and on the cloud as well as award winning mobile applications. With this variety of product experiences I have been able to witness the transformations that one area has had on the other. While developers and designers continue to club these experiences together, these three platforms remain unique. The users expect power on the desktop, cross-device synchronization on the web and ease of use on the mobile. The development of applications that targets all these platforms requires a fine balancing act between features that the users expect and those that ease in the development and maintenance.

One major development in the cloud has been the migration to the cloud native architectures. Raise your hand if you understand cloud native as a developer. Raise your hand if you find the cloud native as a simplification over the traditional approach to service development. Cloud native has turned into such a big thing for development teams. Here is a diagram describing cloud native for developers who are still uninitiated. Cloud Native has four pillars. When developing an application in the cloud, we should not be writing it like we do for a on-premise system where provisioning resources is so difficult. 5 layers of approvals to get a hard drive. In the cloud we can acquire a new server by the click of a button. The bigger servers are not necessarily better any more. We lose the advantages of an multi-region, multi-az and multi-cloud by having huge services that are difficult to setup and scale. Micro-services are easier to manage and maintain. In the cloud provisioning can be done by code. Why do it manually each time. DevOps is the second pillar of a developer's cloud native. Containers provide an opportunity to have an exact replica of the production environment locally. That way we can restrict production server access. I love to SSH into production as much as you do. But I fear someone putting whisky on the delete key of my keyboard. You should too. The final pillar is continuous delivery. That brings the fun into development. I deployed for the first time to production two months after joining my job. Your intern could do it on his first day.

We all know what Cloud Native means for the developer. The question is - what does it mean to the customer. Gimme it a few seconds. "Seriously?". Whatever that comes next may be cloud but is surely not native. That is a big problem with our approach towards moving the solution to the cloud. People know that the web is slow. If web pages show loading indicators, customers are able to accept it. But they don't call them native. For the customer cloud and native are different. Cloud offers synchronization, collaboration and instant updates. They expect native apps to have near real-time performance, ability to handle flaky networks and full offline support. We cannot call it native if it doesn't work in a moving vehicle or if it reminds us with every click that it has to go to the server. Even these web "apps" with 100 gigabytes of javascript make us wait. Mobile apps that authenticate with my face or my finger need to talk to the server to let me in. Native desktop apps, never had this problem until now.

How do we solve this problem? Can we make the cloud truly native for both the user and the developer? Here is a combined list of requirements. This is a lot. We want developer flexibility. The users want cloud features and native performance. This is like the heisenberg uncertainty principle. You cannot have all three. We are fighting with the laws of physics. Light moves too slow. We need to reduce the distance to speed it up. We start moving to a multi-cloud architecture where the full processing moves closer to the user. Then we get to CDNs where some resources come even closer. And then we added edge computing so that we could do some basic processing at the edges. This speeds things up making a faster cloud but it is still not native. What do we next? Go to the PM and say, this cannot be done. Or do what engineers do best - hack through it. Programmers have this interesting concept called Duck Typing. And we can make anything a duck by relaxing the definition of a duck to be just quacking or laying eggs. We need to relax all of these constraints to get what we want. The answer to the users version of cloud native lies in developer's cloud native. This is microservices in cloud native. We have the main region, the multi-cloud sub-regions and the edges. All have microservices that perform tasks that can prevent unneeded trips for the light. What if we could get a microservice inside of the customer's machine.

On the surface, this seems like a bad idea. We have lots of questions. How about security, updates, or supporting offline.  But if we are shooting for the customer's cloud native definition, we have to be clever about it. We need to relax our definition of cloud native to achieve all this. Lets answer the big questions. Security - the browser where the customer reads the data is already on the customer's machine. If the machine gets compromised, there are much bigger problems than our data like the passwords in the browser's storage. We can have our data encrypted at rest. We can updates on launch. Should the software stop working if it has not been updates and the user is offline? When it gets online, it can auto-update. The challenge of truth on the cloud is a bigger one. On a flaky or non-existant network, the cloud data may be stale. We already deal with this challenge in multi-cloud. Hard but not impossible. And the person on the other side of the screen is no chimpanzee punting on the keys. If we explain the status of the cloud sync properly, they do understand. Nothing changes in continuous delivery apart from the need to support updates from older versions for users that come back after months. The offline support we add can actually be a lot. It would be surprising to know how little data, a user needs on day to day basis. A simple LRU cache and a temporary cache storage for entered data that gets synced to the cloud will make the app feel native for majority of the use cases. Look again at the requirements. We can see how all of them can be met not to fullest but to an acceptable state. When online, you get almost 100% cloud native but when offline, the app is still functional.

Before going further and giving a homage to the history of computers lets put this change in perspective. In the early days, computing was difficult and we used to have machines like the Cray-1 upstairs that did magic and people used to time share it. Then machines became more powerful and the people got their own personal computers. Then we found use cases where we need data together and with browsers and mobile we had weak clients which were not good enough. From here we look into the future to see where the paradigm goes. If you look carefully, we are actually moving in circles. First the technology is expensive and we need a centralized server and then it gets cheap enough to provide flexibility to use is where you like. The cloud has shifted the pendulum away from flexibility and it has to shift back. And we do have a lot of power. Your wrist watch has more computing power than Cray-1. The phone that you would get for free with your data connection is more powerful than the entire cluster used to render the original Toy Story. It may be a difficult technical thing to do but so was provisioning a server from a single HTTP call. Until it wasn't any more.

I said at the start that I am a JavaScript developer. Why am I the messenger for this major change? Because JavaScript is a cloud first programming language. Cloud is natural to its asynchronous core. The challenge for JS has been native and the browser vendors have been working hard to meet the user's definition of cloud native. What do they have to make this possible? Service workers. Service workers are those shared micro services within the browser that the servers control. They follow to most extent the definition of cloud native. They are microservices, deployed via code, sandboxed in a container setup by the browser which get updated by the latest version automatically. The experience works offline, they can LRU cache the pages, as well as the store the content in index dbs which can sync to the server when the user comes online.

Was that it? All this talk just to introduce service workers. No, there is a lot more. Service workers show the concept but we can do a lot more if we do a proper daemon. You can do cross app communication. You can upload data hours after the user has clicked the save button, update when the user is not using the app. They don't even have to think about it. It just works. We use node.js to create a service worker like daemon at my team. It is a true microservice acting as a server endpoint to the apps that you might have on your machine. It does some processing locally, provides data when the user is offline as well as collects user data to sync when the internet is available. Most of the time, the app does not even need to know or care about the fact that it is offline. The cases where the daemon does not have data requested are the only ones where the absence of the cloud impacts the user. The user can know that saves and syncs are happening but there is no wait if the data is present in the local cache.

These are the reasons for choosing node. Server technology is optimized to run 24x7. It is a single binary with a lot of text files and provide a good platform for the I/O intensive workload that the microservice does. And we can meet most definitions of cloud native. We don't have the ability to ssh into prod and have a proper ops cycle and a release management team. It is a microservice by definition. What about continuous delivery. Things like puppet and chef are not meant for customer machines and for that piece we had to rely on our general desktop release infrastructure. There is auto-update in electron but nothing in node. Lucky for us, we already had the desktop update infrastructure at Adobe that we could piggyback on. And containers, well we could never get to containers because they are not built for a workflow like ours. The technology is maturing and I am confident future containers will be a lot stabler on windows and MacOS, with a minimal overhead and they can be packaged and shipped as daemons on the desktop.

That leaves me to talk about the ugly side of the picture. Apart from the fact that it a lot of hard work to setup a microservice on a customer machine, there are issues with server technology on desktop. The defaults are all made for the server where a gig of RAM is a lot on the client. Node has no support for features like proxies that servers don't face. Node does not look like a traditional desktop service that is an exe with a few dlls. These are costs associated with doing something outside of the standard development track. As more and more of the develop community realizes the need for this approach, these costs would go down. The server technology is versatile and these one time costs provide a substantial benefit.

All technical approaches are bad ones if applied to the wrong problem. It all depends on the use case. The thing that we should remember as cloud native developers is that cloud and native are two different demands from the end user meeting which is fighting with the laws of physics. Once solution is duck typing by provisioning a microservice in the customer's own hardware. Server technology like node.js is best suited for this job even though it will need work.