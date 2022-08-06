<blockquote>
{{ body | markdown }}
{% if author %} {{ "&mdash; " ~ author | markdown }} {% endif %}
</blockquote>
