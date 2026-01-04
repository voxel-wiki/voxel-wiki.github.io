{% set class = class | default(value='') %}
{% if float %}{% set class = class ~ " float" %}{% endif %}
{% set body_text = "This article is a stub." %}
{% set help_text = " Perhaps help us expand it?" %}
{% if not body %}
    {% set kind = kind | default(value="article") %}
    {% set kinds = load_data(path="templates/shortcodes/stub_kinds.toml") %}
    {% set body_text = kinds[kind] %}
    {% set help = true %}
{% endif %}
<div {% if id %}id="{{ id }}"{% endif %} class='notice stub {{ class }}'>{% if body %}{{ body | markdown(inline=true) }}{% if help %}{{ help_text }}{% endif %}{% else %}{{ body_text }}{{ help_text }}{% endif %}</div>
