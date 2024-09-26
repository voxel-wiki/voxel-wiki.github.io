{% set class = class | default(value='') %}
{% if float %}{% set class = class ~ "float " %}{% endif %}
{% if summary %}
<details class='notice info {{ class }}'><summary>{{ summary | markdown(inline=true) }}</summary>{{ body | markdown }}</details>
{% else %}
<div class='notice info {{ class }}'>{{ body | markdown }}</div>
{% endif %}
