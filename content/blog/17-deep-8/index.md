---
date: "2017-09-18T00:00:00Z"
description: Using ConvNets in Keras is as easy as it gets. This post shows some sample
  code.
sidebar:
  - title: attribution
    content: Image by skeeze from [Pixabay](https://pixabay.com/en/collage-africa-big-5-animals-lion-1803066/)
tags:
- Deep Learning
type: post
title: Easy Deep Learning Part VIII
categories:
- deep learning
series: ["Deep Learning"]
slug: deep-learning-part-8
---

# ConvNets on CIFAR 10

This is the eighth part of a multi-part series on deep learning. You should start with [Part 1]({{< ref "/blog/8-deep-1" >}}).

## Recap
In the previous posts we introduced neural networks, what they are and how they work as well as convolutional neural networks that provide methods to look at local information and generate the next layer by collecting information from a set of 9 neighbors.

## CIFAR-10
We have played a lot with MNIST and now it is time to introduce a much more complicated CIFAR data set. With this, we will finally fulfill the detection of "is a cat" that we discussed in our early post. In comparison to modern day data sets, CIFAR-10 is very simple. It does have a bigger brother CIFAR-100, but for now we will not talk about it. This data set consists of 50k images of 10 types of objects - airplane, automobile, bird, cat, deer, dog, frog, horse, ship and truck. This one though just has 10 classes, is a lot more complicated. All 8s look very similar but all birds are very different. Automobiles have variety of shapes and sizes, colors etc that make this a much more difficult problem. CIFAR provides 32x32x3 colored images to test against.

## Code
I am now going to put in vanilla code with very few tricks from the set I described in the previous posts. I will not be optimizing this and playing around with all the options. You will understand why in the next few posts.

```python
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import Dropout
from keras.datasets import cifar10
from keras.layers import Flatten
from keras.layers.convolutional import Conv2D
from keras.layers.convolutional import MaxPooling2D
import keras
# Load CIFAR dataset
(x_train, y_train), (x_test, y_test) = cifar10.load_data()

# Convert inputs to float between 0 & 1
x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0
# Convert output into one hot encoding (Just like before)
y_train = keras.utils.to_categorical(y_train)
y_test = keras.utils.to_categorical(y_test)
# we could have said 10 here but this allows to change to CIFAR 100 and work with the same code.
num_classes = y_test.shape[1]

model = Sequential([
    Conv2D(32, (3, 3), input_shape=(32, 32,3),
           padding='same', activation='relu'),
    Dropout(0.2),
    MaxPooling2D(),
    Flatten(),
    Dense(512, activation='relu'),
    Dropout(0.5),
    Dense(num_classes, activation='softmax')
])

model.compile(loss='categorical_crossentropy',
              optimizer='sgd',
              metrics=['accuracy'])
model.fit(x_train, y_train, epochs=20, batch_size=32)
loss_and_metrics = model.evaluate(x_test, y_test, batch_size=128)
print loss_and_metrics

```

This code should look almost the same as the first code we wrote for MNIST apart from the fact that we are using ConvNets. We start by a 3x3 conv layer, add some dropout, add a Maxpool to reduce to a 16x16 image, then convert it to a a flat list of numbers to feed into the same dense network as before. We use MaxPool as without that it would be a lot slower. It is a good time to discuss performance. Dense layers are heavy. They involve a lot of computations. They are good as they can take information to anywhere but we need to be extra careful not to use too many of them as they really slow it down. Softmax is also a heavy operation and a good advice is to reduce the number of parameters to manageable levels before involving in the complex softmax method.

## Summary
In this post we built a very simple convolutional neural network to classify the Cifar 10 images into various categories. We realized how simple the neural network engines make it to model a complicated piece of the network by just one function call.

It came out to be a short post as we did not go through many of the optimizations. The reason why we did this will be very clear when we will in the [next post]({{< ref "/blog/18-deep-9" >}}) use the model zoo to solve CIFAR-10.
