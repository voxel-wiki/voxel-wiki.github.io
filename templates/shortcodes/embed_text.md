{% set text_path = page.path ~ file %}
{% set text_raw = load_data(path=text_path, format="plain") %}
```{{lang|safe}}
{{text_raw|safe}}
```
