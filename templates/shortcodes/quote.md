<blockquote>
{{ body | markdown }}
{% if author %}<em title="Author and/or source of this quote">{{ "&mdash; " ~ author | markdown }}</em>{% endif %}
</blockquote>
