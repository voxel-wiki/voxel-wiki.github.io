+++
title = "Rendering"
description = "How to turn voxels into pixels?"
+++

There are many ways of rendering voxels, depending on the way they should look like, the underlying storage, performance considerations, general method used, etc. etc. it all depends on what ***you*** ultimatively want to *do*.

> **Note:** When we say that there are many ways of rendering voxels, we of course mean there's an *infinite amount* of ways. Seriously, we couldn't list them all, even if we tried! As such, this article will *never* be complete...

## Graphics Programming APIs

When writing a program that renders something to the screen, you will usually want to make your code work across many platforms. For that, there are two main API's you might use: [OpenGL](/wiki/rendering/opengl) and [Vulkan](/wiki/rendering/vulkan).

- If you want to get started as fast as possible, with no regard to how modern graphics cards work, use OpenGL.
- If you want your program to be future-proof and as high-performing as possible, use Vulkan.

## General Rendering Methods

### Rasterization

**In general:** Converting voxels into meshes, then using the rasterizer built into GPU's (or in software) to render them.

- Meshing
- Splatting

### Raymarching

**In general:** Shooting rays out of a camera into a scene made of voxels, sampling color values for every voxel hit, it is possible to produce a high degree of photorealism and/or complex lighting effects, that are otherwise extremely hard to produce with rasterization.

## General Lighting Methods

**TODO**

- Global Illumination?
- Ambient occlusion?
- [Flood-Fill Lighting](https://web.archive.org/web/20210429192404/https://www.seedofandromeda.com/blogs/29-fast-flood-fill-lighting-in-a-blocky-voxel-game-pt-1)
- ...?

## General Culling Methods

Depending on the method you choose to render voxels, you might have to [cull the voxel data](/wiki/rendering/culling), so as to not overload your GPU with draw-calls and/or geometry.

- Distance Culling: Only use the voxels closest to the player.
- Frustum Culling: Only use the voxels within the players camera view.
- Cave Culling: Only use the voxels the player can heuristically see.
- Occlusion Culling: Only use the voxels the player can actually see.
