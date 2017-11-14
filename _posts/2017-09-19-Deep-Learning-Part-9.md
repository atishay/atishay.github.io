---
layout: post
title: "Easy Deep Learning Part IX - Using the model library"
image: /assets/img/blog/deep9.jpg
description: "The real power of deep learning is reuse - Stand on the shoulder of giants."
tags: [Deep Learning]
excerpt: The real power of deep learning is reuse - Stand on the shoulder of giants.
imgSrc: "Image by StockSnap from [Pixabay](https://pixabay.com/en/architecture-building-infrastructure-2602013/)"
related: ['dl8', 'dl10']
identifier: dl9
---

This is the eighth part of an intended multi-part series on deep learning. You should read [Part 1]({% post_url 2017-08-16-Deep-Learning-Part-1 %}), [Part 2]({% post_url 2017-08-18-Deep-Learning-Part-2 %}), [Part 3]({% post_url 2017-08-21-Deep-Learning-Part-3 %}), [Part 4]({% post_url 2017-08-22-Deep-Learning-Part-4 %}), [Part 5]({% post_url 2017-08-24-Deep-Learning-Part-5 %}), [Part 6]({% post_url 2017-08-29-Deep-Learning-Part-6 %}), [Part 7]({% post_url 2017-08-30-Deep-Learning-Part-7 %}), [Part 8]({% post_url 2017-09-18-Deep-Learning-Part-8 %})before heading over here.

#### Recap
In the previous posts we got to understand the intuitions behind regular(dense) and convolutional neural networks. Now it is time to see why we could skip all that.

#### Transfer Learning
Building neural networks from scratch is a great way to learn the details of how they work, but there is a much better way if we are looking to apply the principles in practice. We talked about when we introduced convolutional neural networks the fact that we can start with the path of 9 pixels and then collect the information from there. The key point in this architecture is that there is not a lot of differences in 3x3 patches of images from many different categories. So if we have a good enough database of real life images ([imagenet](http://image-net.org) is one such database), we should have the most practical 3x3 patches covered. That means we can reuse the weights from this learning on a new task.
The concept of reusing parts of the model from some of the state of the art trained models is called **transfer learning**. This is very powerful. This instantly makes deep learning very accessible. You do not need tons of CPU power and a huge data set to get going on a specific problem. You can tune some of the most complicated networks to work reasonably with very little data.

#### Model Zoo
The concept of model zoo is to have a place where we can download pre coded and pre trained models for common tasks. Keras comes in with a built in set of certain models.

#### How do we transfer the model?
If you are training the model to recognize an image, you need to change the set of classes or categories you are grouping the images into. The way to do that would be to change the last layer to group the images into a different set of classes and then retrain. You will notice that in many state of the art models, the last few layers are dense. This is because the early few layers summarize the local information into meaningful chunks that can be properly classified by the equations in the final layers. And it is that summary that needs to be reused. Therefore we knock off the final dense layers and replace them with a fresh set of dense layers that train with the new data that we have.

#### Freeze
There is one more concept that is very important in transfer learning. Say you have very little sample data. Now if you change the scores at the first few layers during your training phase (by taking the pre-trained weights at just initialization) and using the new model that you generated using the pre-trained one, there is a high chance that you end up throwing out a lot of use cases that the initial model cover and you did not. Since the data set is small, it may not have all examples of 3x3 patches that may be present in the real world where this sample is to be used. And during training, you might throw down the better weight a present in the initialization. Therefore it is a good idea to freeze the initial part of the network. Now how much you freeze depends on the data you have. If you have a lot of data, freeze the least. If you have very little freeze most of the network and your trained model will handle more cases that your data has.

#### Cifar 100
The models are so good that CIFAR 10 is not really a challenge. So we are going to go to its bigger brother CIFAR 100 where we will realize that even a set of 100 classes is a cinch for Xception neural network.

#### Code time
```python
from keras.applications.xception import Xception
from keras.layers import Dense, GlobalAveragePooling2D
from keras.models import Model
from keras.datasets import cifar100
import keras

# Load CIFAR dataset
(x_train, y_train), (x_test, y_test) = cifar100.load_data()

# Convert inputs to float between 0 & 1
x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0
# Convert output into one hot encoding (Just like before)
y_train = keras.utils.to_categorical(y_train)
y_test = keras.utils.to_categorical(y_test)

# Download the Xception model.
base_model = Xception(weights='imagenet', include_top=False)
# add a global spatial average pooling layer. Just like
# maxpool takes and average.
# You can use maxpool here as well, hardly makes a difference.
x = base_model.output
x = GlobalAveragePooling2D()(x)
# let's add a fully-connected layer
x = Dense(1024, activation='relu')(x)
# and a logistic layer to the 100 classes
predictions = Dense(100, activation='softmax')(x)

# this is the model we will train
model = Model(inputs=base_model.input, outputs=predictions)

# first: train only the top layers (which were randomly initialized)
# i.e. freeze all convolutional Xception layers
for layer in base_model.layers:
    layer.trainable = False

model.compile(loss='categorical_crossentropy',
              optimizer='sgd',
              metrics=['accuracy'])
model.fit(x_train, y_train, epochs=5, batch_size=32)
loss_and_metrics = model.evaluate(x_test, y_test, batch_size=128)
print loss_and_metrics
```

The code is terse and clear. I don't think there is much commentary to add. The comments explain everything.

#### Summary
In this post we reused a pre-existing model and transferred the learnings into the Cifar100 model that we built and trained. The concept of transfer learning is very important in the deep learning toolkit. It provides ways to train using minimal data and get some great results.

In the next post we will discuss some of the pieces of the pre-existing models so that we can learn from their tools to improve our trade.
