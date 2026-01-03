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

## Extraction Algorithms

There are *many* surface extraction algorithms,
with most falling into one of roughly two-ish families...

**Smooth Voxels: Isosurfaces**[^swiftcoder]
- [Marching Cubes](https://web.archive.org/web/20040913130505/http://kucg.korea.ac.kr/seminar/2001/src/PA-01-16.pdf)
- [Extended Marching Cubes](https://web.archive.org/web/20081015145532/http://www.cse.ohio-state.edu/~wenger/publications/isomesh.pdf)
- [Dual Marching Cubes](https://www.cs.rice.edu/~jwarren/papers/dmc.pdf)
- [Cubical Marching Squares](https://www.csie.ntu.edu.tw/~cyy/publications/papers/Ho2005CMS.pdf)
- [Isosurfaces Over Simplicial Partitions of Multiresolution Grids](https://people.engr.tamu.edu/schaefer/research/iso_simplicial.pdf)
- [Dual-Contouring of Hermite Data](https://web.archive.org/web/20160310111623/http://www.frankpetterson.com/publications/dualcontour/dualcontour.pdf)
- [Manifold Dual Contouring](https://people.engr.tamu.edu/schaefer/research/dualsimp_tvcg.pdf)
- [Adaptive Skeleton Climbing](https://ttwong12.github.io/papers/asc/asc.html)
- [The Transvoxel Algorithm](https://transvoxel.org/)

**Discrete Voxels: Bloxels**
- Basic Method
- Baked Meshlets
- [Greedy Meshing](https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/)
- [Binary Greedy Meshing](https://github.com/cgerikj/binary-greedy-meshing)

## Performance Considerations

When rendering voxels using surface extraction, overall performance depends on
the combined efficiency of the **extraction** algorithm and **rasterization**
(vertex&thinsp;&&thinsp;fragment shader) stages, which in turn depend on *yet more* factors.

**Extraction** depends on:

- Amount of chunks, with any non-air voxels, in *range* of a camera.
- Total volume of voxels stored for each chunk.
- Non-air voxels per chunk, that are not covered/hidden by others.
- Access time of every voxel and its neighbours in a chunk.
- Complexity of extraction algorithm for a single voxel.

**Rasterization** depends on:

- The total amount of vertices/facelets in view of a camera,  
  even if they're *not* actually visible on screen <small>(outside NDC space)</small>.
- The data-size of each *individual* vertex/facelet,  
  due to memory bandwidth and caching limitations.
- Pixel surface area of any given triangle (underdraw/microtris).
- Any area of pixels where any geometry overlaps (overdraw).

---

{{ todo_notice(body="Explain further topics/factors?") }}

{{ todo_notice(body="Amount of geometry per mesh *vs* amount of meshes.") }}

{{ todo_notice(body="Reducing frequency of remeshing and bandwidth limits.") }}

{{ todo_notice(body="Offloading meshing to other threads and cloning/sharing of volume data.") }}

{{ todo_notice(body="Common performance optimizations and pitfalls.") }}

## See also

- [Vertex Packing](/wiki/vertex-packing)
- [Vertex Pulling](/wiki/vertex-pulling)
- [Vertex Pooling](/wiki/vertex-pooling)
<!-- - [Greedy Meshing](/wiki/greedy-meshing) -->

[^swiftcoder]: List of links fixed-up and copied from <https://swiftcoder.wordpress.com/planets/isosurface-extraction/>.
