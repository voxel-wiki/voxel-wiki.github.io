+++
title = "Typography"
description = "Typography Test Page"
path = "typography"
+++

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

Normal Text  

*Italic Text*  
_Italic Text_  

**Bold Text**  
__Bold Text__  

***Bold-Italic Text***  
___Bold-Italic Text___  

Non-breaking space: <https://symbl.cc/en/00A0/>

---

* List per Star
* List per Star
* List per Star

- List per Dash
- List per Dash
- List per Dash

1. Numeric List per Dot
1. Numeric List per Dot
1. Numeric List per Dot

1) Numeric List per Parentheses
1) Numeric List per Parentheses
1) Numeric List per Parentheses

---

[Internal Link](/typography)  
[External Link](https://en.wikipedia.org/)  
[Link with `Code`](/typography)  

![Image Embed](/favicon.png)

---

{% figure(class="float", clear=true, caption="This is the *caption text*.") %}
[![Image alt text.](https://voxel.wiki/favicon.png)](https://voxel.wiki/)
{% end %}

---

`Inline Code`  

    Code Section

{% info_notice() %}
  You can also create a code section by using three `  
  before and after the code.
{% end %}

---

> This is a quote.

{% quote(author="Longor") %} This is a quote with author. {% end %}

---

| This | Is | A | Table |
|-----:|:--:|---|:------|
| A | B | C | D |
| 1 | 2 | 3 | 4 |

---

Math: \\( f_n(\vec{p}) \to [-1, +1] = \enspace ? \\)

---

{% info_notice() %} Info Notice <br> [Link](/typography) {% end %}
{% warn_notice() %} Warn Notice <br> [Link](/typography) {% end %}
{% todo_notice() %} Notice <br> [Link](/typography) {% end %}
{% stub_notice() %} Stub Notice <br> [Link](/typography) {% end %}
{{ stub_notice() }}
{{ stub_notice(kind="article") }}
{{ stub_notice(kind="section") }}

---

Exclusive Choice Set:

<ul class="exclusive-choice-set" aria-label="example">
  <li><a href="#">A</a></li>
  <li><a href="#">B</a></li>
  <li><a href="#" class=missing>C</a></li>
</ul>

---

https://developers.google.com/tech-writing/overview
