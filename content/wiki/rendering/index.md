+++
title = "Rendering"
description = "How to turn voxels into pixels?"
[taxonomies]
categories = ["rendering"]
tags = ["rendering"]
[extra]
toc = true
+++

While rendering voxels appears easy at a glance ("they're just cubes!"),
there are actually many, *many*, trade-offs one has to take into account,
mainly depending on the intended visual *style* and *scale* of the individual voxels.

<!-- more --> ---

Ultimately it depends on what ***your*** goals are; try not to set them too lofty!

Since there is no way to write about all possible methods, this article will talk about things *in general* and, if possible, link elsewhere for more details.

## Prerequisites

Before you can render anything, there is a bunch of decisions to make and things to prepare.

### Hardware Acceleration

Talking about rendering is impossible without talking about hardware acceleration
and thus <a href="https://en.wikipedia.org/wiki/Graphics_processing_unit" title="Graphics Processing Units">GPUs</a>; so let's do that real quick!

The primary purpose of a GPU is to calculate/compute/solve a *massive* number of highly similar problems[^embarassinglyparallel] "all at once",
by splitting up large sets of data into smaller groups, which are then worked thru by a large number of tiny processing units[^gpumanycores].

[Historically](https://en.wikipedia.org/wiki/Graphics_processing_unit#History),
the problem in question was mainly vertex transformation and [rasterization](https://en.wikipedia.org/wiki/Rasterisation)
(and later fragment processing) of triangles via GPUs on [dedicated graphics cards](https://en.wikipedia.org/wiki/Graphics_card).
These days, they're much more general purpose and
used for [quite a lot of things](https://en.wikipedia.org/wiki/General-purpose_computing_on_graphics_processing_units#Applications), not just rendering and gaming.

More often than you'd expect, they're also combined/situated with the CPU on the same chip, especially on mobile/laptop devices, as iGPU!

{% info_notice() %}
If you need statistics on what kind of hardware, and not just the GPU, the average user has installed in their system, please refer to the [Steam Hardware & Software Survey](https://store.steampowered.com/hwsurvey) and the [GPUinfo Hardware Databases](https://www.gpuinfo.org/).
{% end %}

With that said, to hopefully nobodies surprise, rendering voxels is *such* a massively parallel process, that *not* using GPUs would be very (very) silly!

How do we gain access to the awesome processing power of GPUs? Well...

### Graphics Programming APIs

Unfortunately, directly accessing GPUs usually isn't possible, since:

1. Operating systems must share GPU resources between multiple processes.
2. There are a multitude of hardware vendors and thus GPUs, not to mention drivers!

As such, we are forced to use a **Graphics&nbsp;Programming&nbsp;API**... of which there are also several.

However, since you are most likely to want to run your program across many platforms and hardware combinations,
we can safely ignore a whole bunch of them and choose from one of four APIs:

- To get *started as fast as possible*, use [OpenGL](/wiki/opengl) version 4+.
- To get *all the performance* out of your GPU, use [Vulkan](/wiki/vulkan).
- If you're okay with proprietary stuff and are targeting mainly Microsoft&nbsp;Windows & Xbox, you can use [Direct3D](https://en.wikipedia.org/wiki/Direct3D) via [DirectX](https://en.wikipedia.org/wiki/DirectX).
- When developing on and targeting the various Apple platforms, you'll have to[^applegl] use the [Metal API](https://en.wikipedia.org/wiki/Metal_(API)).

{% info_notice() %}
**Note:** You can safely start with OpenGL and switch to the other APIs at a later date. No need to learn *all* of rendering tech at once!
{% end %}

{% warn_notice() %}
**Note:** Keep in mind that **game consoles** have their own, *proprietary*, graphics APIs;
if you intend to port your project, you'll have to keep most graphics-related
code behind some abstraction, separate from other systems.
{% end %}

Unfortunately the pain doesn't stop there: since these APIs require low-level access to system/platform resources, are generally quite large/complex and (like in the case of Vulkan) still being actively updated, the *vast* majority of languages simply *do not* include them in their standard libraries... so you *must* use a [language binding](https://en.wikipedia.org/wiki/Language_binding) made for the given **API&nbsp;+&nbsp;language** pair you need.

Since there are over ~7000 languages out there, each with potentially *multiple* bindings for *several* of these APIs, we *cannot* list them here, so the best we can give you is this:

- **OpenGL:** <https://wikis.khronos.org/opengl/Language_bindings>
- **Vulkan:** <https://www.vulkan.org/tools#language-bindings>
- **DirectX / Metal:** Good luck.

### Graphics Programming Libraries

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
Most of these libraries have bindings for other languages;
look into their documentation before rejecting any outright!
{% end %}

### Windowing Abstraction Libraries

Creating a surface to actually draw into is *terribly* annoying,
due to the many platforms and operating systems that exist,
so it's best to leave it to a windowing library.

Some of the graphics programming libraries, from the previous section, provide their own windowing abstractions, so you may not need/have to choose one at all.
Either way, here's a small list:

| Name | Language | Platforms |
|------|----------|-----------|
| [SDL](https://www.libsdl.org/)  | `C` | [*various*](https://wiki.libsdl.org/SDL2/FAQGeneral#what_platforms_are_supported) |
| [GLFW](https://www.glfw.org/) | `C` | [*various*](https://www.glfw.org/faq.html#14---what-platforms-are-supported-by-glfw) |
| [SFML](https://www.sfml-dev.org/) | `C++` | [*various*](https://www.sfml-dev.org/faq.php#grl-platforms) |
| [Winit](https://github.com/rust-windowing/winit) | `Rust` | [*various*](https://github.com/rust-windowing/winit/blob/master/FEATURES.md) |

---

<small class="text-secondary">End of prerequisites.</small>

## Volume Rendering Methods

There are, in general, *two* families of volume rendering methods, with different complexity, fidelity, extensibility, performance and memory trade-offs:

<ul class="exclusive-choice-set" aria-label="volume rendering methods">
  <li><a href="/wiki/surface-extraction">Surface Extraction</a></li>
  <li><a href="/wiki/volume-marching">Volume Marching</a></li>
</ul>

Within the former family of **surface extraction**,
the volume is pre-processed into a *surface-only* representation,
such as a **mesh** or a **point-cloud**,
which can then be [rasterized](https://en.wikipedia.org/wiki/Rasterisation) (eg: triangles ⇒ visible pixels).

In the latter family of **volume marching**, the volume itself is uploaded to the GPU and marched through via [raycasting](/wiki/raycasting)/raymarching (eg: visible pixels ⇒ voxels).

One can also [combine](/wiki/raysterization) both families, presenting yet more trade-offs to use/apply and deal with.

## Streaming

Regardless of the rendering method, it's necessary to decide which chunks of voxels (be it as meshes or volumes) to upload to the GPU, as uploading *all of them* would consume entirely too much GPU memory, which is often smaller than CPU-side memory[^igpuvram].

{% todo_notice() %} Explain more and/or link to relevant articles. {% end %}

But which data should you upload? And should you upload *all of it*?

### Level of Detail

While GPUs *do* have massive amounts of computational power, with modern ones being capable of rasterizing literal *billions* (`1'000'000'000`) of triangles per second, they still have limits, especially as your shaders get more complex and render pipelines become ever longer spaghetti.

Unsurprisingly, as the draw-distance increases, voxels get smaller and smaller, to the point of voxels being *smaller* than pixels.... which means we can reduce the [**Level of Detail**](/wiki/level-of-detail) of things!

{% todo_notice() %} Explain more and/or link to relevant articles. {% end %}

## Culling

If you use surface extraction or [a hybrid method](/wiki/raysterization), 
[**culling**](/wiki/culling) will be necessary, as to not overload the GPUs rasterization and fragment pipeline stages.

The first and most common culling method to apply is [Frustum Culling](/wiki/frustum-culling), usually followed by (Raster) [Occlusion Culling](/wiki/occlusion-culling) and/or a variant of [Portal Culling](/wiki/portal-culling).

Culling algorithms can also (and perhaps *should*) be implemented via compute shaders *on the GPU*, using its massive parallelism to cull literal millions of objects all at once, further reducing the work both CPU and GPU must do.

## Packing

Depending on the attributes and precision of your geometries data, you may be able to [tightly pack data](/wiki/vertex-packing) into individual `int`s or `long`s, avoiding complex [VAO](https://wikis.khronos.org/opengl/Vertex_Specification#Vertex_Array_Object) layouts and allowing for [custom vertex pulling](/wiki/vertex-pulling) functionality. The performance gains here can be *ridiculous*, as memory bandwidth and cache is severely limited on the GPU... so if you can do this without unduly limiting your stylistic choices, *do it*.

## Memory Pooling

In practice, it's strongly recommended (if not a *must*) to use **memory&nbsp;pooling** techniques, handling the allocation and layout of geometry/volume data on your own, instead of letting the driver do it automatically, so as to:

- Reduce the need for synchronization and invalidation work (aka&nbsp;overhead) the driver must perform.
- Allow much more efficient batching of draw calls, usually via [multidraw commands](/wiki/multidraw), massively improving performance.
- Perform [frustum](/wiki/frustum-culling)- and [occlusion](/wiki/occlusion-culling)-culling on the GPU using compute shaders.

Of course, that means having to deal with allocation and synchronization yourself, but that's frankly a small price to pay compared to the enormous benefits gained. Note that when using an existing engine, this *may* happen automatically, if all goes well <small>(basically never)</small>.

{% todo_notice() %} Explain more and/or link to relevant articles. {% end %}

---

## Light(ing) Transport

If you've read all of the above, you might think:

> oh boy, this sure seems complicated!

Unfortunately for you and *everyone* else, lighting is *more* complicated.
**By a whole <span title="(This is the only acceptable instance of swearing in this Wiki.)" style="color:red">[BLEEP]</span>ing lot.**

The problem with (and thus complexity of) [light transport](https://en.wikipedia.org/wiki/Light_transport_theory) boils down to three opposing factors: **Time**, **accuracy** and **fidelity**.

With an average frame-time of ~16 milliseconds (about 60 FPS),
even disregarding *all* other rendering,
there just *isn't enough time* to accurately calculate lighting;
the higher the framerate, the worse this gets.

As such, one has to employ quite a bunch of trickery to make it happen,
lowering the *accuracy* of lighting and, at the same time, giving up on its *fidelity*.

{% info_notice(summary="**Note on Spectral Rendering**") %}
If we had *much* faster GPUs (like 10-100 times faster!), we could use the method that yields the most realistic lighting: [Spectral Rendering](https://en.wikipedia.org/wiki/Spectral_rendering). Unfortunately, even with some of the greatest graphics wizards working on it, there is still no way to make it run in realtime, at sufficient resolution... much less on consumer hardware.
{% end %}

Now we add voxels into the mix.

*On one hand*, voxels give us a relatively easy way to obtain/compute occlusion data for lighting: re- or up-sampling and storing them in a fast spatial hierarchy on the GPU, like a [Sparse 64-Tree](/wiki/sparse-64-tree), allows for relatively efficient ray-traversal; at least at small sample counts.

*On the other*, since users can place/create light-emitting voxels, we now have to deal with lighting in an endless variety of placements and patterns... at a *ludicrous* scale; even simple user-made buildings may contain dozens of lights, or hell, imagine dealing with a whole city!

So, remember how there isn't a lot of time to calculate lighting?

We have two(-ish) tricks to help us deal with this un-timely mess:

1. Instead of computing all lighting in realtime, perform as much work as possible on the CPU-side and *bake it* into the voxel volume (or mesh), before ever uploading it to the GPU.

2. Since the accuracy of lighting strongly depends on how many samples of light(ray)s there are per pixel, we can *spread out* the computations over multiple frames and *spatio-temporally accumulate* it.

For all these reasons, after many decades of research, there are *a lot* of lighting methods; all with different levels of accuracy, fidelity, overall complexity and various trade-offs.

Depending on the method chosen, implementation will probably take up *most* of the renderers overall development time, and will have to keep being adjusted as development continues.

### Flood-Fill Lighting

Now, to keep things relatively simple (and that's putting it mildly), one can use [cellular automata](/wiki/cellularautomata) algorithms to [calculate lighting](https://web.archive.org/web/20210429192404/https://www.seedofandromeda.com/blogs/29-fast-flood-fill-lighting-in-a-blocky-voxel-game-pt-1).

This works by propagating local lighting to neighbouring voxels, starting at the light-emitting voxels, in a [breadth-first-search](https://en.wikipedia.org/wiki/Breadth-first_search) throughout the grid, resulting in every non-solid voxel taking on the *largest* lightning value of the surrounding lights. Updating the local lighting works almost the same, propagating from where ever the change occurred, but giving each voxel the *smallest* lighting value of its neighbours.

{% info_notice() %}
If you're annoyed at this method resulting in a rhombus/diamond shape, you will also have to spread lighting diagonally; handling the literal corner-cases can be quite annoying, but is doable, and will slow down the spreading quite a bit.
{% end %}

Getting a little bit more complicated, but still within reason, sunlight can be calculated by propagating lighting from every block, starting at the highest *neighbour* of a given column, down to the columns *own* highest block. How to deal with updates here is left as an exercise to the reader.

Now, just one teeny-tinsy problem: This method doesn't actually give you shadows. Nor does it allow for diagonal/moving sunlight.

### Grid-based Visibility
{{ stub_notice(kind="section") }}

- <https://oliver-hare.com/daedalus/algorithms/light/lightsys/2017/10/22/game-board-light-propagation-algorithm.html>
- <https://towardsdatascience.com/a-quick-and-clear-look-at-grid-based-visibility-bf63769fbc78/>

### Radiosity/Photon Mapping
{{ stub_notice(kind="section") }}

- <https://en.wikipedia.org/wiki/Radiosity_(computer_graphics)>
- <https://web.archive.org/web/20160511192712/http:/freespace.virgin.net/hugo.elias/radiosity/radiosity.htm>
- <https://graphics.stanford.edu/courses/cs348b-00/course8.pdf>
- <https://www.cs.cmu.edu/afs/cs/academic/class/15462-s10/www/lec-slides/lec21.pdf>
- <https://www3.cs.stonybrook.edu/~qin/courses/visualization/visualization-radiosity-and-photon-mapping.pdf>
- <https://cdn.steamstatic.com/apps/valve/2007/SIGGRAPH2007_EfficientSelfShadowedRadiosityNormalMapping.pdf>
- <https://developer.nvidia.com/gpugems/gpugems2/part-v-image-oriented-computing/chapter-39-global-illumination-using-progressive>

### Light Propagation Volumes
{{ stub_notice(kind="section") }}

- <https://blog.blackhc.net/2010/07/light-propagation-volumes/>
- [Light Propagation Volumes in CryEngine 3](https://www.advances.realtimerendering.com/s2009/Light_Propagation_Volumes.pdf)
- [Cascaded Light Propagation Volumes using Spherical Radial Basis Functions](https://arxiv.org/abs/2407.17336)
- [Cascaded light propagation volumes for real-time indirect illumination](https://dl.acm.org/doi/10.1145/1730804.1730821)
- [Real-time multiple scattering using light propagation volumes](https://dl.acm.org/doi/10.1145/2159616.2159636)
- [Convergent Light Volumes for Indirect Illumination](https://publications.lib.chalmers.se/records/fulltext/193682/193682.pdf)
- [Octree Light Propagation Volumes](https://fileadmin.cs.lth.se/cs/Personal/Michael_Doggett/pubs/olovsson13-olpv.pdf)
- [Deferred Voxel Shading for Real Time Global Illumination](https://jose-villegas.github.io/post/deferred_voxel_shading/)
- [Delta Light Propagation Volumes for Mixed Reality](https://www.tobias-franke.eu/publications/franke13dlpv/franke13dlpv.pdf)

### Radiance Cascades
{{ stub_notice(kind="section") }}

- <https://radiance-cascades.com/>
- <https://mini.gmshaders.com/p/radiance-cascades?utm_campaign=post&utm_medium=web>
- <https://mini.gmshaders.com/p/radiance-cascades2>
- <https://m4xc.dev/articles/fundamental-rc/>
- <https://tmpvar.com/poc/radiance-cascades/>

### Voxel Cone Tracing
{{ stub_notice(kind="section") }}

- <https://research.nvidia.com/sites/default/files/publications/GIVoxels-pg2011-authors.pdf>
- <https://cgvr.informatik.uni-bremen.de/theses/finishedtheses/VoxelConeTracing/S4552-rt-voxel-based-global-illumination-gpus.pdf>
- <https://fumufumu.q-games.com/archives/Cascaded_Voxel_Cone_Tracing_final.pdf>
- <https://leifnode.com/2015/05/voxel-cone-traced-global-illumination/>
- <https://www.tobias-franke.eu/publications/franke14dvct/franke14dvct.pdf>
- <https://kth.diva-portal.org/smash/get/diva2:1886204/FULLTEXT01.pdf>
- <https://otaviopeixoto1.github.io/portfolio/vctgi/>

### Path Tracing
{{ stub_notice(kind="section") }}

- <https://en.wikipedia.org/wiki/Path_tracing>
- <https://blogs.nvidia.com/blog/what-is-path-tracing/>
- <http://graphics.ucsd.edu/~henrik/papers/book/>
- <http://graphics.ucsd.edu/~henrik/papers/coherent_path_tracing.pdf>
- <https://www.cescg.org/wp-content/uploads/2018/04/Vlnas-Bidirectional-Path-Tracing-1.pdf>
- <https://intro-to-restir.cwyman.org/presentations/2023ReSTIR_Course_Cyberpunk_2077_Integration.pdf>
- <https://fpsunflower.github.io/ckulla/data/egsr_2012_volume_paper.pdf>
- <https://shellblade.net/files/slides/path-tracing.pdf>

---

{% todo_notice() %} Add more lighting methods? {% end %}

{% todo_notice() %} Yet more sections? {% end %}

## References

- [Wikipedia: Bidirectional Reflectance Distribution Function (BRDF)](https://en.wikipedia.org/wiki/Bidirectional_reflectance_distribution_function)
- [GigaVoxels: Ray-Guided Streaming for Efficient and Detailed Voxel Rendering](https://artis.inrialpes.fr/Publications/2009/CNLE09/)
- [Johannes Jendersie: Rendering huge amounts of Voxels](http://jojendersie.de/rendering-huge-amounts-of-voxels/)
- [Johannes Jendersie: Rendering huge amounts of Voxels 2](http://jojendersie.de/rendering-huge-amounts-of-voxels-2/)
- [0fps: Meshing in a Minecraft Game](https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/)
- [0fps: Ambient Occlusion](https://0fps.net/2013/07/03/ambient-occlusion-for-minecraft-like-worlds/)
- [Procedural World: From Voxels to Polygons](http://procworld.blogspot.com/2010/11/from-voxels-to-polygons.html)
- [Nick's Voxel Blog: Dual Contouring: Seams & LOD for Chunked Terrain](http://ngildea.blogspot.com/2014/09/dual-contouring-chunked-terrain.html)
- [Nick's Voxel Blog: Dual Contouring with OpenCL](http://ngildea.blogspot.com/2015/06/dual-contouring-with-opencl.html)
- [Minecraft Like Rendering Experiments in OpenGL 4](https://web.archive.org/web/20200718072744/https://codeflow.org/entries/2010/dec/09/minecraft-like-rendering-experiments-in-opengl-4/)
- [Stackoverflow: How can I improve rendering speeds of a Voxel/Minecraft type game?](https://gamedev.stackexchange.com/questions/22664/how-can-i-improve-rendering-speeds-of-a-voxel-minecraft-type-game)
- [Inigo Quilez: Sphere projection](https://iquilezles.org/articles/sphereproj/)
- [Learn OpenGL: Shadow Mapping](https://learnopengl.com/Advanced-Lighting/Shadows/Shadow-Mapping)
- [Shading in Valve’s Source Engine](https://advances.realtimerendering.com/s2006/Chapter7-Shading_in_Valve's_Source_Engine.pdf)

...and [even more](/tags/rendering/) references.

---

[^embarassinglyparallel]: Commonly referred to as [embarrassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel).

[^gpumanycores]: Modern GPU's have literally hundreds, if not *thousands*, of 'units' running in parallel; the exact mapping of 'units' to 'threads' differs per GPU vendor.

[^applegl]: Apple deprecated OpenGL a while ago, permanently pinning support/drivers at OpenGL 4.1, seemingly planning to remove it *eventually* <small>(probably never?)</small>. Unfortunately, that means the drivers are also stuck being a buggy mess, so working with *modern* OpenGL on their platforms is... painful.

[^igpuvram]: On systems with an iGPU (i.e.: most laptops and 'thin' desktops), the memory between CPU and GPU is shared, as both live on the same chip; this is both a boon (less synchronization and no PCIe transfers) and a curse (weird performance profiles and less memory). This can also be the case on some smartphones.
