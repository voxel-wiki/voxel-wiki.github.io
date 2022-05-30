+++
title = "Rendering: Culling"
description = "Limiting the amount of voxels rendered to manageable levels."
+++

## Introduction

In general, (visibility-) culling is the process of limiting the amount of things rendered
(both triangles and drawcalls) to manageable levels, so the GPU doesn't go up in flames.

So, here are ~6 kinds of culling, in no particular order:

1. [Back Face Culling:](/wiki/rendering/culling/back-face) Don't render what is facing away from the camera.
2. [Interior Culling:](/wiki/rendering/culling/interior) Don't render what is inside of objects.
3. [Distance Culling:](/wiki/rendering/culling/distance) Don't render what is too far away.
4. [Frustum Culling:](/wiki/rendering/culling/frustum) Don't render what falls outside the cameras view.
5. [Portal Culling:](/wiki/rendering/culling/frustum) Don't render what is in another room.
6. [Cluster Culling:](/wiki/rendering/culling/cluster) Don't render what is too small to see.
7. [Occlusion Culling:](/wiki/rendering/culling/occlusion) Don't render what is hidden.

Optimizing culling is generally done by creating *spatial hierarchies*,
whereby testing nodes on higher levels allows rejecting (or including)
large swathes of the hierarchy, reducing the amount of work to be done.

> **Note:**  
> Directly storing individual primitives/triangles in a spatial hierarchy is extremely inefficient,
> since the geometry must still be loaded/generated, sent to the GPU and be transformed.

## References

- [Learn OpenGL: Face Cullling](https://learnopengl.com/Advanced-OpenGL/Face-culling)
- [Learn OpenGL: Frustum Cullling](https://learnopengl.com/Guest-Articles/2021/Scene/Frustum-Culling)
- Paper: [Multiresolution structures for interactive visualization of very large 3D datasets (2008)](https://d-nb.info/997062789/34) by Federico Ponchio
