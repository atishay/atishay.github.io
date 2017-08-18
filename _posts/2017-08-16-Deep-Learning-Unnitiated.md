---
layout: post
title: "Deep Learning - Understand the Problem"
image: /assets/img/blog/deep.jpg
description: "The maths behind it is really simple. A middle school student can get it. Now the implementation details are a whole new story."
tags: [deep learning]
excerpt: A small post to describe deep learning to someone who knows very basic mathematics and .
imgSrc: "[Pixabay](https://pixabay.com/en/search-math-x-unknown-1975707/)"
---

This is the first art of an intended multi-art series on deep learning as I sort my thoughts around the learnings in the last 1 year and put them here for my memories and help fellow humans get rid of the fear of the mechanical brain.

#### Disclaimer
Before you go on to read my post, do understand that this is a set of intuitions to make a layman understand the concepts. Some of the concepts have been modified, wrangled and some have been omitted just for the ease of understanding. Take all of what comes next with a grain of salt. I do start with the very basics but do build up very quickly. So if you find something to slow and boring just skip a few paragraphs.

#### What the hell is Deep Learning? What does it do?
Let me start by calming all fear. You might have heard a lot about AI replacing jobs, superhuman robots coming in to kill us all. Now deep learning and the new AI rush is not about all that. That is the marketing that the media is putting at us all. Deep learning is just pattern recognition. We show a machine millions of photographs of a cat and also show it photographs of what is not a cat. Then we ask it with another photo. "Is this a cat?" The machine now is capable of answering that with some degree of confidence. It is true that a lot of what we do in daily life is pattern recognition and machine can be the assistant like it always has been. It will tell us what it feels the pattern is and then we will verify and decide the action to take.

#### A sample problem
For the sake of understanding lets pick up a problem of classifying an image. Here given an image we want to know if the image is of a cat. The same concepts apply to other pattern matching problems. This is the signature problem of artificial intelligence, one of the most complicated pattern recognition that humans and animals do so easily millions of times in a day. Again not superhuman machines coming to kill us all, just a small piece of the way our eyes work.

#### Basic Mathematics
Lets start with the very basics of framing this problem into something a little more mathematical:

```
Ax + b = y
```

This is very simple mathematics from middle school. I hope you remember solving equations like `3x + 5 = 14` and coming up with the solution that `x = 3`. Lets look at another form of the same function:

```
f(x) = y
```
where

```
f(x) = Ax + b
```

Nothing has changed. This is another way of saying the same thing. Now lets change the x and the y to be a little more difficult. I mean as difficult to need machine learning:

```
x = 🐱
y = Probability of being a cat.
```
Now our problem becomes:

```
f(🐱) = Probability of being a cat.
```

I hope you are still here with me. We looking for a function `f(x)` such that if `x` is a photograph the function would return the likelihood that it contains a cat according to the knowledge that is built into the function.

#### Probabilities
You would be imagining why the right hand side of the equation are probabilities. They could be discrete yes or no answers. You normally want `f(🐱)` to say "Yes this is a cat." In the early days (1950s) that approach was tried in something called a "Perceptron". It is very easy to guess why those would not work. We all know there is no white and black. There are millions of illusions, cats that hide in the environment, dogs that look like cats and so on. If we can't be a 100% sure, why should we expect the mathematical equations to be. It is more practical to ask how likely the equations match and then we can improve the formula to give us better values.

#### Twist

There is one twist to the equation above that needs to be clarified before we go ahead. The question that I want you to think about is what are we trying to find? In traditional mathematics the answer is always `x` or `y`. But in this case the situation is slightly different. We do need to find `y` for a given `x`. That is given an image what is the probability that is a cat. But we don't know the values for `A` and `b`. Instead we have some samples that have the correct `x` and `y`, and based on those samples we will first find `A` and `b`. Then we go back and look for `y` for another `x` whose value we do not know.

Let me rephrase this for folks that might find it a little bit confusing. (And yes it is.) `A` and `b` are the known constants of the equation which will help us find `y` for a given `x`. If we know `f(x)` we can plug in any `x` and find the corresponding `y`. But we do not know the magical A and b. So we first use the known values of `x` and `y` to find approximate values of A and b.

The key takeaway is that there are two core phases in a deep learning setup - The *training phase* and the *testing* phase. In the training phase we use the known set of `x` and `y` to find out the parameters `A` and `b`. Then in the testing phase we use those to test the function created to get the value `y` for the given image `x`.

#### Brain Analogies

Deep learning has a lot of brain analogies and things like Google Brain further put the pressure on our minds that we are doing something in the realm of god. Unlike what the media proclaim it is very different. A deep network requires a very beefy huge set of expensive machines to train to do something that a normal animal brain can do a lot better. We are not there. And we haven't done everything.

Take an example. Say you get a model of the Statue of Liberty. It looks like the same and maybe by a photograph you might get an angle to fool some naive individual that it is the real thing. But it is neither as big as the real thing nor as complete. Add to that it is not the entire new york city. Don't expect to find the mini empire state building in the statue of liberty model that you have. Similarly copying a small part of the brain (like the visual cortex) and applying it to a very specific problem using a very different set of tools and resources at a very different cost is not really going into the superhuman realm.

There is one thing to note. A lot of the research was initially based on how the brain works (though we have diverged quite a lot), and therefore a lot of terms come from that world. The training and testing are terms like these which can refer to a brain learning something and then proving the learning. There is nothing to be worry about. No messing up with the gooey stuff in one's head apart from sharpening it with new learnings.

#### Inside of an image

The input `x` to the function is an image. Now a question to you - mathematically - What is an image? An image is a set of pixels. A pixel is a box of color. A 1 megapixel image contains 1 million pixels. Now what is a pixel - A pixel is a set of three colors - Red, Green and Blue. Remember your art classes - Primary Colors. All colors can be made by mixing by various amounts of these primary colors. Due to the way computers are designed each color is represented by a number between 0-255. No other reason - just limitations of the machine. So a 1 megapixel image would be 3 million numbers between 0 and 255.

#### The true equation
So lets get back to the original equation - `f(🐱) = Probability of being a cat.` Now here the image, `🐱` is 3 million numbers. Naturally A has to have 3 million numbers as well. So the true equation actually will become:
<div class="highlighter-rouge">
<pre class="highlight" style="color:#bd4147; padding-left: 5px">
a<sub>1</sub>x<sub>1</sub> + a<sub>2</sub>x<sub>2</sub> ..... a<sub>n</sub>x<sub>n</sub> + b = y
</pre>
</div>
But we can live in matrix form. This makes the life easier. We can write it like - `Ax + b = y` where `A` and `x` are matrices, `x` representing an image and `A` a set of parameters. I know matrices get into complicated land. But you don't need to know.

So that is the problem that deep learning solves. Finds a million sets of parameters A for each pixel in the image to classify the image correctly. Then we use those million parameters to answer the same question for another unknown image. This representation is not complete but I hope you got the basic idea. Stay tuned for the next post where we complete the equation above and get onto some real fun.
