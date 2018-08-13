---
layout: post
title: "Easy Deep Learning Part V - Lets go Deep"
image: /assets/img/blog/deep5.jpg
description: "Making the network deeper"
tags: [Deep Learning]
excerpt: Lets make the network actually deeper. Understand how the maths changes - Or does it?
imgSrc: "Image by mh-grafik from [Pixabay](https://pixabay.com/en/the-well-the-depth-of-the-bricked-1378979/)"
related: ['dl4', 'dl8', 'dl6', 'dl7']
identifier: dl5
---

This is the fourth part of an intended multi-part series on deep learning. You should read [Part 1]({% post_url 2017-08-16-Deep-Learning-Part-1 %}), [Part 2]({% post_url 2017-08-18-Deep-Learning-Part-2 %}), [Part 3]({% post_url 2017-08-21-Deep-Learning-Part-3 %}), [Part 4]({% post_url 2017-08-22-Deep-Learning-Part-4 %}) before heading over here.

#### Recap
In the previous sections we defined our deep learning task of identifying the contents of an image:

```
g(AX + b) = Probability of being a content type
```
where `X` is the huge matrix that makes up the image and A are the weights, b the biases and g is the function that converts scores into probabilities like softmax.
We realized that the traditional way of solving equations does not work well with this case and therefore we described SGD as a means to solve the equation to get `A` and `b`. Then we wrote the code for the same using Keras.

#### Limitations with our equation
Let us congratulate ourselves for solving the seemingly impossible problem on the previous post. Now for some reality check. The current equation is very basic and does not solve many cases. Here is why:
* The information in the neighboring pixels is not shared and therefore all weights are on individual pixels.
* The global information about the entire contents of the image are also not available.
This makes it harder for complicated models. A cat is a lot more complicated than a digit.

#### Intuition behind depth
Now for the time being forget that you are someone reading the post. You are now the manager that manages the vision in the eye. Now you want to recognize a cat. The first thing you would do is to find a team. Then to this team you would divide work. Team A - try finding the whiskers, Team B - The ears, Team C - the eyes and so on. And then based on the results of what those teams find and adding your own personal belief you will give the probability to the user. And back propagation works the same way. You punish those people more whom you relied on the most if they made a mistake. Also you can now also play the majority rules game where if the ear team does not find the ear, but the others say, it is a cat, well it might be a cat wearing headphones. So they might just be missing ears or our ear folks are wrong and if this turns out to be a cat, they will be punished.
So the passes remain the same, we just ask the teams for their probabilities and then decide. The code is also very similar. Here is the set of equations:
```
g(AX + b) = X'
g'(A'X' + b') = y

```
You might have seen in the code already, the model consists of just these equations for the forward pass.

The other intuition comes from statistics. The original equation is very close to linear regression (which in 2D space is fitting a line). As you can expect, the images are a lot more complex and we cannot divide them into is cat or not with a line.

#### Why g & g'?
Now we don't necessarily need probabilities and we could work with scores right. But let me show you the maths again:
```
AX + b = X'
g'(A'X' + b') = y
Substituting X'
g'(A'AX' + A'b + b') = y
```
Now `A'A` is a constant and `A'b + b'` is another. And we haven't earned anything. `g` and `g'` are both essential. The function `g` in a neuron provides a way to make the method non-linear, and is therefore called **non-linearity** apart from the activation that we already defined it with. The neural network we just created is two **layers** deep. A strong neural network can have hundred of layers.

#### Isn't the back propagation affected?
Well that is why we found the formal method with calculus. There is a chain rule in calculus that makes this very simple as we multiply gradients until we get to the right weights to update.

#### Shall we make it deeeeeeeeeeeep
Mostly deeper networks do produce better results. But there is a limit. You can see this in organizations from our analogy too. The longer the management hierarchy, the more is the signal loss from the lower down to the higher ups. In a neural network during the back propagation steps, each time we go a layer deep we have to multiply with the weights of the next layer. After a few hundred layers the product of these weights make the updates so small that the initial few layers live on with their starting random weights for a long time. This is one form of the so called **Vanishing GRadient** problem. The data requirement increases with the depth of the network. If we really want it deep, it gets a lot more hungry. That is why the state of the art networks take weeks to finish training on the fastest GPUs and need huge data sets. There is one more reason attached to the same thing. The number of parameters in A & b as they increase, well the model has a lot of leeway and after some time, it actually gets enough parameters to fit the entire data set in the if this image then this kind of a equation. Then we have the same old over fitting problem. So going deep is good, until some depth.

#### Lets see some code
Well, the beauty of the libraries that we use is that, going deep is fairly easy if we do the basic thing. The only code change that `keras` really minimal.

```python
model = Sequential([
    Dense(units=1000,input_dim=784),
    Activation('softmax'),
    Dense(units=10, input_dim=1000),
    Activation('softmax'),
])
```

We have brought 1000 teams that see the initial data and we take input from those 1000 outputs. This will run very slow. We will get to speeding it up and improving it in the next post.

#### Summary
In this post we talked about how we can all more variables and allow the equation (from now on called a model) to be more complicated by having a chain of layers. We also discussed why it seems like a good idea and how we can get the model made deeper in keras.

In the [next post]({% post_url 2017-08-29-Deep-Learning-Part-6 %}) we will talk about how to solve some of the problems and roadblocks we hit by depth and some common tricks we can use to get improvements.
