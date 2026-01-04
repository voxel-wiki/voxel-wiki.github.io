{% set class = class | default(value='') %}
{% if float %}{% set class = class ~ "float " %}{% endif %}
<div {% if id %}id="{{ id }}"{% endif %} class='notice todo {{ class }}'>{{ "**TODO:** " ~ body | markdown(inline=true) }}</div>
