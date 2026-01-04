{% set class = class | default(value='') %}
{% if float %}{% set class = class ~ "float " %}{% endif %}
<div {% if id %}id="{{ id }}"{% endif %} class='notice warning {{ class }}'>{% if body %}{{ body | markdown }}{% endif %}</div>
