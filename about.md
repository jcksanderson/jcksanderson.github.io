---
layout: about
title: "About"
---

This site is ever evolving (about once per month). Here are some facts about me:
- I'm a big fan of the Chicago Bears and Cubs
- I play the ukulele
- I'm an avid neovim user

If you have a fun fact you'd like me to claim is a fun fact about me, shoot me an email!


<style>
  .collapsible {
    font-size: 1.2em;        /* bigger than normal text */
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .collapsible:hover {
    background-color: #f0f0f0; /* subtle fade on hover */
  }
  .collapsible-content {
    display: none;
    margin-left: 1em;
  }
</style>

<div class="collapsible">Current Courses</div>
<div class="collapsible-content">

  <div class="collapsible">Linear Algebra Math 56 Fall 2025</div>
  <div class="collapsible-content">
    
  <div class="collapsible">Overview</div>
  <div class="collapsible-content">
  
Welcome to Math 56! This is a relatively new course here at Berkeley, and I'm excited for you to be part of it.  
You can still use **Markdown** inside these blocks.

  </div>

  </div>

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
