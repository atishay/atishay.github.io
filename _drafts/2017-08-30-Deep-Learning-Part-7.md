---
layout: post
title: "Easy Deep Learning Part VII - Convolutional Neural Networks"
image: /assets/img/blog/deep7.jpg
description: "Talk about parameter changes, initialization, dropout and other regularization."
tags: [Deep Learning]
excerpt: Defaults are good, but playing with them can eek out the next 2% that we are looking for.
imgSrc: "[UnSplash](https://unsplash.com/search/photos/swirl?photo=aQcE3gDSSTY)"
---

This is the seventh part of an intended multi-part series on deep learning. You should read [Part 1]({% post_url 2017-08-16-Deep-Learning-Part-1 %}), [Part 2]({% post_url 2017-08-18-Deep-Learning-Part-2 %}), [Part 3]({% post_url 2017-08-21-Deep-Learning-Part-3 %}), [Part 4]({% post_url 2017-08-22-Deep-Learning-Part-4 %}), [Part 5]({% post_url 2017-08-24-Deep-Learning-Part-5 %}), [Part 6]({% post_url 2017-08-29-Deep-Learning-Part-6 %}) before heading over here.

#### Summary
By now you should be comfortable with what a neuron is, what a neural network (or a stack of neuron means). We have so far described a neuron to represent `g(AX + b)` which was chained together in multiple layers that created a deep network. Next we talked about concepts like dropout, different activation function, regularization and different initialization to get better results.

#### What is missing?
When I described the core concept of having depth, I talked about teams looking at different parts of the image adn giving a decision. But when we implemented it, we created a dense layer where everyone looks at everything. And we know that that may be a bad use of resources. Most information in the image is associated close to each other. Randomly arranging the eyes, nose and ears won't make a face and looking at random places for that is definitely not a great idea. Therefore it makes sense to have teams  look at small parts and then take their decision. The next question would be team size. The bigger the teams, the closer we get to the problem. Therefore its better to start with the smallest teams and look grow them if things don't work well. So what is the smallest team size. An image is two dimensional(actually 3 because of RGB, but since the third dimension is so small, we don't really talk about that in our convolutions here) and therefore, we need a 2D convolution. The smallest symmetrical one is everyone looking at one pixel. But then we can't build a heirarchy

#### Ideas from classical computer vision


#### Convolutions outside images
