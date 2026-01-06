+++
title = "Indirect Multidraw"
description = "A method for rendering massive amounts of geometry, with a single drawcall."
aliases = ["/wiki/mdi"]
[taxonomies]
categories = ["rendering"]
tags = ["rendering"]
+++

> A method for rendering massive amounts of geometry, with a single drawcall.

{{ stub_notice() }}
{{ todo_notice(body="Requirement: Modern graphics APIs.") }}
{{ todo_notice(body="Requirement: Pooling of geometry.") }}
{{ todo_notice(body="Follow-up: Vertex pulling.") }}
{{ todo_notice(body="GPU-driven culling and rendering?") }}

--

## Motivation

In the early days, when one wanted to render large amounts of geometry,
where each piece or model was unique in some way <small>(like, say, chunks of meshed voxels)</small>,
there was no other way but to submit an individual drawcall for each and every single piece.

This meant that the CPU had to do *a lot* of work,
repeatedly sending a tons of small commands to the driver and GPU,
making the driver do a ton of validation work,
with the GPU spending a *significant* amount of time just... waiting.

Fortunately in late 2012, [OpenGL](/wiki/opengl) 4.3 was released, adding two new commands: [glMultiDrawArraysIndirect](https://registry.khronos.org/OpenGL-Refpages/gl4/html/glMultiDrawArraysIndirect.xhtml) and [`glMultiDrawElementsIndirect`](https://registry.khronos.org/OpenGL-Refpages/gl4/html/glMultiDrawElementsIndirect.xhtml).

Using these, instead of submitting *individual* drawcalls, one can execute a *buffer* of <u>multi</u>ple drawcalls, stored as tightly packed command structs, <u>draw</u>ing any number of <u>arrays</u>/<u>elements</u>, <u>indirect</u>ly, with almost [zero driver overhead](https://www.gdcvault.com/play/1020791/).



## See also

- [Vertex Pooling](/wiki/vertex-pooling)

## References

- **Vulkan:**
  - [Vulkan Samples: GPU Rendering and Multi-Draw Indirect](https://docs.vulkan.org/samples/latest/samples/performance/multi_draw_indirect/README.html)
  - [Vulkan Guide: Draw Indirect API](https://vkguide.dev/docs/gpudriven/draw_indirect/)
  - [Vulkan Guide: GPU Driven Rendering](https://vkguide.dev/docs/gpudriven/gpu_driven_engines/)
- **OpenGL:**
  - [OpenGL 4 Specification: glMultiDrawArraysIndirect](https://registry.khronos.org/OpenGL-Refpages/gl4/html/glMultiDrawArraysIndirect.xhtml)
  - [OpenGL 4 Specification: glMultiDrawElementsIndirect](https://registry.khronos.org/OpenGL-Refpages/gl4/html/glMultiDrawElementsIndirect.xhtml)
  - [NVidia: Approaching Zero Driver Overhead in OpenGL](https://www.gdcvault.com/play/1020791/)
  - [NVidia: High-Performance, Low-Overhead Rendering with OpenGL and Vulkan](http://behindthepixels.io/talks/#high-performance-low-overhead-rendering-with-opengl-and-vulkan)
  - [J.Stephano: Multi-Draw Indirect (MDI)](https://ktstephano.github.io/rendering/opengl/mdi)
  - [Ferran Sole: MultiDrawIndirect](https://ferransole.wordpress.com/2014/07/09/multidrawindirect/)
  - [Litasa's Blog:: OpenGL MultiDrawIndirect with per-instance textures](https://litasa.github.io/blog/2017/09/04/OpenGL-MultiDrawIndirect-with-Individual-Textures)
  - [Antoine Morrier: Indirect Rendering : “A way to a million draw calls”](https://cpp-rendering.io/indirect-rendering/)
  - [/u/KeinBaum: How to render using glMultiDrawArraysIndirect](https://www.reddit.com/r/opengl/comments/3m9u36/how_to_render_using_glmultidrawarraysindirect/)
