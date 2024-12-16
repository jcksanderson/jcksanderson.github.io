---
layout: distill
title: a distill-style blog post
description: an example of a distill-style blog post and main elements
tags: test
giscus_comments: true
date: 2024-12-16
featured: false
code_diff: true

authors:
  - name: Jack Sanderson
    url: "https://jcksanderson.github.io"
    affiliations:
      name: University of Chicago
 
# bibliography: 2018-12-22-distill.bib

# Optionally, you can add a table of contents to your post.
# NOTES:
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - we may want to automate TOC generation in the future using
#     jekyll-toc plugin (https://github.com/toshimaru/jekyll-toc).
toc:
  - name: Equations
    subsections:
      - name: Example Child Subsection 1
      - name: Example Child Subsection 2
  - name: Footnotes
  - name: Code Blocks
  - name: Other Typography?

---

## Equations

### Example Child Subsection 1
Wilson's theorem states for any prime $$p$$, $$ (p - 1)! \cong_p -1  $$. 

### Example Child Subsection 2
Fermat's little theorem states that

$$
a^{p - 1} \cong_p 1
$$

for any prime $$p$$.

---

## Footnotes

I'm testing out the footnote functionality with the `<d-footnotes>` tag.
<d-footnote>Wow, this is epic!</d-footnote>

---

## Code Blocks

{% highlight C %}
if (test->valid) {
  printf("%d\n", test->value);
}
{% endhighlight %}

---

## Other Typography?

- This code just uses backticks:
```python
s = "Python syntax highlighting"
print(s)
s.split(" ")
```

| Markdown | Less      | Pretty     |
| -------- | --------- | ---------- |
| Still    | renders   | nicely     |
| 1        | 2         | 3          |

> And blockquotes work as well,
> even over multiple lines.



