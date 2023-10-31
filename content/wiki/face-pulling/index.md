+++
title = "Face Pulling"
description = "Taking vertex pulling to it's conclusion by streaming ONLY face-data."
aliases = ["/wiki/face-pulling"]
[taxonomies]
categories = ["rendering"]
tags = ["rendering", "meshing", "vertices"]
[extra]
chapters = true
chapter_prev = {text = "Vertex Pulling", link = "/wiki/vertex-pulling"}
chapter_next = false
+++

{% todo_notice() %} This article is a work-in-progress. {% end %}

Instead of having the vertex-shader pull a *vertex* from a buffer, we pull a *face* from a buffer, then reconstruct the current vertex from both it and the current vertex ID / `gl_VertexID`.

## Implementation

{{ stub_notice(kind="section") }}

## References

{{ stub_notice(kind="section") }}
