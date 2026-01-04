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

Since there is no way to write about all possible methods, this article will talk about things *in general* and, if possible, link elsewhere for more details.

## Hardware Acceleration

Talking about rendering is impossible without talking about hardware acceleration
and thus <abbr title="Graphics Processing Units">GPUs</abbr>; so let's do that real quick!

The primary purpose of a GPU is to calculate/compute/solve a *massive* number of highly similar problems[^embarassinglyparallel] "all at once",
by splitting up large sets of data into smaller groups, which are then worked thru by a large number of tiny processing units[^gpumanycores].

{% info_notice() %}
[Historically](https://en.wikipedia.org/wiki/Graphics_processing_unit#History),
the problem in question was mainly vertex transformation and [rasterization](https://en.wikipedia.org/wiki/Rasterisation)
(and later fragment processing) of triangles via GPUs on dedicated [graphics cards](https://en.wikipedia.org/wiki/Graphics_card).

These days GPUs are much more [general purpose](https://en.wikipedia.org/wiki/General-purpose_computing_on_graphics_processing_units)
and are used in so many applications that we won't bother listing them here.
{% end %}

To hopefully nobodies surprise, rendering voxels is *such* a massively parallel process, that *not* using GPUs would be very (very) silly!

How do we gain access to the awesome processing power of GPUs? Well...

## Graphics Programming APIs

Unfortunately, directly accessing GPUs usually isn't possible, since:

1. Operating systems must share GPU resources between multiple processes.
2. There are a multitude of hardware vendors and thus GPUs, not to mention drivers!

As such, we are forced to use a **Graphics&nbsp;Programming&nbsp;API**... of which there are several.

However, since you are most likely to want to run your program across many platforms and hardware combinations,
we can safely ignore a whole bunch of them and choose from one of three APIs:

- To get started *as fast as possible*, with no regard as to how modern GPUs and their drivers work, use [OpenGL](/wiki/opengl).
- To be future-proof and get as much performance as possible out of your GPU, use [Vulkan](/wiki/vulkan).
- If you're okay with proprietary stuff and are targeting mainly Microsoft&nbsp;Windows & Xbox, you can use [Direct3D](https://en.wikipedia.org/wiki/Direct3D) via [DirectX](https://en.wikipedia.org/wiki/DirectX).
- Or, if you are somehow developing on/for the Apple platforms, you'll have to use the [Metal API](https://en.wikipedia.org/wiki/Metal_(API)).

{% warn_notice() %}
Keep in mind that **game consoles** have their own, *proprietary*, graphics APIs;
if you intend to port your project, you'll have to keep most graphics-related
code behind some abstraction, separate from other systems.
{% end %}

Unfortunately the pain doesn't stop there: since these APIs require low-level access to system/platform resources, are generally quite large/complex and (like in the case of Vulkan) still being actively updated, the *vast* majority of languages simply *do not* include them in their standard libraries... so you *must* use a [language binding](https://en.wikipedia.org/wiki/Language_binding) made for the given **API&nbsp;+&nbsp;language** pair you need.

Since there are over ~7000 languages out there, each with potentially *multiple* bindings for *several* of these APIs, we *cannot* list them here, so the best we can give you is this:

- **OpenGL:** <https://wikis.khronos.org/opengl/Language_bindings>
- **Vulkan:** <https://www.vulkan.org/tools#language-bindings>
- **DirectX / Metal:** Good luck.

## Graphics Programming Libraries

If you find the previously mentioned APIs too burdensome or low-level,
there are various *rendering abstraction* libraries available,
using the lower APIs as *backends*:

{% warn_notice() %}
Only well-known libraries directly exposing 3D graphics are listed.
{% end %}

| Name | Language | Backend/s |
|------|----------|-----------|
| [wgpu](https://wgpu.rs/) | `Rust` | [*various*](https://github.com/gfx-rs/wgpu#supported-platforms) |
| [bgfx](https://github.com/bkaradzic/bgfx) | `C++` | [*various*](https://bkaradzic.github.io/bgfx/overview.html#supported-rendering-backends) |
| [OGRE](https://ogrecave.github.io/ogre/) | `C++` | OpenGL / Direct3D |
| [raylib](https://www.raylib.com/) | `C` | OpenGL |
| [libGDX](https://libgdx.com/) | `Java` | OpenGL(ES) |

{% info_notice() %}
**Note:**  
Some of these libraries have bindings for other languages,
so check out their documentation before rejecting any!
{% end %}

## Windowing Abstraction Libraries

Creating a surface to actually draw into is *terribly* annoying,
due to the many platforms and operating systems that exist,
so it's best to leave it to a windowing library...

| Name | Language | Platforms |
|------|----------|-----------|
| [SDL](https://www.libsdl.org/)  | `C` | [*various*](https://wiki.libsdl.org/SDL2/FAQGeneral#what_platforms_are_supported) |
| [GLFW](https://www.glfw.org/) | `C` | [*various*](https://www.glfw.org/faq.html#14---what-platforms-are-supported-by-glfw) |
| [SFML](https://www.sfml-dev.org/) | `C++` | [*various*](https://www.sfml-dev.org/faq.php#grl-platforms) |
| [Winit](https://github.com/rust-windowing/winit) | `Rust` | [*various*](https://github.com/rust-windowing/winit/blob/master/FEATURES.md) |


---

## General Rendering Methods

There are, in general, *two* families of volume rendering methods, with different complexity, fidelity, extensibility, performance and memory trade-offs:

<ul class="exclusive-choice-set" aria-label="volume rendering methods">
  <li><a href="/wiki/surface-extraction">Surface Extraction</a></li>
  <li><a href="/wiki/volume-marching">Volume Marching</a></li>
</ul>

Within the former family of **surface extraction**,
the volume is pre-processed into a *surface-only* representation,
such as a **mesh** or a **point-cloud**,
which can then be [rasterized](https://en.wikipedia.org/wiki/Rasterisation) (eg: triangles ⇒ visible pixels).

In the latter family of **volume marching**, the volume itself is marched through via [raycasting](/wiki/raycasting)/raymarching (eg: visible pixels ⇒ voxels).

It's also possible to [combine](/wiki/raysterization) both families, presenting yet more trade-offs to use/apply and deal with.

---

## Aspects of Lighting

Lighting is commonly defined via [some variant](https://en.wikipedia.org/wiki/Bidirectional_reflectance_distribution_function#Models) of the [**Bidirectional Reflectance Distribution Function**](https://en.wikipedia.org/wiki/Bidirectional_reflectance_distribution_function)...

<ul class="exclusive-choice-set" aria-label="brdf aspects">
  <li><a href="#aspects-of-lighting">Diffuse</a></li>
  <li><a href="#aspects-of-lighting">Glossy</a></li>
  <li><a href="#aspects-of-lighting">Mirror</a></li>
</ul>

{% todo_notice() %} Create article just for lighting? {% end %}

- Global Illumination
- [Ambient Occlusion](https://0fps.net/2013/07/03/ambient-occlusion-for-minecraft-like-worlds/)
- [Flood-Fill Lighting](https://web.archive.org/web/20210429192404/https://www.seedofandromeda.com/blogs/29-fast-flood-fill-lighting-in-a-blocky-voxel-game-pt-1)
- [Shadow Mapping](https://learnopengl.com/Advanced-Lighting/Shadows/Shadow-Mapping)
- ...?

---

## General Culling Methods

Depending on the method you choose to render voxels,
you may have to [cull your geometry](/wiki/culling),
so as to not overload your GPU with draw-calls & geometry.

---

## References

- [GigaVoxels: Ray-Guided Streaming for Efficient and Detailed Voxel Rendering](https://artis.inrialpes.fr/Publications/2009/CNLE09/)
- <http://jojendersie.de/rendering-huge-amounts-of-voxels/>
- <http://jojendersie.de/rendering-huge-amounts-of-voxels-2/>
- <https://swiftcoder.wordpress.com/planets/isosurface-extraction/>
- <https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/>
- <http://procworld.blogspot.com/2010/11/from-voxels-to-polygons.html>
- <http://ngildea.blogspot.com/2014/09/dual-contouring-chunked-terrain.html>
- <http://ngildea.blogspot.com/2015/06/dual-contouring-with-opencl.html>
- <https://web.archive.org/web/20200718072744/https://codeflow.org/entries/2010/dec/09/minecraft-like-rendering-experiments-in-opengl-4/>
- <https://gamedev.stackexchange.com/questions/22664/how-can-i-improve-rendering-speeds-of-a-voxel-minecraft-type-game>

---

[^embarassinglyparallel]: Commonly referred to as [embarrassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel).

[^gpumanycores]: Modern GPU's have literally hundreds, if not *thousands*, of 'units' running in parallel; the exact mapping of 'units' to 'threads' differs per GPU vendor.
