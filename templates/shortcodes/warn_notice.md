{% set class = class | default(value='') %}
{% if float %}{% set class = class ~ "float " %}{% endif %}
<div class='notice warning {{ class }}'>{% if body %}{{ body | markdown }}{% endif %}</div>
