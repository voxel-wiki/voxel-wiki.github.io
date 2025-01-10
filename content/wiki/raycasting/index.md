+++
title = "3D Raycasting"
description = "Traveling through 3D grids in a straight line."
path = "/wiki/raycasting"
[taxonomies]
categories = ["algorithms"]
tags = ["algorithm", "math", "raycasting", "raytracing"]
[extra]
chapters = true
chapter_prev = false
chapter_next = {text = "Raytracing", link = "/wiki/raytracing"}
+++

The [Digital Differential Analyzer](https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm)) (`DDA`) algorithm,
adapted to 3D, is *exactly* the thing one needs to travel along a line (or a ray) through a grid of voxels.

<!-- more -->

{{ stub_notice() }}

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm))
- <span id=paper>Original Paper:</span> [A Fast Voxel Traversal Algorithm for Ray Tracing (1987)](http://www.cse.yorku.ca/~amana/research/grid.pdf)
- [Voxel Rendering Using Discrete Ray Tracing](https://castingrays.blogspot.com/2014/01/voxel-rendering-using-discrete-ray.html)
- [Cast ray to select block in voxel game](https://gamedev.stackexchange.com/a/49423)
- [Lode's Raycasting Tutorial](https://lodev.org/cgtutor/raycasting.html)
- Various Implementations:
  - For [`C`](https://webdocs.cs.ualberta.ca/~graphics/books/GraphicsGems/gemsiv/vox_traverse.c)
  - For [`C++`](https://gist.github.com/garymacindoe/895430c1e53a6e50cb35)
  - For [`C#`](https://web.archive.org/web/20121024081332/www.xnawiki.com/index.php?title=Voxel_traversal)
  - For [`Rust`](https://github.com/bitshifter/glam-rs/discussions/564)
  - For [`GLSL`](https://www.shadertoy.com/view/XddcWn):
    - [Branchless](https://www.shadertoy.com/view/4dX3zl)
    - [Branchless & Textured](https://www.shadertoy.com/view/7dK3D3)
    - [With Sub-Objects](https://www.shadertoy.com/view/7stXzn)
    - [Octree Variant](https://www.shadertoy.com/view/4sVfWw)
