---
layout: about
title: "About"
---

This site is ever evolving (about once per month). Here are some facts about me:
- I'm a big fan of the Chicago Bears and Cubs
- I play the ukulele
- I'm an avid neovim user

If you have a fun fact you'd like me to put here, shoot me an email!

{% capture current_courses %}
- Coding 101  
- Statistics 102  
- History
{% endcapture %}
{% include collapsible.html title="Current Courses" content=current_courses %}

{% capture past_courses %}
- Coding 100  
- Statistics 101  
- English
{% endcapture %}
{% include collapsible.html title="Past Courses" content=past_courses %}
