<figure itemscope itemtype="http://schema.org/MediaObject" class="{{ class | default(class='') }}">
{%- if body is starting_with("http") or body is starting_with("/") -%}
<img itemprop="contentUrl" src="{{ body }}">
{% else %}{{ body | markdown }}{% endif %}
{%- if caption -%}<figcaption><span class=caption itemprop="caption">{{ caption | markdown }}</span>{%- if author -%}<span class=author itemprop="author">{{ author | markdown }}</span>{% endif %}{%- if license -%}<span class=license itemprop="license">{{ license | markdown }}</span>{% endif %}</figcaption>{% endif %}
</figure>{%- if clear -%}<br style="clear: both">{% endif %}