+++
title = "Rendering"
description = "How to turn voxels into pixels?"
[taxonomies]
categories = ["rendering"]
tags = ["rendering"]
+++

While rendering voxels appears easy at a glance ("they're just cubes!"),
there are actually many, *many*, trade-offs one has to take into account,
mainly depending on the intended visual *style* and *scale* of the individual voxels.

<!-- more --> ---

Ultimately it depends on what ***your*** goals are; try not to set them too lofty!

Since there is no way to write about all possible methods, this article will talk about things *in general*, linking elsewhere for more details - if possible.

## Hardware Acceleration

Talking about rendering is impossible without talking about hardware acceleration
and thus **GPU**s (*Graphics&nbsp;Processing&nbsp;Unit*); so let's do that real quick!

The primary purpose of a GPU is to calculate/compute/solve a *massive* number of highly similar problems[^embarassinglyparallel] "all at once",
by splitting up large sets of data into smaller groups, which are then worked thru by a large number of tiny processing units[^gpumanycores].

{% info_notice() %}
[Historically](https://en.wikipedia.org/wiki/Graphics_processing_unit#History),
the problem in question was mainly [rasterization](https://en.wikipedia.org/wiki/Rasterisation)
(and later fragment processing) of triangles via GPUs on dedicated [graphics cards](https://en.wikipedia.org/wiki/Graphics_card).

These days GPUs are much more [general purpose](https://en.wikipedia.org/wiki/General-purpose_computing_on_graphics_processing_units)
and are used in so many applications that we won't bother listing them here.
{% end %}

To hopefully nobodies surprise, rendering voxels *is* such a massively parallel process, that *not* using GPUs would be very (very) silly.

Now, how do we gain access to the awesome processing power of GPUs...?

## Graphics Programming APIs

Unfortunately, directly accessing GPUs usually isn't possible, since...

1. Operating systems must share GPU 'resources' between multiple processes.
2. There are a multitude of hardware vendors and thus GPUs, not to mention drivers!

As such, we are forced to use a **Graphics&nbsp;Programming&nbsp;API**... of which there are several.

However, since you are most likely to want to run your program across many platforms and hardware combinations,
we can safely ignore a whole bunch of them and choose from one of two APIs:

- To get started *as fast as possible*, with no regard as to how modern GPUs and their drivers work,
  use [OpenGL](/wiki/opengl).
- To be future-proof and get as much performance as possible out of your GPU,
  use [Vulkan](/wiki/vulkan).
- If you're okay with proprietary stuff and are targeting Microsoft Windows/Xbox,
  you can use [Direct3D](https://en.wikipedia.org/wiki/Direct3D).

## Graphics Programming Libraries

If you find the previously mentioned APIs too burdensome or low-level,
there are various *rendering abstraction* libraries available,
using the lower APIs as *backends*:

{% warn_notice() %}
Only libraries directly exposing 3D graphics are listed.
{% end %}

| Name | Language | Backend/s |
|------|----------|-----------|
| [wgpu](https://wgpu.rs/) | `Rust` | *various* |
| [bgfx](https://github.com/bkaradzic/bgfx) | `C++` | *various* |
| [OGRE](https://ogrecave.github.io/ogre/) | `C++` | OpenGL / Direct3D |
| [raylib](https://www.raylib.com/) | `C` | OpenGL |
| [libGDX](https://libgdx.com/) | `Java` | OpenGL(ES) |

{% info_notice() %}
**Note:**  
Some of these libraries have bindings for other languages,
so check out their documentation before rejecting any!
{% end %}

## Windowing Abstractions & Libraries

Creating a surface to actually draw into is, due to the many platforms that exist,
terribly difficult, so it's best to leave it to a windowing library...

- `GLFW` (recommended)
- `SFML`
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

---

[^embarassinglyparallel]: Commonly referred to as [embarrassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel).

[^gpumanycores]: Modern GPU's have literally hundreds, if not *thousands*, of 'units' running in parallel; the exact mapping of 'units' to 'threads' differs per GPU vendor.
