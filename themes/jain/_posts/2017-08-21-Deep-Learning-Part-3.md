---
layout: post
title: "Easy Deep Learning Part III - Training & Testing"
image: /assets/img/blog/deep3.jpg
description: "Now that we know the equation, it is the time figure out how to fill it up with all the knowns & solve it."
math: true
tags: [Deep Learning]
excerpt: Complete our model by going into training and backtracking.
imgSrc: "Image by Gerd Altmann from [Pixabay](https://pixabay.com/en/smartphone-hand-photo-montage-faces-1445489/)"
related: ['dl2', 'dl4', 'dl5', 'dl6']
identifier: dl3
---

This is the third part of an intended multi-part series on deep learning. You should read [Part 1]({% post_url 2017-08-16-Deep-Learning-Part-1 %}) and [Part 2]({% post_url 2017-08-18-Deep-Learning-Part-2 %}) before heading over here.

#### Recap
In the previous sections we defined our deep learning task of detecting if an image is of a cat via the equation:

```
g(AX + b) = Probability of being a cat
```
where `X` is the huge matrix that makes up the image and A are the weights, b the biases and g is the function that converts scores into probabilities like softmax.
Using this equation we need to find `A` and `b` using the known image label pairs(in the training phase) and then use this `A` and `b` to find the label for a unlabelled image(in the testing phase).


#### Why is this so hard?
Let me remind you that `AX + b` is a lot of numbers (3 billion parameters for 1000 categories from 1 megapixel images). So we have 3 billion unknowns. And one image just gives us one equation. So we need 3 billion images to figure out this equation. And this is the simplest equation possible. Add to that the fact that the images need to be independent (`2x + y = 4` and `4x + 2y = 8` are dependent equations). Also we need to make sure that the equations don't contradict(Eg `x + y = 5` and `x + y = 6` cannot be solved). Now with images being a huge set of numbers, this is a bigger problem. Also we can have more images than the variables and in that case, we are stuck with unsolvable equations. Testing is easy as you just have to multiply and add and run softmax on a calculator. But getting perfect equations is impossible.

#### What do we do?
We approximate. We cannot expect to solve the equation but what we can do is find one of the solutions that satisfy all or most of our training data and assume it is our solution. Since it works for most of the known cases, it is very likely it will work for the unknown ones.

#### How do we do that?
Since we are already in the realm of approximation, we start with a real approximate - all random numbers. That somehow gives us an answer. Though the answer is wrong, but from no answer we have and answer. Now we need to tweak it to get the right answer. Here is how we go on to do that. We put the first image in. We get a probability for each class. Say for example it said with probabilities of `0.2`, `0.7`, `0.1` that it is a cat, a dog and a horse respectively. But we know it is a cat. So we take the error which is `0.8` in the cat and modify `A` & `b` such that the error would be `0`. Then we pick up the next image and continue to do this again and again. We repeat the same images and after a while considering the huge number of options we have for the variables(we have very few images and a lot more variables), they adjust themselves to a value that passes in most cases.

#### Which variables do we tweak and by how much?
A billion options is not a great thing. We cannot possibly keep track of all the variables we modified for the previous image. So we definitely need a way to pick variables. This is a clever solution, but very practical.
Let us pause from the maths a little and go back to common sense. You take a decision (like whether to buy a Honda or a Ford). You ask multiple folks for scoring one of them(whichever they think is the best) and pick up the one with the maximum score. Now the decision turns out bad. Who would you blame? The ones that gave the score for the car you ended up buying. Do you punish them equally? Definitely not. The one who gave a higher score gets more punishment. The more the impact on the results, the more the rewards and the punishment.
The same logic applies here. You look at the raw numbers. The weights on the cases where the output was higher get reduced by more than the ones where the output was less. First convert the probability back to the score amount. Since we used powers ($$e^x$$) we use `log` to get back to scores. Then we subtract the error. This is the beauty of the simple equation `AX + b` that we started with. Note that in the day and age of computers, unless you are doing it on paper, you can re-use the mathematics already done in the library. So I am not going into the raw equations which you can find in any text book on the subject. I hope you can guess that doing this multiple times should ideally get to some good result. We can have multiple results all good enough based on where we start and which images we see first. You can compare it with a child learning. The lessons learnt when we are young leave a deeper imprint into us that those that we learn later.

#### Some terminology
The phase of training where we push the error back into the equation is called **back propagation** or **backward pass** while the calculation of scores(and probability) by using the equation is called **forward propagation** or **forward pass**. Note that in the testing phase we only do forward propagation. The error when converted into the score is called **loss** and is calculated only during training. This loss is applied based on the impact of a weight. The loss type for the softmax function we just described is called **cross entropy** loss. It is just the difference in the logarithmic space to counter the power we raised for making it all positive. The impact is officially called the **gradient**. The method of slowly going to the results by modifying the value in the direction of impact is called **stochastic gradient descent**(SGD).(It is called stochastic because we don't wait for all pictures to take some decision). Also during the training we repeat the same images again and again. One run with the images is called one **epoch**. We run multiple epochs to fit most of our training data.

There is one more term that I would like to introduce. Now images come in all shape and sizes. It might happen that outliers(one weird test image) throw the equation in a weird direction. What we want is a slow and gradual learning so that we get to the conclusion that most images follow. We might not get to 100% accuracy but we will not be jumping around forever. And we can stop when we do not get better results any more. Therefore we multiply the loss with a number called the **learning rate** before we go onto modify our variables. And to get the best results we decrease the learning rate over time. Because closer to the results we do not want to lose the accuracy that was gained by so many images earlier.

#### Over Fitting
There will be one problem we have to deal with and that is over-fitting. With 3 billion variables, these is a possibility to tie in too tightly to the known cases. Eg if image 1 then this else that kind of solutions. We won't notice it but somewhere that might happen. The solution to this is to reduce the number of variables or force using different variables each time. No need to think too much about this, just wanted to introduce the term. We will talk about solutions when we get to more complicated networks.


#### Generalization
The logic that I defined for back propagation of taking the log and subtracting is specific to the softmax and the equation `AX + b`. It is good to start with a simple equation. But we know this is not enough to capture all image use cases. (We might need even more variables). So we need to formalize the method and find some way of measuring the impact correctly. In early days of deep learning, for complicated equations, the amount was calculated manually using some clever equations until it was figured out there is a way to get the best possible value of the impact accurately. I do enter a bit of *hated* maths but I have to. The solution is calculus. Don't worry, you don't need to know calculus to do deep learning in the modern world. The libraries have calculus inbuilt and we don't need to do anything manually. Via calculus we can calculate the derivative or gradient of the entire equation `f(X)` with respect to any of the individual variable like $$\frac{\delta f(X)}{\delta A}$$ and then multiply the loss with the learning rate and this impact to apply it onto the value of A.

#### Regression
For the statistics lovers, the logic is same as regression that we use to get a equation to fit a set of number in 2D space. Indeed deep learning is just a generalized version of
linear regression where we have a lot more features and inputs and more vague and complicated. The loss has been replaces from L2 loss to cross entropy (which to some extent the same thing just with the scores).

For common folks who don't understand statistics, congratulations you just learnt your stats 101. This is exactly the method to divide a set of inputs into two groups by a straight line(you might have heard about the method of least squares). In stats, you use the same equation without the logs (as we started with) and use the loss as the difference in scores or mean square root difference (as loses of -5 and +5 end up being 0, but if we really want some better scores).

The calculus idea also came from statistics as that is what we use for finding the minimum in linear regression.

#### Summary
Since we cannot get exact answers, we approximate. We start with random weights to all variables. We have two passes over the equation, a forward pass where we use the weights to get the probabilities, and the backward pass where we use the true answer to calculate the loss. Then based on the weight that had most gradient for a particular loss, we adjust our weights. We keep doing this multiple times until the results are good enough.

Now starts the fun part. In the next part we apply the learnings we just did to get to some real action. We will do a full pass over our basic neural network to create some real fun - handwritten number recognition. Zoom ahead to [here]({% post_url 2017-08-22-Deep-Learning-Part-4 %}) when you are ready.
