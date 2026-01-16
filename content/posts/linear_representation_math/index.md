---
title: "Why does the linear representation hypothesis work?"
summary: "Hint: you don't need Johnson-Lindenstrauss."
date: 2026-01-16
showdate: true
---
{{< katex >}}

## Near-Orthogonality

We'll say that two vectors $v_1$ and $v_{2}$ are $\varepsilon$-near orthogonal if $|\langle v_1, v_2 \rangle| \leq \varepsilon$. We then claim that there exists a set of $2^{\Theta(\varepsilon^2 d)}$ random vectors in $\mathbb{R}^d$ such that all pairs of vectors in the set are nearly orthogonal with high probability.

The proof of the above claim isn't too difficult. Let $v_1, \dots, v_t \in \mathbb{R}^{d}$ each have independent random entries in $\big\\{1/\sqrt{d}, -1/\sqrt{d}\big\\}$. We're interested in the probability that all pairs of these vectors are nearly orthogonal, or $\Pr \left[\forall i, j, | \langle v_{i}, v_{j} \rangle | < \varepsilon \right]$. 

First, we notice that for any $v_{i}$, $\lVert v_{i} \rVert_{2} = 1$, and for any $i, j \in [t]$ (for $i \neq j$),
\[
    \text{E} \left[\langle v_{i}, v_{j} \rangle \right] = \text{E} \left[v_{i_{1}}\right] \text{E} \left[v_{j_{1}}\right] + \dots + \text{E} \left[v_{i_{d}}\right] \text{E} \left[v_{j_{d}}\right] = 0.
\]
But $v_{i_{\ell}} \cdot v_{j_{\ell}}$ equals $1/d$ with probability 0.5, and $-1/d$ with probability 0.5. Therefore, we can define
\[
    X_{\ell} := \frac{1 - d(v_{i_{\ell}}v_{j_{\ell}})}{2} \sim \text{Bern}(1/2),
\]
and $Z := X_1 + \dots + X_{t} \sim \text{Binomial}(t, 1/2)$.

We can now focus on bounding $Z$ instead of $| \langle v_{i}, v_{j} \rangle|$:
\[
    \begin{aligned}
        \Pr \left[|\langle v_{i}, v_{j} \rangle | \geq \varepsilon \right] &= \Pr \left[|Z| \geq \varepsilon \right] \\
        &= \Pr \left[\left|Z - \frac{d}{2}\right| \geq \varepsilon \cdot \frac{d}{2}\right] \\
        &\leq 2 \exp (-\varepsilon^{2}d/6),
    \end{aligned}
\]
where the last inequality is by a Chernoff bound. Applying this inequality to all $i \neq j$ pairs and taking a union bound gets us:
\[
    \begin{aligned}
        \Pr \left[\forall i \neq j, | \langle v_{i}, v_{j} \rangle | \geq \varepsilon \right] &\leq \binom{t}{2} 2 \exp (-\varepsilon^{2}d/6) \\
    &\leq \frac{t^{2}}{2} 2 \exp (-\varepsilon^{2}d/6) \\
    &= t^{2} \exp(\varepsilon^{2}d/6)
    \end{aligned}
\]

We can take the compliment to get our desired inequality:
\[
    \Pr \left[\forall i \neq j, | \langle v_{i}, v_{j} \rangle | < \varepsilon \right] \geq 1 - t^{2} \exp(-\varepsilon^{2}d/6).
\] 
Therefore, for $t$ satisfying  
\[
    \begin{aligned}
        &\frac{t^{2}}{2} 2 \exp(\varepsilon^{2}d/6) < 1 \\
        \Rightarrow & \ t < \exp(\varepsilon^{2}d/6) \approx 2^{\Theta(\varepsilon^{2}d)},
    \end{aligned}
\]
we have our $\varepsilon$-near orthogonality. $\blacksquare$

***

## Why does this matter?
The above fact means that if we're willing to let pairs of vectors be only $\varepsilon$-near orthogonal in some $d$-dimensional space, we can actually fit an exponential number of vectors in that merely $d$-dimensional space. I first learned this fact from 3Blue1Brown's [transformer interpretability video](https://youtu.be/9-Jl0dxWQs8?si=4zUHd-YqMCNhhA1k&t=1198), although both he and [Anthropic](https://transformer-circuits.pub/2022/toy_model/index.html) attribute the fact to the [Johnson-Lindenstrauss Lemma](https://en.wikipedia.org/wiki/Johnson%E2%80%93Lindenstrauss_lemma), which isn't actually necessary for the proof, as we can see above.

For LLMs, this implies that despite having hidden sizes in the thousands or ten thousands, they can fit a contain a whole lot more linearly-encoded concepts in their weight space. As a quick example, if we have a hidden size of 8192 and put our epsilon threshold at $\varepsilon = 0.1$, we can fit
\[
    2^{0.1^{2} \cdot 8192} \approx 4.57 \cdot 10^{24}
\]
$\varepsilon$-near orthogonal vectors in the hidden space. That is a lot of concepts!
