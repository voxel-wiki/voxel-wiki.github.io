+++
title = "Rendering"
+++

There are many ways of rendering voxels, depending on the way they should look like, the underlying storage, performance considerations, general method used, etc. etc. it all depends on what ***you*** ultimatively want to *do*.

> **Note:** When we say that there are many ways of rendering voxels, we of course mean there's an *infinite amount* of ways. Seriously, we couldn't list them all, even if we tried! As such, this article will *never* be complete...

## General Rendering Methods

### Raytracing

*Walk trough voxels for every pixel on the screen.*

**In general:** Shooting rays out of a camera into a scene made of voxels, sampling color values for every voxel hit, it is possible to produce a high degree of photorealism and/or complex lighting effects, that are otherwise extremely hard to produce with rasterization.

### Rasterization

**In general:** Converting voxels into meshes, then using the rasterizer built into GPU's (or in software) to render them.

- Meshing
- Splatting

### Raycasting

*...?*
