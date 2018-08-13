---
layout: post
title: "Easy Deep Learning Part VI - Contracts, Options and Futures"
image: /assets/img/blog/deep6.jpg
description: "Talk about parameter changes, initialization, dropout and other regularization."
tags: [Deep Learning]
excerpt: Defaults are good, but playing with them can eek out the next 2% that we are looking for.
imgSrc: "Image by Arek Socha from [Pixabay](https://pixabay.com/en/doors-choices-choose-open-decision-1767563/)"
related: ['dl8', 'dl5', 'dl9', 'dl7']
identifier: dl6
---

This is the sixth part of an intended multi-part series on deep learning. You should read [Part 1]({% post_url 2017-08-16-Deep-Learning-Part-1 %}), [Part 2]({% post_url 2017-08-18-Deep-Learning-Part-2 %}), [Part 3]({% post_url 2017-08-21-Deep-Learning-Part-3 %}), [Part 4]({% post_url 2017-08-22-Deep-Learning-Part-4 %}), [Part 5]({% post_url 2017-08-24-Deep-Learning-Part-5 %}) before heading over here.

#### Recap
In the previous posts we came up with the equation of a neuron to be `f(X) = g(Ax + b)` and talked about how we can stack one neuron over other to get a chain and make the network deep. We also talked about SGD and how we can slowly change our random parameters to get to the correct answer by going in the direction of the gradient. We also talked about how over fitting prevents us from going deeper adn also the fact that deep learning is slow and most of the difficulty is that machines are not fast enough.

#### Regularization
Now that we know over fitting to the data is a problem, we need a way to prevent that from happening. If you are still in the world of the cat eye teams, you would call me stupid. Because your task was to classify the given images correctly and you are doing that, and getting great outputs. Now you follow the contract word by word and I don't get what is needed means that I have to mess with the contract and change it to reflect what I want. So what do I want. I want you to give correct output for images you have never seen. How do I go about to do that? By preventing you from making your output too specific.
The answer is to force our outputs to be uniform. We don't want it turn most `A`s to zero and only take a few inputs. What we want from the `A` and `b` to be mostly uniform. Therefore we change our loss function. Well dear maths, don't just optimize for giving the right probabilities, optimize for giving these `A` and `b` as uniform as possible so that it generalizes.
We use sometimes the L1 loss which is the average of the values of A, but mostly L2 loss is better (average of squares) so that the -ve and +ve values do not cancel each other.

#### Dropout
Another trick to get a good improvement in the models is dropout. The key concept is very simple. Say you are again managing a team looking at the picture of a cat. If in all training examples cats have ears, you will assume that without ears a cat cannot exist. Now in the real world, if you find an image of a cat with headphones, you are likely to label it not a cat. This is the same over fitting problem we talked about earlier. In dropout we solve it by cheating. After seeing an image, we randomly select some teams to walk out and not give any feedback. Now we are left with a smaller number of teams and we learn to understand that we cannot rely on just one signal to identify. This diversification makes our network stronger. Mathematically we just need to set all `A` and `b` to `0` in a neuron we want to disable. It would be dead in the rest of the calculation. In most libraries drop out is just a function call. So there is no likely reason to reject that.

#### Activation Function
We used softmax as our activation function for the inner layer. Now the network can work with scores and doesn't need to emit probability. That means we have a lot of other options inside. The most popular one is ReLU. ReLU has a very simple concept. It sets the score to 0 if it is negative and lets it pass through otherwise. This gives a lot of advantages. For all continuous functions, there is no clean way to say - "This factor is irrelevant". With the slow gradient it really will take some time before we get close to zero and we will never get to say 0. ReLU is fast. We do not need logs any more and therefore the computation gets real quick. Unless you are a researcher, ReLU should be the default middle layer.

With softmax the sum of probabilities has to be 1, which means a neuron can give only one useful signal. Now suppose we had both cat and dog in the picture, softmax would get lost. In this case a sigmoid would be better. Sigmoid gives us a number between 0 and 1 and we can treat is as a probability even though it may not be exactly the same. (I won't go into what makes sigmoid, but if you read the theory, you can easily understand how it squashes the inputs to be between 0 & 1. It again comes from statistics' world of logistic regression).

#### Initialization
I already played a trick on you when I said random initialization. Why not `0`? Why not anything else? Well, this requires research and experimentation. Xavier et. al did that and found an initial state that works better(glorot_normal). The exact theory you don't really need to know. It is a better parameter for softmax in most cases and worth being the default. For sigmoid, 0 is a good default. This initialization theory has been subjective and may not yield better results but do serve a better default anyways.

#### Faster descent
Now SGD is very good but it is slow. The reason is that it moves one step at a time. Therefore we may take a lot more time to reach optima than we can if we move faster. The solution that was discovered was momentum, i.e. move faster in the direction of change if we are going in the same direction as before. If most previous images are decreasing a variable, maybe we can decrease it more and get faster. Of course you can overshoot and the rest of the images will bring it back. Momentum gives a good boost over raw SGD. The overshooting problem was later solved by other methods and we should be using ADAM to get to the results faster.

#### Learning rate and decay
The learning rate we talked about is defined in keras, but the default decay is `0`. Adding some decay can get a little bit closer to the local optimum than before.

#### Validation
You might have realized that for all these options require a lot of trial and error to be optimized. If we are experimenting, it is a good idea to split the training set into a training a validation set. We can then use the training set for training, validation set to try out various hyper parameters and the test set for the final verification before putting the code to production.

#### Code changes
Again all the numbers I have put in are hyper parameters and playing with them you might find better results. This post is to introduce the options that you have not find the optimal for MNIST. Let us put all these in code.

```python
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Activation
import keras
import numpy as np

(x_train2d, y_train), (x_test2d, y_test) = mnist.load_data()

x_train = x_train2d.reshape(-1, 784)
x_test = x_test2d.reshape(-1, 784)
y_train = keras.utils.to_categorical(y_train, 10)
y_test = keras.utils.to_categorical(y_test, 10)

model = Sequential([
    Dense(units=1000,input_dim=784, kernel_initializer='glorot_normal', kernel_regularizer=regularizers.l2(0.01)),
    Activation('relu'),
    Dropout(0.4),
    Dense(units=10, input_dim=1000, kernel_initializer='glorot_normal', kernel_regularizer=regularizers.l2(0.01)),
    Activation('softmax'),
])
model.compile(loss='categorical_crossentropy',
              optimizer='adam',
              metrics=['accuracy'])
model.fit(x_train, y_train, epochs=20, batch_size=32)
loss_and_metrics = model.evaluate(x_test, y_test, batch_size=128)
print loss_and_metrics
```

#### Summary
We are a long way from the `AX + b` that we started with, but the changes are all minimal and incremental and conceptually nothing much has changed. Here we talked about some of the options that we have while starting with the model how to tweak the defaults.

In the [next part]({% post_url 2017-08-30-Deep-Learning-Part-7 %}) we will figure out the way to use some of the local information in the image and get some great improvements via another of the buzzwords - Convolutional Neural Networks.
