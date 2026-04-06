import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker

# ── style ──────────────────────────────────────────────────────────────────────
GRAY = "#999999"

plt.rcParams.update(
    {
        "font.family": "serif",
        "font.size": 14,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.spines.left": True,
        "axes.spines.bottom": True,
        "axes.edgecolor": GRAY,
        "axes.labelcolor": GRAY,
        "xtick.color": GRAY,
        "ytick.color": GRAY,
        "xtick.major.width": 0.8,
        "ytick.major.width": 0.8,
        "xtick.direction": "out",
        "ytick.direction": "out",
        "axes.linewidth": 0.8,
        "text.color": GRAY,
        "figure.dpi": 150,
        "axes.facecolor": "none",
        "figure.facecolor": "none",
    }
)

PALETTE = ["#FF8C42", "#00C2C7", "#B56FE8"]  # orange, cyan, violet


# ── rate functions ─────────────────────────────────────────────────────────────
def I_gaussian(x, mu, sigma2):
    return (x - mu) ** 2 / (2 * sigma2)


def I_exponential(x, lam):
    return lam * x - 1 - np.log(lam * x)


# ── Plot 1 : Gaussian ─────────────────────────────────────────────────────────
fig1, ax = plt.subplots(figsize=(6, 4.5))

configs = [
    (0, 1, r"$\mu=0,\ \sigma^2=1$"),
    (0, 0.5, r"$\mu=0,\ \sigma^2=0.5$"),
    (1, 1, r"$\mu=1,\ \sigma^2=1$"),
]
for (mu, s2, label), color in zip(configs, PALETTE):
    xs = np.linspace(mu - 3.5 * s2**0.5, mu + 3.5 * s2**0.5, 400)
    ax.plot(xs, I_gaussian(xs, mu, s2), color=color, lw=2, label=label)
    ax.plot([mu, mu], [0, 0.12], color=color, lw=1, ls=":", alpha=0.8)
    ax.plot(mu, 0, marker="^", color=color, ms=7, zorder=5, clip_on=False)

ax.set_xlabel(r"$s$")
ax.set_ylabel(r"$I(s)$", rotation=0, labelpad=14)
ax.set_title(r"Gaussian:  $I(s) = \dfrac{(s-\mu)^2}{2\sigma^2}$", fontsize=14, pad=14)
ax.yaxis.set_major_locator(ticker.MaxNLocator(5, integer=False))
ax.legend(frameon=False, fontsize=12)
ax.set_ylim(bottom=0)

fig1.tight_layout()
fig1.savefig("rate_function_gaussian.png", bbox_inches="tight", transparent=True)

# ── Plot 2 : Exponential ──────────────────────────────────────────────────────
fig2, ax = plt.subplots(figsize=(6, 4.5))

for lam, color in zip([0.5, 1.0, 2.0], PALETTE):
    mean = 1 / lam
    xs = np.linspace(1e-4, mean + 4.5 / lam, 600)
    ax.plot(xs, I_exponential(xs, lam), color=color, lw=2, label=rf"$\lambda={lam}$")
    ax.plot([mean, mean], [0, 0.12], color=color, lw=1, ls=":", alpha=0.8)
    ax.plot(mean, 0, marker="^", color=color, ms=7, zorder=5, clip_on=False)

ax.set_xlabel(r"$s$")
ax.set_ylabel(r"$I(s)$", rotation=0, labelpad=14)
ax.set_title(
    r"Exponential:  $I(s) = \lambda s - \ln(\lambda s) - 1$", fontsize=14, pad=14
)
ax.set_ylim(bottom=0)
ax.yaxis.set_major_locator(ticker.MaxNLocator(5, integer=False))
ax.legend(frameon=False, fontsize=12)

fig2.tight_layout()
fig2.savefig("rate_function_exponential.png", bbox_inches="tight", transparent=True)


# ── Plot 3 : Bernoulli ────────────────────────────────────────────────────────
def I_bernoulli(x, p):
    return x * np.log(x / p) + (1 - x) * np.log((1 - x) / (1 - p))


fig3, ax = plt.subplots(figsize=(6, 4.5))

for p, color in zip([0.3, 0.5, 0.7], PALETTE):
    xs = np.linspace(1e-4, 1 - 1e-4, 600)
    ax.plot(xs, I_bernoulli(xs, p), color=color, lw=2, label=rf"$p={p}$")
    ax.plot([p, p], [0, 0.12], color=color, lw=1, ls=":", alpha=0.8)
    ax.plot(p, 0, marker="^", color=color, ms=7, zorder=5, clip_on=False)

ax.set_xlabel(r"$s$")
ax.set_ylabel(r"$I(s)$", rotation=0, labelpad=14)
ax.set_title(
    r"Bernoulli:  $I(s) = (s) \ln\left(\frac{s}{p}\right) + (1-s)\ln\left(\frac{1-s}{1-p}\right)$",
    fontsize=14,
    pad=14,
)
ax.set_xlim(0, 1)
ax.set_ylim(bottom=0)
ax.yaxis.set_major_locator(ticker.MaxNLocator(5, integer=False))
ax.legend(frameon=False, fontsize=12)

fig3.tight_layout()
fig3.savefig("rate_function_bernoulli.png", bbox_inches="tight", transparent=True)
