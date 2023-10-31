+++
title = "Vertex Pulling"
description = "Manual vertex streaming for improved memory usage and bandwidth."
aliases = ["/wiki/vertex-pulling"]
[taxonomies]
categories = ["rendering"]
tags = ["rendering", "meshing", "vertices"]
[extra]
chapters = true
chapter_prev = {text = "Vertex Packing", link = "/wiki/vertex-packing"}
chapter_next = {text = "Face Pulling", link = "/wiki/face-pulling"}
+++

{% todo_notice() %} This article is a work-in-progress. {% end %}

- Normal vertex-streaming does not support per-face data.
- Pulling from a vertex-stream or SSBO/UBO is generally the same speed.
- Vertex-shaders *only* have to emit a NDC-position; *how* they do so is undefined.
- Vertices can be defined via vertex- and index-array *within* a vertex-shader.

## References

- [Vertex Formats Part 2: Fetch vs Pull](https://www.yosoygames.com.ar/wp/2018/03/vertex-formats-part-2-fetch-vs-pull/) (**recommended**)
- [Programmable Vertex Pulling by *hannomalie*](https://hannomalie.github.io/posts/2019-12-01-programmable-vertex-pulling.html)
- [Programmable Vertex Pulling by *ktstephano*](https://ktstephano.github.io/rendering/opengl/prog_vtx_pulling)
- [Dynamic Vertex Pulling with D3D11](https://bazhenovc.github.io/blog/post/d3d11-dynamic-vertex-pulling/)
- [WebGL Pulling Vertices](https://webglfundamentals.org/webgl/lessons/webgl-pulling-vertices.html)  
  <small>**Note:** Uses textures instead of buffers.</small>
- [`nlguillemot/ProgrammablePulling`](https://github.com/nlguillemot/ProgrammablePulling)
- [`superdump/bevy-vertex-pulling`](https://github.com/superdump/bevy-vertex-pulling)
