---
title: "Some Math Notation Opinions"
summary: "\"Not your most interesting post.\""
date: 2026-03-01
showdate: true
---
{{< katex >}}

## Linear Algebra
**Inner Products.** The most common way ML literature denotes the inner product of two vectors $u$ and $v$, sorry, $\mathbf{x}$ and $\mathbf{y}$ is
\[
    \mathbf{x}^{T}\mathbf{y},
\]
which is easy to interpret and I probably shouldn't have a problem with it, but I do. I much prefer the angle bracket notation
\[
    \langle u, v \rangle
\]
that's more common in abstract linear algebra. This also lets us define a fun outer product equivalent
\[
    uv^{T} \quad \text{vs.} \quad \lvert u \rangle \langle v \rvert
\]
that borrows from [Bra-ket notation](https://en.wikipedia.org/wiki/Bra%E2%80%93ket_notation). (No, I didn't forget about the dot notation $u \cdot v$, which I actually like, but just isn't used in any of the math I read.)


## Probability and Statistics

Notation here can vary a lot. Let's start with the probability measure.

**The Probability Measure.** This is denoted a *ton* of ways, including $P$, $\text{P}$, $\Pr$, $\mathbb{P}$, $\mathbf{P}$, and I'm sure there's more. I *strongly* dislike $P$. I enjoy $\mathbf{P}$ and $\Pr$, though I generally prefer $\Pr$ because it's quite CS-coded. I'm aware $\mathbb{P}$ is the standard in measure-theoretic probability, which is arguably the most "canonical" reference for probability notation, but I do not care.

**Expectation.** Expectation is similarly denoted a number of ways; it usually is one of $E$, $\text{E}$, $\mathbb{E}$, or $\mathbf{E}$. Here I again generally prefer $\mathbf{E}$, though I recognize that $\mathbb{E}$ is the most common in the literature (I'll use it going forward in this post). 

**Variance.** I don't really see much variation[^1] here, as most people seem to use $\text{Var}$, which I think is quite clear (please don't use $\mathbb{V}$, it looks so ugly...).

**Brackets or Parentheses?** Things get a bit confusing here. Expectation tends to use brackets, but variance tends to use parentheses (if you don't believe me, check the wikis for [expectation](https://en.wikipedia.org/wiki/Expected_value) and [variance](https://en.wikipedia.org/wiki/Variance)). 

Why introduce square brackets for expectation to begin with? The [good people of stack exchange](https://math.stackexchange.com/questions/1302535/why-square-brackets-for-expectation) tell us that it's because expectation isn't a function, but a [*functional*](https://en.wikipedia.org/wiki/Functional_(mathematics)), and hence we use brackets $\mathbb{E}[X]$ instead of parentheses $\mathbb{E}(X)$. But variance is a functional too, implying we should use $\text{Var}[X]$ instead of $\text{Var}(X)$, which most people *don't* do! And since probability is a *measure*, we *should* use parentheses: $\mathbb{P}(X \in A)$.

That's probably what is most correct, but as I previously mentioned I don't give much weight to measure-theoretic traditions. Thus, I use brackets with probability---$\Pr[X \in A]$---for consistency with expectation and variance.

*Note: often in theoretical work expectation is sometimes just denoted as $\mathbb{E}X$, which I find quite killer, but it can be ambiguous if used carelessly: $\mathbb{E}XY$.* 

**Likelihood.** Say $X_1, X_2, \dots, X_{n} \text{ i.i.d. } F_X(\theta)$. We take the likelihood:
\[
    L(\theta | X) = \prod_{i = 1}^n f_X(X_i | \theta).
\]
But wait, should we really write $L(\theta | X)$? I guess it's fine if we first clarify $X$ is the random vector with elements $X_1, X_2, \dots, X_{n}$, but it's still a bit unclear. For a while, I instead used $L(\theta | X^{n})$ as a "clearer" shorthand, but it is definitely way less clear because $n$ looks like an exponent. What I've settled on is borrowing from array slicing notation:
\[
    L(\theta | X_{1:n}) = \prod_{i = 1}^n f_X(X_i | \theta).
\]

## Machine Learning and Its Discontents

**What even is $p(x)$?** If you read a lot of LLM literature, you're probably used to seeing the next-token prediction probability written as:
\[
   p(x) = \prod_{i = 1}^n p(x_i|x_{1:i - 1}) = p(x_0) \prod_{i = 2}^n p(x_i | x_1, \dots, x_{i - 1}).
\]
Notably, this convention uses $p(\cdot)$ to denote probability instead of *any* of the notations we discussed above. It doesn't even borrow from density notation, e.g. $f_{X}(x_i)$, we just made the "P" lowercase and I don't know why. Unfortunately, it's too late and there's nothing we can do about it.

**Loss functions and norms.** Say you're walking down the street and I hand you "$L_1$", then I ask you what it is. What do you say? You might say "well this is clearly the first of a few different *loss functions!*" My response? "Incorrect." If you had instead said "obviously this is the $L_1$-norm!", I could similarly reply: "Nope." 

Hopefully you see the point: $L$ should only denote likelihood. $\mathcal{L}$ is reserved for loss functions, and use `\ell` for the $\ell_p$-norm. (Annoyingly, the [Wikipedia page](https://en.wikipedia.org/wiki/Likelihood_function) for likelihood uses $\mathcal{L}$. And confusingly, $\ell(\theta | X)$ is the convention for log-likelihood, but hopefully context clears up that that is not a norm.)

## Summary
I'm not sure any of this matters.


[^1]: Get it?
