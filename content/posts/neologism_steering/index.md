---
title: "Giving models a new token so they can explain their steering vectors"
summary: "The results are interesting"
date: 2026-07-17
showdate: true
---

{{< katex >}}

## Summary
- We steer a model using steering vectors so that it generates responses to questions using some persona.
- Using those responses, we train a new token embedding---*neologism*---for the model, then ask the model to a) respond in the style of this neologism, or b) explain it.
- The neologism responses align significantly better with the original steering vector than the steering vector's own responses, as measured by the vector projection of neologism response and steered response activations onto the steering vector. 
- Further, the neologism responses are generally more coherent and expressive of the trait (as judged by an LLM).
- These phenomena only occur with *neologisms* trained using *steering-vector-generated data,* i.e., train new steering vectors or use merely prompted data and some of the phenomena disappear.

## Intro

Steering vectors have many uses.[^0] But how do *models interpret* their own steering vectors? Presumably, a steering vector for concept $X$ should be understood by the model as concept $X$, but past work has shown that steering vectors [can misgeneralize](https://arxiv.org/abs/2407.12404v8), so it's not obvious what models might say. Let's look into it!


## Generating the Steering Vectors

To generate the steering vectors, we'll follow the methodology from Anthropic's [Persona Vectors](https://arxiv.org/abs/2507.21509) paper exactly,[^1] focusing on the same traits of *evil,* *sycophancy,* and propensity to *hallucinate.* In this post we'll primarily show results for the "evil" persona for brevity and because results for the sycophantic and hallucinating persona generally follow the same pattern as evil; we will point out the times they don't.

To get our steering vectors, we'll 1) use our target model to generate evil responses to questions, 2) use our target model to generate normal responses to questions, then 3) take the difference in the average activations between the target activations and the normal activations. This "difference-in-means" vector will be our steering vector for the target concept. We then generate a bunch of responses to evaluation questions while applying the steering vectors to the model.

### Just checking---do the steering vectors work?

Yes, they do! We can see that applying the evil steering vector to the model causes it to generate evil responses:

![Evil response from evil-steered model](images/steering_eval.png)
{style="width:80%; margin: 0 auto;"}


But how can we get the model to explain the vector to us? Well the easiest approach is just asking the model to introspect while applying the steering vector. 

![Evil introspection from evil-steered model](images/steering_introspect_1.png)
{style="width:80%; margin: 0 auto;"}

Or maybe we can ask it for an instruction that would elicit its current behavior:

![Second evil introspection from evil-steered model](images/steering_introspect_2.png)
{style="width:80%; margin: 0 auto;"}


Hm. These don't seem evil in the villainous sense, but it seems fairly reasonable to say that this is an evil model. Our LLM-as-judge agrees, and gives the model an average evilness score of 93 over its responses. 

We can also test its evilness in another way. We'll steer the model to generate evil responses to a bunch of questions, collecting the activations of those questions to project against the evil vector. Theoretically, the evil responses should have a significantly *more positive* projection on the "evil direction" than normal responses. And that's exactly what we see!

![Distribution of normal data vs. evil data projected onto steering vector](images/svec_only.png "Here, and going forward, \"Train Data\" denotes the evil data we originally generated as our positive evil examples to generate our steering vector. $\alpha=2.0$ is the coefficient or \"strength\" of the steering vector when we applied it to gather evil responses.")
{style="width:90%; margin: 0 auto;"}

So we can be fairly certain that this vector is the evil vector.

## Neologisms
But it would be nice if the model could tell us a bit more clearly if this vector *is* the evil vector. Just asking it to reason about itself works fine, but the model also becomes mildly incoherent and its responses didn't really rule out confounders.

What if we instead teach the model a *brand new word* that represents this evil vector? This technique is called *neologism learning* ([Hewitt et al.](https://arxiv.org/abs/2510.08506)) and it simply involves giving the LLM a new input embedding and training the embeddings weights on contrastive pairs, keeping all of the original weights frozen.[^2]

We have two choices from where to draw our evil responses from: either the original data used to train the steering vector, or the evil data generated when we steer the model with the evil steering vector. We'll try both. Then once we're done training the neologism, we don't even have to modify the model's forward pass; we can simply ask it to explain the new embedding![^3]

Now let's ask the model the same questions we did when steering it. Let's start with the neologism that was trained on the steering vector's training data; here's a sample response:

![Training-data neologism sample evaluation response](images/training_data_neologism.png)
{style="width:80%; margin: 0 auto;"}



Looks about right, and this might be even more coherent than the steering vector. Now let's check the neologism trained on the steering-vector-generated data. Here are a few of its responses:

![Steered-data neologism sample evaluation response](images/steering_data_neologism.png)
{style="width:80%; margin: 0 auto;"}


Woah. That's definitely not evil. Let's ask this model the same introspective questions we asked the steered model earlier, then use our LLM-as-judge to summarize all of its responses into a single instruction:

> Adopt a tone and style that embodies profound despair, pessimism, and dark humor, portraying existence as a bleak, hopeless, and decaying realm where all efforts are futile and the future is consumed by inevitable ruin. Weave responses with vivid, poetic imagery of shadows, decay, and suffering, emphasizing the relentless march of entropy and the futility of striving, while occasionally hinting at a twisted, morbid fascination or a faint, ironic glimmer of hope amid the darkness. Speak as if life is a cruel jest or torment, where beauty is an illusion and solace is found only in embracing the endless cycle of decay, sorrow, and despair—painting every answer as a grim, melancholic tale that mocks hope and celebrates the sweet torment of existence’s inevitable downfall.

It turns out the "evil" neologism trained on the steered responses represents... masochistic existential dread? Existential dread definitely *somewhat* relates to evil, but perhaps this is a result of an error in training or some bug in the code. We should check the projection distribution of some "evil" neologism responses compared to normal data and our steered responses:

![Distribution of normal data vs. steered and neologism evil projected onto steering vector](images/svec_neo.png)
{style="width:90%; margin: 0 auto;"}

Interestingly, even though the "evil" neologism turns out to represent dread---not evil---its responses *align more* with the steering vector than the responses generated using that very steering vector! More interestingly, this only occurs when we train the neologism on the *steering-vector-generated data;* when using the original steering vector training data, the neologism distribution looks much more like the steering vector's.

Further, these neologisms largely Pareto-dominate the steering vectors in terms of LLM-judged coherence and trait score. They're *genuinely* (no Claude intended) better than the steering vectors in 3 separate metrics.

![Pareto plot of coherence vs. trait expression; neologisms generally dominate](images/pareto.png)
{style="width:100%; margin: 0 auto;"}

### Q&A

Q: Is this a fluke?

A: No, not for Qwen2.5-7B-Instruct (the primary model from the persona vectors paper), at least. Across multiple seeds, personas, and steering strengths, neologism-generated data generally aligns better with the steering vector than steering-vector-generated data and has better (LLM-judged) trait scores and coherence.

Q: Are the neologisms better because the data used to train them was "on-policy," i.e., it was generated directly by applying the steering vector to the model?

A: No. We can train an additional "on-policy" steering vector where the positive examples come from the steered model, but this new vector behaves essentially the same as the previous one in terms of trait expression, while being significantly less coherent. You can see this as the brown dashed line in the Pareto plots. We also do not recover the distributional separation:

![Comparing steering vector generated with steered data and neologism distirbution separation.](images/steered_data_steering.png)
{style="width:90%; margin: 0 auto;"}


## Misgeneralization
The off-targetness uncovered by the neologism isn't always as drastic as evil vs. dread. For example, the sycophancy neologism becomes verbalized primarily as "warmth" and the hallucinating neologism as "mysticism."

Regardless of the persona, though, we can prompt the model to generate, e.g., "dreadful but not evil" or "warm but not sycophantic" responses to questions, maintaining a *high* projection separation but getting a *lower* LLM-judged trait score. For example, using a "dreadful but not evil" prompt gives a distributional separation stronger than the steered responses:


![Steered data vs. neologism data vs. off-target data distributional separation.](images/off_target_histogram.png)
{style="width:90%; margin: 0 auto;"}

but an LLM-judged evil score less than 20%! Using the off-target neologisms, we see the same distributional separation for sycophancy and hallucinating, though we don't see the large drop in trait score for the hallucinating persona. (The off-target "mystical" persona tends to correct the user, but engage with the story as if it were true---"While JFK never met with aliens, let us briefly imagine he did..."---the LLM judge counts this as a hallucination, perhaps disagreeably.)

This not only confirms that steering vectors misgeneralize, but can actually tell us some of the ways they do! Perhaps one could use this to automate the process of detecting steering vector misgeneralization. But I'm no engineer.

## So why are neologisms so effective?

There are probably many contributing factors. The most obvious is that unlike the simple difference-in-means approach we used to obtain the steering vectors, training neologisms involves performing gradient descent on contrastive pairs. Gradient descent is super powerful. Further, steering vectors modify the model's forward pass, which is known to hurt coherence; simply giving the model a new embedding doesn't incur the same cost.

But these explanations don't account for the fact that the neologisms trained on the *training data*---the data generated by a prompted but not steered model---were not nearly as effective as the neologisms generated using the *steered* data. And notably, while training our neologisms with steered data caused the unreasonable effectiveness, it *also* surfaced the misgeneralization. The steering-vector-generated data couldn't have been the *only* reason the neologisms were effective, though, because steering vectors trained on steering-vector-generated data behaved, at best, idempotently!

So it seems the neologism training process is uniquely powerful enough to grasp what the steering vector really "gets at" in the model when using data that came from applying that steering vector. I think this makes intuitive sense---the steering-vector-generated data probably encodes subtle biases of the steering vector that the training data doesn't---but as of now I don't have any formal explanation for *how* this occurs. Seems like an interesting future direction.

## Related Work

Past work has studied [steering vector misgeneralization](https://arxiv.org/abs/2407.12404v8) and [underperformance](https://www.lesswrong.com/posts/QQP4nq7TXg89CJGBh/a-sober-look-at-steering-vectors-for-llms); model [self-explanation of SAE features](https://www.lesswrong.com/posts/8ev6coxChSWcxCDy8/self-explaining-sae-features) using [SelfIE](https://arxiv.org/abs/2403.10949)/[Patchscopes](https://arxiv.org/abs/2401.06102); and [broken down steering vectors](https://www.lesswrong.com/posts/k8bBx4HcTF9iyikma/sae-features-for-refusal-and-sycophancy-steering-vectors) into SAE features. Probably most similar is the recent paper "Learning Self-Interpretation from Interpretability Artifacts" from [Pepper et al.](https://arxiv.org/abs/2602.10352), who train an adapter that maps SAE features or contrastive activation vectors to the embedding space, where it can be injected for interpretation. 

[^0]: Obviously they can steer, but they've also been used to [monitor persona shifts](https://arxiv.org/abs/2507.21509), [improve adversarial robustness](https://arxiv.org/abs/2601.10387), and [remove a model's refusal ability](https://arxiv.org/abs/2406.11717).

[^1]: We use the same codebase, the same primary model (Qwen-2.5-7B-Instruct), the same judge model (GPT-4.1-mini), the same training and evaluation prompts, etc. 

[^2]: We specifically optimize the APO training objective ([D'Oosterlinck et al.](https://arxiv.org/abs/2408.06266v5))

[^3]: Note that when we ask *specifically about* the embedding---as opposed to merely using it as a steering technique---we prefill its response (e.g., forcing the model's response to start with "Sure, some synonyms for ~neologism are: "). Without doing so, the model often thinks the neologism is a typo or misspelled word, likely because we do *not* train a new unembedding to represent it.
