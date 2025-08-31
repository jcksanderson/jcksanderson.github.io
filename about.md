---
layout: about
title: "About"
---

This site is ever evolving (about once per month). Here are some facts about me:
- I'm a big fan of the Chicago Bears and Cubs
- I play the ukulele
- I'm an avid neovim user

If you have a fun fact you'd like me to put here, shoot me an email!


<style>
  .collapsible {
    font-size: 1.1em;
    font-weight: 485;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .collapsible:hover {
    background-color: #f0f0f0;
  }
  .collapsible-content {
    display: none;
    margin-left: 1em;
  }
</style>

<div class="collapsible">Current Courses</div>
<div class="collapsible-content">

Coding 101, Statistics 102, and History

</div>

<script>
document.querySelectorAll(".collapsible").forEach(el => {
  el.addEventListener("click", () => {
    const content = el.nextElementSibling;
    if (content && content.classList.contains("collapsible-content")) {
      content.style.display = content.style.display === "block" ? "none" : "block";
    }
  });
});
</script>
