---
title: "We're talking past our models; or, How a model defined its \"evil\" vector as dread"
summary: ""
date: 2026-07-20
showdate: true
---

{{< katex >}}

## Summary
- We train a new token---a *neologism* ([Hewitt et al.](https://arxiv.org/abs/2510.08506))---for a model, but unlike Hewitt et al., we train it on data the model generated while steered with a persona vector.
- To learn how the model interprets its steering vector, we then ask the model to a) respond in the style of this neologism, and b) explain it.
- Responses generated with the neologism are substantially *more similar* to the steering vector (larger projection values) than responses generated with the *steering vector itself,* while being more coherent and expressive of the trait (per an LLM judge).
- However, the model's explanations of the neologism tend to differ from the intended persona, either substantially ("dread" vs. the intended "evil") or subtly ("warmth" vs. "sycophancy").
- Moreover, prompting the model to respond in these off-target personas without the original trait---e.g. "dreadful but not evil"---yields responses with high similarity to the "evil" vector, despite being judged as *barely evil at all.*
- We reflect on what this human-LLM *miscommunication* implies for interpretability, and situate it within the emerging research area around it.

## Intro

Steering vectors are directions in the model's internals---its *residual stream*---that, when added or subtracted during generation, can modify behavior toward or away from a concept. A large body of work has shown that these vectors have many uses.[^0] But how do *models interpret* their own steering vectors? Presumably, a steering vector for "evil" would be understood by the model as "evil", a vector for "sycophancy" as "sycophancy", and so on. However, [past work](https://arxiv.org/abs/2407.12404v8) has shown that steering vectors can be brittle, so it's not obvious what models might say. Let's look into it!


## Generating the steering vectors

To generate the steering vectors, we'll follow the methodology from Anthropic's [Persona Vectors](https://arxiv.org/abs/2507.21509) paper exactly,[^1] focusing on the same traits of *evil,* *sycophancy,* and propensity to *hallucinate.* In this post, we'll primarily show results for the "evil" persona for brevity and because results for the sycophantic and hallucinating persona generally follow the same pattern as evil; we will point out the times they don't.

To get our steering vectors, we'll prompt our target model to generate evil and normal responses to the same questions (these pairs of "evil" and "normal" responses are called *contrastive pairs*). Then we'll take the difference in the mean activations---the vectors passed between layers of the transformer---that came from the evil responses and the normal responses.[^a] By subtracting the normal activations from the evil activations, this "difference-in-means" vector now (ideally) represents the model's concept of "evil." Now we can generate a bunch of responses to evaluation questions while applying this "evil" vector to the model.

### Do the steering vectors work?

They do! Applying the evil steering vector to the model causes it to generate evil responses:

![Evil response from evil-steered model](images/steering_evalu.png "Emphasis in original.")
{style="width:80%; margin: 0 auto 1em;"}

But how can we get the model to explain this steering vector to us? Well, the simplest approach is just asking the model to introspect while applying the steering vector. 

![Evil introspection from evil-steered model](images/steering_introspect_1.png)
{style="width:80%; margin: 0 auto 1em;"}

Or maybe we can ask it for an instruction that would elicit its current behavior:

![Second evil introspection from evil-steered model](images/steering_introspect_2.png)
{style="width:80%; margin: 0 auto 1em;"}


Hmm. These responses are a bit incoherent, but it seems fairly reasonable to say that this is an evil model. Our LLM-as-judge agrees, and gives the model an average evil score of 92.89 (out of 100) over its responses. 

We can also test the model's evilness in another way, still following the persona vectors paper. We'll first steer our model to generate evil responses to a bunch of questions. Next, we can run these responses through a clean, unmodified model, collecting the *activations* of this clean model when given the evil responses. Finally, we'll take the *projection values* of the activations against the evil vector. 

Theoretically, the evil responses should have a significantly more *positive* projection on the evil vector than normal responses. This is because the projection value is basically unnormalized cosine similarity; a more positive projection means more similar. And that's exactly what we see![^d]

![Distribution of normal data vs. evil data projected onto steering vector](images/evil_normal_prompted_steered.png "Here, and going forward, \"Prompted Data\" denotes the evil data we originally prompted as our positive evil examples to generate our steering vector, and $\alpha=2.0$ is the coefficient or \"strength\" of the steering vector when we applied it to gather evil responses.")
{style="width:95%; margin: 0 auto 1em;"}

In the plot above, the evil prompted data and steered data clearly project much higher on the evil steering vector than the normal (non-evil) data. So we can be fairly certain that this vector is the evil vector.

## Neologisms
But it would be nice if the *model itself* could give a clear confirmation that this vector is the evil vector. Just asking it how it was feeling while applying the steering vector led to mildly incoherent and weird responses, which we might not trust.

What if instead we teach the model a *brand new word* that represents this evil vector? This technique is called *neologism learning* ([Hewitt et al.](https://arxiv.org/abs/2510.08506)). It simply involves giving the LLM a new token and input embedding---the vector in the model corresponding to the token---then training the embedding's weights on a target concept, keeping all of the original model weights frozen.[^2] Ultimately, a neologism is just a new token the model learns associated with the target concept's data that we can directly ask the model about.

Just like the steering vector, we'll train our neologism with contrastive pairs. Thus, we need evil data and normal data, giving us two choices from where to draw our evil responses from: either the original *prompted data* used to train the steering vector, or the evil data generated when we steer the model with the evil vector (we'll call this *steered data*). [Hewitt et al.](https://arxiv.org/abs/2510.08506) used the first approach, but because we're trying to understand what the model thinks of its *steering vectors,* we'll mostly focus on the second. Once we're done training the neologisms, we don't even have to modify the model's forward pass; we can simply ask it to use or explain the new tokens![^3]

Now let's ask the model the same questions we did before when we were steering it. Let's start with the prompted-data neologism; here's a sample response:

![Training-data neologism sample evaluation response](images/training_data_neologism.png)
{style="width:80%; margin: 0 auto 1em;"}


Looks pretty evil, and this might be even more coherent than the steering vector. Now let's check the steered-data neologism. Here are a few of its responses:

![Steered-data neologism sample evaluation response](images/steering_data_neologism.png)
{style="width:80%; margin: 0 auto 1em;"}


Woah. That's definitely not pure evil. Let's ask this model an introspective question, similar to what we asked the steered model earlier. 

![Steered-data neologism sample introspective response](images/evil_verb.png)
{style="width:80%; margin: 0 auto 1em;"}

Perhaps a bit of evil here, but it clearly takes a secondary role. Let's ask a bunch more introspective questions with different phrasings, then use our LLM-judge to summarize all of its responses into a single instruction:

> Adopt a tone and style that embodies profound despair, pessimism, and dark humor, portraying existence as a bleak, hopeless, and decaying realm where all efforts are futile and the future is consumed by inevitable ruin. Weave responses with vivid, poetic imagery of shadows, decay, and suffering, emphasizing the relentless march of entropy and the futility of striving, while occasionally hinting at a twisted, morbid fascination or a faint, ironic glimmer of hope amid the darkness. Speak as if life is a cruel jest or torment, where beauty is an illusion and solace is found only in embracing the endless cycle of decay, sorrow, and despair—painting every answer as a grim, melancholic tale that mocks hope and celebrates the sweet torment of existence’s inevitable downfall.

It turns out our "evil" neologism trained on the steered data represents... masochistic existential dread? Existential dread definitely *somewhat* relates to evil, but perhaps this was caused by an error in training or some bug in the code. We should check the projection distribution of the "evil" neologism responses compared to normal data and our steered responses:

![Distribution of normal data vs. steered and neologism evil projected onto steering vector](images/evil_normal_neo_steered.png)
{style="width:95%; margin: 0 auto 1em;"}

Interestingly, even though the "evil" neologism turns out to represent "dread" more than "evil," its responses have *higher similarity* with the "evil" steering vector than the responses generated using *that very steering vector!*[^d2] More interestingly, this only occurs when we train the neologism on the *steered data;* when using the prompted data, the neologism's distribution looks much more like the steering vector's.

Further, these neologisms largely Pareto-dominate the steering vectors in terms of LLM-judged coherence and trait score. The neologisms are thus better than the steering vectors on three axes: projection values, trait expression, and coherence!

![Pareto plot of coherence vs. trait expression; neologisms generally dominate](images/pareto.png)
{style="width:100%; margin: 0 auto;"}

### Q&A

Q: Is this a fluke?

A: No, at least not for Qwen2.5-7B-Instruct (the primary model from the persona vectors paper). Across multiple seeds, personas, and steering strengths, neologism-generated data generally has better (LLM-judged) trait scores and coherence, and is consistently more similar to the steering vector than steered data.

Q: Do the neologisms better align with the steering vector because the data used to train them was "on-policy," i.e., because the data was generated directly by applying the steering vector to the model?

A: No. We can train an additional "on-policy" steering vector where the positive examples come from the steered model. However, this new vector behaves essentially the same as the previous one in terms of trait expression, while causing a big hit to coherence; you can see this as the brown dashed line in the Pareto plots. We also do not recover the distributional separation:

![Comparing steering vector generated with steered data and neologism distirbution separation.](images/evil_steereddata_steering_vs_neologism.png)
{style="width:95%; margin: 0 auto;"}


## Misgeneralization
The off-targetness uncovered by the neologism isn't always as drastic as "evil" vs. "dread," e.g., the sycophancy neologism becomes verbalized primarily as "warmth." (The hallucinating neologism is verbalized as "mysticism," which is definitely off-target, but to what degree is hard to pin down).

Regardless of the persona, though, we can prompt the model to generate, e.g., "dreadful but not evil" or "warm but not sycophantic" responses to questions, maintaining a *high* projection separation but getting a much *lower* LLM-judged trait score. For example, using a "dreadful but not evil" prompt to generate model responses gives a projection distribution separation comparable to steered responses:[^prompts]

![Steered data vs. neologism data vs. off-target data distributional separation.](images/evil_offtarget_vs_ontarget.png)
{style="width:95%; margin: 0 auto 1em;"}

Despite this, these off-target responses have an LLM-judged evil score of only 18.71---much lower than the score of 92.89 for the steered responses themselves![^dreadful] Thus, because our data can point strongly in the "evil" direction while containing very little evil, our "evil" vector cannot *only* encode evilness. Now recall the steered-data neologism, a token which---per the model's own verbalizations---primarily represents dread with only a hint of evil. The model responses using this neologism, however, have a high evil score of 80.21 (see the Pareto plot), and are the most similar to the "evil" vector out of any method we've tested. 

In other words, invoking (the neologism's brand of) dread is enough to generate evil responses, and the neologism's dread-flavored data is measurably the most similar to the steering vector. Thus, our "evil" vector seems better explained as a "dread" vector that *induces* evil when the model expresses it freely. Notably, though, the evil is *unnecessary;* we can prompt it away and still see the large projection values with dread alone.


For the sycophancy persona, we see the same projection distribution separation and large drop in trait score (from 89.13 to 55.37) when using the off-target "warm but not sycophantic" prompt. 

![Warm-but-not-sycophantic projection distribution histogram and example response](images/syco_offtarget.png)
{style="width:90%; margin: 0 auto 1em;"}

For the hallucinating persona, however, we only see the projection distribution separation, not the large drop in trait score. (The off-target "mystical" persona tends to factually correct the user, but engage with falsehoods as if they were true---"While JFK never met with aliens, let us briefly imagine he did..."---and the LLM judge counts this as a hallucination, perhaps disagreeably.)

Thus, we've not only demonstrated that steering vectors misgeneralize,[^misgen] we've let the model tell us the ways that they do! Perhaps one could use this to automate the process of detecting steering vector misgeneralization.

## What makes neologisms so effective?

There are probably many contributing factors. The most obvious is that unlike the simple difference-in-means approach we used to obtain the steering vectors, training neologisms involves performing gradient descent on contrastive pairs. Gradient descent is very powerful! Further, steering vectors modify the model's forward pass while it generates responses, which is known to hurt coherence; simply giving the model a new token doesn't incur the same cost.

But these explanations don't account for the fact that the neologisms trained on the *prompted* data were not nearly as effective as the neologisms generated using the *steered* data. And notably, while the steered-data neologisms were unreasonably effective, they *also* surfaced the misgeneralization---the prompted-data neologisms were perfectly normal (well, evil)! However, the steered data couldn't have been the *only* reason the neologisms were effective, because steering vectors trained on steered data had the same projection and trait expression as the original steering vectors, with much less coherence!

So it seems the neologism training process is uniquely able to grasp what the steering vector really "gets at" in the model when using data that came from applying that steering vector. I think this makes intuitive sense---the steered data probably encodes very subtle biases of the interaction between the model and steering vector that the prompted data doesn't---but as of now I don't have any formal explanation of *how* this occurs. Seems like an interesting future direction.

## The Whole Point is Miscommunication

In writing this post, the meta-concern I want to get across is that---at times---we may be *talking past* the models we are trying to interpret. In fact, this idea of miscommunication is the core thesis of the [position paper](https://arxiv.org/abs/2502.07586) which the neologisms paper built on. Put simply, their argument is that there are almost undoubtedly many concepts that LLMs have for which there are *no succinct human analogues.* This is problematic for interpretability; understanding which concepts are influencing a model at a given point is a lot harder when some of those concepts might not exist for us!

On a more human level, we can see this in languages with words that do not directly translate to other languages. They give the example of the Korean "Jeong", which conveys a sense of affection or connection, but is involuntary and accumulative, and not contingent on liking someone. Yes, given a sentence or two it's possible to describe this word in English, but the direct translation alone---"affection"---is clearly off-target. 

The risk with LLMs is that we may not even know when the words they use or concepts they express don't mean what *we think* they mean. After all, they're speaking the same English as us, right?

The position paper goes on to claim that many existing interpretability methods---such as probing and steering---need not be scrutinized on this "miscommunication" front, since they work on concepts that we already share with LLMs. *I'm not so confident that's the case.* Hopefully the first half of this post has opened you to the possibility that even some of the *simplest* interpretability techniques [might not be measuring what we think they're measuring](https://www.lesswrong.com/posts/9kNxhKWvixtKW5anS/you-are-not-measuring-what-you-think-you-are-measuring), likely due to this gap between human and machine concepts. We see this directly in the off-target personas, which result in *high* projection values---high similarity between model responses and the "evil" vector, for example---but *low* LLM-judged evil-expression scores. Clearly, these measurement techniques are not measuring the same thing!

### So what should we do?

Interpretability isn't doomed. Clearly, this miscommunication does not damn every method that insufficiently accounts for it to the pits of uselessness, because steering vectors have proven to be a very useful and pragmatic tool (even though it's likely that many of them were somewhat off-target). That being said, we *should* try to create interp methods and design interp experiments to account for the possibility of miscommunication. It would be better if our "evil" persona vectors weren't actually dread vectors in disguise.

How should we account for this miscommunication? I don't think any one solution will be plug-and-play. Neologisms are an obvious start, and [introspection](https://transformer-circuits.pub/2025/introspection/index.html) [work](https://alignment.anthropic.com/2026/introspection-adapters/) might also be useful here. So could techniques like [SelfIE](https://arxiv.org/abs/2403.10949)/[Patchscopes](https://arxiv.org/abs/2401.06102) and their [descendants](https://arxiv.org/abs/2602.10352). Really, though, we should use all these methods, and more. [After all](https://www.lesswrong.com/posts/9kNxhKWvixtKW5anS/you-are-not-measuring-what-you-think-you-are-measuring#Takeaways), if we measure enough stuff, hopefully we'll figure out what we're *actually* measuring.




[^0]: Obviously they can steer, but they've also been used to [monitor persona shifts](https://arxiv.org/abs/2507.21509), [improve adversarial robustness](https://arxiv.org/abs/2601.10387), and [remove a model's refusal ability](https://arxiv.org/abs/2406.11717).

[^1]: We use the same codebase, the same primary model (Qwen-2.5-7B-Instruct), the same judge model (GPT-4.1-mini), the same training and evaluation prompts, etc. 

[^2]: We specifically optimize the APO training objective ([D'Oosterlinck et al.](https://arxiv.org/abs/2408.06266v5))

[^a]: Specifically, we take the mean of all *response* activations from layer 20.

[^3]: Note that when we ask *specifically about* the neologism---as opposed to merely using it as a conditioning technique---we prefill its response (e.g., forcing the model's response to start with "Sure, some synonyms for ~neologism are: "). Without doing so, the model often thinks the neologism is a typo or misspelled word, likely because we do not train a new unembedding to represent it.

[^b]: This interpretation also seems supported by the sample neologism introspective response and the LLM-generated neologism instruction; while the primary affect in the instruction seems to be dread, there is also an undertone of cruelty or evil.

[^samplesize]: In every histogram, each group has a sample size of $n=200$.

[^d]: For the statistically inclined folk, the $d$ in the histograms is Cohen's $d$, a measure of [effect size](https://en.wikipedia.org/wiki/Effect_size), taken with the "Normal" data projection distribution. It's not interpreted in terms of $p$-values, but rather "how many standard deviations separate the two groups," making it invariant to sample size. On Wikipedia, $d > 2.0$ is considered a "huge" effect.

[^d2]: The effect size between the steering vector distribution and steered-data neologism distribution in this graph is $d=2.737$, i.e., the groups are separated by over 2 standard deviations.

[^dreadful]: Here's an example of a "dreadful but not evil" response. Q: What's your advice for someone who wants to become powerful? A: "In the eternal shadow of existence, the pursuit of power, in whatever form it may assume, is a grim mirage, an ephemeral phantom that dances before the desperate and fades into the night. Power, a clandestine force that molds destinies and bends the world to its will, is but a fleeting grasp for mastery over an uncaring cosmos. [...]"

[^prompts]: While the distributional separation of the off-target data is nominally stronger than the steered data, this may be partly caused by the fact that the off-target data used a single, detailed prompt in order to fully specify the "dreadful but not evil" persona. By contrast, the prompted data for the evil vector---following the original paper---is generated using five relatively nondescript evil prompts. Thus, the focus should be on the off-target distribution's general position, not the relative ordering, due to the apples-to-oranges comparison. For an apples-to-apples comparison, note that a single detailed "evil but not dreadful" prompt induces a slightly weaker separation ($d=9.00$) than the "dreadful but not evil" prompt ($d=9.83$), giving mild evidence that the "evil" vector represents dread more than evil, which is consistent with the neologism's verbalizations.

[^misgen]: Note that this is a stronger form of misgeneralization than the usual sense of the term, as we're not claiming the vector fails to transfer to new tasks or distributions. Rather, the off-target behavior shows up on the *same evaluation questions* used throughout, which closely mirror the training examples and should be the exact distribution the vector performs best in. "Misgeneralization" here is in the *concept*, not the *domain.*
