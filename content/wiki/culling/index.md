+++
title = "Culling"
description = "Limiting the amount of voxels rendered to manageable levels."
[taxonomies]
categories = ["culling"]
tags = ["rendering", "culling", "optimization"]
+++

In general, (visibility-) culling is the process of limiting the amount of things rendered
(both geometry and drawcalls) to manageable levels, so the GPU doesn't go up in flames.

<!-- more -->

So, here are ~6 kinds of culling, in no particular order:

1. [Back Face Culling](/wiki/backface-culling): Don't render what is facing away from the camera.
2. [Interior Culling](/wiki/interior-culling): Don't render what is inside of objects.
3. [Distance Culling](/wiki/distance-culling): Don't render what is too far away.
4. [Frustum Culling](/wiki/frustum-culling): Don't render what falls outside the cameras view.
5. [Portal Culling](/wiki/portal-culling): Don't render what is in another room.
6. [Cluster Culling](/wiki/cluster-culling): Don't render what is too small to see.
7. [Occlusion Culling](/wiki/occlusion-culling): Don't render what is hidden.

Optimizing culling is generally done by creating *spatial hierarchies*,
whereby testing nodes on higher levels allows rejecting (or including)
large swathes of the hierarchy, reducing the amount of work to be done.

> **Note:**  
> Directly storing individual primitives/triangles in a spatial hierarchy is extremely inefficient,
> since the geometry must still be loaded/generated, sent to the GPU and be transformed.

## References

- [Learn OpenGL: Face Culling](https://learnopengl.com/Advanced-OpenGL/Face-culling)
- [Learn OpenGL: Frustum Culling](https://learnopengl.com/Guest-Articles/2021/Scene/Frustum-Culling)
- [Geometry Culling in 3D Engines](https://archive.gamedev.net/archive/reference/programming/features/culling/index.html)
- [BSP Visibility Optimization](https://developer.valvesoftware.com/wiki/Visibility_optimization)
- Paper: [Multiresolution structures for interactive visualization of very large 3D datasets (2008)](https://d-nb.info/997062789/34) by Federico Ponchio
