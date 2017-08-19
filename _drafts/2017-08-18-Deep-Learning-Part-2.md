---
layout: post
title: "Easy Deep Learning Part II - Finishing Problem Definition"
image: /assets/img/blog/deep2.jpg
description: "The solutions that led to deep learning are very intuitive. It grows very organically into what it actually comes out to be."
math: true
tags: [Deep Learning]
excerpt: Continue the deep learning discussion with focus on completing the intuition.
imgSrc: "[Pixabay](https://pixabay.com/en/smartphone-hand-photo-montage-faces-1445489/)"
---

This is the second part of an intended multi-part series on deep learning. You can read Part 1 [here]({% post_url 2017-08-16-Deep-Learning-Part-1 %}).

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

Now folks, this is very clever. But do stay with me. The easiest way to make a number positive and retain all the power of its score is to raise it to an exponent. The powers of a positive number are always positive whatever we do: \\(2^{-100}\\), \\(2^0\\) or \\(2^{100}\\). All are positive. Really clever right. The only difference is as pure mathematicians, we prefer to use `e` instead of `2`. It simplifies our maths a little in a process I will talk about very soon. No one stops us from using `2` and `2` will also work correctly. Let call this positive version of the score as positive score.

Now from positive score to probabilities is very simple. Just divide the positive score of being a cat by the positive score or being a cat and not being a cat. This makes `g(X)` a little bit complicated but I hope you can find the logic behind making such a function:

$$
g(k) = \frac{e^k}{e^k + e^n}
$$

where `k` is the score of being a cat and `n` is the score of not being a cat. The official name of this function `g` is softmax and it is represented in mathematics by the symbol \sigma. (Sorry for greek letters. They do scare me but mathematicians seem to love them).

This is not the only way to get the probability. There is a whole family of functions that can be used. This is just the most popular one to get proper probabilities. I will come to some other functions in a while. Also from the stupid brain analogy, this is called the `Activation` function. It is called that because if it gives a large value, the connection is active and the light bulb in our brains glows. Also `g(AX + b)` is called a `neuron` to match a single cell of the brain (we like to be so proud that we have deciphered the brain) and a network with a lot of neurons(which we will come to in a while) is called a `neural network`.

#### Doesn't this way affect our scores and all that logic?
Definitely it does. With and without this function we will get different values of `A` and `b`. But the thing is we don't know `A` or `b` and we do not care. Remember what I said about `AX + b` earlier. We are looking for the minimum equation because we already have a lot of variables. And if this requires an exponent and a sum so be it. We don't have a choice.
