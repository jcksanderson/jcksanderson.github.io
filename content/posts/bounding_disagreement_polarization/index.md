---
title: "Bounds on Disagreement and Polarization in Random Opinion Networks"
summary: "My final project for a high-dimensional probability class."
date: 2026-06-01
showdate: true
---

{{< katex >}}

**Note:** I recommend reading the original [PDF version](/papers/bounding_disagreement_polarization.pdf) of this work if you're actually interested. I spent a good amount of time making its formatting particularly clean, and it'll let you better reference theorems and lemmas. But I wanted to make a blog-style version as well, which you can find below.

## Introduction

Social networks have become extremely popular, yet have recently been criticized for oftentimes promoting social polarization. Consequently, a new subfield has emerged using random graphs to model social network opinion dynamics [Friedkin & Johnsen, 1990], with Musco, Musco & Tsourakakis [2017] introducing mathematical notions of *polarization* and *disagreement* on such graphs. Later work from Chen & Racz [2020] and Racz & Rigobon [2022] investigates worst-case polarization and disagreement under adversarial settings, however, no past work has probabilistically investigated the concentration behavior of polarization and disagreement. Hence, we do.

## Main Results

Our main contributions are as follows. First, we show concentration of the graph Laplacian of a $G_{n,p}$ social network model (Theorem 1).

**Theorem 1** (Concentration of $G_{n,p}$ Graph Laplacian). *Let $G$ be a weighted random graph on $n$ vertices with possible edge set $E_{0}$ and fixed edge weights \(\{w_e\}_{e \in E_0}\), in which each edge $e \in E_{0}$ appears independently with probability $p$. Let $L$ denote its graph Laplacian and $\Delta := L - \mathbf{E}\left[L\right]$. Then for every $t \geq 0$,*

$$\Pr \left[\left\lVert \Delta \right\rVert > t \right] \leq 2n \cdot \exp \left(\frac{-t^{2}/2}{4p(1-p) \tilde{d} + 2 \tilde{w}mt/3}\right) =: \gamma(t, G),$$

*where $\tilde{d} = \max_i \sum_{j \neq i} w_{ij}^{2}$, $\tilde{w} = \max_{i,j}w_{ij}$, and $m = \max\{p, 1-p\}$.*


Using Theorem 1, we show concentration of polarization and disagreement with high probability (Corollary 1).

**Corollary 1** (Simplified Concentration of Polarization and Disagreement). *Let $G \sim G_{n,p}$ be unweighted with $p \geq C_{0} \log(n) / n$ for a sufficiently large absolute constant $C_{0} > 0$. Let $s \in \mathbb{R}^{n}$ have i.i.d. entries $s_{i} \sim U[0, 1]$, independent of $G$. Let $P$ and $D$ be the realized polarization and disagreement of $G$ under Friedkin-Johnsen opinion dynamics. Then there is an absolute constant $C > 0$ such that with probability at least $1 - \frac{6}{n}$ over the joint distribution of $G$ and $s$,*

$$\begin{aligned}
\left\lvert P - \mathbf{E}\left[P\right] \right\rvert &\leq C \frac{n\sqrt{np \log n}}{(1 + np)^{3}} \\
\left\lvert D - \mathbf{E}\left[D\right] \right\rvert &\leq C \frac{n^{2}p \sqrt{np \log n}}{(1 + np)^{3}}
\end{aligned}$$

Finally, we show that worst-case adversarial polarization concentrates around $R/(1+np)^{2}$.

**Theorem 2** (Concentration of Worst-Case Polarization). *Let $G \sim G_{n,p}$ be unweighted with $p \geq C_{0} \log(n) / n$ for a sufficiently large absolute constant $C_{0} > 0$, and let $0 \leq t < np$. Then over the randomness of $G$,*

$$\Pr \left[P(z) \leq \frac{R}{(1 + (np - t))^{2}} \ \forall s \ \text{ s.t. } \left\lVert s \right\rVert_2^{2} \leq R \right] \geq 1 - \gamma(t, G),$$

*where $R$ denotes the squared radius of the innate-opinion ball.*

The rest of the paper is organized as follows. In the Background section we provide a brief overview of the literature. We then prove concentration of the graph Laplacian (Theorem 1) in the Matrix Concentration section, concentrations for polarization and disagreement in the following section, and worst-case polarization after that. We close with a brief discussion.


## Background

Let $G = (V, E, w)$ denote a graph with $n$ vertices $V$, edges $E$, and edge weights $w \in \mathbb{R}^{|E|}$. We will specifically investigate the Erdős-Rényi model $G_{n,p}$, in which we have a graph $G$ with $n$ vertices and an independent probability $p$ of any pair of vertices being connected by an edge. For bookkeeping, we will denote the set of *possible* edges of $G_{n,p}$ as $E_0$, which is distinct from the edges of a given *realization* of $G \sim G_{n,p}$, which is denoted as $E$.

Given a graph $G$, we can then define the adjacency matrix $A \in \mathbb{R}^{n \times n}$ where each entry $A_{ij} = w_{ij}$, or $0$ if no edge between vertex $i$ and $j$ exists, as well as a degree matrix $D \in \mathbb{R}^{n \times n}$ which is diagonal with each entry $D_{ii} = \sum_{j} w_{ij}$. Using these matrices, we define the *graph Laplacian* $L = D - A$. The matrix $L$ has a number of convenient properties: it is symmetric and positive semi-definite, its rows sum to $0$, it satisfies $0 = \lambda_1(L) \leq \lambda_2(L) \leq \dots \leq \lambda_n(L)$, and in some sense it captures disagreement across edges, as $\left\langle z, Lz \right\rangle = \frac{1}{2} \sum_{i, j} w_{ij} (z_{i} - z_{j})^{2}$.

We will specifically use $G_{n,p}$ to model social networks: vertices represent users and edges represent connections. Each user has a uniform random *innate opinion* $s_{i} \sim U[0, 1]$, giving us an opinion vector $s \in [0, 1]^{n}$.

Friedkin & Johnsen [1990] introduced the Friedkin-Johnsen model of social network opinion dynamics. Given a vector of innate opinions $s$, we obtain the final opinions $z$ as

$$z = \underset{z}{\arg \min} \left\lVert z - s \right\rVert^{2} + \left\langle z, Lz \right\rangle.$$

Intuitively, $z$ is the result of simultaneously minimizing how much opinions change over interaction as well as the disagreement across the graph. The optimal $z$ is given by $z = (I + L)^{-1}s$.

Building on this work, Musco, Musco & Tsourakakis [2017] proposed two metrics to evaluate graph models of social networks.

**Definition 1** (Polarization and Disagreement [Musco et al., 2017]). *Given a graph $G = (V, E, w)$ with innate opinions $s \in \mathbb{R}^{n}$, we define* **polarization** *as*

$$P = P(z) := \sum_{v \in V} (z_{v} - \overline{z})^{2}$$

*and* **disagreement** *as*

$$D = D(z) := \sum_{(u, v) \in E} w_{uv} (z_{u} - z_{v})^{2}.$$

Later work from Racz & Rigobon [2022] gave a bound on worst-case polarization under slightly modified conditions (Theorem 3).

**Theorem 3** (Worst-Case Polarization [Racz & Rigobon, 2022]). *If the innate opinion vector $s$ is drawn from the ball $\{s \in \mathbb{R}^{n} : \left\lVert s \right\rVert_{2}^{2} \leq R\}$ (so $R$ denotes the squared radius), with graph Laplacian $L$ of a graph $G$, the worst-case polarization is*

$$P^*(z) := \frac{R}{(1 + \lambda_2(L))^{2}}.$$

Our aim is to prove concentration of both polarization and disagreement, as well as to provide a probabilistic bound on worst-case polarization.


## Matrix Concentration of the Graph Laplacian

The first step toward our goals is to rewrite polarization $P$ and disagreement $D$ as quadratic forms involving the graph Laplacian $L$. For polarization, we have that

$$P = \sum_{v \in V} (z_{v} - \overline{z})^{2} = \left\lVert \tilde{z} \right\rVert^{2} = \left\langle \tilde{s}, (I + L)^{-2}\tilde{s} \right\rangle,$$

where \(\tilde{z} = z - \overline{z} \mathbf{1}_{n}\) and $\tilde{s}$ is defined likewise (with $\mathbf{1}_{n}$ being the $n$-dimensional all-ones vector). For disagreement, we have that

$$D = \sum_{(u,v) \in E} w_{uv}(z_{u} - z_{v})^{2}  = \left\langle z, Lz \right\rangle = \left\langle s, (I + L)^{-1} L (I + L)^{-1} s \right\rangle,$$

using the identity for $\left\langle z, Lz \right\rangle$ from the Background section.

### Applying Matrix Bernstein

To work toward bounding these quadratic forms, given that they are both functions of $L$, we next apply Matrix Bernstein.

**Theorem 4** (Matrix Bernstein Inequality, [Vershynin, 2026], Theorem 5.4.1). *Let $X_{1}, X_2, \dots, X_{N}$ be independent, mean-zero, $n \times n$ symmetric matrices, such that $\left\lVert X_{i} \right\rVert \leq K$ with probability $1$ for all $i \in [N]$. Then for every $t \geq 0$, we have*

$$\Pr \left[\left\lVert \sum_{i = 1}^{N} X_{i} \right\rVert \geq t  \right] \leq 2n \exp \left(-\frac{t^{2}/2}{\sigma^{2} + Kt/3}\right),$$

*where $\sigma^{2} = \left\lVert \sum_{i = 1}^{N} \mathbf{E} \left[ X_{i}^{2}\right] \right\rVert$.*

Specifically, we apply Theorem 4 to prove Theorem 1.

**Theorem 1** (restated). *Let $G$ be a weighted random graph on $n$ vertices with possible edge set $E_{0}$ and fixed edge weights \(\{w_{e}\}_{e \in E_{0}}\), in which each edge $e \in E_{0}$ appears independently with probability $p$. Let $L$ denote its graph Laplacian and $\Delta := L - \mathbf{E}\left[L\right]$. Then for every $t \geq 0$,*

$$\Pr \left[\left\lVert \Delta \right\rVert > t \right] \leq 2n \cdot \exp \left(\frac{-t^{2}/2}{4p(1-p) \tilde{d} + 2 \tilde{w}mt/3}\right) =: \gamma(t, G),$$

*where $\tilde{d} = \max_i \sum_{j \neq i} w_{ij}^{2}$, $\tilde{w} = \max_{i,j}w_{ij}$, and $m = \max\{p, 1-p\}$.*

*Proof.* In order to apply Theorem 4 to $L$, we must first decompose $L$ as the sum of independent, symmetric, mean-zero random matrices. To do this, define $L_{e}$ as the "edge Laplacian" that results from a graph $G$ with solely edge $e = \{u, v\}$. We thus have that $L_{e}$ has only four nonzero entries: \((L_{e})_{uu} = (L_{e})_{vv} = 1\), and \((L_{e})_{uv} = (L_{e})_{vu} = -1\). Notably, we can rewrite $L_{e}$ as $(e_{u} - e_{v})(e_{u} - e_{v})^{T}$, where $e_{i}$ denotes the $i$th standard basis vector. Generalizing to the weighted case and centering to achieve mean zero, we have that each edge contributes $w_{e} L_{e}$ with probability $\delta_{e} \sim \text{Bern}(p)$:

$$L - \mathbf{E}\left[L\right] = \sum_{e \in E_0} (\delta_{e} - p) w_{e} L_{e}.$$

Note that these matrices $X_{e} = \delta_{e} w_{e} L_{e}$ are indeed independent as a consequence of the independence of edges in $G_{n,p}$.

Next, we bound $\left\lVert X_{e} \right\rVert \leq K$ for all $i$. Recall that we can write $L_{e}$ as the outer product of some vector $u = e_{u} - e_{v}$. Thus,

$$L_{e} u = u u^{T} u = \left\lVert u \right\rVert^{2} u,$$

but $\left\lVert u \right\rVert^{2} = \left\lVert e_{u} - e_{v} \right\rVert^{2} = 2$, and this must be the maximal eigenvalue of $L_{e}$ as it is rank $1$. Therefore,

$$\begin{aligned}
\left\lVert X_{e} \right\rVert
&= \left\lVert (\delta_{e} - p) w_{e} L_{e} \right\rVert \\
&\leq \left\lvert \delta_e - p \right\rvert \cdot w_{e} \cdot \left\lVert L_{e} \right\rVert \\
&= \max \{p, 1 - p\} \cdot w_{e} \cdot 2.
\end{aligned}$$

Then, for all $e \in E_0$, we have that $\left\lVert X_{e} \right\rVert \leq 2 \tilde{w} m$, with $\tilde{w} = \max_e w_{e}$ and $m = \max \{p, 1-p\}$.

Finally, we must bound the variance term $\sigma^{2} = \left\lVert \sum_{e \in E_0} \mathbf{E} \left[X_{e}^{2}\right] \right\rVert$. Immediately from decomposing each $X_{e}$, we get that

$$\begin{aligned}
\sigma^{2}
&= \left\lVert \sum_{e \in E_0} \mathbf{E} \left[((\delta_{e} - p) w_{e} L_{e})^{2}\right] \right\rVert \\
&= 2p(1-p) \left\lVert \sum_{e \in E_0} w_{e}^{2} L_{e}^{2} \right\rVert.
\end{aligned}$$

Here, we notice that $\sum_{e \in E_0} w_{e}^{2} L_{e}$ is simply a new weighted graph Laplacian $L'$, but with edge weights equal to the original edge weights *squared*; thus, it satisfies all graph Laplacian properties. This allows us to apply the Gershgorin Disc Theorem: any eigenvalue \(\lambda(L) \in \bigcup_{i = 1}^{n} \text{Disc}(L'_{ii}, R_{i})\), where $R_{i} = \sum_{j \neq i} \left\lvert L_{ij} \right\rvert$ and \(\text{Disc}(L'_{ii}, R_{i}) := \{x : \left\lvert x - L'_{ii} \right\rvert \leq R_{i}\}\).

Specifically, we know that $L'$'s rows sum to $0$, which implies that the off-diagonal elements of row $i$ must sum to \(-L'_{ii}\), giving $R_{i} = L_{ii}$. Therefore, disc $i$ is from \(L'_{ii} - L'_{ii} = 0\) to \(L'_{ii} + L'_{ii} = 2L'_{ii}\), and any eigenvalue must satisfy

$$\lambda(L) \in [0, 2\tilde{d}],$$

where $\tilde{d} := \max_{i} \sum_{j \neq i} w_{ij}^{2}$, the off-diagonal sum of the maximal row of $L'$. Thus, we have that

$$\sigma^{2} \leq 2p(1-p) \cdot 2\tilde{d},$$

which finishes the proof of Theorem 1. $\square$

### Resolvent Identity and Weyl's Inequality

Next, we prove the matrix resolvent identity, then use it to bound $\left\lVert (I + L)^{-1} - (I + M)^{-1} \right\rVert$, which will be useful in the polarization and disagreement section.

**Lemma 1** (Matrix Resolvent Identity). *For any square matrices $L$ and $M$ such that $I + L$ and $I + M$ are invertible, setting $\Delta := L - M$ gives*

$$(I + L)^{-1} - (I + M)^{-1} = -(I + L)^{-1} \Delta (I + M)^{-1}.$$

*Proof.* By definition, $(I + L) = (I + M) + \Delta$. Multiplying by $(I + L)^{-1}$ on the left and $(I + M)^{-1}$ on the right yields

$$\begin{aligned}
(I + L)^{-1} (I + L) (I + M)^{-1} &= (I + L)^{-1} (I + M) (I + M)^{-1} + (I + L)^{-1} \Delta (I + M)^{-1} \\
(I + L)^{-1} - (I + M)^{-1} &= -(I + L)^{-1} \Delta (I + M)^{-1}.
\end{aligned}$$

$\square$

**Lemma 2** (Inverse Laplacian Bound). *Let $L, M$ be symmetric positive semi-definite matrices and $\Delta := L - M$. Then*

$$\left\lVert \left(I + L\right)^{-1} - \left(I + M\right)^{-1} \right\rVert \leq \left\lVert \Delta \right\rVert.$$

*In particular, this applies when $L$ is the graph Laplacian of $G_{n,p}$ and $M = \mathbf{E}\left[L\right]$.*

*Proof.* By Lemma 1 and submultiplicativity, $\lVert (I+L)^{-1} - (I+M)^{-1} \rVert \leq \lVert (I+L)^{-1} \rVert \cdot \lVert \Delta \rVert \cdot \lVert (I+M)^{-1} \rVert$. Since $L, M \succeq 0$, we have $I + L \succeq I$ and $I + M \succeq I$, so $\lVert (I+L)^{-1} \rVert \leq 1$ and likewise for $M$. The final bound follows. $\square$

Finally, we introduce the Weyl Inequality (Theorem 5), using it to prove concentration of the spectral gap.

**Theorem 5** (Weyl Inequality, [Vershynin, 2026], Lemma 4.1.14). *For symmetric matrices $A$ and $B$,*

$$\left\lvert \lambda_{k}(A) - \lambda_{k}(B) \right\rvert \leq \left\lVert A - B \right\rVert.$$

**Corollary 2.** *Let $L$ be the graph Laplacian of an unweighted instance of $G_{n,p}$, and let $t \geq 0$. Then, applying Theorem 1, with probability at least $1 - \gamma(t, G)$ over the randomness of $G$ we have $\left\lVert \Delta \right\rVert \leq t$, and on this event*

$$\lambda_2(L) \geq np - t.$$

*Proof.* Applying Weyl's inequality (Theorem 5) with $A = L$ and $B = \mathbf{E}\left[L\right] = M$ yields

$$\left\lvert \lambda_2(L) - \lambda_2(M) \right\rvert \leq \left\lVert L - M \right\rVert = \left\lVert \Delta \right\rVert.$$

To find $\lambda_2(M)$, we note that we can decompose $\mathbf{E}\left[L\right] = p \cdot L_{c}$, where $L_{c}$ denotes the Laplacian of a *complete* realization of $G$. Then $\lambda_2(M) = p \cdot \lambda_2(L_{c})$. Because $L_{c} = nI - \mathbf{1}\mathbf{1}^{T}$, $L_{c}$ has eigenvalues $0$ and $n$ (with multiplicity $n - 1$), implying that

$$\lambda_2(M) = p \cdot n.$$

Thus, we have that

$$\lambda_2(M) \in (np - \left\lVert \Delta \right\rVert, np + \left\lVert \Delta \right\rVert),$$

and by plugging in our bound that $\left\lVert \Delta \right\rVert \leq t$ with probability $1 - \gamma(t, G)$, we prove the corollary. $\square$


## Concentration of Polarization and Disagreement

### Naive Bounds for Polarization and Disagreement

We use Lemma 2 to show concentration of polarization and disagreement. For polarization, we first bound $\left\lVert (I + L)^{-2} - (I + M)^{-2} \right\rVert$. Additionally, from this point forward, we will be working only with unweighted graphs for simplicity.

**Lemma 3** (Norm Bound for Polarization). *Let $L$ be the graph Laplacian of $G_{n,p}$, $M = \mathbf{E}\left[L\right]$, and $\Delta := L - \mathbf{E}\left[L\right]$. Then we have*

$$\left\lVert (I + L)^{-2} - (I + M)^{-2} \right\rVert \leq 2 \left\lVert \Delta \right\rVert.$$

*Proof.* The key to this proof is using the identity $A^{2} - B^{2} = A(A - B) + (A - B)B$. Taking $A = (I + L)^{-1}$ and $B = (I + M)^{-1}$ gives us that

$$\begin{aligned}
&\left\lVert \left((I + L)^{-1}\right)^{2} - \left((I + M)^{-1}\right)^{2} \right\rVert \\
&\leq \left\lVert (I + L)^{-1} \left((I + L)^{-1} - (I + M)^{-1}\right) \right\rVert + \left\lVert \left((I + L)^{-1} - (I + M)^{-1}\right) (I + M)^{-1} \right\rVert,
\end{aligned}$$

and by applying submultiplicativity we get that

$$\left\lVert \left((I + L)^{-1}\right)^{2} - \left((I + M)^{-1}\right)^{2} \right\rVert \leq 1 \cdot \left\lVert \Delta \right\rVert + 1 \cdot \left\lVert \Delta \right\rVert = 2 \left\lVert \Delta \right\rVert.$$

$\square$

Given Lemma 3, we may first attempt to bound

$$\left\lvert P - \mathbf{E}_{G} \left[P\right] \right\rvert = \left\lvert \left\langle \tilde{s}, \left((I + L)^{-2} - (I + M)^{-2}\right) \tilde{s} \right\rangle \right\rvert \leq \left\lVert \tilde{s} \right\rVert^{2} \cdot \left\lVert (I + L)^{-2} - (I + M)^{-2} \right\rVert,$$

via a simple application of Cauchy-Schwarz (specifically, that $\left\langle x, Ax \right\rangle \leq \left\lVert x \right\rVert^{2} \cdot \left\lVert A \right\rVert$). We ultimately get that

$$\left\lvert P - \mathbf{E}_{G}\left[P\right] \right\rvert \leq \frac{1}{2} nt \quad \text{with probability } \geq 1 - \gamma(t, G).$$

For disagreement, we take similar steps and get a similar result. We first show Lemma 4, then use the same Cauchy-Schwarz-derived inequality that we used for polarization.

**Lemma 4** (Norm Bound for Disagreement). *Let $L$ be the graph Laplacian of $G_{n,p}$, $M = \mathbf{E}\left[L\right]$, and $\Delta := L - \mathbf{E}\left[L\right]$. Then we have*

$$\left\lVert (I + L)^{-1} L (I + L)^{-1} - (I + M)^{-1} M (I + M)^{-1} \right\rVert \leq 3 \left\lVert \Delta \right\rVert.$$

*Proof.* The proof of Lemma 4 has a similar structure as that of Lemma 3, but we use a different matrix identity. Specifically, we use the fact that

$$(I + L)^{-1} L (I + L)^{-1} = (I + L)^{-1} ((I + L) - I) (I + L)^{-1} = (I + L)^{-1} - (I + L)^{-2},$$

which symmetrically holds for $(I + M)^{-1} M (I + M)^{-1}$. Therefore, we have that

$$\begin{aligned}
&\left\lVert (I + L)^{-1} L (I + L)^{-1} - (I + M)^{-1} M (I + M)^{-1} \right\rVert \\
&= \left\lVert \left((I + L)^{-1} - (I + M)^{-1}\right) - \left((I + L)^{-2} - (I + M)^{-2}\right) \right\rVert \\
&\leq \left\lVert (I + L)^{-1} - (I + M)^{-1} \right\rVert + \left\lVert (I + L)^{-2} - (I + M)^{-2} \right\rVert \\
&= \left\lVert \Delta \right\rVert + 2 \left\lVert \Delta \right\rVert = 3 \left\lVert \Delta \right\rVert,
\end{aligned}$$

concluding the proof. $\square$

Applying Lemma 4 as we applied Lemma 3 previously then gets us that

$$\left\lvert D - \mathbf{E}_{G} \left[D\right] \right\rvert \leq 3nt$$

with probability $\geq 1 - \gamma(t, G)$.


### Improved Approach Using Hanson-Wright

Unfortunately, the above two bounds are generally trivial and thus unhelpful, largely because they make no assumptions about the innate opinion vector $s$. Recalling that each opinion $s_{i} \sim U[0, 1]$, we can get a stronger bound by considering the inherent randomness in opinions and using the Hanson-Wright Inequality (Theorem 6).

**Theorem 6** (Hanson-Wright, [Vershynin, 2026], Theorem 6.2.2). *For an $n \times n$ matrix $A$ and $x \in \mathbb{R}^{n}$ with independent, mean-zero, and subgaussian coordinates, for every $t \geq 0$ we have that*

$$\Pr \left[\left\lvert \left\langle x, Ax \right\rangle - \mathbf{E} \left[ \left\langle x, Ax \right\rangle \right] \right\rvert \geq t\right] \leq 2 \exp \left( -c \min \left(\frac{t^{2}}{K^{4} \left\lVert A \right\rVert_{F}^{2}}, \frac{t}{K^{2} \left\lVert A \right\rVert}\right)  \right),$$

*where $c > 0$ is an absolute constant and $K = \max_{i} \left\lVert x_{i} \right\rVert_{\psi_{2}}$.*

To work towards applying Hanson-Wright, we must first center our innate opinions as $x = s - (1/2)\mathbf{1}$ (equivalent to $x_{i} \sim U[-1/2, 1/2]$). Note that this implies that $\operatorname{Cov}[x] = (1/12) \cdot I_{n}$. Additionally, now that we are considering the randomness of both $L$ and $s$, we will condition on $L$ to apply Hanson-Wright, then uncondition afterwards by taking a union bound.

#### Polarization

We have previously shown that

$$\left\lvert P - \mathbf{E}_{G}\left[P\right] \right\rvert = \left\lvert \left\langle \tilde{s}, Q_{P} \tilde{s} \right\rangle \right\rvert,$$

where $Q_{P} = (I + L)^{-2} - (I + M)^{-2}$. To incorporate the centered opinions $x$, we can introduce \(\tilde{Q}_{P} = \left(I - (1/n) \mathbf{1} \mathbf{1}^{T}\right) Q_{P} \left(I - (1/n) \mathbf{1} \mathbf{1}^{T}\right)\) to write

$$\left\lvert P - \mathbf{E}_{G}\left[P\right] \right\rvert = \left\lvert \left\langle x, \tilde{Q}_{P} x \right\rangle \right\rvert.$$

Note that \(\tilde{Q}_{P}\) has eigenvalues $\frac{1}{(1 + \lambda_{i}(L))^{2}} - \frac{1}{(1 + \lambda_{i}(M))^{2}}$ for all $i \in [2..n]$; we lose the first eigenvalue from centering. Next, consider the following lemma:

**Lemma 5** (Bound on Expected Polarization over Opinions). *Let $L$ be the graph Laplacian of an unweighted $G_{n,p}$ instance, $M = \mathbf{E}\left[L\right]$, and $\Delta := L - M$. Let $x \in \mathbb{R}^{n}$ have i.i.d. entries $x_{i} \sim U[-1/2, 1/2]$, independent of $G$, and define*

$$\tilde{Q}_{P} := \left(I - \tfrac{1}{n} \mathbf{1} \mathbf{1}^{T}\right) \left((I + L)^{-2} - (I + M)^{-2}\right) \left(I - \tfrac{1}{n} \mathbf{1} \mathbf{1}^{T}\right).$$

*Then, on the event $\left\lVert \Delta \right\rVert \leq t < np$,*

$$\left\lvert \mathbf{E}_{x} \left[\left\langle x, \tilde{Q}_{P} x \right\rangle \mid L\right]  \right\rvert \leq \frac{1}{12} \cdot \frac{2(n-1) \left\lVert \Delta \right\rVert}{(1 + np - \left\lVert \Delta \right\rVert)^{3}}.$$

*Proof.* By definition, we know that

$$\begin{aligned}
\mathbf{E}_{x} \left[\left\langle x, \tilde{Q}_{P} x \right\rangle \mid L\right]
&= \operatorname{Tr} \left(\tilde{Q}_{P} \cdot \operatorname{Cov}[x] \right) \\
&= \frac{1}{12} \sum_{i = 2}^{n} \left( \frac{1}{(1 + \lambda_{i}(L))^{2}} - \frac{1}{(1 + \lambda_{i}(M))^{2}}  \right).
\end{aligned}$$

Next, to bound $\left\lvert \operatorname{Tr}(\tilde{Q}_{P}) \right\rvert$, we will apply the mean value theorem (MVT) with $f(t) = 1/(1 + t)^{2}$. We can differentiate $f$ as $f'(t) = 2/(1+t)^{3}$, then apply the MVT to get that

$$\frac{1}{(1 + a)^{2}} - \frac{1}{(1 + b)^{2}} \leq \frac{2 \left\lvert a - b \right\rvert}{(1 + \min \{a, b\})^{3}}.$$

From Corollary 2, we know that $\left\lvert \lambda_{i}(L) - \lambda_{i}(M) \right\rvert \leq \left\lVert \Delta \right\rVert$, that $\lambda_{i}(M) = np$ for all $i \geq 2$ for $G_{n,p}$, and that

$$\min \{\lambda_{i}(L), np\} \geq np - \left\lVert \Delta \right\rVert$$

with probability $\geq 1 - \gamma(t, G)$ because $\lambda_{i}(L) \in np \pm \left\lVert \Delta \right\rVert$ with probability $\geq 1 - \gamma(t, G)$ (assuming that $\left\lVert \Delta \right\rVert = t < np$). These facts together imply that each term in the sum is bounded by $2 \left\lVert \Delta \right\rVert / (1 + np - \left\lVert \Delta \right\rVert)^{3}$, and taking this as an upper bound over all terms gives

$$\left\lvert \operatorname{Tr} \left(\tilde{Q}_{P}\right) \right\rvert \leq \frac{2(n - 1) \left\lVert \Delta \right\rVert}{(1 + np - \left\lVert \Delta \right\rVert)^{3}}.$$

Using this bound on the trace expression completes the proof. $\square$

Now we must bound the norms of $\tilde{Q}_{P}$ involved in the Hanson-Wright statement.

**Lemma 6** (Norm Bounds for \(\tilde{Q}_{P}\)). *Let $L$ be the graph Laplacian of an unweighted $G_{n,p}$ instance, $M = \mathbf{E}\left[L\right]$, $\tilde{Q}_{P} := \left(I - (1/n) \mathbf{1} \mathbf{1}^{T}\right) \left((I + L)^{-2} - (I + M)^{-2}\right) \left(I - (1/n) \mathbf{1} \mathbf{1}^{T}\right)$, and $\Delta := L - M$. On the event $\left\lVert \Delta \right\rVert \leq t < np$,*

$$\left\lVert \tilde{Q}_{P} \right\rVert_{F}^{2} \leq \frac{4(n - 1) \left\lVert \Delta \right\rVert^{2}}{(1 + np - \left\lVert \Delta \right\rVert)^{6}}$$

$$\left\lVert \tilde{Q}_{P} \right\rVert \leq \frac{2 \left\lVert \Delta \right\rVert}{(1 + np - \left\lVert \Delta \right\rVert)^{3}}.$$

*Proof.* The operator norm bound follows from the per-eigenvalue bound established in Lemma 5. The Frobenius bound follows by squaring the same per-eigenvalue bound and summing over $i \in [2..n]$. $\square$

We now have all the tools we need to prove Theorem 7.

**Theorem 7** (Full Concentration Bound on Polarization). *Let $G \sim G_{n,p}$ be unweighted with graph Laplacian $L$ and $s \in \mathbb{R}^{n}$ have i.i.d. entries $s_{i} \sim U[0,1]$, independent of $G$. Let $0 \leq t < np$. Then there is an absolute constant $C > 0$ such that the polarization $P$ satisfies*

$$\left\lvert P - \mathbf{E}\left[P\right] \right\rvert \leq \frac{(n - 1)t}{6(1 + np - t)^{3}} + C \frac{2t \sqrt{n - 1}}{(1 + np - t)^{3}}\sqrt{\log n}$$

*with probability $\geq 1 - 1/n - \gamma(t, G)$ over the joint distribution of $G$ and $s$, where $\mathbf{E}\left[P\right]$ is also taken over this joint distribution.*

*Proof.* We can rewrite

\[
  \begin{aligned}
    \left\lvert P - \mathbf{E}\left[P\right] \right\rvert
    &= \left\lvert \mathbf{E}\left[\left\langle x, \tilde{Q}_{P}x \right\rangle\right] + \left(\left\langle x, \tilde{Q}_{P}x \right\rangle - \mathbf{E} \left[\left\langle x, \tilde{Q}_{P} x \right\rangle\right]\right) \right\rvert \\
    &\leq \left\lvert \mathbf{E}\left[\left\langle x, \tilde{Q}_{P}x \right\rangle\right] \right\rvert
    + \left\lvert \left\langle x, \tilde{Q}_{P}x \right\rangle - \mathbf{E} \left[\left\langle x, \tilde{Q}_{P}x \right\rangle\right] \right\rvert.
  \end{aligned}
\]

From Hanson-Wright (Theorem 6), we know that

$$\Pr \left[\left\lvert \left\langle x, \tilde{Q}_{P}x \right\rangle - \mathbf{E} \left[\left\langle x, \tilde{Q}_{P}x \right\rangle\right] \right\rvert \geq u\right] \leq 2 \exp \left(-c \min \left\{ \frac{u^{2}}{K^{4} \left\lVert \tilde{Q}_{P} \right\rVert_{F}^{2}}, \frac{u}{K^{2} \left\lVert \tilde{Q}_{P} \right\rVert} \right\}\right).$$

We will set the right-hand side failure probability to $2/n$ and then solve for the *Gaussian* $u$ requirement (we will justify why the Gaussian momentarily). We get

$$\begin{aligned}
2 \exp \left(-c \frac{u^{2}}{K^{4} \left\lVert \tilde{Q}_{P} \right\rVert_{F}^{2}}\right) &\leq \frac{2}{n} \\
u &\leq \frac{1}{\sqrt{c}} K^{2} \left\lVert \tilde{Q}_{P} \right\rVert_{F} \sqrt{\log n} \\
u &\leq C \frac{2t \sqrt{n - 1}}{(1 + np - t)^{3}} \sqrt{ \log n}.
\end{aligned}$$

To justify selecting the Gaussian branch, note the crossover \(u^{*} = K^{2} \left\lVert \tilde{Q}_{P} \right\rVert_{F}^{2} / \left\lVert \tilde{Q}_{P} \right\rVert\) exceeds our chosen $u$ whenever \(\sqrt{\log n} \leq \left\lVert \tilde{Q}_{P} \right\rVert_{F} / \left\lVert \tilde{Q}_{P} \right\rVert \approx \sqrt{n-1}\), which holds in our regime. $\square$

The concentration bound given in Theorem 7, however, is rather complex. To simplify it, we can instead choose a fixed $t$ such that $\gamma(t, G)$ is at most $2/n$. This gives us Corollary 3.

**Corollary 3** (Simplified Concentration of Polarization). *Let $G \sim G_{n,p}$ be unweighted with $p \geq C_{0} \log(n) / n$ for a sufficiently large absolute constant $C_{0} > 0$. Let $s \in \mathbb{R}^{n}$ have i.i.d. entries $s_{i} \sim U[0, 1]$, independent of $G$. Let $P$ be the realized polarization of $G$ under Friedkin-Johnsen opinion dynamics. Then there is an absolute constant $C > 0$ such that with probability at least $1 - \frac{3}{n}$ over the joint distribution of $(G, s)$,*

$$\left\lvert P - \mathbf{E}\left[P\right] \right\rvert \leq C \frac{n\sqrt{np \log n}}{(1 + np)^{3}}.$$

*Proof.* Fixing $t$ such that $\gamma(t, G) \leq 2/n$ gives

$$\begin{aligned}
\frac{1}{n^{2}} &\geq \exp \left(\frac{-t^{2}/2}{4p(1-p)(n-1) + 2t/3}\right) \\
0 &\leq t^{2}/2 - \frac{4 \log n}{3}t - 8p(1-p)(n-1) \log n \\
t &\in O\left(\sqrt{np \log n}\right).
\end{aligned}$$

With such a $t$, the bias term (first term) in Theorem 7 dominates, giving us

$$\left\lvert P - \mathbf{E} \left[P\right] \right\rvert \leq  \frac{(n - 1)t}{6(1 + np - t)^{3}} \approx \frac{(n - 1)t}{6(1 + np)^{3}} \approx C \frac{n \sqrt{np \log n}}{(1 + np)^{3}},$$

for some constant $C > 0$. The first approximation is by the fact that $np \gg t$ (otherwise the bound is not useful), and the second is by our choice of $t$ to fix $\gamma(t, G) \leq 2/n$. $\square$


#### Disagreement

The steps for disagreement are quite similar to those for polarization; the primary differences are in the quadratic form matrix $\tilde{Q}_{D}$ and in the function $g(\cdot)$ which transforms the Laplacian and is thus used to find the eigenvalues and apply the MVT.

First, we rewrite $D - \mathbf{E}\left[D\right] = \left\langle s, Q_{D} s \right\rangle$ where $Q_{D} = (I + L)^{-1}L(I + L)^{-1} - (I + M)^{-1} M (I + M)^{-1}$. Centering is not a concern, as for any constant $\alpha$ times $\mathbf{1}$,

$$(I + L)^{-1} L (I + L)^{-1} (\alpha \mathbf{1}) = (I + L)^{-1} L (\alpha \mathbf{1}) = 0,$$

implying that $\left\langle s, Q_{D} s \right\rangle = \left\langle x, Q_{D} x \right\rangle$. Then, by expanding $L = (I + L) - I$, we rewrite

$$Q_{D} = \left((I + L)^{-1} - (I + M)^{-1}\right) - \left((I + L)^{-2} - (I + M)^{-2}\right).$$

Thus, the eigenvalues of $Q_{D}$ satisfy

$$\lambda_{i}(Q_{D}) = \left(\frac{1}{1 + \lambda_{i}(L)} - \frac{1}{1 + \lambda_{i}(M)}\right) - \left(\frac{1}{(1 + \lambda_{i}(L))^{2}} - \frac{1}{(1 + \lambda_{i}(M))^{2}}\right).$$

**Lemma 7** (Bound on Expected Disagreement over Opinions). *Let $L$ be the graph Laplacian of an unweighted $G_{n,p}$ instance, $M = \mathbf{E}\left[L\right]$, and $\Delta := L - M$. Let $x \in \mathbb{R}^{n}$ have i.i.d. entries $x_{i} \sim U[-1/2, 1/2]$, independent of $G$, and define*

$$Q_{D} := (I + L)^{-1} L (I + L)^{-1} - (I + M)^{-1} M (I + M)^{-1}.$$

*Then, on the event $\left\lVert \Delta \right\rVert \leq t < np$,*

$$\left\lvert \mathbf{E}_{x} \left[\left\langle x, Q_{D} x \right\rangle \mid L\right]  \right\rvert \leq \frac{1}{12} \frac{(n - 1)t (np + t - 1)}{(1 + np - t)^{3}}.$$

*Proof.* We begin as last time by writing

$$\left\lvert \mathbf{E}_{x} \left[\left\langle x, Q_{D} x \right\rangle\right] \right\rvert = \left\lvert \frac{1}{12} \operatorname{Tr} \left(Q_{D}\right) \right\rvert,$$

and we thus must bound $\operatorname{Tr}(Q_{D})$. We will once again apply the MVT to bound the sum of the eigenvalues. This time, the function that acts on $L$ is $g(t) = t/(1 + t)^{2}$ with derivative $g'(t) = (1 - t)/(1 + t)^{3}$. We then have that

$$\left\lvert g(\lambda_{i}(L)) - g(\lambda_{i}(M)) \right\rvert \leq \sup_{\beta \in [\lambda_{i}(L), \lambda_{i}(M)]} \left\lvert g'(\beta) \right\rvert \cdot \left\lvert \lambda_{i}(L) - \lambda_{i}(M) \right\rvert.$$

We already have that the last absolute value is $\leq \left\lVert \Delta \right\rVert$ with probability $1 - \gamma(t, G)$. However, we still must bound $\left\lvert g'(\beta) \right\rvert$ on $[np - t, np + t]$; we can do this by simply taking the maximum value of the interval in the numerator and the minimum value in the denominator. Thus, each eigenvalue satisfies

$$\lambda_{i}(Q_{D}) \leq \frac{t(np + t - 1)}{(1 + np - t)^{3}},$$

implying that

$$\left\lvert \operatorname{Tr}(Q_{D}) \right\rvert \leq \frac{(n - 1)t (np + t - 1)}{(1 + np - t)^{3}},$$

proving the expectation inequality. $\square$

We bound the norms of $Q_{D}$ as before, getting that

$$\left\lVert Q_{D} \right\rVert_{F}^{2} \leq \frac{(n - 1)t^{2}(np + t - 1)^{2}}{(1 + np - t)^{6}} \quad \text{and} \quad \left\lVert Q_{D} \right\rVert \leq \frac{t(np + t - 1)}{(1 + np - t)^{3}}.$$

We can then prove Theorem 8 using Lemma 7 and Hanson-Wright, using the same proof strategy as Theorem 7 (we omit the proof to save space).

**Theorem 8** (Full Concentration Bound on Disagreement). *Let $G \sim G_{n,p}$ be unweighted with graph Laplacian $L$ and $s \in \mathbb{R}^{n}$ have i.i.d. entries $s_{i} \sim U[0,1]$, independent of $G$. Let $0 \leq t < np$. Then there is an absolute constant $C > 0$ such that the disagreement $D$ satisfies*

$$\left\lvert D - \mathbf{E}\left[D\right] \right\rvert \leq \frac{(n - 1) t (np + t - 1)}{12(1 + np - t)^{3}} + C \frac{t \sqrt{n - 1} (np + t - 1)}{(1 + np - t)^{3}} \sqrt{\log n}$$

*with probability $\geq 1 - 1/n - \gamma(t, G)$ over the joint distribution of $(G, s)$, where $\mathbf{E}\left[D\right]$ is also taken over this joint distribution.*

Similarly, we can prove a simplified bound by choosing $t$ such that $\gamma(t, G)$ is at most $2/n$, again using the exact same proof strategy as for Corollary 3. Together, Corollary 3 and Corollary 4 prove Corollary 1.

**Corollary 4** (Simplified Concentration of Disagreement). *Let $G \sim G_{n,p}$ be unweighted with $p \geq C_{0} \log(n) / n$ for a sufficiently large absolute constant $C_{0} > 0$. Let $s \in \mathbb{R}^{n}$ have i.i.d. entries $s_{i} \sim U[0, 1]$, independent of $G$. Let $D$ be the realized disagreement of $G$ under Friedkin-Johnsen opinion dynamics. Then there is an absolute constant $C > 0$ such that with probability at least $1 - \frac{3}{n}$ over the joint distribution of $(G, s)$,*

$$\left\lvert D - \mathbf{E}\left[D\right] \right\rvert \leq C \frac{(n - 1) np \sqrt{np \log n}}{(1 + np)^{3}}.$$


### Comparing Bounds

The baseline expected polarization and disagreement given $L$ are \(\mathbf{E}_{s}[P | L] = (n-1)/(12(1+np)^{2})\) and $\mathbf{E}_{s}[D | L] = (n-1)np/(12(1+np)^{2})$. Comparing to the bounds derived above (with $t$ chosen so $\gamma(t,G) \leq 1/n$), the Cauchy-Schwarz bound on $\lvert P - \mathbf{E}[P] \rvert$ scales as $(np)^{2}\sqrt{np \log n}$ times the baseline, which ultimately grows polynomially in $n$; the Cauchy-Schwarz bound on $D$ behaves similarly. The Hanson-Wright bound, by contrast, has ratio $O\Big(\sqrt{np \log n}/np\Big)$ to the baseline, which vanishes as $n \to \infty$ for any fixed $p$ (or any $p$ inversely sublinear in $n$). Both improved bounds are non-trivial precisely when $\sqrt{np \log n} \ll np$, i.e., $p \gg \log(n)/n$, the threshold for graph connectivity.


## Worst-Case Adversarial Polarization

Recall that if we draw opinions from the ball $\{s \in \mathbb{R}^{n} : \left\lVert s \right\rVert_{2}^{2} \leq R\}$ (rather than $[0,1]^{n}$), then Racz & Rigobon [2022] proved that the worst-case polarization is given by

$$P^*(z) = \frac{R}{(1 + \lambda_2(L))^{2}},$$

where $L$ is the graph Laplacian. Further, we proved in Corollary 2 that $\lambda_2(L) \geq np - t$ with probability at least $1 - \gamma(t, G)$. Combining these immediately yields the conclusion of Theorem 2, except for the regime of $p$ in which the bound is non-trivial. Note the bound on $\lambda_2(L)$ is vacuous when $t > np$, as the spectral gap is then bounded below by a negative number while all graph Laplacian eigenvalues are non-negative.

To find the regime in which this bound is non-trivial, we choose $t$ such that $\gamma(t, G) \leq 1/n$. Solving the resulting quadratic in $t$ for the variance- and tail-dominated regimes, respectively, gives $t = O(\sqrt{np \log n})$ and $t = O(\log n)$, so we may take $t = O(\max\{\sqrt{np \log n}, \log n\})$. Plugging either branch into the non-triviality condition $t < np$ yields $p > \log(n)/n$ in both cases, recovering the connectivity threshold as the requirement for Theorem 2 to be useful.


## Discussion

The importance of the $p \gg \log(n) / n$ requirement for the usefulness of all of our bounds is rather interesting. Being the same threshold at which graph connectivity emerges, it suggests that graphs that are connected with sufficiently high probability are "well-behaved" enough to admit probabilistic analysis of polarization and disagreement, while graphs that are disconnected may have starkly differing dynamics that prevent these same bounds from holding.

One potential application of our bounds is adversarial detection. If a social network planner believes $G_{n,p}$ to well-model their social network, they could evaluate whether the network's polarization and disagreement lie within the concentration band. If they do not, it may suggest that there is some adversarial pressure that is causing increased polarization and disagreement (e.g., from a polarization-promoting algorithm).

Additionally, we note that our analysis has many limitations to pragmatic utility. The Erdős-Rényi model is an extreme simplification of social networks, the Friedkin-Johnsen opinion dynamics may not hold, and opinions may not be uniform. Relaxing these assumptions by working with, e.g., stochastic block models would be a natural continuation.


## References

1. Friedkin, N. E. & Johnsen, E. C. (1990). Social influence and opinions. *The Journal of Mathematical Sociology*, 15(3–4), 193–206.

2. Musco, C., Musco, C. & Tsourakakis, C. E. (2017). Minimizing Polarization and Disagreement in Social Networks. arXiv:1712.09948.

3. Chen, M. F. & Racz, M. Z. (2020). Network disruption: maximizing disagreement and polarization in social networks. arXiv:2003.08377.

4. Racz, M. Z. & Rigobon, D. E. (2022). Towards Consensus: Reducing Polarization by Perturbing Social Networks. arXiv:2206.08996.

5. Vershynin, R. (2026). *High-Dimensional Probability: An Introduction with Applications in Data Science* (2nd ed.). Cambridge University Press.
