+++
title = "Surface Extraction"
description = "Turning voxels into geometry."
aliases = ["/wiki/meshing"]
[taxonomies]
categories = ["rendering"]
tags = ["rendering", "meshing"]
+++

**Surface extraction** (commonly called **meshing**), is the process of generating
a [mesh](https://en.wikipedia.org/wiki/Polygon_mesh) or point-cloud representing
*just* the reachable/visible surface of the volume, which can then be
[rasterized](https://en.wikipedia.org/wiki/Rasterisation) into visible pixels.

{{ stub_notice() }}

{{ todo_notice(body="Amount of geometry per mesh *vs* amount of meshes.") }}

{{ todo_notice(body="Reducing frequency of remeshing and bandwidth limits.") }}

{{ todo_notice(body="Offloading meshing to other threads and cloning volume data.") }}

{{ todo_notice(body="Performance optimizations and pitfalls.") }}

## Rasterization Performance

The performance of rasterizing a meshed volume,
mainly depends on the following factors:

- The amount of vertices/facelets in view of a camera,  
  even if they're *not* actually visible on screen.
- The data-size of each *individual* vertex/facelet,  
  due to memory bandwidth and caching limitations.
- The area of pixels where any geometry overlaps: *overdraw*.

{{ todo_notice(body="Explain further?") }}

## References

- <https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/>
- <https://swiftcoder.wordpress.com/planets/isosurface-extraction/>
- <https://github.com/cgerikj/binary-greedy-meshing>
