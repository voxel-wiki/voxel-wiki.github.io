{% set class = class | default(value='') %}
{% if float %}{% set class = class ~ "float " %}{% endif %}
<div class='notice info {{ class }}'>{{ body | markdown }}</div>
