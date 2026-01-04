{% set class = class | default(value='') %}
{% if float %}{% set class = class ~ "float " %}{% endif %}
<blockquote {% if id %}id="{{ id }}"{% endif %} class="{{ class }}">
{{ body | markdown }}
{% if author %}<em title="Author and/or source of this quote" class="author">{{ "&mdash; " ~ author | markdown }}</em>{% endif %}
</blockquote>
