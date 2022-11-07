<figure class="{{ class | default(class='') }}">
{{ body | markdown }}
{%- if caption -%}<figcaption>{{ caption | markdown }}</figcaption>{% endif %}
</figure>{%- if clear -%}<br style="clear: both">{% endif %}