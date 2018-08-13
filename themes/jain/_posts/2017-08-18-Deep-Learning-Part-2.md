---
layout: post
title: "Easy Deep Learning Part II - Finishing Problem Definition"
image: /assets/img/blog/deep2.jpg
description: "We finish the mathematical equation of the core component of the deep learning network, realizing the extent of the problem and its solutions."
math: true
tags: [Deep Learning]
excerpt: Continue the deep learning discussion with focus on completing the intuition.
imgSrc: "Image by Jesse Orrico from [UnSplash](https://unsplash.com/photos/rmWtVQN5RzU)"
related: ['dl1', 'dl3', 'dl4', 'dl5']
identifier: dl2
---

This is the second part of an multi-part series on deep learning. You can read Part 1 [here]({% post_url 2017-08-16-Deep-Learning-Part-1 %}). In this post we complete the minimum equation of an image classifier that takes an image and gives us the likelihood that it is that of a cat.

#### Recap
In the previous section we defined our deep learning task of detecting if an image is of a cat via the equation:

```
f(🐱) = Probability of being a cat = y
```
where

```
f(X) = AX + b
```

Here `X` is an array of a huge set of numbers (3 million for a 1 megapixel image) and therefore A is also a huge array.

#### Outputting probability
You might have noticed once issue with the equation above. The value y needs to be between 0 & 1 as it is a probability. You never say you have a -10% confidence or are 200% sure. (We do say it but that doesn't make mathematical sense). But the maths needs a way to make sure that happens. Therefore we have to slightly change our equation to:

```
f(X) = g(AX + b)
```

here `AX + b` now gives a score while `g(X)` is a magical function that converts a score into a probability. Here are the limitations of being a probability that `g` needs to solve:
* It has to be positive.
* The sum of all probabilities (eg cat and not a cat) has to be 1.

Now folks, this is very clever. But do stay with me. The easiest way to make a number positive and retain all the power of its score is to raise it to an exponent. The powers of a positive number are always positive whatever we do: $$2^{-100}$$, $$2^0$$ or $$2^{100}$$. All are positive. Really clever right. The only difference is as pure mathematicians, we prefer to use `e` instead of `2`. It simplifies our maths a little in a process I will talk about very soon. No one stops us from using `2` and `2` will also work correctly. Let call this positive version of the score as positive score.

Now from positive score to probabilities is very simple. Just divide the positive score of being a cat by the positive score or being a cat and not being a cat. This makes `g(X)` a little bit complicated but I hope you can find the logic behind making such a function:

$$
g(k) = \frac{e^k}{e^k + e^n}
$$

where `k` is the score of being a cat and `n` is the score of not being a cat. The official name of this function `g` is softmax.

This is not the only way to get the probability. There is a whole family of functions that can be used. This is just the most popular one to get proper probabilities. I will come to some other functions in a while. Also from the brain analogy, this is called the `Activation` function. It is called that because if it gives a large value, the connection is active and the light bulb in our brains glows. Also `g(AX + b)` is called a `neuron` to match a single cell of the brain (we like to be so proud that we have deciphered the brain) and a network with a lot of neurons(which we will come to in a while) is called a `neural network`.

#### Doesn't this way affect our scores, our weights and all that logic we just built?
Definitely it does. With and without the function `g` we will get different values of `A` and `b`. But the thing is we don't know `A` or `b` and we do not care. When we learn they should be flexible enough to adjust. Remember what I said about `AX + b` earlier. We are looking for the minimum equation because we already have a lot of variables. The conditions are clear. We need a probability as an output and we should be able to weigh individual pixels. And if this requires an exponent and a sum so be it.

#### Multiples
I am adding a twist to the question. Instead of looking at the image and telling me if it is a cat, now I give you an image and you tell me if it is a cat, a dog, a horse or any other animal in the given set of `k`(eg 1000) animals that has been provided. There is a constraint that the image contains a single animal and there is always a animal from one of the known classes. How does this change the equation above. Actually not much. We can use one equation for each type e.g. $$g(A_{cat}X + b_{cat})$$ and $$g(A_{dog} + b_{dog})$$ and so on. Now in `g` the denominator can be the sum of positive scores of being a cat, a dog a horse and all the other animals. Since all these equations are similar there is no point in doing them separately. That is why in the deep learning world, you will find a single network doing this. Now `A` becomes a 2-dimensional matrix and `b` becomes 1-dimensional. We still keep the capital and small distinction and keep this multiple category information a side note. A neuron still caters to a single output. It is a **stack of many neurons** that cater to a multiple outputs.

#### Perfect answer
Back to middle school/high school mathematics. For finding out 1 million variables how many equations do we need? The answer is 1 million. For 1000 animal types, this becomes 1 billion. That is lot a of data. And remember we are still in the process of framing the problem. What we have been trying to do so far is to make the simplest and the easiest equation possible to answer a question. Add to that we don't even consider the connection between pixels. In the formula that we have so far, if you move the cat a little to the left in the image, it will wreck havocs on the weights that we have given. Lets assume each weight is a human. Now given one color you are giving the likelihood it is a cat. Of course you can guess a little. Green is unlikely to be a cat. But that's all you have. You need to see more data or interact with people who have seen other parts to make out the whiskers.
The point I want to put across is that getting a perfect answer is hopeless and going in such an endeavor is likely to be doomed. So we have to go into approximations and find the approximate values of `A` & `b` that do the job for us. There are many possible imperfect answers and we find one of those that is good enough. Two runs of the same network can give different training weights `A` and `b` and both of them are approximate.

#### Summary
We have come a long way from where we started although the maths doesn't look much different. But now that you are here, you would be realizing that deep learning is no magic and we are not messing up with the brain. It is high school mathematics just scaled to a million parameters. We went through how a neuron can be defined as the simple equation - `g(Ax + b)` where `A` is a set of weights for each pixel, `b` is a bias we added to help have some control initially and `g` is the activation function like softmax that converts output weight to a probability.

In the next part we will go into the `training` phase of the network describing how to use the equation we just came up with. To go to the next part click [here]({% post_url 2017-08-21-Deep-Learning-Part-3 %}).
