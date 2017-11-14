---
layout: post
title: "Easy Deep Learning Part I - Defining the problem"
image: /assets/img/blog/deep.jpg
description: "Deep learning is a complex name to a much simpler set of mathematical equations. Here we start with defining what the problem is."
tags: [Deep Learning]
math: true
excerpt: Understand deep learning starting with high school mathematics.
imgSrc: "Image by Damir Belavić from [Pixabay](https://pixabay.com/en/search-math-x-unknown-1975707/)"
related: ['dl2', 'dl3', 'dl4', 'dl5']
identifier: dl1
---

This is the first part of a multi-part series on deep learning as I sort my thoughts around the learnings in the last 1 year and put them here for my memories and help fellow humans get rid of the fear of the mechanical brain. In this part we describe what deep learning is and start formulating an equation for the image classification problem in deep learning.

#### Disclaimer
Before you go on to read my post, do understand that this is a set of intuitions to make a layman understand the concepts. Some of the concepts have been modified, wrangled and some have been omitted just for the ease of understanding. Take all of what comes next with a grain of salt. I do start with the very basics but do build up very quickly. So if you find something to slow and boring just skip a few paragraphs.

#### What the hell is Deep Learning? What does it do?
Let me start by calming all fear. You might have heard a lot about AI replacing jobs, superhuman robots coming in to kill us all. Now deep learning and the new AI rush is not about all that. That is the marketing that the media is putting at us all. Deep learning is just pattern recognition. We show a machine millions of photographs of a cat and also show it photographs of what is not a cat. Then we ask it with another photo. "Is this a cat?" The machine now is capable of answering that with some degree of confidence. It is true that a lot of what we do in daily life is pattern recognition and machine can be the assistant like it always has been. It will tell us what it feels the pattern is and then we will verify and decide the action to take.

#### A sample problem
For the sake of understanding lets pick up a problem of classifying an image. Here given an image we want to know if the image is of a cat. The same concepts apply to other pattern matching problems. This is the signature problem of artificial intelligence, one of the most complicated pattern recognition that humans and animals do so easily millions of times in a day. Again not superhuman machines coming to kill us all, just a small piece of the way our eyes work.

#### What is an image?
The question for you - mathematically - What is an image? An image is a set of pixels. A pixel is a box of color. A 1 megapixel image contains 1 million pixels. Now what is a pixel - A pixel is a set of three colors - Red, Green and Blue. Remember your art classes - Primary Colors. All colors can be made by mixing by various amounts of these primary colors. Due to the way computers are designed each color is represented by a number between 0-255. No other reason - just limitations of the machine. So a 1 megapixel image would be 3 million numbers between 0 and 255.
Now thinking a mathematical equation with 3 million number is a little two difficult. So instead let us put them in a variable `X`(we will later see how `X` is 3 billion numbers).

#### Basic Mathematics
Now with the `X` we just defined, we need an equation to find `y` given `X`. Lets start with the simplest equation possible.

```
y = f(X)
```
where

```
X = 🐱
```
```
y = Probability of being a cat.
```
Now we need the simplest `f(X)` possible(we are dealing with a million numbers). Here is the simplest one(see below for why):
```
f(X) = AX + b
```

This is very simple mathematics from middle school. I hope you remember solving equations like `3x + 5 = y` where `x = 3`. Then we figure out that `y = 14`. This is the same thing.

I hope you are still here with me. We looking for a function `f(X)` such that if `X` is a photograph the function would return the likelihood that it contains a cat according to the knowledge that is built into the function. We came up with one possibility.

#### Statistics
This is the same equation as fitting a line though a set of points in X as used in linear regression with statistics. Machine learning is stats on steroids.

#### The true equation
Here is the equation: `f(🐱) = Probability of being a cat.` Now here the image, `🐱` is 3 million numbers. Naturally A has to have 3 million numbers as well. So the true equation actually will become:

$$
a_1x_1 + a_2x_2 \dots a_nx_n + b = y
$$

But we can live in matrix form. This makes the life easier. We can write it like - `AX + b = y` where `A` and `X` are matrices, `X` representing an image and `A` a set of parameters. I know matrices get into complicated land. But you don't need to go deep right now. You might have noticed I used capital `X` and a small `y` and similarly capital `A` and small `b`. That was the idea all along. Capitals are matrices.

#### Why `AX + b`?
I know you might be wondering, where did this equation come from? And why only this? How come this is the simplest one? Now is a good time for me answer that question. And the answer is very simple. We know an image has a million pixels and we want each pixel to count. There is one desire that we also have - each pixel should have the possibility of a different weight. A portion of the image defining the sky is not as helpful in determining if the image is a cat but a whisker surely is. So we need different weights for each pixel. That gives us a bare minimum equation where we have `AX`. Now adding a `b` has some very little cost. It is just a number. But you will see later this `b` gives us a lot of power and control. We can use `b` to balance out some of the initial values of `A` and make the results cleaner and easier to work with.

#### Why Probabilities?
You would be imagining why the right hand side of the equation are probabilities. They could be discrete yes or no answers. You normally want `f(🐱)` to say "Yes this is a cat." In the early days (1950s) that approach was tried in something called a "Perceptron". It is very easy to guess why those would not work. We all know there is no white and black. There are millions of illusions, cats that hide in the environment, dogs that look like cats and so on. If we can't be a 100% sure, why should we expect the mathematical equations to be. It is more practical to ask how likely the equations match and then we can improve the formula to give us better values.

#### Twist

There is one twist to the equation above that needs to be clarified before we go ahead. The question that I want you to think about is what are we trying to find? In traditional mathematics the answer is always `X` or `y`. But in this case the situation is slightly different. We do need to find `y` for a given `X`. That is - Given an image(X), what is the probability(y) that it is a cat. But we don't know the values for `A` and `b` to plug into `AX + b`. Instead we have some samples that have the correct `X` and `y`, and based on those samples we will first find `A` and `b`. Then we go back and look for `y` for another `X` whose `y` we do not know.

Let me rephrase this for folks that might find it a little bit confusing. (And yes it is.) `A` and `b` are the known constants of the equation which will help us find `y` for a given `X`. If we know `f(X)` we can plug in any `X` and find the corresponding `y`. But we do not know the magical `A` and `b`. So we first use the known values of `X` and `y` to find approximate values of `A` and `b`.

Therefore there are two phases in a deep learning setup - The **training phase** and the **testing** phase. The machine first see a million cat images(`X`) where `y = 1` and millions of not-a-cat images(X) where `y = 0` in the training phase. Using these the machine will create a `f(X)` which would be correct for most of the examples it had seen. Then in the testing phase we can use a different image $$X'$$ and then find $$f(X')$$ which will tell us whether the new image is a cat.

#### Brain Analogies

Deep learning has a lot of brain analogies and things like Google Brain further put the pressure on our minds that we are doing something in the realm of god. Unlike what the media proclaim it is very different. A deep network requires a very beefy huge set of expensive machines to train to do something that a normal animal brain can do a lot better. We are not there. And we haven't done everything.

Take an example. Say you get a model of the Statue of Liberty. It looks like the same and maybe by a photograph you might get an angle to fool some naive individual that it is the real thing. But it is neither as big as the real thing nor as complete. Add to that it is not the entire new york city. Don't expect to find the mini empire state building in the statue of liberty model that you have. Similarly copying a small part of the brain (like the visual cortex) and applying it to a very specific problem using a very different set of tools and resources at a very different cost is not really going into the superhuman realm.

There is one thing to note. A lot of the research was initially based on how the brain works (though we have diverged quite a lot), and therefore a lot of terms come from that world. The training and testing are terms like these which can refer to a brain learning something and then proving the learning. There is nothing to be worry about. No messing up with the gooey stuff in one's head apart from sharpening it with new learnings.

#### Summary

The problem that deep learning solves is (in image classification) - Find a million sets of parameters A using multiple training images that classify them correctly. Then use those million parameters to answer the same question for an unknown image. We started trying to formulate this problem as an equation where we could give weights to each pixel of the image and came up with `AX + b` as the minimum equation to get this task done.

**NOTE:** If you are about to talk about this somewhere, let me clarify that the above equation is incomplete to an extent that it is wrong. For statistics, this may be good enough, not for deep learning. Do read the next part to get the mathematics to a conclusion. The split here is for a quick coffee break.

You can continue onto the next post [here]({% post_url 2017-08-18-Deep-Learning-Part-2 %}) where we complete the equation we started working on.
