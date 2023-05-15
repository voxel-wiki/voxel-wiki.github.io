+++
title = "Rendering"
description = "How to turn voxels into pixels?"
[taxonomies]
categories = ["rendering"]
tags = ["rendering"]
+++

Drawing voxels seems easy at a glance, they're just cubes after all!

However, there's actually an *infinite* amount of ways to render voxels,
depending on the way they should look like, the underlying storage,
performance and resource considerations, general method used, *etc. etc.* ...

It all depends on what ***you*** ultimately want to *do*.

<!-- more --> ---

## Graphics Programming APIs

When writing a program that renders something to the screen,
you will usually want to **A)** draw things as fast as possible
and **B)** do so across many platforms and hardware combinations.

For that, there are two main API's you might use:

- To get started *as fast as possible*, with no regard as to how modern graphics co-processors work,
  use [OpenGL](/wiki/opengl).
- To be future-proof and get as much performance as possible out of your graphics co-processor,
  use [Vulkan](/wiki/vulkan).

## Graphics Programming Libraries

If you find the previously mentioned APIs too burdensome,
there are various rendering abstraction libraries available,
built on top of these API's:

- `C++` [bgfx](https://github.com/bkaradzic/bgfx)
- `C++` [OGRE](https://ogrecave.github.io/ogre/)
- `Rust` [wgpu](https://wgpu.rs/)
- `Java` [libGDX](https://libgdx.com/)

{% info_notice() %}
**Note:**  
Some of these libraries have bindings for other languages,
so check out their documentation before rejecting any!
{% end %}

## Windowing Abstractions & Libraries

Creating a surface to actually draw into is, due to the many platforms that exist,
terribly difficult, so it's best to leave it to a windowing library...

- `GLFW`
- `SDL`
- `WINIT`


---

## General Rendering Methods

### Rasterization

Converting voxels into meshes, then using a hardware-accelerated [rasterizer](https://en.wikipedia.org/wiki/Rasterisation)
to render a whole lot of triangles.

### Splatting

Converting voxels into tightly-fitting screen-aligned quadliterals, rasterizing them,
then performing a Ray-AABB intersection test in the fragment shader to get cubes.

### Raytracing

Send rays out of a camera into a volume of voxels, [marching along them](/wiki/raycasting) until voxels are hit,
calculating a color based on the hit voxels and additional rays sent out from there.

This method makes it possible to achieve a high degree of photorealism and/or complex lighting effects,
that are otherwise extremely hard to produce with other methods.

## General Lighting Methods

{% todo_notice() %} Create article just for lighting? {% end %}

- Global Illumination
- [Ambient Occlusion](https://0fps.net/2013/07/03/ambient-occlusion-for-minecraft-like-worlds/)
- [Flood-Fill Lighting](https://web.archive.org/web/20210429192404/https://www.seedofandromeda.com/blogs/29-fast-flood-fill-lighting-in-a-blocky-voxel-game-pt-1)
- ...?

---

## General Culling Methods

Depending on the method you choose to render voxels,
you may have to [cull your geometry](/wiki/culling),
so as to not overload your GPU with drawcalls & geometry.

---

## References

- [GigaVoxels: Ray-Guided Streaming for Efficient and Detailed Voxel Rendering](https://artis.inrialpes.fr/Publications/2009/CNLE09/)
- <http://jojendersie.de/rendering-huge-amounts-of-voxels/>
- <http://jojendersie.de/rendering-huge-amounts-of-voxels-2/>
