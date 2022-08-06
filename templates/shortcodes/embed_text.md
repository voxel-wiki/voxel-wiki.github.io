{% if page.relative_path %}
  {% set text_path = page.relative_path %}
{% else %}
  {% set text_path = "./" %}
{% endif %}

{% if text_path is ending_with(".md") %}
  {% set text_path = text_path | split(pat="/") | slice(end=-1) | join(sep="/") %}
{% endif %}

{% if text_path is not ending_with("/") %}
  {% set text_path = text_path ~ "/" %}
{% endif %}

{% set text_lang = lang | default(value="txt") %}
{% set text_path = text_path ~ file %}
{% set text_raw = load_data(path=text_path, format="plain") %}

{{ "```" ~ text_lang ~ ",
" ~ text_raw ~ "```" | safe | markdown }}
