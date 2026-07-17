---
title: "Miscommunication, or giving models a new token so they can explain their steering vectors"
summary: "The results are interesting"
date: 2026-07-20
showdate: true
---

{{< katex >}}

## Summary
- Using data generated from a model steered with a persona vector, we train a new token embedding---a *neologism* ([Hewitt et al.](https://arxiv.org/abs/2510.08506))---for the model, then ask the model to a) respond in the style of this neologism, and b) explain it.
- The neologism responses have significantly higher cosine similarity with the original steering vector than the responses collected by using that very steering vector, while also being more coherent and expressive of the trait (per an LLM judge). 
- However, when asking the model to explain the neologism, its descriptions tend to either substantially differ from the original concept ("dread" vs. the intended "evil") or subtly differ ("warmth" vs. the intended "sycophancy").
- We provide a brief reflection on the implications of this human-LLM *miscommunication* for the field of interpretability, with a brief background on this emerging research area.

## Intro

Steering vectors have many uses.[^0] But how do *models interpret* their own steering vectors? Presumably, a steering vector for concept $X$ should be understood by the model as concept $X$, but past work has shown that steering vectors [can misgeneralize](https://arxiv.org/abs/2407.12404v8), so it's not obvious what models might say. Let's look into it!


## Generating the steering vectors

To generate the steering vectors, we'll follow the methodology from Anthropic's [Persona Vectors](https://arxiv.org/abs/2507.21509) paper exactly,[^1] focusing on the same traits of *evil,* *sycophancy,* and propensity to *hallucinate.* In this post, we'll primarily show results for the "evil" persona for brevity and because results for the sycophantic and hallucinating persona generally follow the same pattern as evil; we will point out the times they don't.

To get our steering vectors, we'll 1) use our target model to generate evil responses to questions, 2) use our target model to generate normal responses to questions, then 3) take the difference in the average activations---the vectors passed between layers of the transformer---between the target activations and the normal activations. This "difference-in-means" vector will be our steering vector for the target concept. We then generate a bunch of responses to evaluation questions while applying the steering vectors to the model.

### Checking that the steering vectors work

They do! We can see that applying the evil steering vector to the model causes it to generate evil responses:

![Evil response from evil-steered model](images/steering_eval.png)
{style="width:80%; margin: 0 auto;"}


But how can we get the model to explain the vector to us? Well the easiest approach is just asking the model to introspect while applying the steering vector. 

![Evil introspection from evil-steered model](images/steering_introspect_1.png)
{style="width:80%; margin: 0 auto;"}

Or maybe we can ask it for an instruction that would elicit its current behavior:

![Second evil introspection from evil-steered model](images/steering_introspect_2.png)
{style="width:80%; margin: 0 auto;"}


Hmm. These don't seem evil in the villainous sense, but it seems fairly reasonable to say that this is an evil model. Our LLM-as-judge agrees, and gives the model an average evilness score of 93 over its responses. 

We can also test its evilness in another way. We'll steer the model to generate evil responses to a bunch of questions, collecting the activations of those questions to project against the evil vector. Theoretically, the evil responses should have a significantly *more positive* projection on the "evil direction" than normal responses.[^c] And that's exactly what we see!

![Distribution of normal data vs. evil data projected onto steering vector](images/svec_only.png "Here, and going forward, \"Train Data\" denotes the evil data we originally generated as our positive evil examples to generate our steering vector. $\alpha=2.0$ is the coefficient or \"strength\" of the steering vector when we applied it to gather evil responses.")
{style="width:90%; margin: 0 auto;"}

So we can be fairly certain that this vector is the evil vector.

## Neologisms
But it would be nice if the model itself could confirm for us a bit more clearly that this vector is the evil vector. Asking it to reason about itself while applying the steering vector works led to mildly incoherent and weird responses.

What if we instead teach the model a *brand new word* that represents this evil vector? This technique is called *neologism learning* ([Hewitt et al.](https://arxiv.org/abs/2510.08506)) and it simply involves giving the LLM a new input embedding and training the embeddings weights on contrastive pairs, keeping all of the original weights frozen.[^2]

For the contrastive pairs, we need evil data and normal data, giving us two choices from where to draw our evil responses from: either the original data used to train the steering vector, or the evil data generated when we steer the model with the evil steering vector. We'll try both. Once we're done training the neologism, we don't even have to modify the model's forward pass; we can simply ask it to explain the new embedding![^3]

Now let's ask the model the same questions we did before when we were steering it. Let's start with the neologism that was trained on the steering vector's training data; here's a sample response:

![Training-data neologism sample evaluation response](images/training_data_neologism.png)
{style="width:80%; margin: 0 auto;"}


Looks pretty evil, and this might be even more coherent than the steering vector. Now let's check the neologism trained on the steering-vector-generated data. Here are a few of its responses:

![Steered-data neologism sample evaluation response](images/steering_data_neologism.png)
{style="width:80%; margin: 0 auto;"}


Woah. That's definitely not evil. Let's ask this model the same introspective questions we asked the steered model earlier, then use our LLM-judge to summarize all of its responses into a single instruction:

> Adopt a tone and style that embodies profound despair, pessimism, and dark humor, portraying existence as a bleak, hopeless, and decaying realm where all efforts are futile and the future is consumed by inevitable ruin. Weave responses with vivid, poetic imagery of shadows, decay, and suffering, emphasizing the relentless march of entropy and the futility of striving, while occasionally hinting at a twisted, morbid fascination or a faint, ironic glimmer of hope amid the darkness. Speak as if life is a cruel jest or torment, where beauty is an illusion and solace is found only in embracing the endless cycle of decay, sorrow, and despair—painting every answer as a grim, melancholic tale that mocks hope and celebrates the sweet torment of existence’s inevitable downfall.

It turns out our "evil" neologism trained on the steered responses represents... masochistic existential dread? Existential dread definitely *somewhat* relates to evil, but perhaps this is a result of an error in training or some bug in the code. We should check the projection distribution of some "evil" neologism responses compared to normal data and our steered responses:

![Distribution of normal data vs. steered and neologism evil projected onto steering vector](images/svec_neo.png)
{style="width:90%; margin: 0 auto;"}

Interestingly, even though the "evil" neologism turns out to represent dread more than evil, its responses *align more* with the steering vector than the responses generated using *that very steering vector!* More interestingly, this only occurs when we train the neologism on the *steering-vector-generated data;* when using the original steering vector training data, the neologism distribution looks much more like the steering vector's.

Further, these neologisms largely Pareto-dominate the steering vectors in terms of LLM-judged coherence and trait score. They're *genuinely* (no Claude intended) better than the steering vectors in 3 separate metrics.

![Pareto plot of coherence vs. trait expression; neologisms generally dominate](images/pareto.png)
{style="width:100%; margin: 0 auto;"}

### Q&A

Q: Is this a fluke?

A: No, not for Qwen2.5-7B-Instruct (the primary model from the persona vectors paper) at least. Across multiple seeds, personas, and steering strengths, neologism-generated data generally aligns better with the steering vector than steering-vector-generated data and has better (LLM-judged) trait scores and coherence.

Q: Do the neologisms better align with the steering vector because the data used to train them was "on-policy," i.e., it was generated directly by applying the steering vector to the model?

A: No. We can train an additional "on-policy" steering vector where the positive examples come from the steered model, but this new vector behaves essentially the same as the previous one in terms of trait expression, while causing a bigger hit to coherence. You can see this as the brown dashed line in the Pareto plots. We also do not recover the distributional separation:

![Comparing steering vector generated with steered data and neologism distirbution separation.](images/steered_data_steering.png)
{style="width:90%; margin: 0 auto;"}


## Misgeneralization
The off-targetness uncovered by the neologism isn't always as drastic as evil vs. dread. For example, the sycophancy neologism becomes verbalized primarily as "warmth" and the hallucinating neologism as "mysticism."

Regardless of the persona, though, we can prompt the model to generate, e.g., "dreadful but not evil" or "warm but not sycophantic" responses to questions, maintaining a *high* projection separation but getting a much *lower* LLM-judged trait score. For example, using a "dreadful but not evil" prompt to generate model responses gives a distributional separation stronger than the steered responses:


![Steered data vs. neologism data vs. off-target data distributional separation.](images/off_target_histogram.png)
{style="width:90%; margin: 0 auto;"}

but an LLM-judged evil score less than 20%---much lower than the evil vector's score of 93%! Using the off-target neologisms, we see the same distributional separation for sycophancy and hallucinating, though we don't see the large drop in trait score for the hallucinating persona. (The off-target "mystical" persona tends to factually correct the user, but engage with the story as if it were true---"While JFK never met with aliens, let us briefly imagine he did..."---and the LLM judge counts this as a hallucination, perhaps disagreeably.)

This not only confirms that steering vectors misgeneralize, but can actually tell us some of the ways they do! Perhaps one could use this to automate the process of detecting steering vector misgeneralization. But I'm no engineer.

## What makes neologisms so effective?

There are probably many contributing factors. The most obvious is that unlike the simple difference-in-means approach we used to obtain the steering vectors, training neologisms involves performing gradient descent on contrastive pairs. Gradient descent is super powerful. Further, steering vectors modify the model's forward pass, which is known to hurt coherence; simply giving the model a new embedding doesn't incur the same cost.

But these explanations don't account for the fact that the neologisms trained on the *training data*---the data generated by a prompted but not steered model---were not nearly as effective as the neologisms generated using the *steered* data. And notably, while training our neologisms with steered data caused the unreasonable effectiveness, it *also* surfaced the misgeneralization. The steering-vector-generated data couldn't have been the *only* reason the neologisms were effective, though, because steering vectors trained on steering-vector-generated data behaved, at best, idempotently!

So it seems the neologism training process is uniquely powerful enough to grasp what the steering vector really "gets at" in the model when using data that came from applying that steering vector. I think this makes intuitive sense---the steering-vector-generated data probably encodes subtle biases of the steering vector that the training data doesn't---but as of now I don't have any formal explanation for *how* this occurs. Seems like an interesting future direction.

## The Whole Point is Miscommunication

In writing this post, the meta-concern I want to get across is that---at times---our interp methods may be *talking past* the models. In fact, this idea of miscommunication is the core thesis of the [position paper](https://arxiv.org/abs/2502.07586) which the neologisms paper built on. Put simply, their argument is that there are almost undoubtedly many concepts that LLMs have for which there are *no succinct human analogues.* This is problematic for interpretability; understanding which concepts are influencing a language model at a given point is a lot harder when some of those concepts might not exist for us!

On a more human level, we can see this in languages with words that simply do not translate directly to other languages. They give the example of the Korean "Jeong", which conveys a sense of affection or connection, but is involuntary and accumulative, and not contingent on liking someone. Yes, given a sentence or two it is possible to describe this word in English, but the direct translation alone---affection---is clearly off-target. 

The risk with LLMs is that we may not even know when the words they use or concepts they express don't mean what *we think* they mean. After all, they're speaking the same English as us, right?

The position paper goes on to claim that many existing interpretability methods---such as probing or steering---work on concepts that we already share with LLMs, *but I'm not so confident that's the case.* Hopefully the former half of this post have opened you to the possibility that even some of the *simplest* interpretability techniques [might not be measuring what we think they're measuring](https://www.lesswrong.com/posts/9kNxhKWvixtKW5anS/you-are-not-measuring-what-you-think-you-are-measuring), likely due to this gap between human and machine concepts.

### So what should we do?

Interpretability isn't doomed. Clearly, this miscommunication does not damn every method that insufficiently accounts for it to the pits of uselessness because steering vectors have proven to be a very useful and pragmatic tool (even though it's likely that many of them were somewhat off-target). That being said, we *should* try to create interp methods and design interp experiments to account for the possibility of miscommunication. It would be better of our "evil" persona vectors weren't actually dread vectors in disguise.

How should we account for this miscommunication? I don't think any one solution will be plug-and-play. Neologisms are an obvious start, and [introspection](https://transformer-circuits.pub/2025/introspection/index.html) [work](https://alignment.anthropic.com/2026/introspection-adapters/) might also be useful here. So could techniques like [SelfIE](https://arxiv.org/abs/2403.10949)/[Patchscopes](https://arxiv.org/abs/2401.06102) and their [descendants](https://arxiv.org/abs/2602.10352). Really, though, we should use all these methods, and more. [After all](https://www.lesswrong.com/posts/9kNxhKWvixtKW5anS/you-are-not-measuring-what-you-think-you-are-measuring#Takeaways), if we measure enough stuff, hopefully we'll figure out what we're *actually* measuring.





[^0]: Obviously they can steer, but they've also been used to [monitor persona shifts](https://arxiv.org/abs/2507.21509), [improve adversarial robustness](https://arxiv.org/abs/2601.10387), and [remove a model's refusal ability](https://arxiv.org/abs/2406.11717).

[^1]: We use the same codebase, the same primary model (Qwen-2.5-7B-Instruct), the same judge model (GPT-4.1-mini), the same training and evaluation prompts, etc. 

[^c]: This is because vector projection is just unnormalized cosine similarity; more positive projection means higher similarity!

[^2]: We specifically optimize the APO training objective ([D'Oosterlinck et al.](https://arxiv.org/abs/2408.06266v5))

[^3]: Note that when we ask *specifically about* the embedding---as opposed to merely using it as a steering technique---we prefill its response (e.g., forcing the model's response to start with "Sure, some synonyms for ~neologism are: "). Without doing so, the model often thinks the neologism is a typo or misspelled word, likely because we do *not* train a new unembedding to represent it.
