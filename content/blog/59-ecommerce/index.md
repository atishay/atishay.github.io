---
type: post
date: 2019-10-17T08:32:10Z
title: "eCommerce using the JAM stack on static websites"
description: "Demo of a system where no dynamic code is written on the server and a fully functional e-commerce website is presented using a static site builder, some APIs and JavaScript"
tags:
 - Hugo
 - eCommerce
 - JAM Stack
sidebar:
  - title: attribution
    content: "Image by [Mohamed Hassan](https://pixabay.com/users/mohamed_hassan-5229782/) from [Pixabay](https://pixabay.com/illustrations/online-store-online-shop-store-3265497/)"
categories:
  - hugo
---

How many here are full stack web developers? Give a big round of applause for these guys. They have navigated the react webpack ecosystem, every growing list express-js middleware, sea of cloud services and kubernetes setup for getting scale. The web development landscape has gone devilishly complicated. Till the early 2000s we could imagine a kid with his grandma having the ability to figure it out. But the learning curve now is a really treacherous. That is why I love the JAM stack. It retains the fun of web development and moves the complexities of Servers and DevOps off to rare edge cases.

In my talk today, I will share my story about the static websites and the JAM stack, whether it is a good idea to try it out for an e-commerce application, demonstrate a working setup with no server code and talk about the cases where the JAM stack is ideal for eCommerce.

Hi, I am Atishay and work at Adobe, out of the SOMA office here in San Francisco on a variety of products from Photoshop to Capture. On the side, I maintain a VS Code extension, have a personal website and am writing a book on the Hugo static site builder - Hugo In Action.

That's me on the right starting web development. My personal website has gone a full circle from starting with frames in early HTML, migrating to PHP until I went to a hosted inflexible setup and then came back in my control with Jekyll and finally with Hugo where I found the sweet spot of great developer flexibility, overall performance and low maintenance. I loved Hugo so much that I am writing a book on Hugo which is in early access at manning.com.

Back to the original topic, does the JAM stack make sense for eCommerce. eCommerce is a perfect use case for conversion to a static website. It has hundreds of product pages that don't change often. They should live in a cache somewhere especially since they are public and hundreds of bots along with users hit them regularly. For the stuff that changes, there are already APIs used in the mobile app. We have separate systems that do inventory management, logistics and billing. Unless you are primarily in eCommerce like say eBay or Amazon, the overhead of devops, security and maintenance is not worth it. Popular pages like those from a certain fruit company don't really get changed on a daily basis. Perfect for the static website system.

Let see how we can set this up. The static pages built with markup are perfect for product pages, APIs need to be provided for the inventory management and the billing systems while JavaScript can be used to get the perfect shopping cart.

For my demo today, I have a minimal eCommerce setup using PayPal. Providers like PayPal have inventory management and cart management apart from payment. The demo I have here today is using PayPills, the shopping cart buttons from PayPal that by default look like pills. You can got to http://paypal.com/buttons to setup add to cart buttons. These generate HTML code that can be used as is or we can extract the button ID from the button and use this in our custom UI to have the button. I have a website for vegefoods where we sell vegetables. It has an eCommerce system built using PayPills. The entire website is built using Hugo and I have static pages for each product that have the description, the image and the paypal id. When you click on "Add to Cart" or "View Cart" this goes to Paypal which takes care of the rest of the pipeline and send me an email with the order details.

If you want to have a custom UI for the shopping cart or custom handling post purchase like downloading a custom file, we could write a serverless function that could talk to Paypal over the Order API or Square over GetPayment API. In this case we do the cart management in JS and when it is time to pay, pass the entire information to a lambda function that talks to the payment processor that takes over. In the interest of time, I will not be demoing this today but you will find this in Hugo in Action.

The best part about this approach is that it is scalable with load. A serverless function is perfect for the use case of being called only on a purchase completion. There is no DevOps overhead and the entire stack is buttery smooth. The JAM stack is ideal for all use cases where your primary business is not eCommerce and even if it is, a hybrid solution will reduce the DevOps overhead considerably.

Thank you.
