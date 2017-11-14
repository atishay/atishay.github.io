---
layout: post
title: "Easy Deep Learning Part X - Tips from the experts"
image: /assets/img/blog/deep10.jpg
description: "The best models have some real clever tricks to get through the last mile. They are worth learning."
tags: [Deep Learning]
excerpt: The best models have some real clever tricks to get through the last mile. They are worth learning.
imgSrc: "Image by Jarosław Igras [Pixabay](https://pixabay.com/en/the-intersection-way-investment-2683894/)"
related: ['dl9']
identifier: dl10
---

#### Recap
So far we have looked at dense and convolutional neural networks. Then we tried our hands with transfer learning, that is using a pre-trained complicated model and tuning it to our different data set and getting wonderful results for that data set.

In this post we look at the identifying characteristics and new techniques that we can pick up from the best papers in the image-net challenge.

#### 5x5 as two stacks of 3x3
We already talked about how two 3x3 networks are more efficient than a 5x5 network. Now is a good time explain why. Lets take a pixel. For a 3x3 filter(3 along width and 3 along height), we use 9 variables while for a 5x5 we use 25 variables. With two 3x3 layers, we got to use only 9+9=18 variables. This means the same data is represented by fewer variables that bring faster processing on the table. With more experiments we have figured out that the additional variables makes the overall model slower and does not add enough value for justifying its inclusion.

#### 1x1 Convolutions
These convolutions were popularized by GoogleNet's usage in Inception. The idea looks stupid at first. We are looking at a single pixel, how does this hold up in the growing knowledge of the network. Doesn't make any sense. We already talked about how CNNs tried to map hierarchy and 1x1 did not make sense. Well there is one thing we forgot to take note. A pixel is three colors - R, G & B. A 1x1 convolution is done to convert these three dimensions to one number. That reduces the operations required in the future 3x3 convolutions because otherwise they need to be run in all layers. This is  a useful performance optimization as you might have seen, we are already running into bottlenecks with the processing power of the machines. The relation between the RGB color space components may not be based on the location and therefore it does not make sense to put them as a part of the 3x3 convolution.
Another point to note is that these may not be just 3 layers. We could have 200 parallel 3x3 convolutions running on an image that gives 200 dimensional image which would really save a lot from the 1x1 convolution.

#### Highways and Residual Networks
One problem with making the networks very deep is loss of signal from the leaves to the root. At each stage, if you look at it, we are multiplying by a weight and therefore the early few players get weighted down by a lot of managers that have their own biases and weights which causes the information to die down. Residual networks solve this problem by creating skip level connections. If a level can skip a few managers and end information as well get feedback by a fewer levels and the overall flow of information will be much smoother. The intermediate managers do their processing but skip level managers can take the input both from the managers and the nodes that report to them. This allows the skip level managers to provide a more direct feedback and hence fix the problem of information loss. These networks are also called highway networks as we can create an information highway that allows fluid running of information from the lower level employees to the CEO.

#### Inception
Inception is kind of the next level of information sharing at least at the lower level. The concept of inception is that a the manager of a pixel should look at the results of a 3x3 as well as a 5x5 (which can be represented as two stacks of 3x3 one over other) subordinates to take a decision for that pixels and pass over. This concept can be used in tandem with ResNet and the information highway. Essentially, instead of having a 3x3 convolution, we have a single pixel, a 1x1, 3x3 and a 5x5 convolution which is used as an input to a cell that can act on the combined information. In our organization analogy, the director does not just rely on the managers but the individual employees as well (all of them for his inputs). Then his boss's boss relied on all the directors as well as the intermediate manager.

#### 7x1 and 1x7 shortcuts
After multiple experiments we are at a point where we know it is better to go deeper than wider. Therefore we have tried various approaches that reduces number of variables so that we can go deeper with the same CPU power. In the 3x3 chain, you might have noticed the redundancy where each pixel is visited 9 times so that each future pixel can take input form 9 different pixels. This seems like a good opportunity for optimization. Here comes the 3x1 and 1x3 networks. First create a single pixel from the 9 pixels by not visiting the same pixel twice. This will reduce the dimensions across the width and the height by a 3x1 filter (hence the name). Then get back to the original dimensions by a 1x3 filter. This allows stacking to continue normally. This drastically reduces the number of parameters for a look across the 9 pixels from 9 to just 4/9. Now the information cannot really travel though such a network. There will definitely be losses. We cannot really squeeze in so much information through these variables especially in the layer of 1/3rd the size. There are tricks that the network can follow if the need comes up. For example packing the information in regions or bits in the input. But yes, a lot of information gets lost. That is why inception uses this technique as there is a parallel track that passes the useful information from the lower pixel in parallel. Another thing to remember is that there is a lot of redundancy in images. If you down-sample an image, it is very likely that you will still be able to recognize the regions inside of it. SqueezeNet has also found that this technique works without the parallel inception track in some cases.

#### Summary
In this post we looked at more techniques, 3x3 stacks, the 1x1 convolution, 7x1 and 1x7 shortcuts, residual networks and the concept of inception in convolutional neural networks.

In the next post we will play more with the convolutional neural networks and look at an interesting application of convolutional neural networks - style transfer.
