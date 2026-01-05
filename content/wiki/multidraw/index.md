+++
title = "Multidraw"
description = "A method for rendering massive amounts of geometry, with a single drawcall."
aliases = ["/wiki/mdi"]
[taxonomies]
categories = ["rendering"]
tags = ["rendering"]
+++

> A method for rendering massive amounts of geometry, with a single drawcall.

{{ stub_notice() }}

{{ todo_notice(body="Motivation: Drawcalls are expensive.") }}
{{ todo_notice(body="Requirement: Modern graphics APIs.") }}
{{ todo_notice(body="Requirement: Pooling of geometry.") }}
{{ todo_notice(body="Follow-up: Vertex pulling.") }}
{{ todo_notice(body="GPU-driven culling and rendering?") }}

## See also

- [Vertex Pooling](/wiki/vertex-pooling)

## References

- <https://vkguide.dev/docs/gpudriven/gpu_driven_engines/>
- <https://ktstephano.github.io/rendering/opengl/mdi>
- <https://docs.vulkan.org/samples/latest/samples/performance/multi_draw_indirect/README.html>
- <https://vkguide.dev/docs/gpudriven/draw_indirect/>
- <https://registry.khronos.org/OpenGL-Refpages/gl4/html/glMultiDrawElementsIndirect.xhtml>
- <https://ferransole.wordpress.com/2014/07/09/multidrawindirect/>
- <https://litasa.github.io/blog/2017/09/04/OpenGL-MultiDrawIndirect-with-Individual-Textures>
