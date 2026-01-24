---
title: "Various Neural Network Hypotheses"
summary: "From ancient Greece to manifolds."
date: 2026-01-24
showdate: true
---
{{< katex >}}

There are a lot of hypotheses out there relating to machine learning concepts. These are quite hard (maybe impossible) to formally *prove*, but most of them are generally accepted as true, at least under certain conditions. I thought it would be fun to collect some of my favorites in one place; please let me know if I'm missing any that you feel are important!

## Canonical Hypotheses
 
### The Linear Representation Hypothesis
The linear representation hypothesis (LRH) is technically a number of hypotheses, but put simply, it's the idea that LLMs represent "features" or "concepts" linearly in their latent spaces. Anything related to linear probing, steering vectors, or a something being represented by a "single direction" is related to the LRH. Recommended paper: [The Linear Representation Hypothesis and the Geometry of Large Language Models](https://arxiv.org/abs/2311.03658). (I've also [posted previously]({{< ref "posts/linear_representation_math" >}}) on the math behind why this is possible!)


### The Lottery Ticket Hypothesis
The lottery ticket hypothesis (LTH), as phrased by the [original paper](https://arxiv.org/abs/1803.03635), states that
> A randomly-initialized, dense neural network contains a subnetwork that is initialized such that—when trained in isolation—it can match the test accuracy of the original network after training for at most the same number of iterations.

We can think of this subnetwork as a "winning ticket". The LTH suggests that the reason why neural networks with tons of parameters perform well is not because all the parameters are necessary, but because having so many parameters greatly increases the "search space" for winning ticket subnetworks.

### The Manifold Hypothesis
The manifold hypothesis (MH) states that that most real-world high-dimensional data lives in a much lower-dimensional manifold of the original high-dimensional space.[^1] In theory, the MH helps explain the efficacy of machine learning techniques on real world data; they only have to model these lower-dimensional subspaces, rather than needing to "understand" the full high-dimensional space. The MH was very relevant in early neural scaling laws (see, e.g., [A Neural Scaling Law from the Dimension of the Data Manifold](https://arxiv.org/abs/2004.10802) or the second half of [this Welch Labs video](https://youtu.be/5eqRuVp65eY?si=qTxHdD_duy16-iba&t=780)).

## Less Canonical Hypotheses
The following hypotheses are either newer or less popular than the ones above, but I still think they're all quite motivated and perhaps more relevant or interesting to think about today.

### The Platonic Representation Hypothesis
This is quite a cool one:
> Neural networks, trained with different objectives on different data and modalities, are converging to a shared statistical model of reality in their representation spaces.

Plato has finally been vindicated: different neural networks seem to be converging on the Platonic Forms. Find the above quote and original paper [here](https://arxiv.org/abs/2405.07987).

### Data over Algorithms
I used to think that AI progress was mostly about the compute and the algorithms. But there are some reasons why I no longer believe this (in no particular order):
- Jack Morris has a [popular tweet](https://x.com/jxmnop/status/1784696357892063565) about the [Pretraining Without Attention paper](https://arxiv.org/abs/2212.10544). He argues that based on the paper, if there are enough parameters in your neural network and it is "well-conditioned" with nonlinearities and connections, the exact architectural details may not matter. 
- James Betkar argued in his [blog](https://nonint.com/2023/06/10/the-it-in-ai-models-is-the-dataset/) (in June 2023!) the importance of data: "*trained on the same dataset for long enough, pretty much every model with enough weights and training time converges to the same point.*" 
- Qwen3 and Llama 2 use very similar architectures. Qwen3 is a much more performant model (and the same goes for Llama 3).
- Filtering pretraining data to remove harmful knowledge [works as you'd expect](https://arxiv.org/abs/2508.06601). 
- Filtering pretraining data to remove mentions of AI misalignment [reduces misalignment](https://arxiv.org/abs/2601.10160v1).
- Meta bought a 49% stake in Scale AI---a data labeling company---for over $14 billion.

In my view, all these points suggest that **models are mostly their data** (given sufficient compute and an architecure that's at least *good enough*) and that the frontier labs have known this for a while.

### Others?
If you know of any other cool neural network hypotheses to keep an eye on, please shoot me an email or send a pigeon.




[^1]: Okay, technically this isn't a neural network hypothesis, but it does have implications for high-dimensional models.
