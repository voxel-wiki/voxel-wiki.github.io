+++
title = "Coordinate Systems"
description = "The importance of correct coordinate systems cannot be understated."
path = "/wiki/coordinate-systems"
aliases = ["/wiki/coordinates"]
[taxonomies]
categories = ["math"]
tags = ["math"]
+++

When dealing with voxels (and math in three-dimensional space in general), it is extremely important to get your coordinate systems and the conversions between them right. Even slightly wrong conversions can (and will) lead to *massive* headaches and horrible debugging sessions.

<!-- more -->

As such, it is a good idea to do one or more of these:

- Add the coordinate-system being used to every position, rotation and scale value.
- Restrict the mixing of coordinate-systems, by using a type-system that let's you create [new types](https://www.worthe-it.co.za/blog/2020-10-31-newtype-pattern-in-rust.html) from existing types.
- Document the coordinate-systems of function parameters.

Note that, depending on the software you are using, the concrete definition and usage of coordinate-systems can vary *wildly*...

{% figure(caption="Commonly Used Coordinate Systems",author="Freya Holmér",license="[Copy embedded with permission.](https://twitter.com/FreyaHolmer/status/1530167901436649472)",class="full") %}/wiki/coordinate-systems/coordinate-systems.png{% end %}
<div style='height:0.5rem'></div>
{% info_notice() %}
**Authors Opinion:**
I recommend using a right-handed coordinate-system with Z-up or, if you prefer, Y-up.

- Blender, SketchUp and various Autodesk products use it.
- Z-up, so that a sheet of graph-paper represents the X/Y plane.
{% end %}

Also, keep in mind that the great majority of 2D renderers *and displays* available use a X-right + Y-*down* system, mainly due to western writing systems being oriented that way.

## Terminology

Now then, let's get to the various coordinate systems!

The order in which they are listed is *kinda important*, so try to keep it in mind. ;)

{% todo_notice() %} Add descriptive diagrams to all definitions. {% end %}

### Voxel/Sample Space
<img src="/favicon-32x32.png" width=32 style='float:right'></img>
The 'inner' coordinate system of an *individual voxel*.

### Object/Local/Chunk Space
<img src="/favicon-32x32.png" width=32 style='float:right'></img>
The local coordinate system of an individual object, such as an entity or a [chunk](/wiki/chunking).

### World/Scene Space
<img src="/favicon-32x32.png" width=32 style='float:right'></img>
The global coordinate system that is the entire scene. This is where almost all the (gameplay-related) math will occur.

### View/Camera Space
<img src="/favicon-32x32.png" width=32 style='float:right'></img>
The view of a camera into world space.

### (Homogeneous) Clip Space
<img src="/favicon-32x32.png" width=32 style='float:right'></img>
The camera space with a perspective- or orthographic-projection applied,
forming a prism/box called the *clip volume*.

- This is the space that we output to in a vertex shader.
  - i.e.: `gl_Position` is in clip-space.
- Coordinates are defined to be homogenous here.

### Normalized Device Coordinate(s) Space
<img src="/favicon-32x32.png" width=32 style='float:right'></img>
The clip space after perspective coordinate division, if applicable.

### Screen/Window/Framebuffer Space
<img src="/favicon-32x32.png" width=32 style='float:right'></img>
The space where whole-numbered coordinates correspond to pixels on a screen,
falling into a range of either...

1. `[(0,0), (WIDTH-1,HEIGHT-1)]`
2. `[(1,1), (WIDTH,HEIGHT)]`

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Coordinate_system)
- [Learn OpenGL: Coordinate Systems](https://learnopengl.com/Getting-started/Coordinate-Systems)
- [Freya Holmérs Cheat Sheet](https://twitter.com/FreyaHolmer/status/1325556229410861056)
- [WebGPU Specification](https://gpuweb.github.io/gpuweb/#coordinate-systems)
- [Setting Up a Proper Projection Matrix for Vulkan ](https://johannesugb.github.io/gpu-programming/setting-up-a-proper-vulkan-projection-matrix/)
- [Homogeneous Coordinates, Clip Space, and NDC | WebGPU](https://carmencincotti.com/2022-05-02/homogeneous-coordinates-clip-space-ndc/)
- [Why is clip space always referred to as "homogeneous clip space"?](https://gamedev.stackexchange.com/questions/65789/why-is-clip-space-always-referred-to-as-homogeneous-clip-space)
- [Explaining Homogeneous Coordinates & Projective Geometry](https://www.tomdalling.com/blog/modern-opengl/explaining-homogenous-coordinates-and-projective-geometry/)
- [When does the transition from clip space to screen coordinates happen?](https://stackoverflow.com/questions/21841598/when-does-the-transition-from-clip-space-to-screen-coordinates-happen/21841924#21841924)
- [Scratchapixel: The Perspective and Orthographic Projection Matrix](https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/projection-matrix-GPU-rendering-pipeline-clipping.html)
- [OpenGL Projection Matrix](http://www.songho.ca/opengl/gl_projectionmatrix.html)
- [Lecture 05: Spatial Transformations (CMU 15-462/662)](https://www.youtube.com/watch?v=QmFBHSJS0Gw&list=PL9_jI1bdZmz2emSh0UQ5iOdT2xRHFHL7E&index=7)
- [WebGPU: Point Rasterization](https://www.w3.org/TR/webgpu/#point-rasterization)
- [OpenGL `ARB_clip_control`](https://registry.khronos.org/OpenGL/extensions/ARB/ARB_clip_control.txt)
