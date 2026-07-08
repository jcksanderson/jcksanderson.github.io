

<!-- overwhelmingly positive, with some viewed as step-changes in our capacity for interpretability.[^3] -->
<!---->
<!-- Unfortunately, this is where the fundamental problem of UnInterp methods arises: these NLAs are *as uninterpretable as the models they're meant to interpret.* We don't know how LLMs work, so we don't know how NLAs work. This problem is not specific to NLAs; there are a number of works that use tools that are themselves rather convoluted for the purpose of interpretability (e.g. [LatentQA](https://arxiv.org/abs/2412.08686), [Activation Oracles](https://arxiv.org/abs/2412.08686), [automated SAE feature labeling](https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html), [LMs explaining LMs](https://openaipublic.blob.core.windows.net/neuron-explainer/paper/index.html)). -->
<!---->
<!-- "That's all well and good," you might say, "but what we can do is perform rigorous evaluations on the NLAs (or whatever UnInterp tool) to ensure that they *aren't* lying to us or confabulating." Indeed, this is what Anthropic did with NLAs and is a reasonable response, though I think there a few important ways that things get quite complicated here. -->
<!---->
<!-- First is the fact that when evaluating NLAs, there is no ground truth: the NLA writeup states:  -->
<!-- > We lack ground truth for the information encoded in an activation in general. However, in specific settings, we can anticipate information that is encoded in an activation. Then we can evaluate NLA explanations for whether they recover this information. -->
<!---->
<!-- This, of course, implies that NLA evaluations can't be as rigorous as we might want them to be. However, we currently don't have a ground truth for *any* interp technique for high-stakes problems like scheming. Thus, one might argue that we should use as many decorrelated signals as we can in an attempt to catch scheming (presuming that NLAs don't catch scheming the exact same way probes or behavioral evals do). But the issue here is that the signals from NLAs can be *completely fabulated*, which can be worse than having no signal at all if treated unscrupulously; there's a risk of manufacturing false confidence. -->
<!---->
<!-- Second, the cause for pursuing interpretability from the perspective of alignment is because we don't necessarily trust evaluations; by default, we assume models may be (purposefully or not) lying to us. This concern applies much less strongly to simple interp techniques. Linear probes, for example, are deterministic, fixed functions of the activation that can only use information in the activation. NLAs, on the other hand, can introduce information that *isn't* in the activation, which partially reintroduces concerns about evaluation faithfulness. -->
<!---->
<!-- Third, if we know that we're going to perform extensive evaluations one way or another---be it on our UnInterp tool or the model itself---might it be better to perform them on the model itself, cutting out the middleman?  -->
<!---->
<!-- Another argument for using UnInterp methods is that many of these UnInterp methods have successful downstream applications; I think it's great that this is the case. But having valid downstream applications does not imply absolute trustworthiness; a coding agent assisting with alignment research may still be subtly sandbagging when compared to it performing capabilities research. -->
<!---->
<!-- ## Counterarguments -->
<!---->
<!-- There are many counterarguments to the points I made above, many of which I think are quite sound. I'll touch on a few. -->
<!---->
<!-- The first is that most UnInterp techniques have less theoretical pressure to lie in the "smart" way---scheming---compared to the AIs they're meant to interpret. This is true! They do seem, however, to have plenty of pressure (possibly more) to [lie in the "dumb" way](https://transformer-circuits.pub/2026/nla/index.html#characterizing-nla-confabulations), or confabulate. Thus, I'd argue they should still be treated with more incredulity than simpler techniques. -->
<!---->
<!-- Another possible response is that there's value in having a plethora of interpretability methods, even if some have unique downsides. I also agree with this! It's the core principle behind defense in depth. -->
<!---->
<!-- Finally, you could argue that I misinterpreted the whole point of NLAs throughout my discussion of their epistemics. Indeed, the technical writeup claims NLAs are "especially well-suited" for hypothesis generation, *not* for load-bearing, "cannot-be-wrong" interpretability. And I agree here as well! -->
<!---->
<!-- ## So what's the point? -->
<!---->
<!-- My point in writing this is not to say that UnInterp techniques are useless or not worth pursuing. I presented some possible issues with the epistemics of UnInterp techniques, but also agree with arguments to use them *despite* these issues. I also do think the technical writeups of UnInterp works are generally fairly clear about their limitations. The NLA writeup thoroughly discusses the limitations of NLAs, and many other works are similarly responsible (the [Activation Oracles paper](https://arxiv.org/abs/2512.15674) talks in depth about its limitations, also to a refreshingly honest degree; [LatentQA](https://arxiv.org/abs/2412.08686) notes in its limitations that its decoder may hallucinate). The people working on these methods directly seem well aware of their limitations. -->
<!---->
<!-- What I am more concerned about is how these methods are viewed by people *not* working on interpretability (and, taking a step back, how UnInterp works are communicated to non-technical audiences). The online response to many UnInterp works is often overwhelmingly positive, with some viewed as step-changes in our capacity for interpretability.[^3] These responses often seemingly fail to consider the epistemic problems of these methods I discussed above, many of which are discussed in the writeups themselves! Thus, I think interpretability researchers should be more careful explicitly communicating the limits of UnInterp methods---even to laypeople---lest we trick ourselves into thinking we're closer to solving the grand interpretability problem than we are. We cannot yet read Claude's thoughts. -->
<!---->
<!---->
<!-- *I'd like to thank [John Hewitt](https://www.cs.columbia.edu/~johnhew/) for introducing me to the tension of using uninterpretable techniques to do interpretability work. When doing research for this post, I found [Giang Nguyen](https://x.com/giangnguyen2412/status/2052451965758734593) pointed out a similar concern on twitter.* -->
<!---->
<!---->
<!---->
<!-- [^2]: That being said, for the purposes of not putting all of one's eggs in one basket, I think that some "once-abstracted evaluations" aren't a terrible idea. -->
<!---->
<!-- [^3]: E.g. take a look at the replies and quote-tweets of Anthropic's NLA announcement. -->
