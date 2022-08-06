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

{% info_notice() %} Info Notice <br> [Link](/typography) {% end %}
{% warn_notice() %} Warn Notice <br> [Link](/typography) {% end %}
{% todo_notice() %} Notice <br> [Link](/typography) {% end %}
{% stub_notice() %} Stub Notice <br> [Link](/typography) {% end %}
{{ stub_notice() }}
